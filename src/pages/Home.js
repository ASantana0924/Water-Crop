import React, { useState, useEffect } from 'react';
import '../styles.css';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  let navigate = useNavigate();
  const [plantProfiles, setPlantProfiles] = useState(() => JSON.parse(localStorage.getItem('plantProfiles')) || []);

  useEffect(() => {
    localStorage.setItem('plantProfiles', JSON.stringify(plantProfiles));
  }, [plantProfiles]);

  const handleAddPlant = () => {
    if (plantProfiles.length < 3) {
      const newPlant = {
        id: plantProfiles.length + 1,
        name: 'Sunflower',
        summary: 'This is information about sunflowers.',
        imageLink: 'https://t4.ftcdn.net/jpg/02/25/12/33/360_F_225123378_iAHgUsACXnqBQIBjXNeBrC71RNEPgqUF.jpg',
        stats: {
          moisture: 'Good',
          waterLevel: '80%',
          temp: 73,
          nitrogen: 1,
          phosphorus: 2,
          potassium: 3,
        },
      };

      setPlantProfiles((prevProfiles) => [...prevProfiles, newPlant]);
    } else {
      alert('Maximum of 3 plants allowed.');
    }
  };

  const handleEditPlant = (plantIndex) => {
    console.log('Editing plant:', plantIndex);
  };

  const handleDeletePlant = (plantIndex) => {
    const updatedPlantProfiles = plantProfiles.filter((plant, index) => index !== plantIndex);
    setPlantProfiles(updatedPlantProfiles);
  };

  const handleStatsPlant = (plantIndex) => {
    let path = '/plant-profiles';
    navigate(path);
  };

  return (
    <div className="App">
      <h1 className="Header">Welcome to WaterCrop!</h1>
      <p className="PageDescription">
        This page shows plants connected to your profile, along with options to manage them.
      </p>
      <div className="ButtonContainer">
        <button onClick={handleAddPlant}>Add Plant</button>
      </div>
      <div className="CenterContainer">
        {plantProfiles.map((plant, index) => (
          <div className="Profiles" key={plant.id}>
            <div id="Plant" onClick={() => handleStatsPlant(index)}>
              <p className="Name">{plant.name}</p>
              <img
                src={plant.imageLink}
                alt={plant.name}
                style={{ width: '50%', maxWidth: '400px', height: 'auto', marginTop: '-15px' }}
              />
            </div>
            <p className="Description">{plant.summary}</p>
            <div className="ActionButtons">
              <button onClick={() => handleEditPlant(index)}>Edit</button>
              <button onClick={() => handleDeletePlant(index)}>Delete</button>
            </div>
            <button onClick={() => handleStatsPlant(index)}>View Statistics!</button>
          </div>
        ))}
      </div>
    </div>
  );
}



/* 
import React, { useState } from "react";
import "../styles.css";

export default function Home() {
  // Example state to demonstrate dynamic content
  const [plantData, setPlantData] = useState({
    id: 1,
    name: 'Sunflower',
    summary: 'This is information about sunflowers.',
    imageLink: 'https://t4.ftcdn.net/jpg/02/25/12/33/360_F_225123378_iAHgUsACXnqBQIBjXNeBrC71RNEPgqUF.jpg',
    stats: {
      moisture: 'Good',
      waterLevel: '80%',
      temp: 73,
      nitrogen: 1,
      phosphorus: 2,
      potassium: 3,
    }
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

*/