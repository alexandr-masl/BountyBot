import { getStrategyContract } from './get-contracts.js';

export async function removeRecipient(bountyId) {
  try{  
    const bountyStrategy = await getStrategyContract(bountyId);
    const strategyInfo = await bountyStrategy.getBountyStrategyInfo();
    const recipientAddress = strategyInfo[4];
    const removeRecipient = await bountyStrategy.reviewRecipient(recipientAddress, 3, { gasLimit: 3000000});
    await removeRecipient.wait();

    return strategyInfo[4];
  }
  catch(error){
    console.log("error !!! removeRecipient")
    console.log(error)
    return {error: error};
  }
}