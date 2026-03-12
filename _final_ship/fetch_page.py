import urllib.request
import urllib.error
import os


def fetch_and_overwrite():
    print("--- Single Page Fetcher ---")

    # 1. Get URL
    url = input("Enter the Live URL (e.g. `https://domain.com/page.html):`  ").strip()
    if not url:
        print("Error: URL is required.")
        return

    # 2. Get Local File
    file_path = input("Enter the local file path to overwrite: ").strip()
    # Remove quotes if user pasted them
    file_path = file_path.replace('"', '').replace("'", "")

    if not file_path:
        print("Error: File path is required.")
        return

    print(f"\nFetching from: {url}...")

    try:
        # Create request with Browser Headers to bypass 403 blocks
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        req = urllib.request.Request(url, headers=headers)

        # Fetch data
        with urllib.request.urlopen(req) as response:
            html_content = response.read()

        # Write to file
        with open(file_path, "wb") as f:
            f.write(html_content)

        print(f"✅ SUCCESS! Overwrote: {os.path.basename(file_path)}")
        print(f"   Size: {len(html_content)} bytes")

    except urllib.error.HTTPError as e:
        print(f"❌ HTTP Error: {e.code} {e.reason}")
    except urllib.error.URLError as e:
        print(f"❌ URL Error: {e.reason}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")


if __name__ == "__main__":
    fetch_and_overwrite()
