// Internal components
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { config } from "@/config";
import { useGetStakePoolData } from "@/hooks/useGetStakePoolData";
import { useGetTokenData } from "@/hooks/useGetTokenData";

export const StatsSection: React.FC = () => {
  const { tokenData } = useGetTokenData();
  const { totalStaked, stakingRatio, apr, rewardReleased, uniqueStakers } = useGetStakePoolData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="py-2 px-4" shadow="md">
        <div className="flex flex-col">
          <Label className="label-sm" tooltip={`The cumulative amount of ${tokenData?.symbol ?? config.aboutUs?.title} tokens that have been locked`}>
            Total Staked {tokenData?.symbol ?? config.aboutUs?.title}
          </Label>
        </div>
        <p className="heading-sm">{totalStaked}</p>
      </Card>
      <Card className="py-2 px-4" shadow="md">
        <div className="flex flex-col">
          <Label className="label-sm" tooltip={`The number of unique stakers of ${tokenData?.symbol ?? config.aboutUs?.title}`}>
            Unique Stakers
          </Label>
        </div>
        <p className="heading-sm">{uniqueStakers}</p>
      </Card>
      <Card className="py-2 px-4" shadow="md">
        <div className="flex flex-col">
          <Label className="label-sm" tooltip={`The proportion of the total supply of ${tokenData?.symbol ?? config.aboutUs?.title} that is currently being staked`}>
            Protocol Staking Ratio
          </Label>
        </div>
        <p className="heading-sm">{stakingRatio}%</p>
      </Card>
      <Card className="py-2 px-4" shadow="md">
        <div className="flex flex-col">
          <Label className="label-sm" tooltip={`The amount of ${tokenData?.symbol ?? config.aboutUs?.title} that has been released so far but not distributed`}>
            Rewards Released So Far
          </Label>
        </div>
        <p className="heading-sm">{rewardReleased}</p>
      </Card>
      <Card className="py-2 px-4" shadow="md">
        <div className="flex flex-col">
          <Label className="label-sm" tooltip={`Annual Percentage Rate. It represents the yearly rate of return earned by staking ${tokenData?.symbol ?? config.aboutUs?.title}`}>
            APR
          </Label>
        </div>
        <p className="heading-sm">{apr}%</p>
      </Card>
    </div>
  );
};
