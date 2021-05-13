"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLinks = exports.cleanUrl = void 0;
const normalizeUrl = require("normalize-url");
const cleanUrl = (url) => {
    return normalizeUrl(url, {
        stripHash: true,
        removeQueryParameters: [/.*/]
    });
};
exports.cleanUrl = cleanUrl;
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
            links.push(exports.cleanUrl(link));
        }
        else if (!link.startsWith("http") && !link.startsWith("https")) {
            const pageLink = link.startsWith("/") ? `${siteUrl}${link}` : `${pageUrl}/${link}`;
            links.push(exports.cleanUrl(pageLink));
        }
    } while (result);
    return links;
};
exports.getLinks = getLinks;
