import { checkCommand } from './command-checker.js';
import { manageCommand } from './command.js';

export const manageComment = async (context) => {
    try {

        const commentAuthor = context.payload.comment.user.login;

        if (commentAuthor !== "daodrivenbounty[bot]") {

            const commentContent = context.payload.comment.body;
            const command = checkCommand(commentContent);

            if (command.isCommand){
                await manageCommand(context, command);
            }
        }
    }
    catch(err){
        console.log(`Error: manageComment ${err}`)
        return {err: err};
    }
}