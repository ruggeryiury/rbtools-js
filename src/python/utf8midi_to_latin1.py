from mido import MidiFile, MidiTrack, Message, MetaMessage
import os
import argparse
import json
from pathlib import Path

def utf8midi_to_latin1(midi_path: str, output_path: str | None = None) -> None:
  
  midi: MidiFile | None = None
  if not os.path.exists(midi_path):
    print("MIDI file does not exist.")
    return
  
  try:
    midi = MidiFile(midi_path, charset='latin1')
  except Exception as e:
    print(f"Failed to load MIDI file: {e}")
    return
  
  vocals = None
  harm1 = None
  harm2 = None
  harm3 = None
  vocals_lyrics = ""
  harm1_lyrics = ""
  harm2_lyrics = ""
  harm3_lyrics = ""
  for track in midi.tracks:
    for msg in track:
      if isinstance(msg, MetaMessage) and msg.type == 'track_name':
        if 'PART VOCALS' in msg.name:
          vocals = track
          break
        if 'HARM1' in msg.name:
          harm1 = track
          break
        if 'HARM2' in msg.name:
          harm2 = track
          break
        if 'HARM3' in msg.name:
          harm3 = track
          break
      
  if vocals is None:
    print("PART VOCALS track not found")
    return
  
  for msg in vocals:
    if msg.type == 'lyrics':
      try:
        o: str = msg.text
        utf8 = o.encode('latin1', 'replace').decode('utf8')
        msg.text = utf8.encode('latin1', 'replace').decode('latin1')
        vocals_lyrics += f"{utf8} "
      except UnicodeDecodeError:
        vocals_lyrics += f"{msg.text} "
        continue
      
  if harm1 is not None:
    for msg in harm1:
      if msg.type == 'lyrics':
        try:
          o: str = msg.text
          utf8 = o.encode('latin1', 'replace').decode('utf8')
          msg.text = utf8.encode('latin1', 'replace').decode('latin1')
          harm1_lyrics += f"{utf8} "
        except UnicodeDecodeError:
          harm1_lyrics += f"{msg.text} "
          continue
      
  if harm2 is not None:
    for msg in harm2:
      if msg.type == 'lyrics':
        try:
          o: str = msg.text
          utf8 = o.encode('latin1', 'replace').decode('utf8')
          msg.text = utf8.encode('latin1', 'replace').decode('latin1')
          harm2_lyrics += f"{utf8} "
        except UnicodeDecodeError:
          harm2_lyrics += f"{msg.text} "
          continue
      
  if harm3 is not None:
    for msg in harm3:
      if msg.type == 'lyrics':
        try:
          o: str = msg.text
          utf8 = o.encode('latin1', 'replace').decode('utf8')
          msg.text = utf8.encode('latin1', 'replace').decode('latin1')
          harm3_lyrics += f"{utf8} "
        except UnicodeDecodeError:
          harm3_lyrics += f"{msg.text} "
          continue
        
  if output_path is not None:
    try:
      midi.save(output_path)
      print(json.dumps({ "midiPath": str(Path(midi_path).resolve()), "outputPath": str(Path(output_path).resolve()) }))
      return
    except Exception as e:
      print(f"Failed to save MIDI file: ${e}")
      return
  else:
    output_path_class = Path(midi_path)
    output_path = str(output_path_class.with_stem(f"{output_path_class.stem}_fix"))
    try:
      midi.save(output_path)
      print(json.dumps({ "midiPath": str(output_path_class.resolve()), "outputPath": str(Path(output_path).resolve()) }))
      return
    except Exception as e:
      print(f"Failed to save MIDI file: ${e}")
      return
  
  
      
if __name__ == '__main__':
  parser = argparse.ArgumentParser( description='UTF-8 MIDI File to Latin-1 v1.0', epilog='By Ruggery Iury Corrêa.')
  parser.add_argument('-i', '--midi_input', help='The path of the MIDI File you want to convert to Latin-1 encoding', type=str, required=True)
  parser.add_argument('-o', '--midi_output', help='The output path of the converted MIDI file. If not specified, it will be saved on the same folder of the original MIDI file with a "_fix" suffix', type=str, required=False)

  arg = parser.parse_args()
  
  utf8midi_to_latin1(arg.midi_input, arg.midi_output)