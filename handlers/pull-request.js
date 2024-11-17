import { getBountyId } from '../db/data-base.js'
import { submitMilestones } from '../evm_commands/submit-milestone.js'
import { getBountyById } from '../evm_commands/get-bounty-by-id.js';

/**
 * @function managePullRequest
 * @description Handles events for merged pull requests. If the pull request resolves a GitHub issue with an associated active bounty, it submits milestones and distributes funds to the bounty hunter.
 * @async
 * 
 * @param {object} context - The Probot context object containing event and GitHub API details.
 * @returns {Promise<void|object>} Resolves with `void` if successful or an error object if an exception occurs.
 * 
 * Behavior:
 * - Checks if the pull request has been merged.
 * - Extracts an issue URL from the pull request body using a regular expression.
 * - Retrieves the bounty ID associated with the extracted issue URL from the database.
 * - Fetches bounty details using the bounty ID.
 * - If the bounty has an active strategy state and a hunter is assigned:
 *   - Submits the milestone and distributes funds using `submitMilestones`.
 *   - Appends a success message to the issue comment.
 * - Posts a comment on the linked issue, summarizing the result.
 * 
 * Example Usage:
 * ```javascript
 * await managePullRequest(context);
 * // This will process a merged PR and handle any associated bounty milestones.
 * ```
 * 
 * Error Handling:
 * - Logs errors to the console with the prefix `Error: managePullRequest`.
 * - Returns an error object if an exception is caught.
 * 
 * API Calls:
 * - `context.octokit.issues.createComment`: Posts a comment on the linked GitHub issue.
 */
export const managePullRequest = async (context) => {
  try {
      // Extract the pull request from the payload
      const pr = context.payload.pull_request;

      // Proceed only if the pull request has been merged
      if (pr.merged) {
          const bodyText = pr.body || '';

          // Regex to extract the issue URL from the PR body
          const issueLinkRegex = /https:\/\/github\.com\/[\w-]+\/[\w-]+\/issues\/(\d+)/;
          const match = bodyText.match(issueLinkRegex);

          if (match) {
              let body = `This issue was resolved by PR #${pr.number}`;
              const issueNumber = match[1];
              const issueUrl = match[0];
              const bountyId = await getBountyId(issueUrl);

              if (bountyId) {
                  // Fetch bounty details
                  const bountyData = await getBountyById(bountyId);

                  // Check if the bounty is active and has a hunter assigned
                  if (bountyData.strategyState) {
                      if (bountyData.hunter) {
                          await submitMilestones(bountyId, pr.html_url);
                          body += `\n\n🟢 The milestone has been submitted and funds have been distributed to the hunter's wallet.`;
                      }
                  }
              }

              // Post a comment on the linked issue
              await context.octokit.issues.createComment({
                  owner: context.payload.repository.owner.login,
                  repo: context.payload.repository.name,
                  issue_number: issueNumber,
                  body: body,
              });
          }
      }
  } catch (err) {
      // Log and return any caught errors
      console.log(`Error: managePullRequest ${err}`);
      return { err: err };
  }
};
