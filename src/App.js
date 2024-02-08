import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./styles.css";
import React , { useState, useCallback } from "react";
import Navbar from "./tools/Navbar";
import Home from "./pages/Home";
import PlantProfiles from "./pages/PlantProfiles";
import Stats from "./pages/Stats";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ForgotPass from "./pages/ForgotPass";
import AddPlant from "./pages/AddPlant.js"
import Bluetooth from "./pages/Bluetooth";

export default function App() {
  return (
    <Router>
      <AppContent/>
    </Router>
  );
}

function AppContent() {

  // Initialize plant object
  const [plant, setPlant] = useState({
    id: 1,
    name: 'Hibiscus',
    summary: "Colorful flowering plant often associated with tropical regions.",
    imageLink:  "https://ih1.redbubble.net/image.3463415596.8180/raf,360x360,075,t,fafafa:ca443f4786.jpg",
    stats: {
      moisture: 'Loading...',
      waterLevel: 'Loading...',
      temp: 'Loading...',
      pH: 'Loading...',
    }
  });

  const [history, setHistory] = useState([]);

  const updatePlant = useCallback(val => {
    setPlant(val);
  }, [setPlant]);

  const updateHistory = useCallback(val => {
    setHistory(val);
  }, [setHistory]);

  const location = useLocation();

  // Define an array of paths where you want to display the Navbar
  const showNavbarPaths = ["/home", "/plant-profiles", "/stats"];

  // Check if the current path is in the array of paths where Navbar should be displayed
  const shouldShowNavbar = showNavbarPaths.includes(location.pathname);

  return (
    <>
      {/* {shouldShowNavbar && <Navbar />} */}
      <Routes>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPass />} />
        <Route path="/home" element={<Home updatePlant={updatePlant}/>} />
        <Route path="/plant-profiles" element={<PlantProfiles 
          plant={plant} 
          updatePlant={updatePlant} 
          history={history} 
          updateHistory={updateHistory}
          />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/add-plant/:dynamicValue" element={<AddPlant />} />
        <Route path="/bluetooth" element={<Bluetooth />}/>
      </Routes>
    </>
  );
}
