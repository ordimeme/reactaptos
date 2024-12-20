import { STAKE_MODULE_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";

export const getClaimableRewards = async (accountAddress: string | undefined): Promise<number> => {
  try {
    const rewards = await aptosClient().view<[number]>({
      payload: {
        function: `${STAKE_MODULE_ADDRESS}::stake_pool::get_claimable_reward`,
        functionArguments: [accountAddress],
      },
    });

    return rewards[0];
  } catch (error: any) {
    return 0;
  }
};
