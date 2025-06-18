# Consensus‑Layer Modifications (Go Implementation)

> All changes apply to the **XDPoSChain** repo – commit hash `xinfinorg/XDPoSChain@v2.3.0`.

## 1 System‑contract deployment

| Address (hex) | Contract | Insertion point |
|---------------|----------|-----------------|
| `0x0000000000000000000000000000000000000089` | NodeNFT | `core/vm/contracts.go`  |
| `0x0000000000000000000000000000000000000090` | KYCToken | same |
| `0x0000000000000000000000000000000000000091` | RewardVault | same |
| `0x0000000000000000000000000000000000000088` | XDCValidator (upgraded) | overwrite existing |

The byte‑code of the compiled Solidity contracts is inserted into the
`PrecompiledContracts` map. The old validator code is replaced in‑place to
preserve storage.

## 2 Epoch reward bridge

*File touched:* `consensus/xdpos/epoch.go`

```go
func (e *XDPoS) finalizeReward(statedb *state.StateDB, epochData *epochInfo) {
    // existing calcReward() kept
    for _, val := range epochData.Validators {
        owner := getOwnerFromContract(val.Address) // Calls NodeNFT.ownerOf()
        reward := calcReward(val)
        // call RewardVault.allocateReward(owner, reward)
        data := vaultABI.Methods["allocateReward"].ID
        data = append(data, common.LeftPadBytes(owner.Bytes(), 32)...)
        data = append(data, common.LeftPadBytes(new(big.Int).SetUint64(reward).Bytes(), 32)...)
        statedb.AddBalance(rewardVaultAddr, big.NewInt(int64(reward)))
        statedb.CreateContractAccount(rewardVaultAddr)
        vm.CallMessage{ To:&rewardVaultAddr, Data:data /* ...gas etc */ }
    }
}
```

The above pseudo‑diff shows how the engine now *credits* the vault instead of
directly adding to the owner’s balance.

## 3 Chain‑config flag

A new **fork flag** protects backward compatibility:

```json
"masternodeNFTBlock": 12345678
```

At block < fork, legacy logic runs. At ≥ fork, the engine:

1. Uses `NodeNFT.ownerOf()` for `getOwner`.
2. Executes the reward‑vault path.

## 4 RPC Extensions (optional)

* `txpool_getNodeNFT(tokenId)` ➜ returns candidate address & metadata.
* `admin_getPendingRewards(address)` ➜ proxy to RewardVault.pending().

These help explorers and operator dashboards.
