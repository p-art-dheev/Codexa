"use client";

import { signIn, signOut } from "next-auth/react";
import { useSyncExternalStore } from "react";

/**
 * "Switch account" support.
 *
 * Google OAuth has no concept of multiple simultaneous sessions in NextAuth,
 * so switching = end the current session, then start a new Google sign-in:
 *   - For a remembered account we pass `login_hint`, so Google picks that
 *     account directly (one click if it's already signed in to Google in
 *     this browser).
 *   - For "Use another account" we pass `prompt=select_account`, which forces
 *     Google's account chooser instead of silently re-using the last account.
 *
 * Recently used accounts are remembered in localStorage on this device only
 * (name / email / avatar — no tokens), so users on shared lab machines can
 * remove them from the menu.
 */

export type RememberedAccount = {
  email: string;
  name?: string | null;
  image?: string | null;
  role?: string | null;
  lastUsed: number;
};

const STORAGE_KEY = "codeproctor:accounts";
const MAX_ACCOUNTS = 5;
const EVENT = "codeproctor:accounts-changed";

function read(): RememberedAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as RememberedAccount[]) : [];
    return Array.isArray(parsed) ? parsed.filter((a) => a?.email) : [];
  } catch {
    return [];
  }
}

function write(accounts: RememberedAccount[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch {
    /* storage full / blocked — switching still works, just not remembered */
  }
  cache = null;
  window.dispatchEvent(new Event(EVENT));
}

export function rememberAccount(account: Omit<RememberedAccount, "lastUsed">) {
  if (!account.email) return;
  const others = read().filter(
    (a) => a.email.toLowerCase() !== account.email.toLowerCase()
  );
  write([{ ...account, lastUsed: Date.now() }, ...others].slice(0, MAX_ACCOUNTS));
}

export function forgetAccount(email: string) {
  write(read().filter((a) => a.email.toLowerCase() !== email.toLowerCase()));
}

// --- React binding (stable snapshot for useSyncExternalStore) ---
let cache: RememberedAccount[] | null = null;
const EMPTY: RememberedAccount[] = [];

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  if (cache === null) cache = read();
  return cache;
}

export function useRememberedAccounts() {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

// --- Actions ---
function currentPath() {
  if (typeof window === "undefined") return "/dashboard";
  const { pathname, search } = window.location;
  return pathname === "/" ? "/dashboard" : pathname + search;
}

/** Switch to a specific remembered account, or open Google's chooser. */
export async function switchAccount(email?: string) {
  const callbackUrl = currentPath();
  await signOut({ redirect: false });
  await signIn(
    "google",
    { callbackUrl },
    email ? { login_hint: email } : { prompt: "select_account" }
  );
}

export async function signInWithGoogle(callbackUrl = "/dashboard") {
  await signIn("google", { callbackUrl });
}
