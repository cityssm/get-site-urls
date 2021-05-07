import axios from "axios";
import * as normalizeUrl from "normalize-url";

import type { SearchPages, SearchSettings, Pages } from "./types";
import type { AxiosRequestConfig } from "axios";

import * as Debug from "debug";
const debug = Debug("get-site-urls");

/*
 * Get all of the URLs from a website
 */

/**
 * Clean the URL with normalize-url
 */
const cleanUrl = (url: string) => {
  return normalizeUrl(url, {
    stripHash: true,
    removeQueryParameters: [/.*/]
  });
};

/**
 * Get all of the URLs from an array of strings
 */
const getLinks = (data: string, pageUrl: string, siteUrl: string): string[] => {
  // Regex link pattern
  const linkPattern = /(?!.*mailto:)(?!.*tel:).<a[^>]+href="(.*?)"/g;
  const links = [];

  let result: RegExpExecArray;

  // While there is a string to search
  do {
    // Search the string using the regex pattern
    result = linkPattern.exec(data);

    // If there is no result then end the search
    if (result === null) {
      break;
    }

    const link = result[1];

    // If the link already starts with the URL
    if (link.startsWith(siteUrl)) {
      links.push(cleanUrl(link));
    } else if (!link.startsWith("http") && !link.startsWith("https")
    ) {
      // Otherwise make sure it is relative or absolute
      const pageLink = link.startsWith("/") ? `${siteUrl}${link}` : `${pageUrl}/${link}`;

      links.push(cleanUrl(pageLink));
    }
  } while (result);

  // Return the links
  return links;
};

/**
* Fetch all of the URL's from a website
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

      const axiosOptions: AxiosRequestConfig = {};

      if (username && password) {
        axiosOptions.auth = {
          username,
          password
        };
      }

      // Get the page header so we can check the type is text/html
      const { headers } = await axios.head(url, axiosOptions);

      // If it is a HTML page get the body and search for links
      if (headers["content-type"].includes("text/html")) {

        debug("Preparing to get the body...");

        const res = await axios(url, axiosOptions);

        const body = res.data as string;

        // Add to found as it is a HTML page
        pages.found.add(url);

        // Add the unique links to the queue
        getLinks(body, url, cleanUrl(siteUrl)).forEach(link => {
          // If the link is not in error or found add to queue
          if (!pages.found.has(link) && !pages.errors.has(link)) {
            pages.queue.add(link);
          }
        });
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
 * Fetch all of the URL's from a website
 */
export const getSiteUrls = async (url: string, maxDepth = 1): Promise<Pages> => {
  const siteUrl = cleanUrl(url);

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
