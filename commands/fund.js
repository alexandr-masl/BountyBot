import { getBountyId } from '../db/data-base.js'
import { fundBounty } from '../evm_commands/fund-bounty.js'
import { offerMilestones} from '../evm_commands/offer-milestones.js';

/**
 * @function fundCommand
 * @description Processes the `/fund` command to fund a bounty and offer milestones on a GitHub issue associated with a bounty.
 * @async
 * 
 * @param {object} context - The Probot context object containing event and GitHub API details.
 * @param {object} payload - The payload containing the command details. Expected structure:
 * - `wallet` (string): The wallet address to fund the bounty.
 * 
 * @returns {Promise<void|object>} Resolves with `void` if successful or an error object if an exception occurs.
 * 
 * Behavior:
 * - Retrieves the bounty ID associated with the GitHub issue using `getBountyId`.
 * - If the bounty ID is undefined, posts an error comment on the issue.
 * - Calls `fundBounty` to fund the bounty and posts the result.
 * - Calls `offerMilestones` to offer milestones and posts the result.
 * 
 * Example Usage:
 * ```javascript
 * await fundCommand(context, { wallet: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e" });
 * // This will fund the bounty and add milestones for the associated GitHub issue.
 * ```
 * 
 * Error Handling:
 * - Posts error messages as comments on the GitHub issue for various failure scenarios:
 *   - Undefined bounty ID.
 *   - Errors in `fundBounty` or `offerMilestones` calls.
 * - Logs errors to the console with the prefix `Error: fundCommand`.
 * - Returns an error object if an exception is caught.
 * 
 * API Calls:
 * - `context.octokit.issues.createComment`: Posts comments on the GitHub issue for success or error messages.
 */
export const fundCommand = async (context, payload) => {
    try {
        // Extract the GitHub issue URL
        const issueUrl = context.payload.issue.html_url;

        // Fetch the bounty ID associated with the issue
        const bountyId = await getBountyId(issueUrl);

        // Handle undefined bounty ID
        if (!bountyId) {
            const reply = context.issue({ body: `🔴 Error: Undefined Bounty ID..` });
            return context.octokit.issues.createComment(reply);
        }

        // Call fundBounty to fund the bounty
        const fund = await fundBounty(bountyId, payload.wallet);

        if (fund.error) {
            const reply = context.issue({ body: `🔴 fundBounty call error` });
            return context.octokit.issues.createComment(reply);
        } else {
            const strategyAddress = fund[7]; // Retrieve the strategy address from the response
            const reply = context.issue({
                body: `🟢 <b>Bounty has been funded</b>\n\n<b>Bounty Strategy:</b> ${strategyAddress}`
            });
            await context.octokit.issues.createComment(reply);
        }

        // Call offerMilestones to add milestones
        const milestones = await offerMilestones(bountyId);

        if (milestones.error) {
            const reply = context.issue({ body: `🔴 offerMilestones call error` });
            return context.octokit.issues.createComment(reply);
        } else {
            const reply = context.issue({
                body: `🟢 <b>Milestone has been added, Hash: ${milestones.hash}</b>`
            });
            await context.octokit.issues.createComment(reply);
        }
    } catch (err) {
        // Log and return any caught errors
        console.error(`Error: fundCommand - ${err}`);
        return { err: err };
    }
};