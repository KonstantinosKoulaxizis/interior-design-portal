"use client";

import { useSyncExternalStore } from "react";

const EVENT = "mm:intro-done";

declare global {
  interface Window {
    __mmIntroDone?: boolean;
  }
}

export function markIntroDone() {
  window.__mmIntroDone = true;
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

/** True once the first-visit preloader has lifted (or immediately when it was skipped). */
export function useIntroDone() {
  return useSyncExternalStore(
    subscribe,
    () => !!window.__mmIntroDone,
    () => false,
  );
}
