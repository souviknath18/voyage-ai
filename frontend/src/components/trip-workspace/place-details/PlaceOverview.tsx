import {
  Card,
} from "@/components/ui";

interface PlaceOverviewProps {
  description: string;
}

export default function PlaceOverview({
  description,
}: PlaceOverviewProps) {
  return (
    <Card className="p-4 sm:p-5">
      <h2 className="text-base font-semibold text-[#e6e0e8]">
        About This Place
      </h2>

      <p className="mt-3 text-sm leading-6 text-[#948e9c]">
        {description}
      </p>
    </Card>
  );
}