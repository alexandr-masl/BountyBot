import {assignHunter} from "../helpers/hunterManager.js"
import {isValidAddress} from "../helpers/walletChecker.js"

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

        // TODO: add recipient to the Strategy
    }
    catch(err){
        console.log(`Error: huntCommand - ${err}`)
        return {err: err};
    }
}