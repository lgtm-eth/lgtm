const {ethers, provider} = require("./eth");
const sources = require("./sources");

async function getAddressCode({address}) {
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

const PROJECT_INFO = {
  "0x5180db8F5c931aaE63c74266b211F580155ecac8": {
    projectName: "Crypto Coven",
    projectReviewPercentage: 84,
    projectWebUrl: "https://cryptocoven.xyz",
    projectTwitterName: "crypto_coven",
    projectBannerImageUrl: "https://lh3.googleusercontent.com/M42Xf9Vbu_yodzKVFA1I6TYXIx5Hz699gEtp2lDg9vGT7g-S4z_5cx2iYPub1kytnOlexV5WDdGOmpGeuH4-N0CYXi7FaC_iqEm4gQ=h600",
    projectLogoImageUrl: "https://lh3.googleusercontent.com/E8MVasG7noxC0Fa_duhnexc2xze1PzT1jzyeaHsytOC4722C2Zeo7EhUR8-T6mSem9-4XE5ylrCtoAsceZ_lXez_kTaMufV5pfLc3Fk=s130",
  },
}
const SOURCE_INFO = {
  "0x5180db8F5c931aaE63c74266b211F580155ecac8": {
    name: "CryptoCoven.sol",
    github: {
      repositoryUrl: "https://github.com/cryptocoven/contracts",
    },
    etherscan: {
      verifiedCodeUrl: "https://etherscan.io/address/cryptocoven.eth#code",
      compilation: {
        compilerVersion: "v0.8.4+commit.c7e474f2",
        optimization: {
          enabled: true,
          runs: 100_000,
        },
      },
      files: [
        {
          name: "CryptoCoven.sol",
          syntax: "solidity ^0.8.0",
        },
      ],
    },
  },
}

async function getAddressInfo({address}) {
  if (address && address.endsWith(".eth")) {
    address = await provider.resolveName(address);
  }
  if (
    !address ||
    !ethers.utils.isAddress(address)
  ) {
    throw new Error(`bad address`)
  }
  let project = PROJECT_INFO[address] || null
  let source = SOURCE_INFO[address] || null
  let code = await provider.getCode(address)
  if (ethers.utils.hexDataLength(code) > 0) {
    return {
      contract: {
        address,
        code,
        project,
        source,
      }
    }
  }
  return {
    wallet: {
      address,
    }
  }
}

exports = module.exports = {
  getAddressCode,
  getAddressInfo,
};
