from typing import List
from lib.stfs import STFS
import argparse
import json

def read_dta_file_from_con(stfs_file_path: str) -> str:
  """
  Reads a RB3CON file and prints only its main DTA file contents.
  
  Parameters
  ----------
  stfs_file_path : str
    The RB3CON file you want to extract and print its DTA file contents.
  """
  con = STFS(stfs_file_path)
  parsed = { "path": stfs_file_path, "name": str(con.display_name_blob.decode()).replace("\u0000", ""), "desc": con.display_description_blob.decode().replace("\u0000", ""), "files": [], "dta": "" }
  
  dta_file_listing = con.allfiles['/songs/songs.dta']
  all_files = con.allfiles.keys()
  for file in all_files:
    if file == "/songs/":
      pass
    else:
      parsed['files'].append(file)
  dta_file_contents_bytes = con.read_file(dta_file_listing)
  
  try:
    parsed['dta'] = dta_file_contents_bytes.decode()
  except UnicodeDecodeError:
    parsed['dta'] = dta_file_contents_bytes.decode('latin-1')
  
  return_obj = json.dumps(parsed, indent=0, ensure_ascii=False)
  print(return_obj)
  return return_obj
  

if __name__ == '__main__':
  parser = argparse.ArgumentParser( description='RB3CON Parser (Command Line Interface) v1.0', epilog='By Ruggery Iury Corrêa.')
  parser.add_argument('stfs_file_path', help='The RB3CON file you want to extract and print its contents', type=str)

  arg = parser.parse_args()
  
  read_dta_file_from_con(arg.stfs_file_path)