export type ApiError = {
  ok: false;
  error: string;
};

async function parseJsonSafe(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

export function getAdminToken() {
  return localStorage.getItem("i4c_admin_token") || "";
}

export function setAdminToken(token: string) {
  if (token) localStorage.setItem("i4c_admin_token", token);
  else localStorage.removeItem("i4c_admin_token");
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (options.auth) {
    const token = getAdminToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const baseUrl = import.meta.env.VITE_API_URL || "";
  const fullUrl = path.startsWith("http") ? path : `${baseUrl}${path}`;
  const res = await fetch(fullUrl, { ...options, headers });
  const data = await parseJsonSafe(res);
  if (!res.ok) {
    let message = data?.error || `Request failed (${res.status})`;
    const firstFieldErrors = data?.details?.fieldErrors
      ? Object.values(data.details.fieldErrors).find((x: unknown) => Array.isArray(x) && x.length > 0)
      : null;
    if (Array.isArray(firstFieldErrors) && firstFieldErrors[0]) {
      message = `${message}: ${String(firstFieldErrors[0])}`;
    }
    throw new Error(message);
  }
  return data as T;
}

