"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSiteUrls = void 0;
const axios_1 = require("axios");
const normalizeUrl = require("normalize-url");
const Debug = require("debug");
const debug = Debug("get-site-urls");
const cleanUrl = (url) => {
    return normalizeUrl(url, {
        stripHash: true,
        removeQueryParameters: [/.*/]
    });
};
const getLinks = (data, pageUrl, siteUrl) => {
    const linkPattern = /(?!.*mailto:)(?!.*tel:).<a[^>]+href="(.*?)"/g;
    const links = [];
    let result;
    do {
        result = linkPattern.exec(data);
        if (result === null) {
            break;
        }
        const link = result[1];
        if (link.startsWith(siteUrl)) {
            links.push(cleanUrl(link));
        }
        else if (!link.startsWith("http") && !link.startsWith("https")) {
            const pageLink = link.startsWith("/") ? `${siteUrl}${link}` : `${pageUrl}/${link}`;
            links.push(cleanUrl(pageLink));
        }
    } while (result);
    return links;
};
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
                getLinks(body, url, cleanUrl(siteUrl)).forEach(link => {
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
    const siteUrl = cleanUrl(url);
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
