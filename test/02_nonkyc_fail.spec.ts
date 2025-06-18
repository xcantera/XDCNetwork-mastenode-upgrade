import { expect } from "chai";
import { ethers } from "hardhat";
import { setup } from "./00_fixture";

describe("T2 propose w/out KYC", () => {
  it("reverts", async () => {
    const { validator, users } = await setup();
    const stake = ethers.utils.parseEther("10000000");
    await expect(validator.connect(users[0]).propose(await users[0].getAddress(), { value: stake }))
      .to.be.revertedWith("Validator: KYC required");
  });
});