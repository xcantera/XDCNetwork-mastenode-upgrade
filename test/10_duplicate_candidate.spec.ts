
import { expect } from "chai";import { ethers } from "hardhat";import { setup } from "./00_fixture";
describe("T10 duplicate candidate", () => {
it("rejects second propose for same address", async ()=>{const {kyc, kycVerifier, validator, users}=await setup();const [o1,o2]=users;await kyc.connect(kycVerifier).mint(await o1.getAddress(),"m");await kyc.connect(kycVerifier).mint(await o2.getAddress(),"m");const stake=ethers.utils.parseEther("10000000");await validator.connect(o1).propose(await o1.getAddress(),{value:stake});await expect(validator.connect(o2).propose(await o1.getAddress(),{value:stake})).to.be.revertedWith("Validator: already candidate");});
});
