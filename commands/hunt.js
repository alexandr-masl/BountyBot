import {assignHunter} from "../handlers/hunter.js"
import {isValidAddress} from "../handlers/wallet-checker.js"
import {getBountyId} from '../db/data-base.js'
import { addRecipient } from "../evm_commands/add-recipient.js"

/**
 * @function huntCommand
 * @description Handles the `/hunt` command to assign a hunter to a bounty and add the hunter's wallet address as a recipient in the bounty contract.
 * @async
 * 
 * @param {object} context - The Probot context object containing event and GitHub API details.
 * @param {object} payload - The command payload containing:
 * - `wallet` (string): The wallet address of the hunter to be added.
 * 
 * @returns {Promise<void|object>} Resolves with `void` if successful or an error object if an exception occurs.
 * 
 * Behavior:
 * - Validates the provided wallet address using `isValidAddress`.
 * - Assigns the hunter to the GitHub issue using `assignHunter`.
 * - Retrieves the bounty ID associated with the issue using `getBountyId`.
 * - Adds the hunter's wallet address as a recipient in the bounty contract using `addRecipient`.
 * - Posts success or error messages as comments on the GitHub issue based on the results of each step.
 * 
 * Example Usage:
 * ```javascript
 * await huntCommand(context, { wallet: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e" });
 * // This will assign the hunter to the issue and add the wallet as a recipient in the bounty contract.
 * ```
 * 
 * Error Handling:
 * - Posts error messages as comments on the GitHub issue for various failure scenarios:
 *   - Invalid wallet address.
 *   - Errors in assigning the hunter (`assignHunter`).
 *   - Undefined bounty ID.
 *   - Errors in adding the recipient (`addRecipient`).
 * - Logs errors to the console with the prefix `Error: huntCommand`.
 * - Returns an error object if an exception is caught.
 * 
 * API Calls:
 * - `context.octokit.issues.createComment`: Posts comments on the GitHub issue to report success or failure.
 */
export const huntCommand = async (context, payload) => {
    try {
        // Validate the wallet address
        if (!isValidAddress(payload.wallet)) {
            const reply = context.issue({ body: "Error: invalid wallet address" });
            return context.octokit.issues.createComment(reply);
        }

        // Assign the hunter to the GitHub issue
        const hunter = await assignHunter(context);

        if (hunter.err) {
            const reply = context.issue({ body: hunter.err });
            return context.octokit.issues.createComment(reply);
        }

        // Retrieve the bounty ID associated with the issue
        const issueUrl = context.payload.issue.html_url;
        const bountyId = await getBountyId(issueUrl);

        // Handle undefined bounty ID
        if (!bountyId) {
            const reply = context.issue({ body: `🔴 Error: Undefined Bounty ID..` });
            return context.octokit.issues.createComment(reply);
        }

        // Add the hunter's wallet address as a recipient in the bounty contract
        const addRecipientData = await addRecipient(bountyId, payload.wallet);

        if (addRecipientData.error) {
            const reply = context.issue({ body: `🔴 addRecipient call error` });
            return context.octokit.issues.createComment(reply);
        } else {
            const reply = context.issue({
                body: `🟢 <b>${payload.wallet} hunter has been added</b>`
            });
            await context.octokit.issues.createComment(reply);
        }
    } catch (err) {
        // Log and return any caught errors
        console.log(`Error: huntCommand - ${err}`);
        return { err: err };
    }
};