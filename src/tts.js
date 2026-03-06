const { execSync } = require("child_process");
const path = require("path");
const os = require("os");

/**
 * Convert text to speech using Piper TTS and play it.
 * Requires Piper installed: https://github.com/rhasspy/piper
 * And a voice model .onnx file.
 *
 * Install a voice:
 *   See https://huggingface.co/rhasspy/piper-voices
 *   Default: en_US-lessac-medium
 *
 * @param {string} text - Text to speak
 * @param {object} options
 * @param {string} [options.voice="en_US-lessac-medium"] - Piper voice model name
 * @param {string} [options.modelsDir] - Directory containing .onnx voice files
 */
async function speak(text, { voice = "en_US-lessac-medium", modelsDir } = {}) {
  const resolvedModelsDir =
    modelsDir ??
    process.env.PIPER_MODELS_DIR ??
    path.join(os.homedir(), ".local", "share", "piper-voices");

  const modelPath = path.join(resolvedModelsDir, `${voice}.onnx`);
  const outputFile = path.join(os.tmpdir(), `va-output-${Date.now()}.wav`);

  // Sanitize text to prevent shell injection
  const safeText = text.replace(/"/g, "'").replace(/`/g, "").replace(/\$/g, "");

  try {
    execSync(
      `echo "${safeText}" | piper --model "${modelPath}" --output_file "${outputFile}"`,
      { timeout: 15000 }
    );

    // Play the wav file (cross-platform)
    const platform = os.platform();
    if (platform === "darwin") {
      execSync(`afplay "${outputFile}"`);
    } else if (platform === "linux") {
      execSync(`aplay "${outputFile}" 2>/dev/null || paplay "${outputFile}"`);
    } else if (platform === "win32") {
      execSync(
        `powershell -c (New-Object Media.SoundPlayer '"${outputFile}"').PlaySync()`
      );
    }
  } catch (err) {
    throw new Error(
      `TTS failed. Is Piper installed and is the voice model at ${modelPath}?\n${err.message}`
    );
  }
}

module.exports = speak;
