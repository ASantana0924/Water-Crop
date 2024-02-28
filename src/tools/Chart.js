import React, { useState, useEffect } from "react";
import { firestoreDatabase } from "../firebase/firebase";
import { Line } from 'react-chartjs-2'

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

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

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
        return 0;
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
        return 1;
    } else if (stat == "temperature") {
        return 120;
    } else {
        return 14;
    }
}

export default function Chart() {
    //getPlantStatsHistory();
    const [plantData, setPlantData] = useState([]);
    const [selectedStat, setSelectedStat] = useState(["moisture"]);
    const firestoreDBRef = collection(firestoreDatabase, 'PlantDataHistory/plant1/stats');
    const q = query(firestoreDBRef, orderBy("time"));

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
                        x: formatDate(doc.data().time), // Convert timestamp to Date object
                        y: currentStat, // Use selectedStat for dynamic selection
                    };
                    data.push(point);
            });
            setPlantData(data);
        });

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
                pointBorderColor: 'white'
            }
        ]
    }

    const options = {
        plugins: {
            legend: true
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