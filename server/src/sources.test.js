const sources = require("./sources");
const ethers = require("ethers");
const fs = require("fs");
const SIMPLE_CONTENT = fs.readFileSync(__dirname + "/test.Simple.sol", "utf8");
const COMPLEX_COVEN_CONTENT = fs.readFileSync(
  __dirname + "/test.Complex.Coven.sol",
  "utf8"
);
const COMPLEX_PROOF_CONTENT = fs.readFileSync(
  __dirname + "/test.Complex.Proof.sol",
  "utf8"
);
const ADDRESS_A =
  "0xaaaaaaaa11223344112233441122334411223344112233441122334411223344";

describe.only("gatherEtherscanSource", () => {
  afterEach(() => {
    sources.resetRealEtherscan();
  });
  test("decoding etherscan response should work", async () => {
    sources.setFakeEtherscan({
      getSource: ({ address }) => ({
        data: {
          result: [
            {
              ABI: "[]", // etc
              ContractName: "CryptoCoven",
              ConstructorArguments: "", // etc
              CompilerVersion: "",
              SourceCode: JSON.stringify({
                sources: {
                  "contracts/CryptoCoven.sol": {
                    content: COMPLEX_COVEN_CONTENT,
                  },
                },
              }),
            },
          ],
        },
      }),
    });
    let source = await sources.gatherEtherscanSource(ADDRESS_A);
    console.log(source);
    expect(source).toMatchObject({
      mainContractName: "CryptoCoven",
      files: {
        "contracts/CryptoCoven.sol": {
          info: {
            functions: {
              "0xa0712d68": {
                name: "mint",
                fragment: "mint(uint256)",
                // etc.
              },
            },
          },
        },
      },
    });
  });
});

describe("buildFileInfo", () => {
  test("contracts should be identified", async () => {
    let info = sources.buildFileInfo("Simple.sol", SIMPLE_CONTENT);
    // See test.Simple.sol
    expect(info.contracts).toMatchObject({
      Simple: {
        position: {
          line: 8,
        },
        bases: ["ERC721"],
      },
    });
  });

  test("functions should be identified", async () => {
    let info = sources.buildFileInfo("Simple.sol", SIMPLE_CONTENT);
    // See test.Simple.sol
    expect(info.functions).toMatchObject({
      "0xcf6d461e": {
        name: "methodCee",
        fragment: "methodCee(uint256)",
        position: {
          line: 19,
          column: 60,
        },
        inputs: [
          {
            name: "uint256ParameterDee",
            type: "uint256",
            position: {
              line: 19,
              column: 22,
            },
          },
        ],
      },
    });
  });

  test("complex Coven should be identified", async () => {
    let info = sources.buildFileInfo("Coven.sol", COMPLEX_COVEN_CONTENT);
    // See test.Complex.Coven.sol
    expect(info.contracts).toMatchObject({
      CryptoCoven: {
        position: {
          line: 41,
        },
        bases: ["ERC721", "IERC2981", "Ownable", "ReentrancyGuard"],
      },
    });
    expect(info.functions).toMatchObject({
      "0xa0712d68": {
        name: "mint",
        fragment: "mint(uint256)",
      },
      "0x8e4f8692": {
        name: "mintCommunitySale",
        fragment: "mintCommunitySale(uint8,bytes32[])",
      },
      "0xb391c508": {
        name: "claim",
        fragment: "claim(bytes32[])",
      },
      "0x714c5398": {
        name: "getBaseURI",
        fragment: "getBaseURI()",
      },
      "0x83c4c00d": {
        name: "getLastTokenId",
        fragment: "getLastTokenId()",
      },
      "0x55f804b3": {
        name: "setBaseURI",
        fragment: "setBaseURI(string)",
      },
      "0xe43082f7": {
        name: "setIsOpenSeaProxyActive",
        fragment: "setIsOpenSeaProxyActive(bool)",
      },
      "0x24f985e9": {
        name: "setVerificationHash",
        fragment: "setVerificationHash(string)",
      },
      "0x28cad13d": {
        name: "setIsPublicSaleActive",
        fragment: "setIsPublicSaleActive(bool)",
      },
      "0x0d3cf1f2": {
        name: "setIsCommunitySaleActive",
        fragment: "setIsCommunitySaleActive(bool)",
      },
      "0xe10c605f": {
        name: "setCommunityListMerkleRoot",
        fragment: "setCommunityListMerkleRoot(bytes32)",
      },
      "0x15bdebe2": {
        name: "setClaimListMerkleRoot",
        fragment: "setClaimListMerkleRoot(bytes32)",
      },
      "0x6c3a9b4a": {
        name: "reserveForGifting",
        fragment: "reserveForGifting(uint256)",
      },
      "0xdf9bbb82": {
        name: "giftWitches",
        fragment: "giftWitches(address[])",
      },
      "0x3ccfd60b": {
        name: "withdraw",
        fragment: "withdraw()",
      },
      "0x661bdaf7": {
        name: "withdrawTokens",
        fragment: "withdrawTokens(IERC20)",
      },
      "0x380c24df": {
        name: "rollOverWitches",
        fragment: "rollOverWitches(address[])",
      },
      "0x01ffc9a7": {
        name: "supportsInterface",
        fragment: "supportsInterface(bytes4)",
      },
      "0xe985e9c5": {
        name: "isApprovedForAll",
        fragment: "isApprovedForAll(address,address)",
      },
      "0xc87b56dd": {
        name: "tokenURI",
        fragment: "tokenURI(uint256)",
      },
      "0x2a55205a": {
        name: "royaltyInfo",
        fragment: "royaltyInfo(uint256,uint256)",
      },
    });
  });

  test("complex Proof should be identified", async () => {
    let info = sources.buildFileInfo("Proof.sol", COMPLEX_PROOF_CONTENT);
    // See test.Complex.Coven.sol
    expect(info.contracts).toMatchObject({
      PROOFCollective: {
        position: {
          line: 11,
        },
        bases: ["ERC721Common", "LinearDutchAuction"],
      },
    });
    expect(info.functions).toMatchObject({
      "0xa6f2ae3a": {
        name: "buy",
        fragment: "buy()",
      },
      "0x30176e13": {
        name: "setBaseTokenURI",
        fragment: "setBaseTokenURI(string)",
      },
      "0xc87b56dd": {
        name: "tokenURI",
        fragment: "tokenURI(uint256)",
      },
      "0x18160ddd": {
        name: "totalSupply",
        fragment: "totalSupply()",
      },
    });
  });
});
