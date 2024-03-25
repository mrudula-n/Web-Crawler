const { processText } = require('../textProcessor');

class ContentStorage {
    constructor() {
        this.contents = {}; // Key: URL, Value: HTML content
        this.invertedIndex = {}; // Key: word, Value: Set of URLs
    }

    storeContent(url, content) {
        this.contents[url] = content;
        // console.log(`Content stored for: ${url}`);
        this.indexContent(url, content); // Ensure this calls indexContent correctly
    }

    indexContent(url, content) {
        // Assuming processText correctly returns an array of words
        const words = processText(content); 
        words.forEach(word => {
            if (!this.invertedIndex[word]) {
                this.invertedIndex[word] = new Set(); // Initialize as an empty Set
            }
            this.invertedIndex[word].add(url); // This should now always work
        });
    }

    getContent(url) {
        return this.contents[url];
    }

    getUrlsForWord(word) {
        if (this.invertedIndex[word]) {
            return Array.from(this.invertedIndex[word]);
        }
        return [];
    }
}

module.exports = ContentStorage;
