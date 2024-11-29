import { Card } from "@/components/ui/card";
import { clampNumber } from "@/utils/clampNumber";
import { useGetAssetData } from "../../../hooks/useGetAssetData";

interface StatsSectionProps {}

export const StatsSection: React.FC<StatsSectionProps> = () => {
  const { data } = useGetAssetData();
  if (!data) return null;
  const { maxSupply, currentSupply } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="py-2 px-4" shadow="md">
        <p className="label-sm">Max Supply</p>
        <p className="heading-sm">{clampNumber(maxSupply)}</p>
      </Card>
      <Card className="py-2 px-4" shadow="md">
        <p className="label-sm">Current Supply</p>
        <p className="heading-sm">{clampNumber(currentSupply)}</p>
      </Card>
    </div>
  );
};
