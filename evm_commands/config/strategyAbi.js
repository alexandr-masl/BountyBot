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
    }
];

