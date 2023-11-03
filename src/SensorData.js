import "./styles.css";
import React, { useState, useEffect } from "react";

export default function SensorData() {
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
    const moistureLevelText = moistureLevel >= 520
    ? "Not in soil"
    : moistureLevel >= 430
        ? "Soil is Dry"
        : moistureLevel >= 350
            ? "Soil is Wet"
            : "Submerged in Water";
    
    return (
        <div className="App">
            <body>
                <p className="statistics">Plant Statistics:</p>
                <p>Water Level: {waterLevelText} <span id="water_level"></span></p>
                <p>Moisture Level: {moistureLevel} <span id="moisture_level"></span></p>
            </body>
        </div>
  );
}