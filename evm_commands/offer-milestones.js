import { ethers } from 'ethers';
import { getManagerContract, getStrategyContract } from './get-contracts.js';

export async function offerMilestones(bountyId) {
  try{   
    const managerContract = await getManagerContract();
    const bountyInfo = await managerContract.getBountyInfo(bountyId);
    const bountyStrategy = await getStrategyContract(bountyId);

    const milestonesOBJ = [
        {
          amountPercentage: ethers.parseUnits("1", "ether"), 
          metadata: bountyInfo[8],
          milestoneStatus: 0,
          description: bountyId
        }
    ];

    const offerMilestones = await bountyStrategy.offerMilestones(milestonesOBJ, { gasLimit: 3000000});
    const offerMilestonesTxResult = await offerMilestones.wait();

    return offerMilestonesTxResult;
  }
  catch(error){
    return {error: error};
  }
}