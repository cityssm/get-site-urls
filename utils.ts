import normalizeUrl from "normalize-url";


export const sleep = (millis: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, millis);
  });
}


/**
 * Clean the URL with normalize-url
 */
export const cleanUrl = (url: string, goUpOneLevel = false): string => {

  const urlWithoutHashAndParameters = normalizeUrl(url, {
    stripHash: true,
    removeQueryParameters: [/.*/]
  });

  if (goUpOneLevel) {
    return normalizeUrl(urlWithoutHashAndParameters + "/..");
  }

  return urlWithoutHashAndParameters;
};


const extractDomainUrl = (url: string): string => {
  return url.split("/").slice(0,3).join("/");
};


/**
 * Get all of the URLs from an array of strings
 */
export const getLinks = (data: string, pageUrl: string, siteUrl: string): string[] => {

  const domainUrl = extractDomainUrl(pageUrl);

  // Regex link pattern
  const linkPattern = /(?!.*mailto:)(?!.*tel:).<a[^>]+href=["'](.*?)["']/g;
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
      const urlToPush = cleanUrl(link);

      links.push(urlToPush);

    } else if (!link.startsWith("http") && !link.startsWith("https")) {

      // Otherwise make sure it is relative or absolute
      const pageLink = cleanUrl(link.startsWith("/")
        ? `${domainUrl}${link}`
        : `${pageUrl}/${link}`);

      links.push(pageLink);
    }

  } while (result);

  // Return the links
  return links;
};
