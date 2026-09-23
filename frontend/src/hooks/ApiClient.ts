import type z from "zod";

interface BaseFetchOperations extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export async function apiFetch<
  TSchema extends z.ZodType<unknown> | undefined = undefined,
>(
  url: string,
  {
    ...options
  }: BaseFetchOperations & {
    schema?: TSchema;
    onSuccess?: (
      data: TSchema extends z.ZodType<unknown> ? z.infer<TSchema> : unknown,
    ) => void | Promise<void>;
  } = {} as any,
): Promise<TSchema extends z.ZodType<unknown> ? z.infer<TSchema> : unknown> {
  const { body, headers, schema, onSuccess, ...rest } = options ?? {};

  const response = await fetch(url, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  if (response.status == 204 || response.status == 205) {
    const noContent = null as any;
    await onSuccess?.(noContent);
    return noContent;
  }

  let data: unknown = null;
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (response.status == 401) {
    return null as any;
  }

  if (schema && data != null) {
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const validationError = new Error(
        "API response data does not fit expected structure",
      );
      Object.assign(validationError, {
        status: response.status,
        cause: parsed.error,
      });
      throw validationError;
    }
    data = parsed.data;
  }
  await onSuccess?.(data as any);
  return data as any;
}
