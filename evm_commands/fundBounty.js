import { ethers } from 'ethers';
import { MANAGER_ADDRESS, DEV_PROVIDER_PATH, DEV_PRIVATE_KEY } from './config/config.js';
import { MANAGER_ABI } from './config/managerAbi.js';

const provider = new ethers.JsonRpcProvider(DEV_PROVIDER_PATH);
const wallet = new ethers.Wallet(DEV_PRIVATE_KEY, provider);

export async function fundBounty(bountyId, donorWallet) {
    try {
        const managerContract = new ethers.Contract(MANAGER_ADDRESS, MANAGER_ABI, wallet);
        const bountyInfo = await managerContract.getBountyInfo(bountyId);

        console.log(":::::::: fundBounty");
        console.log(":::::::: Bounty Info");
        console.log(bountyInfo);

        // Set up the token contract with a minimal ERC20 ABI
        const tokenContract = new ethers.Contract(bountyInfo[0], [
            "function balanceOf(address account) view returns (uint256)",
            "function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)",
            "function approve(address spender, uint256 amount) external returns (bool)",
        ], wallet);

        // // Check balances before the transfer
        const donorBalanceBefore = await tokenContract.balanceOf(donorWallet);
        const walletBalanceBefore = await tokenContract.balanceOf(wallet.address);
        console.log("Donor balance before transfer:", ethers.formatUnits(donorBalanceBefore, 18));
        console.log("Wallet balance before transfer:", ethers.formatUnits(walletBalanceBefore, 18));

        // // // Transfer tokens from donorWallet to wallet
        console.log("Transferring tokens from donorWallet to wallet...");
        const transferTx = await tokenContract.transferFrom(donorWallet, wallet.address, bountyInfo[4]);
        console.log("Transaction hash:", transferTx.hash);

        // // Wait for the transaction to be confirmed
        await transferTx.wait();
        console.log("Transfer complete");

        // // // Check balances after the transfer
        const donorBalanceAfter = await tokenContract.balanceOf(donorWallet);
        const walletBalanceAfter = await tokenContract.balanceOf(wallet.address);
        console.log("Donor balance after transfer:", ethers.formatUnits(donorBalanceAfter, 18));
        console.log("Wallet balance after transfer:", ethers.formatUnits(walletBalanceAfter, 18));

        console.log("Approving Manager Contract to spend tokens on behalf of botWallet...");
        const approveTx = await tokenContract.approve(MANAGER_ADDRESS, bountyInfo[4]);
        await approveTx.wait();
        console.log("Approval complete. Manager Contract can now spend on behalf of botWallet.");

        console.log("Funding Bounty...");
        const fundBountyTx = await managerContract.supplyProject(bountyId, bountyInfo[4], donorWallet);
        console.log("Transaction hash:", fundBountyTx.hash);

        // Wait for the transaction to be confirmed
        await fundBountyTx.wait();
        console.log("Funding complete");
    } catch (error) {
        console.error("Transaction failed:", error);
        throw new Error("Failed to register bounty.");
    }
}
