import { getManagerContract, getStrategyContract } from './get-contracts.js';

export async function addRecipient(bountyId, recipientWallet) {
    try{  
      const managerContract = await getManagerContract();
      const bountyInfo = await managerContract.getBountyInfo(bountyId);
  
      console.log(":::::::: addRecipient");
      console.log(":::::::: Bounty Info");
      console.log(bountyInfo);
  
      const bountyStrategy = await getStrategyContract(bountyId);

      const addRecipient = await bountyStrategy.reviewRecipient(recipientWallet, 2, { gasLimit: 3000000});

      const addRecipientTxResult = await addRecipient.wait();
      console.log("---- Add Recipient Tx Result");
      console.log(addRecipientTxResult);

      const strategyInfo = await bountyStrategy.getBountyStrategyInfo();

      console.log(":::::::: Strategy Info");
      console.log(strategyInfo);

      return strategyInfo;
    }
    catch(error){
      console.log("error !!! addRecipient")
      console.log(error)
      return {error: error};
    }
  }