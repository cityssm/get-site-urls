import * as assert from "assert";
import { getSiteUrls } from "../index.js";


describe("getSiteUrls()", () => {

  it("Has results for saultstemarie.ca", async() => {
    const urls = await getSiteUrls("https://saultstemarie.ca");
    assert.ok(urls);
  });
});
