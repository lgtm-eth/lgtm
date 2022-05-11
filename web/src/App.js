import React from "react";
import { Routes, Route } from "react-router-dom";
import Address from "./pages/Address";
import Splash from "./pages/Splash";

// Pages

function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/address/:address" element={<Address />} />
      {/* TODO: */}
      {/*<Route path="/tx/:tx" element={<Transaction />} />*/}
      <Route path="*" element={<Splash />} />
    </Routes>
  );
}

export default App;
