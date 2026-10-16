
"use client";

import {
  useCallback,
  useEffect,
  useRef,
} from "react";

interface UnsavedChangesGuard {
  hasUnsavedChanges: boolean;
  isSaving?: boolean;
}

export function useUnsavedChangesGuard({
  hasUnsavedChanges,
  isSaving = false,
}: UnsavedChangesGuard) {
  const shouldWarn =
    hasUnsavedChanges && !isSaving;

  const shouldWarnRef = useRef(shouldWarn);
  shouldWarnRef.current = shouldWarn;

  useEffect(() => {
    const handleBeforeUnload = (
      event: BeforeUnloadEvent,
    ) => {
      if (!shouldWarnRef.current) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload,
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload,
      );
    };
  }, []);

  const confirmNavigation = useCallback(() => {
    if (!shouldWarnRef.current) {
      return true;
    }

    return window.confirm(
      "You have unsaved changes. Leave this page and discard them?",
    );
  }, []);

  return {
    confirmNavigation,
  };
}