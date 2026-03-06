const record = require("./listen");
const askLLM = require("./llm");
const speak = require("./tts");
const transcribe = require("./stt");

/**
 * VoiceAssistant — local voice assistant pipeline
 * mic → whisper → ollama → piper
 */
class VoiceAssistant {
  /**
   * @param {object} options
   * @param {"whisper"} [options.stt="whisper"] - Speech-to-text engine
   * @param {"ollama"} [options.llm="ollama"] - LLM backend
   * @param {"piper"} [options.tts="piper"] - Text-to-speech engine
   * @param {string} [options.model="llama3"] - Ollama model name
   * @param {string} [options.voice="en_US-lessac-medium"] - Piper voice model
   * @param {number} [options.listenDuration=4000] - Recording duration in ms
   * @param {string} [options.systemPrompt] - System prompt for the LLM
   * @param {boolean} [options.verbose=false] - Enable verbose logging
   */
  constructor(options = {}) {
    this.stt = options.stt ?? "whisper";
    this.llm = options.llm ?? "ollama";
    this.tts = options.tts ?? "piper";
    this.model = options.model ?? "llama3";
    this.voice = options.voice ?? "en_US-lessac-medium";
    this.listenDuration = options.listenDuration ?? 4000;
    this.systemPrompt = options.systemPrompt ?? "You are a helpful voice assistant. Keep answers short and conversational.";
    this.verbose = options.verbose ?? false;
    this._running = false;
  }

  log(...args) {
    if (this.verbose) console.log("[VoiceAssistant]", ...args);
  }

  /**
   * Run one full listen → think → speak cycle
   * @returns {Promise<{input: string, response: string}>}
   */
  async once() {
    console.log("🎤 Listening...");
    const audioFile = await record({ duration: this.listenDuration });

    this.log("Transcribing...");
    const text = await transcribe(audioFile);
    if (!text.trim()) {
      console.log("⚠️  No speech detected.");
      return { input: "", response: "" };
    }

    console.log("You:", text.trim());

    this.log("Querying LLM...");
    const reply = await askLLM(text, {
      model: this.model,
      systemPrompt: this.systemPrompt,
    });

    console.log("AI:", reply);

    this.log("Speaking...");
    await speak(reply, { voice: this.voice });

    return { input: text.trim(), response: reply };
  }

  /**
   * Start a continuous conversation loop
   */
  async start() {
    this._running = true;
    console.log("🤖 Voice assistant started. Press Ctrl+C to stop.\n");
    while (this._running) {
      await this.once();
      console.log("---");
    }
  }

  /**
   * Stop the continuous loop
   */
  stop() {
    this._running = false;
    console.log("👋 Voice assistant stopped.");
  }
}

module.exports = { VoiceAssistant };
