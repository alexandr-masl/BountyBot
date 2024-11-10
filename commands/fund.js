import { getBountyId } from '../db/data-base.js'
import { fundBounty } from '../evm_commands/fund-bounty.js'
import { offerMilestones} from '../evm_commands/offer-milestones.js';

export const fundCommand = async (context, payload) => {
    try {
        const issueUrl = context.payload.issue.html_url;
        const bountyId = await getBountyId(issueUrl);
        console.log("::::::::: Bounty ID:", bountyId)

        if (!bountyId){
            const reply = context.issue({body: `🔴 Error: Undefined Bounty ID..`});
            return context.octokit.issues.createComment(reply);
        }

        const fund = await fundBounty(bountyId, payload.wallet);

        if (fund.error){
            const reply = context.issue({body: `🔴 fundBounty call error`});
            return context.octokit.issues.createComment(reply);
        }
        else {
            const strategyAddress = fund[7];
            const reply = context.issue(
                {body: `🟢 <b>Bounty has been funded</b>\n\n<b>Bounty Strategy:</b> ${strategyAddress}`}
            );
            await context.octokit.issues.createComment(reply);
        }

        const milestones = await offerMilestones(bountyId);

        if (milestones.error){
            const reply = context.issue({body: `🔴 offerMilestones call error`});
            return context.octokit.issues.createComment(reply);
        }
        else {
            const reply = context.issue(
                {body: `🟢 <b>Milestone has been added, Hash: ${milestones.hash}</b>`}
            );
            await context.octokit.issues.createComment(reply);
        }
    }
    catch(err){
        console.error(`Error: huntCommand - ${err}`)
        return {err: err};
    }
}