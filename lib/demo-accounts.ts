/** 시드 데모 계정 — 로그인 화면에만 노출. 운영 초대 흐름이 생기면 제거한다. */
export const DEMO_ACCOUNTS = [
  {
    label: "관리소장 박정호",
    email: "park@bfs.local",
    password: "demo1234",
  },
  {
    label: "시설팀 김태식",
    email: "kim@bfs.local",
    password: "demo1234",
  },
  {
    label: "시설팀 이현우",
    email: "lee@bfs.local",
    password: "demo1234",
  },
  {
    label: "시설팀 정민석",
    email: "jung@bfs.local",
    password: "demo1234",
  },
] as const;
