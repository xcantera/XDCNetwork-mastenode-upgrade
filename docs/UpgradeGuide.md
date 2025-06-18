# Operator Upgrade Guide (Mainnet)

**Fork height:** 12 345 678  
**Deadline:** *2025‑08‑15 UTC*

## 1 Upgrade your node

```bash
docker pull xinfinorg/xdc:v2.3.0
docker stop xdc-node && docker rm xdc-node
docker run -d --name xdc-node -v $HOME/.xdc:/xdc xinfinorg/xdc:v2.3.0   --datadir=/xdc --networkid=50 --port=30303
```

## 2 Complete/verify KYC

1. Login to <https://kyc.xinfin.org>.  
2. Upload documents.  
3. After approval, check your wallet – the **KYCToken** NFT (token ID = your
   address) should be visible.

## 3 Post‑fork tasks

* **Claim rewards** – after every epoch (≈ 24 h) run:

  ```bash
  xdc attach
  tx.send({to:"0x000...091", data:"0x3d18b912"})  # RewardVault.claimRewards()
  ```

  or use the `@xdc/rewards-cli` script.

* **Selling a node?**  
  Call `XDCValidator.transferOwnership(candidate, buyer)` in your wallet dApp
  (both parties must hold KYCToken).

* **If you miss the fork** – your node will keep running but *cannot* propose
  blocks until you upgrade and hold the KYCToken.
