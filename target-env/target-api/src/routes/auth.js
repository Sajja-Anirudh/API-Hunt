const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../in-memory-db');

const SECRET_KEY = "super_secret_hackathon_key"; 

// LOGIN ROUTE
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = db.users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { userId: user.id, username: user.username, dealer_id: user.dealer_id },
        SECRET_KEY,
        { expiresIn: '1h' }
    );

    res.json({ message: "Login successful", token });
});

// SIGNUP ROUTE (NEW)
router.post('/register', (req, res) => {
    const { username, password, dealerName, location } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if user already exists
    const existingUser = db.users.find(u => u.username === username);
    if (existingUser) {
        return res.status(409).json({ message: "Username is already taken." });
    }

    // Generate new IDs dynamically based on the current database size
    const newUserId = db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1;
    const newDealerId = db.dealers.length > 0 ? Math.max(...db.dealers.map(d => d.dealer_id)) + 1 : 101;

    // Create the new user and dealer objects
    const newUser = { id: newUserId, username, password, dealer_id: newDealerId };
    const newDealer = { 
        dealer_id: newDealerId, 
        name: dealerName || `${username} Dealership`, 
        location: location || "Unspecified Location", 
        rating: 5.0 // Everyone starts with a 5-star rating!
    };

    // Save them to our in-memory "database"
    db.users.push(newUser);
    db.dealers.push(newDealer);

    // Automatically log them in by generating a JWT
    const token = jwt.sign(
        { userId: newUser.id, username: newUser.username, dealer_id: newUser.dealer_id },
        SECRET_KEY,
        { expiresIn: '1h' }
    );

    res.status(201).json({ message: "Registration successful", token });
});

module.exports = router;