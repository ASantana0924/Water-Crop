import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import SearchBar from "./SearchBar";

const AddPlant = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [plantEntries, setPlantEntries] = useState([]);
  const { dynamicValue } = useParams()
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    summary: '',
    imageLink: '',
    stats: {
      moisture: [],
      ph: [],
      temp: [],
      water_level: [0, 1]
    }
  });

  // check if page is adding or editing plant
  let message;
  if (dynamicValue === 'new') {
    message = 'Add New Plant';
  } else if (dynamicValue === 'edit') {
    message = 'Edit Plant';
  } else {
    message = 'Invalid Action';
  }

  useEffect(() => {
    fetchPlantEntries();
    // if editing, fill in form data
    if (dynamicValue === 'edit')
    {
      setFormData(location.state.data)
    }
  }, []);

  const fetchPlantEntries = async () => {
    try {
      const response = await fetch('http://localhost:3000/plantprofiles.json');
      const data = await response.json();
      setPlantEntries(data);
    } catch (error) {
      console.error('Error fetching plant entries:', error);
    }
  };

  // fill out the form with the selected plant
  const handleAddPlant = (plantIndex) => {
    setFormData(plantEntries[plantIndex]);
  };

  // handle new plant submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const isEditing = location.state && location.state.index !== undefined;
    console.log(isEditing);
    
    if (isEditing) {
      // Update the existing plant entry
      const updatedPlantEntries = [...plantEntries];
      updatedPlantEntries[location.state.index] = formData;
      // Here you should persist the updated list to wherever you store it,
      // for example sending it back to the server or updating local state
      setPlantEntries(updatedPlantEntries);
      // Navigate back with updated formData
      navigate('/home', { state: { data: formData, action: 'edit', index: location.state.index } });
    } else {
      // Add a new plant entry
      // Similarly, persist this new plant to your storage method
      const newPlantEntries = [...plantEntries, formData];
      setPlantEntries(newPlantEntries);
      // Navigate back with new formData
      navigate('/home', { state: { data: formData, action: 'add', index: newPlantEntries.length - 1 } });
    }
  };
  

  // navigate back to the home page
  const handleGoBack = () => {
    navigate('/Home');
  };

  // handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // check if the field name corresponds to a nested array in the stats object
    const nestedArraysToUpdate = {
      moisture_low: 'moisture',
      moisture_high: 'moisture',
      ph_low: 'ph',
      ph_high: 'ph',
      temp_low: 'temp',
      temp_high: 'temp'
    };
  
    // if the field name corresponds to a nested array
    if (nestedArraysToUpdate.hasOwnProperty(name)) {
      // convert the value to a number if it's not empty
      const numericValue = value !== '' ? parseFloat(value) : '';

      const arrayName = nestedArraysToUpdate[name];
      const otherValue = name.includes('low') ? formData.stats[arrayName][1] : formData.stats[arrayName][0];
  
      setFormData(prevFormData => ({
        ...prevFormData,
        stats: {
          ...prevFormData.stats,
          [arrayName]: name.includes('low') ? [numericValue, otherValue] : [otherValue, value]
        }
      }));
    } else {
      // For other fields, update them directly
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <div className="login-container" style={{ backgroundColor: "#9cc599", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <form onSubmit={handleSubmit} style={{ width: "600px", margin: "auto", padding: "55px", borderRadius: "10px", background: "#fff" }}>
        <h1 style={{ textAlign: "center", fontSize: "44px", fontWeight: "bold", marginTop: "40px", marginBottom: "40px" }}>WaterCrop</h1>
        <h2 style={{ marginBottom: "25px", fontSize: "30px" }}>{message}</h2>
        
        {/* SearchBar Component */}
        <SearchBar data={plantEntries} onPlantSelect={handleAddPlant}/>

        <Formik initialValues={formData} onSubmit={handleSubmit}>
          <Form>
            <Form.Group as={Row} controlId="name">
              <Form.Label column sm="2">Name:</Form.Label>
              <Col sm="10">
                <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="summary">
              <Form.Label column sm="2">Summary:</Form.Label>
              <Col sm="10">
                <Form.Control as="textarea" name="summary" value={formData.summary} onChange={handleChange} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="imageLink">
              <Form.Label column sm="3">Image Link:</Form.Label>
              <Col sm="10">
                <Form.Control type="text" name="imageLink" value={formData.imageLink} onChange={handleChange} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="moisture">
              <Form.Label column sm="5">Ideal Moisture Range:</Form.Label>
              <Row className="mb-1">
                <Col sm="2">
                  <Form.Control type="text" name="moisture_low" value={formData.stats.moisture[0]} onChange={handleChange} />
                </Col>
                <Col sm="2">
                  <Form.Control type="text" name="moisture_high" value={formData.stats.moisture[1]} onChange={handleChange} />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group as={Row} controlId="ph">
              <Form.Label column sm="4">Ideal pH Range:</Form.Label>
              <Row className="mb-1">
                <Col sm="2">
                  <Form.Control type="text" name="ph_low" value={formData.stats.ph[0]} onChange={handleChange} />
                </Col>
                <Col sm="2">
                  <Form.Control type="text" name="ph_high" value={formData.stats.ph[1]} onChange={handleChange} />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group as={Row} controlId="temp">
              <Form.Label column sm="6">Ideal Temperature (F°) Range:</Form.Label>
              <Row className="mb-1">
                <Col sm="2">
                  <Form.Control type="text" name="temp_low" value={formData.stats.temp[0]} onChange={handleChange} />
                </Col>
                <Col sm="2">
                  <Form.Control type="text" name="temp_high" value={formData.stats.temp[1]} onChange={handleChange} />
                </Col>
              </Row>
            </Form.Group>

            <Button onClick={handleSubmit} type="submit" style={{ width: "100%", padding: "10px", background: "#4d814a", color: "#fff", border: "none", borderRadius: "5px" }}>Submit</Button>
          </Form>
        </Formik>

        <Button onClick={handleGoBack} style={{ width: "100%", padding: "10px", marginTop: "20px", background: "#4d814a", color: "#fff", border: "none", borderRadius: "5px" }}>Go Back</Button>
      </form>
    </div>
  );
};

export default AddPlant;
