import argparse
import base64
from io import BytesIO
from PIL import Image

def image_converter_dataurl_base64(source: str, width: int = 128, height: int = 128, interpolation: str = 'BILINEAR', quality: int = 100) -> None:
  """
  Reads any compatible image file and prints a Base64-encoded DataURL string of it in WEBP format.
  
  Parameters
  ----------
  source : str
    The source image file path to be converted.
  width: int, optional
    The width that will be used on the generated string (Default is `128`).
  height: int, optional
    The height that will be used on the generated string (Default is `128`).
  interpolation : str, optional
    The interpolation method used when resizing the image (Default if `'BILINEAR'`).
  quality: int, optional
    The quality of the generated WEBP image (Default is `100`).
  """
  try:
    with Image.open(source) as img:
      if img.mode != 'RGB':
        img = img.convert('RGB')

      if (img.width == width and img.height == height):
        with BytesIO() as output:
          img.save(output, format="WEBP", quality=quality)
          webp_data = output.getvalue()
          base64_data = base64.b64encode(webp_data).decode('utf-8')
          data_url = f"data:image/webp;base64,{base64_data}"
          print(data_url)
      else:
        x, y = img.size
        size = max(width, x, y)
        new_im = Image.new('RGB', (size, size), (0,0,0))
        new_im.paste(img, (int((size - x) / 2), int((size - y) / 2)))
        new_im.thumbnail((width,height), resample=Image.Resampling[interpolation])

        with BytesIO() as output:
          new_im.save(output, format="WEBP", quality=quality)
          webp_data = output.getvalue()
          base64_data = base64.b64encode(webp_data).decode('utf-8')
          data_url = f"data:image/webp;base64,{base64_data}"
          print(data_url)
  except Exception as e:
      print("ImageConverterError:", e)

if __name__ == '__main__':
  parser = argparse.ArgumentParser(description='Image Converter (Base64 Data URL version) (WEBP format) (Command Line Interface) v1.0', epilog='By Ruggery Iury Corrêa.')
  parser.add_argument('source', help='The source image file path to be converted', type=str)
  parser.add_argument('-x', '--width', help='The width that will be used on the generated string', type=int, default=128, required=False)
  parser.add_argument('-y', '--height', help='The height that will be used on the generated string', type=int, default=128, required=False)
  parser.add_argument('-i', '--interpolation', help='The interpolation method used when resizing the image', default='BILINEAR', type=str, required=False)
  parser.add_argument('-q', '--quality', help='The quality of the generated WEBP image', default=100, type=int, required=False)

  arg = parser.parse_args()
  
  image_converter_dataurl_base64(source=arg.source, width=arg.width, height=arg.height, interpolation=arg.interpolation.upper(), quality=arg.quality)