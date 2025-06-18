import { expect } from "chai";
import { ethers } from "hardhat";
import { setup } from "./00_fixture";

describe("T4 ownership transfer", () => {
  it("moves NodeNFT", async () => {
    const { kyc, kycVerifier, validator, nft, users } = await setup();
    const [owner, buyer] = users;
    await kyc.connect(kycVerifier).mint(await owner.getAddress(), "ok");
    await kyc.connect(kycVerifier).mint(await buyer.getAddress(), "ok");
    const stake = ethers.utils.parseEther("10000000");
    await validator.connect(owner).propose(await owner.getAddress(), { value: stake });
    await validator.connect(owner).transferOwnership(await owner.getAddress(), await buyer.getAddress());
    const id = await nft.nodeTokenId(await owner.getAddress());
    expect(await nft.ownerOf(id)).to.equal(await buyer.getAddress());
  });
});