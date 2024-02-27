//import "../styles.css";
import React, { useState, useEffect } from "react";
import "./PlantProfiles.css";
import { auth, realtimeDatabase, RTDBRef } from "../firebase/firebase";
import { onValue, ref } from "firebase/database";
import ProgressBar from "../tools/ProgressBar";
import { useNavigate, useParams } from 'react-router-dom';
import Chart from "../tools/Chart";


export default function PlantProfiles() {
    let navigate = useNavigate();
    const params = useParams();

    const [plantProfiles, setPlantProfiles] = useState(() => JSON.parse(localStorage.getItem('plantProfiles')) || []);

    // Initialize useState variables for plant profile page
    const [moisturePercentage, setMoisturePercentage] = useState(0);
    const [waterPercentage, setWaterPercentage] = useState(0);
    const [temperaturePercentage, setTemperaturePercentage] = useState(0);
    const [PHPercentage, setPHPercentage] = useState(0);
    const [UID, setUID] = useState(0);

    const returnHome = () => {
        let path = '/home';
        navigate(path);
    }

    // useEffect(() => {
    //     if (auth.currentUser !== null) {
    //         setUID(auth.currentUser.uid);
    //     }
    //     console.log(UID)
    // }, [auth]);
    
    // const refPath = UID + '/' + params.id + '/';
    // console.log(refPath);

    // const RTDBRef = ref(realtimeDatabase, refPath);

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

            // updatePlant(prevPlant => ({
            //     ...prevPlant,
            //     stats: {
            //         ...prevPlant.stats,
            //         moisture: moistureString,
            //         waterLevel: waterLevelString,
            //         temp: snapshot.val().temperature,
            //         pH: snapshot.val().pH,
            //     }
            // }));

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

            // updateHistory(prevHistory => [data, ...prevHistory])
        });
 
        // Clean up the listener when the component unmounts
        return () => {
            unsubscribe();
        };
    }, []);


    // Render plant profile page
    // ** After <h2> - was giving error 
    //<div className="HomeButton">
    //  <button onClick={() => returnHome()}>Home</button>
    //</div>
    return (
        <div className="PlantProfile">
            <div className="PlantInfo">
                <div className="PlantImage">
                    <img src={plantProfiles[params.id].imageLink} alt="plant"/>
                </div>
                <div className="PlantText">
                    <h1>Plant {Number(params.id) + 1}: {plantProfiles[params.id].name} </h1>
                    <p>Description: {plantProfiles[params.id].summary} </p>
                    <div className="HomeButton">
                        <button onClick={() => returnHome()}>Home</button>
                    </div>
                </div>
                
            </div>

            <div className="StatsTabs">
                <h1>Live Stats:</h1>
                <div class="meters">
                    <div className="data">
                        <h2>Moisture</h2>
                        <ProgressBar percentage={moisturePercentage} color={"#90EE90"} text=""/>
                    </div>
                    <div className="data">
                        <h2>Water Level</h2>
                        <ProgressBar percentage={waterPercentage} color={"#90EE90"} text=""/>
                    </div>
                    <div className="data">
                        <h2>Temperature</h2>
                        <ProgressBar percentage={temperaturePercentage} color={"#FF9b5f"} text=" F"/>
                    </div>
                    <div className="data">
                        <h2>pH</h2>
                        <ProgressBar percentage={PHPercentage} color={"#FEFF99"}/>
                    </div>                    
                </div>
                <div className="chart">
                    <Chart />
                </div>
            </div>

        </div>
    );
}