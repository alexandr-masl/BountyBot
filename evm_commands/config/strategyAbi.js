export const STRATEGY_ABI = [
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "amountPercentage",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "metadata",
                        "type": "string"
                    },
                    {
                        "internalType": "uint8",
                        "name": "milestoneStatus",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    }
                ],
                "internalType": "struct Milestone[]",
                "name": "_milestones",
                "type": "tuple[]"
            }
        ],
        "name": "offerMilestones",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_recipient",
                "type": "address"
            },
            {
                "internalType": "enum Status",
                "name": "_status",
                "type": "uint8" // Enum types are typically represented as uint8 in the ABI
            }
        ],
        "name": "reviewRecipient",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_milestoneId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_metadata",
                "type": "string"
            }
        ],
        "name": "submitMilestone",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getBountyStrategyInfo",
        "outputs": [
            {
                "internalType": "enum StrategyState",
                "name": "_state",
                "type": "uint8"
            },
            {
                "internalType": "uint32",
                "name": "_maxRecipientsAmount",
                "type": "uint32"
            },
            {
                "internalType": "uint256",
                "name": "_totalSupply",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_thresholdPercentage",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_hunter",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }    
];