// utils/vectorStore.ts
import faiss from 'faiss-node';
import { getEmbeddings } from '../utility/embedded';

export async function searchSimilarDocuments(embeddings: number[][], query: string): Promise<string[]> {
  const queryEmbedding = await getEmbeddings([query]);

  // Create an instance of IndexFlatL2
  const index = new faiss.IndexFlatL2(embeddings[0].length);

  // Add vectors to index
  for (const embedding of embeddings) {
    index.add(new Float32Array(embedding));
  }

  // Perform search
  const k = 5; // Number of top matches to return
  const result = index.search(new Float32Array(queryEmbedding[0]), k);

  // Mocked document retrieval based on indices
  const documents = ['doc1', 'doc2', 'doc3', 'doc4', 'doc5'];
  return result.labels.map((i) => documents[i]);
}
