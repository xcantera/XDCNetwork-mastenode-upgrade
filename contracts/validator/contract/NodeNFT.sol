// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title NodeNFT – tokenised ownership of an XDC Masternode
/// @notice Minted once per validator candidate; transferable only via XDCValidator.
contract NodeNFT is ERC721, AccessControl {
    bytes32 public constant VALIDATOR_CONTRACT_ROLE = keccak256("VALIDATOR_CONTRACT_ROLE");

    // tokenId (uint) => candidate address
    mapping(uint256 => address) public nodeAddress;
    // candidate address => tokenId
    mapping(address => uint256) public nodeTokenId;

    constructor(address admin) ERC721("XDC Masternode", "NODEX") {
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
    }

    modifier onlyValidator() {
        require(hasRole(VALIDATOR_CONTRACT_ROLE, msg.sender), "NodeNFT: caller not validator");
        _;
    }

    /// @dev Called by XDCValidator when a new node is proposed
    function mint(address to, address candidate) external onlyValidator returns (uint256 tokenId) {
        require(nodeTokenId[candidate] == 0, "NodeNFT: already minted");
        tokenId = uint256(uint160(candidate)); // deterministic
        _safeMint(to, tokenId);
        nodeAddress[tokenId] = candidate;
        nodeTokenId[candidate] = tokenId;
    }

    /// @dev Burn on resignation / slashing
    function burn(uint256 tokenId) external onlyValidator {
        _burn(tokenId);
        address candidate = nodeAddress[tokenId];
        delete nodeTokenId[candidate];
        delete nodeAddress[tokenId];
    }

    /// @dev Restrict transfers to the validator contract flow
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256
    ) internal override {
        if (from != address(0) && to != address(0)) {
            require(hasRole(VALIDATOR_CONTRACT_ROLE, msg.sender), "NodeNFT: transfer restricted");
        }
        super._beforeTokenTransfer(from, to, tokenId, 0);
    }
}
