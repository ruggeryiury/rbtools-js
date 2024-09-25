def image_converter(src_path: str, dest_path: str, width: int = 256, height: int = 256, interpolation: str = 'BILINEAR', quality: int = 100, print_return = True) -> dict:
  """
  Reads any compatible image file and converts it to any compatible format. This script also does resizing.
  
  Parameters
  ----------
  src_path : str
    The path of the image file.
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
  try:
    with Image.open(src_path) as img:
      if img.mode != 'RGB':
        img = img.convert('RGB')

      if (img.width == width and img.height == height):
        img.save(dest_path, quality=quality)
        img.close()
      else:
        # resized = img.resize((width, height), resample=Image.Resampling[interpolation])
        x, y = img.size
        size = max(width, x, y)
        new_im = Image.new('RGB', (size, size), (0,0,0))
        new_im.paste(img, (int((size - x) / 2), int((size - y) / 2)))
        new_im.thumbnail((width,height), resample=Image.Resampling[interpolation])
        new_im.save(dest_path, quality=quality)
        new_im.close()
      
  except Exception as e:
    raise e

if __name__ == '__main__':
  import argparse
  from PIL import Image
  from img_file_stat import img_file_stat
  
  parser = argparse.ArgumentParser( description='RBToolsJS: Image Converter CLI', epilog='By Ruggery Iury Corrêa.')
  parser.add_argument('src_path', help='The source file path to be converted', type=str)
  parser.add_argument('dest_path', help='The destination file path of the converted file', type=str)
  parser.add_argument('-x', '--width', help='The width of the image', type=int, default=256, required=False)
  parser.add_argument('-y', '--height', help='The height of the image', type=int, default=256, required=False)
  parser.add_argument('-i', '--interpolation', help='The interpolation method used when resizing the image', default='BILINEAR', type=str, required=False)
  parser.add_argument('-q', '--quality', help='The quality value of the output image. Only used on lossy format, such as JPEG and WEBP', default=100, type=int, required=False)

  arg = parser.parse_args()
  
  image_converter(arg.src_path, arg.dest_path, arg.width, arg.height, arg.interpolation, arg.quality)