class URLTracker {
    constructor() {
        this.urlsToCrawl = [];
        this.crawledUrls = new Set();
    }

    addUrl(url) {
        if (!this.crawledUrls.has(url) && !this.urlsToCrawl.includes(url)) {
            this.urlsToCrawl.push(url);
        }
    }

    getNextUrl() {
        return this.urlsToCrawl.shift();
    }

    markAsCrawled(url) {
        this.crawledUrls.add(url);
    }
}

module.exports = URLTracker;