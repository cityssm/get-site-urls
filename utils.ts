import * as normalizeUrl from "normalize-url";


/**
 * Clean the URL with normalize-url
 */
export const cleanUrl = (url: string): string => {
  return normalizeUrl(url, {
    stripHash: true,
    removeQueryParameters: [/.*/]
  });
};


/**
 * Get all of the URLs from an array of strings
 */
export const getLinks = (data: string, pageUrl: string, siteUrl: string): string[] => {

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

    } else if (!link.startsWith("http") && !link.startsWith("https")) {

      // Otherwise make sure it is relative or absolute
      const pageLink = link.startsWith("/") ? `${siteUrl}${link}` : `${pageUrl}/${link}`;

      links.push(cleanUrl(pageLink));
    }
  } while (result);

  // Return the links
  return links;
};
