#!/usr/bin/env python3
"""
Whisper Transcription Skill
Transcribe video/audio files to text using OpenAI Whisper

Commands:
- transcribe <file>      : Transcribe a file
- transcribe url <url>    : Transcribe from YouTube URL
- transcribe youtube <url>: Download + transcribe YouTube video
- models                 : List available models
- status                 : Check installation
"""
import os
import json
import subprocess
import sys
import argparse
from pathlib import Path

SKILL_NAME = "whisper"
WHISPER_BIN = "whisper"
OUTPUT_DIR = "/root/.openclaw/workspace/transcriptions"

def ensure_output_dir():
    """Create output directory if needed"""
    Path(OUTPUT_DIR).mkdir(parents=True, exist_ok=True)

def check_installation():
    """Check if whisper is installed"""
    try:
        result = subprocess.run([WHISPER_BIN, '--help'], capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            return True, "Whisper installed and ready"
    except Exception as e:
        return False, f"Whisper not found: {e}"
    return False, "Whisper installation failed"

def list_models():
    """List available Whisper models"""
    models = {
        "tiny":   "Fast, less accurate (~39 MB)",
        "base":   "Balance of speed/accuracy (~74 MB)",
        "small":  "Better accuracy (~244 MB)",
        "medium": "High accuracy (~769 MB)",
        "large":  "Best accuracy (~1550 MB)",
        "turbo":  "Fast optimized model (~~809 MB)"
    }
    
    print(f"\n🎙️ Whisper Transcription Models")
    print("="*50)
    for model, desc in models.items():
        print(f"  {model:10} - {desc}")
    print("\nDefault: base (good balance)")
    print("="*50)

def transcribe_file(file_path, model="base", language=None, output_format="all"):
    """Transcribe an audio/video file"""
    if not os.path.exists(file_path):
        return {"success": False, "error": f"File not found: {file_path}"}
    
    ensure_output_dir()
    
    cmd = [
        WHISPER_BIN,
        file_path,
        "--model", model,
        "--output_dir", OUTPUT_DIR,
        "--output_format", output_format
    ]
    
    if language:
        cmd.extend(["--language", language])
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
        
        output_files = []
        for fmt in ["txt", "vtt", "srt", "tsv", "json"]:
            ofile = f"{OUTPUT_DIR}/{Path(file_path).stem}.{fmt}"
            if os.path.exists(ofile):
                output_files.append(ofile)
        
        return {
            "success": result.returncode == 0,
            "file": file_path,
            "model": model,
            "output_dir": OUTPUT_DIR,
            "output_files": output_files,
            "stdout": result.stdout,
            "stderr": result.stderr
        }
    except subprocess.TimeoutExpired:
        return {"success": False, "error": "Transcription timed out"}
    except Exception as e:
        return {"success": False, "error": str(e)}

def transcribe_youtube(url, model="base"):
    """Download and transcribe YouTube video"""
    ensure_output_dir()
    
    print(f"📥 Downloading YouTube: {url}")
    
    # Check for yt-dlp
    try:
        subprocess.run(["which", "yt-dlp"], capture_output=True, check=True)
    except subprocess.CalledProcessError:
        print("Installing yt-dlp...")
        subprocess.run(["pip", "install", "--break-system-packages", "yt-dlp"], capture_output=True)
    
    # Download audio
    output_template = f"{OUTPUT_DIR}/%(title)s.%(ext)s"
    try:
        subprocess.run([
            "yt-dlp", "-x", "--audio-format", "mp3",
            "-o", output_template, url
        ], capture_output=True, timeout=300)
        
        # Find downloaded file
        downloaded = list(Path(OUTPUT_DIR).glob("*.mp3"))
        if not downloaded:
            return {"success": False, "error": "Download failed"}
        
        audio_file = str(downloaded[0])
        print(f"🎙️ Transcribing: {Path(audio_file).name}")
        
        return transcribe_file(audio_file, model=model)
        
    except Exception as e:
        return {"success": False, "error": str(e)}

def main():
    parser = argparse.ArgumentParser(description="Whisper Transcription")
    parser.add_argument("command", choices=["transcribe", "status", "models", "url"],
                       help="Command to run")
    parser.add_argument("target", nargs="?", help="File URL or path")
    parser.add_argument("--model", default="base", help="Whisper model")
    parser.add_argument("--lang", help="Language code")
    
    args = parser.parse_args()
    
    if args.command == "status":
        installed, msg = check_installation()
        print(f"{'✅' if installed else '❌'} {msg}")
        ensure_output_dir()
        print(f"📁 Output dir: {OUTPUT_DIR}")
        return 0 if installed else 1
    
    elif args.command == "models":
        list_models()
        return 0
    
    elif args.command == "url" or (args.command == "transcribe" and args.target and (args.target.startswith("http") or "youtube" in args.target.lower() or "youtu.be" in args.target)):
        url = args.target
        result = transcribe_youtube(url, model=args.model)
        
    elif args.command == "transcribe":
        if not args.target:
            print("Usage: transcribe <file> [--model tiny|base|small|medium|large]")
            return 1
        result = transcribe_file(args.target, model=args.model, language=args.lang)
    
    if result.get("success"):
        print(f"\n✅ Transcription Complete!")
        print(f"📁 Output: {result['output_dir']}")
        print(f"\n📄 Files generated:")
        for f in result.get("output_files", []):
            print(f"   {f}")
    else:
        print(f"\n❌ Error: {result.get('error')}")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
