# Script to create placeholder WebP images for demo
from PIL import Image, ImageDraw, ImageFont
import os

def create_placeholder(width, height, text, color, output_path):
    # Create image with solid color
    img = Image.new('RGB', (width, height), color)
    draw = ImageDraw.Draw(img)
    
    # Add text
    try:
        # Try to use a default font
        font = ImageFont.truetype("arial.ttf", 24)
    except:
        # Fall back to default font
        font = ImageFont.load_default()
    
    # Calculate text position (centered)
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    
    x = (width - text_width) // 2
    y = (height - text_height) // 2
    
    # Draw text
    draw.text((x, y), text, fill='white', font=font)
    
    # Save as WebP
    img.save(output_path, 'WEBP', quality=85)
    print(f"Created: {output_path}")

# Create placeholders for bf-quoc-dan-319k
os.makedirs('menus/bf-quoc-dan-319k', exist_ok=True)
create_placeholder(800, 450, "BF Quốc Dân - 319K - Cover", "#667eea", "menus/bf-quoc-dan-319k/cover.webp")
create_placeholder(800, 1131, "BF Quốc Dân - 319K - Trang 1", "#ffffff", "menus/bf-quoc-dan-319k/01.webp")
create_placeholder(800, 1131, "BF Quốc Dân - 319K - Trang 2", "#ffffff", "menus/bf-quoc-dan-319k/02.webp")

# Create placeholders for menu-001
os.makedirs('menus/menu-001', exist_ok=True)
create_placeholder(800, 450, "Menu Hải Sản - Cover", "#764ba2", "menus/menu-001/cover.webp")
create_placeholder(800, 1131, "Menu Hải Sản - Trang 1", "#ffffff", "menus/menu-001/01.webp")
create_placeholder(800, 1131, "Menu Hải Sản - Trang 2", "#ffffff", "menus/menu-001/02.webp")
create_placeholder(800, 1131, "Menu Hải Sản - Trang 3", "#ffffff", "menus/menu-001/03.webp")
create_placeholder(800, 1131, "Menu Hải Sản - Trang 4", "#ffffff", "menus/menu-001/04.webp")

# Create placeholders for menu-002
os.makedirs('menus/menu-002', exist_ok=True)
create_placeholder(800, 450, "Menu Nhà Hàng - Cover", "#f093fb", "menus/menu-002/cover.webp")
create_placeholder(800, 1131, "Menu Nhà Hàng - Trang 1", "#ffffff", "menus/menu-002/01.webp")
create_placeholder(800, 1131, "Menu Nhà Hàng - Trang 2", "#ffffff", "menus/menu-002/02.webp")

# Create placeholders for menu-003
os.makedirs('menus/menu-003', exist_ok=True)
create_placeholder(800, 450, "Menu Đặc Biệt - Cover", "#17a2b8", "menus/menu-003/cover.webp")
create_placeholder(800, 1131, "Menu Đặc Biệt - Trang 1", "#ffffff", "menus/menu-003/01.webp")
create_placeholder(800, 1131, "Menu Đặc Biệt - Trang 2", "#ffffff", "menus/menu-003/02.webp")

print("All placeholder images created successfully!")
