import React, { useEffect } from "react";
import { injectedScript } from "./injectedScripts"; // Import the injected script

function App() {
    useEffect(() => {
        // Execute the injected script when the app loads
        if (typeof injectedScript === "function") {
            injectedScript();
        }
    }, []); // Empty dependency array ensures this runs once when the component mounts

    return (
        <div style={{ padding: "20px" }}>
            <h1>Inject JavaScript Code into Project Source</h1>
            <textarea
                rows="10"
                cols="50"
                placeholder="Type JavaScript code here..."
                id="scriptText"
            />
            <br />
            <button
                style={{ marginTop: "10px" }}
                onClick={async () => {
                    const scriptText = document.getElementById("scriptText").value;
                    try {
                        const response = await fetch("http://localhost:3001/inject-script", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ script: scriptText }),
                        });

                        if (response.ok) {
                            alert("Script injected successfully! Please rebuild and restart the server to see changes.");
                        } else {
                            alert("Failed to inject script");
                        }
                    } catch (error) {
                        console.error("Error injecting script:", error);
                        alert("Error injecting script");
                    }
                }}
            >
                Inject Script
            </button>
        </div>
    );
}

export default App;
