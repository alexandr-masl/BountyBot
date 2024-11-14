import { getManagerContract } from './get-contracts.js';

export async function registerBounty(token, needs, name, metadata) {
    try {
        const managerContract = await getManagerContract();
        const tx = await managerContract.registerProject(token, needs, name, metadata);
        await tx.wait();
        const profileId = await fetchPastEvents(managerContract);

        return profileId;
    } catch (error) {
        console.error("Transaction failed:", error);
        throw new Error("Failed to register bounty.");
    }
}

async function fetchPastEvents(contract) {
    const fromBlock = 0;
    const toBlock = "latest";

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