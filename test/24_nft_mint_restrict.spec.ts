import { expect } from "chai";import { setup } from "./00_fixture";
describe("T24 NodeNFT restricted mint",()=>{it("reverts when caller is not validator",async()=>{const ctx=await setup();const [bad]=ctx.users;await expect(ctx.nft.connect(bad).mint(await bad.getAddress(), await bad.getAddress())).to.be.revertedWith("NodeNFT: caller not validator");});});
