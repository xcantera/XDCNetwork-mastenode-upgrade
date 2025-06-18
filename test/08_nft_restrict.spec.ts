import { expect } from "chai";
import { ethers } from "hardhat";
import { setup } from "./00_fixture";

describe("T8 NFT restricted transfer", () => {
  it("reverts", async () => {
    const { kyc, kycVerifier, validator, nft, users } = await setup();
    const [owner, bad] = users;
    await kyc.connect(kycVerifier).mint(await owner.getAddress(), "ok");
    const stake = ethers.utils.parseEther("10000000");
    await validator.connect(owner).propose(await owner.getAddress(), { value: stake });
    const id = await nft.nodeTokenId(await owner.getAddress());
    await expect(
      nft.connect(owner)["safeTransferFrom(address,address,uint256)"](await owner.getAddress(), await bad.getAddress(), id)
    ).to.be.revertedWith("NodeNFT: transfer restricted");
  });
});