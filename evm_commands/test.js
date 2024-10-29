import { ethers } from 'ethers';

// Connection setup
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const wallet = new ethers.Wallet(privateKey, provider);

// Deployed contract address and ABI
const contractAddress = "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82"; // Replace with actual contract address
const contractAbi = [
    "function registerProject(address _token, uint256 _needs, string _name, string _metadata) external returns (bytes32)",
    "function getPoolToken(bytes32 _bountyId) external view returns (address token)",
    "event ProjectRegistered(bytes32 profileId, uint256 nonce)"
];

async function fetchPastEvents(contract, fromBlock, toBlock, targetNonce) {

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


async function main() {
    // Instantiate the contract
    const managerContract = new ethers.Contract(contractAddress, contractAbi, wallet);

    // Define parameters for event search
    const fromBlock = 0;
    const toBlock = "latest";
    const targetNonce = 1; // Replace with actual nonce you’re looking for

    // Fetch past events and retrieve profile ID for the target nonce
    const profileId = await fetchPastEvents(managerContract, fromBlock, toBlock, targetNonce);
    
    if (profileId) {
        console.log("::::::: Matching profileId found:", profileId);
        const projectToken = await managerContract.getPoolToken(profileId);
        console.log("::::::: Project Token:", projectToken);
    } else {
        console.log("No matching profileId found for the given nonce.");
    }
}

// Execute the function
main().catch(console.error);
