export const injectedScript = () => {
console.log('welcome to my app');
  console.log("Second script injected!");
  console.log("First script injected!");
  console.log("First script injected!");

const script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
script.type = 'text/javascript';
};