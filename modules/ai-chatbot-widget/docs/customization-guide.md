# 커스텀 가이드

다른 프로젝트에 복사 후 이 순서대로 커스텀한다.

---

## 1단계: 환경변수 설정

```bash
cp .env.example .env.local
```

`.env.local`을 열어 값을 채운다. 최소 필수값: `OPENAI_API_KEY`

---

## 2단계: SYSTEM_PROMPT 수정

`src/lib/config.ts`의 `CHAT_CONFIG.systemPrompt`를 수정한다.

```typescript
systemPrompt: `당신은 [서비스명]의 AI 어시스턴트입니다.
[서비스 설명, 어투, 제약 사항 등을 여기에 작성]

[관련 문서]
{context}`,
```

**주의:** `{context}` 는 반드시 유지. RAG 검색 결과가 자동 주입되는 자리.

같은 파일에서 위젯 제목, 플레이스홀더, LLM 모델도 변경 가능.

---

## 3단계: 벡터 DB 연결

`src/lib/vector-store.ts`에서 `MockVectorStore`를 실제 구현체로 교체한다.

### Pinecone 사용 시

```bash
npm install @pinecone-database/pinecone
```

```typescript
import { Pinecone } from '@pinecone-database/pinecone'

export class PineconeVectorStore implements VectorStore {
  private client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
  private index = this.client.index(process.env.PINECONE_INDEX!)

  async search(query: string, topK: number): Promise<VectorSearchResult[]> {
    // 1. 쿼리 임베딩
    // 2. index.query()
    // 3. VectorSearchResult[] 형태로 반환
  }
}

export const vectorStore: VectorStore = new PineconeVectorStore()
```

### Supabase pgvector 사용 시

```bash
npm install @supabase/supabase-js
```

```typescript
import { createClient } from '@supabase/supabase-js'

export class SupabaseVectorStore implements VectorStore {
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )

  async search(query: string, topK: number): Promise<VectorSearchResult[]> {
    // 1. 쿼리 임베딩
    // 2. supabase.rpc('match_documents', { query_embedding, match_count: topK })
    // 3. VectorSearchResult[] 형태로 반환
  }
}

export const vectorStore: VectorStore = new SupabaseVectorStore()
```

---

## 4단계: 문서 임베딩 업로드

프로젝트 FAQ, 서비스 정책, 안내 문서 등을 임베딩하여 벡터 DB에 업로드한다.

임베딩 모델: `text-embedding-3-small` (RAG_CONFIG.embeddingModel)

---

## 5단계: 디자인 커스텀

컴포넌트 내 `bg-blue-600` 클래스를 브랜드 컬러로 일괄 교체한다.

```bash
# 교체 대상 파일
src/components/FloatingButton.tsx
src/components/ChatWindow.tsx
src/components/ChatInput.tsx
```
