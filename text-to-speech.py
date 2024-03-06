# import sys
# from googletrans import Translator

# translator=Translator()
# print(sys.argv)

# userText=sys.argv[1]

# result = translator.translate(userText, dest='nl')
# sys.argv.append(result.text)
# print(sys.argv[2])

# This Python file uses the following encoding: utf-8
import shutil
import subprocess
from typing import Iterator
import uuid
import sys
import requests
import json

group_id='1697534675713802'
api_key = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJoZWV5byIsIlVzZXJOYW1lIjoiaGVleW8iLCJBY2NvdW50IjoiIiwiU3ViamVjdElEIjoiMTY5NzUzNDY3NTQ4MDI3MyIsIlBob25lIjoiIiwiR3JvdXBJRCI6IjE2OTc1MzQ2NzU3MTM4MDIiLCJQYWdlTmFtZSI6IiIsIk1haWwiOiJkZXZAaGVleW8ubGlmZSIsIkNyZWF0ZVRpbWUiOiIyMDI0LTAyLTExIDEwOjQ3OjA4IiwiaXNzIjoibWluaW1heCJ9.rlxFHGoLAgMgx4wgsNHoxhOL2k37PEQpsr_RxKh0pZgEAL_VuPI5bIo10l97PcV9SvkX5XxBL2koS9Jt1HMp-Ig2y8NSWo0dTyddV0QZ02KtRvsdGmpEGZGpkKJY9_Cp0j35CSvdf1OEGvF3TWusThAyvNtaCJk4Ti1yD_OrBt977PWKdFfmQ4xWjTPjTZY-i6FvCMOJbqn47CeVWBgJkqy9-cdaajciI4dq9n4ZATcgxGtVDKloO98eZiVQhMP3eM8HDp8N1LU7uERmQSRHXHrCuwoGyRg99Q3l2LeOGUfI9v2xUdtqD2ld9-1Y-PVJyMrY--tERstauCFwDxwKxw'
file_format='mp3'     
# 支持 mp3/pcm/flac

voiceId = sys.argv[1]
text = sys.argv[2]

def build_tts_stream_headers() -> dict:
   headers =   {
    'accept': 'application/json, text/plain, */*',
    'content-type': 'application/json',
    'authorization':  "Bearer "+api_key,
  }
   return headers

def build_tts_stream_body() -> dict:
  body =  json.dumps({
    "timber_weights": [
      {
        "voice_id": voiceId,
        "weight": 1
      },
      # {
      #   "voice_id": "female-shaonv",
      #   "weight": 1
      # }
    ],
    "text": text,
    "voice_id": voiceId,
    "model": "speech-01",
    "speed": 1,
    "vol": 1,
    "pitch": 0,
    "audio_sample_rate": 32000,
    "bitrate": 128000,
    "format": file_format,
  })
  return body

def call_tts_stream() -> Iterator[bytes]:
  url = "https://api.minimax.chat/v1/tts/stream?GroupId="+ group_id
  headers = build_tts_stream_headers()
  body = build_tts_stream_body()
  response =  requests.request("POST", url, stream=True, headers=headers, data=body)
  
  # print("Trace-Id: "+ response.headers.get("Trace-Id"))
  for chunk in (response.raw):
    if chunk:
        if chunk[:5] == b'data:':
          data = json.loads(chunk[5:])
          if "data" in data and "extra_info" not in data:
            if "audio" in data["data"] :
              audio =data["data"]['audio']
              yield audio
        else:
           # print(str(chunk))
           pass

def is_installed(lib_name: str) -> bool:
  lib = shutil.which(lib_name)
  if lib is None:
      return False
  return True

def audio_play(audio_stream: Iterator[bytes]) -> bytes:
#   if not is_installed("mpv"):
#       message = (
#           "本示例使用 mpv 播放音频，检测到您未安装"
#           "您可使用 'brew install mpv' 安装，或访问官方网站 https://mpv.io/ 获取更多信息"
#           "同时您也可以使用其他的合适的方式播放音频"
#       )
#       raise ValueError(message)

#   mpv_command = ["mpv", "--no-cache", "--no-terminal", "--", "fd://0"]
#   mpv_process = subprocess.Popen(
#       mpv_command,
#       stdin=subprocess.PIPE,
#       stdout=subprocess.DEVNULL,
#       stderr=subprocess.DEVNULL,
#   )

  audio = b""
  
  for chunk in audio_stream:
      if chunk is not None:
          decoded_hex = bytes.fromhex(chunk)
          # 播放该段音频
        #   mpv_process.stdin.write(decoded_hex)
        #   mpv_process.stdin.flush()  
        
          audio += decoded_hex

#   if mpv_process.stdin:
#       mpv_process.stdin.close()
#   mpv_process.wait()

  return audio

audio_chunk_iterator = call_tts_stream()
# print(audio_chunk_iterator)
audio = audio_play(audio_chunk_iterator)

#结果保存至文件
#timestamp = int(time.time())
file_name=f'public/audio-tts/{uuid.uuid4()}.{file_format}'
with open(file_name, 'wb') as file:
    file.write(audio)
print(file_name)