"""
PDF Parser - Extract text from PDF files using PyMuPDF
"""
const API_URL = import.meta.env.VITE_API_URL;
import fitz  # PyMuPDF
import re
from typing import Dict
import logging

logger = logging.getLogger(__name__)


def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from PDF using PyMuPDF with enhanced capabilities.
    Returns clean, structured text with better formatting preservation.
    """
    text = ""
    try:
        # Open PDF with PyMuPDF
        doc = fitz.open(file_path)
        
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            
            # Get text with better formatting
            page_text = page.get_text("text")
            
            # Clean up the text
            cleaned_text = clean_pdf_text(page_text)
            
            text += cleaned_text + "\n"
        
        doc.close()
        
        logger.info(f"Successfully extracted text from PDF: {file_path}")
        return text.strip()
        
    except Exception as e:
        logger.error(f"Error reading PDF {file_path}: {e}")
        return ""


def clean_pdf_text(text: str) -> str:
    """
    Clean and normalize PDF text for better parsing.
    """
    # Remove excessive whitespace
    text = re.sub(r'\s+', ' ', text)
    
    # Fix common PDF extraction issues
    text = re.sub(r'([a-z])([A-Z])', r'\1 \2', text)  # Add space between camelCase
    text = re.sub(r'([.!?])([A-Z])', r'\1 \2', text)  # Add space after punctuation
    
    # Remove page numbers and headers/footers
    text = re.sub(r'\b\d+\s*$', '', text, flags=re.MULTILINE)  # Page numbers at end of lines
    
    # Clean up bullet points and lists
    text = re.sub(r'[•·▪▫◦‣⁃]\s*', '• ', text)  # Standardize bullet points
    text = re.sub(r'^\s*[-*+]\s*', '• ', text, flags=re.MULTILINE)  # Convert dashes to bullets
    
    return text.strip()


def extract_text_with_layout(file_path: str) -> Dict:
    """
    Extract text with layout information for better section detection.
    Returns both text and layout data.
    """
    try:
        doc = fitz.open(file_path)
        layout_data = {
            'text': '',
            'sections': [],
            'font_sizes': [],
            'positions': []
        }
        
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            
            # Get text blocks with position and font info
            blocks = page.get_text("dict")
            
            for block in blocks.get("blocks", []):
                if "lines" in block:
                    for line in block["lines"]:
                        for span in line["spans"]:
                            text = span["text"].strip()
                            if text:
                                layout_data['text'] += text + " "
                                layout_data['sections'].append({
                                    'text': text,
                                    'font_size': span["size"],
                                    'font_name': span["font"],
                                    'bbox': span["bbox"],
                                    'page': page_num
                                })
                                layout_data['font_sizes'].append(span["size"])
                                layout_data['positions'].append(span["bbox"])
            
            layout_data['text'] += "\n"
        
        doc.close()
        return layout_data
        
    except Exception as e:
        logger.error(f"Error extracting layout from PDF {file_path}: {e}")
        return {'text': '', 'sections': [], 'font_sizes': [], 'positions': []}


def get_pdf_metadata(file_path: str) -> Dict:
    """
    Extract PDF metadata for additional context.
    """
    try:
        doc = fitz.open(file_path)
        metadata = doc.metadata
        page_count = len(doc)
        doc.close()
        
        return {
            'title': metadata.get('title', ''),
            'author': metadata.get('author', ''),
            'subject': metadata.get('subject', ''),
            'creator': metadata.get('creator', ''),
            'producer': metadata.get('producer', ''),
            'pages': page_count
        }
    except Exception as e:
        logger.error(f"Error extracting PDF metadata: {e}")
        return {}
