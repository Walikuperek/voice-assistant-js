# @quak.lib/voice-assistant-js

> Your own local Jarvis. Zero cloud. Zero API keys. Just your voice.

```
🎤 you speak  →  🧠 AI thinks  →  🔊 it responds
```

Built on [Whisper](https://github.com/SYSTRAN/faster-whisper) + [Ollama](https://ollama.com) + [Piper TTS](https://github.com/rhasspy/piper). Runs entirely on your machine.

---

## Quick start

```bash
npm install @quak.lib/voice-assistant-js
```

```js
const { VoiceAssistant } = require("@quak.lib/voice-assistant-js");

const assistant = new VoiceAssistant();
assistant.start();
```

```
🎤 Listening...
You: what's the capital of France
AI: Paris is the capital of France.
🔊 ...
---
🎤 Listening...
```

---

## Prerequisites

You need three things installed locally:

### 1. Ollama (the brain)

```bash
# Install from https://ollama.com
ollama pull llama3
```

### 2. Piper TTS (the voice)

Download the binary for your platform from the [Piper releases page](https://github.com/rhasspy/piper/releases), then add it to your PATH.

Download a voice model (`.onnx` file) from [Hugging Face](https://huggingface.co/rhasspy/piper-voices) and place it in `~/.local/share/piper-voices/`.

```bash
# Example: download the default voice
mkdir -p ~/.local/share/piper-voices
wget https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx \
  -O ~/.local/share/piper-voices/en_US-lessac-medium.onnx
```

### 3. faster-whisper (the ears)

```bash
pip install faster-whisper
```

### Verify everything works

```bash
npx @quak.lib/voice-assistant-js check
```

---

## API

### `new VoiceAssistant(options?)`

| Option | Type | Default | Description |
|---|---|---|---|
| `model` | `string` | `"llama3"` | Ollama model to use |
| `voice` | `string` | `"en_US-lessac-medium"` | Piper voice model name |
| `listenDuration` | `number` | `4000` | Microphone recording time (ms) |
| `systemPrompt` | `string` | *(built-in)* | System prompt for the LLM |
| `verbose` | `boolean` | `false` | Enable debug logging |

### Methods

**`assistant.start()`** — Start a continuous listen → think → speak loop. Runs until `assistant.stop()` or Ctrl+C.

**`assistant.once()`** — Run exactly one cycle. Returns `{ input, response }`.

**`assistant.stop()`** — Stop the continuous loop.

---

## CLI

```bash
# Start the assistant
npx @quak.lib/voice-assistant-js

# One-shot mode
npx @quak.lib/voice-assistant-js --once

# Custom model and voice
npx @quak.lib/voice-assistant-js --model mistral --voice en_US-ryan-high

# Longer listening window
npx @quak.lib/voice-assistant-js --duration 6000

# Check dependencies
npx @quak.lib/voice-assistant-js check
```

---

## Examples

### Basic loop

```js
const { VoiceAssistant } = require("@quak.lib/voice-assistant-js");

const assistant = new VoiceAssistant();
assistant.start();
```

### Custom model and persona

```js
const { VoiceAssistant } = require("@quak.lib/voice-assistant-js");

const assistant = new VoiceAssistant({
  model: "mistral",
  voice: "en_US-ryan-high",
  listenDuration: 6000,
  systemPrompt: "You are a sarcastic assistant. Keep answers under two sentences.",
});

assistant.start();
```

### One-shot (great for scripts)

```js
const { VoiceAssistant } = require("@quak.lib/voice-assistant-js");

const assistant = new VoiceAssistant({ model: "llama3" });

const { input, response } = await assistant.once();
console.log(`You said: "${input}"`);
console.log(`AI said: "${response}"`);
```

---

## Pipeline

```
Microphone
    │
    ▼
listen.js   — records audio via mic npm package
    │
    ▼
scripts/whisper.py  — transcribes with faster-whisper (Python)
    │
    ▼
src/llm.js  — sends text to Ollama, gets response
    │
    ▼
src/tts.js  — converts response to speech via Piper
    │
    ▼
Speaker
```

---

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `OLLAMA_URL` | `http://localhost:11434` | Ollama server URL |
| `PIPER_MODELS_DIR` | `~/.local/share/piper-voices` | Directory with `.onnx` voice files |
| `WHISPER_MODEL` | `base` | Whisper model size (`tiny`, `base`, `small`, `medium`, `large`) |

---

## Roadmap

- [ ] Voice Activity Detection (VAD) — stop recording on silence instead of fixed timer
- [ ] Streaming responses — speak while the LLM is still generating
- [ ] Wake word support (`"hey computer"`) via Porcupine
- [ ] Tool use — let the assistant run shell commands, open URLs, search files
- [ ] macOS / Windows installer scripts

---

## License

MIT © [quak.lib](https://github.com/quak-lib)
