import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { CHAT_CONFIG } from '@/lib/config'
import { retrieveContext, injectContext } from '@/lib/rag'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  // 마지막 사용자 메시지로 컨텍스트 검색
  const lastUserMessage = messages.findLast(
    (m: { role: string }) => m.role === 'user'
  )
  const context = lastUserMessage
    ? await retrieveContext(lastUserMessage.content)
    : ''

  const systemPrompt = injectContext(CHAT_CONFIG.systemPrompt, context)

  const result = streamText({
    model: openai(CHAT_CONFIG.model),
    system: systemPrompt,
    messages,
  })

  return result.toDataStreamResponse()
}
