import AppLayout from "@/components/layout/AppLayout";

import DashboardGreeting from "@/components/dashboard/DashboardGreeting";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardPlanHero from "@/components/dashboard/DashboardPlanHero";
import DashboardUpcomingTrip from "@/components/dashboard/DashboardUpcomingTrip";
import DashboardAgentActivity from "@/components/dashboard/DashboardAgentActivity";
import DashboardRecommendation from "@/components/dashboard/DashboardRecommendation";

import {
  mockTrip,
} from "@/data/mock-trip";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-20 md:px-6">
        <div className="space-y-6 pt-2.5 sm:pt-3">
          {/* Greeting + Stats */}
          <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <DashboardGreeting />
            </div>

            <div className="lg:col-span-5">
              <DashboardStats />
            </div>
          </section>

          {/* Main Bento */}
          <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <DashboardPlanHero />
            </div>

            <div className="lg:col-span-4">
              <DashboardUpcomingTrip
                trip={mockTrip}
              />
            </div>
          </section>

          {/* Bottom Row */}
          <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <DashboardAgentActivity />
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