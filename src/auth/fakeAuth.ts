import type { AuthUser } from "#/types";

const AUTH_USER_STORAGE_KEY = "devjokes-auth-user";

export function getStoredAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const rawUser = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
}

export function setStoredAuthUser(user: AuthUser) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredAuthUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
}

export const isLoggedIn = () => {
  return getStoredAuthUser() !== null;
};