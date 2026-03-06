# Changelog

## [0.1.0] - 2026-03-06

### Initial release

- `VoiceAssistant` class with `start()`, `once()`, `stop()` API
- Whisper STT via `faster-whisper` Python bridge
- Ollama LLM backend with configurable model and system prompt
- Piper TTS with configurable voice model
- CLI with `--once`, `--model`, `--voice`, `--duration`, `--verbose` flags
- `check` command to verify dependencies
- TypeScript type definitions
- Cross-platform audio playback (macOS, Linux, Windows)
