"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const index_js_1 = require("../index.js");
describe("getSiteUrls()", () => {
    it("Has results for saultstemarie.ca", async () => {
        const urls = await index_js_1.getSiteUrls("https://saultstemarie.ca");
        assert.ok(urls);
    });
});
