# 현재 상태

## 완료된 작업
- [x] Next.js 16 프로젝트 초기화
- [x] Vercel AI SDK 설치 (`ai`, `@ai-sdk/openai`)
- [x] 컴포넌트 구현 (ChatWidget, ChatWindow, ChatMessage, ChatInput, FloatingButton)
- [x] API Route 구현 (POST /api/chat, Edge Runtime, 스트리밍)
- [x] 데모 페이지 구현 (page.tsx)
- [x] 문서 작성 (CLAUDE.md, PRD.md, README.md, .env.example)
- [x] Upstash Vector 연동 (`@upstash/vector`)
- [x] Semantic Cache 구현 (유사 질문 캐시 → LLM 호출 제거)
- [x] RAG 파이프라인 리팩토링 (Upstash Vector 기반)
- [x] knowledge/ 폴더 구조 + SEO 서비스 템플릿
- [x] embed-docs.ts 스크립트 (마크다운 → 벡터 업로드)
- [x] 빌드 검증 통과

## 아키텍처
```
사용자 질문
  → Semantic Cache 확인 (Upstash Vector, cache 네임스페이스)
    → 히트: 캐시 답변 반환 (LLM 호출 X, 비용 $0)
    → 미스: RAG (knowledge 네임스페이스) → LLM 호출 → 답변 캐시 저장
```

## 현재 작동 상태
- 개발 서버: 기동 가능 (`npm run dev`)
- 빌드: 통과 (`npm run build`)
- Upstash Vector: 연결됨 (seo_chat_module 인덱스)
- Semantic Cache: 구현 완료
- RAG: Upstash Vector 기반으로 리팩토링 완료

## 다음 필요 작업
- [ ] `.env.local`에 `OPENAI_API_KEY` 설정
- [ ] `knowledge/` 폴더에 실제 서비스 내용 작성
- [ ] `npm run embed` 실행 (문서 → Upstash Vector 업로드)
- [ ] E2E 테스트 (실제 질문 → 답변 확인)

## 마지막 업데이트
2026-03-16 — Upstash Vector 연동 + Semantic Cache + RAG 리팩토링 완료
