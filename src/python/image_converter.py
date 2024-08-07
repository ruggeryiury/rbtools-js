import argparse
from PIL import Image

def image_converter(source: str, dest: str, width: int, height: int, interpolation: str, quality: int) -> None:
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
  parser = argparse.ArgumentParser( description='Image Converter (Command Line Interface) v1.0', epilog='By Ruggery Iury Corrêa.\r\nGitHub source: https://github.com/ruggeryiury/ruggy-py')
  parser.add_argument('source', help='The source file path to be converted', type=str)
  parser.add_argument('dest', help='The destination file path of the converted file', type=str)
  parser.add_argument('-x', '--width', help='The width of the image', type=int, default=512, required=False)
  parser.add_argument('-y', '--height', help='The height of the image', type=int, default=512, required=False)
  parser.add_argument('-i', '--interpolation', help='The interpolation method for the image resizing', default='BILINEAR', type=str, required=False)
  parser.add_argument('-q', '--quality', help='The quality value of the output image. Only used on lossy format, such as JPEG and WEBP', default=100, type=int, required=False)

  arg = parser.parse_args()
  
  image_converter(source=arg.source, dest=arg.dest, width=arg.width, height=arg.height, interpolation=arg.interpolation.upper(), quality=arg.quality)