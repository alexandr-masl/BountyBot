import { ethers } from 'ethers';
import { TAIKO_PROVIDER_PATH, DEV_PROVIDER_PATH, DEV_BOT_PRIVATE_KEY } from './config/config.js';
import dotenv from 'dotenv';
dotenv.config();

const provider = new ethers.JsonRpcProvider(DEV_PROVIDER_PATH);
const managerWallet = new ethers.Wallet(DEV_BOT_PRIVATE_KEY, provider);

/**
 * @function getManagerAddress
 * @description Retrieves the Ethereum address of the bot wallet (manager wallet) configured for managing bounties.
 * @async
 * 
 * @returns {Promise<string|object>} Resolves with the Ethereum address of the bot wallet if successful, or an error object if an exception occurs.
 * 
 * Behavior:
 * - Uses the private key and provider specified in the configuration to create a wallet instance.
 * - Returns the wallet address associated with the bot.
 * - Handles errors gracefully by returning an error object.
 * 
 * Example Usage:
 * ```javascript
 * const managerAddress = await getManagerAddress();
 * if (managerAddress.error) {
 *   console.error("Error fetching manager address:", managerAddress.error);
 * } else {
 *   console.log("Manager Address:", managerAddress);
 * }
 * ```
 * 
 * Error Handling:
 * - Catches any exceptions and returns an object with an `error` field containing the exception.
 */
export async function getManagerAddress() {
    try {
        // Return the address of the manager wallet
        return managerWallet.address;
    } catch (error) {
        // Handle errors and return an error object
        return { error: error };
    }
}
