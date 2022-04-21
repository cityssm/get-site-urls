import normalizeUrl from "normalize-url";
export const sleep = (millis) => {
    return new Promise((resolve) => {
        setTimeout(resolve, millis);
    });
};
export const cleanUrl = (url, goUpOneLevel = false) => {
    const urlWithoutHashAndParameters = normalizeUrl(url, {
        stripHash: true,
        removeQueryParameters: [/.*/]
    });
    if (goUpOneLevel) {
        return normalizeUrl(urlWithoutHashAndParameters + "/..");
    }
    return urlWithoutHashAndParameters;
};
const extractDomainUrl = (url) => {
    return url.split("/").slice(0, 3).join("/");
};
export const getLinks = (data, pageUrl, siteUrl) => {
    const domainUrl = extractDomainUrl(pageUrl);
    const linkPattern = /(?!.*mailto:)(?!.*tel:).<a[^>]+href=["'](.*?)["']/g;
    const links = [];
    let result;
    do {
        result = linkPattern.exec(data);
        if (result === null) {
            break;
        }
        const link = result[1];
        if (link.startsWith(siteUrl)) {
            const urlToPush = cleanUrl(link);
            links.push(urlToPush);
        }
        else if (!link.startsWith("http") && !link.startsWith("https")) {
            const pageLink = cleanUrl(link.startsWith("/")
                ? `${domainUrl}${link}`
                : `${pageUrl}/${link}`);
            links.push(pageLink);
        }
    } while (result);
    return links;
};
