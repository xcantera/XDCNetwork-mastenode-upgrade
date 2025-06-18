import { expect } from "chai";
import { ethers } from "hardhat";
import { setup } from "./00_fixture";

describe("T6 slash", () => {
  it("burns NFT", async () => {
    const { admin, kyc, kycVerifier, validator, nft, users } = await setup();
    const owner = users[0];
    await kyc.connect(kycVerifier).mint(await owner.getAddress(), "x");
    const stake = ethers.utils.parseEther("10000000");
    await validator.connect(owner).propose(await owner.getAddress(), { value: stake });
    const id = await nft.nodeTokenId(await owner.getAddress());
    await validator.connect(admin).slash(await owner.getAddress(), "bad");
    await expect(nft.ownerOf(id)).to.be.reverted;
  });
});