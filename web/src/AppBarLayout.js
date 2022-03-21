import { AppBar, Box, Toolbar } from "@mui/material";
import React, { useCallback, useState } from "react";
// import WalletConnectProvider from "@walletconnect/web3-provider";
// import Web3Modal from "web3modal";
// import { ethers } from "ethers";
import _ from "lodash";
import Eyes from "./Eyes";
import Wordmark from "./Wordmark";

// const providerOptions = {
//   walletconnect: {
//     package: WalletConnectProvider,
//     options: {
//       // TODO: infuraId: "INFURA_ID"
//     },
//   },
// };

// TODO: move all this elsewhere
// let _web3Modal = new Web3Modal({
//   network: process.env.REACT_APP_ETH_NETWORK_NAME,
//   cacheProvider: true,
//   disableInjectedProvider: false,
//   providerOptions, // required
// });

// async function attemptLogin() {
//   let _web3Modal = new Web3Modal({
//     network: "mainnet",
//     cacheProvider: true,
//     disableInjectedProvider: false,
//     providerOptions: {
//       walletconnect: {
//         package: WalletConnectProvider,
//         options: {
//           // TODO: infuraId: "INFURA_ID"
//         },
//       },
//     },
//   });
//   let instance = await _web3Modal.connect();
//   let injectedProvider = new ethers.providers.Web3Provider(instance);
//   let signer = injectedProvider.getSigner();
//   let signerAddress = await signer.getAddress();
//   let domain = {
//     name: "LGTM",
//     // TODO: more meta
//   };
//   let types = {
//     Visitor: [
//       { name: "wallet", type: "address" },
//       { name: "nonce", type: "string" },
//     ],
//     // TODO: more field types
//   };
//   let sig = await signer._signTypedData(domain, types, {
//     wallet: signerAddress,
//     nonce: "foobar",
//   });
//
//   // TODO: this server side
//   // let's see if it matches:
//   let verifiedAddress = ethers.utils.verifyTypedData(
//     domain,
//     types,
//     {
//       wallet: signerAddress,
//       nonce: "foobar",
//     },
//     sig
//   );
//   console.log({
//     sig,
//     verifiedAddress,
//     signerAddress,
//     match: verifiedAddress === signerAddress,
//   });
// }
// function login() {
//   return attemptLogin().catch((err) => console.log(err));
// }

export default function AppBarLayout({ children }) {
  let [eyes, setEyes] = useState({ clientX: 0, clientY: 0 });
  // eslint-disable-next-line
  let updateEyes = useCallback(
    _.throttle(setEyes, 5, { leading: true, trailing: true }),
    [setEyes]
  );
  return (
    <div
      style={{ paddingTop: 72 }}
      onTouchMove={(e) =>
        updateEyes({
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY,
        })
      }
      onMouseMove={(e) =>
        updateEyes({
          clientX: e.clientX,
          clientY: e.clientY,
        })
      }
    >
      <AppBar enableColorOnDark>
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", flex: "auto" }}>
            <Eyes {...eyes} size={0.4} sx={{ mr: 2 }} />
            <Wordmark height={48} />
          </Box>
          {/* TODO */}
          {/*<Button color="inherit" variant="outlined" onClick={login}>*/}
          {/*  Login*/}
          {/*</Button>*/}
        </Toolbar>
      </AppBar>
      <main style={{ minHeight: "100vh" }}>
        <div style={{ minHeight: "50vh" }}>{children}</div>
        <div style={{ width: "85%", marginLeft: "auto", marginRight: "auto" }}>
          <hr style={{ borderColor: "#333" }} />
          <div style={{ color: "#999" }}>
            <p style={{ float: "left" }}>© 2022 McCartney, LLC</p>
            <p style={{ float: "right" }}>
              <span>
                <a
                  style={{ textDecoration: "none", color: "inherit" }}
                  href="/privacy"
                >
                  Privacy
                </a>
              </span>
              <span style={{ marginLeft: 30 }}>
                <a
                  style={{ textDecoration: "none", color: "inherit" }}
                  href="/terms"
                >
                  Terms
                </a>
              </span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
