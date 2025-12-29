import { config } from "../config.js";
import { qdrantClient } from "./qdrant.js";
import { embeddings } from "./openai.js";
import type { QueryRequest, QueryResponse, SearchResult } from "../types.js";

// função: recuperar chunks relevantes a partir de uma query
export async function searchDocuments({
  question,
  topK = 3,
}: QueryRequest): Promise<QueryResponse> {
  const queryVector = await embeddings.embedQuery(question);

  const searchResult = await qdrantClient.search(config.qdrant.collectionName, {
    vector: queryVector,
    limit: topK,
    with_payload: true,
  });

  // mapear os resultados para o formato SearchResult
  const results: SearchResult[] = searchResult.map((item) => ({
    id: item.id as string,
    text: item.payload?.text as string,
    score: item.score,
    metadata: {
      documentId: item.payload?.documentId as string,
      fileName: item.payload?.fileName as string,
      page: item.payload?.page as number,
      chunkIndex: item.payload?.chunkIndex as number,
    },
  }));

  return {
    question,
    answers: results,
    countChunks: results.length,
  };
}
