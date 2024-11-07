import { ethers } from 'ethers';
import { DEV_PROVIDER_PATH, DEV_PRIVATE_KEY, DONOR_PRIVATE_KEY } from './config/config.js';

const provider = new ethers.JsonRpcProvider(DEV_PROVIDER_PATH);
const wallet = new ethers.Wallet(DEV_PRIVATE_KEY, provider);
const donorWallet = new ethers.Wallet(DONOR_PRIVATE_KEY, provider); // Create donor wallet from private key
const MOCK_TOKEN = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"; // Mock token address

export async function approveToken(walletFrom, walletTo, amountIn) {
    try {

        const amount = ethers.parseUnits(amountIn, 18); // Amount to transfer (e.g., 5 tokens with 18 decimals)

        const tokenContract = new ethers.Contract(MOCK_TOKEN, [
            "function approve(address spender, uint256 amount) external returns (bool)",
            "function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)"
        ], walletFrom); // Connect the token contract to the donor wallet

        // Approve the wallet to spend tokens on behalf of donorWallet
        console.log("Approving wallet to spend tokens on behalf of donorWallet...");
        const approveTx = await tokenContract.approve(walletTo, amount);
        await approveTx.wait();
        console.log("Approval complete. Wallet can now spend on behalf of donorWallet.");

    } catch (error) {
        console.error("Transaction failed:", error);
        throw new Error("Failed to register bounty.");
    }
}

approveToken(donorWallet, wallet.address, '1');

