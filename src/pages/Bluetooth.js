import React, { useState } from "react";

export default function Bluetooth () {
    const [wifiInfo, setWifiInfo] = useState({
        name: "",
        password: ""
    });
    const [connectionResult, setConnectionResult] = useState();


    const handleSubmit = (event) => {
        event.preventDefault();

        setWifiInfo({
            name: event.target.wifiName.value, 
            password: event.target.wifiPassword.value
        });

        console.log(wifiInfo);

        //TODO: Figure out how to establish socket connection upon submission, maybe using python
        if (wifiInfo.name != "" && wifiInfo.password != "") {
            setConnectionResult("paired");
        }
        else {
            setConnectionResult("failed");
        }
    }

    function userFeedback() {
        if (connectionResult == "paired") {
            return (
                <h2>Connection successful</h2>
            );
        }
        else if (connectionResult == "failed") {
            return (
                <h2>Connection unsuccessful</h2>
            );
        }
    }

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
                </li>
            </ol>
            {userFeedback()}
        </div>
    )

}