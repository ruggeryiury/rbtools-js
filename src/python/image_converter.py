import argparse
from PIL import Image

def image_converter(source: str, dest: str, width: int = 512, height: int = 512, interpolation: str = 'BILINEAR', quality: int = 100) -> None:
  """
  Reads any compatible image file and converts it to any compatible format. This script also does resizing.
  
  Parameters
  ----------
  source : str
    The path of the image file.
  dest : str
    The destination path of the converted image file.
  width: int, optional
    The width that will be used on the generated string (Default is `512`).
  height: int, optional
    The height that will be used on the generated string (Default is `512`).
  interpolation : str, optional
    The interpolation method used when resizing the image (Default if `'BILINEAR'`).
  quality: int, optional
    The quality value of the output image. Only used on lossy format, such as JPEG and WEBP (Default is `100`).
  """
  try:
    with Image.open(source) as img:
      if img.mode != 'RGB':
        img = img.convert('RGB')

      if (img.width == width and img.height == height):
        img.save(dest, quality=quality)
      else:
        x, y = img.size
        size = max(width, x, y)
        new_im = Image.new('RGB', (size, size), (0,0,0))
        new_im.paste(img, (int((size - x) / 2), int((size - y) / 2)))
        new_im.thumbnail((width,height), resample=Image.Resampling[interpolation])
        new_im.save(dest, quality=quality)
  except Exception as e:
      print("ImageConverterError:", e)

if __name__ == '__main__':
  parser = argparse.ArgumentParser( description='Image Converter (Command Line Interface) v1.0', epilog='By Ruggery Iury Corrêa.')
  parser.add_argument('source', help='The source file path to be converted', type=str)
  parser.add_argument('dest', help='The destination file path of the converted file', type=str)
  parser.add_argument('-x', '--width', help='The width of the image', type=int, default=512, required=False)
  parser.add_argument('-y', '--height', help='The height of the image', type=int, default=512, required=False)
  parser.add_argument('-i', '--interpolation', help='The interpolation method used when resizing the image', default='BILINEAR', type=str, required=False)
  parser.add_argument('-q', '--quality', help='The quality value of the output image. Only used on lossy format, such as JPEG and WEBP', default=100, type=int, required=False)

  arg = parser.parse_args()
  
  image_converter(source=arg.source, dest=arg.dest, width=arg.width, height=arg.height, interpolation=arg.interpolation.upper(), quality=arg.quality)