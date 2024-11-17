import { ethers } from 'ethers';

/**
 * @function isValidAddress
 * @description Checks if a given string is a valid Ethereum address.
 * 
 * @param {string} address - The string to be validated as an Ethereum address.
 * @returns {boolean} Returns `true` if the input is a valid Ethereum address, otherwise `false`.
 * 
 * Behavior:
 * - Uses the `ethers.isAddress` utility to validate the format of the address.
 * - Returns `true` for valid Ethereum addresses and `false` for invalid ones.
 * 
 * Example Usage:
 * ```javascript
 * const valid = isValidAddress("0x742d35Cc6634C0532925a3b844Bc454e4438f44e");
 * console.log(valid); // Output: true
 * 
 * const invalid = isValidAddress("not-an-address");
 * console.log(invalid); // Output: false
 * ```
 * 
 * Error Handling:
 * - Relies on `ethers.isAddress`, which safely validates the input and returns a boolean without throwing exceptions.
 */
export const isValidAddress = (address) => {
    return ethers.isAddress(address);
};
