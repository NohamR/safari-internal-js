//# sourceURL=__InjectedScript_WebClipMetadataFetcher.js
/* Copyright (c) 2026 Apple Inc. All rights reserved. */
/*
 * Copyright (c) 2014 Apple Inc. All rights reserved.
 */
const MetaTagNamesToScrape = [
    "apple-mobile-web-app-capable",
    "apple-mobile-web-app-title",
    "viewport",
    "apple-mobile-web-app-status-bar-style",
  ],
  LinkRelTypesToScrape = [
    "apple-touch-icon",
    "apple-touch-icon-precomposed",
    "apple-touch-startup-image",
    "icon",
    "shortcut icon",
  ];
var Orientation = { Portrait: 0, Landscape: 1 },
  WebClipMetadataFinder = function () {};
WebClipMetadataFinder.prototype = {
  webClipMetadata: function () {
    return {
      metaTags: this.metaTagsMetadata(),
      linkTags: this.linkTagsMetadata(),
      canonicalURLString: this.canonicalURLStringForPage(),
    };
  },
  metaTagsMetadata: function () {
    function e(e) {
      if ("apple-mobile-web-app-status-bar-style" === e.name)
        e.content.toLowerCase();
    }
    for (
      var t = {},
        a = document.head.getElementsByTagName("meta"),
        i = a.length,
        n = 0;
      n < i;
      ++n
    ) {
      var r = a[n],
        o = r.name;
      -1 !== MetaTagNamesToScrape.indexOf(o) && (e(r), (t[o] = r.content));
    }
    return t;
  },
  currentOrientation: function () {
    return (
      void 0 === this._currentOrientation &&
        (window.matchMedia("(orientation: portrait)").matches
          ? (this._currentOrientation = Orientation.Portrait)
          : (this._currentOrientation = Orientation.Landscape)),
      this._currentOrientation
    );
  },
  canonicalURLStringForPage: function () {
    var e = document.head.querySelector("link[rel='canonical']");
    return e ? e.href : "";
  },
  linkTagsMetadata: function () {
    for (
      var e = [],
        t = document.head.getElementsByTagName("link"),
        a = t.length,
        i = 0;
      i < a;
      ++i
    ) {
      var n = t[i],
        r = n.rel;
      if (-1 !== LinkRelTypesToScrape.indexOf(r)) {
        var o = n.href,
          c = n.getAttribute("sizes");
        if (o) {
          var s = n.media,
            p = !0,
            d = !0;
          if (s) {
            var u = window.matchMedia(s);
            ((p = this.mediaQueryListMatchesOrientation(
              u,
              Orientation.Portrait,
            )),
              (d = this.mediaQueryListMatchesOrientation(
                u,
                Orientation.Landscape,
              )));
          }
          var l = {
            rel: r,
            href: o,
            mediaMatchesPortraitOrientation: p,
            mediaMatchesLandscapeOrientation: d,
          };
          (c && (l.sizes = c), e.push(l));
        }
      }
    }
    return e;
  },
  mediaQueryListMatchesOrientation: function (e, t) {
    var a = e.media;
    if ("invalid" === a) return !1;
    if (t === this.currentOrientation()) return e.matches;
    var i = this.reverseMediaQueryOrientation(a);
    return window.matchMedia(i).matches;
  },
  reverseMediaQueryOrientation: function (e) {
    return e.replace(/orientation: (portrait|landscape)/, function (e, t) {
      return "orientation: " + ("portrait" === t ? "landscape" : "portrait");
    });
  },
};
var WebClipMetadataFinderJS = new WebClipMetadataFinder();
0;
