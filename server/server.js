const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/data", (req, res) => {
  // Read the JSON file into a JavaScript object
  const sensorData = JSON.parse(fs.readFileSync("../socket/data.json"));
  res.json(sensorData);
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});