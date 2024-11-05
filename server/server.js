const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process"); // Import exec for executing shell commands
const cors = require("cors");

const app = express();
const PORT = 3001;

// Path to the injected scripts file in the React source folder
const scriptFilePath = path.join(__dirname, "../src/injectedScripts.js");

// Use cors middleware to hallow cross-origin requests
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Ensure `injectedScripts.js` exists with a placeholder
if (!fs.existsSync(scriptFilePath)) {
    fs.writeFileSync(scriptFilePath, `export const injectedScript = () => {};`, "utf8");
}

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

        // Run the build command to rebuild the React app
        exec("npm run build", { cwd: path.join(__dirname, "..") }, (buildErr, stdout, stderr) => {
            if (buildErr) {
                console.error("Error during build:", buildErr);
                return res.status(500).send("Failed to rebuild the app");
            }
            console.log("Build completed successfully");
            console.log(stdout);

            // Optionally restart the server here (requires a proper setup to avoid stopping this script itself)
            res.status(200).send("Script saved and app rebuilt successfully");
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
