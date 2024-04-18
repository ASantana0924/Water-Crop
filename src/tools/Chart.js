import React, { useState, useEffect } from "react";
import { firestoreDatabase } from "../firebase/firebase";
import { Line } from 'react-chartjs-2';
import ChartAnnotation from 'chartjs-plugin-annotation';

import {
    collection, 
    query,
    onSnapshot, 
    getDocs, 
    orderBy
} from "firebase/firestore";

import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Legend
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, ChartAnnotation);

// Colors for stat range indicators
const green = 'rgba(144, 238, 144, 0.45)';  // within optimal range
const yellow = 'rgba(254, 255, 153, 0.45)'; // within 5% of optimal range
const orange = 'rgba(255, 155, 95, 0.45)';  // within 10% of optimal range
const red = 'rgba(255, 111, 104, 0.45)';    // above 10% outside of optimal range
const white = 'rgba(255, 255, 255, 255)';

/*const plantDataHistoryRef = collection(firestoreDatabase, 'PlantDataHistory/plant1/stats');

const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
});

async function getPlantDataHistory() {
    const plantDataHistoryQuery = query(plantDataHistoryRef, orderBy("time"));
    const querySnapshot = await getDocs(plantDataHistoryQuery);

    querySnapshot.forEach((doc) => {});
}
*/
const formatDate = (dateString) => {
    return (new Date(dateString.toDate()).getMonth() + 1) + "/" + (new Date(dateString.toDate())).getDate();
}

const setYAxisTitle = (stat) => {

    if (stat == "moisture") {
        return 'Moisture (%)';
    } else if (stat == "water_level") {
        return 'Water Level';
    } else if (stat == "temperature") {
        return 'Temperature (°F)';
    } else {
        return 'pH';
    };
}

const setMin = (stat) => {
    if (stat == "moisture") {
        return 0;
    } else if (stat == "water_level") {
        return -0.1;
    } else if (stat == "temperature") {
        return 0;
    } else {
        return 0;
    }
}

const setMax = (stat) => {
    if (stat == "moisture") {
        return 100;
    } else if (stat == "water_level") {
        return 1.1;
    } else if (stat == "temperature") {
        return 120;
    } else {
        return 14;
    }
}

