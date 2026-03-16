import ChatWidget from '@/components/ChatWidget'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          AI 챗봇 위젯 데모
        </h1>
        <p className="text-gray-600 mb-8">
          우하단 버튼을 클릭하여 챗봇을 열어보세요.
        </p>
        <div className="bg-white rounded-2xl shadow p-6 text-left text-sm text-gray-500">
          <p className="font-semibold text-gray-700 mb-2">커스텀 방법:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li><code className="bg-gray-100 px-1 rounded">.env.local</code>에 OPENAI_API_KEY 설정</li>
            <li><code className="bg-gray-100 px-1 rounded">src/lib/config.ts</code>에서 SYSTEM_PROMPT 수정</li>
            <li><code className="bg-gray-100 px-1 rounded">src/lib/vector-store.ts</code>에서 벡터 DB 연결</li>
          </ol>
        </div>
      </div>

      <ChatWidget />
    </main>
  )
}
