import React from "react";
import { Routes, Route } from "react-router-dom";
import Address from "./Address";
import Splash from "./Splash";

// Pages

function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      {/* TODO: */}
      {/*<Route path="/" element={<Home />} />*/}
      <Route path="/address/:address" element={<Address />} />
      {/*<Route path="/project/:projectId" element={<Project />} />*/}
      {/*<Route path="/reviewer/:reviewerId" element={<Reviewer />} />*/}
      <Route path="*" element={<Splash />} />
    </Routes>
  );
}

export default App;
