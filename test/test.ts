import * as assert from "assert";
import { getSiteUrls } from "../index.js";


describe("getSiteUrls()", () => {

  it("Has results for futuressm.com (webpage with query parameters)", async() => {
    const urls = await getSiteUrls("https://futuressm.com/index.cfm?fuseaction=content&menuid=8&pageid=1007");
    assert.ok(urls.pages.length > 0);
  });

  it("Has results for saultstemarie.ca", async() => {
    const urls = await getSiteUrls("https://saultstemarie.ca");
    assert.ok(urls.pages.length > 0);
  });

  it("Has errors for saultstemarie.ca/Broken-Link.aspx", async() => {
    const urls = await getSiteUrls("https://saultstemarie.ca/Broken-Link-" + Date.now().toString() + ".aspx");
    assert.ok(urls.errors.length > 0);
  });
});
