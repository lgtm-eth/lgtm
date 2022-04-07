const {ethers, provider} = require("./eth");
const sources = require("./sources")

async function getSource({address}) {
  if (address && address.endsWith(".eth")) {
    address = await provider.resolveName(address);
  }
  if (
    !address ||
    !ethers.utils.isAddress(address)
  ) {
    throw new Error(`bad address`)
  }
  return sources.getEtherscanSource(address)
}

exports = module.exports = {
  getSource,
};
