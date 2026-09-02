import { prisma } from "@/lib/server/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({
      data: { ok: true, service: "bfs-os", time: new Date().toISOString() },
    });
  } catch {
    return Response.json(
      { error: { code: "UNAVAILABLE", message: "데이터베이스에 연결하지 못했습니다." } },
      { status: 503 }
    );
  }
}
