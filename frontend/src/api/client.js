const BASE = import.meta.env.VITE_API_URL ?? "https://localhost:7204";
const STORAGE_KEY = "davetio_auth";

export function getToken() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw).token : null;
  } catch {
    return null;
  }
}

export async function apiFetch(path, { method = "GET", body, auth = false } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (res.status === 204) return null;

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  if (!res.ok) {
    if (res.status === 401 && auth) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* yok say */
      }
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    const message =
      (data && typeof data === "object" && data.message) ||
      (typeof data === "string" && data) ||
      "Bir hata oluştu.";
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  if (!res.ok) {
    const message =
      (data && typeof data === "object" && data.message) ||
      (typeof data === "string" && data) ||
      "Bir hata oluştu.";
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return data;
}