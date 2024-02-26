const { test, expect } = require("@jest/globals");
const { normalizeURL, getURLsFromHTML } = require("./crawl.js");

test("Converting percent-encoded triplets to uppercase", () => {
    const input = "http://example.com/foo%2a";
    const output = normalizeURL(input);
    const expected = "http://example.com/foo%2A";
    expect(output).toBe(expected);
});

test("Converting the scheme and host to lowercase", () => {
    const input = "HTTP://User@Example.COM/Foo";
    const output = normalizeURL(input);
    const expected = "http://User@example.com/Foo";
    expect(output).toBe(expected);
});

test("Decoding percent-encoded triplets of unreserved characters", () => {
    const input = "http://example.com/%7Efoo";
    const output = normalizeURL(input);
    const expected = "http://example.com/~foo";
    expect(output).toBe(expected);
});

test("Removing dot-segments", () => {
    const input = "http://example.com/foo/./bar/baz/../qux";
    const output = normalizeURL(input);
    const expected = "http://example.com/foo/bar/qux";
    expect(output).toBe(expected);
});

test('Converting an empty path to a "/" path', () => {
    const input = "http://example.com";
    const output = normalizeURL(input);
    const expected = "http://example.com/";
    expect(output).toBe(expected);
});

test("Removing the default port", () => {
    const input = "http://example.com:80/";
    const output = normalizeURL(input);
    const expected = "http://example.com/";
    expect(output).toBe(expected);
});

test("Removing the fragment", () => {
    const input = "http://example.com/bar.html#section1";
    const output = normalizeURL(input);
    const expected = "http://example.com/bar.html";
    expect(output).toBe(expected);
});

test("Limiting protocols", () => {
    const input = "https://example.com/";
    const output = normalizeURL(input);
    const expected = "http://example.com/";
    expect(output).toBe(expected);
});

test("Removing duplicate slashes", () => {
    const input = "http://example.com/foo//bar.html";
    const output = normalizeURL(input);
    const expected = "http://example.com/foo/bar.html";
    expect(output).toBe(expected);
});

test("Removing or adding “www” as the first domain label", () => {
    const input = "http://www.example.com/";
    const output = normalizeURL(input);
    const expected = "http://example.com/";
    expect(output).toBe(expected);
});

test("getURLsFromHTML absolute", () => {
    const inputURL = "https://blog.boot.dev";
    const inputBody =
        '<html><body><a href="https://blog.boot.dev"><span>Boot.dev></span></a></body></html>';
    const actual = getURLsFromHTML(inputBody, inputURL);
    const expected = ["https://blog.boot.dev/"];
    expect(actual).toEqual(expected);
});

test("getURLsFromHTML relative", () => {
    const inputURL = "https://blog.boot.dev";
    const inputBody =
        '<html><body><a href="/path/one"><span>Boot.dev></span></a></body></html>';
    const actual = getURLsFromHTML(inputBody, inputURL);
    const expected = ["https://blog.boot.dev/path/one"];
    expect(actual).toEqual(expected);
});

test("getURLsFromHTML both", () => {
    const inputURL = "https://blog.boot.dev";
    const inputBody =
        '<html><body><a href="/path/one"><span>Boot.dev></span></a><a href="https://other.com/path/one"><span>Boot.dev></span></a></body></html>';
    const actual = getURLsFromHTML(inputBody, inputURL);
    const expected = [
        "https://blog.boot.dev/path/one",
        "https://other.com/path/one",
    ];
    expect(actual).toEqual(expected);
});

test("getURLsFromHTML handle error", () => {
    const inputURL = "https://blog.boot.dev";
    const inputBody =
        '<html><body><a href="path/one"><span>Boot.dev></span></a></body></html>';
    const actual = getURLsFromHTML(inputBody, inputURL);
    const expected = [];
    expect(actual).toEqual(expected);
});
