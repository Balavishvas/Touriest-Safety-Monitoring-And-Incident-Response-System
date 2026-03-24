const axios = require('axios');

// Use environment variable, fallback to localhost for local dev
const AI_SERVICE_URL = (process.env.AI_SERVICE_URL || 'http://localhost:5001') + '/detect-anomaly/';

const checkGpsAnomaly = async (locations) => {
    try {
        const response = await axios.post(AI_SERVICE_URL, {
            locations: locations
        }, { timeout: 10000 }); // 10 second timeout
        return response.data;
    } catch (error) {
        console.error('❌ AI Service Connection Error:', error.message);
        // Return no anomaly if AI is unreachable — don't crash the app
        return { is_anomaly: false };
    }
};

module.exports = { checkGpsAnomaly };