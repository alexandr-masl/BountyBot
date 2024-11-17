
/**
 * @function extractWords
 * @description Splits a string into an array of words by whitespace.
 * @param {string} content - The input string to be split into words.
 * @returns {string[]} An array of words extracted from the input string.
 * 
 * Example Usage:
 * ```javascript
 * const words = extractWords("hello world /register token 10");
 * console.log(words); // Output: ["hello", "world", "/register", "token", "10"]
 * ```
 */
const extractWords = (content) => {
    return content.trim().split(" ");
};

/**
 * @function checkCommand
 * @description Parses content for specific commands (`/hunt`, `/register`, `/fund`) and extracts associated parameters.
 * @param {string} content - The content to be parsed for commands and parameters.
 * @returns {Object} An object containing:
 * - `isCommand` (boolean): Indicates if the input contains a recognized command.
 * - `command` (string): The identified command (e.g., `/hunt`, `/register`, `/fund`).
 * - Additional fields (`wallet`, `token`, `amount`) based on the command's parameters.
 * If no command is found, returns an empty object `{}`.
 * 
 * Supported Commands:
 * - `/hunt <wallet>`: Returns the command and the associated wallet address.
 * - `/register <token> <amount>`: Returns the command, token type, and amount.
 * - `/fund <wallet>`: Returns the command and the associated wallet address.
 * 
 * Example Usage:
 * ```javascript
 * const result = checkCommand("/register ETH 10");
 * console.log(result); 
 * // Output: { isCommand: true, command: "/register", token: "ETH", amount: "10" }
 * 
 * const noCommand = checkCommand("hello world");
 * console.log(noCommand); 
 * // Output: {}
 * ```
 */
export const checkCommand = (content) => {
    if (content.toString().includes("/hunt")) {
        const commandData = extractWords(content);
        return { isCommand: true, command: commandData[0], wallet: commandData[1] };
    }
    if (content.toString().includes("/register")) {
        const commandData = extractWords(content);
        return { isCommand: true, command: commandData[0], token: commandData[1], amount: commandData[2] };
    }
    if (content.toString().includes("/fund")) {
        const commandData = extractWords(content);
        return { isCommand: true, command: commandData[0], wallet: commandData[1] };
    }
    return {}; // No command recognized
};
