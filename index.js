require('dotenv').config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;

// Raw body parser middleware
app.use(express.raw({
    type: '*/*',
    limit: '50mb'
}));

// Middleware to handle the raw body
app.use((req, res, next) => {
    if (req.method === 'POST') {
        try {
            // Convert Buffer to string and handle encoding
            req.body = req.body.toString('utf8');
            // Normalize line endings
            req.body = req.body.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        } catch (error) {
            console.error('Body parsing error:', error);
            return res.status(400).json({ error: 'Invalid body content' });
        }
    }
    next();
});

// POST /execute endpoint for executing JavaScript code
app.post("/execute", async (req, res) => {
    const jsCode = req.body;
    
    if (!jsCode) {
        return res.status(400).json({ error: "No JavaScript code provided." });
    }

    try {
        console.log('Received code:', jsCode); // Debug log
        const result = eval(jsCode);
        res.json({ 
            result,
            receivedCode: jsCode // Debug info
        });
    } catch (error) {
        console.error('Execution error:', error);
        res.status(500).json({ 
            error: error.message,
            receivedCode: jsCode // Debug info
        });
    }
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Server Error:', error);
    res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
