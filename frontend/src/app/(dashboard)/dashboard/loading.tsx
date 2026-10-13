import AppLayout from "@/components/layout/AppLayout";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";

export default function Loading() {
  return (
    <AppLayout>
      <DashboardSkeleton />
    </AppLayout>
  );
}