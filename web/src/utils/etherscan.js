const ETHERSCAN_BASE = {
  mainnet: "https://etherscan.io",
  goerli: "https://goerli.etherscan.io",
}[process.env.REACT_APP_ETH_NETWORK_NAME];

export function etherscanUrl({ address, tx, token, block, a }) {
  if (address) {
    return `${ETHERSCAN_BASE}/address/${address}`;
  }
  if (tx) {
    return `${ETHERSCAN_BASE}/tx/${tx}`;
  }
  if (token) {
    return `${ETHERSCAN_BASE}/token/${token}${a ? `?a=${a}` : ""}`;
  }
  if (block) {
    return `${ETHERSCAN_BASE}/block/${block}`;
  }
  return ETHERSCAN_BASE;
}
