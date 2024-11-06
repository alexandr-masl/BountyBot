import { ethers } from 'ethers';
import { MANAGER_ADDRESS, DEV_PROVIDER_PATH, DEV_PRIVATE_KEY } from './config/config.js';
import { MANAGER_ABI } from './config/managerAbi.js';
import { STRATEGY_ABI } from './config/strategyAbi.js';

const provider = new ethers.JsonRpcProvider(DEV_PROVIDER_PATH);
const managerWallet = new ethers.Wallet(DEV_PRIVATE_KEY, provider);

export async function removeRecipient(bountyId) {
  try{  
    const managerContract = new ethers.Contract(MANAGER_ADDRESS, MANAGER_ABI, managerWallet);
    const bountyInfo = await managerContract.getBountyInfo(bountyId);

    console.log(":::::::: removeRecipient");
    console.log(":::::::: Bounty Info");
    console.log(bountyInfo);

    const bountyStrategy = new ethers.Contract(bountyInfo[7], STRATEGY_ABI, managerWallet);
    const strategyInfo = await bountyStrategy.getBountyStrategyInfo();

    console.log(":::::::: Strategy Info");
    console.log(strategyInfo);

    const recipientAddress = strategyInfo[4];

    const removeRecipient = await bountyStrategy.reviewRecipient(recipientAddress, 3, { gasLimit: 3000000});

    const removeRecipientTxResult = await removeRecipient.wait();
    console.log("---- Remove Recipient Tx Result");
    console.log(removeRecipientTxResult);

    const updatedStrategyInfo = await bountyStrategy.getBountyStrategyInfo();

    console.log(":::::::: Updated Strategy Info");
    console.log(updatedStrategyInfo);
  }
  catch(error){
    console.log("error !!! submitMilestones")
    console.log(error)
    return {error: error};
  }
}