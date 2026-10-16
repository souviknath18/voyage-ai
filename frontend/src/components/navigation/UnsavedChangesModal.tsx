
"use client";

import { ConfirmModal } from "@/components/ui";

interface UnsavedChangesModalProps {
  open: boolean;
  onStayAction: () => void;
  onLeaveAction: () => void;
}

export default function UnsavedChangesModal({
  open,
  onStayAction,
  onLeaveAction,
}: UnsavedChangesModalProps) {
  return (
    <ConfirmModal
      open={open}
      onOpenChangeAction={(isOpen) => {
        if (!isOpen) {
          onStayAction();
        }
      }}
      title="Unsaved changes"
      description="You have unsaved changes in your settings. If you leave this page, those changes will be lost."
      confirmText="Leave without saving"
      cancelText="Stay on page"
      destructive
      onConfirmAction={onLeaveAction}
    />
  );
}