import multer from "multer";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";
import { config } from "../config.js";

const storage = multer.diskStorage({
  destination: config.uploads.directory,
  filename: (_, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: config.uploads.maxFileSizeMB },
  fileFilter: (_, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      cb(new Error("Just PDF files are allowed"));
    }
    cb(null, true);
  },
});
