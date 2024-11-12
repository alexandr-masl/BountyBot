import { ethers } from 'ethers';
import { TAIKO_PROVIDER_PATH } from './config/config.js';
import dotenv from 'dotenv';
dotenv.config();

const provider = new ethers.JsonRpcProvider(TAIKO_PROVIDER_PATH);
const managerWallet = new ethers.Wallet(process.env.BOT_PRIVATE_KEY, provider);

export async function getManagerAddress(){
    try {
        return managerWallet.address;
    }
    catch(error){
        return {error: error};
    }
}
