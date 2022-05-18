import React from "react";
import { Routes, Route, useParams, Navigate } from "react-router-dom";
import Address from "./pages/Address";
import Transaction from "./pages/Transaction";
import Splash from "./pages/Splash";

// Pages

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
      <Route path="/address/:address" element={<Address />} />
      {/* TODO: */}
      <Route path="/tx/:tx" element={<Transaction />} />
      <Route path="*" element={<Splash />} />
    </Routes>
  );
}

export default App;
