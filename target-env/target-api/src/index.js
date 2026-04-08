const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const indentHistoryRoutes = require('./routes/indent-history');
const dealerRoutes = require('./routes/dealer');

app.use('/auth', authRoutes);
app.use('/indent-history', indentHistoryRoutes);
app.use('/dealer', dealerRoutes);

app.get('/', (req, res) => {
    res.json({ message: "Automobile Dealership API Online. Awaiting requests." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[Target API] Server running on port ${PORT}`);
});