const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Test database connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Successfully connected to MySQL: ', db.threadId);
    }
});

// Your code goes here
// GET METHOD example
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Retrieve all patients
app.get('/patients', (req, res) => {
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving patients:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('data', { results });
        }
    });
});

// Retrieve all providers
app.get('/providers', (req, res) => {
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving providers:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('providers', { results });
        }
    });
});

// Filter patients by First Name
app.get('/patients/search/:firstName', (req, res) => {
    const firstName = req.params.firstName;
    const query = `SELECT * FROM patients WHERE first_name LIKE '%${firstName}%'`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving patients:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('data', { results });
        }
    });
});

// Retrieve all providers by their specialty
app.get('/providers/:specialty', (req, res) => {
    const specialty = req.params.specialty;
    const query = `SELECT * FROM providers WHERE provider_specialty = ?`;
    db.query(query, [specialty], (err, results) => {
        if (err) {
            console.error('Error retrieving providers:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('providers', { results });
        }
    });
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);

    // Sending a message to the browser
    console.log('Sending message to browser...');
    app.get('/', (req, res) => {
        res.send('Server Started Successfully!');
    });
});