const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../in-memory-db');

// Hardcoded secret for the hackathon
const SECRET_KEY = "super_secret_hackathon_key"; 

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = db.users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT including the user's assigned dealer_id
    const token = jwt.sign(
        { userId: user.id, username: user.username, dealer_id: user.dealer_id },
        SECRET_KEY,
        { expiresIn: '1h' }
    );

    res.status(200).json({ message: "Login successful", token });
});

router.post('/signup', (req, res) => {
    const { username, password } = req.body;

    const user = db.users.find()
})

module.exports = router;