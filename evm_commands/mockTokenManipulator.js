import { ethers } from 'ethers';
import { TAIKO_PROVIDER_PATH, DEV_DONOR_PRIVATE_KEY } from './config/config.js';
import dotenv from 'dotenv';
dotenv.config();

const provider = new ethers.JsonRpcProvider(TAIKO_PROVIDER_PATH);
const wallet = new ethers.Wallet(process.env.BOT_PRIVATE_KEY, provider);
const donorWallet = new ethers.Wallet(DEV_DONOR_PRIVATE_KEY, provider); // Create donor wallet from private key
const MOCK_TOKEN = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"; // Mock token address

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
export async function sendToken(walletFrom, walletTo, amountIn) {
    try {
        const amount = ethers.parseUnits(amountIn, 18); // Amount to transfer (e.g., 5 tokens with 18 decimals)

        const tokenContract = new ethers.Contract(MOCK_TOKEN, [
            "function transfer(address recipient, uint256 amount) external returns (bool)"
        ], walletFrom); // Connect the token contract to the sender wallet

        // Directly transfer tokens from walletFrom to walletTo
        console.log("Transferring tokens from walletFrom to walletTo...");
        const transferTx = await tokenContract.transfer(walletTo, amount);
        await transferTx.wait();
        console.log("Transfer complete. Tokens have been sent to walletTo.");

    } catch (error) {
        console.error("Transaction failed:", error);
        throw new Error("Failed to transfer tokens.");
    }
}

(async ()=>{

    sendToken(wallet, "0x227B585084032057fEdA0346975C125b9F540320", "1")

    // approveToken(donorWallet, wallet.address, '1');    
})()


