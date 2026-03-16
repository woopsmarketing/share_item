# 운영 런북

## 이 레포의 사용 방법

### 1. 새 모듈 개발 (share_item에서)
```bash
# 모듈 폴더 생성 후 Next.js 초기화
mkdir -p modules/[모듈명]
cd modules/[모듈명]
npx create-next-app@latest . --typescript --tailwind --app

# 개발
npm run dev
```

### 2. 다른 프로젝트에 모듈 복사
```bash
# 모듈 폴더 전체를 대상 프로젝트에 복사
cp -r modules/[모듈명] /path/to/target-project/

# 커스텀 포인트 수정 (모듈 README.md 참고)
# 1. .env.local 환경변수 설정
# 2. SYSTEM_PROMPT 수정
# 3. 벡터DB 컬렉션 교체
# 4. 브랜드 디자인 적용
```

---

## 모듈별 개발 서버 실행

```bash
cd modules/[모듈명]
npm install
npm run dev
```

---

## Git 작업

```bash
# 변경사항 커밋
git add .
git commit -m "feat(모듈명): 작업 내용"

# GitHub 푸시
git push origin master
```

---

## 자주 쓰는 명령어

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 시작 (모듈 폴더 내에서) |
| `npm run build` | 프로덕션 빌드 |
| `npm run lint` | 코드 린트 |

---

## 환경변수 관리

- 각 모듈 폴더에 `.env.local` 파일 생성 (`.gitignore`에 포함됨)
- 모듈 `README.md`의 **필수 환경변수** 섹션 참고
- 절대 API 키를 코드에 하드코딩 금지

---

## 트러블슈팅

### 모듈을 복사했는데 동작 안 함
1. 해당 모듈 `README.md`의 커스텀 포인트 전부 확인
2. `.env.local` 환경변수 누락 여부 확인
3. `npm install` 재실행

### 벡터 검색 결과가 이상함
- 임베딩 모델과 검색 시 사용하는 모델이 동일한지 확인
- 컬렉션 내 문서가 올바르게 임베딩되었는지 확인
