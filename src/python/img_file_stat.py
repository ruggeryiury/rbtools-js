import argparse
from PIL import Image
import json

def img_file_stat(file_path: str) -> None:
  try:
    with Image.open(file_path) as img:
      status = {
        "format": img.format,
        "width": img.width,
        "height": img.height,
        "size": img.size,
        "formatDesc": img.format_description,
        "imageMode": img.mode,
        "isAnimated": img.is_animated,
      }
      print(json.dumps(status))
  except Exception as e:
      raise e
    
  return
if __name__ == '__main__':
  parser = argparse.ArgumentParser( description='RBToolsJS: Image File Status CLI')
  parser.add_argument('file_path', help='The path of the image file', type=str)

  arg = parser.parse_args()
  
  img_file_stat(arg.file_path)