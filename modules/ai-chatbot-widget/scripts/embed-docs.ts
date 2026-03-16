/**
 * knowledge/ 폴더의 마크다운 파일을 임베딩하여 Upstash Vector에 업로드
 *
 * 실행 방법:
 *   npm run embed
 *
 * 주의:
 *   - .env.local에 OPENAI_API_KEY, UPSTASH_VECTOR_REST_URL, UPSTASH_VECTOR_REST_TOKEN 필요
 *   - knowledge/ 폴더에 마크다운 파일이 있어야 함
 *   - 기존 knowledge 네임스페이스의 데이터를 모두 삭제하고 새로 업로드함
 */

import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { Index } from '@upstash/vector'
import { embed } from 'ai'
import { openai } from '@ai-sdk/openai'

// ── 설정 ──
const KNOWLEDGE_DIR = path.join(__dirname, '..', 'knowledge')
const CHUNK_SIZE = 500 // 청크당 최대 글자 수
const CHUNK_OVERLAP = 80 // 청크 간 겹치는 글자 수
const EMBEDDING_MODEL = 'text-embedding-3-small'
const NAMESPACE = 'knowledge'
const BATCH_SIZE = 10 // 동시 임베딩 수
const DELAY_MS = 200 // 배치 간 딜레이 (rate limiting 방지)

// ── Upstash 클라이언트 ──
const vectorIndex = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
})

// ── 마크다운 파일 재귀 탐색 ──
function findMarkdownFiles(dir: string): string[] {
  const files: string[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...findMarkdownFiles(fullPath))
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath)
    }
  }

  return files
}

// ── 텍스트를 청크로 분할 ──
function splitIntoChunks(text: string): string[] {
  const chunks: string[] = []
  const paragraphs = text.split('\n\n')
  let current = ''

  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim()
    if (!trimmed) continue

    if (current.length + trimmed.length > CHUNK_SIZE && current.length > 0) {
      chunks.push(current.trim())
      // 겹침: 마지막 문장 일부를 다음 청크에 포함
      const words = current.split(' ')
      const overlapWordCount = Math.ceil(CHUNK_OVERLAP / 5)
      const overlapText = words.slice(-overlapWordCount).join(' ')
      current = overlapText + '\n\n' + trimmed
    } else {
      current += (current ? '\n\n' : '') + trimmed
    }
  }

  if (current.trim()) {
    chunks.push(current.trim())
  }

  return chunks
}

// ── 임베딩 생성 ──
async function getEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: openai.embedding(EMBEDDING_MODEL),
    value: text,
  })
  return embedding
}

// ── 딜레이 유틸 ──
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ── 메인 실행 ──
async function main() {
  console.log('=== 문서 임베딩 시작 ===\n')

  // 환경변수 확인
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY가 설정되지 않았습니다. .env.local을 확인하세요.')
    process.exit(1)
  }
  if (!process.env.UPSTASH_VECTOR_REST_URL || !process.env.UPSTASH_VECTOR_REST_TOKEN) {
    console.error('Upstash Vector 환경변수가 설정되지 않았습니다.')
    process.exit(1)
  }

  // 마크다운 파일 탐색
  if (!fs.existsSync(KNOWLEDGE_DIR)) {
    console.error(`knowledge/ 폴더가 없습니다: ${KNOWLEDGE_DIR}`)
    process.exit(1)
  }

  const mdFiles = findMarkdownFiles(KNOWLEDGE_DIR)
  if (mdFiles.length === 0) {
    console.error('knowledge/ 폴더에 마크다운 파일이 없습니다.')
    process.exit(1)
  }

  console.log(`발견된 마크다운 파일: ${mdFiles.length}개`)

  // 파일별 청크 수집
  interface DocChunk {
    content: string
    source: string
    category: string
    chunkIndex: number
  }

  const allChunks: DocChunk[] = []

  for (const filePath of mdFiles) {
    const relativePath = path.relative(KNOWLEDGE_DIR, filePath)
    const category = path.dirname(relativePath)
    const content = fs.readFileSync(filePath, 'utf-8')
    const chunks = splitIntoChunks(content)

    console.log(`  ${relativePath}: ${chunks.length}개 청크`)

    chunks.forEach((chunk, i) => {
      allChunks.push({
        content: chunk,
        source: relativePath,
        category,
        chunkIndex: i,
      })
    })
  }

  console.log(`\n총 청크 수: ${allChunks.length}개`)

  // 기존 knowledge 네임스페이스 초기화
  console.log('\n기존 knowledge 데이터 초기화 중...')
  const ns = vectorIndex.namespace(NAMESPACE)
  try {
    await ns.reset()
    console.log('초기화 완료')
  } catch {
    console.log('(네임스페이스가 비어있거나 새로 생성됨)')
  }

  // 배치별 임베딩 + 업로드
  console.log('\n임베딩 및 업로드 시작...')
  let uploaded = 0

  for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
    const batch = allChunks.slice(i, i + BATCH_SIZE)

    const vectors = await Promise.all(
      batch.map(async (chunk) => {
        const vector = await getEmbedding(chunk.content)
        return {
          id: `doc_${chunk.source.replace(/[/\\]/g, '_')}_${chunk.chunkIndex}`,
          vector,
          metadata: {
            content: chunk.content,
            source: chunk.source,
            category: chunk.category,
            chunkIndex: chunk.chunkIndex,
          },
        }
      })
    )

    await ns.upsert(vectors)
    uploaded += vectors.length
    console.log(`  업로드: ${uploaded}/${allChunks.length}`)

    if (i + BATCH_SIZE < allChunks.length) {
      await delay(DELAY_MS)
    }
  }

  console.log(`\n=== 완료! ${uploaded}개 청크가 Upstash Vector에 업로드됨 ===`)
}

main().catch((err) => {
  console.error('오류 발생:', err)
  process.exit(1)
})
