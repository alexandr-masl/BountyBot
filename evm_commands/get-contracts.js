import { ethers } from 'ethers';
import { MANAGER_ADDRESS, TAIKO_PROVIDER_PATH, DEV_PROVIDER_PATH, DEV_BOT_PRIVATE_KEY } from './config/config.js';
import { MANAGER_ABI } from './config/manager-abi.js';
import { STRATEGY_ABI } from './config/strategy-abi.js';
import { ERC20_ABI } from './config/erc20-abi.js';
import dotenv from 'dotenv';
dotenv.config();

const provider = new ethers.JsonRpcProvider(DEV_PROVIDER_PATH);
const managerWallet = new ethers.Wallet(DEV_BOT_PRIVATE_KEY, provider);

export async function getManagerContract(){
    try {
        return new ethers.Contract(MANAGER_ADDRESS, MANAGER_ABI, managerWallet);
    }
    catch(error){
        return {error: error};
    }
}

export async function getStrategyContract(bountyId) {
    try{
        const managerContract = await getManagerContract();
        const bountyInfo = await managerContract.getBountyInfo(bountyId);
        
        const bountyStrategy = new ethers.Contract(bountyInfo[7], STRATEGY_ABI, managerWallet);

        return bountyStrategy;
    }
    catch(error){
        return {error: error};
    }
}

export async function getTokenContract(token) {
    try{
        return new ethers.Contract(token, ERC20_ABI, managerWallet);
    }
    catch(error){
        return {error: error};
    }
}
