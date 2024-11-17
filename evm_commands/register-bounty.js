import { getManagerContract } from './get-contracts.js';

/**
 * @function registerBounty
 * @description Registers a new bounty project on the blockchain by interacting with the manager contract.
 * @async
 * 
 * @param {string} token - The Ethereum address of the ERC-20 token to be used for the bounty.
 * @param {number | string} needs - The total token amount needed for the bounty, specified in the smallest units of the token.
 * @param {string} name - The name of the project or bounty.
 * @param {string} metadata - Additional metadata or description of the project.
 * @returns {Promise<string | null>} Resolves with the profile ID (project ID) of the registered bounty if successful, or `null` if no events are found.
 * 
 * Behavior:
 * - Interacts with the manager contract to call the `registerProject` function with the specified parameters.
 * - Waits for the transaction to confirm.
 * - Fetches the latest `ProjectRegistered` event to retrieve the generated profile ID.
 * - Throws an error if the registration process fails.
 * 
 * Example Usage:
 * ```javascript
 * const profileId = await registerBounty(
 *   "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
 *   "1000000000000000000", // 1 token in wei
 *   "New Bounty",
 *   "This is a test bounty."
 * );
 * console.log("Bounty registered with ID:", profileId);
 * ```
 * 
 * Error Handling:
 * - Logs errors to the console.
 * - Throws an error with a descriptive message if the registration process fails.
 * 
 * Contract Interaction:
 * - Calls `registerProject(address token, uint256 needs, string name, string metadata)` on the manager contract.
 * - Queries past events to retrieve the latest `ProjectRegistered` event.
 */
export async function registerBounty(token, needs, name, metadata) {
    try {
        // Get the manager contract instance
        const managerContract = await getManagerContract();

        // Call the registerProject method on the contract
        const tx = await managerContract.registerProject(token, needs, name, metadata);
        await tx.wait();

        // Fetch the profile ID from past events
        const profileId = await fetchPastEvents(managerContract);

        return profileId;
    } catch (error) {
        console.error("Transaction failed:", error);
        throw new Error("Failed to register bounty.");
    }
}


/**
 * @function fetchPastEvents
 * @description Fetches past `ProjectRegistered` events from the manager contract to retrieve the latest profile ID (project ID).
 * @async
 * 
 * @param {object} contract - The ethers.js contract instance of the manager contract.
 * @returns {Promise<string | null>} Resolves with the profile ID of the latest event if found, or `null` if no events are present.
 * 
 * Behavior:
 * - Queries the `ProjectRegistered` events from the contract starting from block `0` to the latest block.
 * - Sorts the events by block number to ensure the latest event is retrieved.
 * - Extracts and returns the profile ID from the latest event.
 * 
 * Example Usage:
 * ```javascript
 * const managerContract = await getManagerContract();
 * const profileId = await fetchPastEvents(managerContract);
 * console.log("Latest Profile ID:", profileId);
 * ```
 * 
 * Error Handling:
 * - Logs a message to the console if no events are found.
 * - Does not throw an error; returns `null` if no events exist.
 * 
 * Contract Interaction:
 * - Queries the contract's event logs for `ProjectRegistered` events using `queryFilter`.
 */
async function fetchPastEvents(contract) {
    const fromBlock = 0; // Start from the first block
    const toBlock = "latest"; // Query up to the latest block

    // Fetch all ProjectRegistered events
    const events = await contract.queryFilter(contract.filters.ProjectRegistered(), fromBlock, toBlock);

    // Check if there are any events
    if (events.length === 0) {
        console.log("No ProjectRegistered events found.");
        return null;
    }

    // Sort events by block number to get the latest one
    events.sort((a, b) => b.blockNumber - a.blockNumber);

    // Get the latest event's profile ID
    const latestEvent = events[0];
    const profileId = latestEvent.args[0]; // The first argument should be the project ID (profileId)

    return profileId;
}

// (async ()=>{

//     await registerBounty("0x10f14F3bD798544027fFe32f85fA0a5679333296", 1, "test project 1", "test metadata 1");
    

// })()