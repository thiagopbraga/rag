import { Router } from "express";
import { generateRAGResponse, generateRAGStreamingResponse } from "../services/rag.js";

export const queryRouter = Router();

queryRouter.post("/", async (req, res) => {
  try {
    const { question, topK } = req.body;
    const result = await generateRAGResponse({ question, topK });
    res.status(200).json(result);
  } catch (error) {
    console.error("Error processing query:", error);
    res.status(500).json({ error: "Erro ao processar a consulta" });
  }
});

queryRouter.post("/stream", async (req, res) => {
  const startTime = Date.now();
  const { question, topK } = req.body;
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  await generateRAGStreamingResponse({ question, topK, res });

  const duration = Date.now() - startTime;
  console.log(`Query processed in ${duration}ms`);
});
