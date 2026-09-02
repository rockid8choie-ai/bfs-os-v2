import { PrismaClient, Priority, Role, VocStatus, WoStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("demo1234", 12);

  await prisma.assignmentEvent.deleteMany();
  await prisma.workOrder.deleteMany();
  await prisma.voc.deleteMany();
  await prisma.user.deleteMany();
  await prisma.building.deleteMany();

  const building = await prisma.building.create({
    data: { name: "역삼타워" },
  });

  const [park, kim, lee, jung] = await Promise.all([
    prisma.user.create({
      data: {
        buildingId: building.id,
        email: "park@bfs.local",
        passwordHash,
        name: "박정호",
        role: Role.manager,
        title: "관리소장",
        phone: "010-2841-0033",
        years: 12,
        specialties: ["소방·안전"],
      },
    }),
    prisma.user.create({
      data: {
        buildingId: building.id,
        email: "kim@bfs.local",
        passwordHash,
        name: "김태식",
        role: Role.tech,
        title: "시설팀 · 기계",
        phone: "010-5521-7788",
        years: 8,
        specialties: ["배관·급수", "공조·환기"],
      },
    }),
    prisma.user.create({
      data: {
        buildingId: building.id,
        email: "lee@bfs.local",
        passwordHash,
        name: "이현우",
        role: Role.tech,
        title: "시설팀 · 전기",
        phone: "010-3390-1142",
        years: 5,
        specialties: ["전기·조명"],
      },
    }),
    prisma.user.create({
      data: {
        buildingId: building.id,
        email: "jung@bfs.local",
        passwordHash,
        name: "정민석",
        role: Role.tech,
        title: "시설팀 · 승강기",
        phone: "010-7745-9021",
        years: 11,
        specialties: ["승강기", "소방·안전"],
      },
    }),
  ]);

  const now = new Date();
  const hoursAgo = (h: number, m = 0) => {
    const d = new Date(now);
    d.setHours(d.getHours() - h, m, 0, 0);
    return d;
  };
  const yesterday = (hh: number, mm: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - 1);
    d.setHours(hh, mm, 0, 0);
    return d;
  };

  const [v1, v2, v3, v4] = await Promise.all([
    prisma.voc.create({
      data: {
        buildingId: building.id,
        title: "천장에서 물이 떨어져요",
        tenant: "302호 · 그린테크",
        status: VocStatus.received,
        aiTag: "배관·누수",
        specialty: "배관·급수",
        createdAt: hoursAgo(2, 20),
      },
    }),
    prisma.voc.create({
      data: {
        buildingId: building.id,
        title: "엘리베이터에서 이상한 소리가 나요",
        tenant: "701호 · 한빛법무",
        status: VocStatus.received,
        aiTag: "승강기",
        specialty: "승강기",
        createdAt: hoursAgo(3, 5),
      },
    }),
    prisma.voc.create({
      data: {
        buildingId: building.id,
        title: "지하주차장 B1 조명이 어두워요",
        tenant: "205호 · 다온디자인",
        status: VocStatus.processing,
        aiTag: "전기·조명",
        specialty: "전기·조명",
        createdAt: yesterday(10, 0),
      },
    }),
    prisma.voc.create({
      data: {
        buildingId: building.id,
        title: "화장실 온수가 안 나와요",
        tenant: "402호 · 세움회계",
        status: VocStatus.done,
        aiTag: "급탕",
        specialty: "배관·급수",
        createdAt: yesterday(16, 0),
      },
    }),
  ]);
  void v4;

  await prisma.workOrder.createMany({
    data: [
      {
        buildingId: building.id,
        title: "지하2층 급수펌프 점검",
        location: "B2 기계실",
        due: "오늘",
        status: WoStatus.in_progress,
        priority: Priority.urgent,
        source: "센서 알람",
        specialty: "배관·급수",
        assigneeId: kim.id,
        assignedById: park.id,
        assignedAt: hoursAgo(5, 12),
      },
      {
        buildingId: building.id,
        title: "302호 천장 누수 보수",
        location: "3F 302호",
        due: "오늘",
        status: WoStatus.pending,
        priority: Priority.high,
        source: "민원",
        specialty: "배관·급수",
        vocId: v1.id,
      },
      {
        buildingId: building.id,
        title: "옥상 배수구 정기 점검",
        location: "RF",
        due: "오늘",
        status: WoStatus.assigned,
        priority: Priority.normal,
        source: "정기 일정",
        specialty: "배관·급수",
        assigneeId: kim.id,
        assignedById: park.id,
        assignedAt: yesterday(17, 40),
      },
      {
        buildingId: building.id,
        title: "로비 조명 3구 교체",
        location: "1F 로비",
        due: "오늘",
        status: WoStatus.in_progress,
        priority: Priority.normal,
        source: "순찰 발견",
        specialty: "전기·조명",
        assigneeId: lee.id,
        assignedById: park.id,
        assignedAt: hoursAgo(4, 5),
      },
      {
        buildingId: building.id,
        title: "엘리베이터 2호기 이음 점검",
        location: "공용",
        due: "내일",
        status: WoStatus.pending,
        priority: Priority.high,
        source: "민원",
        specialty: "승강기",
        vocId: v2.id,
      },
      {
        buildingId: building.id,
        title: "소방시설 법정점검",
        location: "건물 전체",
        due: "7/30",
        status: WoStatus.pending,
        priority: Priority.high,
        source: "법정 의무",
        specialty: "소방·안전",
      },
      {
        buildingId: building.id,
        title: "지하주차장 B1 조명 점등 불량",
        location: "B1 주차장",
        due: "어제",
        status: WoStatus.done,
        priority: Priority.normal,
        source: "민원",
        specialty: "전기·조명",
        assigneeId: lee.id,
        assignedById: park.id,
        assignedAt: yesterday(10, 20),
        vocId: v3.id,
      },
    ],
  });

  console.log("Seeded 역삼타워:", {
    building: building.id,
    users: [park.email, kim.email, lee.email, jung.email],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
