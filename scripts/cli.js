#!/usr/bin/env node
"use strict";

const { VoiceAssistant } = require("../src/index");

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
@quak.lib/voice-assistant-js

Usage:
  voice-assistant [options]

Options:
  --model <name>      Ollama model to use (default: llama3)
  --voice <name>      Piper voice model (default: en_US-lessac-medium)
  --duration <ms>     Listen duration in milliseconds (default: 4000)
  --once              Run one cycle and exit
  --verbose           Enable debug logging
  --help              Show this help message

Examples:
  voice-assistant
  voice-assistant --model mistral --once
  voice-assistant --duration 6000 --verbose
`);
  process.exit(0);
}

function getArg(flag, defaultValue) {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : defaultValue;
}

const assistant = new VoiceAssistant({
  model: getArg("--model", "llama3"),
  voice: getArg("--voice", "en_US-lessac-medium"),
  listenDuration: parseInt(getArg("--duration", "4000"), 10),
  verbose: args.includes("--verbose"),
});

process.on("SIGINT", () => {
  assistant.stop();
  process.exit(0);
});

if (args.includes("--once")) {
  assistant.once().then(() => process.exit(0)).catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
  });
} else {
  assistant.start().catch((err) => {
    console.error("Fatal error:", err.message);
    process.exit(1);
  });
}
