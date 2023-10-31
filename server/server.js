const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/data", (req, res) => {
  const sensorData = {
    waterLevel: 0.75,
    moistureLevel: 0.45
  };
  res.json(sensorData);
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});