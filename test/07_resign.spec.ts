import { expect } from "chai";
import { ethers } from "hardhat";
import { setup } from "./00_fixture";

describe("T7 resign", () => {
  it("deactivates candidate", async () => {
    const { kyc, kycVerifier, validator, nft, users } = await setup();
    const owner = users[0];
    await kyc.connect(kycVerifier).mint(await owner.getAddress(), "ok");
    const stake = ethers.utils.parseEther("10000000");
    await validator.connect(owner).propose(await owner.getAddress(), { value: stake });
    const tokenId = await nft.nodeTokenId(await owner.getAddress());
    await validator.connect(owner).resign(await owner.getAddress());
    await expect(nft.ownerOf(tokenId)).to.be.reverted;
  });
});