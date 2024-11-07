const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process"); // Import exec for executing shell commands
const cors = require("cors");

const app = express();
const PORT = 3001;

// Path to the injected scripts file in the React source folder
const scriptFilePath = path.join(__dirname, "../src/injectedScripts.js");

// Use cors middleware to allow cross-origin requests
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Ensure `injectedScripts.js` exists with a placeholder
if (!fs.existsSync(scriptFilePath)) {
    fs.writeFileSync(scriptFilePath, `export const injectedScript = () => {\n  // Placeholder for injected code\n};\n`, "utf8");
}

// Define the /inject-script endpoint to save the injected script to `injectedScripts.js`
app.post("/inject-script", (req, res) => {
    const newScript = req.body.script;

    if (!newScript) {
        return res.status(400).send("No script provided");
    }

    // Read the current content of `injectedScripts.js`
    fs.readFile(scriptFilePath, "utf8", (readErr, data) => {
        if (readErr) {
            console.error("Error reading injectedScripts.js:", readErr);
            return res.status(500).send("Failed to read existing script file");
        }

        // Extract the function content if exists, and append the new script
        const updatedScriptContent = data.replace(
            /export const injectedScript = \(\) => \{([\s\S]*)\};/,
            (match, existingCode) => {
                return `export const injectedScript = () => {\n${existingCode.trim()}\n  ${newScript}\n};`;
            }
        );

        // Write the updated content back to `injectedScripts.js`
        fs.writeFile(scriptFilePath, updatedScriptContent, "utf8", (writeErr) => {
            if (writeErr) {
                console.error("Error saving script:", writeErr);
                return res.status(500).send("Failed to save script : "+writeErr);
            }

            console.log("Script appended successfully to injectedScripts.js");
            res.status(200).send("Script appended successfully");
        });
    });
});

// Define /deploy endpoint to commit changes, build, and restart the server
app.post("/deploy", (req, res) => {
    // Step 1: Add all changes to Git
    exec("git add .", { cwd: path.join(__dirname, "..") }, (addErr) => {
        if (addErr) {
            console.error("Error adding changes to Git:", addErr);
            return res.status(500).send("Failed to add changes to Git");
        }

        // Step 2: Commit the changes and append a random nunmber to the commit message
        const commitMessage = "Auto-commit: Injected new script and ready for deployment".replace(/\s/g, "-") + Math.floor(Math.random() * 1000);
        exec(`git commit -m "${commitMessage}"`, { cwd: path.join(__dirname, "..") }, (commitErr) => {
            if (commitErr) {
                console.error("Error committing changes:", commitErr);
                return res.status(500).send("Failed to commit changes");
            }

            exec(`git push origin main`, { cwd: path.join(__dirname, "..") }, (commitErr) => {
                if (commitErr) {
                    console.error("Error pushing changes:", commitErr);
                    return res.status(500).send("Failed to push changes");
                }

                res.status(200).send("App deployed successfully!");
            });
        });
    });
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
