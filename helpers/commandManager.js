import { huntCommand } from '../commands/hunt.js';
import { registerCommand } from '../commands/register.js'

export const manageCommand = async (context, command) => {
    switch (command.command) {
        case '/hunt':
            huntCommand(context, command);
            break;
        case '/register':
            registerCommand(context, command);
            break;
        default:
            console.log("Unknown command:", command.command);
            break;
    }
}