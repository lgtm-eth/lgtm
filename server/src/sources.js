const ethers = require("ethers");
const _ = require("lodash");
const parser = require("@solidity-parser/parser");
const LRU = require("lru-cache");
const realEtherscan = require("./etherscan");
/* mutable for testing */
let etherscan = realEtherscan;
const cache = new LRU({
  max: 100,
  maxAge: 10 * 60 * 1_000, // 10m
});

function buildFileInfo(fileName, content) {
  let info = {
    contracts: {},
    functions: {},
    // TODO
    // constructor: {}
  };
  if (fileName.endsWith(".sol")) {
    const ast = parser.parse(content, {
      tolerant: true,
      loc: true,
      range: true,
    });
    parser.visit(ast, {
      ContractDefinition: (node) => {
        let bases = [];
        try {
          bases = node.baseContracts.map((base) => base.baseName.namePath);
          info.contracts[node.name] = {
            position: node.loc.start,
            bases,
          };
        } catch (ignore) {
          console.log(
            "ignoring contract definition parse error",
            node.name,
            ignore
          );
        }
      },
      FunctionDefinition: (node) => {
        if (node.isConstructor) {
          // console.log("skipping constructor");
          return;
        }
        if (["public", "external"].indexOf(node.visibility) === -1) {
          // console.log("skipping non-public method", node.name);
          return;
        }
        try {
          let inputs = node.parameters.map((p) =>
            ethers.utils.ParamType.from(
              content.substring(p.range[0], p.range[1])
            )
          );
          let frag = ethers.utils.FunctionFragment.from({
            type: "function",
            constant: true,
            name: node.name,
            inputs,
          });
          let sig = ethers.utils.Interface.getSighash(frag);
          info.functions[sig] = {
            name: node.name,
            fragment: frag.format(),
            position: node.loc.start,
            inputs: node.parameters.map((p, i) => ({
              name: p.name,
              type: inputs[i].type,
              position: p.loc.end,
            })),
          };
        } catch (ignore) {
          console.log(
            "ignoring function definition parse error",
            node.name,
            ignore
          );
        }
      },
    });
  }
  return info;
}

function keyPathsByContract(filesByPath) {
  let contractPaths = {};
  Object.keys(filesByPath).forEach((path) => {
    Object.keys(filesByPath[path].info.contracts || {}).forEach(
      (contract) => (contractPaths[contract] = path)
    );
  });
  return contractPaths;
}

function findContractFile(dir, contractName) {
  for (let i = 0; i < dir.children.length; i++) {
    let child = dir.children[i];
    if (
      child.type === "file" &&
      child.info.contracts.indexOf(contractName) !== -1
    ) {
      return child;
    }
    if (child.type === "directory") {
      let found = findContractFile(child, contractName);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

function cleanupPath(path) {
  // remove any leading slash
  return _.trim(path, "/");
}

async function gatherEtherscanSource(address) {
  let ethRes = await etherscan.getSource({ address });
  let result = ethRes?.data?.result[0];
  let mainContractName = result.ContractName;
  let sourceCodeBlob = result.SourceCode;
  let constructorInputs = result.ConstructorArguments
    ? "0x" + result.ConstructorArguments
    : "";
  if (sourceCodeBlob.startsWith("{{") && sourceCodeBlob.endsWith("}}")) {
    sourceCodeBlob = sourceCodeBlob.slice(1, -1);
  }
  let sourceLanguage = "sol";
  if (result.CompilerVersion.startsWith("vyper")) {
    sourceLanguage = "vy";
  }
  let sourceCode;
  try {
    sourceCode = JSON.parse(sourceCodeBlob);
  } catch (err) {
    // When we can't parse it as JSON, treat it as a single file blob.
    sourceCode = {
      sources: {
        // default, in case we can't analyze the source
        [`contracts/${mainContractName}.${sourceLanguage}`]: {
          content: sourceCodeBlob,
        },
      },
    };
  }

  let filesByPath = _.mapKeys(sourceCode.sources, (info, path) =>
    cleanupPath(path)
  );
  filesByPath = _.mapValues(filesByPath, ({ content }, path) => ({
    content,
    info: buildFileInfo(path, content),
  }));
  let contractPaths = keyPathsByContract(filesByPath);
  let mainContractFilePath =
    contractPaths[mainContractName] ||
    `contracts/${mainContractName}.${sourceLanguage}`;
  return {
    address,
    ABI: result.ABI,
    mainContractName,
    contractPaths,
    constructorInputs,
    files: filesByPath,
  };
}
async function getEtherscanSource(address) {
  let result = cache.get(address);
  if (!result) {
    result = gatherEtherscanSource(address);
    cache.set(address, result);
  }
  return result;
}

exports = module.exports = {
  getEtherscanSource,

  // Visible for testing
  buildFileInfo,
  gatherEtherscanSource,
  cache,
  setFakeEtherscan: (fakeEtherscan) => (etherscan = fakeEtherscan),
  resetRealEtherscan: () => (etherscan = realEtherscan),
};
