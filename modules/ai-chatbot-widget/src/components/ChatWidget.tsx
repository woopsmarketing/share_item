'use client'

import { useState } from 'react'
import { useChat } from 'ai/react'
import { Message } from '@/types/chat'
import FloatingButton from './FloatingButton'
import ChatWindow from './ChatWindow'
import { CHAT_CONFIG } from '@/lib/config'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  const { messages, isLoading, append } = useChat({
    api: '/api/chat',
  })

  const handleSend = (text: string) => {
    append({ role: 'user', content: text })
  }

  // Vercel AI SDK messages를 내부 Message 타입으로 변환
  const chatMessages: Message[] = messages.map((m) => ({
    id: m.id,
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }))

  return (
    <>
      {isOpen && (
        <ChatWindow
          title={CHAT_CONFIG.title}
          messages={chatMessages}
          isLoading={isLoading}
          placeholder={CHAT_CONFIG.placeholder}
          onSend={handleSend}
        />
      )}
      <FloatingButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
    </>
  )
}
