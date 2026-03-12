import os

files = [
    "work/case-study-family-safety.html",
    "insights/family-safety-launch/index.html",
    "insights/index.html",
    "insights/series/index.html"
]

# Add TheHub files
if os.path.exists("TheHub"):
    for root, dirs, fnames in os.walk("TheHub"):
        for fname in fnames:
            if fname.endswith(".html"):
                files.append(os.path.join(root, fname))

for fpath in files:
    try:
        if not os.path.exists(fpath):
            print(f"File not found: {fpath}")
            continue
            
        with open(fpath, "r", encoding="utf-8") as f:
            content = f.read()
        
        new_content = content.replace("/_deploy_v2/", "/")
        
        if content != new_content:
            with open(fpath, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Updated: {fpath}")
        else:
            print(f"No changes needed: {fpath}")
    except Exception as e:
        print(f"Error processing {fpath}: {e}")
