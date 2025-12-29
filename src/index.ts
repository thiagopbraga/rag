import fs from "node:fs";

import { config } from "./config.js";
import express from "express";
import { queryRouter } from "./routes/queryRouter.js";
import { documentRouter } from "./routes/documentRouter.js";
import { initQdrantCollection } from "./services/qdrant.js";

const app = express();
const port = config.server.port;

app.use(express.json());

app.get("/", (_, res) => {
  res.json({ message: "RAG TLC API is running" });
});
app.use("/query", queryRouter);
app.use("/document", documentRouter);

if(!fs.existsSync(config.uploads.directory)){
  fs.mkdirSync(config.uploads.directory, { recursive: true }); // Ensure parent directories are created as well
  console.log(`Uploads directory created at ${config.uploads.directory}`);
}

async function start() {
  try {
    await initQdrantCollection(); // Ensure Qdrant collection is initialized before starting the server

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
}
start();
