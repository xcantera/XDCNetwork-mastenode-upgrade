# Migration & Deployment Guide

This plan assumes fork block **12345678** on mainnet; adjust for Apothem.

## 1 Pre‑fork checklist

| Actor | Task |
|-------|------|
| Core Devs | Publish new client binaries (`v2.3.0`) with NFT fork flag. |
| Foundation KYC team | Mint KYCToken to *all* addresses in `owners[]`. |
| DevOps | Snapshot validator list & stakes. |

## 2 Fork‑block actions (within genesis diff)

1. Add byte‑code of `NodeNFT`, `KYCToken`, `RewardVault` to addresses
   `0x...89–0x...91`.
2. Replace code at `0x...88` with new `XDCValidator`.
3. Pre‑fund `RewardVault` with `0` (it will be filled by epoch code).

## 3 Post‑fork initialisation script

Executed by foundation multi‑sig (`OWNER_ROLE` on contracts):

```solidity
for (uint i=0; i<candidates.length; i++){
    address cand = candidates[i];
    nodeNFT.mint(validator.owner(cand), cand);
}
nodeNFT.grantRole(nodeNFT.VALIDATOR_CONTRACT_ROLE(), 0x...88); // safety
```

## 4 Rollback plan

If severe bug detected before block `12345678 + 1000`:

* Governance vote can toggle `masternodeNFTBlock` to `MAX_UINT` to disable new
  paths.
* Redeploy older client binaries temporarily.
