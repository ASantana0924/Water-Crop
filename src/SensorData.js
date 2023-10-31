import "./styles.css";
import React, { useState, useEffect } from "react";

export default function SensorData() {
    const [waterLevel, setWaterLevel] = useState("");
    const [moistureLevel, setMoistureLevel] = useState("");    
    useEffect(() => {
    fetch("http://localhost:8000/data")
        .then((res) => res.json())
        .then((data) => {
            setWaterLevel(data.waterLevel);
            setMoistureLevel(data.moistureLevel);
        })
    }, []);
    
    return (
        <div className="App">
            <body>
                <p>Water Level: {waterLevel} <span id="water_level"></span></p>
                <p>Moisture Level: {moistureLevel} <span id="moisture_level"></span></p>
            </body>
        </div>
  );
}