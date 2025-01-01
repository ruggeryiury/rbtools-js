import argparse

def rbart_byte_swapper(pathIn: str, pathOut: str) -> None:
    fin = open(pathIn, "rb")
    fout = open(pathOut, "wb")

    size = fin.seek(0,2)

    fin.seek(0,0)
    fout.seek(0,0)

    buffer = fin.read(32)
    fout.write(buffer)

    # Shuffles bytes after header.
    while (fin.tell() < size):
        buf1 = fin.read(1)
        buf2 = fin.read(1)

        fout.write(buf2)
        fout.write(buf1)

    fin.seek(0,0)
    fin.close()
    fout.close()
    pass

if __name__ == '__main__':
  parser = argparse.ArgumentParser(description='RBToolsJS: Rock Band Art File Byte Swapper', epilog='By Ruggery Iury Corrêa.')
  parser.add_argument('src_path', help='The path to the texture file you want to be byte-swapped', type=str)
  parser.add_argument('dest_path', help='The path to the The newly created byte-swapped texture file', type=str)
  
  arg = parser.parse_args()
    
  rbart_byte_swapper(arg.src_path, arg.dest_path)