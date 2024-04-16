import React, { useState, useEffect } from 'react';

export default function ButtonColor({moisture, waterLevel, temperature, ph, index}) {
    const [mColor, setMColor] = useState(null); // State to store color
    const [wColor, setWColor] = useState(null); // State to store color
    const [tColor, setTColor] = useState(null); // State to store color
    const [pColor, setPColor] = useState(null); // State to store color

    const [plantProfiles, setPlantProfiles] = useState(() => JSON.parse(localStorage.getItem('plantProfiles')) || []);
    const plant = plantProfiles[index];
    console.log(index);

    // Find the plant object matching the given name
    function getLimits() {
        // Extract the desired values
        const [moisture_min, moisture_max] = plant.stats.moisture;
        const [water_min, water_max] = plant.stats.water_level;
        const [temp_min, temp_max] = plant.stats.temp;
        const [ph_min, ph_max] = plant.stats.ph;

        // Return the values as an object
        return { moisture_min, moisture_max, water_min, water_max, temp_min, temp_max, ph_min, ph_max };
    }

    var min = 0;
    var max = 0;
    var fivePercentDeviation = 0 
    var tenPercentDeviation = 0;
    const plantValues = getLimits();

    // Moisture color
    min = plantValues.moisture_min;
    max = plantValues.moisture_max;
    fivePercentDeviation = 0.05 * 100;
    tenPercentDeviation = 0.1 * 100;

    if (moisture <= max && moisture >= min) {
        setMColor(3);
    }
    else if (moisture <= max + fivePercentDeviation && moisture >= min - fivePercentDeviation) {
        setMColor(2);
    }
    else if (moisture <= max + tenPercentDeviation && moisture >= min - tenPercentDeviation) {
        setMColor(1);
    }
    else {
        setMColor(0);
    }

    // water level color
    if (waterLevel == 1) {
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

    if (temperature <= max && temperature >= min) {
        setTColor(3);
    }
    else if (temperature <= max + fivePercentDeviation && temperature >= min - fivePercentDeviation) {
        setTColor(2);
    }
    else if (temperature <= max + tenPercentDeviation && temperature >= min - tenPercentDeviation) {
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

    if (ph <= max && ph >= min) {
        setPColor(3);
    }
    else if (ph <= max + fivePercentDeviation && ph >= min - fivePercentDeviation) {
        setPColor(2);
    }
    else if (ph <= max + tenPercentDeviation && ph >= min - tenPercentDeviation) {
        setPColor(1);
    }
    else {
        setPColor(0);
    }


    // Find worst of all colors
    const [worstColor, setWorstColor] = useState(mColor);

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
        return "#90EE90";
    }
    else if (worstColor == 2) {
        return "#FEFF99"; 
    }
    else if (worstColor == 1) {
        return "#FF9B5F"; 
    }
    else {
        return "#FF6F68"; 
    }

}