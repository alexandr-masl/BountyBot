import { ethers } from 'ethers';
import { getManagerContract, getStrategyContract } from './get-contracts.js';

/**
 * @function offerMilestones
 * @description Proposes milestones for a bounty by interacting with the bounty's strategy contract.
 * @async
 * 
 * @param {string} bountyId - The unique identifier of the bounty for which milestones are being offered.
 * @returns {Promise<object>} Resolves with the transaction result if successful, or an error object if an exception occurs.
 * 
 * Behavior:
 * - Retrieves the manager and strategy contracts for the specified bounty.
 * - Constructs a milestones object with the necessary details:
 *   - `amountPercentage`: The milestone's funding percentage (in this case, 1 ETH as an example).
 *   - `metadata`: Metadata retrieved from the bounty information.
 *   - `milestoneStatus`: The initial status of the milestone (set to 0).
 *   - `description`: The bounty ID as a description.
 * - Calls the `offerMilestones` method on the strategy contract to propose milestones.
 * - Waits for the transaction to complete and returns the transaction result.
 * 
 * Example Usage:
 * ```javascript
 * const result = await offerMilestones("bountyId123");
 * if (result.error) {
 *   console.error("Error offering milestones:", result.error);
 * } else {
 *   console.log("Milestones offered successfully:", result);
 * }
 * ```
 * 
 * Error Handling:
 * - Returns an object containing the `error` field if an exception occurs during the process.
 * 
 * Contract Interaction:
 * - Interacts with the manager contract to fetch bounty information.
 * - Interacts with the strategy contract to call the `offerMilestones` method with the constructed milestones object.
 */
export async function offerMilestones(bountyId) {
  try {
      // Fetch the manager contract and bounty info
      const managerContract = await getManagerContract();
      const bountyInfo = await managerContract.getBountyInfo(bountyId);

      // Fetch the strategy contract for the bounty
      const bountyStrategy = await getStrategyContract(bountyId);

      // Construct the milestones object
      const milestonesOBJ = [
          {
              amountPercentage: ethers.parseUnits("1", "ether"), // Example percentage (can be customized)
              metadata: bountyInfo[8], // Metadata from bounty info
              milestoneStatus: 0, // Initial status of the milestone
              description: bountyId // Use the bounty ID as the description
          }
      ];

      // Call the offerMilestones method on the strategy contract
      const offerMilestones = await bountyStrategy.offerMilestones(milestonesOBJ, { gasLimit: 3000000 });
      const offerMilestonesTxResult = await offerMilestones.wait();

      // Return the transaction result
      return offerMilestonesTxResult;
  } catch (error) {
      // Handle and return errors
      return { error: error };
  }
}