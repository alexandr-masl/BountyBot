import {assignHunter} from "../handlers/hunter.js"
import {isValidAddress} from "../handlers/wallet-checker.js"
import {getBountyId} from '../db/data-base.js'
import { addRecipient } from "../evm_commands/add-recipient.js"

export const huntCommand = async (context, payload) => {
    try {
        if (!isValidAddress(payload.wallet)){
            const reply = context.issue({body: "Error: invalid wallet address"});
            return context.octokit.issues.createComment(reply);
        }

        const hunter = await assignHunter(context);

        if (hunter.err){
            const reply = context.issue({body: hunter.err});
            return context.octokit.issues.createComment(reply);
        }

        const issueUrl = context.payload.issue.html_url;
        const bountyId = await getBountyId(issueUrl);

        if (!bountyId){
            const reply = context.issue({body: `🔴 Error: Undefined Bounty ID..`});
            return context.octokit.issues.createComment(reply);
        }

        const addRecipientData = await addRecipient(bountyId, payload.wallet);

        if (addRecipientData.error){
            const reply = context.issue({body: `🔴 addRecipient call error`});
            return context.octokit.issues.createComment(reply);
        }
        else {
            const reply = context.issue(
                {body: `🟢 <b>${payload.wallet} hunter has been added</b>`}
            );
            await context.octokit.issues.createComment(reply);
        }
    }
    catch(err){
        console.log(`Error: huntCommand - ${err}`)
        return {err: err};
    }
}