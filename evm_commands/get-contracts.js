import { ethers } from 'ethers';
import { MANAGER_ADDRESS, TAIKO_PROVIDER_PATH, DEV_PROVIDER_PATH, DEV_BOT_PRIVATE_KEY } from './config/config.js';
import { MANAGER_ABI } from './config/manager-abi.js';
import { STRATEGY_ABI } from './config/strategy-abi.js';
import { ERC20_ABI } from './config/erc20-abi.js';
import dotenv from 'dotenv';
dotenv.config();

const provider = new ethers.JsonRpcProvider(DEV_PROVIDER_PATH);
const managerWallet = new ethers.Wallet(DEV_BOT_PRIVATE_KEY, provider);

/**
 * @function getManagerContract
 * @description Creates and returns an instance of the manager contract using the manager address, ABI, and the manager wallet.
 * @async
 * 
 * @returns {Promise<object>} Resolves with the manager contract instance if successful, or an error object if an exception occurs.
 * 
 * Behavior:
 * - Uses the manager wallet to create a contract instance for the manager contract.
 * - Handles errors gracefully by returning an error object.
 * 
 * Example Usage:
 * ```javascript
 * const managerContract = await getManagerContract();
 * if (managerContract.error) {
 *   console.error("Error fetching manager contract:", managerContract.error);
 * } else {
 *   console.log("Manager Contract:", managerContract);
 * }
 * ```
 * 
 * Error Handling:
 * - Catches exceptions and returns an object with an `error` field containing the exception.
 */
export async function getManagerContract() {
    try {
        return new ethers.Contract(MANAGER_ADDRESS, MANAGER_ABI, managerWallet);
    } catch (error) {
        return { error: error };
    }
}

/**
 * @function getStrategyContract
 * @description Fetches the strategy contract instance associated with a specific bounty by interacting with the manager contract.
 * @async
 * 
 * @param {string} bountyId - The unique identifier of the bounty.
 * @returns {Promise<object>} Resolves with the strategy contract instance if successful, or an error object if an exception occurs.
 * 
 * Behavior:
 * - Fetches the manager contract using `getManagerContract`.
 * - Retrieves bounty information from the manager contract using `getBountyInfo`.
 * - Creates and returns a contract instance for the strategy contract using the retrieved strategy address.
 * 
 * Example Usage:
 * ```javascript
 * const strategyContract = await getStrategyContract("bountyId123");
 * if (strategyContract.error) {
 *   console.error("Error fetching strategy contract:", strategyContract.error);
 * } else {
 *   console.log("Strategy Contract:", strategyContract);
 * }
 * ```
 * 
 * Error Handling:
 * - Catches exceptions and returns an object with an `error` field containing the exception.
 */
export async function getStrategyContract(bountyId) {
    try {
        const managerContract = await getManagerContract();
        const bountyInfo = await managerContract.getBountyInfo(bountyId);

        const bountyStrategy = new ethers.Contract(bountyInfo[7], STRATEGY_ABI, managerWallet);
        return bountyStrategy;
    } catch (error) {
        return { error: error };
    }
}

/**
 * @function getTokenContract
 * @description Creates and returns an instance of an ERC-20 token contract using its address, ABI, and the manager wallet.
 * @async
 * 
 * @param {string} token - The Ethereum address of the ERC-20 token contract.
 * @returns {Promise<object>} Resolves with the token contract instance if successful, or an error object if an exception occurs.
 * 
 * Behavior:
 * - Uses the token address and ERC-20 ABI to create a contract instance.
 * - Handles errors gracefully by returning an error object.
 * 
 * Example Usage:
 * ```javascript
 * const tokenContract = await getTokenContract("0x742d35Cc6634C0532925a3b844Bc454e4438f44e");
 * if (tokenContract.error) {
 *   console.error("Error fetching token contract:", tokenContract.error);
 * } else {
 *   console.log("Token Contract:", tokenContract);
 * }
 * ```
 * 
 * Error Handling:
 * - Catches exceptions and returns an object with an `error` field containing the exception.
 */
export async function getTokenContract(token) {
    try {
        return new ethers.Contract(token, ERC20_ABI, managerWallet);
    } catch (error) {
        return { error: error };
    }
}

