import { jsonOk } from "@/lib/server/errors";
import { enabledProviders } from "@/lib/server/oauth";

export const runtime = "nodejs";

// 로그인 화면이 어떤 소셜 버튼을 보여줄지 결정한다 (env에 키가 있는 제공자만).
export async function GET() {
  return jsonOk({ providers: enabledProviders() });
}
