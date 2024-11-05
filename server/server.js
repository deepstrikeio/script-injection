const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors"); // Import cors

const app = express();
const PORT = 3001;

// Use cors middleware to allow cross-origin requests
app.use(cors());

// Path to the injected scripts file in the React source folder
const scriptFilePath = path.join(__dirname, "../src/injectedScripts.js");

// Ensure `injectedScripts.js` exists with a placeholder
if (!fs.existsSync(scriptFilePath)) {
    fs.writeFileSync(scriptFilePath, `export const injectedScript = () => {};`, "utf8");
}

// Middleware to parse JSON request bodies
app.use(express.json());

// Define the /inject-script endpoint to save the injected script to `injectedScripts.js`
app.post("/inject-script", (req, res) => {
    const injectedScript = req.body.script;

    // Wrap the script in a function format to make it importable in React
    const scriptContent = `export const injectedScript = () => { ${injectedScript} };`;

    // Write the script content to the `injectedScripts.js` file
    fs.writeFile(scriptFilePath, scriptContent, "utf8", (err) => {
        if (err) {
            console.error("Error saving script:", err);
            return res.status(500).send("Failed to save script");
        }

        console.log("Script saved successfully to injectedScripts.js");
        res.status(200).send("Script saved successfully");
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
