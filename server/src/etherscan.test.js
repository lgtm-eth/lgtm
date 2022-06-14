const etherscan = require("./etherscan");
const fs = require("fs");

// This isn't really a test. It's using the real etherscan API to gather test resources.
// It should only be run manually when adding a new test contract address.
describe.skip("getSource", () => {
  test("fetching sources", async () => {
    for (let address of [
      "0x5180db8F5c931aaE63c74266b211F580155ecac8",
      "0x59728544B08AB483533076417FbBB2fD0B17CE3a",
      "0x08D7C0242953446436F34b4C78Fe9da38c73668d",
    ]) {
      let res = await etherscan.getSource({ address });
      let result = res?.data || {};
      fs.writeFileSync(
        __dirname + `/test.Source.${address}.etherscan.json`,
        JSON.stringify(result),
        "utf8"
      );
    }
  });
});
