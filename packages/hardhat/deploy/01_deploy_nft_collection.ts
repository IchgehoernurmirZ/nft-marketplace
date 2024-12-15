const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Get the contract factory
  const NFTCollection = await ethers.getContractFactory("NFTCollection");

  // Define the parameters
  const name = "MyNFTCollection";
  const symbol = "MNFT";
  const initialOwner = deployer.address;

  try {
    // Deploy the contract
    const nftCollection = await NFTCollection.deploy(name, symbol, initialOwner);
    
    // Wait for the deployment to be completed
    await nftCollection.waitForDeployment();

    // Get the deployed contract address
    console.log("NFTCollection deployed to:", nftCollection.target);
  } catch (error) {
    console.error("Deployment error:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

