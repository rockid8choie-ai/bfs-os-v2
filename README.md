# BFS OS

빌딩 시설 운영 웹 앱. 민원·알람·점검을 접수하면 서버가 작업을 저장하고, 전문분야·부하를 보고 담당자를 배정합니다.

프론트(Next.js)와 REST API가 같은 앱에 있습니다. 데이터는 Postgres에 남습니다.

- 앱: https://bfs-os-v2.vercel.app
- 랜딩: https://bfs-os-v2.vercel.app/landing

## 로컬 실행

1. `cp .env.example .env.local`
2. `docker compose up -d`
3. `npx prisma migrate deploy`
4. `npm run db:seed`
5. `npm run dev`

브라우저에서 http://localhost:3000/landing

### 데모 계정

비밀번호는 모두 `demo1234` 입니다.

| 역할 | 이메일 |
|------|--------|
| 관리소장 박정호 | park@bfs.local |
| 시설팀 김태식 | kim@bfs.local |
| 시설팀 이현우 | lee@bfs.local |
| 시설팀 정민석 | jung@bfs.local |

## 배포 (Vercel)

1. Neon(또는 호환 Postgres)을 만들고 `DATABASE_URL`을 받습니다.
2. Vercel 환경 변수에 `DATABASE_URL`, `JWT_SECRET`(로컬과 다른 긴 값)을 넣습니다. `NEXT_PUBLIC_API_BASE_URL`은 비웁니다.
3. 배포 후 한 번 `npx prisma migrate deploy`와 `npm run db:seed`를 해당 DB에 실행합니다.
4. `https://<host>/api/health` 가 `{ "data": { "ok": true } }` 인지 확인합니다.

## 설계

```
브라우저
  → POST/GET /api/*  (httpOnly JWT 쿠키)
  → Route Handler
  → Zod 검증 → 권한(건물·역할) → Prisma
  → Postgres
```

- 소장은 건물 전체 작업·민원, 배정·민원 전환
- 시설팀은 자기에게 배정된 작업만 조회·시작·완료
- 작업 완료 시 연결된 민원도 서버 트랜잭션으로 완료
- 접수 시 서버가 추천 규칙으로 담당자를 붙임 (프론트 미리보기와 동일 규칙)

## API

공통

- 성공: `{ "data": ... }`
- 실패: `{ "error": { "code": "VALIDATION" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "INTERNAL", "message": "한글 설명" } }`
- 인증: 로그인 성공 시 `bfs_session` httpOnly 쿠키. `Authorization: Bearer` 는 쓰지 않습니다.
- 상태 코드: 200/201, 400, 401, 403, 404, 500, 503

### `GET /api/health`

인증 없음. DB 연결 확인.

```json
{ "data": { "ok": true, "service": "bfs-os", "time": "2026-09-02T00:00:00.000Z" } }
```

### `POST /api/auth/login`

```json
{ "email": "park@bfs.local", "password": "demo1234" }
```

```json
{
  "data": {
    "token": "<jwt>",
    "user": {
      "id": "...",
      "name": "박정호",
      "role": "manager",
      "title": "관리소장",
      "email": "park@bfs.local",
      "buildingName": "역삼타워"
    }
  }
}
```

잘못된 비번 → 401 `{ "error": { "code": "UNAUTHORIZED", "message": "이메일 또는 비밀번호가 올바르지 않습니다." } }`

### `GET /api/auth/me`

쿠키 필요. 현재 사용자.

### `POST /api/auth/logout`

쿠키 삭제.

### `GET /api/members`

구성원 목록 + `load`(진행 중 건수), `doneToday`.

### `GET /api/work-orders`

소장: 건물 전체. 시설팀: 자기 작업만.

### `POST /api/work-orders`

```json
{
  "title": "3층 화장실 온수가 안 나와요",
  "priority": "높음",
  "specialty": "배관·급수",
  "source": "AI 접수",
  "autoAssign": true
}
```

201 `{ "data": { "order": { "id", "title", "status": "배정됨", "assigneeId", ... } } }`

제목 2자 미만 → 400 VALIDATION.

### `PATCH /api/work-orders/:id`

```json
{ "action": "assign", "assigneeId": "<userId>" }
```

```json
{ "action": "advance" }
```

`advance`: `배정됨 → 진행중 → 완료`. 완료 시 연결 민원도 완료. 미배정 작업은 400.

### `GET /api/vocs`

민원 목록. 연결된 작업 id는 `workOrderId`.

### `POST /api/vocs/:id/convert`

소장만. 작업이 없으면 만들고 민원을 `처리중`으로. 있으면 기존 작업을 반환.

## 환경 변수

| 이름 | 용도 |
|------|------|
| `DATABASE_URL` | Postgres 접속 |
| `JWT_SECRET` | 세션 서명. 배포와 로컬을 분리 |
| `JWT_EXPIRES_IN` | 기본 `7d` |
| `NEXT_PUBLIC_API_BASE_URL` | 같은 호스트면 빈 문자열 |
