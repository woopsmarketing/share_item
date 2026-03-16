import { ChatConfig } from '@/types/chat'

// ============================================================
// 커스텀 포인트 — 다른 프로젝트에 복사 후 이 파일만 수정하면 됨
// ============================================================

export const CHAT_CONFIG: ChatConfig = {
  // 위젯 상단 타이틀
  title: '무엇이든 물어보세요',

  // 입력창 플레이스홀더
  placeholder: '질문을 입력하세요...',

  // LLM 모델 (gpt-4o-mini, gpt-4o 등)
  model: process.env.LLM_MODEL ?? 'gpt-4o-mini',

  // 시스템 프롬프트 — 서비스 성격에 맞게 수정
  // {context} 는 RAG 검색 결과가 자동 주입되는 자리 — 반드시 유지
  systemPrompt: `당신은 친절한 AI 어시스턴트입니다.
사용자의 질문에 간결하고 명확하게 답변해주세요.
모르는 내용은 솔직하게 모른다고 답변하세요.

[서비스 설명]
여기에 이 서비스/플랫폼에 대한 설명을 추가하세요.

[관련 문서]
{context}`,
}

// RAG 설정
export const RAG_CONFIG = {
  // 벡터 검색 시 가져올 문서 수
  topK: 3,
  // 임베딩 모델
  embeddingModel: 'text-embedding-3-small',
}
