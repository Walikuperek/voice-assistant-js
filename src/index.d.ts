export interface VoiceAssistantOptions {
  /** Speech-to-text engine (default: "whisper") */
  stt?: "whisper";
  /** LLM backend (default: "ollama") */
  llm?: "ollama";
  /** Text-to-speech engine (default: "piper") */
  tts?: "piper";
  /** Ollama model name (default: "llama3") */
  model?: string;
  /** Piper voice model name (default: "en_US-lessac-medium") */
  voice?: string;
  /** Recording duration in milliseconds (default: 4000) */
  listenDuration?: number;
  /** System prompt for the LLM */
  systemPrompt?: string;
  /** Enable verbose logging (default: false) */
  verbose?: boolean;
}

export interface CycleResult {
  /** What the user said */
  input: string;
  /** What the AI responded */
  response: string;
}

export declare class VoiceAssistant {
  constructor(options?: VoiceAssistantOptions);

  /** Run one full listen → think → speak cycle */
  once(): Promise<CycleResult>;

  /** Start a continuous conversation loop */
  start(): Promise<void>;

  /** Stop the continuous loop */
  stop(): void;
}
