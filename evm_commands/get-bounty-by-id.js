import { ethers } from 'ethers';
import { TAIKO_PROVIDER_PATH, DEV_PROVIDER_PATH, DEV_BOT_PRIVATE_KEY } from './config/config.js';
import { getManagerContract } from './get-contracts.js';
import { STRATEGY_ABI } from './config/strategy-abi.js';
import dotenv from 'dotenv';
dotenv.config();

const provider = new ethers.JsonRpcProvider(DEV_PROVIDER_PATH);
const managerWallet = new ethers.Wallet(DEV_BOT_PRIVATE_KEY, provider);

export async function getBountyById(bountyId) {
    try {

        const bountyData = {
            bountyHasTokens: null,
            strategyAddress: null,
            donors: [],
            strategyState: null,
            hunter: null
        }

        const managerContract = await getManagerContract();
        const bountyInfo = await managerContract.getBountyInfo(bountyId);

        console.log(":::::::: getBountyById");
        console.log(":::::::: Bounty Info");
        console.log(bountyInfo);

        if (!bountyInfo.length){
            return {error: "Invalid Bounty Info"};
        }

        bountyData.bountyHasTokens = Number(bountyInfo[5]);
        bountyData.donors = bountyInfo[3];

        const strategyAddress = bountyInfo[7] !== ethers.ZeroAddress ? bountyInfo[7] : null;

        if (strategyAddress){
            bountyData.strategyAddress = strategyAddress;

            const bountyStrategy = new ethers.Contract(strategyAddress, STRATEGY_ABI, managerWallet);
            const strategyInfo = await bountyStrategy.getBountyStrategyInfo();
            console.log(":::::::: Strategy Info");
            console.log(strategyInfo);

            const strategyState = strategyInfo[0];
            const hunterAddress = strategyInfo[4];

            if (strategyState == 1)
                bountyData.strategyState = 1;

            if (hunterAddress !== ethers.ZeroAddress)
                bountyData.hunter = hunterAddress;
        }

        return bountyData;

    } catch (error) {
        console.error("ERROR | getBountyById:", error);
        return {error: error};
    }
}