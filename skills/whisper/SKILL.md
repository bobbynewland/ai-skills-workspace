# Whisper Transcription Skill

Transcribe video and audio files to text using OpenAI Whisper (local, free).

## Installation

Whisper is already installed! Run `pip install openai-whisper` if needed.

**Requirements:**
- `ffmpeg` for audio processing
- `yt-dlp` for YouTube downloads

## Commands

### Transcribe a file
```bash
# Transcribe any video/audio file
python /root/.openclaw/workspace/skills/whisper/whisper_skill.py transcribe video.mp4

# Use larger model for better accuracy
python /root/.openclaw/workspace/skills/whisper/whisper_skill.py transcribe audio.mp3 --model medium

# Specify language
python /root/.openclaw/workspace/skills/whisper/whisper_skill.py transcribe file.m4a --lang en
```

### Transcribe YouTube
```bash
# Download + transcribe YouTube video
python /root/.openclaw/workspace/skills/whisper/whisper_skill.py transcribe https://youtube.com/watch?v=...
python /root/.openclaw/workspace/skills/whisper/whisper_skill.py url https://youtu.be/...
```

### Check status
```bash
python /root/.openclaw/workspace/skills/whisper/whisper_skill.py status
```

### List models
```bash
python /root/.openclaw/workspace/skills/whisper/whisper_skill.py models
```

## Models

| Model | Speed | Accuracy | RAM |
|-------|-------|----------|-----|
| tiny | ⚡ Fastest | ⭐ Basic | ~39 MB |
| base | ⚡ Fast | ⭐⭐ Good | ~74 MB |
| small | 🏃 | ⭐⭐⭐ Better | ~244 MB |
| medium | 🏃🏃 | ⭐⭐⭐⭐ High | ~769 MB |
| large | 🐢 Slow | ⭐⭐⭐⭐⭐ Best | ~1550 MB |
| turbo | ⚡ | ⭐⭐⭐⭐+ Fast+ | ~809 MB |

**Recommended:** `base` for speed, `medium` for quality

## Output Formats

Whisper generates:
- `.txt` - Plain text transcript
- `.vtt` - WebVTT subtitles
- `.srt` - SubRip subtitles
- `.tsv` - Tab-separated with timestamps
- `.json` - Full data with timestamps

## Usage Examples

### Transcription for AI Skills Studio
```bash
# Transcribe a training video
python /root/.openclaw/workspace/skills/whisper/whisper_skill.py transcribe intro-video.mp4 --model medium

# Create subtitles
python /root/.openclaw/workspace/skills/whisper/whisper_skill.py transcribe webinar.mp4 --model small
```

### YouTube to Text
```bash
# Transcribe a competitor's video for research
python /root/.openclaw/workspace/skills/whisper/whisper_skill.py url https://youtube.com/watch?v=...
```

## Output Location

All transcriptions saved to:
```
/root/.openclaw/workspace/transcriptions/
```

## Memory

Skill path: `/root/.openclaw/workspace/skills/whisper/`
