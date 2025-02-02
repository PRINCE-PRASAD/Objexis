const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './.env' });
require('./Models/db');

const app = express();
const PORT = process.env.PORT || 8080;

// Import Routes
const AuthRouter = require('./Routes/AuthRouter');
const FileRoutes = require('./Routes/FileRouter');

// Middleware
app.use(express.json());
app.use(cors());

// Health Check Route
app.get('/ping', (req, res) => {
    res.send('PONG');
});

// Routes
app.use('/auth', AuthRouter);
app.use('/api/files', FileRoutes); // 

// 404 Handler
app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
