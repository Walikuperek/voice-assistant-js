const { execSync } = require("child_process");
const path = require("path");

const WHISPER_SCRIPT = path.join(__dirname, "..", "scripts", "whisper.py");

/**
 * Transcribe an audio file to text using faster-whisper.
 * Requires Python + faster-whisper installed:
 *   pip install faster-whisper
 *
 * @param {string} audioFile - Path to a .wav audio file
 * @returns {Promise<string>} Transcribed text
 */
async function transcribe(audioFile) {
  try {
    const result = execSync(`python "${WHISPER_SCRIPT}" "${audioFile}"`, {
      encoding: "utf-8",
      timeout: 30000,
    });
    return result.trim();
  } catch (err) {
    throw new Error(`Whisper transcription failed: ${err.message}`);
  }
}

module.exports = transcribe;
