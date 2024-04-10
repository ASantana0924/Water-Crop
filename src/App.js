import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./styles.css";
import React from "react";

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
  const location = useLocation();

  return (
    <>
      <Routes>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPass />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/plant-profiles/:id" element={<PlantProfiles/>} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/add-plant/:dynamicValue" element={<AddPlant />} />
        <Route path="/bluetooth" element={<Bluetooth />}/>
      </Routes>
    </>
  );
}
