import { ethers } from 'ethers';
import { getStrategyContract } from './get-contracts.js';

/**
 * @function submitMilestones
 * @description Submits a milestone for a bounty by interacting with the bounty's strategy contract. Associates the milestone with a specific pull request.
 * @async
 * 
 * @param {string} bountyId - The unique identifier of the bounty for which the milestone is being submitted.
 * @param {string} pullRequestPath - The URL or identifier of the pull request associated with the milestone.
 * @returns {Promise<void | object>} Resolves with `void` if successful or an error object if an exception occurs.
 * 
 * Behavior:
 * - Retrieves the strategy contract instance associated with the bounty using `getStrategyContract`.
 * - Fetches strategy details to validate the presence of a valid hunter address.
 * - Calls the `submitMilestone` method on the strategy contract with the milestone ID (`0`) and pull request path.
 * - Waits for the transaction to complete.
 * - Returns an error object if the hunter address is invalid or if any exception occurs.
 * 
 * Example Usage:
 * ```javascript
 * const result = await submitMilestones("bountyId123", "https://github.com/user/repo/pull/45");
 * if (result?.error) {
 *   console.error("Error submitting milestone:", result.error);
 * } else {
 *   console.log("Milestone submitted successfully.");
 * }
 * ```
 * 
 * Error Handling:
 * - Returns an error object if:
 *   - The hunter address is invalid (`ethers.ZeroAddress`).
 *   - Any exception occurs during the process.
 * - Logs errors to the console with the prefix `error !!! submitMilestones`.
 * 
 * Contract Interaction:
 * - Interacts with the strategy contract to:
 *   - Fetch strategy details using `getBountyStrategyInfo`.
 *   - Call `submitMilestone(uint256 milestoneId, string metadata)` to submit the milestone.
 */
export async function submitMilestones(bountyId, pullRequestPath) {
  try {  
      // Fetch the strategy contract for the given bounty
      const bountyStrategy = await getStrategyContract(bountyId);

      // Fetch strategy information, including the hunter address
      const strategyInfo = await bountyStrategy.getBountyStrategyInfo();
      const hunterAddress = strategyInfo[4];

      // Validate the hunter address
      if (hunterAddress !== ethers.ZeroAddress) {
          // Submit the milestone with ID 0 and associated pull request path
          const milestone = await bountyStrategy.submitMilestone(0, pullRequestPath, { gasLimit: 3000000 });
          await milestone.wait();
      } else {
          return { error: "ERROR: Invalid Hunter Address" };
      }
  } catch (error) {
      // Log and return any caught errors
      console.log("error !!! submitMilestones");
      console.log(error);
      return { error: error };
  }
}