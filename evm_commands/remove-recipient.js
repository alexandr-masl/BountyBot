import { getStrategyContract } from './get-contracts.js';

/**
 * @function removeRecipient
 * @description Removes a recipient (hunter) from a bounty by interacting with the bounty's strategy contract.
 * @async
 * 
 * @param {string} bountyId - The unique identifier of the bounty from which the recipient will be removed.
 * @returns {Promise<string | object>} Resolves with the Ethereum address of the removed recipient if successful, or an error object if an exception occurs.
 * 
 * Behavior:
 * - Retrieves the strategy contract instance associated with the bounty using `getStrategyContract`.
 * - Fetches the current recipient (hunter) address from the strategy contract by calling `getBountyStrategyInfo`.
 * - Calls the `reviewRecipient` method on the strategy contract to remove the recipient, passing `3` as the status (rejected).
 * - Waits for the transaction to confirm and returns the removed recipient's address.
 * - Handles and logs errors during the process.
 * 
 * Example Usage:
 * ```javascript
 * const removedRecipient = await removeRecipient("bountyId123");
 * if (removedRecipient.error) {
 *   console.error("Error removing recipient:", removedRecipient.error);
 * } else {
 *   console.log("Recipient removed successfully:", removedRecipient);
 * }
 * ```
 * 
 * Error Handling:
 * - Logs errors to the console with the prefix `error !!! removeRecipient`.
 * - Returns an object containing the `error` field if an exception occurs.
 * 
 * Contract Interaction:
 * - Interacts with the strategy contract to:
 *   - Fetch the current recipient address using `getBountyStrategyInfo`.
 *   - Call `reviewRecipient(address recipient, uint8 status)` to remove the recipient.
 */
export async function removeRecipient(bountyId) {
  try {  
      // Fetch the strategy contract for the given bounty
      const bountyStrategy = await getStrategyContract(bountyId);

      // Fetch strategy information, including the current recipient address
      const strategyInfo = await bountyStrategy.getBountyStrategyInfo();
      const recipientAddress = strategyInfo[4];

      // Call reviewRecipient to remove the recipient with status 3 (rejected)
      const removeRecipient = await bountyStrategy.reviewRecipient(recipientAddress, 3, { gasLimit: 3000000 });
      await removeRecipient.wait();

      // Return the removed recipient's address
      return strategyInfo[4];
  } catch (error) {
      // Log and return any caught errors
      console.log("error !!! removeRecipient");
      console.log(error);
      return { error: error };
  }
}