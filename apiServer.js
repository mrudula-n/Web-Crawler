const express = require('express');
const bodyParser = require('body-parser');
const { startCrawling } = require('./src/index');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Serve a welcome message at the root URL
app.get('/', (req, res) => {
    res.send(`<center><h1>Welcome to Search Engine Application</h1> \n <h3>Please Enter the URL and Keyword<h1><center>`);
});

// Endpoint to start crawling
app.post('/startCrawling', async (req, res) => {
    const { startUrl, keyword } = req.body;
    
    if (!startUrl || !keyword) {
        return res.status(400).send({ message: 'Missing startUrl or keyword in request body.' });
    }

    try {
        await startCrawling(startUrl, keyword);
        res.send({ message: 'Crawling done successfully.' });
    } catch (error) {
        console.error('Error during crawling:', error);
        res.status(500).send({ message: 'Error during crawling process.' });
    }
});

app.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`);
});
