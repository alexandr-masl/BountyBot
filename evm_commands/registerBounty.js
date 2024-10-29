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

        return profileId;
    } catch (error) {
        console.error("Transaction failed:", error);
        throw new Error("Failed to register bounty.");
    }
}

async function fetchPastEvents(contract) {

    const fromBlock = 0;
    const toBlock = "latest";
    const targetNonce = 1; // Replace with actual nonce you’re looking for

    const events = await contract.queryFilter(contract.filters.ProjectRegistered(), fromBlock, toBlock);
    
    let profileId = null;
    for (const event of events) {

        const eventNonce = Number(event.args[1]); // Extract nonce from event args
        console.log(`Event caught: Project ID: ${event.args[0]}, Pool ID (Nonce): ${eventNonce}`);

        if (eventNonce === targetNonce) {
            profileId = event.args[0]; // Store profileId if nonce matches
            break; // Exit the loop once the desired event is found
        }
    }

    return profileId; // Return the matching profileId or null if not found
}

// registerBounty("0xa0Ee7A142d267C1f36714E4a8F75612F20a79720", 50, "Test Name", "Test Metadata")