import * as assert from "assert";
import { getSiteUrls } from "../index.js";


describe("getSiteUrls()", () => {

  it("Has results for saultstemarie.ca", async() => {
    const urls = await getSiteUrls("https://saultstemarie.ca");
    assert.ok(urls.pages.length > 0);
  });

  it("Has results for saultstemarie.ca/Broken-Link.aspx", async() => {
    const urls = await getSiteUrls("https://saultstemarie.ca/Broken-Link-" + Date.now().toString() + ".aspx");
    assert.ok(urls.errors.length > 0);
  });
});
