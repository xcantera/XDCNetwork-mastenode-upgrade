// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./NodeNFT.sol";
import "./KYCToken.sol";
import "./RewardVault.sol";

/// @title XDCValidator (upgrade skeleton)
/// @notice Simplified validator contract showing new ownership/KYC/reward hooks.
/// @dev This is a partial implementation – original stake & vote logic trimmed for brevity.
contract XDCValidator is Ownable {
    using SafeMath for uint256;

    KYCToken   public immutable kyc;
    NodeNFT    public immutable nodeNFT;
    RewardVault public immutable rewardVault;

    uint256 public constant MIN_CANDIDATE_CAP = 10_000_000 ether; // 10M XDC

    struct Validator {
        address owner;
        uint256 stake;
        bool    isActive;
    }

    mapping(address => Validator) public validators;  // candidate => state
    address[] public candidates;                      // active candidate list

    event Propose(address indexed owner, address indexed candidate, uint256 stake);
    event OwnershipTransferred(address indexed candidate, address indexed oldOwner, address indexed newOwner);
    event Resigned(address indexed candidate);

    constructor(address _kyc, address _nodeNFT, address _rewardVault) {
        kyc        = KYCToken(_kyc);
        nodeNFT    = NodeNFT(_nodeNFT);
        rewardVault = RewardVault(_rewardVault);
        // Grant validator role to this contract so it can mint / transfer NodeNFTs unrestricted
        nodeNFT.grantRole(nodeNFT.VALIDATOR_CONTRACT_ROLE(), address(this));
    }

    modifier onlyKYC() {
        require(kyc.isVerified(msg.sender), "XDCValidator: KYC required");
        _;
    }

    /// -----------------------------------------------------------------------
    /// Node life‑cycle
    /// -----------------------------------------------------------------------

    /// @notice Register a new masternode candidate
    /// @dev Stake ≥ 10 M XDC must be sent with the tx.
    function propose(address candidate) external payable onlyKYC {
        require(msg.value >= MIN_CANDIDATE_CAP, "XDCValidator: stake too low");
        require(validators[candidate].owner == address(0), "XDCValidator: already candidate");

        validators[candidate] = Validator({
            owner: msg.sender,
            stake: msg.value,
            isActive: true
        });
        candidates.push(candidate);

        // Mint NFT representing this node
        nodeNFT.mint(msg.sender, candidate);

        emit Propose(msg.sender, candidate, msg.value);
    }

    /// @notice Transfer node ownership to another KYC‑verified address
    function transferOwnership(address candidate, address newOwner) external onlyKYC {
        Validator storage v = validators[candidate];
        require(v.owner == msg.sender, "XDCValidator: not owner");
        require(kyc.isVerified(newOwner), "XDCValidator: new owner lacks KYC");

        uint256 tokenId = nodeNFT.nodeTokenId(candidate);
        nodeNFT.safeTransferFrom(msg.sender, newOwner, tokenId);

        v.owner = newOwner;

        emit OwnershipTransferred(candidate, msg.sender, newOwner);
    }

    /// @notice Voluntarily resign a masternode
    function resign(address candidate) external {
        Validator storage v = validators[candidate];
        require(v.owner == msg.sender, "XDCValidator: not owner");
        v.isActive = false;

        uint256 tokenId = nodeNFT.nodeTokenId(candidate);
        nodeNFT.burn(tokenId);

        // NB: stake withdrawal delay & reward finalisation omitted for brevity
        emit Resigned(candidate);
    }

    /// -----------------------------------------------------------------------
    /// Reward hook (to be called by consensus engine)
    /// -----------------------------------------------------------------------

    function allocateEpochReward(address owner, uint256 amount) external payable onlyOwner {
        // In production this would be restricted to consensus address / system call
        rewardVault.allocateReward{value: amount}(owner, amount);
    }

    // -----------------------------------------------------------------------
    // Placeholder for vote, unvote, withdraw, slash, etc.
    // -----------------------------------------------------------------------
}
