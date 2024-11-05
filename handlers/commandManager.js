import { huntCommand } from '../commands/hunt.js';
import { registerCommand } from '../commands/register.js'
import { fundCommand } from '../commands/fund.js'

export const manageCommand = async (context, command) => {
    switch (command.command) {
        case '/hunt':
            huntCommand(context, command);
            break;
        case '/register':
            registerCommand(context, command);
            break;
        case '/fund':
            fundCommand(context, command);
            break;
        default:
            console.log("Unknown command:", command.command);
            break;
    }
}