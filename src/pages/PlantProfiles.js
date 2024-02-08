//import "../styles.css";
import React, { useState, useEffect } from "react";
import "./PlantProfiles.css";
import { RTDBRef } from "../firebase/firebase";
import { onValue } from "firebase/database";
import { SemiCircleProgress } from "react-semicircle-progressbar";
import ProgressBar from "../tools/ProgressBar";
import { useNavigate } from 'react-router-dom';


export default function PlantProfiles({ plant, updatePlant, history, updateHistory}) {
    let navigate = useNavigate();

    // Initialize useState variables for plant profile page
    const [chartData, setChartData] = useState("Moisture");

    const [moisturePercentage, setMoisturePercentage] = useState(0);
    const [waterPercentage, setWaterPercentage] = useState(0);
    const [temperaturePercentage, setTemperaturePercentage] = useState(0);
    const [PHPercentage, setPHPercentage] = useState(0);

    const returnHome = () => {
        let path = '/home';
        navigate(path);
    }

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
                    pH: snapshot.val().pH,
                }
            }));

            const data = {
                time: snapshot.val().time, 
                moistureString: moistureString,
                moistureNum: snapshot.val().moisture,
                waterLevel: waterLevelString,
                temp: snapshot.val().temperature
            };
        
            setMoisturePercentage(Number(((19000 - snapshot.val().moisture)/19000) * 100).toFixed(1));
            setWaterPercentage(snapshot.val().water_level * 100);
            setTemperaturePercentage((snapshot.val().temperature/100) * 100);
            setPHPercentage(50);

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
        else if (chartData == "Temperature") {
            return(
                <tbody>
                    {history.map((entry)=>
                        <tr>
                            <td>{entry.time}</td>
                            <td>{entry.temp}</td>
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
                    <p>Description: {plant.summary} </p>
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
                    Moisture<ProgressBar percentage={moisturePercentage} color={"#90EE90"} text=""/>
                    Water<ProgressBar percentage={waterPercentage} color={"#90EE90"} text=""/>
                    Temperature<ProgressBar percentage={temperaturePercentage} color={"#90EE90"} text=" F"/>
                    PH<ProgressBar percentage={PHPercentage} color={"#90EE90"}/>
                    {/*
                    <button class="tablinks" onClick={() => setChartData("Moisture")} autofocus>Moisture: {plant.stats.moisture}</button>
                    <button class="tablinks" onClick={() => setChartData("Water Level")} >Water Level: {plant.stats.waterLevel}</button>
                <button class="tablinks" onClick={() => setChartData("Temperature")}>Temp: {plant.stats.temp}</button>*/}
                </div>
                {/*<div class="tabs">
                    <button class="tablinks" onClick={() => setChartData("Nitrogen")}>Nitrogen: {plant.stats.nitrogen}</button>
                    <button class="tablinks" onClick={() => setChartData("Phosphorus")}>Phosphorus: {plant.stats.phosphorus}</button>
                    <button class="tablinks" onClick={() => setChartData("Potassium")}>Potassium: {plant.stats.potassium}</button>
            </div>*/}
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