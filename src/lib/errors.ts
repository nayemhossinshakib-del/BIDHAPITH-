export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public status = 400,
    public details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "লগইন প্রয়োজন") {
    super("UNAUTHORIZED", message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "এই কাজটি করার অনুমতি নেই") {
    super("FORBIDDEN", message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "তথ্য পাওয়া যায়নি") {
    super("NOT_FOUND", message, 404);
  }
}

export class TenantIsolationError extends AppError {
  constructor(message = "অন্য স্কুলের তথ্য দেখার অনুমতি নেই") {
    super("TENANT_ISOLATION", message, 403);
  }
}

export class ValidationError extends AppError {
  constructor(message = "প্রদত্ত তথ্য সঠিক নয়", details?: unknown) {
    super("VALIDATION", message, 422, details);
  }
}

export function toErrorPayload(err: unknown, requestId: string) {
  if (err instanceof AppError) {
    return {
      ok: false as const,
      code: err.code,
      message: err.message,
      details: err.details ?? null,
      requestId,
    };
  }
  console.error("[unhandled]", requestId, err);
  return {
    ok: false as const,
    code: "INTERNAL",
    message: "একটি অভ্যন্তরীণ ত্রুটি ঘটেছে",
    details: null,
    requestId,
  };
}
