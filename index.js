require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json({ limit: "50mb" })); // JSON parser
app.use(bodyParser.text({ type: "text/plain", limit: "50mb" })); // Plain text parser

// Route to execute JavaScript code
app.post("/execute", (req, res) => {
    // Get the JavaScript code from the body of the request
    const jsCode = req.body;

    // Check if the code was provided
    if (!jsCode || jsCode.trim() === "") {
        return res.status(400).json({ error: "No JavaScript code provided." });
    }

    try {
        // Execute the JavaScript code using `eval` (for demonstration purposes)
        const result = eval(jsCode);
        return res.status(200).json({ result: result });
    } catch (error) {
        // Handle errors during execution
        return res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
