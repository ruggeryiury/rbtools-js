import argparse
import base64
import io
from PIL import Image

def image_converter_dataurl_base64(source: str, width: int, height: int, interpolation: str, quality: int) -> None:
  try:
    with Image.open(source) as img:
      if img.mode != 'RGB':
        img = img.convert('RGB')

      if (img.width == width and img.height == height):
        with io.BytesIO() as output:
          new_im.save(output, format="WEBP", quality=quality)
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

        with io.BytesIO() as output:
          new_im.save(output, format="WEBP", quality=quality)
          webp_data = output.getvalue()
          base64_data = base64.b64encode(webp_data).decode('utf-8')
          data_url = f"data:image/webp;base64,{base64_data}"
          print(data_url)
  except Exception as e:
      print("ImageConverterError:", e)

if __name__ == '__main__':
  parser = argparse.ArgumentParser( description='Image Converter (Command Line Interface) v1.0', epilog='By Ruggery Iury Corrêa.')
  parser.add_argument('source', help='The source file path to be converted', type=str)
  parser.add_argument('-x', '--width', help='The width of the image', type=int, default=512, required=False)
  parser.add_argument('-y', '--height', help='The height of the image', type=int, default=512, required=False)
  parser.add_argument('-i', '--interpolation', help='The interpolation method for the image resizing', default='BILINEAR', type=str, required=False)
  parser.add_argument('-q', '--quality', help='The quality value of the output image. Only used on lossy format, such as JPEG and WEBP', default=90, type=int, required=False)

  arg = parser.parse_args()
  
  image_converter_dataurl_base64(source=arg.source, width=arg.width, height=arg.height, interpolation=arg.interpolation.upper(), quality=arg.quality)