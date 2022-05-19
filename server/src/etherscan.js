const _ = require("lodash");
const axios = require("axios");
const { ETH_NETWORK_NAME, ETHERSCAN_API_KEY } = require("./config");

const API_MODULES = {
  contract: {
    getsourcecode: "getsourcecode",
  },
};

const API_URL = {
  ropsten: "https://api-ropsten.etherscan.io",
  kovan: "https://api-kovan.etherscan.io",
  rinkeby: "https://api-rinkeby.etherscan.io",
  mainnet: "https://api.etherscan.io",
}[ETH_NETWORK_NAME];

const apiClient = axios.create({
  baseURL: API_URL,
});
// apiClient.interceptors.request.use(req => {
//   console.log("API ->", req.method, req.baseURL)
//   return req
// })
// apiClient.interceptors.response.use(res => {
//   console.log("<- API", res.status, res.request.method, res.request)
//   return res
// })

async function getSource({ address }) {
  return apiClient.get("/api", {
    params: {
      address,
      module: "contract",
      action: "getsourcecode",
      apikey: ETHERSCAN_API_KEY,
    },
  });
}

exports = module.exports = {
  getSource,
};
