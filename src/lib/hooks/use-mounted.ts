"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/** true setelah komponen ter-mount di client (menghindari hydration mismatch) */
export function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
