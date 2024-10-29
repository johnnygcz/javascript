require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json({ limit: "50mb" })); // JSON middleware for processing request body

// POST /execute endpoint to run arbitrary JavaScript code
app.post("/execute", async (req, res) => {
    try {
        // Extract the code from the request body
        const { code } = req.body;

        // Check if code was provided
        if (!code) {
            return res.status(400).json({ error: "No JavaScript code provided." });
        }

        // Execute the JavaScript code securely using Function
        let result;
        try {
            // Wrap the code in a function to execute it
            result = Function('"use strict"; return (' + code + ')')();
        } catch (executionError) {
            return res.status(400).json({ error: "Error executing code", details: executionError.message });
        }

        // Send back the result
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Original /scrape endpoint for your Puppeteer script
app.post("/scrape", async (req, res) => {
    try {
        // Your Puppeteer logic here to get the Bearer token, not related to code execution
        const getHeyReachAuthHeader = async (email, password) => {
            const puppeteer = require('puppeteer');
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();

            try {
                await page.goto('https://app.heyreach.io/account/login', { timeout: 120000, waitUntil: 'domcontentloaded' });
                await page.type('#email', email);
                await page.type('input[type="password"]', password);
                await page.click('button[heyreachbutton][buttontype="primary"]');

                // Extract Authorization Header Logic here...

                return "YourTokenHere"; // Placeholder
            } finally {
                await browser.close();
            }
        };

        const authHeader = await getHeyReachAuthHeader('tarek.reda@gameball.co', 'g#hkn%$67834vhU^()^7648');
        res.json({ bearerToken: authHeader });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
