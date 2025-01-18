import argparse, tempfile, os, json
from lib.mogg import decrypt_mogg_bytes
from pydub.utils import mediainfo

def format_duration(duration: str) -> str:
  total_seconds = (duration // 1000)
  
  hours, remainder = divmod(total_seconds, 3600)
  minutes, seconds = divmod(remainder, 60)
  
  if hours > 0:
      formatted_time = f"{hours:02}:{minutes:02}:{seconds:02}"
  else:
      formatted_time = f"{minutes:02}:{seconds:02}"
      
  return formatted_time
  

def mogg_file_stat(file_path: str) -> dict:
  fin = open(file_path, "rb").read()
  version = fin[0]
  ogg_bytes = decrypt_mogg_bytes(True, False, fin)
  temp = tempfile.NamedTemporaryFile(delete=False, suffix=".ogg")
  try:
    temp.write(ogg_bytes)
    temp.flush()
    status = mediainfo(temp.name)
    stat = {}
    stat['version'] = version
    stat['is_encrypted'] = version != 10
    stat['sample_rate'] = int(status['sample_rate'])
    stat['channels'] = int(status['channels'])
    
    left, right = status['duration'].split(".")
    right_rounded = str(round(int(right), -3))[:-3]
    result = int(left + right_rounded)
    
    stat['duration_ms'] = result
    stat['duration'] = format_duration(result)
    stat['bit_rate'] = int(status['bit_rate'])
    stat['size_bytes'] = int(status['size'])
    
    mb_value = int(status['size']) / (1024 ** 2)
    stat['size'] = f"{mb_value:.2f} MB"
    print(json.dumps(stat, indent=0, ensure_ascii=False))
    return status
  finally:
    temp.close()
    os.unlink(temp.name)
    

if __name__ == '__main__':
  parser = argparse.ArgumentParser(description='RBToolsJS: MOGG File Stat CLI', epilog='By Ruggery Iury Corrêa.')
  parser.add_argument('file_path', help='The path of the MOGG file', type=str)

  arg = parser.parse_args()
  
  mogg_file_stat(arg.file_path)
  