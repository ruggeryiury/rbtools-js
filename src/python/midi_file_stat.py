def midi_file_stat(file_path: str) -> dict:
  """
  Reads a MIDI file and prints its statistics.
  
  Parameters
  ----------
  file_path : str
    The path of the MIDI file.
  """
  try:
    with MidiFile(file_path) as midi:
      status = {
        "charset": midi.charset,
        "midiType": midi.type,
        "ticksPerBeat": midi.ticks_per_beat,
        "tracks": []
      }
      
      for track in midi.tracks:
        for msg in track:
          if isinstance(msg, MetaMessage) and msg.type == 'track_name':
            status['tracks'].append(msg.name)
            
      status['tracks'].pop(0)
  except Exception as e:
    raise e
  
  print(json.dumps(status, ensure_ascii=False))
  return status

if __name__ == '__main__':
  import argparse
  import json
  from mido import MidiFile, MetaMessage
  
  parser = argparse.ArgumentParser(description='RBToolsJS: MIDI File Stat CLI', epilog='By Ruggery Iury Corrêa.')
  parser.add_argument('file_path', help='The path of the MIDI file', type=str)

  arg = parser.parse_args()
  
  midi_file_stat(arg.file_path)
