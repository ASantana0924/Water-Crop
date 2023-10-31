import "./styles.css";
import React from "react";
import Name from "./Name";
import SensorData from "./SensorData"

export default function App() {
  return (
    <div className="App">
      <Name />
      <SensorData />
    </div>
  );
}