export default function Chart({plantName}) {
    //getPlantStatsHistory();
    const [plantData, setPlantData] = useState([]);
    const [selectedStat, setSelectedStat] = useState(["moisture"]);
    const firestoreDBRef = collection(firestoreDatabase, 'PlantDataHistory/plant1/stats');
    const q = query(firestoreDBRef, orderBy("time"));
    const [boundMin, setBoundMin] = useState(0);
    const [boundMax, setBoundMax] = useState(0);

    // Retrieve optimal stat ranges from plant API json given a plant name
    const fetchPlantStatRanges = async (name) => {
        // Read the JSON data from the file
        // const jsonData = await fetch('../../public/plantProfiles.json')
        // .then(response => response.json());

        const response = await fetch('http://localhost:3000/plantprofiles.json');
        const jsonData = await response.json();

        // Find the plant object matching the given name
        const plant = jsonData.find(plant => plant.name === name);

        console.log(name + " => ");

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

    const getBoundMin = async () => {
        const plantStatBounds = await fetchPlantStatRanges(plantName);

        if (selectedStat == "moisture") {
            return plantStatBounds.moisture_min;
        } else if (selectedStat == "water_level") {
            return plantStatBounds.water_min;
        } else if (selectedStat == "temperature") {
            return plantStatBounds.temp_min
        } else {
            return plantStatBounds.ph_min;
        }
    }

    const getBoundMax = async () => {
        const plantStatBounds = await fetchPlantStatRanges(plantName);

        if (selectedStat == "moisture") {
            return plantStatBounds.moisture_max;
        } else if (selectedStat == "water_level") {
            return plantStatBounds.water_max;
        } else if (selectedStat == "temperature") {
            return plantStatBounds.temp_max
        } else {
            return plantStatBounds.ph_max;
        }
    }

    useEffect(() => {
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            var data = [];
            querySnapshot.forEach((doc) => {
                    const moistureStat = doc.data().moisture;
                    const waterLevelStat = doc.data().water_level;
                    const temperatureStat = doc.data().temperature;
                    const phStat = doc.data().ph;

                    var currentStat;

                    if (selectedStat == "moisture") {
                        currentStat = moistureStat;
                    } else if (selectedStat == "water_level") {
                        currentStat = waterLevelStat;
                    } else if (selectedStat == "temperature") {
                        currentStat = temperatureStat;
                    } else {
                        currentStat = phStat;
                    }

                    const point = {
                        x: doc.data().time, // Convert timestamp to Date object
                        y: currentStat, // Use selectedStat for dynamic selection
                    };
                    data.push(point);
            });
            setPlantData(data);
        });

        const fetchHighlightBounds = async () => {
            const min = await getBoundMin();
            const max = await getBoundMax();
            setBoundMin(min);
            setBoundMax(max);
        };
      
        fetchHighlightBounds(); // Call the async function within useEffect

        return () => {
            unsubscribe();
        };
    }, [selectedStat]); // Re-fetch data when selectedStat changes

    const data = {
        labels: plantData.map((point) => point.x),
        datasets: [{
                label: selectedStat,
                data: plantData.map((point) => point.y),
                backgroundColor: 'white',
                borderColor: 'white',
                pointBorderColor: 'white',
                pointBorderWidth: 3,
                borderWidth: 5
            }
        ]
    }

    const options = {
        plugins: {
            legend: true,
            annotation: {
                annotations: {
                    in_range: {
                        type: 'box',
                        xMin: 0,
                        xMax: plantData.length,
                        yMin: boundMin,
                        yMax: boundMax,
                        borderColor: green,
                        backgroundColor: green
                    },
                    little_low: {
                        type: 'box',
                        xMin: 0,
                        xMax: plantData.length,
                        yMin: boundMin - (0.05 * (setMax(selectedStat) - setMin(selectedStat))),
                        yMax: boundMin,
                        borderColor: yellow,
                        backgroundColor: yellow
                    },
                    little_high: {
                        type: 'box',
                        xMin: 0,
                        xMax: plantData.length,
                        yMin: boundMax,
                        yMax: boundMax + (0.05 * (setMax(selectedStat) - setMin(selectedStat))),
                        borderColor: yellow,
                        backgroundColor: yellow
                    },
                    moderately_low: {
                        type: 'box',
                        xMin: 0,
                        xMax: plantData.length,
                        yMin: boundMin - (0.1 * (setMax(selectedStat) - setMin(selectedStat))),
                        yMax: boundMin - (0.05 * (setMax(selectedStat) - setMin(selectedStat))),
                        borderColor: orange,
                        backgroundColor: orange
                    },
                    moderately_high: {
                        type: 'box',
                        xMin: 0,
                        xMax: plantData.length,
                        yMin: boundMax + (0.05 * (setMax(selectedStat) - setMin(selectedStat))),
                        yMax: boundMax + (0.1 * (setMax(selectedStat) - setMin(selectedStat))),
                        borderColor: orange,
                        backgroundColor: orange
                    },
                    too_low: {
                        type: 'box',
                        xMin: 0,
                        xMax: plantData.length,
                        yMin: setMin(selectedStat),
                        yMax: boundMin - (0.1 * (setMax(selectedStat) - setMin(selectedStat))),
                        borderColor: red,
                        backgroundColor: red
                    },
                    too_high: {
                        type: 'box',
                        xMin: 0,
                        xMax: plantData.length,
                        yMin: boundMax + (0.1 * (setMax(selectedStat) - setMin(selectedStat))),
                        yMax: setMax(selectedStat),
                        borderColor: red,
                        backgroundColor: red
                    }
                }
            }
        },
        scales: {
            y: {
                min: setMin(selectedStat),
                max: setMax(selectedStat),
                title: {
                    display: true,
                    text: setYAxisTitle(selectedStat),
                    color: 'white',
                    textStrokeColor: 'white',
                    textStrokeWidth: 0.5,
                    font: {
                        size: 25
                    }
                },
                grid: {
                    color: 'white'
                },
                ticks: {
                    color: 'white',
                    textStrokeColor: 'white',
                    textStrokeWidth: 0.5,
                    font: {
                        size: 18
                    }
                }
            },
            x: {
                grid: {
                  color: 'white'
                },
                ticks: {
                    color: 'white',
                    textStrokeColor: 'white',
                    textStrokeWidth: 0.5,
                    font: {
                        size: 18
                    }
                }
            }
        }
    }

    return (
        <div>
        <select value={selectedStat} onChange={(e) => setSelectedStat(e.target.value)}>
        <option value="moisture">Moisture</option>
        <option value="water_level">Water Level</option>
        <option value="temperature">Temperature</option>
        <option value="ph">pH</option>
        </select>
        <Line data = {data} options = {options}>
        </Line>
        </div>
    );
}