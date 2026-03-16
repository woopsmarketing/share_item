# AI 챗봇 위젯 — 구현 현황 리포트

**작성일**: 2026-03-17
**모듈**: `modules/ai-chatbot-widget`
**상태**: 코어 구현 완료, 데이터 투입 대기

---

## 1. 아키텍처 개요

```
사용자 질문
    │
    ▼
┌─────────────────────────┐
│  Semantic Cache 확인     │  Upstash Vector (cache 네임스페이스)
│  유사도 > 0.92 ?        │
└────┬──────────┬─────────┘
  히트│          │미스
     ▼          ▼
캐시 답변 반환  ┌──────────────────────┐
(LLM 호출 X)  │  RAG 검색             │  Upstash Vector (knowledge 네임스페이스)
비용: ~$0     │  관련 문서 Top 3 검색  │
              └──────────┬───────────┘
                         ▼
              ┌──────────────────────┐
              │  LLM 호출             │  GPT-4o-mini (스트리밍)
              │  System Prompt        │
              │  + RAG 컨텍스트       │
              └──────────┬───────────┘
                         ▼
              답변 생성 + 캐시 저장
```

---

## 2. 기술 스택

| 기술 | 버전 | 용도 |
|------|------|------|
| Next.js | 16.1.6 | App Router, Edge Runtime |
| TypeScript | ^5 | 타입 안전성 |
| Tailwind CSS | v4 | 스타일링 |
| Vercel AI SDK | ^4.3.15 | LLM 호출, 임베딩, 스트리밍 |
| @ai-sdk/openai | ^1.3.22 | OpenAI 프로바이더 |
| @upstash/vector | ^1.2.3 | 벡터 DB (RAG + 캐시) |
| GPT-4o-mini | - | LLM (비용 최적) |
| text-embedding-3-small | - | 임베딩 모델 |

---

## 3. 파일 구조 및 역할

```
modules/ai-chatbot-widget/
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts      # API 엔드포인트 (캐시→RAG→LLM 흐름)
│   │   ├── layout.tsx             # 루트 레이아웃
│   │   ├── page.tsx               # 데모 페이지
│   │   └── globals.css            # 글로벌 스타일
│   ├── components/
│   │   ├── ChatWidget.tsx         # 위젯 진입점 (상태 관리)
│   │   ├── ChatWindow.tsx         # 채팅 패널 (메시지 목록 + 입력)
│   │   ├── ChatMessage.tsx        # 개별 메시지 렌더링
│   │   ├── ChatInput.tsx          # 입력창 + 전송 버튼
│   │   └── FloatingButton.tsx     # 우하단 플로팅 버튼
│   ├── lib/
│   │   ├── config.ts              # ★ 커스텀 포인트 (프롬프트, 모델, 캐시 설정)
│   │   ├── upstash.ts             # Upstash Vector 클라이언트
│   │   ├── embeddings.ts          # OpenAI 임베딩 유틸
│   │   ├── vector-store.ts        # 지식 문서 검색 (RAG)
│   │   ├── semantic-cache.ts      # 시맨틱 캐시 (히트/저장)
│   │   └── rag.ts                 # 컨텍스트 검색 + 프롬프트 주입
│   └── types/
│       └── chat.ts                # 타입 정의
├── knowledge/                     # ★ 지식 베이스 (마크다운)
│   ├── service/
│   │   ├── about.md               # 서비스 소개 (템플릿)
│   │   ├── pricing.md             # 가격표 (템플릿)
│   │   └── faq.md                 # 자주 묻는 질문 (템플릿)
│   ├── seo-guide/
│   │   └── basics.md              # SEO 기초 가이드
│   └── emphasis/
│       └── strengths.md           # 강조 포인트 (템플릿)
├── scripts/
│   └── embed-docs.ts              # 문서 임베딩 → Upstash 업로드 스크립트
├── report/
│   └── progress-report.md         # 이 리포트
├── .env.local                     # 환경변수 (API 키)
├── .env.example                   # 환경변수 템플릿
├── package.json
├── CLAUDE.md
├── CURRENT_STATE.md
└── NEXT_TASK.md
```

---

## 4. 구현 완료 항목

### 프론트엔드
- [x] 플로팅 버튼 (우하단 고정, 열기/닫기 토글)
- [x] 채팅 윈도우 (메시지 목록, 자동 스크롤)
- [x] 메시지 컴포넌트 (사용자/AI 구분, 말풍선 스타일)
- [x] 입력창 (Enter 전송, Shift+Enter 줄바꿈, 로딩 중 비활성)
- [x] 로딩 인디케이터 (점 세 개 바운스 애니메이션)

### 백엔드 API
- [x] POST /api/chat — Edge Runtime
- [x] Semantic Cache 확인 → 캐시 히트 시 즉시 반환
- [x] RAG 검색 → 관련 문서 컨텍스트 주입
- [x] GPT-4o-mini 스트리밍 응답
- [x] 응답 완료 후 캐시 자동 저장
- [x] 에러 발생 시 graceful fallback (캐시/RAG 실패해도 LLM은 동작)

### 인프라
- [x] Upstash Vector 연동 (seo_chat_module 인덱스, us-east-1)
  - knowledge 네임스페이스: 지식 문서 저장
  - cache 네임스페이스: Q&A 캐시 저장
- [x] OpenAI API 연동 (GPT-4o-mini + text-embedding-3-small)
- [x] 임베딩 스크립트 (`npm run embed`)
- [x] 빌드 검증 통과 (`npm run build`)

### 커스텀 포인트
- [x] `config.ts` — 프롬프트, 모델, 캐시 임계값 집중 관리
- [x] `knowledge/` — 마크다운 파일로 지식 관리
- [x] `.env.local` — API 키, 벡터 DB 설정

---

## 5. 미구현 항목

### 즉시 필요 (데이터 투입)
- [ ] `knowledge/` 마크다운에 실제 서비스 정보 작성
- [ ] 구글 공식 SEO 가이드 문서 추가 작성 (technical-seo, core-web-vitals 등)
- [ ] `npm run embed` 실행 (문서 → Upstash Vector 업로드)
- [ ] 실제 대화 E2E 테스트

### UX 개선
- [ ] 모바일 전체화면 모드
- [ ] 채팅 패널 열기/닫기 애니메이션
- [ ] 메시지 마크다운 렌더링
- [ ] 에러 핸들링 UI (네트워크 오류 표시)
- [ ] 대화 초기화 버튼

### 운영 도구
- [ ] 캐시 관리 API (만료 캐시 정리)
- [ ] URL → 마크다운 변환 크롤링 스크립트
- [ ] 사용량 모니터링 / 로깅

---

## 6. 비용 구조

| 항목 | 단가 | 예상 월 비용 (일 100 질문) |
|------|------|--------------------------|
| GPT-4o-mini (LLM) | $0.15/1M input, $0.60/1M output | ~$2~4 |
| text-embedding-3-small | $0.02/1M tokens | ~$0.05 |
| Upstash Vector Free | 일 10K 쿼리 무료 | $0 |
| **Semantic Cache 적용 시** | 반복 질문 70% 가정 | **~$0.7~1.2** |

---

## 7. 주요 명령어

```bash
npm run dev       # 개발 서버 (localhost:3000)
npm run build     # 프로덕션 빌드
npm run embed     # knowledge/*.md → Upstash Vector 업로드
npm run lint      # 린트 검사
```
