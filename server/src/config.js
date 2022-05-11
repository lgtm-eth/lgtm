require("dotenv").config(); // this is a no-op in firebase
const _ = require("lodash");
const DEFAULTS = {
  ETH_RPC_URL: "https://eth-rinkeby.alchemyapi.io/v2/...",
  ETH_NETWORK_NAME: "rinkeby",
  ETHERSCAN_API_KEY: "...",
};

// NOTE: firebase config must be lowercase, so this uppercases them all
const FIREBASE_CONFIG = !process.env.FIREBASE_CONFIG
  ? {}
  : _.pick(
      _.mapKeys(require("firebase-functions").config().env || {}, (v, k) =>
        k.toUpperCase()
      ),
      _.keys(DEFAULTS)
    );

// This looks for values in this order:
//  1. firebase config
//  2. process.env
//  3. DEFAULTS
//
exports = module.exports = _.assign({}, DEFAULTS, process.env, FIREBASE_CONFIG);
