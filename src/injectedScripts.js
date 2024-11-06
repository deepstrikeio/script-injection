export const injectedScript = () => {
    console.log('welcome to my app');
    console.log("Second script injected!");
    console.log("First script injected!");
    console.log("First script injected!");


    console.log('welcome to my app');
    console.log("Second script injected!");
    console.log("First script injected!");
    console.log("First script injected!");
    // Array of motivational quotes
    const quotes = [
        "The only way to do great work is to love what you do. - Steve Jobs",
        "Believe you can and you're halfway there. - Theodore Roosevelt",
        "Success is not the key to happiness. Happiness is the key to success. - Albert Schweitzer",
        "The harder you work for something, the greater you'll feel when you achieve it.",
        "Dream bigger. Do bigger."
    ];

// Function to print a random quote to the console
    function printRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        console.log(quotes[randomIndex]);
    }

// Execute the function
    printRandomQuote();
    // Array of motivational quotes
};