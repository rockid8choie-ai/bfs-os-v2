export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function jsonOk<T>(data: T, status = 200) {
  return Response.json({ data }, { status });
}

export function jsonError(error: unknown) {
  if (error instanceof ApiError) {
    return Response.json(
      { error: { code: error.code, message: error.message } },
      { status: error.status }
    );
  }

  console.error("[api]", error);
  return Response.json(
    { error: { code: "INTERNAL", message: "서버에서 요청을 처리하지 못했습니다." } },
    { status: 500 }
  );
}

export function badRequest(message: string, code = "VALIDATION") {
  return new ApiError(400, code, message);
}

export function unauthorized(message = "로그인이 필요합니다.") {
  return new ApiError(401, "UNAUTHORIZED", message);
}

export function forbidden(message = "권한이 없습니다.") {
  return new ApiError(403, "FORBIDDEN", message);
}

export function notFound(message = "대상을 찾을 수 없습니다.") {
  return new ApiError(404, "NOT_FOUND", message);
}
