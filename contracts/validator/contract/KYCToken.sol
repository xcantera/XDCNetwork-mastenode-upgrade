// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title KYCToken – soul‑bound proof of KYC completion
/// @notice Non‑transferable ERC‑721 issued by a KYC verifier.
contract KYCToken is ERC721URIStorage, AccessControl {
    bytes32 public constant KYC_VERIFIER_ROLE = keccak256("KYC_VERIFIER_ROLE");

    constructor(address admin) ERC721("XDC KYC Token", "KYCNFT") {
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
    }

    /// @notice Returns true if `user` holds a valid KYC token.
    function isVerified(address user) external view returns (bool) {
        return _exists(uint256(uint160(user)));
    }

    /// @dev Mint soul‑bound KYC NFT
    function mint(address user, string calldata uri) external onlyRole(KYC_VERIFIER_ROLE) {
        uint256 tokenId = uint256(uint160(user));
        require(!_exists(tokenId), "KYCToken: already verified");
        _safeMint(user, tokenId);
        _setTokenURI(tokenId, uri);
    }

    /// @dev Burn (revoke) a user’s KYC token
    function burn(address user) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _burn(uint256(uint160(user)));
    }

    /// @dev Disable transfers – token is soul‑bound
    function _beforeTokenTransfer(address from, address to, uint256, uint256) internal view override {
        require(from == address(0) || to == address(0), "KYCToken: non‑transferable");
    }
}
