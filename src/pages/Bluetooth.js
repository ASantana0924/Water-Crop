import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { auth } from "../firebase/firebase";

export default function Bluetooth () {
    let navigate = useNavigate();
    const [userUID, setUserUID] = useState();
    const [wifiInfo, setWifiInfo] = useState({
        id: "",
        name: "",
        password: ""
    });
    const [connectionResult, setConnectionResult] = useState();

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
            id: userUID,
            name: event.target.wifiName.value, 
            password: event.target.wifiPassword.value
        });

        console.log(wifiInfo);

        //TODO: Figure out how to establish socket connection upon submission, maybe using python
        if (wifiInfo.name != "" && wifiInfo.password != "") {
            const wifiInfoString = userUID + " " + wifiInfo.name + " " + wifiInfo.password;
            console.log(wifiInfoString);
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

            setTimeout(() => {navigate(`/add-plant/${dynamicValue}`);}, 2000);
            return (
                <h2>Connection Successful! <br></br>
                Redirecting to Plant Selection Page...</h2>
            );
        }
        else if (connectionResult == "failed") {
            return (
                <h2>Connection Unsuccessful <br></br>
                Try Again</h2>
            );
        }
    }

    // function runBluetoothServer() {
    //     const path = "../../socket/BluetoothServer.py"
    //     let args = wifiInfo.id + " " + wifiInfo.name + " " + wifiInfo.password;
    //     const bluetoothServer = spawn('python', [path].concat(args));
    // }

    return (
        <div className="PairingBox">
            <h1>Connect to WaterCrop:</h1>
            <ol>
                <li>Open bluetooth settings on your current device</li>
                <li>Select "raspberrypi" under discovered devices and wait for connection to be established</li>
                <li>Enter the Wi-fi network name and password for the network that the WaterCrop will be using below
                    <br></br>
                    <form onSubmit={handleSubmit}>
                        <label for="Wifi Name">Wi-fi Network Name:
                        <input type="text" name="wifiName" value={wifiInfo.name} onChange={(e) => setWifiInfo({...wifiInfo, name: e.target.value})} placeholder="..."></input>
                        </label>
                        <br></br>
                        <label for="Wifi Password">Wi-fi Network Password:
                        <input type="text" name="wifiPassword" value={wifiInfo.password} onChange={(e) => setWifiInfo({...wifiInfo, password: e.target.value})} placeholder="abc123"></input>
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