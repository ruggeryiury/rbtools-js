from lib.stfs import STFS
import argparse

def read_dta_file_from_stfs(stfs_file_path: str) -> None:
  """
  Reads a RB3CON file and prints only its main DTA file contents.
  
  Parameters
  ----------
  stfs_file_path : str
    The RB3CON file you want to extract and print its DTA file contents.
  """
  con = STFS(stfs_file_path)
  dta_file_listing = con.allfiles['/songs/songs.dta']
  dta_file_contents_bytes = con.read_file(dta_file_listing)
  try:
    contents = dta_file_contents_bytes.decode()
    print(contents)
  except UnicodeDecodeError:
    contents = dta_file_contents_bytes.decode('latin-1')
    print(contents)
  return

if __name__ == '__main__':
  parser = argparse.ArgumentParser( description='RB3CON DTA File Reader (Command Line Interface) v1.0', epilog='By Ruggery Iury Corrêa.')
  parser.add_argument('stfs_file_path', help='The RB3CON file you want to extract and print its DTA file contents', type=str)

  arg = parser.parse_args()
  
  read_dta_file_from_stfs(arg.stfs_file_path)