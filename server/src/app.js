require("./config");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const api = require("./api");

const app = express();

app.use(morgan("short"));
app.use(cors());

function onApiRequest(method) {
  return async (req, res) => {
    let input = req.body
    try {
      let output = await method(input)
      return res.status(200).send(output);
    } catch (err) {
      console.log(err)
      return res.status(400).send()
    }
  }
}

Object.keys(api).forEach(method => {
  app.post(`/app/api/${method}`, onApiRequest(api[method]));
});

exports = module.exports = app;
