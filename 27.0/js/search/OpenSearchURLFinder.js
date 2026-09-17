//# sourceURL=__InjectedScript_OpenSearchURLFinder.js
/* Copyright (c) 2026 Apple Inc. All rights reserved. */
(function () {
  "use strict";
  function e() {
    if (document.head) {
      var e = document.head.getElementsByTagName("link");
      for (const t of e)
        if (
          "search" === t.getAttribute("rel") &&
          "application/opensearchdescription+xml" === t.getAttribute("type")
        )
          return void window.webkit.messageHandlers.quickWebsiteSearchFoundOpenSearchURL.postMessage(
            t.href,
          );
    }
  }
  e();
})();
0;
