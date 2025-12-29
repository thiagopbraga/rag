import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { v4 as uuidv4 } from "uuid";
import { embeddings } from "./openai.js";
import { qdrantClient } from "./qdrant.js";
import { config } from "../config.js";
import type { UploadResponse } from "../types.js";


const textsplitters = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

export async function processDocument(
  filePath: string,
  fileName: string
): Promise<UploadResponse> {
  // 1. Carregamento do arquivo PDF
  const loader = new PDFLoader(filePath);
  const documents = await loader.load();

  if (documents.length === 0) {
    throw new Error("No documents found in the PDF file.");
  }

  // 2. Divisão do PDF em chunks
  const chunks = await textsplitters.splitDocuments(documents);

  if (chunks.length === 0) {
    throw new Error("No chunks were generated from the document   .");
  }

  // 3. Adicionar alguns metadados nos chunks
  const documentId = uuidv4();
  const documentsChunksWithMetadata = chunks.map((chunk, index) => ({
    id: uuidv4(),
    text: chunk.pageContent,
    metadata: {
      documentId,
      chunkIndex: index,
      fileName,
      uploadedAt: new Date().toISOString(),
      page: chunk.metadata.loc?.pageNumber,
    },
  }));

  // 4. Geração dos embeddings
  const texts = documentsChunksWithMetadata.map((doc) => doc.text);
  const vectors = await embeddings.embedDocuments(texts);

  // 5. Armazenar os embeddings vetorizados de busca no banco de dados
  const data = documentsChunksWithMetadata.map((chunk, idx) => {
    const vector = vectors[idx];

    if (!vector || !Array.isArray(vector)) {
      throw new Error("Error generating vector for chunk.");
    }

    return {
      id: chunk.id,
      vector,
      payload: {
        text: chunk.text,
        ...chunk.metadata,
      },
    };
  });

  await qdrantClient.upsert(config.qdrant.collectionName, {
    points: data,
    wait: true, // para aguardar o processamento
  });

  // 6. Retornar o resultado do upload
  return {
    sucess: true,
    documentId,
    chuncksCount: documentsChunksWithMetadata.length,
    message: "Document processed successfully",
  };
}
