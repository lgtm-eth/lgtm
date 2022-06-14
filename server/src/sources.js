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

// Returns true if the two parameters (from ethers and from the parser) are the same-ish.
function isSameInputParam(ethersParam, parserParam) {
  if (ethersParam.name !== parserParam.name) {
    return false;
  }
  let isTypeMatch =
    ethersParam.type === parserParam.typeName.name ||
    (ethersParam.arrayChildren &&
      parserParam.typeName.type === "ArrayTypeName") ||
    (parserParam.typeName.type === "UserDefinedTypeName" &&
      (ethersParam.type === "tuple" || ethersParam.type === "address"));
  if (!isTypeMatch) {
    // console.log("mismatched types", ethersParam.name, ethersParam, parserParam);
    return false;
  }
  return true;
}

// This identifies and locates the contracts and functions defined in the file.
// It uses the ABI to associate the sighash with file locations for annotation.
// Output: {
//   contracts: {
//     FooContract: {
//       position: { line: ..., column: ... },
//       bases: ["ParentContract", ...],
//       functions: {
//         "0x12345678": {
//           position: { line: ..., column: ... },
//           inputPositions: [{ line: ..., column: ...}, ...]
//         },
//         ...
//       }
//     },
//     BarContract: {
//       ...
//     },
//     ...
//  }
// }
function buildFileInfo(fileName, content, ABI) {
  let info = {
    contracts: {},
  };
  let iface = new ethers.utils.Interface(ABI || []);
  if (fileName.endsWith(".sol")) {
    const ast = parser.parse(content, {
      tolerant: true,
      loc: true,
      range: true,
    });
    let currentContract = "";
    parser.visit(ast, {
      ContractDefinition: (node, parent) => {
        let bases = [];
        try {
          bases = node.baseContracts.map((base) => base.baseName.namePath);
          info.contracts[node.name] = {
            position: node.loc.start,
            bases,
            functions: {},
          };
          currentContract = node.name;
        } catch (ignore) {
          console.log(
            "ignoring contract definition parse error",
            node.name,
            ignore
          );
        }
      },
      FunctionDefinition: (node, parent) => {
        if (node.isConstructor) {
          // TODO
          // store info.contracts[].constructor = {}
          // console.log("skipping constructor");
          return;
        }
        if (["public", "external"].indexOf(node.visibility) === -1) {
          // console.log("skipping non-public method", node.name);
          return;
        }
        if (parent.kind === "interface") {
          return;
        }
        try {
          let matches = Object.values(iface.functions).filter(
            (f) =>
              f.name.split("(")[0] === node.name &&
              f.inputs?.length === node.parameters?.length &&
              _.every(f.inputs, (input, i) =>
                isSameInputParam(f.inputs[i], node.parameters[i])
              )
          );
          if (matches.length !== 1) {
            return;
          }
          let frag = matches[0];
          let sig = ethers.utils.Interface.getSighash(frag);
          info.contracts[currentContract].functions[sig] = {
            position: node.loc.start,
            inputPositions: node.parameters.map((p) => p.loc.end),
          };
        } catch (ignore) {
          console.log(
            "ignoring unidentified method",
            parent?.name,
            node.name,
            ignore
          );
        }
      },
    });
  }
  return info;
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
    info: buildFileInfo(path, content, result.ABI),
  }));
  return {
    address,
    ABI: result.ABI,
    mainContractName,
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
