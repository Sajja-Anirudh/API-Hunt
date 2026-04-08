const express = require('express');
const router = express.Router();
const db = require('../in-memory-db');
const verifyToken = require('../middleware/authMiddleware');

// The VULNERABLE Route - BOLA is present
// We blindly fetch dealer details based on the URL parameter, allowing an attacker
// with a valid JWT to view ANY dealer's details.
router.get('/dealer-details-vulnerable/:dealer_id', verifyToken, (req, res) => {
    const requestedDealerId = parseInt(req.params.dealer_id);
    
    // FLAW: No authorization check against req.user.dealer_id
    const dealer = db.dealers.find(d => d.dealer_id === requestedDealerId);
    
    if (!dealer) return res.status(404).json({ message: "Dealer not found" });
    
    res.json({ data: dealer });
});

// The SECURE Route - Patched
// The most secure way to handle "/me" endpoints is to completely ignore URL parameters
// and pull the identity strictly from the verified JWT token.
router.get('/dealer-details-secure/me', verifyToken, (req, res) => {
    const authenticatedDealerId = req.user.dealer_id;
    
    const dealer = db.dealers.find(d => d.dealer_id === authenticatedDealerId);
    
    if (!dealer) return res.status(404).json({ message: "Dealer not found" });
    
    res.json({ data: dealer });
});

module.exports = router;