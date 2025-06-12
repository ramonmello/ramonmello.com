"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useEditState } from "tinacms/dist/react";

export function TinaEditListener() {
  const { edit } = useEditState();
  const router = useRouter();

  useEffect(() => {
    const handleDraftMode = async () => {
      if (edit) {
        await fetch("/api/draft-mode/enable");
      } else {
        await fetch("/api/draft-mode/disable");
      }
      router.refresh();
    };
    handleDraftMode();
  }, [edit]);

  return null;
}
