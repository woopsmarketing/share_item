import { vectorStore } from './vector-store'
import { RAG_CONFIG } from './config'

// 벡터 검색으로 관련 컨텍스트를 가져와 문자열로 반환
export async function retrieveContext(query: string): Promise<string> {
  const results = await vectorStore.search(query, RAG_CONFIG.topK)

  if (results.length === 0) {
    return ''
  }

  return results
    .map((r, i) => `[문서 ${i + 1}]\n${r.content}`)
    .join('\n\n')
}

// SYSTEM_PROMPT의 {context} 자리에 검색 결과를 주입
export function injectContext(systemPrompt: string, context: string): string {
  if (!context) {
    return systemPrompt.replace('{context}', '관련 문서를 찾지 못했습니다.')
  }
  return systemPrompt.replace('{context}', context)
}
