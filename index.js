require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.text({ type: "text/plain", limit: "50mb" }));

// POST /execute endpoint to run JavaScript code
app.post("/execute", async (req, res) => {
    const jsCode = req.body; // Get the JavaScript code from the request body

    // Check if the code is provided
    if (!jsCode) {
        return res.status(400).json({ error: "No JavaScript code provided." });
    }

    try {
        // Evaluate the JavaScript code safely (consider security implications of eval)
        const result = eval(jsCode); // Be cautious with eval in production code
        res.json({ result }); // Send the result back as JSON
    } catch (error) {
        res.status(500).json({ error: error.message }); // Send error message if evaluation fails
    }
});

// Start the server
app.listen(PORT, () => {
    // Server is running
});
