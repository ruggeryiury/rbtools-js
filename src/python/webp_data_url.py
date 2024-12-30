def webp_data_url(src_path: str, width: int = 256, height: int = 256, interpolation: str = 'BILINEAR', quality: int = 100) -> str:
  try:
    with Image.open(src_path) as img:
      if img.mode != 'RGB':
        img = img.convert('RGB')

      if (img.width == width and img.height == height):
        with BytesIO() as output:
          img.save(output, format="WEBP", quality=quality)
          webp_data = output.getvalue()
          base64_data = base64.b64encode(webp_data).decode('utf-8')
          data_url = f"data:image/webp;base64,{base64_data}"
          print(data_url)
          return data_url
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
          return data_url
  except Exception as e:
    raise e
  
if __name__ == '__main__':
  import argparse
  import base64
  from PIL import Image
  from io import BytesIO
  
  parser = argparse.ArgumentParser( description='RBToolsJS: WEBP DataURL Creator', epilog='By Ruggery Iury Corrêa.')
  parser.add_argument('src_path', help='The source file path to be converted', type=str)
  parser.add_argument('-x', '--width', help='The width of the image', type=int, default=256, required=False)
  parser.add_argument('-y', '--height', help='The height of the image', type=int, default=256, required=False)
  parser.add_argument('-i', '--interpolation', help='The interpolation method used when resizing the image', default='BILINEAR', type=str, required=False)
  parser.add_argument('-q', '--quality', help='The quality value of the output image. Only used on lossy format, such as JPEG and WEBP', default=100, type=int, required=False)

  arg = parser.parse_args()
  
  webp_data_url(arg.src_path, arg.width, arg.height, arg.interpolation, arg.quality)