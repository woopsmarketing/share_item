import { vectorIndex, KNOWLEDGE_NAMESPACE } from './upstash'
import { getEmbedding } from './embeddings'
import { RAG_CONFIG } from './config'

export interface VectorSearchResult {
  content: string
  score: number
  metadata?: Record<string, unknown>
}

/**
 * Upstash Vector에서 질문과 관련된 문서 검색
 */
export async function searchKnowledge(query: string): Promise<VectorSearchResult[]> {
  const queryVector = await getEmbedding(query)
  const ns = vectorIndex.namespace(KNOWLEDGE_NAMESPACE)

  const results = await ns.query({
    vector: queryVector,
    topK: RAG_CONFIG.topK,
    includeMetadata: true,
  })

  return results
    .filter((r) => r.metadata && (r.metadata as Record<string, unknown>).content)
    .map((r) => ({
      content: (r.metadata as Record<string, unknown>).content as string,
      score: r.score,
      metadata: r.metadata as Record<string, unknown>,
    }))
}
