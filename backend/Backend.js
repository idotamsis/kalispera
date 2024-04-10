const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Allow CORS for simplicity

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test"
});

// Route to handle user signup
app.post('/signup', (req, res) => {
  const { email, firstName, lastName, password } = req.body;
    // Validate email format using regular expression
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
  db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
    if (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results.length > 0) {
        // If email already exists, send an error response
        res.status(400).json({ error: 'Email already exists' });
      } else {
        // If email doesn't exist, insert the new user data into the database
        db.query('INSERT INTO users (email, first_name, last_name, password) VALUES (?, ?, ?, ?)', [email, firstName, lastName, password], (error, results) => {
          if (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
          } else {
            console.log('User signed up successfully')
            res.status(200).json({ message: 'User signed up successfully' });
          }
        });
      }
    }
  });
});

app.get('/profile/:id', (req, res) => {
  const userId = req.params.id;
  console.log('Received userId:', userId);
  console.log('Received userId:', userId);
  db.query('SELECT * FROM users WHERE id = ?', [userId], (error, results) => {
    console.log(userId);
    if (error) {
      console.error('Error fetching user information:', error);
      res.status(500).json({ error: 'An error occurred while fetching user information' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        const userData = results; // Assuming user data is stored in the first row of the result
        res.json(userData);
      }
    }
  });
});


// Route to handle user login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  // Check if email and password match an existing user in the database
  db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (error, results) => {
    if (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results.length > 0) {
        const userData = results[0];
        console.log('Logged in')
        res.status(200).json({ message: 'Login successful' , userData });
      } else {
        // If no user is found or password doesn't match, send an error response
        res.status(401).json({ error: 'Invalid email or password' });
      }
    }
  });
});


app.listen(8083, () => {
  console.log("listening on port 8083");
});
