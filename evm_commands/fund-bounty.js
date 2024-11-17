import { ethers } from 'ethers';
import { MANAGER_ADDRESS, TAIKO_PROVIDER_PATH, DEV_PROVIDER_PATH, DEV_BOT_PRIVATE_KEY } from './config/config.js';
import dotenv from 'dotenv';
dotenv.config();

const provider = new ethers.JsonRpcProvider(DEV_PROVIDER_PATH);
const wallet = new ethers.Wallet(DEV_BOT_PRIVATE_KEY, provider);

import { getManagerContract, getTokenContract } from './get-contracts.js';

/**
 * @function fundBounty
 * @description Funds a bounty by transferring tokens from a donor wallet to the bot wallet, approving the manager contract, and supplying the project.
 * @async
 * 
 * @param {string} bountyId - The unique identifier of the bounty.
 * @param {string} donorWallet - The Ethereum wallet address of the donor providing the funds.
 * @returns {Promise<object>} Resolves with the updated bounty information if successful, or an error object if an exception occurs.
 * 
 * Behavior:
 * - Retrieves the manager contract instance using `getManagerContract`.
 * - Fetches the bounty information using the bounty ID.
 * - Sets up the token contract for the ERC-20 token specified in the bounty.
 * - Transfers the required token amount from the donor wallet to the bot wallet.
 * - Approves the manager contract to spend the transferred tokens.
 * - Calls `supplyProject` on the manager contract to fund the bounty.
 * - Waits for all transactions to be confirmed and retrieves the updated bounty information.
 * - Handles and logs errors during the process.
 * 
 * Example Usage:
 * ```javascript
 * const result = await fundBounty("bountyId123", "0x742d35Cc6634C0532925a3b844Bc454e4438f44e");
 * if (result.error) {
 *   console.error("Error funding bounty:", result.error);
 * } else {
 *   console.log("Bounty funded successfully:", result);
 * }
 * ```
 * 
 * Error Handling:
 * - Logs errors to the console.
 * - Returns an object containing the `error` field if an exception occurs.
 * 
 * Contract Interaction:
 * - Calls `getBountyInfo(bytes32 bountyId)` on the manager contract to retrieve bounty details.
 * - Interacts with the ERC-20 token contract to transfer and approve tokens.
 * - Calls `supplyProject(bytes32 bountyId, uint256 amount, address donorWallet)` on the manager contract to fund the project.
 */
export async function fundBounty(bountyId, donorWallet) {
    try {
        // Get the manager contract instance
        const managerContract = await getManagerContract();

        // Fetch the bounty details
        const bountyInfo = await managerContract.getBountyInfo(bountyId);

        // Initialize the token contract for the bounty's token
        const tokenContract = await getTokenContract(bountyInfo[0]);

        // Transfer tokens from donor wallet to the bot wallet
        const transferTx = await tokenContract.transferFrom(donorWallet, wallet.address, bountyInfo[4]);
        await transferTx.wait();

        // Approve the manager contract to spend tokens
        const approveTx = await tokenContract.approve(MANAGER_ADDRESS, bountyInfo[4]);
        await approveTx.wait();

        // Supply the project with the funds
        const fundBountyTx = await managerContract.supplyProject(bountyId, bountyInfo[4], donorWallet, { gasLimit: 3000000 });

        // Wait for the transaction to be confirmed
        await fundBountyTx.wait();

        // Return the updated bounty information
        return await managerContract.getBountyInfo(bountyId);
    } catch (error) {
        // Log and return any caught errors
        console.log(error);
        return { error: error };
    }
}