import { initialOf } from "@/lib/assign";
import type { Member } from "@/lib/mock";

// 아이덴티티 색은 구성원 id로 고정 — 같은 사람은 어느 화면에서나 같은 색으로 보인다
const TINTS = [
  "bg-brand-soft text-brand",
  "bg-tint-emerald text-tint-emerald-fg",
  "bg-tint-amber text-tint-amber-fg",
  "bg-tint-indigo text-tint-indigo-fg",
  "bg-tint-purple text-tint-purple-fg",
  "bg-tint-teal text-tint-teal-fg",
];

export function tintOf(id: string) {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return TINTS[sum % TINTS.length];
}

export default function Avatar({
  member,
  size = 32,
  className = "",
}: {
  member: Member;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-bold ${tintOf(
        member.id
      )} ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
      aria-hidden
    >
      {initialOf(member.name)}
    </span>
  );
}
