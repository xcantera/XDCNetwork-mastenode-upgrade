import { expect } from "chai";import { ethers } from "hardhat";import { setup } from "./00_fixture";
describe("T22 vault unauthorized allocate",()=>{it("reverts",async()=>{const ctx=await setup();const [user]=ctx.users;await expect(ctx.vault.connect(user).allocateReward(user.getAddress(),1,{value:1})).to.be.reverted;});});
