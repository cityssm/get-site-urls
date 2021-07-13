# get-site-urls

[![npm (scoped)](https://img.shields.io/npm/v/@cityssm/get-site-urls)](https://www.npmjs.com/package/@cityssm/get-site-urls)
[![Codacy grade](https://img.shields.io/codacy/grade/0d191d20c48b4203a35590490a64564f)](https://app.codacy.com/gh/cityssm/get-site-urls/dashboard)
[![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/cityssm/get-site-urls)](https://codeclimate.com/github/cityssm/get-site-urls)
[![Code Climate coverage](https://img.shields.io/codeclimate/coverage/cityssm/get-site-urls)](https://codeclimate.com/github/cityssm/get-site-urls)
[![AppVeyor](https://img.shields.io/appveyor/build/dangowans/get-site-urls)](https://ci.appveyor.com/project/dangowans/get-site-urls)
[![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/cityssm/get-site-urls)](https://app.snyk.io/org/cityssm/project/9aa5a922-237a-489b-a420-b8265e0e2000)

Get all of the URLs from a website.

Forked from [alex-page/get-site-urls](https://github.com/alex-page/get-site-urls).

## Install

```sh
npm install @cityssm/get-site-urls
```

## Usage

```javascript
import { 'getSiteUrls' } from "@cityssm/get-site-urls";

getSiteUrls( 'https://saultstemarie.ca' )
	.then( links => console.log( links ) );

( async () => {
	const links = await getSiteUrls( 'https://saultstemarie.ca' );
	console.log( links );

/*
{
	pages: [
		'https://saultstemarie.ca',
		'https://saultstemarie.ca/City-Hall.aspx',
		'https://saultstemarie.ca/City-Hall/City-Council.aspx',
		...,
		'https://saultstemarie.ca/Contact-Us.aspx',
		'https://saultstemarie.ca/Site-Map.aspx'
	],
	errors: [
		'https://saultstemarie.ca/Broken-Link.aspx'
	]
}
*/
})();
```

## Parameters

The function `getSiteUrls()` takes two parameters:

```javascript
getSiteUrls( url, maxDepth );
```

1.  `url` - The URL to search.
2.  `maxDepth` - The maximum depth to search, default 1.
