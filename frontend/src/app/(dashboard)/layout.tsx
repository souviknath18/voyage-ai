"use client";

import {
  useEffect,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  useAuth,
} from "@/components/auth/AuthProvider";

import {
  PageLoader,
} from "@/components/ui";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router =
    useRouter();

  const {
    authenticated,
    loading,
  } = useAuth();

  useEffect(() => {
    if (
      !loading &&
      !authenticated
    ) {
      router.replace(
        "/login",
      );
    }
  }, [
    authenticated,
    loading,
    router,
  ]);

  if (loading) {
    return (
      <PageLoader
        title="Loading VoyageAI"
        description="Restoring your session..."
      />
    );
  }

  if (!authenticated) {
    return (
      <PageLoader
        title="Redirecting"
        description="Taking you to sign in..."
      />
    );
  }

  return children;
}