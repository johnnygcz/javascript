require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse text/plain bodies
app.use(bodyParser.text({ type: "text/plain", limit: "50mb" }));

// POST /execute endpoint for executing JavaScript code
app.post("/execute", async (req, res) => {
    const jsCode = req.body; // Get the JavaScript code from the request body
    
    if (!jsCode) {
        return res.status(400).json({ error: "No JavaScript code provided." });
    }

    try {
        const result = eval(jsCode); // Execute the code (be cautious with eval)
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
