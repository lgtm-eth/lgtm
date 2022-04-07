const ethers = require("ethers");
const {
  ETH_RPC_URL,
  ETH_NETWORK_NAME,
} = require("./config");
const provider = new ethers.providers.JsonRpcProvider(
  ETH_RPC_URL,
  ETH_NETWORK_NAME
);
exports = module.exports = {
  // ethers.js
  ethers,

  // rpc-connected provider
  /**
   * @type {JsonRpcProvider}
   */
  provider,

};
