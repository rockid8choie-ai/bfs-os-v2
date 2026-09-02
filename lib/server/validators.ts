import { z } from "zod";
import { badRequest } from "./errors";

const specialty = z.enum([
  "배관·급수",
  "전기·조명",
  "승강기",
  "소방·안전",
  "공조·환기",
]);

const priority = z.enum(["긴급", "높음", "보통"]);

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "이메일 형식이 올바르지 않습니다."),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
});

export const createOrderSchema = z.object({
  title: z.string().trim().min(2, "제목을 2자 이상 입력해 주세요.").max(120),
  location: z.string().trim().max(80).optional(),
  priority,
  specialty,
  source: z.string().trim().min(1).max(80).default("AI 접수"),
  due: z.string().trim().max(40).optional(),
  vocId: z.string().min(1).optional(),
  assigneeId: z.string().min(1).optional(),
  autoAssign: z.boolean().optional(),
});

export const patchOrderSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("assign"),
    assigneeId: z.string().min(1, "담당자를 선택해 주세요."),
  }),
  z.object({
    action: z.literal("advance"),
  }),
]);

export function parseBody<T>(schema: z.ZodType<T>, raw: unknown): T {
  const result = schema.safeParse(raw);
  if (!result.success) {
    const message = result.error.issues[0]?.message ?? "요청 값이 올바르지 않습니다.";
    throw badRequest(message);
  }
  return result.data;
}
