// Home.js
// Bug: new plant appears when the page is refreshed
import React, { useState, useEffect , useRef} from 'react';
import { useNavigate , useLocation } from 'react-router-dom';
import '../styles.css';

export default function Home( {updatePlant} ) {
  let navigate = useNavigate();
  
  const [plantProfiles, setPlantProfiles] = useState(() => JSON.parse(localStorage.getItem('plantProfiles')) || []);
  const { state } = useLocation();
  const [formData, setFormData] = useState({});
  const [isNewPlant, setIsNewPlant] = useState(true);
  const isMounted = useRef(false); 

  useEffect(() => {
    if (state && state.data) {
      setFormData(state.data);
    }
  }, [state]);
  
  useEffect(() => {
    if (isMounted.current) {
      console.log("plant profiles", plantProfiles);
      localStorage.setItem('plantProfiles', JSON.stringify(plantProfiles));
    } else {
      isMounted.current = true;
    }
  }, [plantProfiles]);

  useEffect(() => {
    console.log("Form Data:", formData);
    if (Object.keys(formData).length !== 0 && isNewPlant === true) {
      if(plantProfiles.length < 3) {
        setPlantProfiles(prevPlantProfiles => [...prevPlantProfiles, formData]);
      } else {
        alert('Maximum of 3 plants allowed.');
      }
      setIsNewPlant(false);
    }
  }, [formData]);

  const handleAddPlant = () => {
    const dynamicValue = 'new';
    navigate(`/add-plant/${dynamicValue}`);
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
