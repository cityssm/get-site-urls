/*
 *
 * test.js - Where the magic is tested ✨
 *
 */


// ------------
// Dependencies
// ------------
const Ava = require( 'ava' );
const Express = require( 'express' );


// ------------
// Local dependencies
// ------------
const GetSiteUrls = require( '..' );
const { CleanUrl, GetLinks, SearchSite } = require( '..' );


// Integration test for a website
Ava( 'Intergration test, mock website', async ( test ) => {
	const App = Express();
	const Server = App.listen( '3000' );

	// Use the tests mock folder
	App.use( Express.static( './__tests__/site' ) );

	// Get the URLs from the mock website
	const urls = await GetSiteUrls( 'http://localhost:3000' );

	const errors = [
		'http://localhost:3000/test-c',
		'http://localhost:3000/test-b/img.jpeg',
		'http://localhost:3000/test-b/img.iojiajsdja',
		'http://localhost:3000/test-b/img.png',
		'http://localhost:3000/test-a/test-b',
	];

	const pages = [
		'http://localhost:3000',
		'http://localhost:3000/test-a',
		'http://localhost:3000/test-b',
	];

	// Compare the results
	test.true( urls.errors.every( x => errors.includes( x ) ) );
	test.true( urls.pages.every( x => pages.includes( x ) ) );

	// Close the express server
	await Server.close();
});


// A test for the clean URL function
Ava( 'Clean URL test', ( test ) => {
	test.is( CleanUrl( 'https://alexpage.com.au/' ), 'https://alexpage.com.au' );
	test.is( CleanUrl( 'https://alexpage.com.au' ), 'https://alexpage.com.au' );
	test.is( CleanUrl( 'alexpage.com.au/' ), 'http://alexpage.com.au' );
	test.is( CleanUrl( 'alexpage.com.au' ), 'http://alexpage.com.au' );
	test.is( CleanUrl( 'https://alexpage.com.au/#abc' ), 'https://alexpage.com.au' );
	test.is( CleanUrl( 'https://alexpage.com.au/home/../about' ), 'https://alexpage.com.au/about' );
	test.is( CleanUrl( 'https://alexpage.com.au/?a=abc?b=123' ), 'https://alexpage.com.au' );
	test.is( CleanUrl( 'asiodjoais' ), 'http://asiodjoais' );
	test.is( CleanUrl( 'https://ds:ds@designsystem.apps.y.cld.gov.au/' ), 'https://designsystem.apps.y.cld.gov.au' );
});


// A test for the regex search on the HTML
Ava( 'Get links', ( test ) => {
	const data = `
		<link rel="stylesheet" href="style.css">
		<link rel="stylesheet" href="/style.css">
		<link rel="stylesheet" href="http://localhost:3000/style.css">
		<p>Link</p>
		<p href="test-b">Link</p>
		<a>Link</a>
		<a href="#">Link</a>
		<a href="/test-b?a=s121&b=0120912">Link</a>
		<a href="/test-c?a=s121&b=0120912">Link</a>
		<a href="test-b#1234">Link</a>
		<a href="test-b">Link</a>
		<a href="/test-b">Link</a>
		<a href="/test-a">Link</a>
		<script src="/here.js"></script>`;

	const links = 	[
		'http://localhost:3000',
		'http://localhost:3000/test-b',
		'http://localhost:3000/test-c',
		'http://localhost:3000/test-b',
		'http://localhost:3000/test-b',
		'http://localhost:3000/test-b',
		'http://localhost:3000/test-a',
	];

	const foundLinks = GetLinks( data, 'http://localhost:3000', 'http://localhost:3000' );

	test.true( foundLinks.every( x => links.includes( x ) ) );
});
