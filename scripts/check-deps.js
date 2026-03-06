#!/usr/bin/env node
"use strict";

const { execSync } = require("child_process");

const checks = [
  {
    name: "Ollama",
    cmd: "ollama --version",
    hint: "Install from https://ollama.com",
  },
  {
    name: "Piper TTS",
    cmd: "piper --help",
    hint: "Install from https://github.com/rhasspy/piper/releases",
  },
  {
    name: "Python 3",
    cmd: "python3 --version",
    hint: "Install from https://python.org",
  },
  {
    name: "faster-whisper (Python)",
    cmd: "python3 -c \"import faster_whisper\"",
    hint: "Run: pip install faster-whisper",
  },
];

console.log("🔍 Checking dependencies...\n");

let allGood = true;

for (const check of checks) {
  try {
    execSync(check.cmd, { stdio: "pipe" });
    console.log(`  ✅ ${check.name}`);
  } catch {
    console.log(`  ❌ ${check.name} — ${check.hint}`);
    allGood = false;
  }
}

console.log();

if (allGood) {
  console.log("✨ All dependencies found. You're good to go!");
  console.log("   Run: npm start\n");
} else {
  console.log("⚠️  Some dependencies are missing. See hints above.");
  process.exit(1);
}
