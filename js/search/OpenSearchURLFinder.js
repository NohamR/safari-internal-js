//# sourceURL=__InjectedScript_OpenSearchURLFinder.js
/* Copyright (c) 2025 Apple Inc. All rights reserved. */
var OpenSearchURLFinder = function () {};
OpenSearchURLFinder.prototype = {
  firstOpenSearchURLString: function () {
    if (!document.head) return null;
    for (
      var e = document.head.getElementsByTagName("link"), r = e.length, n = 0;
      n < r;
      ++n
    ) {
      var t = e[n];
      if (
        "search" === t.getAttribute("rel") &&
        "application/opensearchdescription+xml" === t.getAttribute("type")
      )
        return t.href;
    }
    return null;
  },
};
var OpenSearchURLFinderJS = new OpenSearchURLFinder();
