import { expect } from "chai";import { setup } from "./00_fixture";
describe("T33 Validator has role",()=>{it("validator contract has VALIDATOR_CONTRACT_ROLE",async()=>{const ctx=await setup();const role = await ctx.nft.VALIDATOR_CONTRACT_ROLE();expect(await ctx.nft.hasRole(role, ctx.validator.address)).to.equal(true);});});
