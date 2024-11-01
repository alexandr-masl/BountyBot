import { getBountyId } from '../db/dataBase.js'
import { fundBounty } from '../evm_commands/fundBounty.js'

export const fundCommand = async (context, payload) => {
    try {
        console.log("------- Executing /fund command...");
        console.log(payload)

        const issueTitle = context.payload.issue.title;
        const issueUrl = context.payload.issue.html_url;
        console.log("Issue Title:", issueTitle);
        console.log("Issue URL:", issueUrl);

        const bountyId = await getBountyId(issueUrl);

        console.log("::::::::: Bounty ID:", bountyId)

        if (!bountyId){
            const reply = context.issue({body: `🔴 Error: Undefined Bounty ID..`});
            return context.octokit.issues.createComment(reply);
        }

        const fund = await fundBounty(bountyId, payload.wallet);

    }
    catch(err){
        console.error(`Error: huntCommand - ${err}`)
        return {err: err};
    }
}