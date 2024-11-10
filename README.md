# Bounty bot 

> A GitHub App built with [Probot](https://github.com/probot/probot)

The bot monitors GitHub repository issues, listening for specific commands and executing them to handle bounty registration, funding, assigning bounty hunters, and distributing rewards once a pull request (PR) is merged and marked as complete.

This bot is designed to utilize an on-chain pool funding and distribution strategy, implemented through a set of smart contracts. Since this bot is only one approach to using the on-chain strategy, we recommend exploring [the Strategy repository](https://github.com/alexandr-masl/evm_bounty) to gain a deeper understanding of the bot's actions and the overall project concept. 

## Process Overview:

- **Issue Creation:** Any user can create a new issue in the GitHub repository. 

- **Bounty Registration** Once created, the repository Admin can register this issue as an on-chain bounty by commenting `/register` in the issue, along with the reward amount and token.

- **Funding the Bounty:** After registration, any user can fund the bounty by sending the `/fund` command in the issue comments along with their wallet address. The bot then moves funds from the contributor's wallet to its own and subsequently transfers them to the on-chain strategy pool.

- **Hunter Assignment:** Once funded, any interested participant can express their intent to complete the bounty by sending the `/hunt` command. If no other hunter is assigned, the bot assigns this user to the issue and registers their wallet in the on-chain strategy.

- **Task Submission:** When ready to submit their work, the hunter initiates a `pull request`, linking it to the issue it resolves. Once the PR is merged, the bot detects this, identifies the associated on-chain strategy, distributes the funds to the hunter's registered wallet, and updates the issue with a completion notification.

This setup creates an automated, efficient workflow for managing bounties on GitHub, with transparent on-chain funding and reward distribution.


## Commands Overview:

- **`/register`**
    The repository admin can register an issue as an on-chain bounty by commenting the `/register` command in the issue. 
    The command format is: `/register TOKEN_ADDRESS AMOUNT` 
    For example: `/register 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9 10` 
    The bot listens for this command and executes it on-chain, creating a project that is then open for funding.

- **`/fund`** 
    Anyone can fund the bounty by posting the `/fund` command in the issue comments, along with the wallet address from which the funds will be transferred. Before sending the command, the user must authorize the bot wallet to spend the specified funds. 
    The command format is: `/fund WALLET_ADDRESS`
    For example: `/fund 0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
    The bot will then attempt to transfer the previously defined amount from the specified wallet to its own and subsequently fund the bounty with this amount.

- **`/hunt`**
    Once the bounty is funded, any user can express interest in fulfilling it by posting the `/hunt` command in the issue comments, along with their wallet address. 
    The command format is: `/hunt WALLET_ADDRESS`
    For example: `/hunt 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
    The bot will assign this user to the issue and register their wallet as a recipient in the on-chain strategy. If the user is later unassigned, the bot will also remove their wallet from the funds distribution strategy.


## Events Overview:

- **`pull request`**
    When ready to submit their work, the hunter opens a pull request (PR) and links it to the relevant issue in the PR body. The repository admin reviews and, if approved, merges the PR. 
    The bot then detects the merged PR, identifies the associated on-chain strategy, and distributes the bounty to the recipient's wallet.


## Setup

- Follow the instructions to launch a [GitHub app](https://docs.github.com/en/apps/creating-github-apps/writing-code-for-a-github-app/quickstart)

- Deploy the [Bounty Bot on-chain repository](https://github.com/alexandr-masl/evm_bounty) or retrieve the already deployed address of the [Manager contract](https://github.com/alexandr-masl/evm_bounty/blob/main/src/Manager.sol)

- Configure the variables in the `.env` file, such as the network RPC_URL and BOT_WALLET

- Configure the config.js file and set the MANAGER_ADDRESS

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## License

[ISC](LICENSE) © 2024 green
