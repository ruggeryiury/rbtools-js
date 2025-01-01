import argparse, os
from lib.mogg import decrypt_mogg

def mogg_decrypt(enc_path: str, dec_path: str):
  enc_in = open(enc_path, "rb")
  dec_out = open(dec_path, "wb")
  
  xbox_green_failed = decrypt_mogg(True, False, enc_in, dec_out)
  # Might need PS3 and red keys implementation
  return
  

if __name__ == '__main__':
  parser = argparse.ArgumentParser(description='RBToolsJS: MOGG Decrypter CLI', epilog='By Ruggery Iury Corrêa.')
  parser.add_argument('enc_path', help='The encrypted MOGG file path', type=str)
  parser.add_argument('dec_path', help='The decrypted MOGG file path', type=str)

  arg = parser.parse_args()
  
  mogg_decrypt(arg.enc_path, arg.dec_path)