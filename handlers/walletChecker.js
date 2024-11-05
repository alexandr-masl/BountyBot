import { ethers } from 'ethers';

export const isValidAddress = (address) => {
    return ethers.isAddress(address);
};
