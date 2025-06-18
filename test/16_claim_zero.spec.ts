
import { expect } from "chai";import { setup } from "./00_fixture";
describe("T16 claim zero",()=>{it("reverts",async()=>{const {vault, users}=await setup();await expect(vault.connect(users[0]).claimRewards()).to.be.revertedWith("RewardVault: nothing to claim");});});
