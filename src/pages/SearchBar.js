import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ data, onPlantSelect }) => {
    // Keep track of data through React Hooks
    const [filteredData, setFilteredData] = useState(data);
    const [isFocused, setIsFocused] = useState(false);
    const [plantID, setPlantID] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPlant, setSelectedPlant] = useState(null);
    
    // Handle the search suggestions by comparing the plant and query data
    const handleSearch = (query) => {
        const filtered = data.filter((plant) =>
            plant.name.toLowerCase().includes(query.toLowerCase()));
        setFilteredData(filtered);
    };

    // Handle changes in the search bar input
    const handleChange = (input) => {
        setSearchQuery(input.target.value);
        handleSearch(input.target.value);
        setSelectedPlant(null);
    };

    // Update the search query with the selected plant's name
    const handleSelectPlant = (plant) => {
        //setSelectedPlant(plant);
        //setSearchQuery(plant.name);
        //setPlantID(plant.id);
        onPlantSelect(plant.id)
        setSearchQuery('');
        setPlantID('');
        setIsFocused(false);
    };
    
    // Handle the submission of the search query
    // const handleSubmit = () => {
    //     if(plantID !== '')
    //     {
    //         onPlantSelect(plantID)
    //         setSearchQuery('');
    //         setPlantID('');
    //         setIsFocused(false);
    //     }
    // };
    
    return (
    <div>
        <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
        />
        {isFocused && (
            <ul>
                {filteredData.map((plant) => (
                <li key={plant.id}
                    onClick={() => handleSelectPlant(plant)}
                    className={plant === selectedPlant ? 'selected' : ''}
                >
                    {plant.name}
                </li>
                ))}
            </ul>
        )}
    </div>
    );
};

export default SearchBar;