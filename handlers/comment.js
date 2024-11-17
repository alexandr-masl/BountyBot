/**
 * @function manageComment
 * @description Processes a GitHub issue comment event to check for and manage commands.
 * @async
 * 
 * @param {object} context - The Probot context object containing event and GitHub API details.
 * @returns {Promise<void|object>} Resolves with `void` if successful or an error object if an exception occurs.
 * 
 * Behavior:
 * - Extracts the author and content of the issue comment.
 * - Ignores comments authored by the bot (`"daodrivenbounty[bot]"`).
 * - Uses `checkCommand` to parse the comment for recognized commands.
 * - If a valid command is found, delegates execution to `manageCommand`.
 * - Catches and logs any errors that occur during processing.
 * 
 * Example Usage:
 * ```javascript
 * await manageComment(context);
 * // This will check the context for a comment and process any valid commands.
 * ```
 * 
 * Error Handling:
 * - Logs errors to the console with the prefix `Error: manageComment`.
 * - Returns an error object if an exception is caught.
 */
export const manageComment = async (context) => {
    try {
        // Extract the author of the comment
        const commentAuthor = context.payload.comment.user.login;

        // Ignore comments authored by the bot
        if (commentAuthor !== "daodrivenbounty[bot]") {
            // Extract the content of the comment
            const commentContent = context.payload.comment.body;

            // Check if the comment contains a recognized command
            const command = checkCommand(commentContent);

            // If a valid command is found, delegate to manageCommand
            if (command.isCommand) {
                await manageCommand(context, command);
            }
        }
    } catch (err) {
        // Log errors to the console
        console.log(`Error: manageComment ${err}`);
        return { err: err };
    }
};
