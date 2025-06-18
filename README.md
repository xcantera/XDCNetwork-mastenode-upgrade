# XDC Masternode Upgrade – Reference Repository

This repository accompanies the **XDPoSChain hard‑fork** introducing:

* **NodeNFT** – tokenised masternodes (ERC‑721).
* **KYCToken** – on‑chain proof of identity.
* **RewardVault** – fully automated validator rewards.

> **Status:** Draft code & docs for internal review (2025‑06‑18).

## Quick start

```bash
git clone <repo_url>
cd contracts/validator/contract
npm install
npx hardhat test
```

Solidity 0.8.24 – `@openzeppelin/contracts@5`.

## Directory layout

```
contracts/validator/contract  – Solidity sources
docs/                         – Detailed design, migration, tests
```

See `docs/Architecture.md` for a deep dive.
