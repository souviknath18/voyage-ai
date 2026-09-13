import AppLayout from "@/components/layout/AppLayout";

import {
  PageLoader,
} from "@/components/ui";

export default function Loading() {
  return (
    <AppLayout>
      <PageLoader
        title="Loading your trips"
        description="VoyageAI is retrieving your journeys."
      />
    </AppLayout>
  );
}