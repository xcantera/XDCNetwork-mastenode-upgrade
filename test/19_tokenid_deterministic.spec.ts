
import { expect } from "chai";import { ethers } from "hardhat";import { setup } from "./00_fixture";
describe("T19 tokenId deterministic",()=>{it("id == uint160(candidate)",async()=>{const {kyc, kycVerifier, validator, nft, users}=await setup();const owner=users[0];await kyc.connect(kycVerifier).mint(await owner.getAddress(),"m");const stake=ethers.utils.parseEther("10000000");const cand = await owner.getAddress();await validator.connect(owner).propose(cand,{value:stake});const id = await nft.nodeTokenId(cand);expect(id).to.equal(ethers.BigNumber.from(cand));});});
