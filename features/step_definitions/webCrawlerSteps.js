const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const { crawl, indexContent, rankPages } = require('../../webCrawlerActions');

let crawlResult, indexResult, rankResult;

Given('I have specified the URL {string} to start crawling', function (url) {
  this.url = url;
});

When('the crawler processes webpages starting from the specified URL', async function () {
  crawlResult = await crawl(this.url);
});

Then('it should track URLs, fetch pages, parse HTML content, and store the content', function () {
  assert.ok(crawlResult.trackedUrls.length > 0);
  assert.ok(crawlResult.fetchedPages.length > 0);
  assert.ok(crawlResult.parsedContent.length > 0);
});

Given('content from multiple webpages has been stored', function () {
  // This step is simulated by assuming that content has already been stored
});

When('I specify {string} as the keyword for indexing', function (keyword) {
  indexResult = indexContent(keyword);
});

Then('the indexer should identify and list all pages that contain the keyword {string}', function (keyword) {
  assert.ok(indexResult.every(url => url.includes(keyword)));
});

Given('a list of pages that contain the keyword {string}', function (keyword) {
  this.pages = indexContent(keyword); // Simulate retrieving pages that contain the keyword
});

When('the ranker evaluates the list for keyword relevance', function () {
  rankResult = rankPages(this.pages);
});

Then('it should organize the pages in order of decreasing relevance to {string}', function (keyword) {
  // Assuming rankResult is an array of objects { url: String, relevanceScore: Number }
  // and relevanceScore is higher for more relevant pages.
  assert.strictEqual(rankResult[0].relevanceScore >= rankResult[rankResult.length - 1].relevanceScore, true, `First page is not more relevant than last page for keyword: ${keyword}`);
});

