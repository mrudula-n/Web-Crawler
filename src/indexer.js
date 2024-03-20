const { processText } = require('./textProcessor');

class Indexer {
    constructor(keyword) { // Make sure to include 'keyword' parameter here
        this.invertedIndex = {};
        this.keyword = keyword ? keyword.toLowerCase() : null; // Ensure keyword is properly handled
    }
    
    addToIndex(url, content) {
        if (!this.keyword) return; // No keyword, skip indexing
      
        const processedText = processText(content);
        const keywordWords = this.keyword.toLowerCase().split(' '); // Split keyword into words
      
        keywordWords.forEach(keywordWord => {
          if (!this.invertedIndex[keywordWord]) {
            this.invertedIndex[keywordWord] = new Set();
          }
      
          const wordCount = (processedText.filter(word => word === keywordWord)).length; // Count keyword occurrences
      
          if (this.invertedIndex[keywordWord].has(url)) {
            // Update existing entry with frequency (optional)
            this.invertedIndex[keywordWord].set(url, this.invertedIndex[keywordWord].get(url) + wordCount);
          } else {
            this.invertedIndex[keywordWord].add(url, wordCount); // Add URL with initial frequency
          }
        });
      }
      
    
    getInvertedIndex() {
        return this.invertedIndex;
    }

    serializeIndex() {
        const serialized = {};
        for (const [word, urls] of Object.entries(this.invertedIndex)) {
            serialized[word] = Array.from(urls);
        }
        return serialized;
    }
    
}

module.exports = { Indexer };
