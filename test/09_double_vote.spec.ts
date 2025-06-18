import { expect } from "chai";
import { ethers } from "hardhat";
import { setup } from "./00_fixture";

describe("T9 double vote accumulates", () => {
  it("adds stake", async () => {
    const { kyc, kycVerifier, validator, users } = await setup();
    const [owner, voter] = users;
    await kyc.connect(kycVerifier).mint(await owner.getAddress(), "a");
    await kyc.connect(kycVerifier).mint(await voter.getAddress(), "a");
    const stake = ethers.utils.parseEther("10000000");
    await validator.connect(owner).propose(await owner.getAddress(), { value: stake });
    const amt = ethers.utils.parseEther("100000");
    await validator.connect(voter).vote(await owner.getAddress(), { value: amt });
    await validator.connect(voter).vote(await owner.getAddress(), { value: amt });
    expect(await validator.getVoterStake(await voter.getAddress(), await owner.getAddress())).to.equal(amt.mul(2));
  });
});