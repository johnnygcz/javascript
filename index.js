require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 4000;

// Configure express to handle larger payloads and preserve raw body
app.use(express.json({
    limit: '50mb',
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    }
}));

// Configure body-parser with proper encoding
app.use(bodyParser.text({ 
    type: "text/plain", 
    limit: "50mb",
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    }
}));

// Add middleware to handle content type negotiation
app.use((req, res, next) => {
    // Preserve original characters in the body
    if (req.method === 'POST') {
        req.body = req.rawBody || req.body;
    }
    next();
});

// POST /execute endpoint for executing JavaScript code
app.post("/execute", async (req, res) => {
    let jsCode = req.body;
    
    if (!jsCode) {
        return res.status(400).json({ error: "No JavaScript code provided." });
    }

    try {
        // Handle different input types
        if (typeof jsCode === 'object') {
            jsCode = JSON.stringify(jsCode);
        }

        // Ensure proper string handling
        jsCode = jsCode.toString();
        
        // Execute the code (be cautious with eval)
        const result = eval(jsCode);
        
        // Handle different types of results
        const response = {
            result: typeof result === 'undefined' ? null : result
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ 
            error: error.message,
            details: error.stack
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server Error:', error);
    res.status(500).json({
        error: 'Internal Server Error',
        message: error.message,
        details: error.stack
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
