const url = require("node:url");

function normalizeURL(inURL) {
    const outURL = new URL(inURL);
    outURL.protocol = outURL.protocol.toLowerCase();
    outURL.hostname = outURL.hostname.toLowerCase();
    return outURL.href;
}

function percentDecodeURL(inURL) {
    let indexes = [];
    let i = -1;
    while ((i = inURL.indexOf("%", i + 1)) != -1) {
        indexes.push(i);
    }
    strings = splitAtIndexes(inURL, indexes);
}

function splitAtIndexes(string, indexes) {
    if (indexes.length === 0) {
        return [string];
    }
    let strings = [
        string.substring(indexes.slice(-1), Number(indexes.slice(-1)) + 3),
        string.substring(Number(indexes.slice(-1)) + 3),
    ];
    return [
        ...splitAtIndexes(
            string.substring(0, indexes.slice(-1)),
            indexes.slice(0, -1)
        ),
        ...strings,
    ];
}

module.exports = {
    normalizeURL,
    percentDecodeURL,
};
