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
    
    return (
        <div className="App">
            <body>
                <p className="statistics">Plant Statistics:</p>
                <p>Water Level: {waterLevel} <span id="water_level"></span></p>
                <p>Moisture Level: {moistureLevel} <span id="moisture_level"></span></p>
                <button onClick={refreshData}>Refresh Data</button>
            </body>
        </div>
  );
}