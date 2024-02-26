const { argv } = require("node:process");
const { crawlPage } = require("./crawl.js");

async function main() {
    if (argv.length != 3) {
        throw new Error("Invalid CLI arguments provided");
    }
    let rootURL = argv[2];
    const pages = await crawlPage(rootURL, rootURL);
    console.log(pages);
}

main();
