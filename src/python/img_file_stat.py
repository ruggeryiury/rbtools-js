def img_file_stat(file_path: str) -> dict:
  """
  Reads an image file and prints its statistics.
  
  Parameters
  ----------
  file_path : str
    The path of the image file.
  """
  try:
    with Image.open(file_path) as img:
      status = {
        "format": img.format,
        "width": img.width,
        "height": img.height,
        "size": img.size,
        "formatDesc": img.format_description,
        "imageMode": img.mode,
      }
  except Exception as e:
    raise e
    
  print(json.dumps(status, ensure_ascii=False))
  return status

if __name__ == '__main__':
  import argparse
  from PIL import Image
  import json
  
  parser = argparse.ArgumentParser(description='RBToolsJS: Image File Stat CLI', epilog='By Ruggery Iury Corrêa.')
  parser.add_argument('file_path', help='The path of the image file', type=str)

  arg = parser.parse_args()
  
  img_file_stat(arg.file_path)