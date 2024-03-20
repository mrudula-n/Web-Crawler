Feature: Web Crawling, Indexing, and Ranking

  Scenario: Crawling webpages
    Given I have specified the URL "https://www.msit.ac.in/" to start crawling
    When the crawler processes webpages starting from the specified URL
    Then it should track URLs, fetch pages, parse HTML content, and store the content

  Scenario: Indexing content by keyword
    Given content from multiple webpages has been stored
    When I specify "curriculum" as the keyword for indexing
    Then the indexer should identify and list all pages that contain the keyword "curriculum"

  Scenario: Ranking pages by relevance
    Given a list of pages that contain the keyword "curriculum"
    When the ranker evaluates the list for keyword relevance
    Then it should organize the pages in order of decreasing relevance to "curriculum"
