function printReport(pages) {
    console.log(`\n------ Starting Report ------`);
    sortedPages = [];
    for (const [key, value] of Object.entries(pages)) {
        sortedPages.push([key, value]);
    }
    sortedPages.sort(function (a, b) {
        return b[1] - a[1];
    });
    for (let sortedPage of sortedPages) {
        console.log(
            `------ Found ${sortedPage[1]} internal links to ${sortedPage[0]} ------`
        );
    }
}

module.exports = {
    printReport,
};
