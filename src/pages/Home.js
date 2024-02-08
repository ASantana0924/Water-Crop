import React, { useState, useEffect } from 'react';
import SearchBar from "./SearchBar";
import { useNavigate } from 'react-router-dom';
import '../styles.css';

export default function Home( {updatePlant} ) {
  let navigate = useNavigate();
  
  const [plantProfiles, setPlantProfiles] = useState(() => JSON.parse(localStorage.getItem('plantProfiles')) || []);
  const [plantEntries, setPlantEntries] = useState([]);
  const [isSearchVisible, setSearchVisibility] = useState(false);

  useEffect(() => {
    fetchPlantEntries();
  }, []);
  
  useEffect(() => {
    localStorage.setItem('plantProfiles', JSON.stringify(plantProfiles));
  }, [plantProfiles]);

  const fetchPlantEntries = async () => {
    try {
      const response = await fetch('./plantProfiles.json');
      const data = await response.json();
      setPlantEntries(data);
    } catch (error) {
      console.error('Error fetching plant entries:', error);
    }
  };

  const handleAddPlant = (plantIndex) => {
    if (plantProfiles.length < 3) {
      setPlantProfiles((prevProfiles) => [...prevProfiles, plantEntries.at(plantIndex)]);
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

  const handleStatsPlant = (plant, plantIndex) => {
    console.log(plant);

    updatePlant(prevPlant => ({
      id: plantIndex,
      name: plant.name,
      summary: plant.summary,
      imageLink: plant.imageLink,
      ...prevPlant
    }));

    let path = '/plant-profiles';
    navigate(path);
  };

  const toggleSearchVisibility = () => {
    setSearchVisibility(!isSearchVisible);
  }

  return (
    <div className="App">
      <h1 className="Header">Welcome to WaterCrop!</h1>
      <p className="PageDescription">
        This page shows plants connected to your profile, along with options to manage them.
      </p>
      <div className="ButtonContainer">
        <button onClick={toggleSearchVisibility}>Add Plant</button>
      </div>
      {isSearchVisible && (
        <SearchBar data={plantEntries} onPlantSelect={handleAddPlant}/>
      )}
      <div className="CenterContainer">
        {plantProfiles.map((plant, index) => (
          <div className="Profiles" key={plant.id}>
            <div id="Plant" onClick={() => handleStatsPlant(plant, index)}>
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
            <button onClick={() => handleStatsPlant(plant, index)}>View Statistics!</button>
          </div>
        ))}
      </div>
    </div>
  );
}
