/**
 * @function manageCommand
 * @description Routes a recognized command to its corresponding handler function for execution.
 * @async
 * 
 * @param {object} context - The Probot context object containing event and GitHub API details.
 * @param {object} command - An object containing the parsed command details. Expected structure:
 * - `command` (string): The recognized command (e.g., `/hunt`, `/register`, `/fund`).
 * - Additional fields (e.g., `wallet`, `token`, `amount`) as required by the specific command.
 * 
 * Behavior:
 * - Invokes the appropriate command handler (`huntCommand`, `registerCommand`, or `fundCommand`) based on the `command.command` value.
 * - Logs an error message if the command is unrecognized.
 * 
 * Supported Commands:
 * - `/hunt`: Delegates to `huntCommand`.
 * - `/register`: Delegates to `registerCommand`.
 * - `/fund`: Delegates to `fundCommand`.
 * 
 * Example Usage:
 * ```javascript
 * const command = { command: "/register", token: "ETH", amount: "10" };
 * await manageCommand(context, command);
 * // This will invoke the `registerCommand` function with the provided context and command details.
 * ```
 * 
 * Error Handling:
 * - Logs an error to the console if the `command.command` value is not recognized.
 */
export const manageCommand = async (context, command) => {
    switch (command.command) {
        case '/hunt':
            huntCommand(context, command);
            break;
        case '/register':
            registerCommand(context, command);
            break;
        case '/fund':
            fundCommand(context, command);
            break;
        default:
            console.log("ERROR: manageCommand | Unknown command:", command.command);
            break;
    }
};
