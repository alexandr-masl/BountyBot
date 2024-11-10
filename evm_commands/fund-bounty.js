import { ethers } from 'ethers';
import { MANAGER_ADDRESS, DEV_PROVIDER_PATH, DEV_PRIVATE_KEY } from './config/config.js';
const provider = new ethers.JsonRpcProvider(DEV_PROVIDER_PATH);
const wallet = new ethers.Wallet(DEV_PRIVATE_KEY, provider);

import { getManagerContract, getTokenContract } from './get-contracts.js';

export async function fundBounty(bountyId, donorWallet) {
    try {
        const managerContract = await getManagerContract();
        const bountyInfo = await managerContract.getBountyInfo(bountyId);

        console.log(":::::::: fundBounty");
        console.log(":::::::: Bounty Info");
        console.log(bountyInfo);

        // Set up the token contract with a minimal ERC20 ABI
        const tokenContract = await getTokenContract(bountyInfo[0]);

        // // // Transfer tokens from donorWallet to wallet
        console.log("Transferring tokens from donorWallet to wallet...");
        const transferTx = await tokenContract.transferFrom(donorWallet, wallet.address, bountyInfo[4]);

        // // Wait for the transaction to be confirmed
        await transferTx.wait();
        console.log("Transfer complete");

        console.log("Approving Manager Contract to spend tokens on behalf of botWallet...");
        const approveTx = await tokenContract.approve(MANAGER_ADDRESS, bountyInfo[4]);
        await approveTx.wait();
        console.log("Approval complete. Manager Contract can now spend on behalf of botWallet.");

        console.log("Funding Bounty...");
        const fundBountyTx = await managerContract.supplyProject(bountyId, bountyInfo[4], donorWallet);

        // Wait for the transaction to be confirmed
        await fundBountyTx.wait();
        console.log("Funding complete");

        return await managerContract.getBountyInfo(bountyId);

    } catch (error) {
        return {error: error};
    }
}
