const express = require('express');
const router = express.Router();
const db = require('../in-memory-db');
const verifyToken = require('../middleware/authMiddleware');

// The VULNERABLE Route - BOLA is present (For your scanner to attack)
router.get('/indent-history-vulnerable/:dealer_id', verifyToken, (req, res) => {
    const requestedDealerId = req.params.dealer_id;
    const history = db.car_indents.filter(indent => indent.dealer_id === requestedDealerId);
    res.status(200).json({ data: history });
});

// The SECURE Route - Patched (Optional, for reference)
router.get('/indent-history-secure/:dealer_id', verifyToken, (req, res) => {
    const requestedDealerId = req.params.dealer_id;
    const authenticatedDealerId = req.user.dealer_id;

    if (requestedDealerId !== authenticatedDealerId) {
         return res.status(403).json({ message: "Unauthorized." });
    }

    const history = db.car_indents.filter(indent => indent.dealer_id === authenticatedDealerId);
    res.status(200).json({ data: history });
});

// ADD NEW RECORD (Securely uses the logged-in user's dealer_id)
router.post('/add', verifyToken, (req, res) => {
    const { model, status } = req.body;
    const authenticatedDealerId = req.user.dealer_id; // Pulled safely from JWT

    // Generate a new ID
    const newIndentId = db.car_indents.length > 0 ? Math.max(...db.car_indents.map(i => i.indent_id)) + 1 : 1000;

    const newIndent = {
        indent_id: newIndentId,
        dealer_id: authenticatedDealerId,
        model: model || "Unknown Model",
        status: status || "Pending"
    };

    db.car_indents.push(newIndent);
    res.status(201).json({ message: "Indent added", data: newIndent });
});

// DELETE RECORD
router.delete('/delete/:indent_id', verifyToken, (req, res) => {
    const indentId = req.params.indent_id;
    const authenticatedDealerId = req.user.dealer_id;

    // Find the record, ensuring it belongs to the logged-in dealer
    const index = db.car_indents.findIndex(i => i.indent_id === indentId && i.dealer_id === authenticatedDealerId);
    
    if (index === -1) {
        return res.status(404).json({ message: "Record not found or unauthorized to delete." });
    }

    db.car_indents.splice(index, 1);
    res.json({ message: "Indent deleted successfully" });
});

module.exports = router;