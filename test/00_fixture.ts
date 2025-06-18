
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";

interface Ctx {
  admin: Signer;
  kycVerifier: Signer;
  users: Signer[];
  kyc: Contract;
  nft: Contract;
  vault: Contract;
  validator: Contract;
}

export async function setup(): Promise<Ctx> {
  const [admin, kycVerifier, ...users] = await ethers.getSigners();

  const KYCToken = await ethers.getContractFactory("KYCToken");
  const kyc = await KYCToken.deploy(await admin.getAddress());
  await kyc.deployed();
  await kyc.grantRole(await kyc.KYC_VERIFIER_ROLE(), await kycVerifier.getAddress());

  const NodeNFT = await ethers.getContractFactory("NodeNFT");
  const nft = await NodeNFT.deploy(await admin.getAddress());
  await nft.deployed();

  const RewardVault = await ethers.getContractFactory("RewardVault");
  const vault = await RewardVault.deploy(await admin.getAddress());
  await vault.deployed();
  await vault.grantRole(await vault.CONSENSUS_ROLE(), await admin.getAddress());

  const Validator = await ethers.getContractFactory("XDCValidator");
  const validator = await Validator.deploy(kyc.address, nft.address, vault.address);
  await validator.deployed();

  return { admin, kycVerifier, users, kyc, nft, vault, validator };
}
