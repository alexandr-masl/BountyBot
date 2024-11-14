import { getBountyId } from '../db/data-base.js'
import { removeRecipient } from '../evm_commands/remove-recipient.js';

export const manageUnassigned = async (context) => {
    try{
        const assignee = context.payload.assignee.login;
        const issueNumber = context.payload.issue.number;
        console.log(`Issue #${issueNumber} unassigned from ${assignee}`);

        const issueUrl = context.payload.issue.html_url;
        const bountyId = await getBountyId(issueUrl);

        if (bountyId){       
            const removedRecipient = await removeRecipient(bountyId);

            const reply = context.issue({body: `🟡 Hunter: ${removedRecipient} has been removed from the Bounty`});
            return context.octokit.issues.createComment(reply);
        }
    }
    catch(error){
        console.error(`Error: manageComment ${error}`)
        return {error: error};
    }
}