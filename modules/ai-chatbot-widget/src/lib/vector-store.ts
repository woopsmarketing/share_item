// 벡터 DB 추상화 인터페이스
// 복사 후 사용할 벡터 DB에 맞게 구현체를 선택하세요

export interface VectorSearchResult {
  content: string
  score: number
  metadata?: Record<string, unknown>
}

export interface VectorStore {
  search(query: string, topK: number): Promise<VectorSearchResult[]>
}

// TODO: 아래 중 하나를 선택하여 구현
// - PineconeVectorStore: Pinecone 사용 시 (npm install @pinecone-database/pinecone)
// - SupabaseVectorStore: Supabase pgvector 사용 시 (npm install @supabase/supabase-js)

// 개발/테스트용 Mock 구현체 (실제 벡터 DB 없이 로컬 테스트 가능)
export class MockVectorStore implements VectorStore {
  async search(_query: string, topK: number): Promise<VectorSearchResult[]> {
    // 실제 구현 시 이 부분을 교체하세요
    return Array.from({ length: topK }, (_, i) => ({
      content: `샘플 컨텍스트 문서 ${i + 1}: 여기에 프로젝트 관련 내용이 들어갑니다.`,
      score: 0.9 - i * 0.1,
    }))
  }
}

// 현재 사용할 벡터 스토어 — MockVectorStore를 실제 구현체로 교체
export const vectorStore: VectorStore = new MockVectorStore()
