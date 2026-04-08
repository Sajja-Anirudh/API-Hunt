const express = require('express');
const router = express.Router();
const db = require('../in-memory-db');
const verifyToken = require('../middleware/authMiddleware');

// The VULNERABLE Route - BOLA is present
// Even though the user is authenticated via verifyToken, the code blindly 
// trusts the :dealer-id parameter in the URL.
router.get('/indent-history-vulnerable/:dealer_id', verifyToken, (req, res) => {
    const requestedDealerId = parseInt(req.params.dealer_id);
    
    // FLAW: We never check if req.user.dealer_id === requestedDealerId
    const history = db.car_indents.filter(indent => indent.dealer_id === requestedDealerId);
    
    res.json({ data: history });
});

// The SECURE Route - BOLA is patched
// The code ignores the URL parameter and strictly pulls the ID from the verified JWT.
router.get('/indent-history-secure/:dealer_id', verifyToken, (req, res) => {
    const requestedDealerId = parseInt(req.params.dealer_id);
    const authenticatedDealerId = req.user.dealer_id;

    if (requestedDealerId !== authenticatedDealerId) {
         return res.status(403).json({ message: "Unauthorized: You can only view your own indent history." });
    }

    const history = db.car_indents.filter(indent => indent.dealer_id === authenticatedDealerId);
    
    res.json({ data: history });
});

module.exports = router;