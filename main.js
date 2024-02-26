const { argv } = require("node:process");

function main() {
    if (argv.length != 3) {
        throw new Error("Invalid CLI arguments provided");
    }
    rootURL = argv[2];
    console.log(`Crawling at: ${rootURL}`);
}

main();
