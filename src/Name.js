import "./styles.css";
import React from "react";

export default function Name() {
  return (
    <div>
      <h1> Welcome to WaterCrop!</h1>
      <body>
        <p>Water Level: <span id="water_level"></span></p>
        <p>Moisture Level: <span id="moisture_level"></span></p>
      </body>
    </div>
  );
}
