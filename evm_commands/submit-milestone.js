import { ethers } from 'ethers';
import { getStrategyContract } from './get-contracts.js';

export async function submitMilestones(bountyId, pullRequestPath) {
  try{  
    const bountyStrategy = await getStrategyContract(bountyId);
    const strategyInfo = await bountyStrategy.getBountyStrategyInfo();
    const hunterAddress = strategyInfo[4];

    if (hunterAddress !== ethers.ZeroAddress){
      const milestone = await bountyStrategy.submitMilestone(0, pullRequestPath, { gasLimit: 3000000});
      await milestone.wait();
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