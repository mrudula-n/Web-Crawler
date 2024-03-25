const axios = require('axios');
const cheerio = require('cheerio');
const { Indexer } = require('./indexer');

class URLTracker {
    constructor(baseDomain) {
        this.baseDomain = baseDomain;
        this.urlsToCrawl = new Set();
        this.crawledUrls = new Set();
        
    }

    addUrl(url) {
        const urlDomain = new URL(url).hostname;
        if (!this.crawledUrls.has(url) && this.baseDomain === urlDomain) {
            this.urlsToCrawl.add(url);
        }
    }

    getNextBatch(batchSize) {
        const batch = [];
        while (this.urlsToCrawl.size > 0 && batch.length < batchSize) {
            const nextUrl = this.urlsToCrawl.values().next().value;
            this.urlsToCrawl.delete(nextUrl);
            batch.push(nextUrl);
        }
        return batch;
    }

    markAsCrawled(url) {
        this.crawledUrls.add(url);
    }
}

class ContentStorage {
    constructor() {
        this.contents = {}; // Key: URL, Value: HTML content
    }

    storeContent(url, content) {
        this.contents[url] = content;
        // console.log(`Content stored for: ${url}`);
    }

    getContent(url) {
        return this.contents[url];
    }
}

async function fetchPage(url) {
    try {
        // console.log(`Fetching: ${url}`);
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching page ${url}:`, error.message);
        return null;
    }
}

function extractLinks(html, baseUrl) {
    const $ = cheerio.load(html);
    const links = [];
    $('a').each((index, element) => {
        let link = $(element).attr('href');
        if (link) {
            if (link.startsWith('/')) link = baseUrl + link;
            if (link.startsWith('http')) links.push(link);
        }
    });
    return links;
}

async function processUrl(url, urlTracker, contentStorage, indexer) {
    const htmlContent = await fetchPage(url);
    if (htmlContent) { // Check if content is fetched successfully
        contentStorage.storeContent(url, htmlContent);
        indexer.addToIndex(url, htmlContent);
        const links = extractLinks(htmlContent, new URL(url).origin);
        links.forEach(link => urlTracker.addUrl(link));
    }
    urlTracker.markAsCrawled(url);
}

async function startCrawling(startUrl, keyword, concurrency = 6) {
    const baseDomain = new URL(startUrl).hostname;
    const urlTracker = new URLTracker(baseDomain);
    const contentStorage = new ContentStorage();
    const indexer = new Indexer(keyword);

    urlTracker.addUrl(startUrl);

    while (urlTracker.urlsToCrawl.size > 0) {
        const urlsToFetch = urlTracker.getNextBatch(concurrency);
        await Promise.allSettled(urlsToFetch.map(url => 
            processUrl(url, urlTracker, contentStorage, indexer)
        ));
    }

    if (keyword) {
        console.log('Crawling finished. Printing URLs for the given keyword:');
        // Directly use contentStorage and indexer already available in this scope
        if (!contentStorage || !Object.keys(contentStorage.contents).length) {
          console.error("Content storage is not initialized or content is missing. Please crawl URLs before searching.");
          return; // Exit if content storage is empty or not initialized
        }
        const keywordWords = keyword.toLowerCase().split(' ');
    
        let urlsWithFrequency = []; // Store URLs with combined frequency
    
        // Iterate through all crawled URLs
        for (const [url, content] of Object.entries(contentStorage.contents)) {
          let combinedFrequency = 0;
          let foundAllWords = keywordWords.every(keywordWord => {
            const regex = new RegExp(`\\b${keywordWord}\\b`, 'gi');
            const match = content.toLowerCase().match(regex);
            const wordFrequency = match ? match.length : 0;
            combinedFrequency += wordFrequency;
            return wordFrequency > 0;
          });
    
          if (foundAllWords) {
            urlsWithFrequency.push({ url, frequency: combinedFrequency });
          }
        }
    
        // Sort by combined frequency (descending)
        urlsWithFrequency = urlsWithFrequency.sort((a, b) => b.frequency - a.frequency);
    
        if (urlsWithFrequency.length > 0) {
          console.log(`Keyword: ${keyword}`);
          console.log('URLs containing all words from the keyword:');
          urlsWithFrequency.forEach(entry => console.log(`${entry.url}`));
        } else {
          console.log(`No content found containing all words from the keyword: ${keyword}`);
        }
    } else {
        console.log("No keyword was specified for indexing.");
    }    
}

// Replace with your starting URL and keyword
startCrawling('https://www.msit.ac.in/', 'IIIT');
module.exports = { startCrawling };
