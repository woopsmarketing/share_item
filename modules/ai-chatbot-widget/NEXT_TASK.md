# 다음 작업 목록

## 우선순위 높음
- [ ] 빌드 검증 (`npm run build`) 및 린트 통과 확인
- [ ] `.env.local` 설정 후 실제 OpenAI 응답 E2E 테스트
- [ ] 벡터 DB 선택 결정 (Pinecone vs Supabase pgvector)

## 우선순위 중간
- [ ] 실제 벡터 DB 구현체 작성 (`vector-store.ts`)
- [ ] 샘플 문서 임베딩 업로드 스크립트 (`scripts/embed-docs.ts`)
- [ ] 모바일 전체화면 모드 (breakpoint 대응)
- [ ] 채팅 패널 열기/닫기 애니메이션 추가

## 백로그
- [ ] 메시지 마크다운 렌더링 (`react-markdown`)
- [ ] 에러 핸들링 UI (네트워크 오류, API 오류)
- [ ] 대화 초기화 버튼
- [ ] 위젯 위치 커스텀 옵션 (우하단 외 다른 위치)
