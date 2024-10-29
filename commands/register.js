import { isAdminUser } from '../helpers/adminManager.js';
import { registerBounty } from '../evm_commands/registerBounty.js';

export const registerCommand = async (context, payload) => {
    try {
        // console.log("------- Executing /register command...");
        // console.log(payload)

        const isAdmin = await isAdminUser(context);
        // console.log("------- isAdmin:", isAdmin);

        if (!isAdmin){
            const reply = context.issue({body: "Error: UnAuthorized"});
            return context.octokit.issues.createComment(reply);
        }

        const issueTitle = context.payload.issue.title;
        const issueUrl = context.payload.issue.html_url;
        // console.log("Issue Title:", issueTitle);
        // console.log("Issue URL:", issueUrl);

        const bountyId = await registerBounty(payload.token, payload.amount, issueTitle, issueUrl);
        // console.log(":::::: Bounty ID:", bountyId);

        if (bountyId.error){
            const reply = context.issue({body: `🔴 Error: ${bountyId.error}`});
            return context.octokit.issues.createComment(reply);
        }
        else {
            const reply = context.issue({
                body: `🟢 <b>Bounty has been registered</b>\n\n<b>ID:</b> ${bountyId}\n<b>TOKEN:</b> ${payload.token}\n<b>AMOUNT:</b> ${payload.amount}`
            });

            return context.octokit.issues.createComment(reply);
        }
    }
    catch(err){
        console.error(`Error: huntCommand - ${err}`)
        return {err: err};
    }
}