
---

````markdown
#  XDC Masternode Smart-Contract Upgrade

> **Status · June 2025**  
> Feature-complete contracts (`solidity 0.8.24`) and **35 Hardhat tests** covering
> propose / vote / unvote / resign / transfer / slash / rewards / edge cases.  
> Suitable for Apothem test-net and main-net hard-fork rehearsal.

---

##  What’s inside?

| Folder / File | Purpose |
| ------------- | ------- |
| `contracts/validator/contract/` | **Core Solidity**<br>  • `XDCValidator.sol` – system contract (stake ledger)<br>  • `NodeNFT.sol` – ERC-721 tokenises masternodes<br>  • `KYCToken.sol` – soul-bound KYC proof<br>  • `RewardVault.sol` – escrows & pays epoch rewards |
| `test/` | 35 TypeScript specs (Hardhat + Ethers.js + Chai) |
| `docs/` | Architecture, consensus changes, migration & upgrade guides |
| `hardhat.config.ts` | Hardhat compiler + network paths |
| `tsconfig.json` | TypeScript settings (CommonJS) |

---

##  Quick-start (local)

```bash
git clone https://github.com/<org>/xdc-masternode-upgrade.git
cd xdc-masternode-upgrade

# install dev-deps
npm install          # package.json already lists everything

# compile all .sol files
npx hardhat compile

# run the 35-test suite
npx hardhat test
````

You’ll see output similar to:

```
  T1 propose success
  ✓ accepts KYC & stake (160ms)
  ...
  35 passing (9s)

  All green!
```

---

##  Develop in VS Code

1. **Extensions**

   * Solidity (Juan Blanco)
   * Hardhat for VS Code (optional)
   * Prettier & ESLint (optional)

2. **Settings → Solidity**

   ```
   Package Default Dependencies Directory = node_modules
   ```

   to resolve `@openzeppelin/*` imports.

3. Solidity formatter:

   ```
   "[solidity]": { "editor.defaultFormatter": "JuanBlanco.solidity" }
   ```

---

##  Directory layout

```
contracts/
  validator/contract/
    │ XDCValidator.sol        ← upgraded system contract
    │ NodeNFT.sol             ← ERC-721 masternodes
    │ KYCToken.sol            ← soul-bound KYC NFT
    └ RewardVault.sol         ← reward escrow

test/
  00_fixture.ts              ← shared deploy helper
  01_propose.spec.ts
  ...
  34_pending_updates.spec.ts ← total 35 specs

docs/
  Architecture.md
  ConsensusChanges.md
  ContractsAPI.md
  Migration.md
  Testing.md
  UpgradeGuide.md

hardhat.config.ts
tsconfig.json
package.json
```

---

##  Key NPM scripts

| Command                                                 | What it does                                          |
| ------------------------------------------------------- | ----------------------------------------------------- |
| `npx hardhat compile`                                   | Compile Solidity contracts (artifacts → `/artifacts`) |
| `npx hardhat test`                                      | Run Mocha tests on in-memory chain                    |
| `npx hardhat node`                                      | Launch local JSON-RPC devnet                          |
| `npx hardhat run scripts/deploy.ts --network localhost` | Example deployment script (write your own)            |

---

##  Contract overview

| Contract         | Highlights                                                                                               |
| ---------------- | -------------------------------------------------------------------------------------------------------- |
| **XDCValidator** | *Stake management* (10M min self-stake, 0.1M voter), NodeNFT mint/burn, KYC gating, slash, reward bridge |
| **NodeNFT**      | ERC-721, deterministic tokenId = `uint160(candidate)`, transfer restricted to validator contract         |
| **KYCToken**     | Soul-bound ERC-721 (non-transferable), `isVerified(addr)` helper                                         |
| **RewardVault**  | Credits epoch rewards (`allocateReward`) under `CONSENSUS_ROLE`, pull `claimRewards()` by owners         |

Full ABI & events in **docs/ContractsAPI.md**.

---

##  Testing strategy

* **Unit specs** assert every revert message and event.
* **Edge-cases**: duplicate candidate, min-stake boundaries, unauthorized role calls, deterministic token IDs.
* **Gas targets** in `docs/Testing.md` for CI gas-reporter (optional).
* **Coverage** – add `hardhat-coverage` if you want percentages (`npm i -D solidity-coverage` → `npx hardhat coverage`).

---

##  Deploying to Apothem

1. Edit `hardhat.config.ts` and add:

   ```ts
   networks: {
     apothem: {
       url: "https://erpc.apothem.network",
       chainId: 51,
       accounts: [process.env.DEPLOY_KEY as string]
     }
   }
   ```

2. Compile & verify byte-code size (< 24 KB for system contracts).

3. Deploy contracts at fixed addresses **0x…89 – 0x…91**, then upgrade the
   existing system contract at **0x…88**.

Detailed fork procedure is in **docs/Migration.md**.

---

##  Contributing

PRs & issues welcome!
Follow conventional commits & run `npm run lint` before submitting.

---
