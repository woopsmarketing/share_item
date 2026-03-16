import { searchKnowledge } from './vector-store'

/**
 * 질문과 관련된 문서를 검색하여 컨텍스트 문자열로 반환
 */
export async function retrieveContext(query: string): Promise<string> {
  const results = await searchKnowledge(query)

  if (results.length === 0) {
    return ''
  }

  return results
    .map((r, i) => `[문서 ${i + 1}] (관련도: ${(r.score * 100).toFixed(0)}%)\n${r.content}`)
    .join('\n\n')
}

/**
 * SYSTEM_PROMPT의 {context} 자리에 검색 결과를 주입
 */
export function injectContext(systemPrompt: string, context: string): string {
  if (!context) {
    return systemPrompt.replace('{context}', '관련 문서를 찾지 못했습니다.')
  }
  return systemPrompt.replace('{context}', context)
}
