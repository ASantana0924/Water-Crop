// Home.js
// Bug: new plant appears when the page is refreshed
import React, { useState, useEffect , useRef} from 'react';
import { useNavigate , useLocation } from 'react-router-dom';
import '../styles.css';

// Button Color imports
import { auth, realtimeDatabase, RTDBRef, firestoreDatabase } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import { onValue, ref } from "firebase/database";
import ButtonColor from "../tools/ButtonColor";

export default function Home() {
  let navigate = useNavigate();
  let location = useLocation();
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
    const handleUpdatePlantProfiles = () => {
      // Determine if we're adding a new plant or editing an existing one
      const action = location.state?.action;
      const index = location.state?.index;
  
      if (action === 'add' && Object.keys(formData).length !== 0) {
        // Adding a new plant
        if (plantProfiles.length < 3) {
          setPlantProfiles(prevPlantProfiles => [...prevPlantProfiles, formData]);
        } else {
          alert('Maximum of 3 plants allowed.');
        }
      } else if (action === 'edit' && index !== undefined && Object.keys(formData).length !== 0) {
        // Editing an existing plant
        setPlantProfiles(prevPlantProfiles => prevPlantProfiles.map((item, idx) => idx === index ? formData : item));
      }
    };
  
    handleUpdatePlantProfiles();
  }, [formData, location.state]); // Depend on formData and location.state to trigger the effect
  

  const handleAddPlant = () => {
    // const dynamicValue = 'new';
    // navigate(`/add-plant/${dynamicValue}`);
    navigate('/Bluetooth');
  };

  const handleEditPlant = (plantIndex) => {
    console.log('Editing plant:', plantIndex);
    const plantToEdit = plantProfiles[plantIndex];
    navigate(`/add-plant/edit`, { state: { data: plantToEdit, index: plantIndex } });
  };
  

  const handleDeletePlant = (plantIndex) => {
    const updatedPlantProfiles = plantProfiles.filter((plant, index) => index !== plantIndex);
    setPlantProfiles(updatedPlantProfiles);
  };

  const handleStatsPlant = (plant, plantIndex) => {
    let path = '/plant-profiles/' + plantIndex;
    navigate(path);
  };

  // New code for color of plant health button

  // Initialize useState variables for plant profile page
  const [moistureValue, setMoistureValue] = useState(0);
  const [waterValue, setWaterValue] = useState(0);
  const [temperatureValue, setTemperatureValue] = useState(0);
  const [PHValue, setPHValue] = useState(0);

  useEffect(() => {
    // Listen for changes in the database
    const unsubscribe = onValue(RTDBRef, (snapshot) => {
        // Update plant object attributes with live data
        setMoistureValue(snapshot.val().moisture);
        setWaterValue(snapshot.val().water_level);
        setTemperatureValue(snapshot.val().temperature);
        setPHValue(snapshot.val().pH);
    });

    // Clean up the listener when the component unmounts
    return () => {
        unsubscribe();
    };
  }, []);


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
            <button onClick={() => handleStatsPlant(plant, index)} >View Plant Health!</button>
            {console.log(index)}
            <div className="ActionButtons">
              <button onClick={() => handleEditPlant(index)}>Edit</button>
              <button onClick={() => handleDeletePlant(index)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
