import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles.css";
import React from "react";

import Navbar from "./tools/Navbar";
import Home from "./pages/Home";
import PlantProfiles from "./pages/PlantProfiles";
import Stats from "./pages/Stats";

export default function App() {
  const testPlant = {
    id: 1,
    name: 'Sunflower',
    summary: 'This is information about sunflowers.',
    imageLink: 'https://t4.ftcdn.net/jpg/02/25/12/33/360_F_225123378_iAHgUsACXnqBQIBjXNeBrC71RNEPgqUF.jpg',
    stats: {
      moisture: 'Good',
      waterLevel: '80%',
      temp: 73,
      nitrogen: 1,
      phosphorus: 2,
      potassium: 3,
    }
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plant-profiles" element={<PlantProfiles plant={testPlant} />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </Router>
  );
}
