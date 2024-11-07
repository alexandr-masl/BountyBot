import { ethers } from 'ethers';
import { MANAGER_ADDRESS, DEV_PROVIDER_PATH, DEV_PRIVATE_KEY } from './config/config.js';
import { MANAGER_ABI } from './config/manager-abi.js';
import { STRATEGY_ABI } from './config/strategy-abi.js';

const provider = new ethers.JsonRpcProvider(DEV_PROVIDER_PATH);
const managerWallet = new ethers.Wallet(DEV_PRIVATE_KEY, provider);

export async function offerMilestones(bountyId) {
  try{   
    const managerContract = new ethers.Contract(MANAGER_ADDRESS, MANAGER_ABI, managerWallet);
    const bountyInfo = await managerContract.getBountyInfo(bountyId);

    console.log(":::::::: offerMilestones");
    console.log(":::::::: Bounty Info");
    console.log(bountyInfo);

    const bountyStrategy = new ethers.Contract(bountyInfo[7], STRATEGY_ABI, managerWallet);

    const milestonesOBJ = [
        {
          amountPercentage: ethers.parseUnits("1", "ether"), 
          metadata: bountyInfo[8],
          milestoneStatus: 0,
          description: "i will do my best"
        }
    ];

    const milestones = await bountyStrategy.offerMilestones(milestonesOBJ, { gasLimit: 3000000});

    const setMilestonesTxResult = await milestones.wait();
    console.log("---- Offer Milestones Tx Result");
    console.log(setMilestonesTxResult);

    return setMilestonesTxResult;
  }
  catch(error){
    return {error: error};
  }
}

// offerMilestones("0x3e4ff1a32318a7201199bb9644b3d4ac15c6a468b436c8456d812687b9b8e532");
