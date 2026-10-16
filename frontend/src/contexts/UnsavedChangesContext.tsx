
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import UnsavedChangesModal from "@/components/navigation/UnsavedChangesModal";
import { useNavigationGuard } from "nextjs-nav-guard";

interface UnsavedChangesContextValue {
  hasUnsavedChanges: boolean;

  setHasUnsavedChanges: (
    value: boolean,
  ) => void;

  confirmNavigation: () => boolean;

  requestNavigation: (
    action: () => void,
  ) => void;
}

const UnsavedChangesContext =
  createContext<
    UnsavedChangesContextValue | undefined
  >(undefined);

export function UnsavedChangesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    hasUnsavedChanges,
    setUnsavedState,
  ] = useState(false);

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const unsavedRef = useRef(false);

  const pendingActionRef =
    useRef<(() => void) | null>(null);

  const navigationGuard = useNavigationGuard({
    enabled: ({ type }) =>
      hasUnsavedChanges &&
      type === "popstate",
  });

  const setHasUnsavedChanges = useCallback(
    (value: boolean) => {
      unsavedRef.current = value;
      setUnsavedState(value);
    },
    [],
  );

  // Temporary compatibility with existing
  // sidebar and navbar navigation.
  const confirmNavigation = useCallback(() => {
    if (!unsavedRef.current) {
      return true;
    }

    return window.confirm(
      "You have unsaved changes. Leave this page and discard them?",
    );
  }, []);

  const requestNavigation = useCallback(
    (action: () => void) => {
      if (!unsavedRef.current) {
        action();
        return;
      }

      pendingActionRef.current = action;
      setModalOpen(true);
    },
    [],
  );

  const handleStay = useCallback(() => {
    if (navigationGuard.active) {
      navigationGuard.reject();
      return;
    }

    pendingActionRef.current = null;
    setModalOpen(false);
  }, [navigationGuard]);

  const handleLeave = useCallback(() => {
    if (navigationGuard.active) {
      navigationGuard.accept();
      return;
    }

    const action = pendingActionRef.current;

    pendingActionRef.current = null;
    setModalOpen(false);

    unsavedRef.current = false;
    setUnsavedState(false);

    action?.();
  }, [navigationGuard]);

  const value = useMemo(
    () => ({
      hasUnsavedChanges,
      setHasUnsavedChanges,
      confirmNavigation,
      requestNavigation,
    }),
    [
      hasUnsavedChanges,
      setHasUnsavedChanges,
      confirmNavigation,
      requestNavigation,
    ],
  );

  return (
    <UnsavedChangesContext.Provider
      value={value}
    >
      {children}

      <UnsavedChangesModal
        open={modalOpen || navigationGuard.active}
        onStayAction={handleStay}
        onLeaveAction={handleLeave}
      />
    </UnsavedChangesContext.Provider>
  );
}

export function useUnsavedChangesContext() {
  const context = useContext(
    UnsavedChangesContext,
  );

  if (!context) {
    throw new Error(
      "useUnsavedChangesContext must be used within UnsavedChangesProvider",
    );
  }

  return context;
}