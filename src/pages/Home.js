import React, { useState } from "react";
import "../styles.css";

export default function Home() {
  // Example state to demonstrate dynamic content
  const [plantData, setPlantData] = useState({
    name: "Sunflower",
    description: "Plant 1: Sunflower",
    imageUrl: `${process.env.PUBLIC_URL}/images/sunflower.jpg`,
  });

  // A function can use "setPlantData" to change the plantData
  return (
    <div className="App">
      <h1 className="Header">Welcome to WaterCrop!</h1>
      <p className="PageDescription">This page shows plants connected to your profile, along with an option to update the plant.</p>
      <div className="ButtonContainer">
        <button onClick={() => handleAddPlant()}>Add Plant</button>
        <button onClick={() => handleEditPlant()}>Edit Plant</button>
      </div>
      <div className="CenterContainer">
        <div className="Profiles">
          <p className="Description">{plantData.description}</p>
          <div id="Plant">
            <img src={plantData.imageUrl} alt={plantData.name} />
          </div>
          <button onClick={() => handleStatsPlant()}>View Statistics!</button>
        </div>
      </div>
    </div>
  );
}

const handleAddPlant = () => {
  // For example, you can update the state or navigate to a different page
  console.log("Adding a new plant!");
};

const handleEditPlant = () => {
  // For example, you can open a modal or navigate to a different page
  console.log("Editing the current plant!");
};

const handleStatsPlant = () => {
  // For example, you can open a modal or navigate to a different page
  console.log("Editing the current plant!");
};