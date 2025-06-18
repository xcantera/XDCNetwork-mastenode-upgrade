import { expect } from "chai";
import { ethers } from "hardhat";
import { setup } from "./00_fixture";

describe("T5 reward claim", () => {
  it("credits & pays", async () => {
    const { admin, kyc, kycVerifier, validator, vault, users } = await setup();
    const owner = users[0];
    await kyc.connect(kycVerifier).mint(await owner.getAddress(), "ok");
    const stake = ethers.utils.parseEther("10000000");
    await validator.connect(owner).propose(await owner.getAddress(), { value: stake });
    const r = ethers.utils.parseEther("42");
    await validator.connect(admin).allocateEpochReward(await owner.getAddress(), r, { value: r });
    await vault.connect(owner).claimRewards();
    expect(await vault.pending(await owner.getAddress())).to.equal(0);
  });
});