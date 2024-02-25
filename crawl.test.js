const { test, expect } = require("@jest/globals");
const { normalizeURL } = require("./crawl.js");

test("Converting percent-encoded triplets to uppercase", () => {
    expect(normalizeURL("http://example.com/foo%2a")).toBe(
        "http://example.com/foo%2A"
    );
});

test("Converting the scheme and host to lowercase", () => {
    expect(normalizeURL("HTTP://User@Example.COM/Foo")).toBe(
        "http://User@example.com/Foo"
    );
});

test("Decoding percent-encoded triplets of unreserved characters", () => {
    expect(normalizeURL("http://example.com/%7Efoo")).toBe(
        "http://example.com/~foo"
    );
});

test("Removing dot-segments", () => {
    expect(normalizeURL("http://example.com/foo/./bar/baz/../qux")).toBe(
        "http://example.com/foo/bar/qux"
    );
});

test('Converting an empty path to a "/" path', () => {
    expect(normalizeURL("http://example.com")).toBe("http://example.com/");
});

test("Removing the default port", () => {
    expect(normalizeURL("http://example.com:80/")).toBe("http://example.com/");
});

test("Removing the fragment", () => {
    expect(normalizeURL("http://example.com/bar.html#section1")).toBe(
        "http://example.com/bar.html"
    );
});

test("Limiting protocols", () => {
    expect(normalizeURL("https://example.com/")).toBe("http://example.com/");
});

test("Removing duplicate slashes", () => {
    expect(normalizeURL("http://example.com/foo//bar.html")).toBe(
        "http://example.com/foo/bar.html"
    );
});

test("Removing or adding “www” as the first domain label", () => {
    expect(normalizeURL("http://www.example.com/")).toBe("http://example.com/");
});
