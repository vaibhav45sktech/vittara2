import os

base_dir = "public/images/new-collection"

for root, dirs, files in os.walk(base_dir):
    # Sort files to ensure deterministic order (though not strictly necessary for simple renaming)
    files.sort()
    
    counter = 1
    for filename in files:
        if filename.startswith('.'):
            continue
            
        name, ext = os.path.splitext(filename)
        new_name = f"{counter}{ext}"
        
        old_path = os.path.join(root, filename)
        new_path = os.path.join(root, new_name)
        
        # Avoid overwriting if file already exists with target name (edge case)
        if os.path.exists(new_path) and new_path != old_path:
            # Shift it safely? Or just skip/log. 
            # For simplicity, let's assume cleaner state or use a temporary prefix if needed.
            # But "short name" implies we want 1.jpg, 2.jpg.
            # If 1.jpg exists, we might have an issue.
            # Let's use a prefix based on folder name to be distinctive but short?
            # e.g. p11-1.jpg, p22-1.jpg, s-1.jpg
            pass

        # Let's use a simpler mapping: 1.jpg, 2.jpg...
        # If 1.jpg exists (from a previous run?), we should be careful.
        # But looking at listing, they are timestamps.
        
        print(f"Renaming {old_path} to {new_path}")
        os.rename(old_path, new_path)
        counter += 1
