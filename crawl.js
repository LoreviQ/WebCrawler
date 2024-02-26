const url = require("node:url");
const { JSDOM } = require("jsdom");

const decodingMap = {
    "%41": "A",
    "%42": "B",
    "%43": "C",
    "%44": "D",
    "%45": "E",
    "%46": "F",
    "%47": "G",
    "%48": "H",
    "%49": "I",
    "%4A": "J",
    "%4B": "K",
    "%4C": "L",
    "%4D": "M",
    "%4E": "N",
    "%4F": "O",
    "%50": "P",
    "%51": "Q",
    "%52": "R",
    "%53": "S",
    "%54": "T",
    "%55": "U",
    "%56": "V",
    "%57": "W",
    "%58": "X",
    "%59": "Y",
    "%5A": "Z",
    "%61": "a",
    "%62": "b",
    "%63": "c",
    "%64": "d",
    "%65": "e",
    "%66": "f",
    "%67": "g",
    "%68": "h",
    "%69": "i",
    "%6A": "j",
    "%6B": "k",
    "%6C": "l",
    "%6D": "m",
    "%6E": "n",
    "%6F": "o",
    "%70": "p",
    "%71": "q",
    "%72": "r",
    "%73": "s",
    "%74": "t",
    "%75": "u",
    "%76": "v",
    "%77": "w",
    "%78": "x",
    "%79": "y",
    "%7A": "z",
    "%30": "0",
    "%31": "1",
    "%32": "2",
    "%33": "3",
    "%34": "4",
    "%35": "5",
    "%36": "6",
    "%37": "7",
    "%38": "8",
    "%39": "9",
    "%5F": "_",
    "%2E": ".",
    "%7E": "~",
    "%2D": "-",
};

async function crawlPage(rootURL, currentURL, pages = null) {
    rootURL = normalizeURL(rootURL);
    currentURL = normalizeURL(currentURL);
    if (new URL(rootURL).hostname != new URL(currentURL).hostname) {
        return pages;
    }
    console.log(`------ Crawling ------ ${currentURL}`);
    if (!pages) {
        pages = {};
        pages[currentURL] = 0;
    } else if (currentURL in pages) {
        pages[currentURL]++;
        return pages;
    } else {
        pages[currentURL] = 1;
    }
    try {
        const response = await fetch(rootURL);
        if (response.status >= 400) {
            throw Error(`HTTP Error Code: ${response.status}`);
        }
        if (!response.headers.get("Content-Type").includes("text/html")) {
            throw Error(`Content type is not 'text/html'`);
        }
        htmlBody = await response.text();
    } catch (err) {
        console.log(err.message);
        return pages;
    }
    const newURLs = getURLsFromHTML(htmlBody, rootURL);
    for (let newURL of newURLs) {
        pages = await crawlPage(rootURL, newURL, pages);
    }
    return pages;
}

function getURLsFromHTML(htmlBody, baseURL) {
    const dom = new JSDOM(htmlBody);
    const hyperlinks = dom.window.document.querySelectorAll("a");
    let output = [];
    for (let hyperlink of hyperlinks) {
        try {
            hyperlink = hyperlink.href;
            let newURL =
                hyperlink[0] === "/"
                    ? new URL(hyperlink, baseURL)
                    : new URL(hyperlink);
            output = [...output, newURL.href];
        } catch (err) {
            console.log(`${err.message}: ${hyperlink.href}`);
        }
    }
    return output;
}

function normalizeURL(inURL) {
    const outURL = new URL(percentDecodeURL(inURL));
    outURL.protocol = outURL.protocol.toLowerCase();
    outURL.hostname = outURL.hostname.toLowerCase().replace("www.", "");
    outURL.pathname = outURL.pathname.replace("//", "/");
    outURL.hash = "";
    if (outURL.protocol === "https:") {
        outURL.protocol = "http:";
    }
    return outURL.href;
}

function indexesOf(string, substring) {
    let indexes = [];
    let i = -1;
    while ((i = string.indexOf(substring, i + 1)) != -1) {
        indexes.push(i);
    }
    return indexes;
}

function percentDecodeURL(inURL) {
    const indexes = indexesOf(inURL, "%");
    const strings = splitAtIndexesPercent(inURL, indexes);
    for (let i in strings) {
        if (strings[i].includes("%")) {
            strings[i] = strings[i].toUpperCase();
            if (strings[i] in decodingMap) {
                strings[i] = decodingMap[strings[i]];
            }
        }
    }
    return strings.join("");
}

function splitAtIndexesPercent(string, indexes) {
    if (indexes.length === 0) {
        return [string];
    }
    const strings = [
        string.substring(indexes.slice(-1), Number(indexes.slice(-1)) + 3),
        string.substring(Number(indexes.slice(-1)) + 3),
    ];
    return [
        ...splitAtIndexesPercent(
            string.substring(0, indexes.slice(-1)),
            indexes.slice(0, -1)
        ),
        ...strings,
    ];
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage,
};
