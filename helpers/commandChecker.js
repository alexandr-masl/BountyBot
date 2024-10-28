
const extractWords = (content) => { return content.trim().split(" ")};

export const checkCommand = (content) => {
    if (content.toString().includes("/hunt")){
        const commandData = extractWords(content);
        return {isCommand: true, command: commandData[0], wallet: commandData[1]};
    }
    if (content.toString().includes("/register")){
        const commandData = extractWords(content);
        return {isCommand: true, command: commandData[0], token: commandData[1], amount: commandData[2]};
    }
    else return {};
}