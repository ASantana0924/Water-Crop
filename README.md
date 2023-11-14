# WaterCrop
The purpose of WaterCrop is to provide automated assistance and statistics for people who are interested in cultivating any sort of plant, such as flowers, fruits, and vegetables. It is especially useful for beginner plant growers and plant enthusiasts who lead busy lives or frequently go on vacation. This repository contains the software for our product.

## Completed Work
So far, we have developed a simple React application with Home, Plant Profiles, and Stats pages. The Stats page fetches JSON data from "http://localhost:8000/data" every 0.5 seconds, and it continuously updates the waterLevel and moistureLevel data from the server.

We have also successfully integrated the Raspberry Pi to ***TODO***

## Architecture
### /public
This directory contains the HTML template and metadata for the React application.

### /server
This directory creates a simple Node.js server using Express.js that listens to localhost port 8000 and provides JSON data located in the "../socket/data.json" file when a GET request is made to the /data route.

### /socket
This directory utilizes sockets to receive data from a UDP client (Raspberry Pi) and write it to a file in JSON format in order for real-time plant sensor values to be easily displayed on the Stats page.

### /src
This directory contains the React application's source files, such as pages, tools, and CSS styles.
The **index.js** file puts the React application into the HTML page, and the **App.js** file is the main component of the application.

**pages** - The pages directory has the JavaScript files for the Home, Plant Profiles, and Stats pages. 

**tools** - The tools directory has the JavaScript file for the navigation bar.

## Known Bugs
There are currently no known bugs.

## Getting Started
In order to start this project, clone the repository:
```
git clone https://github.com/ASantana0924/Water-Crop.git
```
To start socket communication with the Raspberry Pi:
```
cd socket
python ReceiveData.py
```
Then, run these lines to start the server:
```
cd Water-Crop
cd server
npm init -y
npm install express cors
npm install nodemon --save-dev
npm install react-router-dom
npm install antd
npm start
```
Finally, open another terminal and run these commands:
```
cd Water-Crop
npm install
npm start
```
Bye