const { ethers, provider, } = require("./eth");
const etherscan = require("./etherscan");
const _ = require("lodash");
const parser = require('@solidity-parser/parser');
const LRU = require('lru-cache');
const cache = new LRU({
  max: 100,
  maxAge: 10 * 60 * 1_000, // 10m
});

function buildFileInfo(content) {
  const ast = parser.parse(content, {tolerant: true, loc: true})
  let info = {
    contracts: []
  }
  parser.visit(ast, {
    ContractDefinition: (node) => info.contracts.push(node.name),
  })
  return info
}

function buildFileRoot(filesByPath) {
  let fileRoot = {
    type: "directory",
    name: "",
    path: "",
    children: []
  }
  Object.keys(filesByPath).forEach(path => {
    let parts = path.split("/");
    let dir = fileRoot
    let fileName = parts[parts.length - 1]
    // First make/find the directories (e.g. mkdir -p)
    for (let i = 0; i < parts.length - 1; i++) {
      let nextDirName = parts[i]
      let nextDir = dir.children.find(d => d.name === nextDirName)
      if (!nextDir) {
        nextDir = {
          type: "directory",
          name: nextDirName,
          path: dir.path ? `${dir.path}/${nextDirName}` : nextDirName,
          children: [],
        };
        dir.children.push(nextDir)
      }
      dir = nextDir;
    }
    // Add the file at the found directory.
    dir.children.push({
      type: "file",
      name: fileName,
      path,
      content: filesByPath[path].content,
      info: buildFileInfo(filesByPath[path].content),
    })
  })
  return fileRoot;
}

function findContractFile(dir, contractName) {
  for (let i = 0; i < dir.children.length; i++) {
    let child = dir.children[i]
    if (child.type === "file" && child.info.contracts.indexOf(contractName) !== -1) {
      return child
    }
    if (child.type === "directory") {
      let found = findContractFile(child, contractName);
      if (found) {
        return found
      }
    }
  }
  return null
}

function cleanupPath(path) {
  // remove any leading slash
  return _.trim(path, "/")
}

async function gatherEtherscanSource(address) {
  let ethRes = await etherscan.contract.getsourcecode({address})
  let result = ethRes.data.result[0]
  let K = new ethers.utils.Interface(result.ABI)
  let contractName = result.ContractName
  let deployParams = K._abiCoder.decode(K.deploy.inputs, "0x" + result.ConstructorArguments);
  deployParams = _.omit(deployParams, _.range(0, deployParams.length))
  deployParams = _.mapValues(deployParams, v => v.toString())
  let sourceCodeBlob = result.SourceCode
  if (sourceCodeBlob.startsWith("{{") && sourceCodeBlob.endsWith("}}")) {
    sourceCodeBlob = sourceCodeBlob.slice(1, -1)
  }
  let sourceCode;
  try {
    sourceCode = JSON.parse(sourceCodeBlob);
  } catch (err) {
    // When we can't parse it as JSON, treat it as a single file blob.
    sourceCode = {
      sources: {
        [`contracts/${contractName}.sol`]: {
          content: sourceCodeBlob,
        },
      }
    }
  }

  let filesByPath = _.mapKeys(sourceCode.sources, (info, path) => cleanupPath(path));
  let fileRoot = buildFileRoot(filesByPath);
  let contractFile = findContractFile(fileRoot, contractName);
  return {
    address,
    contractName,
    contractFileName: contractFile.name,
    contractFilePath: contractFile.path,
    deployParams,
    fileRoot,
  }
}
async function getEtherscanSource(address) {
  let result = cache.get(address);
  if (!result) {
    result = gatherEtherscanSource(address);
    cache.set(address, result);
  }
  return result
}

exports = module.exports = {
  getEtherscanSource,
};
