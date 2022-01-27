var NFT = artifacts.require("./NFT.sol");

module.exports = function(deployer) {
  deployer.deploy(NFT, "https://www.meine-domain.de/nfts/");
};
