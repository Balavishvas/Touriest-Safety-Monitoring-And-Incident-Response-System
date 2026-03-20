// Production: Use deployed backend URL
// window.API_URL = "https://tourchain.onrender.com";

// Auto-detect: use deployed backend if not on localhost, else local
window.API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? `http://${window.location.hostname}:5000`
    : "https://touriest-safety-monitoring-and-incident.onrender.com";

window.CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
