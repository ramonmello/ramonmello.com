import { useEffect, useRef } from "react";

export type KeyState = { [key: string]: boolean };

export interface KeyboardHandler {
  getState(): KeyState;
}

export function useKeyboard(): KeyboardHandler {
  const keysRef = useRef<KeyState>({});

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

  const getState = (): KeyState => {
    return { ...keysRef.current };
  };

  return { getState };
}
