
var healthLedger = artifacts.require("./HealthLedger.sol");


//Contract Address on Nile
//TVgmyZuz6RaN1hTXWdkiBBYmnNqyEg2HxH
module.exports = async function (deployer) {

  //  const tokenContract = await healthLedgerToken.deployed()
  deployer.deploy(healthLedger, "TAstCF7ArG7JHHtt1GP5FCtRgNkNvdHfff", "https://teal-eligible-bobolink-804.mypinata.cloud/ipfs/");
};
