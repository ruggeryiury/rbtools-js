import argparse
from PIL import Image

def get_image_size(source: str):
  try:
    with Image.open(source) as img:
      print([img.width, img.height])
  except Exception as e:
      print("ImageConverterError:", e)

if __name__ == '__main__':
  parser = argparse.ArgumentParser( description='Get Image Size (Command Line Interface) v1.0', epilog='By Ruggery Iury Corrêa.')
  parser.add_argument('source', help='The source file path to be converted', type=str)

  arg = parser.parse_args()
  
  get_image_size(arg.source)