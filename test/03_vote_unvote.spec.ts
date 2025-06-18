import { expect } from "chai";
import { ethers } from "hardhat";
import { setup } from "./00_fixture";

describe("T3 vote/unvote", () => {
  it("updates stake", async () => {
    const { kyc, kycVerifier, validator, users } = await setup();
    const [owner, voter] = users;
    await kyc.connect(kycVerifier).mint(await owner.getAddress(), "m");
    await kyc.connect(kycVerifier).mint(await voter.getAddress(), "m");
    const stake = ethers.utils.parseEther("10000000");
    await validator.connect(owner).propose(await owner.getAddress(), { value: stake });
    const add = ethers.utils.parseEther("200000");
    await validator.connect(voter).vote(await owner.getAddress(), { value: add });
    expect(await validator.getCandidateStake(await owner.getAddress())).to.equal(stake.add(add));
    await validator.connect(voter).unvote(await owner.getAddress(), add);
    expect(await validator.getCandidateStake(await owner.getAddress())).to.equal(stake);
  });
});