import { cleanUrl, getLinks } from "./utils.js";
import axios from "axios";
import Debug from "debug";
const debug = Debug("get-site-urls");
const searchSite = async (settings, pages, depth) => {
    const { siteUrl, maxDepth, username, password } = settings;
    const links = [...pages.queue].map(async (url) => {
        pages.queue.delete(url);
        try {
            const axiosOptions = {
                timeout: 30000,
                httpAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
            };
            if (username && password) {
                axiosOptions.auth = {
                    username,
                    password
                };
            }
            const { headers } = await axios.head(url, axiosOptions);
            if (headers["content-type"].includes("text/html")) {
                debug("Preparing to get the body...");
                const response = await axios(url, axiosOptions);
                const body = response.data;
                pages.found.add(url);
                for (const link of getLinks(body, url, cleanUrl(siteUrl))) {
                    if (!pages.found.has(link) && !pages.errors.has(link)) {
                        pages.queue.add(link);
                    }
                }
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
export const getSiteUrls = async (url, maxDepth = 1) => {
    const goUpOneLevel = url.includes("?") && !(url.includes("/?"));
    const siteUrl = cleanUrl(url, goUpOneLevel);
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
