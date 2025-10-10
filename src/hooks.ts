import { useSyncExternalStore } from "react";
import {
  OpenAiGlobals,
  SET_GLOBALS_EVENT_TYPE,
  SetGlobalsEvent,
} from "./types";

export function useOpenAiGlobal<K extends keyof OpenAiGlobals>(
  key: K,
): OpenAiGlobals[K] {
  return useSyncExternalStore(
    (onChange) => {
      const handleSetGlobal = (event: SetGlobalsEvent) => {
        const value = event.detail.globals[key];
        if (value === undefined) {
          return;
        }

        onChange();
      };

      window.addEventListener(SET_GLOBALS_EVENT_TYPE, handleSetGlobal, {
        passive: true,
      });

      return () => {
        window.removeEventListener(SET_GLOBALS_EVENT_TYPE, handleSetGlobal);
      };
    },
    () => window.openai[key],
  );
}

export function useToolInput<T>() {
  return useOpenAiGlobal("toolInput") as T;
}

export function useToolOutput<T>() {
  return useOpenAiGlobal("toolOutput") as T | null;
}

export function useToolResponseMetadata() {
  return useOpenAiGlobal("toolResponseMetadata");
}

export async function refreshTool(name: string, args: Record<string, unknown>) {
  await window.openai?.callTool(name, args);
}
