import argparse
from PIL import Image
import json
from mido import MidiFile, MetaMessage

def midi_file_stat(file_path: str, print_return = True) -> dict:
  try:
    midi = MidiFile(file_path)
    status = {
      "format": "MID",
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
  
  if print_return:
    print(json.dumps(status))
  return status

if __name__ == '__main__':
  parser = argparse.ArgumentParser( description='RBToolsJS: MIDI File Status CLI')
  parser.add_argument('file_path', help='The path of the MIDI file', type=str)

  arg = parser.parse_args()
  
  midi_file_stat(arg.file_path)
