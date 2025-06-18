# Contracts API – Detailed Reference

> Solidity 0.8.24 – compiled with `optimizer runs=50, evmVersion=istanbul`.

## KYCToken

| Sig | Description |
|-----|-------------|
| `mint(address user,string uri)` <br> `onlyRole(KYC_VERIFIER_ROLE)` | Issues soul‑bound NFT. |
| `burn(address user)` `onlyAdmin` | Revokes verification. |
| `isVerified(address)` `view returns(bool)` | True if token exists. |
| **Events**: `Transfer` (ERC‑721), `URI` |

*Transfer disabled* – `_beforeTokenTransfer` reverts on non‑mint/burn.

---

## NodeNFT

| Sig | Description |
|-----|-------------|
| `mint(address to,address candidate)` `onlyValidator` | Creates deterministic tokenId (`uint160(candidate)`). |
| `burn(uint256)` `onlyValidator` | Removes token + mappings. |
| `VALIDATOR_CONTRACT_ROLE()` | Role constant. |
| **Events**: `Transfer` (ERC‑721) |

Transfers allowed *only* if `msg.sender` holds `VALIDATOR_CONTRACT_ROLE`
(= `XDCValidator`).

---

## RewardVault

| Sig | Description |
|-----|-------------|
| `allocateReward(address,uint256)` `payable onlyConsensus` | Credit pending. |
| `claimRewards()` | Pull funds. |
| `pending(address) → uint256` | Getter for unpaid balance. |
| **Events**: `RewardAllocated`, `RewardPaid`, `Receive` |

---

## XDCValidator (excerpt)

| Sig | Access | Note |
|-----|--------|------|
| `propose(address)` | `payable onlyKYC` | ≥ 10 M XDC stake, mints NodeNFT. |
| `transferOwnership(address,address)` | `onlyKYC` | Atomically transfers NodeNFT. |
| `resign(address)` | Node owner | Burns NFT, disables node. |
| `allocateEpochReward(address,uint256)` | `onlyOwner` | Called by consensus module. |

Full source in [`contracts/validator/contract/XDCValidator.sol`](../contracts/validator/contract/XDCValidator.sol).
