//# sourceURL=__InjectedScript_SchemaOrgMarkupChecker.js
/* Copyright (c) 2025 Apple Inc. All rights reserved. */
(function () {
  const e = "schema.org";
  var t = document.querySelectorAll('script[type="application/ld+json"]');
  for (let o of t) {
    var r;
    try {
      r = JSON.parse(o.text);
    } catch (e) {
      continue;
    }
    if (r["@context"].toLowerCase().includes(e)) return !0;
  }
  var o = document.querySelectorAll("[itemscope]");
  for (let t of o) {
    var c = t.getAttribute("itemType");
    if (c && c.toLowerCase().includes(e)) return !0;
  }
})();
