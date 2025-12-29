import { Router } from "express";
import {
  generateRAGResponse,
  generateRAGStreamingResponse,
} from "../services/rag.js";
import * as z from "zod";

export const queryRouter = Router();

const querySchema = z.object({
  question: z
    .string()
    .min(1, "A pergunta não pode estar vazia")
    .max(1000, "A pergunta é muito longa. O limite é de 1000 caracteres."),
  topK: z.number().min(1).max(10).optional().default(3),
});

queryRouter.post("/", async (req, res) => {
  try {
    const { question, topK } = querySchema.parse(req.body);
    const result = await generateRAGResponse({ question, topK });
    res.status(200).json(result);
  } catch (error) {
    console.error("Error processing query:", error);
    res.status(500).json({ error: "Erro ao processar a consulta" });
  }
});

queryRouter.post("/stream", async (req, res) => {
  const startTime = Date.now();
  const { question, topK } = querySchema.parse(req.body);
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  await generateRAGStreamingResponse({ question, topK, res });

  const duration = Date.now() - startTime;
  console.log(`Query processed in ${duration}ms`);
});
