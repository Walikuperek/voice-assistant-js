const fetch = require("node-fetch");

const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://localhost:11434";

/**
 * Send a prompt to a local Ollama model and get a response.
 * Requires Ollama running locally: https://ollama.com
 *
 * @param {string} prompt - User input
 * @param {object} options
 * @param {string} [options.model="llama3"] - Ollama model name
 * @param {string} [options.systemPrompt] - System prompt
 * @returns {Promise<string>} LLM response text
 */
async function askLLM(prompt, { model = "llama3", systemPrompt } = {}) {
  const body = {
    model,
    prompt: systemPrompt ? `${systemPrompt}\n\nUser: ${prompt}\nAssistant:` : prompt,
    stream: false,
  };

  let res;
  try {
    res = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw new Error(
      `Could not connect to Ollama at ${OLLAMA_URL}. Is it running? (ollama serve)`
    );
  }

  if (!res.ok) {
    throw new Error(`Ollama returned HTTP ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  return data.response?.trim() ?? "";
}

module.exports = askLLM;
