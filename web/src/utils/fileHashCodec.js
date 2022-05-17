import _ from "lodash";

const LINE_PATTERN = /(?:@L([0-9]+))?(?:-L([0-9]+))?$/;
export function decodeFileHash(fileHash = "") {
  if (fileHash[0] === "#") {
    fileHash = fileHash.substring(1);
  }
  let [path, start, end] = _.split(fileHash || "", LINE_PATTERN);
  let startLineNumber = _.clamp(
    _.toInteger(start || "1"),
    1,
    Number.MAX_SAFE_INTEGER
  );
  let endLineNumber = _.clamp(
    _.toInteger(end || "1"),
    startLineNumber,
    Number.MAX_SAFE_INTEGER
  );
  path = path || "";
  return {
    path,
    selection: {
      startLineNumber,
      endLineNumber,
    },
  };
}

export function encodeFileHash({
  path = "",
  selection: { startLineNumber = 1, endLineNumber = 1 } = {},
}) {
  if (endLineNumber === startLineNumber) {
    if (startLineNumber === 1) {
      return `${path}`;
    }
    return `${path}@L${startLineNumber}`;
  }
  return `${path}@L${startLineNumber}-L${endLineNumber}`;
}
