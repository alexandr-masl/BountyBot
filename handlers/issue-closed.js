import { getBountyId } from '../db/data-base.js'
import { getBountyById } from '../evm_commands/get-bounty-by-id.js';

/**
 * @function manageIssueClosed
 * @description Handles the closure of a GitHub issue and checks if it has an associated active bounty.
 * If the issue is linked to an active bounty, it posts a comment with instructions for the donor to recover funds.
 * @async
 * 
 * @param {object} context - The Probot context object containing event and GitHub API details.
 * @returns {Promise<void|object>} Resolves with `void` if successful or an error object if an exception occurs.
 * 
 * Behavior:
 * - Retrieves the URL of the closed issue from the event payload.
 * - Checks if the issue URL is associated with a bounty by querying the database.
 * - If the issue is linked to a bounty:
 *   - Fetches bounty details from the blockchain using `getBountyById`.
 *   - Checks if the bounty is in an active strategy state.
 *   - Posts a comment with instructions for donors to recover their funds using the `rejectStrategy` function.
 * 
 * Example Usage:
 * ```javascript
 * await manageIssueClosed(context);
 * // Posts a comment if the closed issue is linked to an active bounty.
 * ```
 * 
 * Error Handling:
 * - Logs errors to the console with the prefix `Error: manageIssueClosed`.
 * - Returns an error object if an exception is caught.
 * 
 * API Calls:
 * - `context.octokit.issues.createComment`: Posts a comment on the closed issue.
 */
export const manageIssueClosed = async (context) => {
    try {
        // Extract the URL of the closed issue
        const issueUrl = context.payload.issue.html_url;

        // Check if the issue is associated with a bounty
        const bountyId = await getBountyId(issueUrl);

        if (bountyId) {
            // Fetch bounty details using the bounty ID
            const bountyData = await getBountyById(bountyId);

            // If the bounty is in an active strategy state, post instructions
            if (bountyData.strategyState) {
                const reply = context.issue({
                    body: `<b>🟡The issue has active bounty with ID: ${bountyId}</b> 
                    \nIf you are the bounty donor, you can get your funds back by calling the following function signature using your wallet:

                    \`\`\`
                        function rejectStrategy() external
                    \`\`\`

                    \nYou can call this function on the Strategy contract deployed at the address: 
                    \n<b>${bountyData.strategyAddress}</b>`
                });

                // Post the comment on the closed issue
                await context.octokit.issues.createComment(reply);
            }
        }
    } catch (error) {
        // Log and return any caught errors
        console.error(`Error: manageIssueClosed ${error}`);
        return { error: error };
    }
};
