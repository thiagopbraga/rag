import { llm } from "./openai.js";
import { searchDocuments } from "./query.js";
import type { QueryRequest, RAGResponse } from "../types.js";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import type { Response } from "express";

const PROMPT_TEMPLATE = ChatPromptTemplate.fromMessages([
  [
    "system",
    `
      Você é um assistente de IA que responde perguntas com base em documentos fornecidos.

      Regras:
      - use apenas as informações dos documentos para responder.
      - Se a informação não estiver nos documentos, responda: "Desculpa, não encontrei informações relevantes para sua pergunta."
      - Formaneça respostas concisas e diretas.
      - Cite as fontes usadas na resposta no oformato [1], [2], etc.
      - Responda em português brasileiro.
    `,
  ],
  [
    "user",
    `
      COTEXT:
      {context}
      QUESTION:
      {question}
      ANSWER:
    `,
  ],
]);

export async function generateRAGResponse({
  question,
  topK = 3,
}: QueryRequest): Promise<RAGResponse> {
  const searchResults = await searchDocuments({ question, topK });

  if (searchResults.answers.length === 0) {
    return {
      question,
      answer:
        "Desculpe, não consegui encontrar informações relevantes para sua pergunta.",
    };
  }

  // Consturir o contexto apartir dos resultados da busca
  const context = searchResults.answers
    .map((item, idx) => `[${idx + 1}]: ${item.text}`)
    .join("\n\n");

  const chains = PROMPT_TEMPLATE.pipe(llm).pipe(new StringOutputParser());

  const answer = await chains.invoke({
    context,
    question,
  });

  const sources = searchResults.answers.map((item, idx) => ({
    fileName: item.metadata.fileName,
    page: item.metadata.page,
    score: item.score,
  }));

  return {
    question,
    answer,
    sources,
  };
}

export async function generateRAGStreamingResponse({
  question,
  topK = 3,
  res,
}: QueryRequest & { res: Response }): Promise<void> {
  const searchResults = await searchDocuments({ question, topK });

  if (searchResults.answers.length === 0) {
    res.write(
      `data: ${JSON.stringify({
        answer: "Sorry, I couldn't find any information for your question.",
      })}\n\n`
    );
    res.write("data: [DONE]\n\n");
    res.end();
    return;
  }

  const sources = searchResults.answers.map((item) => ({
    fileName: item.metadata.fileName,
    page: item.metadata.page,
    score: item.score,
  }));
  
  res.write(`data: ${JSON.stringify({ type: "sources", content: sources })}\n\n`);

  const context = searchResults.answers
    .map((item, idx) => `[${idx + 1}]: ${item.text}`)
    .join("\n\n");  

  const chains = PROMPT_TEMPLATE.pipe(llm).pipe(new StringOutputParser());

  const stream = await chains.stream({
    context,
    question,
  });

  for await (const chunk of stream) {
    res.write(`data: ${JSON.stringify({ type: "token", content: chunk })}\n\n`);
  }

  res.write("data: [DONE]\n\n");
  res.end();

}
