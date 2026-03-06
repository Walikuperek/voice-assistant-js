const { VoiceAssistant } = require("@quak.lib/voice-assistant-js");

// Custom model, voice, and system prompt
const assistant = new VoiceAssistant({
  model: "mistral",
  voice: "en_US-ryan-high",
  listenDuration: 6000,
  verbose: true,
  systemPrompt:
    "You are a concise assistant. Answer in one or two sentences maximum.",
});

// Run a single cycle instead of looping
assistant
  .once()
  .then(({ input, response }) => {
    console.log("\n--- Summary ---");
    console.log("Input:", input);
    console.log("Response:", response);
  })
  .catch(console.error);
