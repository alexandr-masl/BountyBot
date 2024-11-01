import { ethers } from 'ethers';
import {MANAGER_ADDRESS, DEV_PROVIDER_PATH, DEV_PRIVATE_KEY} from './config/config.js';
import {MANAGER_ABI} from './config/managerAbi.js';
const provider = new ethers.JsonRpcProvider(DEV_PROVIDER_PATH);
const wallet = new ethers.Wallet(DEV_PRIVATE_KEY, provider);

export async function registerBounty(token, needs, name, metadata) {
    try {
        const managerContract = new ethers.Contract(MANAGER_ADDRESS, MANAGER_ABI, wallet);

        const tx = await managerContract.registerProject(token, needs, name, metadata);
        await tx.wait();

        const profileId = await fetchPastEvents(managerContract);

        console.log(":::::::: Bounty ID")
        console.log(profileId)

        const bountyInfo = await managerContract.getBountyInfo(profileId);

        console.log(":::::::: Bounty Info")
        console.log(bountyInfo)

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
    
    console.log(`Latest Event caught: Project ID: ${profileId}, Pool ID (Nonce): ${latestEvent.args[1]}`);
    return profileId;
}


// registerBounty("0xa0Ee7A142d267C1f36714E4a8F75612F20a79720", 50, "Test Name", "Test Metadata")