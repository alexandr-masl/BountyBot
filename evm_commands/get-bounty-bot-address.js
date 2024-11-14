import { ethers } from 'ethers';
import { TAIKO_PROVIDER_PATH, DEV_PROVIDER_PATH, DEV_BOT_PRIVATE_KEY } from './config/config.js';
import dotenv from 'dotenv';
dotenv.config();

const provider = new ethers.JsonRpcProvider(DEV_PROVIDER_PATH);
const managerWallet = new ethers.Wallet(DEV_BOT_PRIVATE_KEY, provider);

export async function getManagerAddress(){
    try {
        return managerWallet.address;
    }
    catch(error){
        return {error: error};
    }
}
