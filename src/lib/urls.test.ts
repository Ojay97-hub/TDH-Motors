import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isSafeCmsHref, normalizeCmsHref } from "./urls";

describe("CMS URL helpers", () => {
  it("accepts safe CMS hrefs", () => {
    for (const href of [
      "/contact",
      "#section",
      "#",
      "https://example.com",
      "mailto:test@example.com",
      "tel:+441234567890",
    ]) {
      assert.equal(isSafeCmsHref(href), true, href);
      assert.equal(normalizeCmsHref(` ${href} `), href, href);
    }
  });

  it("rejects unsafe CMS hrefs", () => {
    for (const href of [
      "javascript:alert(1)",
      "data:text/html,test",
      "//google.com",
    ]) {
      assert.equal(isSafeCmsHref(href), false, href);
      assert.equal(normalizeCmsHref(href), null, href);
    }
  });

  it("rejects missing or blank hrefs", () => {
    assert.equal(normalizeCmsHref(), null);
    assert.equal(normalizeCmsHref(null), null);
    assert.equal(normalizeCmsHref("   "), null);
  });
});
