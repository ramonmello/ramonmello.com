import { type KeyboardHandler, type KeyState } from "@engine/core";
import { useEffect, useRef } from "react";

export function useKeyboard(): KeyboardHandler {
  const keysRef = useRef<KeyState>({});

  // Stable across renders: the handler is an effect dependency downstream, and
  // a fresh object each render would tear the engine down on every re-render.
  const handlerRef = useRef<KeyboardHandler>({
    getState: () => ({ ...keysRef.current }),
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    const handleBlur = () => {
      keysRef.current = {};
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  return handlerRef.current;
}
