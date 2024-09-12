import base64
from PIL import Image
from io import BytesIO

def img_buffer_to_webp_data_url(base64_string: str) -> None:
  """
  Converts a Base64-encoded Buffer string to DataURL in lossless WEBP format.
  
  Parameters
  ----------
  base64_string : str
    A base64-encoded string to be converted to Data URL
  """
  image_data = base64.b64decode(base64_string)

  # Open the image from the bytes
  image = Image.open(BytesIO(image_data))

  with BytesIO() as output:
    image.save(output, format="WEBP", quality=100)
    webp_data = output.getvalue()
    base64_data = base64.b64encode(webp_data).decode('utf-8')
    data_url = f"data:image/webp;base64,{base64_data}"
    image.close()
    output.close()
    print(data_url)
  
if __name__ == '__main__':
  import sys
  
  base64_string = sys.stdin.read()
  img_buffer_to_webp_data_url(base64_string)