const { argv } = require("node:process");
const { crawlPage } = require("./crawl.js");
const { printReport } = require("./report.js");

async function main() {
    if (argv.length != 3) {
        throw new Error("Invalid CLI arguments provided");
    }
    let rootURL = argv[2];
    const pages = await crawlPage(rootURL, rootURL);
    printReport(pages);
}

main();
