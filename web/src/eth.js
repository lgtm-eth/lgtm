// import WalletConnectProvider from "@walletconnect/web3-provider";
// import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useQuery } from "react-query";

// To avoid init during SSR
const isBrowser = typeof window !== "undefined";

// const providerOptions = {
//   walletconnect: {
//     package: WalletConnectProvider,
//     options: {
//       rpc: {
//         rinkeby: {
//           4: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_KEY}`,
//         },
//         mainnet: {
//           1: `https://eth-mainnet.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_KEY}`,
//         },
//       }[process.env.REACT_APP_ETH_NETWORK_NAME],
//     },
//   },
// };
//
// let _web3Modal = null;
// if (isBrowser) {
//   _web3Modal = new Web3Modal({
//     network: process.env.REACT_APP_ETH_NETWORK_NAME,
//     cacheProvider: true,
//     disableInjectedProvider: false,
//     providerOptions, // required
//   });
// }

let _alchemyProvider = null;
if (isBrowser) {
  _alchemyProvider = new ethers.providers.AlchemyWebSocketProvider(
    process.env.REACT_APP_ETH_NETWORK_NAME,
    process.env.REACT_APP_ALCHEMY_KEY
  );
}

let _current = null;
if (isBrowser) {
  _current = {
    provider: _alchemyProvider,
    signer: null, // until connected
  };
}

export function useLookupAddress(address) {
  const { data } = useQuery(
    ["lookupAddress", address],
    () => _current.provider.lookupAddress(address),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      staleTime: 30000,
    }
  );
  return data;
}