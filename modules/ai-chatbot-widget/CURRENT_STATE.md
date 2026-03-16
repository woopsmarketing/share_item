# 현재 상태

## 완료된 작업
- [x] Next.js 16 프로젝트 초기화
- [x] Vercel AI SDK 설치 (`ai`, `@ai-sdk/openai`)
- [x] 컴포넌트 구현 (ChatWidget, ChatWindow, ChatMessage, ChatInput, FloatingButton)
- [x] lib 구현 (config.ts, rag.ts, vector-store.ts)
- [x] API Route 구현 (POST /api/chat, Edge Runtime, 스트리밍)
- [x] 데모 페이지 구현 (page.tsx)
- [x] 문서 작성 (CLAUDE.md, PRD.md, README.md, .env.example)

## 현재 작동 상태
- 개발 서버: 기동 가능 (`npm run dev`)
- AI 응답: MockVectorStore 기반 — OPENAI_API_KEY 설정 시 실제 LLM 응답 동작
- 빌드: 검증 필요

## 알려진 이슈
- MockVectorStore 사용 중 (실제 벡터 DB 미연동)
- 실제 LLM 응답을 위해 `.env.local`에 `OPENAI_API_KEY` 필요

## 마지막 업데이트
2026-03-16 — 스캐폴딩 및 핵심 로직 구현 완료
