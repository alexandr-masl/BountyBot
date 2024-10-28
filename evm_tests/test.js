import { ethers } from 'ethers';

// Connection setup
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const wallet = new ethers.Wallet(privateKey, provider);

// Deployed contract address and ABI
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with actual contract address
const contractAbi = [
    "function setNumber(uint256 newNumber) public",
    "function number() view returns (uint256)"
];

async function setNumber(newNumber) {
    // Connect to the existing Counter contract
    const counter = new ethers.Contract(contractAddress, contractAbi, wallet);

    // Call setNumber and wait for transaction confirmation
    const tx = await counter.setNumber(newNumber);
    await tx.wait();

    // Verify the new value
    const currentNumber = await counter.number();
    console.log("Number after setNumber:", currentNumber.toString());
}

// Execute the function
setNumber(42).catch(console.error);
