
var healthLedgerToken = artifacts.require("./HealthLedgerToken.sol");


//Contract Address on Nile
//TAstCF7ArG7JHHtt1GP5FCtRgNkNvdHfff
module.exports = function (deployer) {
  const totalSupply = 10000000 * (10 ** 18)

  deployer.deploy(healthLedgerToken, "HealthLedgerToken", "HLT", BigInt(totalSupply));
};
