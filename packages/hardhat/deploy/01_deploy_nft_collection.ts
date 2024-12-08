import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployNFTCollection: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  await deploy("NFTCollection", {
    from: deployer,
    args: [
      "MyNFTCollection", // _name
      "MNFT", // _symbol
      "https://bafybeiessvmfjfozvnpht6kuirrgvxntwbotjtocrdts3sot2ohabtdbda.ipfs.w3s.link", // _baseTokenURI
      deployer, // initialOwner
    ],
    log: true,
  });
};

export default deployNFTCollection;
deployNFTCollection.tags = ["NFTCollection"];
