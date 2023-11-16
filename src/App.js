import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./styles.css";
import React from "react";

import Navbar from "./tools/Navbar";
import Home from "./pages/Home";
import PlantProfiles from "./pages/PlantProfiles";
import Stats from "./pages/Stats";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

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
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  // Define an array of paths where you want to display the Navbar
  const showNavbarPaths = ["/home", "/plant-profiles", "/stats"];

  // Check if the current path is in the array of paths where Navbar should be displayed
  const shouldShowNavbar = showNavbarPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/plant-profiles" element={<PlantProfiles />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </>
  );
}
