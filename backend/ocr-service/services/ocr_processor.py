import pytesseract
# import easyocr
import cv2
import numpy as np
from PIL import Image
import os
import logging
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)

class OCRProcessor:
    """
    Optimized OCR processor
    Using Tesseract only for Render free tier compatibility
    """
    
    # _easyocr_reader = None  # cache EasyOCR globally

    def __init__(self):
        # Set Tesseract path for Windows
        tesseract_cmd = os.getenv('TESSERACT_CMD')
        if tesseract_cmd and os.path.exists(tesseract_cmd):
            pytesseract.pytesseract.tesseract_cmd = tesseract_cmd
        
        self.tesseract_available = self._check_tesseract()

        # Disabled for Render free tier (causes OOM)
        # self._init_easyocr()
    
    def _check_tesseract(self) -> bool:
        """Check if Tesseract is available"""
        try:
            pytesseract.get_tesseract_version()
            logger.info("Tesseract OCR available")
            return True
        except Exception as e:
            logger.warning(f"Tesseract not available: {e}")
            return False
    
    # Disabled EasyOCR initialization
    """
    def _init_easyocr(self):
        try:
            if OCRProcessor._easyocr_reader is None:
                OCRProcessor._easyocr_reader = easyocr.Reader(['en'], gpu=False)
                logger.info("EasyOCR initialized successfully")
            self.easyocr_reader = OCRProcessor._easyocr_reader
        except Exception as e:
            logger.warning(f"EasyOCR initialization failed: {e}")
            self.easyocr_reader = None
    """
    
    def _resize_if_needed(self, image_path: str) -> str:
        """Resize very large images for speed"""
        try:
            img = cv2.imread(image_path)
            if img is None:
                return image_path

            h, w = img.shape[:2]

            if w > 1600:
                scale = 1600 / w
                resized = cv2.resize(
                    img,
                    (int(w * scale), int(h * scale))
                )

                resized_path = image_path.replace('.jpg', '_resized.jpg')
                cv2.imwrite(resized_path, resized)

                return resized_path

            return image_path

        except Exception as e:
            logger.warning(f"Resize failed: {e}")
            return image_path

    def preprocess_image(self, image_path: str, enable=True) -> str:
        """
        Preprocess image for better OCR results
        """
        if not enable:
            return image_path

        try:
            image = cv2.imread(image_path)

            if image is None:
                raise ValueError("Could not load image")
            
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

            denoised = cv2.medianBlur(gray, 5)

            _, thresh = cv2.threshold(
                denoised,
                0,
                255,
                cv2.THRESH_BINARY + cv2.THRESH_OTSU
            )
            
            processed_path = image_path.replace('.jpg', '_processed.jpg')

            cv2.imwrite(processed_path, thresh)

            return processed_path
            
        except Exception as e:
            logger.warning(f"Image preprocessing failed: {e}")
            return image_path
    
    def extract_with_tesseract(
        self,
        image_path: str,
        preprocess=True
    ) -> Dict:

        """Extract text using Tesseract OCR"""

        if not self.tesseract_available:
            raise Exception("Tesseract not available")
        
        try:
            resized_path = self._resize_if_needed(image_path)

            processed_path = self.preprocess_image(
                resized_path,
                enable=preprocess
            )
            
            custom_config = (
                r'--oem 3 --psm 6 '
                r'-c tessedit_char_whitelist='
                r'0123456789'
                r'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                r'abcdefghijklmnopqrstuvwxyz'
                r'.,!?:;()[]{}"\'-= '
            )
            
            text = pytesseract.image_to_string(
                Image.open(processed_path),
                config=custom_config
            ).strip()
            
            data = pytesseract.image_to_data(
                Image.open(processed_path),
                output_type=pytesseract.Output.DICT
            )
            
            confidences = [
                int(conf)
                for conf in data['conf']
                if int(conf) > 0
            ]

            avg_confidence = (
                sum(confidences) / len(confidences)
                if confidences else 0
            )
            
            # cleanup
            for p in [processed_path, resized_path]:
                if p != image_path and os.path.exists(p):
                    os.unlink(p)
            
            return {
                'text': text,
                'confidence': avg_confidence / 100.0,
                'language': 'en',
                'engine': 'tesseract'
            }
            
        except Exception as e:
            logger.error(f"Tesseract OCR failed: {e}")
            raise

    # Disabled EasyOCR (high RAM usage on Render free tier)
    """
    def extract_with_easyocr(self, image_path: str) -> Dict:
        ...
    """
    
    def extract_text(self, image_path: str) -> Dict:
        """
        Extract text using Tesseract OCR only
        """

        if self.tesseract_available:
            try:
                result = self.extract_with_tesseract(image_path)

                logger.info(
                    f"Tesseract result: "
                    f"{len(result['text'])} chars, "
                    f"conf: {result['confidence']:.2f}"
                )

                return result

            except Exception as e:
                logger.warning(f"Tesseract failed: {e}")

        return {
            'text': '',
            'confidence': 0.0,
            'language': 'en',
            'engine': 'none',
            'error': 'Tesseract OCR failed'
        }

    # Disabled because multiple OCR engines removed
    """
    def _select_best_result(self, results: List[Dict]) -> Dict:
        ...
    """