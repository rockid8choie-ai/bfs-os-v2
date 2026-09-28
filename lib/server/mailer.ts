// 이메일 발송 — Resend. RESEND_API_KEY 없으면 비활성(호출부가 안내).
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const MAIL_FROM = process.env.MAIL_FROM ?? "BFS OS <onboarding@resend.dev>";

export function mailerConfigured() {
  return Boolean(RESEND_API_KEY);
}

export async function sendMail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: MAIL_FROM, to: [to], subject, html }),
  });
  if (!res.ok) {
    throw new Error(`mail send failed: ${res.status} ${await res.text()}`);
  }
}
