const express = require("express");
const dotenv = require("dotenv");
const mysql = require("mysql2");
const { sortSchoolsByProximity } = require("./getSortData"); // Import the function
// const cors = require("cors")

// Create REST object
const app = express();

// Load environment variables
dotenv.config();

// Middleware to parse JSON requests
app.use(express.json());

// Create MySQL connection
let connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
});

// Connect to MySQL database
connection.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
    } else {
        console.log("Connected to MySQL database");
            // Create the school table
    const createTable = `
    CREATE TABLE IF NOT EXISTS school (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      latitude FLOAT NOT NULL,
      longitude FLOAT NOT NULL
    )
  `;
  connection.execute(createTable, (err, results) => {
    if (err) {
      console.error("Error creating school table:", err);
    } else {
      console.log("Schools table created",results);
    }
  });
    }
});

// Add a new school
app.post("/addSchool", (req, res) => {
    let { id, name, address, latitude, longitude } = req.body;

    if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: "Missing data Please check !!!" });
   }

    // Check for duplicate school name
    let query1 = "SELECT * FROM school WHERE name = ?";
    connection.execute(query1, [name], (err, results) => {
        
        if (err) {
            console.error("Error checking for duplicate data:", err);
            return res.status(500).json({ error: "Database error" });

        }


        if(results.length > 0) {
            return res.status(200).json({ message: "School data already exists" });
        }

        // Insert new school data
        let query = "INSERT INTO school (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
        let values = [name, address, latitude, longitude];

        connection.execute(query, values, (err, results) => {
            if (err) {
                console.error("Error inserting data:", err);
                return res.status(500).json({ error: "Database error while inserting" });
            }
            console.log("Data inserted:", results);
            return res.status(201).json({ message: "School added successfully", data: results });
        });

        
    });

    
});

// List all schools
app.get("/listSchool", (req, res) => {
    //hold Query parameter value form http://localhost?latitude=val1&longitude=val1
    const userLatitude = parseFloat(req.query.latitude);
    const userLongitude = parseFloat(req.query.longitude);

    if (userLatitude < -90 || userLatitude > 90 || userLongitude < -180 || userLongitude > 180) {
        return res.status(400).json({ error: "Invalid latitude or longitude" });
    }
    // Check value Not a Number
    if (isNaN(userLatitude) || isNaN(userLongitude)) {
        return res.status(400).json({ error: "Invalid user location" });
    }


    let query = "SELECT * FROM school ORDER BY name";
    connection.execute(query, (err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            return res.status(500).json({ error: "Database error while fetching data" });
        }else{
            const userLocation = { latitude: userLatitude, longitude: userLongitude }; 
            const sortedSchools = sortSchoolsByProximity(userLocation,results);
            console.log("Sorted Schools by Proximity:", sortedSchools);
            res.status(200).json({SortedSchoolData: sortedSchools})
        }
        
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} and available at http://localhost:8082`);
});
