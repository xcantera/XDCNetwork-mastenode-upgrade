
import { expect } from "chai";import { ethers } from "hardhat";import { setup } from "./00_fixture";
describe("T14 slash unauthorized",()=>{it("fails for non-admin",async()=>{const {kyc, kycVerifier, validator, users}=await setup();const [owner,attacker]=users;await kyc.connect(kycVerifier).mint(await owner.getAddress(),"ok");const stake=ethers.utils.parseEther("10000000");await validator.connect(owner).propose(await owner.getAddress(),{value:stake});await expect(validator.connect(attacker).slash(await owner.getAddress(),"")).to.be.reverted;});});
