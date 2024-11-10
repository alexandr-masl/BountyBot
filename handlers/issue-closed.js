import { getBountyId } from '../db/data-base.js'
import { getBountyById } from '../evm_commands/get-bounty-by-id.js';

export const manageIssueClosed = async (context) => {
    try{
        const issueUrl = context.payload.issue.html_url;
        const bountyId = await getBountyId(issueUrl);

        if (bountyId){     
            
            const bountyData = await getBountyById(bountyId);

            if (bountyData.strategyState){

                const reply = context.issue({
                    body: `<b>🟡The issue has active bounty with ID: ${bountyId}</b> 
                    \nIf you are the bounty donor, you can get your funds back by calling the following function signature using your wallet:

                    \`\`\`
                        function rejectStrategy() external
                    \`\`\`

                    \nYou can call this function on the Strategy contract deployed at the address: 
                    \n<b>${bountyData.strategyAddress}</b>`
                });
                context.octokit.issues.createComment(reply);
            }
        }
    }
    catch(error){
        console.error(`Error: manageIssueClosed ${error}`)
        return {error: error};
    }
}