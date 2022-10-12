import { cleanUrl, getLinks, sleep } from "./utils.js";
import * as config from "./config.js";
import { Semaphore } from "async-mutex";
import axios from "axios";
import Debug from "debug";
const debug = Debug("get-site-urls");
const searchSite = async (settings, pages, depth) => {
    const { siteUrl, maxDepth, username, password } = settings;
    const lock = new Semaphore(config.maxRequestCount);
    let sleepMillis = 0;
    let throttleSleepMillis = config.throttleSleepMillis;
    const links = [...pages.queue].map(async (url) => {
        pages.queue.delete(url);
        sleepMillis += throttleSleepMillis;
        await sleep(sleepMillis);
        const [_lockValue, lockRelease] = await lock.acquire();
        try {
            const axiosOptions = {
                timeout: config.axios_requestTimeoutMillis,
                httpAgent: config.axios_httpAgent
            };
            if (username && password) {
                axiosOptions.auth = {
                    username,
                    password
                };
            }
            const headerStartMillis = Date.now();
            debug("Getting headers: " + url);
            const { headers } = await axios.head(url, axiosOptions);
            throttleSleepMillis = (throttleSleepMillis + (Date.now() - headerStartMillis)) / 2;
            if (headers["content-type"].includes("text/html")) {
                await sleep(throttleSleepMillis);
                debug("Preparing to get the body: " + url);
                const response = await axios(url, axiosOptions);
                const body = response.data;
                pages.found.add(url);
                const pageLinks = getLinks(body, url, cleanUrl(siteUrl));
                for (const link of pageLinks) {
                    if (!pages.found.has(link) && !pages.errors.has(link)) {
                        pages.queue.add(link);
                    }
                }
            }
        }
        catch (error) {
            debug("Error loading URL: " + url);
            debug(error);
            pages.errors.add(url);
        }
        finally {
            lockRelease();
        }
    });
    await Promise.all(links);
    if (depth === maxDepth || pages.queue.size === 0) {
        return {
            pages: [...pages.found],
            errors: [...pages.errors]
        };
    }
    return await searchSite(settings, pages, depth + 1);
};
export const getSiteUrls = async (url, maxDepth = 1) => {
    const goUpOneLevel = url.includes("?") && !url.includes("/?");
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
