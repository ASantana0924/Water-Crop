import "../styles.css";
import React, { useState, useEffect } from "react";
import "./PlantProfiles.css";
import { RTDBRef } from "../firebase/firebase";
import { onValue } from "firebase/database";


export default function PlantProfiles({ plant, updatePlant, history, updateHistory}) {
    // Initialize useState variables for plant profile page
    const [chartData, setChartData] = useState("Moisture");

    useEffect(() => {
        // Listen for changes in the database
        const unsubscribe = onValue(RTDBRef, (snapshot) => {
            // Update plant object attributes with live data

            let waterLevelString = "Empty";
            if (snapshot.val().water_level) {
                waterLevelString = "Full";
            }

            const moisture = snapshot.val().moisture;
            let moistureString = "No Soil";
            if (moisture <= 17000 && moisture > 15000) {
                moistureString = "Low";
            }
            else if (moisture <= 15000 && moisture > 11000) {
                moistureString = "Good";
            }
            else if (moisture <= 11000 && moisture > 9000) {
                moistureString = "High";
            }
            else if (moisture <= 9000) {
                moistureString = "In Water";
            }

            updatePlant(prevPlant => ({
                ...prevPlant,
                stats: {
                    ...prevPlant.stats,
                    moisture: moistureString,
                    waterLevel: waterLevelString,
                    temp: snapshot.val().temperature,
                    nitrogen: snapshot.val().nitrogen,
                    phosphorus: snapshot.val().phosphorus,
                    potassium: snapshot.val().potassium
                }
            }));

            const data = {
                time: snapshot.val().time, 
                moistureString: moistureString,
                moistureNum: snapshot.val().moisture,
                waterLevel: waterLevelString
            };

            updateHistory(prevHistory => [data, ...prevHistory])
        });
 
        // Clean up the listener when the component unmounts
        return () => {
            unsubscribe();
        };
    }, []);

    function renderTableValues() {
        if (chartData == "Moisture") {
            return(
                <tbody>
                    {history.map((entry)=>
                        <tr>
                            <td>{entry.time}</td>
                            <td>{entry.moistureString} - {entry.moistureNum}</td>
                        </tr>
                    )}
                </tbody>
            );
        }
        else if (chartData == "Water Level") {
            return(
                <tbody>
                    {history.map((entry)=>
                        <tr>
                            <td>{entry.time}</td>
                            <td>{entry.waterLevel}</td>
                        </tr>
                    )}
                </tbody>
            );
        }
        else {
            return(
                <tbody>
                    <tr>
                        <td>No Data Yet</td>
                        <td>No Data Yet</td>
                    </tr>
                </tbody>
            )
        }
    }


    // Render plant profile page
    return (
        <div className="PlantProfile">
            <div className="PlantInfo">
                <div className="PlantText">
                    <h1>Plant {plant.id}: {plant.name} </h1>
                    <h2>Description: {plant.summary} </h2>
                    <div className="HomeButton">
                        <button onClick={() => returnHome()}>Home</button>
                    </div>
                </div>
                <div className="PlantImage">
                    <img src={plant.imageLink} alt="plant"/>
                </div>
            </div>

            <div className="StatsTabs">
                <h1>Live Stats:</h1>
                <div class="tabs">
                    <button class="tablinks" onClick={() => setChartData("Moisture")} autofocus>Moisture: {plant.stats.moisture}</button>
                    <button class="tablinks" onClick={() => setChartData("Water Level")} >Water Level: {plant.stats.waterLevel}</button>
                    <button class="tablinks" onClick={() => setChartData("Temperature")}>Temp: {plant.stats.temp}</button>
                </div>
                <div class="tabs">
                    <button class="tablinks" onClick={() => setChartData("Nitrogen")}>Nitrogen: {plant.stats.nitrogen}</button>
                    <button class="tablinks" onClick={() => setChartData("Phosphorus")}>Phosphorus: {plant.stats.phosphorus}</button>
                    <button class="tablinks" onClick={() => setChartData("Potassium")}>Potassium: {plant.stats.potassium}</button>
                </div>
                <h1>{chartData} History:</h1>
                <div className="Table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        {renderTableValues()}
                    </table>
                </div>
            </div>
        </div>
    );
}