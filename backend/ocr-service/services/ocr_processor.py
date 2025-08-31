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
    Multi-engine OCR processor with fallback support
    Supports: Tesseract, EasyOCR, and cloud services
    """
    
    def __init__(self):
        # Set Tesseract path for Windows
        tesseract_cmd = os.getenv('TESSERACT_CMD')
        if tesseract_cmd and os.path.exists(tesseract_cmd):
            pytesseract.pytesseract.tesseract_cmd = tesseract_cmd
        
        self.tesseract_available = self._check_tesseract()
        self.easyocr_reader = None
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
        """Initialize EasyOCR reader"""
        try:
            self.easyocr_reader = easyocr.Reader(['en'], gpu=False)
            logger.info("EasyOCR initialized successfully")
        except Exception as e:
            logger.warning(f"EasyOCR initialization failed: {e}")
            self.easyocr_reader = None
    
    def preprocess_image(self, image_path: str) -> str:
        """
        Preprocess image for better OCR results
        Returns path to processed image
        """
        try:
            # Read image
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError("Could not load image")
            
            # Convert to grayscale
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Apply noise removal
            denoised = cv2.medianBlur(gray, 5)
            
            # Apply thresholding to get binary image
            _, thresh = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            
            # Save processed image
            processed_path = image_path.replace('.jpg', '_processed.jpg')
            cv2.imwrite(processed_path, thresh)
            
            return processed_path
            
        except Exception as e:
            logger.warning(f"Image preprocessing failed: {e}")
            return image_path  # Return original if preprocessing fails
    
    def extract_with_tesseract(self, image_path: str) -> Dict:
        """Extract text using Tesseract OCR"""
        if not self.tesseract_available:
            raise Exception("Tesseract not available")
        
        try:
            # Preprocess image
            processed_path = self.preprocess_image(image_path)
            
            # Configure Tesseract
            custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,!?:;()[]{}"\'-= '
            
            # Extract text
            text = pytesseract.image_to_string(
                Image.open(processed_path), 
                config=custom_config
            ).strip()
            
            # Get confidence data
            data = pytesseract.image_to_data(
                Image.open(processed_path), 
                output_type=pytesseract.Output.DICT
            )
            
            # Calculate average confidence
            confidences = [int(conf) for conf in data['conf'] if int(conf) > 0]
            avg_confidence = sum(confidences) / len(confidences) if confidences else 0
            
            # Clean up processed image
            if processed_path != image_path and os.path.exists(processed_path):
                os.unlink(processed_path)
            
            return {
                'text': text,
                'confidence': avg_confidence / 100.0,  # Convert to 0-1 range
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
            # Extract text
            results = self.easyocr_reader.readtext(image_path, paragraph=True)
            
            # Combine all text and calculate average confidence
            text_parts = []
            confidences = []
            
            for (bbox, text, conf) in results:
                if conf > 0.1:  # Filter low confidence results
                    text_parts.append(text)
                    confidences.append(conf)
            
            combined_text = ' '.join(text_parts)
            avg_confidence = sum(confidences) / len(confidences) if confidences else 0
            
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
        Extract text using available OCR engines with fallback
        Returns best result based on confidence and text length
        """
        results = []
        
        # Try Tesseract first (usually more accurate for clear text)
        if self.tesseract_available:
            try:
                tesseract_result = self.extract_with_tesseract(image_path)
                results.append(tesseract_result)
                logger.info(f"Tesseract result: {len(tesseract_result['text'])} chars, confidence: {tesseract_result['confidence']:.2f}")
            except Exception as e:
                logger.warning(f"Tesseract failed: {e}")
        
        # Try EasyOCR as fallback or alternative
        if self.easyocr_reader:
            try:
                easyocr_result = self.extract_with_easyocr(image_path)
                results.append(easyocr_result)
                logger.info(f"EasyOCR result: {len(easyocr_result['text'])} chars, confidence: {easyocr_result['confidence']:.2f}")
            except Exception as e:
                logger.warning(f"EasyOCR failed: {e}")
        
        if not results:
            # No engines available
            return {
                'text': '',
                'confidence': 0.0,
                'language': 'en',
                'engine': 'none',
                'error': 'No OCR engines available'
            }
        
        # Select best result
        best_result = self._select_best_result(results)
        logger.info(f"Selected best result from {best_result['engine']}")
        
        return best_result
    
    def _select_best_result(self, results: List[Dict]) -> Dict:
        """
        Select best OCR result based on confidence and text length
        """
        if len(results) == 1:
            return results[0]
        
        # Score each result (confidence * text_length_factor)
        scored_results = []
        for result in results:
            text_length = len(result['text'].strip())
            confidence = result['confidence']
            
            # Penalize very short results unless confidence is very high
            length_factor = min(1.0, text_length / 10.0) if text_length < 50 else 1.0
            if confidence > 0.9:
                length_factor = max(length_factor, 0.8)
            
            score = confidence * length_factor
            scored_results.append((score, result))
        
        # Return highest scoring result
        scored_results.sort(key=lambda x: x[0], reverse=True)
        return scored_results[0][1]