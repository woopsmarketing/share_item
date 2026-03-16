import { vectorIndex, CACHE_NAMESPACE } from './upstash'
import { getEmbedding } from './embeddings'
import { CACHE_CONFIG } from './config'

interface CacheHit {
  answer: string
  score: number
}

/**
 * 유사한 질문이 캐시에 있는지 확인
 * 캐시 히트 시 LLM 호출 없이 바로 답변 반환 → 비용 절감
 */
export async function findCachedAnswer(question: string): Promise<CacheHit | null> {
  const queryVector = await getEmbedding(question)
  const ns = vectorIndex.namespace(CACHE_NAMESPACE)

  const results = await ns.query({
    vector: queryVector,
    topK: 1,
    includeMetadata: true,
  })

  if (results.length === 0) return null

  const top = results[0]
  if (top.score < CACHE_CONFIG.similarityThreshold) return null

  const metadata = top.metadata as { answer?: string; createdAt?: number } | undefined
  if (!metadata?.answer) return null

  // TTL 만료 확인
  if (metadata.createdAt && Date.now() - metadata.createdAt > CACHE_CONFIG.ttlMs) {
    return null
  }

  return {
    answer: metadata.answer,
    score: top.score,
  }
}

/**
 * Q&A 쌍을 캐시에 저장
 * 다음에 같은/유사한 질문이 오면 LLM 호출 없이 반환
 */
export async function cacheAnswer(question: string, answer: string): Promise<void> {
  const questionVector = await getEmbedding(question)
  const id = `cache_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const ns = vectorIndex.namespace(CACHE_NAMESPACE)

  await ns.upsert({
    id,
    vector: questionVector,
    metadata: {
      question,
      answer,
      createdAt: Date.now(),
    },
  })
}
