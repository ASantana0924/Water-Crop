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
    navigate('/Bluetooth');
  };

  const handleEditPlant = (plantIndex) => {
    const dynamicValue = 'edit';
    console.log('Editing plant:', plantIndex);
    const plantToEdit = plantProfiles[plantIndex];
    navigate(`/add-plant/${dynamicValue}`, { state: { data: plantToEdit, index: plantIndex } });
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
  const [mColor, setMColor] = useState(null);
  const [wColor, setWColor] = useState(null);
  const [tColor, setTColor] = useState(null);
  const [pColor, setPColor] = useState(null);
  const [worstColor, setWorstColor] = useState(null);
  const [worstColorCode, setWorstColorCode] = useState(null);


  useEffect(() => {
    // Listen for changes in the database
    const unsubscribe = onValue(RTDBRef, (snapshot) => {
      // Update plant object attributes with live data
      setMoistureValue(snapshot.val().moisture);
      setWaterValue(snapshot.val().water_level);
      setTemperatureValue(snapshot.val().temperature);
      setPHValue(snapshot.val().pH);
    });

    if (plantProfiles[0] != undefined) {
      getWorstColor();
    }

    // Clean up the listener when the component unmounts
    return () => {
        unsubscribe();
    };
  }, []);

  function getLimits(plant) {
    // Extract the desired values
    const [moisture_min, moisture_max] = plant.stats.moisture;
    const [water_min, water_max] = plant.stats.water_level;
    const [temp_min, temp_max] = plant.stats.temp;
    const [ph_min, ph_max] = plant.stats.ph;

    // Return the values as an object
    return { moisture_min, moisture_max, water_min, water_max, temp_min, temp_max, ph_min, ph_max };
  }

  function getWorstColor() {
    var min = 0;
    var max = 0;
    var fivePercentDeviation = 0 
    var tenPercentDeviation = 0;
    const plantValues = getLimits(plantProfiles[0]);
    console.log(plantProfiles[0]);

    // Moisture color
    min = plantValues.moisture_min;
    max = plantValues.moisture_max;
    fivePercentDeviation = 0.05 * 100;
    tenPercentDeviation = 0.1 * 100;

    if (moistureValue <= max && moistureValue >= min) {
        setMColor(3);
    }
    else if (moistureValue <= max + fivePercentDeviation && moistureValue >= min - fivePercentDeviation) {
        setMColor(2);
    }
    else if (moistureValue <= max + tenPercentDeviation && moistureValue >= min - tenPercentDeviation) {
        setMColor(1);
    }
    else {
        setMColor(0);
    }

    // water level color
    if (waterValue == 1) {
        setWColor(3);
    }
    else {
        setWColor(0);
    }

    // Temperature color
    min = plantValues.temp_min;
    max = plantValues.temp_max;
    fivePercentDeviation = 0.05 * 110;
    tenPercentDeviation = 0.1 * 110;

    if (temperatureValue <= max && temperatureValue >= min) {
        setTColor(3);
    }
    else if (temperatureValue <= max + fivePercentDeviation && temperatureValue >= min - fivePercentDeviation) {
        setTColor(2);
    }
    else if (temperatureValue <= max + tenPercentDeviation && temperatureValue >= min - tenPercentDeviation) {
        setTColor(1);
    }
    else {
        setTColor(0);
    }

    // pH color
    min = plantValues.ph_min;
    max = plantValues.ph_max;
    fivePercentDeviation = 0.05 * 14;
    tenPercentDeviation = 0.1 * 14; 

    if (PHValue <= max && PHValue >= min) {
        setPColor(3);
    }
    else if (PHValue <= max + fivePercentDeviation && PHValue >= min - fivePercentDeviation) {
        setPColor(2);
    }
    else if (PHValue <= max + tenPercentDeviation && PHValue >= min - tenPercentDeviation) {
        setPColor(1);
    }
    else {
        setPColor(0);
    }


    // Find worst of all colors
    setWorstColor(mColor);

    if (wColor < mColor) {
        setWorstColor(wColor);
    }

    if (tColor < wColor) {
        setWorstColor(tColor);
    }

    if (tColor < pColor) {
        setWorstColor(pColor);
    }

    console.log(mColor, wColor, tColor, pColor);


    // Determine color
    if (worstColor == 3) {
      setWorstColorCode("#90EE90");
    }
    else if (worstColor == 2) {
      setWorstColorCode("#FEFF99"); 
    }
    else if (worstColor == 1) {
      setWorstColorCode("#FF9B5F"); 
    }
    else if (worstColor == 0) {
      setWorstColorCode("#FF6F68"); 
    }
  }

  return (
    <div className="App">
      <h1 style={{ fontFamily: 'Roboto, sans-serif' }} className="Header">
        Welcome to WaterCrop!
      </h1>
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
            <button onClick={() => handleStatsPlant(plant, index)} style={{backgroundColor: worstColorCode}}>View Plant Health!</button>
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
