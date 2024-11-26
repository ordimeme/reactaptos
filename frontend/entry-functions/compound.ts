import { STAKE_MODULE_ADDRESS } from "@/constants";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
/**
 * Claim and stake rewards at the same operation
 */
export const compound = (): InputTransactionData => {
  return {
    data: {
      function: `${STAKE_MODULE_ADDRESS}::stake_pool::compound`,
      functionArguments: [],
    },
  };
};
