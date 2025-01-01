import sys, json, base64
from io import BytesIO
from PIL import Image

def buffer_converter(base64_string: str, dest_path: str, width: int = 256, height: int = 256, interpolation: str = 'BILINEAR', quality: int = 100) -> None:
  """
  Converts a Base64-encoded Buffer string to any image format. This script also does resizing.
  
  Parameters
  ----------
  base64_string : str
    A base64-encoded string to be converted to Data URL
  dest_path : str
    The destination path of the converted image file.
  width: int, optional
    The width that will be used on the generated string (Default is `256`).
  height: int, optional
    The height that will be used on the generated string (Default is `256`).
  interpolation : str, optional
    The interpolation method used when resizing the image (Default if `'BILINEAR'`).
  quality: int, optional
    The quality value of the output image. Only used on lossy format, such as JPEG and WEBP (Default is `100`).
  """
  
  image_data = base64.b64decode(base64_string)
  try:
    with Image.open(BytesIO(image_data)) as img:
      if img.mode != 'RGB':
        img = img.convert('RGB')

      if (img.width == width and img.height == height):
        img.save(dest_path, quality=quality)
      else:
        # resized = img.resize((width, height), resample=Image.Resampling[interpolation])
        x, y = img.size
        size = max(width, x, y)
        new_im = Image.new('RGB', (size, size), (0,0,0))
        new_im.paste(img, (int((size - x) / 2), int((size - y) / 2)))
        new_im.thumbnail((width,height), resample=Image.Resampling[interpolation])
        new_im.save(dest_path, quality=quality)
        
  except Exception as e:
    raise e

if __name__ == '__main__':
  stdin = sys.stdin.read()
  arg = json.loads(stdin)
  buffer_converter(arg['buf'], arg['dest'], arg['width'], arg['height'], arg['interpolation'], arg['quality'])