def stfs_file_stat(file_path: str) -> dict:
  """
  Reads a CON file and prints its statistics.
  
  Parameters
  ----------
  file_path : str
    The path of the CON file.
  """
  con = STFS(file_path)
  status = { "path": file_path, "name": str(con.display_name_blob.decode()).replace("\u0000", ""), "desc": con.display_description_blob.decode().replace("\u0000", ""), "files": [], "dta": "" }
  
  all_files = con.allfiles.keys()
  
  for file in all_files:
    if file == "/songs/":
      pass
    else:
      status['files'].append(file)
      
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
      status['dta'] = dta_file_contents_bytes.decode()
    except UnicodeDecodeError:
      status['dta'] = dta_file_contents_bytes.decode('latin-1')
  except AttributeError:
    pass
  
  try:
    upg_file_contents_bytes = con.read_file(upg_file)
    
    try:
      status['upgrades'] = upg_file_contents_bytes.decode()
    except UnicodeDecodeError:
      status['upgrades'] = upg_file_contents_bytes.decode('latin-1')
  except AttributeError:
    pass
  
  print(json.dumps(status, ensure_ascii=False))
  return status
  

if __name__ == '__main__':
  from lib.stfs import STFS
  import argparse
  import json
  
  parser = argparse.ArgumentParser(description='RBToolsJS: CON File Stat CLI', epilog='By Ruggery Iury Corrêa.')
  parser.add_argument('file_path', help='The RB3CON file you want to extract and print its contents', type=str)

  arg = parser.parse_args()
  
  stfs_file_stat(arg.file_path)