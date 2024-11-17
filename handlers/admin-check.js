/**
 * @function isAdminUser
 * @description Checks if the user triggering the event has admin-level permissions on the repository.
 * @async
 * 
 * @param {object} context - The Probot context object containing information about the event, payload, and octokit instance.
 * @returns {Promise<boolean>} Returns `true` if the user has admin-level permissions, otherwise `false`.
 * 
 * Behavior:
 * - Identifies the username of the user triggering the event:
 *   - If the event is an issue comment, fetches the username from `context.payload.comment.user.login`.
 *   - For other events, fetches the username from `context.payload.sender.login`.
 * - Uses Octokit's `repos.getCollaboratorPermissionLevel` API to determine the user's permission level on the repository.
 * - Returns `true` if the user's permission level is `"admin"`, otherwise returns `false`.
 * - Handles errors gracefully and logs them to the console.
 * 
 * Example Usage:
 * ```javascript
 * const isAdmin = await isAdminUser(context);
 * if (isAdmin) {
 *   console.log("User is an admin");
 * } else {
 *   console.log("User is not an admin");
 * }
 * ```
 * 
 * Error Handling:
 * - Logs any errors encountered during the API call and returns `false` if the permission check fails.
 */
export const isAdminUser = async (context) => {
    const username = context.payload.comment
        ? context.payload.comment.user.login  // for issue comments
        : context.payload.sender.login;       // for other events

    try {
        const { data } = await context.octokit.repos.getCollaboratorPermissionLevel({
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            username: username,
        });

        return data.permission === "admin";
    } catch (error) {
        console.error("Error fetching user permissions:", error);
        return false;
    }
};
