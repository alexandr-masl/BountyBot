import { getManagerContract, getStrategyContract } from './get-contracts.js';

export async function removeRecipient(bountyId) {
  try{  
    const managerContract = await getManagerContract();
    const bountyInfo = await managerContract.getBountyInfo(bountyId);

    console.log(":::::::: removeRecipient");
    console.log(":::::::: Bounty Info");
    console.log(bountyInfo);

    const bountyStrategy = await getStrategyContract(bountyId);
    const strategyInfo = await bountyStrategy.getBountyStrategyInfo();

    console.log(":::::::: Strategy Info");
    console.log(strategyInfo);

    const recipientAddress = strategyInfo[4];

    const removeRecipient = await bountyStrategy.reviewRecipient(recipientAddress, 3, { gasLimit: 3000000});

    const removeRecipientTxResult = await removeRecipient.wait();
    console.log("---- Remove Recipient Tx Result");
    console.log(removeRecipientTxResult);
  }
  catch(error){
    console.log("error !!! removeRecipient")
    console.log(error)
    return {error: error};
  }
}