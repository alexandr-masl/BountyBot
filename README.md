# Bounty bot 
powered by github-probot 

> A GitHub App built with [Probot](https://github.com/probot/probot) that A Probot app

This is a GitHub bot, designed to manage participant actions and interact with the [On-Chain strategy](https://github.com/alexandr-masl/evm_bounty). 
The bot monitors GitHub repository issues, listening for specific commands and executing them to handle bounty registration, funding, assigning bounty hunters, and distributing rewards once a pull request (PR) is merged and marked as complete.

## Process Overview:

- **Issue Creation:** Any user can create a new issue in the GitHub repository. 

- **Bounty Registration** Once created, the repository Admin can register this issue as an on-chain bounty by commenting `/register` in the issue, along with the reward amount and token.

- **Funding the Bounty:** After registration, any user can fund the bounty by sending the `/fund` command in the issue comments along with their wallet address. The bot then moves funds from the contributor's wallet to its own and subsequently transfers them to the on-chain strategy pool.

- **Hunter Assignment:** Once funded, any interested participant can express their intent to complete the bounty by sending the `/hunt` command. If no other hunter is assigned, the bot assigns this user to the issue and registers their wallet in the on-chain strategy.

- **Task Submission:** When ready to submit their work, the hunter initiates a `pull request`, linking it to the issue it resolves. Once the PR is merged, the bot detects this, identifies the associated on-chain strategy, distributes the funds to the hunter's registered wallet, and updates the issue with a completion notification.

This setup creates an automated, efficient workflow for managing bounties on GitHub, with transparent on-chain funding and reward distribution.


## Commands Overview:

- **`/register`**

- **`/fund`**

- **`/hunt`**


## Events Overview:

- **`pull request`**


## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## License

[ISC](LICENSE) © 2024 green
