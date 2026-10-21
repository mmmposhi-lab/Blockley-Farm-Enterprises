"""Decode every published photograph; do not allow Pillow's truncated-image mode."""
import json
from pathlib import Path
from PIL import Image, ImageFile

ImageFile.LOAD_TRUNCATED_IMAGES = False
root = Path(__file__).resolve().parents[1]
photos = json.loads((root / 'photo-manifest.json').read_text())
for photo in photos:
    with Image.open(root / photo['file']) as image:
        image.load()
        if image.size != (photo['width'], photo['height']):
            raise ValueError(f"Image dimensions changed: {photo['file']}")
print(f"Image decode checks passed: {len(photos)} photographs.")
