import httpx
import os
from PIL import Image
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# Supported image formats
SUPPORTED_FORMATS = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

async def download_image(url: str, output_path: str, timeout: int = 30) -> None:
    """
    Download image from URL to local path
    """
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            logger.info(f"Downloading image from: {url}")
            
            response = await client.get(url)
            response.raise_for_status()
            
            # Check content type
            content_type = response.headers.get('content-type', '')
            if not content_type.startswith('image/'):
                raise ValueError(f"URL does not point to an image. Content-Type: {content_type}")
            
            # Check file size
            content_length = response.headers.get('content-length')
            if content_length and int(content_length) > MAX_FILE_SIZE:
                raise ValueError(f"Image too large: {content_length} bytes (max: {MAX_FILE_SIZE})")
            
            # Write to file
            with open(output_path, 'wb') as f:
                f.write(response.content)
            
            logger.info(f"Image downloaded successfully: {len(response.content)} bytes")
            
    except httpx.TimeoutException:
        raise ValueError("Image download timed out")
    except httpx.HTTPStatusError as e:
        raise ValueError(f"HTTP error downloading image: {e.response.status_code}")
    except Exception as e:
        raise ValueError(f"Failed to download image: {str(e)}")

def validate_image(image_path: str) -> None:
    """
    Validate image file format and integrity
    """
    if not os.path.exists(image_path):
        raise ValueError("Image file does not exist")
    
    # Check file size
    file_size = os.path.getsize(image_path)
    if file_size == 0:
        raise ValueError("Image file is empty")
    
    if file_size > MAX_FILE_SIZE:
        raise ValueError(f"Image file too large: {file_size} bytes")
    
    # Check file extension
    _, ext = os.path.splitext(image_path.lower())
    if ext not in SUPPORTED_FORMATS:
        raise ValueError(f"Unsupported image format: {ext}")
    
    # Validate image can be opened
    try:
        with Image.open(image_path) as img:
            img.verify()  # Verify image integrity
        
        # Reopen for size check (verify() can only be called once)
        with Image.open(image_path) as img:
            width, height = img.size
            if width < 10 or height < 10:
                raise ValueError("Image too small for OCR processing")
            
            if width > 5000 or height > 5000:
                logger.warning(f"Large image detected: {width}x{height}. OCR might be slow.")
        
        logger.info(f"Image validated: {width}x{height}, {file_size} bytes")
        
    except Exception as e:
        raise ValueError(f"Invalid image file: {str(e)}")

def get_image_info(image_path: str) -> dict:
    """
    Get image metadata
    """
    try:
        with Image.open(image_path) as img:
            return {
                'format': img.format,
                'mode': img.mode,
                'size': img.size,
                'width': img.width,
                'height': img.height
            }
    except Exception as e:
        logger.error(f"Failed to get image info: {e}")
        return {}