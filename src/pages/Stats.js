import "../styles.css";
import React, { useState, useEffect } from "react";

export default function Stats() {
    const [waterLevel, setWaterLevel] = useState("");
    const [moistureLevel, setMoistureLevel] = useState("");

    const refreshData = async () => {
        const response = await fetch("http://localhost:8000/data");
        const data = await response.json();
    
        setWaterLevel(data.waterLevel);
        setMoistureLevel(data.moistureLevel);
    };

    // useEffect hook to call the refreshData function every 0.5 seconds
    useEffect(() => {
        const interval = setInterval(refreshData, 500);
        return () => clearInterval(interval);
    }, []);

    // Conditional statement to display different text based on water level
    const waterLevelText = waterLevel === 0
    ? "No water present"
    : "Water present";

    // Conditional statements to display different text based on moisture level
    const moistureLevelText = moistureLevel >= 15000
        ? "No soil detected"
        : moistureLevel >= 12000
            ? "Soil is too dry"
            : moistureLevel >= 8000
                ? "Soil has a good amount of water"
                : "Soil has too much water";
    
    return (
        <div className="App">
            <body>
                <p className="statistics">Plant Statistics:</p>
                <p>Water Level: {waterLevelText} <span id="water_level"></span></p>
                <p>Moisture Level: {moistureLevelText} <span id="moisture_level"></span></p>
            </body>
        </div>
  );
}