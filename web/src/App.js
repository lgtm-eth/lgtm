import React from "react";
import { Routes, Route } from "react-router-dom";
import Address from "./pages/Address";
import AddressCode from "./pages/AddressCode";
import Splash from "./pages/Splash";

// Pages

function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      {/* TODO: */}
      {/*<Route path="/" element={<Home />} />*/}
      <Route path="/address/:address" element={<Address />} />
      <Route path="/address/:address/code" element={<AddressCode />} />
      {/*<Route path="/project/:projectId" element={<Project />} />*/}
      {/*<Route path="/reviewer/:reviewerId" element={<Reviewer />} />*/}
      <Route path="*" element={<Splash />} />
    </Routes>
  );
}

export default App;
