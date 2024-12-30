def stfs_extract(stfs_file_path: str, dest_path: str) -> str:
  """
  Extract all files from a CON file.
  
  Parameters
  ----------
  stfs_file_path : str
    The path of the CON file to be extracted.
  dest_path : str
    The folder path where you want the files to be extracted to.
  """
  con = STFS(stfs_file_path)
  
  # Create directories
  for filename in con.allfiles:
    if con.allfiles[filename].isdirectory:
      dirpath = filename[1:]
      dircomponents = dirpath.split("/")
      for i in range(len(dircomponents)):
        dir_path = "\\".join(dircomponents[:i+1])
        new_folder_path = f"{dest_path}\\{dir_path}"
        try:
          os.mkdir(new_folder_path)
        except OSError:
          pass
        
  # Writing files
  for filename in con.allfiles:
    if filename == "/songs/":
      continue
    if not con.allfiles[filename].isdirectory:
      
      file_bytes = con.read_file(con.allfiles[filename])
      new_file_path = f"{dest_path}{filename}"
      open(new_file_path, "wb").write(file_bytes)
  
if __name__ == '__main__':
  import argparse
  import os
  from lib.stfs import STFS
  
  parser = argparse.ArgumentParser(description='RBToolsJS: CON Extractor CLI', epilog='By Ruggery Iury Corrêa.')
  parser.add_argument('stfs_file_path', help='The RB3CON file you want to extract and print its contents', type=str)
  parser.add_argument('dest_path', help='The folder path where you want the files to be extracted to', type=str)

  arg = parser.parse_args()
  
  stfs_extract(arg.stfs_file_path, arg.dest_path)