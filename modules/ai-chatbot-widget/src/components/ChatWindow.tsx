'use client'

import { useRef, useEffect } from 'react'
import { Message } from '@/types/chat'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'

interface ChatWindowProps {
  title: string
  messages: Message[]
  isLoading: boolean
  placeholder: string
  onSend: (message: string) => void
}

export default function ChatWindow({
  title,
  messages,
  isLoading,
  placeholder,
  onSend,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[480px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
      {/* 헤더 */}
      <div className="px-4 py-3 bg-blue-600 text-white">
        <h3 className="font-semibold text-sm">{title}</h3>
        <p className="text-xs text-blue-200 mt-0.5">AI 어시스턴트</p>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-8">
            무엇이든 물어보세요!
          </p>
        )}
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start mb-3">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 입력 */}
      <ChatInput onSend={onSend} isLoading={isLoading} placeholder={placeholder} />
    </div>
  )
}
