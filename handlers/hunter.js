/**
 * @function assignHunter
 * @description Assigns the author of a comment as the assignee to a GitHub issue, if the issue is not already assigned.
 * @async
 * 
 * @param {object} context - The Probot context object containing event and GitHub API details.
 * @returns {Promise<object>} Resolves with an object indicating the result:
 * - `{ assigned: true }` if the user is successfully assigned.
 * - `{ err: "Error: Issue is already assigned" }` if the issue already has an assignee.
 * 
 * Behavior:
 * - Extracts the comment author's username from the event payload.
 * - Retrieves the current list of assignees for the issue using the GitHub API.
 * - If the issue already has an assignee, returns an error message.
 * - If no assignees are present, assigns the comment author to the issue.
 * 
 * Example Usage:
 * ```javascript
 * const result = await assignHunter(context);
 * if (result.assigned) {
 *   console.log("Hunter successfully assigned.");
 * } else {
 *   console.log(result.err);
 * }
 * ```
 * 
 * Error Handling:
 * - If the issue is already assigned, returns an error message without making changes.
 * 
 * API Calls:
 * - `context.octokit.issues.get`: Fetches issue details, including current assignees.
 * - `context.octokit.issues.addAssignees`: Adds the comment author as an assignee to the issue.
 */
export const assignHunter = async (context) => {
    // Extract the author of the comment
    const commentAuthor = context.payload.comment.user.login;

    // Fetch the issue details to retrieve current assignees
    const issueData = await context.octokit.issues.get(context.issue());
    const currentAssignees = issueData.data.assignees.map(assignee => assignee.login);

    // If the issue already has assignees, return an error
    if (currentAssignees.length) {
        return { err: "Error: Issue is already assigned" };
    } else {
        // Assign the comment author to the issue
        await context.octokit.issues.addAssignees(context.issue({
            assignees: [commentAuthor],
        }));

        // Return success response
        return { assigned: true };
    }
};
