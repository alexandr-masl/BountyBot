import { ethers } from 'ethers';
import { MANAGER_ADDRESS, DEV_PROVIDER_PATH, DEV_PRIVATE_KEY } from './config/config.js';
import { MANAGER_ABI } from './config/manager-abi.js';
import { STRATEGY_ABI } from './config/strategy-abi.js';

const provider = new ethers.JsonRpcProvider(DEV_PROVIDER_PATH);
const managerWallet = new ethers.Wallet(DEV_PRIVATE_KEY, provider);

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