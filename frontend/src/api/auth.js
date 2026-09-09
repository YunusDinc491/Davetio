import { apiFetch } from "./client";

export function registerRequest(username, password) {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: { username, password },
  });
}

export function loginRequest(username, password) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: { username, password },
  });
}