const jwt = require('jsonwebtoken');
const SECRET_KEY = "super_secret_hackathon_key"; 

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expecting "Bearer <token>"

    if (!token) {
        return res.status(403).json({ message: "A token is required for authentication" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        // Attach decoded payload to the request object
        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid Token" });
    }
};

module.exports = verifyToken;