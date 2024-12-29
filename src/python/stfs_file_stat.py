from typing import List
from lib.stfs import STFS, FileListing
import argparse
import json

def stfs_file_stat(stfs_file_path: str) -> str:
  con = STFS(stfs_file_path)
  parsed = { "path": stfs_file_path, "name": str(con.display_name_blob.decode()).replace("\u0000", ""), "desc": con.display_description_blob.decode().replace("\u0000", ""), "files": [], "dta": "" }
  
  all_files = con.allfiles.keys()
  
  for file in all_files:
    if file == "/songs/":
      pass
    else:
      parsed['files'].append(file)
      
  dta_file = None
  dta_file_contents_bytes = None
  upg_file = None
  upg_file_contents_bytes = None
  
  try:
    dta_file = con.allfiles['/songs/songs.dta']
  except KeyError:
    pass
  
  try:
    upg_file = con.allfiles['/songs_upgrades/upgrades.dta']
  except KeyError:
    pass
  
  try:
    dta_file_contents_bytes = con.read_file(dta_file)
    
    try:
      parsed['dta'] = dta_file_contents_bytes.decode()
    except UnicodeDecodeError:
      parsed['dta'] = dta_file_contents_bytes.decode('latin-1')
  except AttributeError:
    pass
  
  try:
    upg_file_contents_bytes = con.read_file(upg_file)
    
    try:
      parsed['upgrades'] = upg_file_contents_bytes.decode()
    except UnicodeDecodeError:
      parsed['upgrades'] = upg_file_contents_bytes.decode('latin-1')
  except AttributeError:
    pass
  
  return_obj = json.dumps(parsed, indent=0, ensure_ascii=False)
  print(return_obj)
  return return_obj
  

if __name__ == '__main__':
  parser = argparse.ArgumentParser( description='RB3CON Parser (Command Line Interface) v1.0', epilog='By Ruggery Iury Corrêa.')
  parser.add_argument('stfs_file_path', help='The RB3CON file you want to extract and print its contents', type=str)

  arg = parser.parse_args()
  
  stfs_file_stat(arg.stfs_file_path)