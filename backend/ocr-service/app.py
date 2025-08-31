from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
import uvicorn
import os
from services.ocr_processor import OCRProcessor
from utils.image_utils import download_image, validate_image
import tempfile
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="MindVault OCR Service",
    description="Text extraction service for MindVault application",
    version="1.0.0"
)

# CORS middleware for Node.js backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Initialize OCR processor
ocr_processor = OCRProcessor()

# Request models
class ImageUrlRequest(BaseModel):
    image_url: HttpUrl

class ImageTextResponse(BaseModel):
    text: str
    confidence: float = 0.0
    language: str = "en"

@app.get("/")
async def health_check():
    """Health check endpoint"""
    return {
        "service": "MindVault OCR Service",
        "status": "running",
        "version": "1.0.0"
    }

@app.post("/extract-by-url", response_model=ImageTextResponse)
async def extract_text_from_url(request: ImageUrlRequest):
    """
    Extract text from image URL
    Expected by Node.js: POST /extract-by-url with {image_url: "..."}
    Returns: {text: "extracted text", confidence: float, language: "en"}
    """
    try:
        image_url = str(request.image_url)
        logger.info(f"Processing OCR for URL: {image_url}")
        
        # Download image to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
            temp_path = temp_file.name
            
        try:
            # Download and validate image
            await download_image(image_url, temp_path)
            validate_image(temp_path)
            
            # Extract text using OCR
            result = ocr_processor.extract_text(temp_path)
            
            logger.info(f"OCR completed. Text length: {len(result.get('text', ''))}")
            
            return ImageTextResponse(
                text=result.get('text', ''),
                confidence=result.get('confidence', 0.0),
                language=result.get('language', 'en')
            )
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_path):
                os.unlink(temp_path)
                
    except Exception as e:
        logger.error(f"OCR processing failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"OCR processing failed: {str(e)}"
        )

@app.post("/extract-by-file")
async def extract_text_from_file(file: bytes):
    """
    Extract text from uploaded file (for future use)
    """
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
            temp_file.write(file)
            temp_path = temp_file.name
            
        try:
            validate_image(temp_path)
            result = ocr_processor.extract_text(temp_path)
            
            return ImageTextResponse(
                text=result.get('text', ''),
                confidence=result.get('confidence', 0.0),
                language=result.get('language', 'en')
            )
            
        finally:
            if os.path.exists(temp_path):
                os.unlink(temp_path)
                
    except Exception as e:
        logger.error(f"File OCR processing failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"File OCR processing failed: {str(e)}"
        )

if __name__ == "__main__":
    port = int(os.getenv("OCR_PORT", 8000))
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )