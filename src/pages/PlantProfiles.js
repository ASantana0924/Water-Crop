import "../styles.css";
import React, { useState, useEffect } from "react";
import "./PlantProfiles.css";
import { realtimeDatabase, RTDBRef } from "../firebase/firebase";
import { onValue, set } from "firebase/database";

export default function PlantProfiles() {

    // Initialize plant object
    const [plant, setPlant] = useState({
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
    });

    const [chartData, setChartData] = useState("Moisture Data");
    const [newMoisture, setNewMoisture] = useState();
    const [newWaterLevel, setNewWaterLevel] = useState();

    function GetRealtimeData() {
        onValue(RTDBRef, (snapshot) => {
            setNewMoisture(snapshot.val().moisture);
            
            if (snapshot.val().water_level) {
                setNewWaterLevel("Full");
            }
            else {
                setNewWaterLevel("Empty");
            }

            console.log(newMoisture);
           
            setPlant(prevPlant => ({
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
        const interval = setInterval(GetRealtimeData, 3000);
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