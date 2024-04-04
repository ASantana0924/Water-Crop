import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { auth } from "../firebase/firebase";

export default function Bluetooth () {
    let navigate = useNavigate();

    const [plantProfiles, setPlantProfiles] = useState(() => JSON.parse(localStorage.getItem('plantProfiles')) || []);
    const [userUID, setUserUID] = useState();

    const [wifiInfo, setWifiInfo] = useState({
        uid: "",
        plantNumber: plantProfiles["length"].toString(),
        name: "",
        password: ""
    });

    const [connectionResult, setConnectionResult] = useState();

    //console.log(wifiInfo);

    // aruiz3@ufl.edu UID: xprguFXnDjUFshZFg88TE6L2TZ52

    useEffect(() => {
        if (auth.currentUser !== null) {
            setUserUID(auth.currentUser.uid);
        }
    }, [auth.currentUser]);

    // navigate back to the home page
    const handleGoBack = () => {
        navigate('/home');
    };


    const handleSubmit = (event) => {
        event.preventDefault();

        setWifiInfo({
            uid: userUID,
            plantNumber: plantProfiles["length"].toString(),
            name: event.target.wifiName.value, 
            password: event.target.wifiPassword.value
        });

        updateJSON();

        //console.log(wifiInfo);

        if (wifiInfo.name != "" && wifiInfo.password != "") {
            setConnectionResult("paired");
        }
        else {
            setConnectionResult("failed");
        }
    }

    // Bug: After redirect, page is submitted/refreshed twice. In order to go back to wifi selection, must click back arrow twice
    function userFeedback() {
        
        if (connectionResult == "paired") {
            const dynamicValue = 'new';
            // Write wifi info to json file that will be read by the bluetooth server that is already running.

            setTimeout(() => {navigate(`/add-plant/${dynamicValue}`);}, 4000);
            return (
                <h2>Connecting WaterCrop device to Wi-Fi  <br></br>
                The WaterCrop device will take a few minutes before sending data.<br></br>
                Redirecting you to Plant Selection Page...</h2>
            );
        }
        else if (connectionResult == "failed") {
            return (
                <h2>Connection Unsuccessful <br></br>
                Try Again</h2>
            );
        }
    }

    async function updateJSON() {
        try {
            const response = await fetch('http://localhost:3000/networkData.json');
            let jsonData = await response.json();

            // Update the data
            jsonData.UID = wifiInfo.uid;
            jsonData.plantNumber = wifiInfo.plantNumber;
            jsonData.networkName = wifiInfo.name;
            jsonData.networkPassword = wifiInfo.password;
            jsonData.go = true;

            // Save the updated JSON back to the local storage
            localStorage.setItem('networkData', JSON.stringify(jsonData));

            console.log("JSON data updated and saved to local storage:", jsonData);
        } catch (error) {
            console.error("Error updating JSON:", error);
        }
    }

    return (
        <div className="PairingBox">
            <h1>Connect to WaterCrop:</h1>
            <ol>
                <li>Connect WaterCrop device to power</li>
                <li>Open bluetooth settings on your current device</li>
                <li>Select "raspberrypi" under discovered devices and wait for connection to be established</li>
                <li>Enter the Wi-fi network name and password for the network that the WaterCrop device will be using below
                    <br></br>
                    <form onSubmit={handleSubmit}>
                        <label for="Wifi Name">Wi-fi Network Name:
                        <input type="text" name="wifiName" value={wifiInfo.name} onChange={(e) => setWifiInfo({...wifiInfo, name: e.target.value})} placeholder="..."></input>
                        </label>
                        <br></br>
                        <label for="Wifi Password">Wi-fi Network Password:
                        <input type="password" name="wifiPassword" value={wifiInfo.password} onChange={(e) => setWifiInfo({...wifiInfo, password: e.target.value})} placeholder="..."></input>
                        </label>
                        <br></br>
                        <button type="submit">Submit</button>
                    </form>
                    <button onClick={handleGoBack}>Cancel</button>
                </li>
            </ol>
            {userFeedback()}
        </div>
    )

}