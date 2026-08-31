#!/usr/bin/env python3
"""
PDF to WebP Converter Script
Converts PDF files to WebP images for menu viewing website.

Requirements:
- pip install pymupdf Pillow

Usage:
    python tools/convert_pdf.py
    Or from tools directory: python convert_pdf.py
"""

import os
import sys
import json
import re
import fitz  # PyMuPDF
from PIL import Image

# Set UTF-8 encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Configuration
OUTPUT_WIDTH = 1400  # Width in pixels
WEBP_QUALITY = 85    # WebP quality (0-100)

# Get the script directory and project root
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

PDF_DIR = os.path.join(PROJECT_ROOT, 'pdf')      # Source PDF directory
MENUS_DIR = os.path.join(PROJECT_ROOT, 'menus')  # Output directory
MENUS_JSON = os.path.join(PROJECT_ROOT, 'menus.json')  # Menu data file

def sanitize_filename(filename):
    """Convert filename to URL-safe format, preserving Vietnamese characters."""
    # Remove .pdf extension
    name = filename.replace('.pdf', '').replace('.PDF', '')
    
    # Convert to lowercase
    name = name.lower()
    
    # Replace spaces and special characters with hyphens
    name = re.sub(r'[^\w\s-]', '', name)  # Remove special chars except word, space, hyphen
    name = re.sub(r'[-\s]+', '-', name)   # Replace spaces and multiple hyphens with single hyphen
    
    # Remove leading/trailing hyphens
    name = name.strip('-')
    
    return name

def format_page_number(page_num):
    """Format page number with leading zeros (01, 02, etc.)"""
    return str(page_num).zfill(2)

def convert_pdf_to_webp(pdf_path, output_dir, menu_name):
    """Convert a PDF file to WebP images using PyMuPDF."""
    print(f"Converting {pdf_path}...")
    
    try:
        # Open PDF using PyMuPDF
        pdf_document = fitz.open(pdf_path)
        
        # Create output directory
        os.makedirs(output_dir, exist_ok=True)
        
        # Convert each page to WebP
        page_count = pdf_document.page_count
        for i in range(page_count):
            page = pdf_document[i]
            
            # Get page dimensions
            rect = page.rect
            width = int(rect.width)
            height = int(rect.height)
            
            # Calculate zoom to achieve desired output width
            zoom = OUTPUT_WIDTH / width
            matrix = fitz.Matrix(zoom, zoom)
            
            # Render page to image
            pix = page.get_pixmap(matrix=matrix)
            
            # Convert to PIL Image
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            
            # Save page image
            page_filename = format_page_number(i + 1) + '.webp'
            page_path = os.path.join(output_dir, page_filename)
            img.save(page_path, 'WEBP', quality=WEBP_QUALITY)
            print(f"  Created: {page_filename}")
            
            # Cleanup pixmap
            pix = None
        
        # Create cover from first page
        cover_path = os.path.join(output_dir, 'cover.webp')
        if page_count > 0:
            page = pdf_document[0]
            rect = page.rect
            width = int(rect.width)
            height = int(rect.height)
            zoom = OUTPUT_WIDTH / width
            matrix = fitz.Matrix(zoom, zoom)
            pix = page.get_pixmap(matrix=matrix)
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            img.save(cover_path, 'WEBP', quality=WEBP_QUALITY)
            print(f"  Created: cover.webp")
            pix = None
        
        # Close PDF document
        pdf_document.close()
        
        return page_count
        
    except Exception as e:
        print(f"Error converting {pdf_path}: {e}")
        return 0

def update_menus_json(menus_json_path, new_menus):
    """Update menus.json with new menu data."""
    existing_menus = []
    
    # Load existing menus if file exists
    if os.path.exists(menus_json_path):
        try:
            with open(menus_json_path, 'r', encoding='utf-8') as f:
                existing_menus = json.load(f)
        except Exception as e:
            print(f"Error reading existing menus.json: {e}")
            existing_menus = []
    
    # Create a set of existing menu IDs
    existing_ids = {menu['id'] for menu in existing_menus}
    
    # Add new menus that don't already exist
    added_count = 0
    for new_menu in new_menus:
        if new_menu['id'] not in existing_ids:
            existing_menus.append(new_menu)
            added_count += 1
            print(f"Added new menu: {new_menu['name']}")
        else:
            print(f"Menu already exists: {new_menu['name']}")
    
    # Sort menus by ID
    existing_menus.sort(key=lambda x: x['id'])
    
    # Write updated menus.json with UTF-8 BOM for better compatibility
    try:
        with open(menus_json_path, 'w', encoding='utf-8-sig') as f:
            json.dump(existing_menus, f, ensure_ascii=False, indent=4)
        print(f"Updated {menus_json_path} ({added_count} new menus added)")
    except Exception as e:
        print(f"Error writing menus.json: {e}")

def extract_menu_name(filename):
    """Extract a nice menu name from filename, preserving Vietnamese characters."""
    # Remove .pdf extension
    name = filename.replace('.pdf', '').replace('.PDF', '')
    
    # Replace underscores with spaces
    name = name.replace('_', ' ')
    
    # Don't replace hyphens with spaces as they might be part of the name (e.g., "BF Quốc Dân - 319K")
    # Only replace hyphens that are between word characters (not spaces)
    name = re.sub(r'(\w)-(\w)', r'\1 - \2', name)
    
    # Remove extra spaces
    name = re.sub(r'\s+', ' ', name).strip()
    
    return name

def main():
    """Main conversion function."""
    print("PDF to WebP Converter")
    print("=" * 50)
    
    # Check if PDF directory exists
    if not os.path.exists(PDF_DIR):
        print(f"Error: PDF directory '{PDF_DIR}' not found.")
        print(f"Please create a '{PDF_DIR}' directory and add your PDF files.")
        print(f"Expected location: {PDF_DIR}")
        return
    
    # Get all PDF files
    pdf_files = [f for f in os.listdir(PDF_DIR) if f.lower().endswith('.pdf')]
    
    if not pdf_files:
        print(f"No PDF files found in '{PDF_DIR}' directory.")
        print(f"Expected location: {PDF_DIR}")
        return
    
    print(f"Found {len(pdf_files)} PDF file(s) in: {PDF_DIR}")
    print()
    
    # Process each PDF
    new_menus = []
    for pdf_file in pdf_files:
        pdf_path = os.path.join(PDF_DIR, pdf_file)
        
        # Generate menu ID from filename
        menu_id = sanitize_filename(pdf_file)
        
        # Generate menu name
        menu_name = extract_menu_name(pdf_file)
        
        # Create output directory
        output_dir = os.path.join(MENUS_DIR, menu_id)
        
        # Convert PDF
        page_count = convert_pdf_to_webp(pdf_path, output_dir, menu_name)
        
        if page_count > 0:
            # Add to new menus list
            menu_data = {
                'id': menu_id,
                'name': menu_name,
                'folder': f'menus/{menu_id}',
                'cover': f'menus/{menu_id}/cover.webp',
                'pages': page_count
            }
            new_menus.append(menu_data)
            print(f"Successfully converted: {menu_name} ({page_count} pages)")
        else:
            print(f"Failed to convert: {pdf_file}")
        
        print()
    
    # Update menus.json
    if new_menus:
        update_menus_json(MENUS_JSON, new_menus)
    
    print("=" * 50)
    print("Conversion complete!")

if __name__ == '__main__':
    main()
