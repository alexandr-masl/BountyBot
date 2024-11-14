import { ethers } from 'ethers';
import { MANAGER_ADDRESS, TAIKO_PROVIDER_PATH, DEV_PROVIDER_PATH, DEV_BOT_PRIVATE_KEY } from './config/config.js';
import dotenv from 'dotenv';
dotenv.config();

const provider = new ethers.JsonRpcProvider(DEV_PROVIDER_PATH);
const wallet = new ethers.Wallet(DEV_BOT_PRIVATE_KEY, provider);

import { getManagerContract, getTokenContract } from './get-contracts.js';

export async function fundBounty(bountyId, donorWallet) {
    try {
        const managerContract = await getManagerContract();
        const bountyInfo = await managerContract.getBountyInfo(bountyId);
        // Set up the token contract with a minimal ERC20 ABI
        const tokenContract = await getTokenContract(bountyInfo[0]);

        // Transfer tokens from donorWallet to wallet
        const transferTx = await tokenContract.transferFrom(donorWallet, wallet.address, bountyInfo[4]);
        await transferTx.wait();

        const approveTx = await tokenContract.approve(MANAGER_ADDRESS, bountyInfo[4]);
        await approveTx.wait();

        const fundBountyTx = await managerContract.supplyProject(bountyId, bountyInfo[4], donorWallet, { gasLimit: 3000000});

        // Wait for the transaction to be confirmed
        await fundBountyTx.wait();

        return await managerContract.getBountyInfo(bountyId);

    } catch (error) {
        console.log(error)
        return {error: error};
    }
}