import { isAdminUser } from '../handlers/admin-check.js';
import { registerBounty } from '../evm_commands/register-bounty.js';
import { getBountyId, setBountyId } from '../db/data-base.js'
import { ethers } from 'ethers';
import { getManagerAddress } from '../evm_commands/get-bounty-bot-address.js'

export const registerCommand = async (context, payload) => {
    try {

        const isAdmin = await isAdminUser(context);
        // console.log("------- isAdmin:", isAdmin);

        if (!isAdmin){
            const reply = context.issue({body: "Error: UnAuthorized"});
            return context.octokit.issues.createComment(reply);
        }

        const issueTitle = context.payload.issue.title;
        const issueUrl = context.payload.issue.html_url;
        const checkBountyId = await getBountyId(issueUrl);

        if (checkBountyId){
            const reply = context.issue({body: `🔴 Error: Already Registered`});
            return context.octokit.issues.createComment(reply);
        }

        const amount = ethers.parseUnits((payload.amount).toString(), 18);
        const bountyId = await registerBounty(payload.token, amount, issueTitle, issueUrl);

        if (bountyId.error){
            const reply = context.issue({body: `🔴 Error: ${bountyId.error}`});
            return context.octokit.issues.createComment(reply);
        }
        else {
            const reply = context.issue({
                body: `🟢 <b>Bounty has been registered</b>\n\n<b>BOUNTY_ID:</b> ${bountyId}\n<b>TOKEN:</b> ${payload.token}\n<b>AMOUNT:</b> ${payload.amount}\n\nTo fund the bounty, approve the specified amount for the bot wallet: ${getManagerAddress()}`
            });

            await setBountyId(issueUrl, bountyId);
            return context.octokit.issues.createComment(reply);
        }
    }
    catch(err){
        console.error(`Error: registerCommand - ${err}`)
        return {err: err};
    }
}