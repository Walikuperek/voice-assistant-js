#!/usr/bin/env python3
"""
Transcribe an audio file using faster-whisper.
Usage: python whisper.py <audio_file>

Install: pip install faster-whisper
"""

import sys
import os

def transcribe(audio_path: str, model_size: str = "base") -> str:
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        print("ERROR: faster-whisper not installed. Run: pip install faster-whisper", file=sys.stderr)
        sys.exit(1)

    if not os.path.exists(audio_path):
        print(f"ERROR: Audio file not found: {audio_path}", file=sys.stderr)
        sys.exit(1)

    model = WhisperModel(model_size, compute_type="int8")
    segments, _ = model.transcribe(audio_path)

    return "".join(segment.text for segment in segments).strip()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python whisper.py <audio_file> [model_size]", file=sys.stderr)
        sys.exit(1)

    audio_file = sys.argv[1]
    model_size = sys.argv[2] if len(sys.argv) > 2 else os.environ.get("WHISPER_MODEL", "base")

    result = transcribe(audio_file, model_size)
    print(result)
