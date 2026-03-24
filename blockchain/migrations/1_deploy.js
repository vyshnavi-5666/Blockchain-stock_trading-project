const StockTrading = artifacts.require("StockTrading");

module.exports = function(deployer) {
  deployer.deploy(StockTrading);
};