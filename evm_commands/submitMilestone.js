import { ethers } from 'ethers';
import { MANAGER_ADDRESS, DEV_PROVIDER_PATH, DEV_PRIVATE_KEY } from './config/config.js';
import { MANAGER_ABI } from './config/managerAbi.js';
import { STRATEGY_ABI } from './config/strategyAbi.js';
import { ERC20_ABI } from './config/erc20-abi.js';

const provider = new ethers.JsonRpcProvider(DEV_PROVIDER_PATH);
const managerWallet = new ethers.Wallet(DEV_PRIVATE_KEY, provider);

export async function submitMilestones(bountyId, pullRequestPath) {
  try{  
    const managerContract = new ethers.Contract(MANAGER_ADDRESS, MANAGER_ABI, managerWallet);
    const bountyInfo = await managerContract.getBountyInfo(bountyId);

    console.log(":::::::: submitMilestones");
    console.log(":::::::: Bounty Info");
    console.log(bountyInfo);

    const bountyStrategy = new ethers.Contract(bountyInfo[7], STRATEGY_ABI, managerWallet);

    const milestone = await bountyStrategy.submitMilestone(0, pullRequestPath, { gasLimit: 3000000});

    const milestoneTxResult = await milestone.wait();
    console.log("::::::: RESULT");
    console.log(milestoneTxResult);

    const tokenContractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
    const tokenContract = new ethers.Contract(tokenContractAddress, ERC20_ABI, provider);

    // Replace `hunterAddress` with the specified wallet's address
    const hunterAddress = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
    const hunterBalance = await tokenContract.balanceOf(hunterAddress);
    console.log(":::::::: Hunter Wallet Balance");
    console.log(hunterBalance.toString());

  }
  catch(error){
    console.log("error !!! submitMilestones")
    console.log(error)
    return {error: error};
  }
}

// offerMilestones("0x3e4ff1a32318a7201199bb9644b3d4ac15c6a468b436c8456d812687b9b8e532");
