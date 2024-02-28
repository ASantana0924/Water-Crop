import React, { useState, useEffect } from 'react';
import { SemiCircleProgress } from "react-semicircle-progressbar";

var percentage = 10; // percentage to be displayed on progress bar

export default function ProgressBar({statValue, statType, plantName}) {

  console.log(statValue);
  console.log(statType);
  console.log(plantName);

  const [color, setColor] = useState(null); // State to store color
  const [percentage, setPercentage] = useState(null); // State to store color
  
  // Colors for stat range indicators
  const green = "#90EE90";  // within optimal range
  const yellow = "#FEFF99";        // within 5% of optimal range
  const orange = "#FF9B5F";        // within 10% of optimal range
  const red = "#FF6F68";           // above 10% outside of optimal range

  // Retrieve optimal stat ranges from plant API json given a plant name
  const fetchPlantStatRanges = async (name) => {
    // Read the JSON data from the file
    // const jsonData = await fetch('../../public/plantProfiles.json')
    // .then(response => response.json());

    const response = await fetch('http://localhost:3000/plantprofiles.json');
    const jsonData = await response.json();

    // Find the plant object matching the given name
    const plant = jsonData.find(plant => plant.name.toLowerCase() === name.toLowerCase());

    // Check if the plant was found
    if (!plant) {
      return null; // Return null if not found
    }

    // Extract the desired values
    const [moisture_min, moisture_max] = plant.stats.moisture;
    const [water_min, water_max] = plant.stats.water_level;
    const [temp_min, temp_max] = plant.stats.temp;
    const [ph_min, ph_max] = plant.stats.ph;

    // Return the values as an object
    return { moisture_min, moisture_max, water_min, water_max, temp_min, temp_max, ph_min, ph_max };
  };

  const getStatColor = async (statType) => {
    var min = 0;
    var max = 0;
    var fivePercentDeviation = 0 
    var tenPercentDeviation = 0;
    const plantValues = await fetchPlantStatRanges(plantName);

    if (statType == "moisture") {
      min = plantValues.moisture_min;
      max = plantValues.moisture_max;
      fivePercentDeviation = 0.05 * 100;
      tenPercentDeviation = 0.1 * 100;
      setPercentage(statValue);

    } else if (statType == "water") {
      min = plantValues.water_min;
      max = plantValues.water_max;
      fivePercentDeviation = 0.05 * 1;
      tenPercentDeviation = 0.1 * 1;
      setPercentage(statValue * 100);

    } else if (statType == "temperature") {
      min = plantValues.temp_min;
      max = plantValues.temp_max;
      fivePercentDeviation = 0.05 * 110;
      tenPercentDeviation = 0.1 * 110;
      setPercentage(((statValue / 110) * 100).toFixed(0));

    } else {
      min = plantValues.ph_min;
      max = plantValues.ph_max;
      fivePercentDeviation = 0.05 * 14;
      tenPercentDeviation = 0.1 * 14; 
      setPercentage(((statValue / 14) * 100).toFixed(0));

    }

    if (statValue <= max && statValue >= min) {
      return green;

    } else if (statValue <= max + fivePercentDeviation && statValue >= min - fivePercentDeviation) {
      return yellow;

    } else if (statValue <= max + tenPercentDeviation && statValue >= min - tenPercentDeviation) {
      return orange;

    } else {
      return red;
    }
  }

  useEffect(() => {
    const fetchColor = async () => {
      const color = await getStatColor(statType);
      setColor(color);
    };

    fetchColor(); // Call the async function within useEffect
  }, [statValue]); // Specify dependency array (statType in this case)

  return (
      <SemiCircleProgress 
                  percentage={percentage}
                  size={{
                    width: 200,
                    height: 200,
                  }}
                  strokeWidth={10}
                  strokeColor={color}
                  hasBackground={true}
                  fontStyle={{
                    fill: "#7cb580"
                  }}
      />
  );
}