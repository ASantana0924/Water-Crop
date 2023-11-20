import "../styles.css";
import React, { useState, useEffect } from "react";
import "./PlantProfiles.css";
import { realtimeDatabase, RTDBRef } from "../firebase/firebase";
import { onValue, set } from "firebase/database";

export default function PlantProfiles({ plant, updatePlant }) {

    const [chartData, setChartData] = useState("Moisture Data");
    const [newMoisture, setNewMoisture] = useState();
    const [newWaterLevel, setNewWaterLevel] = useState();

    function updateValues() {
        onValue(RTDBRef, (snapshot) => {
            updatePlant(prevPlant => ({
                ...prevPlant,
                stats: {
                    ...prevPlant.stats,
                    moisture: snapshot.val().moisture,
                    waterLevel: snapshot.val().water_level,
                }
            }));
        });
    }

    useEffect(() => {
        const interval = setInterval(updateValues, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="PlantProfile">
            <h1>Plant Profile</h1>
            <div className="PlantInfo">
                <div className="PlantText">
                    <h1>Plant {plant.id}: {plant.name} </h1>
                    <h2>Description: {plant.summary} </h2>
                </div>
                <div className="PlantImage">
                    <img src={plant.imageLink} alt="plant"/>
                </div>
            </div>

            <div className="StatsTabs">
                <h1>Live Stats:</h1>
                <div class="tabs">
                    <button class="tablinks" onClick={() => setChartData("Moisture Data")} autofocus>Moisture: {plant.stats.moisture}</button>
                    <button class="tablinks" onClick={() => setChartData("Water Level Data")} >Water Level: {plant.stats.waterLevel}</button>
                    <button class="tablinks" onClick={() => setChartData("Temperature Data")}>Temp: {plant.stats.temp}</button>
                </div>
                <div class="tabs">
                    <button class="tablinks" onClick={() => setChartData("Nitrogen Data")}>Nitrogen: {plant.stats.nitrogen}</button>
                    <button class="tablinks" onClick={() => setChartData("Phosphorus Data")}>Phosphorus: {plant.stats.phosphorus}</button>
                    <button class="tablinks" onClick={() => setChartData("Potassium Data")}>Potassium: {plant.stats.potassium}</button>
                </div>
                <h1>History:</h1>
                <div className="Chart">
                    <h2>{chartData} Chart</h2>
                </div>
            </div>
        </div>
    );
}