import React, { useState } from "react";

function App() {
    const [scriptText, setScriptText] = useState("");

    // Handle text area changes
    const handleScriptChange = (e) => {
        setScriptText(e.target.value);
    };

    // Handle button click to inject script
    const handleInjectScript = async () => {
        try {
            // Send the script to the backend server
            const response = await fetch("http://localhost:3001/inject-script", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ script: scriptText }),
            });

            if (response.ok) {
                alert("Script injected successfully! Please commit the changes to persist.");
            } else {
                alert("Failed to inject script");
            }
        } catch (error) {
            console.error("Error injecting script:", error);
            alert("Error injecting script");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Inject JavaScript Code into Project Source</h1>
            <textarea
                value={scriptText}
                onChange={handleScriptChange}
                rows="10"
                cols="50"
                placeholder="Type JavaScript code here..."
            />
            <br />
            <button onClick={handleInjectScript} style={{ marginTop: "10px" }}>
                Inject Script
            </button>
        </div>
    );
}

export default App;
