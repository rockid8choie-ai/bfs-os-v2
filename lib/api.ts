export class ApiClientError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

type Envelope<T> = { data?: T; error?: { code: string; message: string } };

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
    });
  } catch {
    throw new ApiClientError(0, "NETWORK", "서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.");
  }

  const body = (await res.json().catch(() => ({}))) as Envelope<T>;
  if (!res.ok || !body.data) {
    throw new ApiClientError(
      res.status,
      body.error?.code ?? "UNKNOWN",
      body.error?.message ?? "요청에 실패했습니다."
    );
  }
  return body.data;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
};
