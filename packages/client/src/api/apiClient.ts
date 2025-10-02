import { router } from "../router";

// ...existing code...
export type ApiErrorBody = { message?: string; [k: string]: unknown };

export class ApiError extends Error {
  status: number;
  body?: ApiErrorBody | string;

  constructor(status: number, body?: ApiErrorBody | string) {
    super(`API request failed with status ${status}`);
    this.status = status;
    this.body = body;
  }
}

type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  timeoutMs?: number;
  credentials?: RequestCredentials;
  signal?: AbortSignal;
};

const DEFAULT_TIMEOUT = 30_000;
const DEFAULT_BASE = "/api";

export class ApiClient {
  base: string;
  defaultTimeout: number;
  defaultCredentials: RequestCredentials;
  defaultHeaders: Record<string, string>;

  constructor(opts?: {
    base?: string;
    timeoutMs?: number;
    credentials?: RequestCredentials;
    headers?: Record<string, string>;
  }) {
    this.base = opts?.base ?? DEFAULT_BASE;
    this.defaultTimeout = opts?.timeoutMs ?? DEFAULT_TIMEOUT;
    this.defaultCredentials = opts?.credentials ?? "include";
    this.defaultHeaders = opts?.headers ?? {};
  }

  private buildUrl(path: string) {
    if (path.startsWith("http")) return path;
    return `${this.base}${path.startsWith("/") ? "" : "/"}${path}`;
  }

  async request<T = unknown>(
    path: string,
    {
      method = "GET",
      headers = {},
      body,
      timeoutMs = this.defaultTimeout,
      credentials = this.defaultCredentials,
      signal,
    }: RequestOptions = {}
  ): Promise<T> {
    const url = this.buildUrl(path);

    const ac = new AbortController();
    const timeout = setTimeout(() => ac.abort(), timeoutMs);
    const finalSignal = signal ?? ac.signal;

    const hasBody = body !== undefined && body !== null;
    const init: RequestInit = {
      method,
      headers: {
        Accept: "application/json",
        ...this.defaultHeaders,
        ...headers,
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
      },
      credentials,
      signal: finalSignal,
      body: hasBody ? JSON.stringify(body) : undefined,
    };

    try {
      const res = await fetch(url, init);
      clearTimeout(timeout);

      const ct = res.headers.get("content-type") || "";
      const isJson = ct.includes("application/json");

      if (res.ok) {
        if (isJson) return (await res.json()) as T;
        return (await res.text()) as unknown as T;
      } else {
        if (res.status === 401) {
          router.navigate({ to: "/login" });
        }
      }

      let parsedBody: ApiErrorBody | string | undefined;
      try {
        parsedBody = isJson ? await res.json() : await res.text();
      } catch {
        parsedBody = undefined;
      }
      throw new ApiError(res.status, parsedBody);
    } catch (err: unknown) {
      clearTimeout(timeout);
      if ((err as Error)?.name === "AbortError") {
        throw new ApiError(0, "Request aborted or timed out");
      }
      throw err;
    }
  }

  get = <T = unknown>(path: string, opts?: Omit<RequestOptions, "method">) =>
    this.request<T>(path, { ...(opts || {}), method: "GET" });

  post = <T = unknown>(
    path: string,
    body?: unknown,
    opts?: Omit<RequestOptions, "method" | "body">
  ) => this.request<T>(path, { ...(opts || {}), method: "POST", body });

  put = <T = unknown>(
    path: string,
    body?: unknown,
    opts?: Omit<RequestOptions, "method" | "body">
  ) => this.request<T>(path, { ...(opts || {}), method: "PUT", body });

  del = <T = unknown>(
    path: string,
    body?: unknown,
    opts?: Omit<RequestOptions, "method" | "body">
  ) => this.request<T>(path, { ...(opts || {}), method: "DELETE", body });

  // convenience: update default headers (e.g. auth token)
  setDefaultHeader(key: string, value?: string) {
    if (value == null) delete this.defaultHeaders[key];
    else this.defaultHeaders[key] = value;
  }
}

export const apiClient = new ApiClient();
