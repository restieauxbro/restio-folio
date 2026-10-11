import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** Reads a browser-only value after hydration; the server (and first paint) get `serverValue`. */
export function useClientValue<T>(read: () => T, serverValue: T): T {
  return useSyncExternalStore(noop, read, () => serverValue);
}
