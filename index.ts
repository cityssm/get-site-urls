import { cleanUrl, getLinks } from "./utils.js";
import axios from "axios";

import type { SearchPages, SearchSettings, Pages } from "./types";
import type { AxiosRequestConfig } from "axios";

import Debug from "debug";
const debug = Debug("get-site-urls");


/**
* Fetch all of the URLs from a website
*/
const searchSite = async (settings: SearchSettings, pages: SearchPages, depth: number): Promise<Pages> => {
  const {
    siteUrl,
    maxDepth,
    username,
    password
  } = settings;

  // For each url fetch the page data
  const links = [...pages.queue].map(async url => {

    // Delete the URL from queue
    pages.queue.delete(url);

    try {

      const axiosOptions: AxiosRequestConfig = {
        timeout: 30_000,
        httpAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
      };

      if (username && password) {
        axiosOptions.auth = {
          username,
          password
        };
      }

      // Get the page header so we can check the type is text/html
      const { headers } = await axios.head(url, axiosOptions);

      // If it is an HTML page get the body and search for links
      if (headers["content-type"].includes("text/html")) {

        debug("Preparing to get the body...");

        const response = await axios(url, axiosOptions);

        const body = response.data as string;

        // Add to found as it is a HTML page
        pages.found.add(url);

        // Add the unique links to the queue
        for (const link of getLinks(body, url, cleanUrl(siteUrl))) {
          // If the link is not in error or found add to queue
          if (!pages.found.has(link) && !pages.errors.has(link)) {
            pages.queue.add(link);
          }
        }
      }
    } catch (error) {
      debug(error);
      pages.errors.add(url);
    }
  });

  await Promise.all(links);

  // If we have reached maximum depth or the queue is empty
  // maxDepth + 1 as the first page doesn't count
  if (depth === maxDepth || pages.queue.size === 0) {
    return {
      pages: [...pages.found],
      errors: [...pages.errors]
    };
  }

  // Start the search again as the queue has more to search
  return searchSite(settings, pages, depth + 1);
};


/**
 * Fetch all of the URLs from a website
 */
export const getSiteUrls = async (url: string, maxDepth = 1): Promise<Pages> => {

  const goUpOneLevel = url.includes("?") && !(url.includes("/?"));

  const siteUrl = cleanUrl(url, goUpOneLevel);

  const pages: SearchPages = {
    queue: new Set<string>([url]),
    found: new Set<string>([]),
    errors: new Set<string>([])
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
