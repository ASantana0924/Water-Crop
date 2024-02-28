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
    const [moistureValue, setMoistureValue] = useState(0);
    const [waterValue, setWaterValue] = useState(0);
    const [temperatureValue, setTemperatureValue] = useState(0);
    const [PHValue, setPHValue] = useState(0);
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
        
            setMoistureValue(snapshot.val().moisture);
            setWaterValue(snapshot.val().water_level);
            setTemperatureValue(snapshot.val().temperature);
            setPHValue(snapshot.val().pH);
        });
 
        // Clean up the listener when the component unmounts
        return () => {
            unsubscribe();
        };
    }, []);

    function getWaterString() {
        if (waterValue) {
            return("Full");
        }
        else {
            return("Empty")
        }
    }

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
                        <ProgressBar statValue={moistureValue} statType={"moisture"} plantName={plantProfiles[params.id].name}/>
                        <h2 class="value">{moistureValue}%</h2>
                    </div>
                    <div className="data">
                        <h2>Water Level</h2>
                        <ProgressBar statValue={waterValue} statType={"water"} plantName={plantProfiles[params.id].name}/>
                        <h2 class="value">{getWaterString()}</h2>
                    </div>
                    <div className="data">
                        <h2>Temperature</h2>
                        <ProgressBar statValue={temperatureValue} statType={"temperature"} plantName={plantProfiles[params.id].name}/>
                        <h2 class="value">{temperatureValue}°F</h2>
                    </div>
                    <div className="data">
                        <h2>pH</h2>
                        <ProgressBar statValue={PHValue} statType={"ph"} plantName={plantProfiles[params.id].name}/>
                        <h2 class="value">{PHValue}</h2>
                    </div>
                </div>
                <Chart/>
            </div>

            

        </div>
    );
}