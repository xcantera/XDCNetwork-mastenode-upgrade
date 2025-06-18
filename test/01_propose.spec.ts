import { expect } from "chai";
import { ethers } from "hardhat";
import { setup } from "./00_fixture";

describe("T1 propose success", () => {
  it("accepts KYC & stake", async () => {
    const { kyc, kycVerifier, validator, users } = await setup();
    const [owner] = users;
    await kyc.connect(kycVerifier).mint(await owner.getAddress(), "m");
    const stake = ethers.utils.parseEther("10000000");
    await expect(validator.connect(owner).propose(await owner.getAddress(), { value: stake }))
      .to.emit(validator, "Propose");
  });
});