# 다음 작업 목록

## 우선순위 높음

### ai-chatbot-widget 모듈 개발
- [ ] `modules/ai-chatbot-widget/` 폴더 구조 설계
- [ ] 기술 스택 확정 (벡터DB: Pinecone vs Supabase pgvector 선택)
- [ ] Next.js 프로젝트 초기화 (`modules/ai-chatbot-widget/`)
- [ ] 챗봇 위젯 UI 컴포넌트 구현 (플로팅 버튼 + 채팅 패널)
- [ ] Vercel AI SDK 스트리밍 API Route 구현
- [ ] RAG 파이프라인 구현 (임베딩 → 벡터 검색 → LLM 주입)
- [ ] 모듈 README.md 작성 (커스텀 포인트 상세 명시)

## 우선순위 중간

- [ ] ai-chatbot-widget 데모용 샘플 컨텍스트 문서 준비
- [ ] 위젯 디자인 커스텀 가이드 작성

## 백로그 (다음 모듈 후보)

- [ ] 인증/소셜 로그인 모듈 (OAuth 공통 설정)
- [ ] 결제 모듈 (Stripe 또는 토스페이먼츠 공통 래퍼)
- [ ] 이메일 발송 모듈 (Resend 기반)
- [ ] 관리자 대시보드 기본 템플릿
