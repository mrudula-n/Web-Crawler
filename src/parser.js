function extractLinks(html, baseUrl, keyword) {
    const $ = cheerio.load(html);
    const links = [];
    const contentContainsKeyword = $('body').text().toLowerCase().includes(keyword.toLowerCase());

    if (contentContainsKeyword) {
        $('a').each((index, element) => {
            // console.log(`Link found: ${link}`);
            const link = $(element).attr('href');
            if (link && (link.startsWith('http') || link.startsWith('https'))) {
                links.push(link);
            } else if (link.startsWith('/')) {
                links.push(baseUrl + link);
            }
        });
    }
    return links;
}
