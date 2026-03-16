# ai-chatbot-widget

## 모듈 개요
RAG 기반 24시간 AI 챗봇 위젯. 다른 프로젝트에 복사 후 컨텍스트만 교체하여 재사용.

## 기술 스택
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Vercel AI SDK (`ai`, `@ai-sdk/openai`)
- 벡터 DB: Pinecone 또는 Supabase pgvector (선택)

## 디렉토리 역할

| 경로 | 역할 |
|------|------|
| `src/lib/config.ts` | **커스텀 포인트 집중 관리** — 복사 후 여기만 수정 |
| `src/lib/rag.ts` | RAG 파이프라인 (벡터 검색 → 컨텍스트 주입) |
| `src/lib/vector-store.ts` | 벡터 DB 추상화 인터페이스 |
| `src/app/api/chat/route.ts` | 스트리밍 API Route (Edge Runtime) |
| `src/components/ChatWidget.tsx` | 위젯 진입점 (플로팅 버튼 + 패널 상태 관리) |
| `src/components/ChatWindow.tsx` | 채팅 패널 (메시지 목록 + 입력창) |
| `src/components/FloatingButton.tsx` | 우하단 플로팅 버튼 |
| `src/types/chat.ts` | 공통 타입 정의 |

## 커스텀 포인트 위치

복사 후 반드시 수정해야 할 파일:
1. `.env.local` — API 키, 벡터 DB 엔드포인트 (`.env.example` 참고)
2. `src/lib/config.ts` — SYSTEM_PROMPT, LLM 모델, 위젯 제목
3. `src/lib/vector-store.ts` — 벡터 DB 구현체 선택 (MockVectorStore → 실제 구현체)

## 주요 명령어

```bash
npm run dev    # 개발 서버 (localhost:3000)
npm run build  # 프로덕션 빌드
npm run lint   # 린트
```

## 코딩 컨벤션
- 컴포넌트: 함수형 + TypeScript props 타입 명시
- API Route: Next.js App Router 방식 (`export async function POST`)
- 환경변수: 절대 하드코딩 금지, `process.env`로만 접근
- 스타일: Tailwind CSS 유틸리티 클래스 사용
- 클라이언트 컴포넌트: 파일 상단에 `'use client'` 선언

## 작업 지침
- `/do [요청]` : 짧은 요청을 명세서로 변환 후 구현
- `/fix [에러]` : 에러 진단 및 수정
- `/done` : 작업 완료 처리
