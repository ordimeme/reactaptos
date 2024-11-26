export const NETWORK = import.meta.env.VITE_APP_NETWORK ?? "testnet";
export const MODULE_ADDRESS = import.meta.env.VITE_MODULE_ADDRESS;
export const CREATOR_ADDRESS = import.meta.env.VITE_FA_CREATOR_ADDRESS;
export const FA_ADDRESS = import.meta.env.VITE_FA_ADDRESS;
export const IS_DEV = Boolean(import.meta.env.DEV);
export const IS_PROD = Boolean(import.meta.env.PROD);
export const APTOS_API_KEY = import.meta.env.VITE_APTOS_API_KEY;
export const STAKE_MODULE_ADDRESS = import.meta.env.VITE_STAKE_MODULE_ADDRESS ?? "";
export const STAKE_FA_ADDRESS = import.meta.env.VITE_STAKE_FA_ADDRESS ?? "";
export const STAKE_REWARD_CREATOR_ADDRESS = import.meta.env.VITE_STAKE_REWARD_CREATOR_ADDRESS ?? "";

if (!import.meta.env.VITE_STAKE_FA_ADDRESS) {
  console.warn('VITE_STAKE_FA_ADDRESS is not defined in environment variables');
}
