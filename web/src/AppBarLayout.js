import { AppBar, Box, Button, Input, Toolbar, Typography } from "@mui/material";
import React from "react";
import { Camera } from "@mui/icons-material";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

function LogoLGTM(props) {
  // TODO: proper logo image
  return <Camera {...props} />;
}

function WordmarkLGTM(props) {
  // TODO: proper wordmark image
  return (
    <Typography variant="h6" color="inherit" noWrap {...props}>
      LGTM
    </Typography>
  );
}

function AppBarSearchInput() {
  // TODO: stylized app bar search input
  return <Input />;
}

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

async function attemptLogin() {
  let _web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    disableInjectedProvider: false,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          // TODO: infuraId: "INFURA_ID"
        },
      },
    },
  });
  let instance = await _web3Modal.connect();
  let injectedProvider = new ethers.providers.Web3Provider(instance);
  let signer = injectedProvider.getSigner();
  let signerAddress = await signer.getAddress();
  let domain = {
    name: "LGTM",
    // TODO: more meta
  };
  let types = {
    Visitor: [
      { name: "wallet", type: "address" },
      { name: "nonce", type: "string" },
    ],
    // TODO: more field types
  };
  let sig = await signer._signTypedData(domain, types, {
    wallet: signerAddress,
    nonce: "foobar",
  });

  // TODO: this server side
  // let's see if it matches:
  let verifiedAddress = ethers.utils.verifyTypedData(
    domain,
    types,
    {
      wallet: signerAddress,
      nonce: "foobar",
    },
    sig
  );
  console.log({
    sig,
    verifiedAddress,
    signerAddress,
    match: verifiedAddress === signerAddress,
  });
}
function login() {
  return attemptLogin().catch((err) => console.log(err));
}

export default function AppBarLayout({ children }) {
  return (
    <div style={{ paddingTop: 72 }}>
      <AppBar enableColorOnDark>
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", flex: "auto" }}>
            <LogoLGTM sx={{ mr: 2 }} />
            <WordmarkLGTM sx={{ mr: 2 }} />
            <AppBarSearchInput />
          </Box>
          <Button color="inherit" variant="outlined" onClick={login}>
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <main>{children}</main>
    </div>
  );
}
