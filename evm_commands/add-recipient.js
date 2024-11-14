import { getStrategyContract } from './get-contracts.js';

export async function addRecipient(bountyId, recipientWallet) {
    try{  
      const bountyStrategy = await getStrategyContract(bountyId);
      const addRecipient = await bountyStrategy.reviewRecipient(recipientWallet, 2, { gasLimit: 3000000});
      await addRecipient.wait();
      const strategyInfo = await bountyStrategy.getBountyStrategyInfo();

      return strategyInfo;
    }
    catch(error){
      console.log("error !!! addRecipient")
      console.log(error)
      return {error: error};
    }
  }