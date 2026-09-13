import AppLayout from "@/components/layout/AppLayout";

import {
  PageLoader,
} from "@/components/ui";

export default function Loading() {
  return (
    <AppLayout>
      <PageLoader
        title="Discovering destinations"
        description="VoyageAI is preparing destination recommendations."
      />
    </AppLayout>
  );
}