# share_item

## 프로젝트 개요

**share_item**은 여러 플랫폼/프로젝트에 공통으로 재사용할 수 있는 기술 모듈을 개발하고 보관하는 레포지토리다.

각 모듈은 독립적으로 개발·테스트된 뒤, 다른 프로젝트에 복사해서 해당 프로젝트에 맞게 커스텀하는 방식으로 사용한다.

### 핵심 철학
- **개발 → 검증 → 복사 → 커스텀**: 여기서 완성된 모듈을 그대로 다른 프로젝트에 가져가 사용
- **독립성**: 각 모듈은 다른 모듈에 의존하지 않고 독립적으로 동작
- **커스텀 포인트 명시**: 복사 후 수정해야 할 부분은 모듈 내 주석 또는 README에 명확히 표시

---

## 모듈 목록

| 모듈명 | 상태 | 설명 |
|--------|------|------|
| `ai-chatbot-widget` | 개발 예정 | RAG 기반 24시간 AI 챗봇 위젯 (프로젝트별 컨텍스트 교체 가능) |

---

## 기술 스택 (공통)
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Vercel AI SDK
- OpenAI / Anthropic Claude API

> 각 모듈 폴더 내 `README.md`에서 해당 모듈의 세부 스택 확인

---

## 디렉토리 구조

```
share_item/
├── modules/
│   ├── ai-chatbot-widget/   # AI 챗봇 위젯 모듈
│   └── (추후 모듈 추가)
├── CLAUDE.md
├── PRD.md
├── CURRENT_STATE.md
├── NEXT_TASK.md
└── RUNBOOK.md
```

---

## 주요 명령어

```bash
# 특정 모듈 개발 서버 실행 (모듈 폴더 내에서)
npm run dev

# 빌드
npm run build

# 린트
npm run lint
```

---

## 작업 지침

- `/do [요청]` : 짧은 요청을 명세서로 변환 후 구현
- `/fix [에러]` : 에러 진단 및 수정
- `/done` : 작업 완료 처리 (commit + 보고서)

---

## 새 모듈 추가 규칙

1. `modules/[모듈명]/` 폴더 생성
2. 해당 폴더에 `README.md` 작성 (커스텀 포인트 필수 명시)
3. 독립 실행 가능한 구조로 개발
4. 완성 후 이 파일의 모듈 목록 업데이트
