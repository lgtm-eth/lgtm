import { decodeFileHash, encodeFileHash } from "./fileHashCodec";

const EXAMPLES = {
  "": { path: "", selection: { startLineNumber: 1, endLineNumber: 1 } },
  "/contracts/Foo.sol": {
    path: "/contracts/Foo.sol",
    selection: { startLineNumber: 1, endLineNumber: 1 },
  },
  "/contracts/Foo.sol@L13": {
    path: "/contracts/Foo.sol",
    selection: { startLineNumber: 13, endLineNumber: 13 },
  },
  "/contracts/Foo.sol@L13-L17": {
    path: "/contracts/Foo.sol",
    selection: { startLineNumber: 13, endLineNumber: 17 },
  },
};

Object.keys(EXAMPLES).forEach((encoded) => {
  test(`codec "${encoded}"`, () => {
    let decoded = EXAMPLES[encoded];
    expect(encodeFileHash(decoded)).toBe(encoded);
    expect(decodeFileHash(encoded)).toMatchObject(decoded);
  });
});

// edge cases

test("make sure the '@' doesn't cause trouble", () => {
  expect(
    decodeFileHash("/@openzeppelin/contracts/interfaces/IERC20.sol@L4-L6")
  ).toMatchObject({
    path: "/@openzeppelin/contracts/interfaces/IERC20.sol",
    selection: {
      startLineNumber: 4,
      endLineNumber: 6,
    },
  });
});

test("startLineNumber less than 1 should be clamped to 1", () => {
  expect(decodeFileHash("/contracts/Foo.sol@L0-L10")).toMatchObject({
    path: "/contracts/Foo.sol",
    selection: { startLineNumber: 1, endLineNumber: 10 },
  });
});

test("startLineNumber after endLineNumber should be clamped", () => {
  expect(decodeFileHash("/contracts/Foo.sol@L13-L10")).toMatchObject({
    path: "/contracts/Foo.sol",
    selection: { startLineNumber: 13, endLineNumber: 13 },
  });
});
