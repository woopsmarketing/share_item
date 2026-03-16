import { embed } from 'ai'
import { openai } from '@ai-sdk/openai'
import { RAG_CONFIG } from './config'

export async function getEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: openai.embedding(RAG_CONFIG.embeddingModel),
    value: text,
  })
  return embedding
}
