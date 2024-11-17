import { getBountyId } from '../db/data-base.js'
import { removeRecipient } from '../evm_commands/remove-recipient.js';

/**
 * @function manageUnassigned
 * @description Handles the unassignment of a user from a GitHub issue that has an associated bounty. Removes the hunter from the bounty on the blockchain and posts a comment on the issue.
 * @async
 * 
 * @param {object} context - The Probot context object containing event and GitHub API details.
 * @returns {Promise<void|object>} Resolves with `void` if successful or an error object if an exception occurs.
 * 
 * Behavior:
 * - Retrieves the URL of the GitHub issue from the event payload.
 * - Uses `getBountyId` to fetch the bounty ID associated with the issue.
 * - Calls `removeRecipient` to remove the hunter from the bounty on the blockchain.
 * - Posts a comment on the GitHub issue, indicating that the hunter has been removed.
 * 
 * Example Usage:
 * ```javascript
 * await manageUnassigned(context);
 * // Removes the recipient from the bounty and comments on the issue.
 * ```
 * 
 * Error Handling:
 * - Logs errors to the console with the prefix `Error: manageUnassigned`.
 * - Returns an error object if an exception is caught.
 * 
 * API Calls:
 * - `context.octokit.issues.createComment`: Posts a comment on the issue indicating the hunter's removal.
 */
export const manageUnassigned = async (context) => {
    try {
        // Extract the URL of the GitHub issue
        const issueUrl = context.payload.issue.html_url;

        // Fetch the bounty ID associated with the issue
        const bountyId = await getBountyId(issueUrl);

        if (bountyId) {
            // Remove the recipient (hunter) from the bounty on the blockchain
            const removedRecipient = await removeRecipient(bountyId);

            // Create a comment on the issue to notify of the removal
            const reply = context.issue({ body: `🟡 Hunter: ${removedRecipient} has been removed from the Bounty` });

            // Post the comment
            return context.octokit.issues.createComment(reply);
        }
    } catch (error) {
        // Log and return any caught errors
        console.error(`Error: manageUnassigned ${error}`);
        return { error: error };
    }
};
