from pathlib import Path
from PIL import Image
import pillow_heif

pillow_heif.register_heif_opener()

input_file = Path("public/images/events/nukkad-naatak/nukkad-01.heic")
output_file = Path("public/images/events/nukkad-naatak/nukkad-01.jpg")

image = Image.open(input_file)
image = image.convert("RGB")
image.save(output_file, "JPEG", quality=95)

print(f"Converted successfully:")
print(output_file)