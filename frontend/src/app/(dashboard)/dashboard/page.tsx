import AppLayout from "@/components/layout/AppLayout";

import AgentActivityCard from "@/components/dashboard/AgentActivityCard";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardWelcome from "@/components/dashboard/DashboardWelcome";
import DestinationRecommendationCard from "@/components/dashboard/DestinationRecommendationCard";
import FloatingAIAssistant from "@/components/dashboard/FloatingAIAssistant";
import PlanTripHeroCard from "@/components/dashboard/PlanTripHeroCard";
import UpcomingTripCard from "@/components/dashboard/UpcomingTripCard";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-12">
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <DashboardWelcome name="Souvik" />

          <DashboardStats
            trips={12}
            countries={24}
            savedPlaces={86}
          />
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <PlanTripHeroCard />
          </div>

          <div className="md:col-span-4">
            <UpcomingTripCard
              destination="Kyoto, Japan"
              dates="Oct 12 - Oct 24"
              duration="12 Days"
              flightStatus="Selected"
              hotel="Aman Kyoto"
              budgetStatus="On Track"
            />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <AgentActivityCard />

          <div className="lg:col-span-2">
            <DestinationRecommendationCard
              city="Amalfi Coast"
              country="Italy"
              description="Based on your interest in coastal destinations and food experiences, VoyageAI recommends a late-summer escape to the Amalfi Coast."
              image="/images/destinations/amalfi.jpg"
              slug="amalfi-coast"
            />
          </div>
        </section>
      </div>

      <FloatingAIAssistant />
    </AppLayout>
  );
}