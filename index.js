"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSiteUrls = void 0;
const utils_js_1 = require("./utils.js");
const axios_1 = require("axios");
const Debug = require("debug");
const debug = Debug("get-site-urls");
const searchSite = async (settings, pages, depth) => {
    const { siteUrl, maxDepth, username, password } = settings;
    const links = [...pages.queue].map(async (url) => {
        pages.queue.delete(url);
        try {
            const axiosOptions = {};
            if (username && password) {
                axiosOptions.auth = {
                    username,
                    password
                };
            }
            const { headers } = await axios_1.default.head(url, axiosOptions);
            if (headers["content-type"].includes("text/html")) {
                debug("Preparing to get the body...");
                const res = await axios_1.default(url, axiosOptions);
                const body = res.data;
                pages.found.add(url);
                utils_js_1.getLinks(body, url, utils_js_1.cleanUrl(siteUrl)).forEach(link => {
                    if (!pages.found.has(link) && !pages.errors.has(link)) {
                        pages.queue.add(link);
                    }
                });
            }
        }
        catch (error) {
            debug(error);
            pages.errors.add(url);
        }
    });
    await Promise.all(links);
    if (depth === maxDepth || pages.queue.size === 0) {
        return {
            pages: [...pages.found],
            errors: [...pages.errors]
        };
    }
    return searchSite(settings, pages, depth + 1);
};
const getSiteUrls = async (url, maxDepth = 1) => {
    const siteUrl = utils_js_1.cleanUrl(url);
    const pages = {
        queue: new Set([url]),
        found: new Set([]),
        errors: new Set([])
    };
    const { username, password } = new URL(siteUrl);
    const settings = {
        siteUrl,
        maxDepth,
        username,
        password
    };
    return await searchSite(settings, pages, 0);
};
exports.getSiteUrls = getSiteUrls;
