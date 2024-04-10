import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from "./SearchBar";

const AddPlant = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [plantEntries, setPlantEntries] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    summary: '',
    imageLink: '',
  });

  useEffect(() => {
    fetchPlantEntries();
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
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="login-container" style={{ backgroundColor: "#9cc599", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <form onSubmit={handleSubmit} style={{ width: "600px", margin: "auto", padding: "55px", borderRadius: "10px", background: "#fff" }}>
        <h1 style={{ textAlign: "center", fontSize: "44px", fontWeight: "bold", marginTop: "40px", marginBottom: "40px" }}>WaterCrop</h1>
        <h2 style={{ marginBottom: "25px", fontSize: "30px" }}>Add New Plant</h2>
        
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

            <Button onClick={handleSubmit} type="submit" style={{ width: "100%", padding: "10px", background: "#4d814a", color: "#fff", border: "none", borderRadius: "5px" }}>Submit</Button>
          </Form>
        </Formik>

        <Button onClick={handleGoBack} style={{ width: "100%", padding: "10px", marginTop: "20px", background: "#4d814a", color: "#fff", border: "none", borderRadius: "5px" }}>Go Back</Button>
      </form>
    </div>
  );
};

export default AddPlant;
