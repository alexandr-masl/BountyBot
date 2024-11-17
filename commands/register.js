import { isAdminUser } from '../handlers/admin-check.js';
import { registerBounty } from '../evm_commands/register-bounty.js';
import { getBountyId, setBountyId } from '../db/data-base.js'
import { ethers } from 'ethers';
import { getManagerAddress } from '../evm_commands/get-bounty-bot-address.js'

/**
 * @function registerCommand
 * @description Handles the `/register` command to register a bounty for a GitHub issue and associate it with an on-chain bounty contract.
 * @async
 * 
 * @param {object} context - The Probot context object containing event and GitHub API details.
 * @param {object} payload - The command payload containing:
 * - `token` (string): The ERC-20 token address for the bounty.
 * - `amount` (string | number): The bounty amount to be registered.
 * 
 * @returns {Promise<void|object>} Resolves with `void` if successful or an error object if an exception occurs.
 * 
 * Behavior:
 * - Checks if the user executing the command has admin privileges using `isAdminUser`.
 * - Retrieves the GitHub issue's title and URL from the event payload.
 * - Checks if the issue is already associated with a bounty using `getBountyId`.
 * - If not already registered, registers the bounty on-chain using `registerBounty`.
 * - Posts a success comment on the GitHub issue, including the bounty ID, token, and amount.
 * - Updates the database with the new bounty ID using `setBountyId`.
 * - Handles errors at each step and posts relevant error messages as comments on the issue.
 * 
 * Example Usage:
 * ```javascript
 * await registerCommand(context, { token: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", amount: "100" });
 * // This will register a bounty for the GitHub issue and associate it with an on-chain contract.
 * ```
 * 
 * Error Handling:
 * - Posts error messages as comments on the GitHub issue for various failure scenarios:
 *   - Unauthorized user.
 *   - Issue already registered with a bounty.
 *   - Errors during bounty registration (`registerBounty`).
 * - Logs errors to the console with the prefix `Error: registerCommand`.
 * - Returns an error object if an exception is caught.
 * 
 * API Calls:
 * - `context.octokit.issues.createComment`: Posts comments on the GitHub issue to report success or failure.
 */
export const registerCommand = async (context, payload) => {
    try {
        // Check if the user is an admin
        const isAdmin = await isAdminUser(context);

        if (!isAdmin) {
            const reply = context.issue({ body: "Error: UnAuthorized" });
            return context.octokit.issues.createComment(reply);
        }

        // Extract issue details
        const issueTitle = context.payload.issue.title;
        const issueUrl = context.payload.issue.html_url;

        // Check if the issue is already registered
        const checkBountyId = await getBountyId(issueUrl);

        if (checkBountyId) {
            const reply = context.issue({ body: `🔴 Error: Already Registered` });
            return context.octokit.issues.createComment(reply);
        }

        // Convert the bounty amount to the correct format
        const amount = ethers.parseUnits(payload.amount.toString(), 18);

        // Register the bounty on-chain
        const bountyId = await registerBounty(payload.token, amount, issueTitle, issueUrl);

        if (bountyId.error) {
            const reply = context.issue({ body: `🔴 Error: ${bountyId.error}` });
            return context.octokit.issues.createComment(reply);
        } else {
            // Retrieve the bot wallet address
            const botAddress = await getManagerAddress();

            // Post a success comment with the bounty details
            const reply = context.issue({
                body: `🟢 <b>Bounty has been registered</b>\n\n<b>BOUNTY_ID:</b> ${bountyId}\n<b>TOKEN:</b> ${payload.token}\n<b>AMOUNT:</b> ${payload.amount}\n\nTo fund the bounty, approve the specified amount for the bot wallet: ${botAddress} and send /fund command along with your wallet address`
            });

            // Store the bounty ID in the database
            await setBountyId(issueUrl, bountyId);

            return context.octokit.issues.createComment(reply);
        }
    } catch (err) {
        // Log and return any caught errors
        console.error(`Error: registerCommand - ${err}`);
        return { err: err };
    }
};