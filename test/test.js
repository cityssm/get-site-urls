"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const index_js_1 = require("../index.js");
describe("getSiteUrls()", () => {
    it("Has results for saultstemarie.ca", async () => {
        const urls = await index_js_1.getSiteUrls("https://saultstemarie.ca");
        assert.ok(urls.pages.length > 0);
    });
    it("Has errors for saultstemarie.ca/Broken-Link.aspx", async () => {
        const urls = await index_js_1.getSiteUrls("https://saultstemarie.ca/Broken-Link-" + Date.now().toString() + ".aspx");
        assert.ok(urls.errors.length > 0);
    });
});
