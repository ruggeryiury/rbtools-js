def webp_data_url_pngwii(src_path: str, header: bytes, quality: int = 100) -> str:
  with BytesIO() as output:
    image = PNG_WII(src_path, header).tpl.toImage()
    image.save(output, format="WEBP", quality=quality)
    webp_data = output.getvalue()
    base64_data = base64.b64encode(webp_data).decode('utf-8')
    data_url = f"data:image/webp;base64,{base64_data}"
    print(data_url)
    return data_url
  
if __name__ == '__main__':
  import argparse
  import base64
  from io import BytesIO
  from lib.tpl import PNG_WII
  
  parser = argparse.ArgumentParser( description='RBToolsJS: WEBP DataURL Creator (for PNG_WII files)', epilog='By Ruggery Iury Corrêa.')
  parser.add_argument('src_path', help='The source file path to be converted', type=str)
  parser.add_argument('-tpl', '--tpl_header', help='The TPL header used on the file.', type=str, required=False)

  arg = parser.parse_args()
  
  webp_data_url_pngwii(arg.src_path, base64.b64decode(arg.tpl_header))