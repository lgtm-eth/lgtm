import React from "react";
import { Routes, Route, useParams, Navigate } from "react-router-dom";
//import About from "./pages/About";
import Splash from "./pages/Splash";

// EIP-3091 https://eips.ethereum.org/EIPS/eip-3091
import Block from "./pages/Block";
import Transaction from "./pages/Transaction";
import Address from "./pages/Address";
import Token from "./pages/Token";

function ParamRedirect({ to }) {
  let params = useParams();
  return <Navigate to={to(params)} />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route
        path="/address/:address/code"
        element={<ParamRedirect to={({ address }) => `/address/${address}`} />}
      />

      {/* These implement EIP-3091 - https://eips.ethereum.org/EIPS/eip-3091 */}
      <Route path="/block/:block" element={<Block />} />
      <Route path="/tx/:tx" element={<Transaction />} />
      <Route path="/address/:address" element={<Address />} />
      <Route path="/token/:token" element={<Token />} />

      {/* TODO: */}
      {/*<Route path="/about" element={<About />} />*/}
      <Route path="*" element={<Splash />} />
    </Routes>
  );
}

export default App;
