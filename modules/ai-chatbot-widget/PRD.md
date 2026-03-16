# PRD — ai-chatbot-widget

## 1. 개요
플랫폼에 삽입 가능한 24시간 AI 챗봇 위젯.
RAG 구조로 설계하여 벡터 DB 컨텍스트만 교체하면 다른 프로젝트에 즉시 적용 가능.

---

## 2. 기능 요구사항

### 2.1 위젯 UI
- [x] 화면 우하단 플로팅 버튼 (고정 위치)
- [x] 버튼 클릭 시 채팅 패널 열기/닫기
- [x] 채팅 패널: 메시지 목록 + 입력 폼
- [ ] 모바일 반응형 전체화면 모드

### 2.2 채팅 기능
- [x] 메시지 전송 (Enter 키 + 전송 버튼)
- [x] AI 응답 스트리밍 (Vercel AI SDK useChat)
- [x] 대화 히스토리 유지 (세션 단위)
- [x] 로딩 인디케이터 (바운싱 점 3개)

### 2.3 RAG 파이프라인
- [x] 벡터 검색 추상화 인터페이스 (`VectorStore`)
- [x] Mock 구현체로 로컬 테스트 가능
- [ ] 실제 벡터 DB 연동 (Pinecone 또는 Supabase pgvector)
- [ ] OpenAI 임베딩으로 쿼리 벡터화

---

## 3. API 명세

### POST /api/chat
**Runtime:** Edge

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "질문 내용" }
  ]
}
```

**Response:** `text/event-stream` (Vercel AI SDK Data Stream 형식)

**처리 흐름:**
1. 마지막 사용자 메시지 추출
2. `retrieveContext()` → 벡터 DB 검색
3. `injectContext()` → SYSTEM_PROMPT에 컨텍스트 주입
4. OpenAI API 스트리밍 호출
5. DataStreamResponse 반환

---

## 4. RAG 파이프라인 흐름

```
사용자 질문
    ↓
vectorStore.search(query, topK)  ← MockVectorStore or 실제 구현체
    ↓
검색 결과 → 문자열로 포맷팅
    ↓
SYSTEM_PROMPT의 {context} 자리에 주입
    ↓
openai(model) + streamText()
    ↓
toDataStreamResponse() → 클라이언트 스트리밍
```

---

## 5. 커스텀 포인트

| 항목 | 파일 | 설명 |
|------|------|------|
| SYSTEM_PROMPT | `src/lib/config.ts` | 서비스 성격, 어투, 역할 정의. `{context}` 유지 필수 |
| LLM 모델 | `src/lib/config.ts` | `model` 필드 변경 |
| 위젯 제목 | `src/lib/config.ts` | `title` 필드 변경 |
| 벡터 DB | `src/lib/vector-store.ts` | `MockVectorStore` → 실제 구현체로 교체 |
| 임베딩 문서 | 벡터 DB 내 컬렉션 | 프로젝트 FAQ, 정책, 서비스 설명 임베딩 |
| 브랜드 컬러 | 컴포넌트 `bg-blue-600` | Tailwind 클래스 일괄 교체 |
| API 키 | `.env.local` | OPENAI_API_KEY 등 |

---

## 6. 비기능 요구사항
- 응답 시작까지 < 2초 (Edge Runtime 활용)
- API 키 환경변수로만 관리 (하드코딩 절대 금지)
- 위젯 UI: 클라이언트 컴포넌트 / API: 서버 사이드 (Edge)

---

## 7. 제외 범위 (현재 버전)
- 대화 히스토리 DB 영구 저장 (세션 메모리만)
- 다국어 지원
- 관리자 대화 모니터링 UI
- npm 패키지 배포
