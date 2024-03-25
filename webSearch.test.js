const URLTracker = require('./src/URLTracker');
const { processText } = require('./src/textProcessor');
const fetchPage = require('./src/crawler');
const Indexer = require('./src/indexer').Indexer;
const ContentStorage = require('./src/storage/contentStorage');

// Mock axios for fetchPage function
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: 'Mocked Page Content' })),
}));

describe('Web Search Components', () => {
  describe('URLTracker', () => {
    let tracker;

    beforeEach(() => {
      tracker = new URLTracker();
    });

    test('should add and track URLs correctly', () => {
      const url = 'https://example.com';
      tracker.addUrl(url);
      expect(tracker.getNextUrl()).toBe(url);
      expect(tracker.urlsToCrawl.length).toBe(0);
    });

    test('should mark URL as crawled', () => {
      const url = 'https://example.com';
      tracker.markAsCrawled(url);
      expect(tracker.crawledUrls.has(url)).toBeTruthy();
    });
  });

  describe('Text Processor', () => {
    test('should filter out stopwords', () => {
      const text = 'This is a test of the system.';
      const processed = processText(text);
      expect(processed).toEqual(expect.arrayContaining(['test', 'system']));
    });
  });

  describe('Fetcher', () => {
    test('should fetch page content', async () => {
      const url = 'https://example.com';
      const content = await fetchPage(url);
      expect(content).toBe('Mocked Page Content');
    });
  });

  describe('Indexer', () => {
    let indexer;

    beforeEach(() => {
      indexer = new Indexer('test');
    });

    test('should index content correctly', () => {
      const url = 'https://example.com';
      const content = 'This is a test content for indexing.';
      indexer.addToIndex(url, content);
      expect(Object.keys(indexer.getInvertedIndex()).length).toBeGreaterThan(0);
    });
  });

  describe('Content Storage', () => {
    let storage;

    beforeEach(() => {
      storage = new ContentStorage();
    });

    test('should store and index content correctly', () => {
      const url = 'https://example.com';
      const content = 'Test content for storage.';
      storage.storeContent(url, content);
      expect(storage.getContent(url)).toBe(content);
      expect(storage.getUrlsForWord('test')).toContain(url);
    });
  });
});
