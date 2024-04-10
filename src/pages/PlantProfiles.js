//import "../styles.css";
import React, { useState, useEffect } from "react";
import "./PlantProfiles.css";
import { auth, realtimeDatabase, RTDBRef, firestoreDatabase } from "../firebase/firebase";
import { onValue, ref } from "firebase/database";
import { collection, addDoc } from "firebase/firestore";
import ProgressBar from "../tools/ProgressBar";
import { useNavigate, useParams } from 'react-router-dom';
import Chart from "../tools/Chart";


export default function PlantProfiles() {
    let navigate = useNavigate();
    const params = useParams();
    const [plantProfiles, setPlantProfiles] = useState(() => JSON.parse(localStorage.getItem('plantProfiles')) || []);
    const firestoreDBRef = collection(firestoreDatabase, 'PlantDataHistory/plant1/stats');

    // Initialize useState variables for plant profile page
    const [dataTime, setDataTime] = useState("");
    const [parsedTime, setParsedTime] = useState("");
    const [moistureValue, setMoistureValue] = useState(0);
    const [waterValue, setWaterValue] = useState(0);
    const [temperatureValue, setTemperatureValue] = useState(0);
    const [PHValue, setPHValue] = useState(0);

    // Variables for historical data
    const [dataCounter, setDataCounter] = useState(0);
    const [moistureSum, setMoistureSum] = useState(0);
    const [waterSum, setWaterSum] = useState(0);
    const [temperatureSum, setTemperatureSum] = useState(0);
    const [pHSum, setpHSum] = useState(0);


    //const [UID, setUID] = useState(0);

    const [averageData, setAverageData] = useState({
        "time" : "",
        "moisture" : 23,
        "water_level" : 0,
        "temperature" : 77,
        "ph" : 7
    });

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
            setDataTime(snapshot.val().time);
            setParsedTime(snapshot.val().parsed_time);
            setMoistureValue(snapshot.val().moisture);
            setWaterValue(snapshot.val().water_level);
            setTemperatureValue(snapshot.val().temperature);
            setPHValue(snapshot.val().pH);
            setDataCounter(snapshot.val().count);

            // Increment sums
            setMoistureSum(sum => sum + snapshot.val().moisture);
            setWaterSum(sum => sum + snapshot.val().water_level);
            setTemperatureSum(sum => sum + snapshot.val().temperature);
            setpHSum(sum => sum + snapshot.val().pH);
        });
 
        // Clean up the listener when the component unmounts
        return () => {
            unsubscribe();
        };
    }, []);

    // Handle counter reaching limit
    useEffect(() => {
        if (dataCounter >= 10) {
    
            // Take average of sums and save in average data
            // setAverageData({
            //     "time" : dataTime,
            //     "parsed_time": parsedTime,
            //     "moisture" : moistureSum / 10.0,
            //     "water_level" : waterValue,
            //     "temperature" : temperatureSum / 10.0,
            //     "ph" : pHSum / 10.0
            // })

            setAverageData({
                "time" : dataTime,
                "parsed_time": parsedTime,
                "moisture" : moistureValue,
                "water_level" : waterValue,
                "temperature" : temperatureValue,
                "ph" : checkPH(PHValue)
            })
    
            // Send values to firebase
            console.log(averageData);
            uploadAverageData();
    
            // Reset sums
            setDataCounter(0);
            setMoistureSum(0);
            setWaterSum(0);
            setTemperatureSum(0);
            setpHSum(0);
        }
    }, [dataCounter]);

    console.log(dataCounter);

    async function uploadAverageData() {
        //const res = await firestoreDatabase.collection('PlantDataHistory/plant1/stats').add(averageData);
        //console.log("Added document with ID: ", res.id);
        const docRef = await addDoc(firestoreDBRef, averageData);
    }

    function getWaterString() {
        if (waterValue) {
            return("Full");
        }
        else {
            return("Empty")
        }
    }

    function checkPH(rawPh) {
        if ((rawPh > 14) || (rawPh < 0)) {
            return (rawPh - 14).toFixed(1);
        }
        else {
            return (rawPh).toFixed(1);
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
                <div className="meters">
                    <div className="data">
                        <h2>Moisture</h2>
                        <ProgressBar statValue={moistureValue} statType={"moisture"} plantName={plantProfiles[params.id].name}/>
                        <h2 
                            className="value">{moistureValue}% <br/>
                        </h2>
                    </div>
                    <div className="data">
                        <h2>Water Level</h2>
                        <ProgressBar statValue={waterValue} statType={"water"} plantName={plantProfiles[params.id].name}/>
                        <h2 className="value">{getWaterString()}</h2>
                    </div>
                    <div className="data">
                        <h2>Temperature</h2>
                        <ProgressBar statValue={temperatureValue} statType={"temperature"} plantName={plantProfiles[params.id].name}/>
                        <h2 className="value">{temperatureValue}°F</h2>
                    </div>
                    <div className="data">
                        <h2>pH</h2>
                        <ProgressBar statValue={checkPH(PHValue)} statType={"ph"} plantName={plantProfiles[params.id].name}/>
                        <h2 className="value">{checkPH(PHValue)}</h2>
                    </div>
                </div>
                <Chart/>
            </div>

            

        </div>
    );
}