import "./styles.css";
import React from "react";

export default function SensorData() {
  return (
    <div>
      <body>
        <p>Water Level: <span id="water_level"></span></p>
        <p>Moisture Level: <span id="moisture_level"></span></p>
      </body>
    </div>
  );
}
