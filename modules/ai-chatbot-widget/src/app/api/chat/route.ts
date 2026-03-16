import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { CHAT_CONFIG } from '@/lib/config'
import { retrieveContext, injectContext } from '@/lib/rag'
import { findCachedAnswer, cacheAnswer } from '@/lib/semantic-cache'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const lastUserMessage = messages.findLast(
    (m: { role: string }) => m.role === 'user'
  )

  if (!lastUserMessage) {
    return new Response('No user message found', { status: 400 })
  }

  const userQuery = lastUserMessage.content

  // ── Step 1: Semantic Cache 확인 ──
  // 같거나 유사한 질문이 캐시에 있으면 LLM 호출 없이 반환 (비용 $0)
  try {
    const cached = await findCachedAnswer(userQuery)
    if (cached) {
      // useChat 호환을 위해 Vercel AI SDK Data Stream 형식으로 반환
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(
            encoder.encode(`0:${JSON.stringify(cached.answer)}\n`)
          )
          controller.enqueue(
            encoder.encode(
              `d:${JSON.stringify({
                finishReason: 'stop',
                usage: { promptTokens: 0, completionTokens: 0 },
              })}\n`
            )
          )
          controller.close()
        },
      })
      return new Response(stream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    }
  } catch {
    // 캐시 확인 실패 시 무시하고 LLM으로 진행
  }

  // ── Step 2: RAG — 관련 문서 검색 + 컨텍스트 주입 ──
  let context = ''
  try {
    context = await retrieveContext(userQuery)
  } catch {
    // 벡터 검색 실패 시 컨텍스트 없이 진행
  }

  const systemPrompt = injectContext(CHAT_CONFIG.systemPrompt, context)

  // ── Step 3: LLM 호출 (스트리밍) ──
  const result = streamText({
    model: openai(CHAT_CONFIG.model),
    system: systemPrompt,
    messages,
    async onFinish({ text }) {
      // ── Step 4: 응답을 캐시에 저장 (다음 유사 질문 시 재사용) ──
      try {
        await cacheAnswer(userQuery, text)
      } catch {
        // 캐시 저장 실패는 무시 (핵심 기능에 영향 없음)
      }
    },
  })

  return result.toDataStreamResponse()
}
