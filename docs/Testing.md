# Test Matrix

| ID | Scenario | Type | Expected |
|----|----------|------|----------|
| T‑1 | Propose without KYCToken | Unit | Revert `KYC required`. |
| T‑2 | Transfer node to non‑KYC address | Unit | Revert. |
| T‑3 | Claim rewards 0 balance | Unit | Revert `nothing to claim`. |
| T‑4 | Epoch reward allocation 108 validators | Integration | Gas < 15 M; all `RewardAllocated` events emitted. |
| T‑5 | NFT transfer mid‑epoch | Integration | Next epoch reward goes to new owner. |
| T‑6 | KYCToken burn (revocation) | Integration | Subsequent validator calls revert. |
| T‑7 | Fork replay on old client | Consensus | Old client rejects post‑fork blocks – ensures split. |
| T‑8 | Fork replay on new client | Consensus | Chain progresses, state root consistent across 3 nodes. |

## Hardhat / Foundry unit test sample

```js
it("propose → mint NodeNFT", async () => {
  await kyc.mint(user.address, "ipfs://meta");
  await validator.connect(user).propose(user2.address, {value: STAKE});
  expect(await nodeNFT.ownerOf(tokenId)).to.equal(user.address);
});
```

Complete tests located in `tests/` directory.
