export const MANAGER_ABI = [
    "function registerProject(address _token, uint256 _needs, string _name, string _metadata) external returns (bytes32)",
    "function getPoolToken(bytes32 _bountyId) external view returns (address token)",
    "event ProjectRegistered(bytes32 profileId, uint256 nonce)"
]