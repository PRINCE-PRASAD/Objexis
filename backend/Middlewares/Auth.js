require('dotenv').config();
const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Unauthorized, JWT token is required' });
    }

    const token = authHeader.split(' ')[1]; // Extract actual token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT:", decoded);  // Log the decoded JWT
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Unauthorized, JWT token is invalid or expired' });
    }
};

module.exports = ensureAuthenticated;


