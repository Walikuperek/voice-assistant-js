const mic = require("mic");
const fs = require("fs");
const path = require("path");
const os = require("os");

/**
 * Record audio from the microphone for a fixed duration.
 * @param {object} options
 * @param {number} [options.duration=4000] - Recording duration in ms
 * @param {string} [options.outputPath] - Output .wav file path (defaults to tmp)
 * @returns {Promise<string>} Path to the recorded .wav file
 */
function record({ duration = 4000, outputPath } = {}) {
  return new Promise((resolve, reject) => {
    const filePath = outputPath ?? path.join(os.tmpdir(), `va-input-${Date.now()}.wav`);

    const micInstance = mic({
      rate: "16000",
      channels: "1",
      fileType: "wav",
    });

    const audioStream = micInstance.getAudioStream();
    const outputFile = fs.createWriteStream(filePath);

    audioStream.pipe(outputFile);

    audioStream.on("error", (err) => reject(err));

    micInstance.start();

    setTimeout(() => {
      micInstance.stop();
      outputFile.end();
      outputFile.on("finish", () => resolve(filePath));
    }, duration);
  });
}

module.exports = record;
