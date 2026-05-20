import pytesseract
import easyocr
import cv2
import numpy as np
from PIL import Image
import os
import logging
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)

class OCRProcessor:
    """
    Optimized multi-engine OCR processor
    Fast path: Tesseract first, fallback to EasyOCR
    """
    
    _easyocr_reader = None  # cache EasyOCR globally

    def __init__(self):
        # Set Tesseract path for Windows
        tesseract_cmd = os.getenv('TESSERACT_CMD')
        if tesseract_cmd and os.path.exists(tesseract_cmd):
            pytesseract.pytesseract.tesseract_cmd = tesseract_cmd
        
        self.tesseract_available = self._check_tesseract()
        self._init_easyocr()
    
    def _check_tesseract(self) -> bool:
        """Check if Tesseract is available"""
        try:
            pytesseract.get_tesseract_version()
            logger.info("Tesseract OCR available")
            return True
        except Exception as e:
            logger.warning(f"Tesseract not available: {e}")
            return False
    
    def _init_easyocr(self):
        """Initialize EasyOCR once globally"""
        try:
            if OCRProcessor._easyocr_reader is None:
                OCRProcessor._easyocr_reader = easyocr.Reader(['en'], gpu=False)
                logger.info("EasyOCR initialized successfully")
            self.easyocr_reader = OCRProcessor._easyocr_reader
        except Exception as e:
            logger.warning(f"EasyOCR initialization failed: {e}")
            self.easyocr_reader = None
    
    def _resize_if_needed(self, image_path: str) -> str:
        """Resize very large images for speed"""
        try:
            img = cv2.imread(image_path)
            if img is None:
                return image_path
            h, w = img.shape[:2]
            if w > 1600:
                scale = 1600 / w
                resized = cv2.resize(img, (int(w*scale), int(h*scale)))
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
        Can be skipped for already clean images
        """
        if not enable:
            return image_path
        try:
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError("Could not load image")
            
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            denoised = cv2.medianBlur(gray, 5)
            _, thresh = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            
            processed_path = image_path.replace('.jpg', '_processed.jpg')
            cv2.imwrite(processed_path, thresh)
            return processed_path
            
        except Exception as e:
            logger.warning(f"Image preprocessing failed: {e}")
            return image_path
    
    def extract_with_tesseract(self, image_path: str, preprocess=True) -> Dict:
        """Extract text using Tesseract OCR"""
        if not self.tesseract_available:
            raise Exception("Tesseract not available")
        
        try:
            resized_path = self._resize_if_needed(image_path)
            processed_path = self.preprocess_image(resized_path, enable=preprocess)
            
            custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,!?:;()[]{}"\'-= '
            
            text = pytesseract.image_to_string(
                Image.open(processed_path), 
                config=custom_config
            ).strip()
            
            data = pytesseract.image_to_data(
                Image.open(processed_path), 
                output_type=pytesseract.Output.DICT
            )
            
            confidences = [int(conf) for conf in data['conf'] if int(conf) > 0]
            avg_confidence = sum(confidences) / len(confidences) if confidences else 0
            
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
    
    def extract_with_easyocr(self, image_path: str) -> Dict:
        """Extract text using EasyOCR"""
        if self.easyocr_reader is None:
            raise Exception("EasyOCR not available")
        
        try:
            resized_path = self._resize_if_needed(image_path)
            results = self.easyocr_reader.readtext(resized_path, paragraph=True)
            
            text_parts = []
            confidences = []
            
            for (_, text, conf) in results:
                if conf > 0.1:
                    text_parts.append(text)
                    confidences.append(conf)
            
            combined_text = ' '.join(text_parts)
            avg_confidence = sum(confidences) / len(confidences) if confidences else 0
            
            if resized_path != image_path and os.path.exists(resized_path):
                os.unlink(resized_path)
            
            return {
                'text': combined_text,
                'confidence': avg_confidence,
                'language': 'en',
                'engine': 'easyocr'
            }
            
        except Exception as e:
            logger.error(f"EasyOCR failed: {e}")
            raise
    
    def extract_text(self, image_path: str) -> Dict:
        """
        Extract text using fast path (Tesseract), fallback to EasyOCR
        """
        results = []

        # --- Try Tesseract first ---
        if self.tesseract_available:
            try:
                tesseract_result = self.extract_with_tesseract(image_path)
                if tesseract_result['confidence'] > 0.6 and len(tesseract_result['text']) > 5:
                    return tesseract_result  # fast return
                results.append(tesseract_result)
                logger.info(f"Tesseract result: {len(tesseract_result['text'])} chars, conf: {tesseract_result['confidence']:.2f}")
            except Exception as e:
                logger.warning(f"Tesseract failed: {e}")
        
        # --- Fallback EasyOCR ---
        if self.easyocr_reader:
            try:
                easyocr_result = self.extract_with_easyocr(image_path)
                results.append(easyocr_result)
                logger.info(f"EasyOCR result: {len(easyocr_result['text'])} chars, conf: {easyocr_result['confidence']:.2f}")
            except Exception as e:
                logger.warning(f"EasyOCR failed: {e}")
        
        if not results:
            return {
                'text': '',
                'confidence': 0.0,
                'language': 'en',
                'engine': 'none',
                'error': 'No OCR engines available'
            }
        
        return self._select_best_result(results)
    
    def _select_best_result(self, results: List[Dict]) -> Dict:
        """Pick best result based on confidence & length"""
        if len(results) == 1:
            return results[0]
        
        scored_results = []
        for result in results:
            text_length = len(result['text'].strip())
            confidence = result['confidence']
            length_factor = min(1.0, text_length / 10.0) if text_length < 50 else 1.0
            if confidence > 0.9:
                length_factor = max(length_factor, 0.8)
            score = confidence * length_factor
            scored_results.append((score, result))
        
        scored_results.sort(key=lambda x: x[0], reverse=True)
        return scored_results[0][1]
