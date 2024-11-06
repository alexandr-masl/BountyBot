import { ethers } from 'ethers';
import { MANAGER_ADDRESS, DEV_PROVIDER_PATH, DEV_PRIVATE_KEY } from './config/config.js';
import { MANAGER_ABI } from './config/managerAbi.js';
import { STRATEGY_ABI } from './config/strategyAbi.js';

const provider = new ethers.JsonRpcProvider(DEV_PROVIDER_PATH);
const managerWallet = new ethers.Wallet(DEV_PRIVATE_KEY, provider);

export async function addRecipient(bountyId, recipientWallet) {
    try{  
      const managerContract = new ethers.Contract(MANAGER_ADDRESS, MANAGER_ABI, managerWallet);
      const bountyInfo = await managerContract.getBountyInfo(bountyId);
  
      console.log(":::::::: offerMilestones");
      console.log(":::::::: Bounty Info");
      console.log(bountyInfo);
  
      const bountyStrategy = new ethers.Contract(bountyInfo[7], STRATEGY_ABI, managerWallet);

      const addRecipient = await bountyStrategy.reviewRecipient(recipientWallet, 2, { gasLimit: 3000000});

      const addRecipientTxResult = await addRecipient.wait();
      console.log("---- Add Recipient Tx Result");
      console.log(addRecipientTxResult);

      const strategyInfo = await bountyStrategy.getBountyStrategyInfo();

      console.log(":::::::: Strategy Info");
      console.log(strategyInfo);
    }
    catch(error){
      console.log("error !!! submitMilestones")
      console.log(error)
      return {error: error};
    }
  }