# get-site-urls

[![npm (scoped)](https://img.shields.io/npm/v/@cityssm/get-site-urls)](https://www.npmjs.com/package/@cityssm/get-site-urls) [![Codacy grade](https://img.shields.io/codacy/grade/0d191d20c48b4203a35590490a64564f)](https://app.codacy.com/gh/cityssm/get-site-urls/dashboard) [![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/cityssm/get-site-urls)](https://codeclimate.com/github/cityssm/get-site-urls) [![Code Climate coverage](https://img.shields.io/codeclimate/coverage/cityssm/get-site-urls)](https://codeclimate.com/github/cityssm/get-site-urls) [![AppVeyor](https://img.shields.io/appveyor/build/dangowans/get-site-urls)](https://ci.appveyor.com/project/dangowans/get-site-urls) ![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/cityssm/get-site-urls)

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
})();
```

## Parameters

The function getSiteUrls takes two parameters:

```javascript
getSiteUrls( url, maxDepth );
```

1.  `url` - The url to search
2.  `maxDepth` - The maximum depth to search, default 1.
