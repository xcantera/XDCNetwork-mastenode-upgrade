// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title RewardVault – escrow contract for automated validator rewards
/// @notice Consensus layer credits rewards; owners claim them on‑chain.
contract RewardVault is ReentrancyGuard, AccessControl {
    bytes32 public constant CONSENSUS_ROLE = keccak256("CONSENSUS_ROLE");

    mapping(address => uint256) public pending;

    event RewardAllocated(address indexed beneficiary, uint256 amount);
    event RewardPaid(address indexed beneficiary, uint256 amount);

    constructor(address admin) {
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
    }

    /// @notice Accept native XDC deposits
    receive() external payable {}

    /// @dev Called by consensus engine / validator contract each epoch
    function allocateReward(address beneficiary, uint256 amount)
        external
        payable
        onlyRole(CONSENSUS_ROLE)
    {
        require(amount > 0, "RewardVault: zero amount");
        pending[beneficiary] += amount;
        emit RewardAllocated(beneficiary, amount);
    }

    /// @notice Claim accumulated rewards
    function claimRewards() external nonReentrant {
        uint256 amount = pending[msg.sender];
        require(amount > 0, "RewardVault: nothing to claim");
        pending[msg.sender] = 0;
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok, "RewardVault: transfer failed");
        emit RewardPaid(msg.sender, amount);
    }
}
