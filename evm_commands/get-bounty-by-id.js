import { ethers } from 'ethers';
import { TAIKO_PROVIDER_PATH, DEV_PROVIDER_PATH, DEV_BOT_PRIVATE_KEY } from './config/config.js';
import { getManagerContract } from './get-contracts.js';
import { STRATEGY_ABI } from './config/strategy-abi.js';
import dotenv from 'dotenv';
dotenv.config();

const provider = new ethers.JsonRpcProvider(DEV_PROVIDER_PATH);
const managerWallet = new ethers.Wallet(DEV_BOT_PRIVATE_KEY, provider);

/**
 * @function getBountyById
 * @description Retrieves detailed information about a bounty using its unique identifier by interacting with the manager and strategy contracts.
 * @async
 * 
 * @param {string} bountyId - The unique identifier of the bounty.
 * @returns {Promise<object>} Resolves with an object containing detailed bounty information if successful, or an error object if an exception occurs.
 * 
 * Structure of the returned bounty data:
 * - `bountyHasTokens` (number): The amount of tokens associated with the bounty.
 * - `strategyAddress` (string | null): The address of the strategy contract associated with the bounty, or `null` if no strategy exists.
 * - `donors` (array): A list of donor addresses contributing to the bounty.
 * - `strategyState` (number | null): The state of the strategy (1 for active, `null` if inactive or not available).
 * - `hunter` (string | null): The address of the hunter assigned to the bounty, or `null` if no hunter is assigned.
 * 
 * Behavior:
 * - Retrieves the bounty information from the manager contract using `getBountyInfo`.
 * - If a strategy is associated with the bounty:
 *   - Fetches additional information from the strategy contract.
 *   - Updates the bounty data with the strategy state and hunter address if available.
 * - Handles and logs errors during the process.
 * 
 * Example Usage:
 * ```javascript
 * const bountyData = await getBountyById("bountyId123");
 * if (bountyData.error) {
 *   console.error("Error fetching bounty data:", bountyData.error);
 * } else {
 *   console.log("Bounty Data:", bountyData);
 * }
 * ```
 * 
 * Error Handling:
 * - Logs errors to the console with the prefix `ERROR | getBountyById`.
 * - Returns an object containing the `error` field if an exception occurs.
 * 
 * Contract Interaction:
 * - Calls `getBountyInfo(bytes32 bountyId)` on the manager contract to retrieve basic bounty information.
 * - If a strategy exists, interacts with the strategy contract to fetch additional details such as strategy state and hunter address.
 */
export async function getBountyById(bountyId) {
    try {
        // Initialize the bounty data structure
        const bountyData = {
            bountyHasTokens: null,
            strategyAddress: null,
            donors: [],
            strategyState: null,
            hunter: null
        };

        // Fetch bounty info from the manager contract
        const managerContract = await getManagerContract();
        const bountyInfo = await managerContract.getBountyInfo(bountyId);

        // Validate the bounty info
        if (!bountyInfo.length) {
            return { error: "Invalid Bounty Info" };
        }

        // Populate basic bounty data
        bountyData.bountyHasTokens = Number(bountyInfo[5]);
        bountyData.donors = bountyInfo[3];

        // Check for the strategy contract address
        const strategyAddress = bountyInfo[7] !== ethers.ZeroAddress ? bountyInfo[7] : null;

        if (strategyAddress) {
            // Populate strategy-related data
            bountyData.strategyAddress = strategyAddress;

            // Fetch strategy information from the strategy contract
            const bountyStrategy = new ethers.Contract(strategyAddress, STRATEGY_ABI, managerWallet);
            const strategyInfo = await bountyStrategy.getBountyStrategyInfo();

            const strategyState = strategyInfo[0];
            const hunterAddress = strategyInfo[4];

            if (strategyState == 1) {
                bountyData.strategyState = 1; // Active strategy
            }

            if (hunterAddress !== ethers.ZeroAddress) {
                bountyData.hunter = hunterAddress; // Assigned hunter address
            }
        }

        return bountyData;
    } catch (error) {
        // Log and return any caught errors
        console.error("ERROR | getBountyById:", error);
        return { error: error };
    }
}