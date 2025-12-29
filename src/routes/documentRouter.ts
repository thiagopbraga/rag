import { Router } from "express";
import { uploadMiddleware } from "../middlewares/uplaodMiddleware.js";
import { processDocument } from "../services/document.js";
import fs from "node:fs/promises";

export const documentRouter = Router();

documentRouter.post(
  "/upload",
  uploadMiddleware.single("file"),
  async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const result = await processDocument(file.path, file.originalname);
      await fs.unlink(file.path);

      res.status(200).json(result);
    } catch (error) {
      console.log("Error processing document upload:", error);
      res
        .status(500)
        .json({ error: "Error processing document upload" });
    }
  }
);
