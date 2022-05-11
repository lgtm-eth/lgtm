const { STORAGE_BUCKET_NAME } = require("./config");
const admin = require("firebase-admin");
admin.initializeApp();

async function save(
  fileName,
  stringContent,
  cacheControl = "private, max-age=0, no-transform"
) {
  console.log("saving", fileName);
  let bucket = admin.storage().bucket(STORAGE_BUCKET_NAME);
  let file = bucket.file(fileName);
  console.log("saving as", file.publicUrl());
  await file.save(stringContent, {
    metadata: {
      cacheControl,
    },
  });
}

async function saveJSON(
  fileName,
  obj,
  cacheControl = "private, max-age=0, no-transform"
) {
  let stringContent = JSON.stringify(obj);
  return save(fileName, stringContent, cacheControl);
}

async function download(fileName) {
  console.log("downloading", fileName);
  let bucket = admin.storage().bucket(STORAGE_BUCKET_NAME);
  let res = await bucket.file(fileName).download();
  return res[0];
}

async function downloadJSON(fileName) {
  let content = await download(fileName);
  let text = content.toString("utf8");
  return JSON.parse(text);
}

exports = module.exports = {
  save,
  saveJSON,
  download,
  downloadJSON,
};
