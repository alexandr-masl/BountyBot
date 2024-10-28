import { isAdminUser } from '../helpers/adminManager.js';

export const registerCommand = async (context, payload) => {
    try {

        console.log("------- Executing /register command...");
        console.log(payload)

        const isAdmin = await isAdminUser(context);

        console.log("------- isAdmin:", isAdmin);

        if (!isAdmin){
            const reply = context.issue({body: "Error: UnAuthorized"});
            return context.octokit.issues.createComment(reply);
        }


        // TODO: register Bounty
    }
    catch(err){
        console.log(`Error: huntCommand - ${err}`)
        return {err: err};
    }
}