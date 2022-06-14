const sources = require("./sources");
const ethers = require("ethers");
const fs = require("fs");
const SIMPLE_CONTENT = fs.readFileSync(__dirname + "/test.Simple.sol", "utf8");
const COMPLEX_CONTENT = fs.readFileSync(
  __dirname + "/test.Complex.sol",
  "utf8"
);
const COVEN_ADDRESS = "0x5180db8F5c931aaE63c74266b211F580155ecac8";
const LOOKSRARE_ADDRESS = "0x59728544B08AB483533076417FbBB2fD0B17CE3a";
const PROOF_ADDRESS = "0x08D7C0242953446436F34b4C78Fe9da38c73668d";
const SOURCES = Object.assign(
  ...[COVEN_ADDRESS, LOOKSRARE_ADDRESS, PROOF_ADDRESS].map((address) => ({
    [address]: require(`./test.Source.${address}.etherscan.json`),
  }))
);
const FakeEtherscan = {
  getSource: ({ address }) => ({
    data: SOURCES[address],
  }),
};

describe("gatherEtherscanSource", () => {
  afterEach(() => {
    sources.resetRealEtherscan();
  });
  test("decoding etherscan response should work", async () => {
    sources.setFakeEtherscan(FakeEtherscan);
    let source = await sources.gatherEtherscanSource(COVEN_ADDRESS);
    expect(source).toMatchObject({
      mainContractName: "CryptoCoven",
      files: {
        "contracts/CryptoCoven.sol": {
          info: {
            contracts: {
              CryptoCoven: {
                bases: ["ERC721", "IERC2981", "Ownable", "ReentrancyGuard"],
                position: {
                  line: 41,
                  column: 0,
                },
                functions: {
                  // mint
                  "0xa0712d68": {
                    position: {
                      line: 145,
                      column: 4,
                    },
                    inputPositions: [
                      {
                        line: 145,
                        column: 26,
                      },
                    ],
                  },
                  "0x8e4f8692": {}, // mintCommunitySale...
                  "0xb391c508": {}, // claim...
                  "0x714c5398": {}, // getBaseURI...
                  // etc...
                },
              },
            },
          },
        },
      },
    });
  });

  test("complex Proof should be identified", async () => {
    sources.setFakeEtherscan(FakeEtherscan);
    let source = await sources.gatherEtherscanSource(PROOF_ADDRESS);
    expect(source).toMatchObject({
      mainContractName: "PROOFCollective",
      files: {
        "contracts/PROOFCollective.sol": {
          info: {
            contracts: {
              PROOFCollective: {
                bases: ["ERC721Common", "LinearDutchAuction"],
                position: {
                  line: 11,
                },
                functions: {
                  // buy
                  "0xa6f2ae3a": {
                    position: { column: 4, line: 44 },
                    inputPositions: [],
                  },
                  "0x30176e13": {}, // setBaseTokenURI ...
                  "0xc87b56dd": {}, // tokenURI ...
                  "0x18160ddd": {}, // totalSupply ...
                  // ...
                },
              },
            },
          },
        },
      },
    });
  });

  test("complex LooksRare should be identified", async () => {
    sources.setFakeEtherscan(FakeEtherscan);
    let source = await sources.gatherEtherscanSource(LOOKSRARE_ADDRESS);
    expect(source).toMatchObject({
      mainContractName: "LooksRareExchange",
      files: {
        "contracts/LooksRareExchange.sol": {
          info: {
            contracts: {
              LooksRareExchange: {
                position: {
                  line: 60,
                },
                bases: ["ILooksRareExchange", "ReentrancyGuard", "Ownable"],
                functions: {
                  "0xb4e4b296": {
                    position: { column: 4, line: 186 },
                    inputPositions: [
                      { column: 39, line: 187 },
                      { column: 39, line: 188 },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    });
  });
});
