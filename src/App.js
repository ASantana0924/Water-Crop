import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles.css";
import React from "react";

import Navbar from "./tools/Navbar";
import Home from "./pages/Home";
import PlantProfiles from "./pages/PlantProfiles";
import Stats from "./pages/Stats";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plant-profiles" element={<PlantProfiles />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </Router>
  );
}
