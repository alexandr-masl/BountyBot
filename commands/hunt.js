import {assignHunter} from "../handlers/hunterManager.js"
import {isValidAddress} from "../handlers/walletChecker.js"
import {getBountyId} from '../db/dataBase.js'
import { addRecipient } from "../evm_commands/addRecipient.js"

export const huntCommand = async (context, payload) => {
    try {

        console.log("------- Executing /hunt command...");
        console.log(payload)

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

        console.log("::::::::: Bounty ID:", bountyId)

        if (!bountyId){
            const reply = context.issue({body: `🔴 Error: Undefined Bounty ID..`});
            return context.octokit.issues.createComment(reply);
        }

        const addRecipientData = await addRecipient(bountyId, payload.wallet);
    }
    catch(err){
        console.log(`Error: huntCommand - ${err}`)
        return {err: err};
    }
}