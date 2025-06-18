import { expect } from "chai";import { setup } from "./00_fixture";
describe("T31 consensus role constant",()=>{it("is keccak256",async()=>{const ctx=await setup();const hash = await ctx.vault.CONSENSUS_ROLE();expect(hash).to.not.equal(ethers.constants.HashZero);});});
