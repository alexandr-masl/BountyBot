export const MANAGER_ABI = [
    "function registerProject(address _token, uint256 _needs, string _name, string _metadata) external returns (bytes32)",
    "function supplyProject(bytes32 _projectId, uint256 _amount, address _donor) external payable",
    "function getBountyInfo(bytes32 _bountyId) external view returns (address token, address executor, address[] memory _managers, address[] memory _donors, uint256 need, uint256 has, uint256 poolId, address strategy, string metadata, string name)",
    "event ProjectRegistered(bytes32 profileId, uint256 nonce)"
];
