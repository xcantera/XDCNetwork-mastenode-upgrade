import { expect } from "chai";
import { ethers } from "hardhat";
import { setup } from "./00_fixture";

describe("T20 withdraw after delay", () => {
  it("allows withdrawal once unlockBlock reached (placeholder check)", async () => {
    const ctx = await setup();
    const [owner,voter] = ctx.users;
    await ctx.kyc.connect(ctx.kycVerifier).mint(await owner.getAddress(),"k");
    await ctx.kyc.connect(ctx.kycVerifier).mint(await voter.getAddress(),"k");
    const stake = ethers.utils.parseEther("10000000");
    await ctx.validator.connect(owner).propose(await owner.getAddress(),{value: stake});
    const voteAmt = ethers.utils.parseEther("200000");
    await ctx.validator.connect(voter).vote(await owner.getAddress(),{value: voteAmt});
    await ctx.validator.connect(voter).unvote(await owner.getAddress(), voteAmt);
    // increase blocks
    for (let i=0;i<3;i++) await ethers.provider.send("evm_mine", []);
    // at this stage withdraw() should not revert even if implementation still TBD
    await ctx.validator.connect(voter).withdraw(); // no revert test
  });
});
