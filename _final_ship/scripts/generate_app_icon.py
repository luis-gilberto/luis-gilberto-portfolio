import os
try:
    from PIL import Image
except ImportError:
    print("PIL not installed")
    exit(1)

def generate_icon():
    # Paths
    base_dir = r"C:\Users\luisg\OneDrive\Documents\Luis Gilberto"
    bg_path = os.path.join(base_dir, "assets", "hp", "artistic-01-waves.webp")
    
    # Path to the correct icon symbol
    icon_path = os.path.join(base_dir, "assets", "Symbol_mobile.png")
    
    if not os.path.exists(icon_path):
        print(f"Error: Icon file not found at {icon_path}")
        # Fallback to verify if it exists elsewhere or return
        return

    # Ensure output directory exists in _deploy_v2
    output_dir = os.path.join(base_dir, "_deploy_v2", "assets", "icons")
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    print(f"Background: {bg_path}")
    print(f"Icon: {icon_path}")
    
    try:
        # Load images
        bg = Image.open(bg_path).convert("RGBA")
        icon = Image.open(icon_path).convert("RGBA")
        
        # Target sizes
        sizes = [
            (180, 180, "apple-touch-icon.png"),
            (192, 192, "android-chrome-192x192.png")
        ]
        
        for width, height, filename in sizes:
            # 1. Process Background (Center Crop)
            # Resize bg so that the smaller dimension matches the target dimension, maintaining aspect ratio
            bg_ratio = bg.width / bg.height
            target_ratio = width / height
            
            if bg_ratio > target_ratio:
                # Background is wider than target
                new_height = height
                new_width = int(new_height * bg_ratio)
            else:
                # Background is taller than target
                new_width = width
                new_height = int(new_width / bg_ratio)
                
            bg_resized = bg.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # Center crop
            left = (new_width - width) // 2
            top = (new_height - height) // 2
            right = left + width
            bottom = top + height
            
            canvas = bg_resized.crop((left, top, right, bottom))
            
            # 2. Process Icon
            # Icon should be centered and smaller than canvas.
            # We use 60% of canvas width/height as max bounds for the icon to ensure padding
            icon_target_w = int(width * 0.6)
            icon_ratio = icon.width / icon.height
            icon_target_h = int(icon_target_w / icon_ratio)
            
            # Ensure icon fits within height too if it's very tall
            if icon_target_h > height * 0.6:
                 icon_target_h = int(height * 0.6)
                 icon_target_w = int(icon_target_h * icon_ratio)
                 
            icon_resized = icon.resize((icon_target_w, icon_target_h), Image.Resampling.LANCZOS)
            
            # Paste icon at center
            icon_x = (width - icon_target_w) // 2
            icon_y = (height - icon_target_h) // 2
            
            # Use the icon itself as the mask for transparency
            canvas.paste(icon_resized, (icon_x, icon_y), icon_resized)
            
            # Save
            out_path = os.path.join(output_dir, filename)
            canvas.save(out_path)
            print(f"Generated: {out_path}")
            
    except Exception as e:
        print(f"Error processing images: {e}")

if __name__ == "__main__":
    generate_icon()
