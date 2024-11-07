import { ethers } from 'ethers';
import { MANAGER_ADDRESS, DEV_PROVIDER_PATH, DEV_PRIVATE_KEY } from './config/config.js';
import { MANAGER_ABI } from './config/manager-abi.js';
import { STRATEGY_ABI } from './config/strategy-abi.js';
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

    const strategyInfo = await bountyStrategy.getBountyStrategyInfo();
    console.log(":::::::: Strategy Info");
    console.log(strategyInfo);

    const hunterAddress = strategyInfo[4];
    const bountyDonors = bountyInfo[3];
    const tokenAddress = bountyInfo[0];

    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

    const hunterBalance = await tokenContract.balanceOf(hunterAddress);
    console.log(":::::::: Hunter Wallet Balance");
    console.log(hunterBalance.toString());

    const donorBalance = await tokenContract.balanceOf(bountyDonors[0]);
    console.log(":::::::: Donor Wallet Balance");
    console.log(donorBalance.toString());

    if (hunterAddress !== ethers.ZeroAddress){

      const milestone = await bountyStrategy.submitMilestone(0, pullRequestPath, { gasLimit: 3000000});

      const milestoneTxResult = await milestone.wait();
      console.log("::::::: milestoneTxResult");
      console.log(milestoneTxResult);

      const updatedHunterBalance = await tokenContract.balanceOf(hunterAddress);
      console.log(":::::::: UPDATED Hunter Wallet Balance");
      console.log(updatedHunterBalance.toString());
    }
    else {

      return {error: ""}
    }
  }
  catch(error){
    console.log("error !!! submitMilestones")
    console.log(error)
    return {error: error};
  }
}

// offerMilestones("0x3e4ff1a32318a7201199bb9644b3d4ac15c6a468b436c8456d812687b9b8e532");
