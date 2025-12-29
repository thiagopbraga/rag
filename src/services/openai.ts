import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { config } from "../config.js";

// vetorização dos textos
export const embeddings = new OpenAIEmbeddings({
  openAIApiKey: config.openai.apiKey,
  model: "text-embedding-3-small",
  maxRetries: 2,
  timeout: 10000,
});

// processamento das conversas
export const llm = new ChatOpenAI({
  openAIApiKey: config.openai.apiKey,
  modelName: "gpt-4o-mini",
  temperature: 0,
  maxRetries: 2,
  timeout: 20000,
});
