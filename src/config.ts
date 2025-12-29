import dotenv from "dotenv";

dotenv.config();

const FILE_SIZE_LIMIT_20MB = 20 * 1024 * 1024;

export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
  },
  qdrant: {
    apirl: process.env.QDRANT_API_URL || "http://localhost:6333",
    collectionName: process.env.QDRANT_COLLECTION || "documents",
  },
  server: {
    port: process.env.PORT || 3000,
  },
  uploads: {
    directory: process.env.UPLOAD_DIR || "./uploads",
    maxFileSizeMB: FILE_SIZE_LIMIT_20MB,
  },

};
