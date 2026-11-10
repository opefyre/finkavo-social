#!/bin/bash
# layclip.sh <id> <seconds> [clip_offset]  — lays tools/reel/eps/<id>/media/clip.mp4 under the magenta opening of the engine render
# (first <seconds>), keys out #ff00ff, normalises to -14 LUFS (true peak under -1) and writes tools/reel/eps/<id>/delivery/reel.mp4.
# Input: the spare Mac's render, copied to tools/reel/eps/<id>/delivery/render.mp4 (deleted after).
set -e
id=$1; sec=$2; off=${3:-0}; E=$(dirname "$0")/eps/$id
mkdir -p "$E/delivery"
ffmpeg -v error -y -i "$E/delivery/render.mp4" -i "$E/media/clip.mp4" -filter_complex "\
[1:v]scale=1080:1932,crop=1080:1920,fps=30,trim=$off:$(echo "$off+$sec" | bc),setpts=PTS-STARTPTS[a];\
color=c=black:s=1080x1920:r=30:d=60[g];[a][g]concat=n=2:v=1:a=0,format=yuv420p[bg];\
[0:v]chromakey=0xff00ff:0.2:0.06[fg];[bg][fg]overlay=0:0:shortest=1[v];\
[0:a]loudnorm=I=-14:TP=-2:LRA=11,alimiter=limit=0.84:level=false,aformat=sample_rates=48000[au]" \
  -map "[v]" -map "[au]" -c:v libx264 -crf 18 -pix_fmt yuv420p -ar 48000 -movflags +faststart "$E/delivery/reel.mp4"
rm "$E/delivery/render.mp4"
echo "$E/delivery/reel.mp4"
