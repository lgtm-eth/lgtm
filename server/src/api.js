const { ethers, provider } = require("./eth");
const sources = require("./sources");
const storage = require("./storage");

async function refreshAddressInfo({ address }) {
  // TODO: add to a refreshing queue etc
  let info = await gatherAddressInfo({ address });
  await storage.saveJSON(`address/${address}.json`, info);
  return { refreshing: true };
}

async function gatherAddressInfo({ address }) {
  if (address && address.endsWith(".eth")) {
    let resolvedAddress = await provider.resolveName(address);
    return {
      redirect: {
        to: `/address/${resolvedAddress}`,
      },
    };
  }
  if (!address || !ethers.utils.isAddress(address)) {
    throw new Error(`bad address`);
  }
  let byteCode = await provider.getCode(address);
  if (ethers.utils.hexDataLength(byteCode) > 0) {
    let source = await sources.getEtherscanSource(address);
    return {
      contract: {
        address,
        byteCode,
        source,
      },
    };
  }
  return {
    wallet: {
      address,
    },
  };
}

exports = module.exports = {
  refreshAddressInfo,
};
