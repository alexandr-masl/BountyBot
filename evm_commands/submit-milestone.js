import { ethers } from 'ethers';
import { getManagerContract, getStrategyContract, getTokenContract } from './get-contracts.js';

export async function submitMilestones(bountyId, pullRequestPath) {
  try{  

    const managerContract = await getManagerContract();
    const bountyInfo = await managerContract.getBountyInfo(bountyId);
    const bountyStrategy = await getStrategyContract(bountyId);

    const strategyInfo = await bountyStrategy.getBountyStrategyInfo();
    console.log(":::::::: Strategy Info");
    console.log(strategyInfo);

    const hunterAddress = strategyInfo[4];
    const bountyDonors = bountyInfo[3];
    const tokenAddress = bountyInfo[0];

    const tokenContract = await getTokenContract(tokenAddress);

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
      return {error: "ERROR: Invalid Hunter Address"};
    }
  }
  catch(error){
    console.log("error !!! submitMilestones")
    console.log(error)
    return {error: error};
  }
}