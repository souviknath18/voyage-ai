
"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import AppLayout from "@/components/layout/AppLayout";

import DashboardGreeting from "@/components/dashboard/DashboardGreeting";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardPlanHero from "@/components/dashboard/DashboardPlanHero";
import DashboardUpcomingTrip from "@/components/dashboard/DashboardUpcomingTrip";
import DashboardAgentActivity from "@/components/dashboard/DashboardAgentActivity";
import DashboardRecommendation from "@/components/dashboard/DashboardRecommendation";

import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";

import {
  useAuth,
} from "@/components/auth/AuthProvider";

import {
  getDashboardSummary,
} from "@/lib/dashboard";

import type {
  DashboardSummary,
} from "@/lib/dashboard";

export default function DashboardPage() {
  const {
    user,
    loading: authLoading,
    authenticated,
  } = useAuth();

  const [dashboard, setDashboard] =
    useState<DashboardSummary | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getDashboardSummary();
      setDashboard(data);
    } catch (err) {
      console.error(
        "Failed to load dashboard:",
        err,
      );

      setError(
        "Unable to load your dashboard. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading || !authenticated) {
      return;
    }

    void loadDashboard();
  }, [
    authLoading,
    authenticated,
    loadDashboard,
  ]);

  if (authLoading || (authenticated && loading)) {
    return (
      <AppLayout>
        <DashboardSkeleton />
      </AppLayout>
    );
  }

  if (!authenticated) {
    return null;
  }

  if (error || !dashboard) {
    return (
      <AppLayout>
        <div className="mx-auto flex min-h-[60vh] w-full max-w-[1280px] flex-col items-center justify-center gap-4 px-4 text-center md:px-6">
          <p className="text-sm text-[#948e9c]">
            {error ?? "Dashboard data is unavailable."}
          </p>

          <button
            type="button"
            onClick={() => void loadDashboard()}
            className="rounded-lg border border-white/10 bg-white/[0.035] px-5 py-2 text-sm font-medium text-[#e6e0e8] transition hover:bg-white/[0.07]"
          >
            Try Again
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-20 md:px-6">
        <div className="space-y-6 pt-2.5 sm:pt-3">
          {/* Greeting + Stats */}
          <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <DashboardGreeting
                userName={user?.full_name}
              />
            </div>

            <div className="lg:col-span-5">
              <DashboardStats
                stats={dashboard.stats}
              />
            </div>
          </section>

          {/* Main Bento */}
          <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <DashboardPlanHero />
            </div>

            <div className="lg:col-span-4">
              <DashboardUpcomingTrip
                trip={dashboard.upcoming_trip}
              />
            </div>
          </section>

          {/* Bottom Row */}
          <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <DashboardAgentActivity
                activities={dashboard.recent_activity}
              />
            </div>

            <div className="lg:col-span-8">
              <DashboardRecommendation />
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}