const axios = require('axios');

async function fetchPage(url) {
    console.log(`Fetching page: ${url}`); // Debug log
    try {
        const response = await axios.get(url);
        // console.log(`Page fetched: ${url}`); // Debug log
        return response.data;
    } catch (error) {
        console.error(`Error fetching page ${url}:`, error.message);
        return null;
    }
}

module.exports = fetchPage;