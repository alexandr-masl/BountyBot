import { getStrategyContract } from './get-contracts.js';

/**
 * @function addRecipient
 * @description Adds a recipient (hunter) to a bounty by interacting with the bounty strategy contract.
 * @async
 * 
 * @param {string} bountyId - The unique identifier of the bounty.
 * @param {string} recipientWallet - The Ethereum wallet address of the recipient to be added.
 * @returns {Promise<object>} Resolves with the updated bounty strategy information if successful, or an error object if an exception occurs.
 * 
 * Behavior:
 * - Retrieves the bounty strategy contract instance using `getStrategyContract`.
 * - Calls the `reviewRecipient` function on the strategy contract to add the recipient.
 * - Waits for the transaction to be mined.
 * - Retrieves and returns the updated bounty strategy information using `getBountyStrategyInfo`.
 * - Logs errors and returns an error object if the process fails.
 * 
 * Example Usage:
 * ```javascript
 * const result = await addRecipient("bountyId123", "0x742d35Cc6634C0532925a3b844Bc454e4438f44e");
 * if (result.error) {
 *   console.error("Error adding recipient:", result.error);
 * } else {
 *   console.log("Recipient added successfully:", result);
 * }
 * ```
 * 
 * Error Handling:
 * - Logs errors to the console with the prefix `error !!! addRecipient`.
 * - Returns an object containing the `error` field if an exception occurs.
 * 
 * Contract Interaction:
 * - Calls `reviewRecipient(address recipient, uint8 status)` on the bounty strategy contract.
 * - Calls `getBountyStrategyInfo()` to fetch updated strategy details.
 */
export async function addRecipient(bountyId, recipientWallet) {
  try {
      // Fetch the strategy contract instance
      const bountyStrategy = await getStrategyContract(bountyId);

      // Call the contract method to review and add the recipient
      const addRecipient = await bountyStrategy.reviewRecipient(recipientWallet, 2, { gasLimit: 3000000 });

      // Wait for the transaction to be mined
      await addRecipient.wait();

      // Fetch and return the updated strategy information
      const strategyInfo = await bountyStrategy.getBountyStrategyInfo();
      return strategyInfo;
  } catch (error) {
      // Log and return any caught errors
      console.log("error !!! addRecipient");
      console.log(error);
      return { error: error };
  }
}