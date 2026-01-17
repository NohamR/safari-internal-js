//# sourceURL=__InjectedScript_MetadataExtractor.js
/* Copyright (c) 2025 Apple Inc. All rights reserved. */
function getIconType(e) {
  var o = e.getAttribute("rel");
  return "apple-touch-icon" === o
    ? IconTypeAppleTouchIcon
    : "apple-touch-icon-precomposed" === o
      ? IconTypeAppleTouchIconPrecomposed
      : IconTypeFavicon;
}
function compareIconsDescending(e, o) {
  var c = getIconType(e),
    t = getIconType(o);
  if (c === IconTypeFavicon && t !== IconTypeFavicon) return 1;
  if (t === IconTypeFavicon && c !== IconTypeFavicon) return -1;
  var n = e.getAttribute("sizes"),
    r = o.getAttribute("sizes"),
    p = 0,
    a = 0;
  return (
    n
      ? (p = parseInt(n))
      : n ||
        (c !== IconTypeAppleTouchIcon &&
          c !== IconTypeAppleTouchIconPrecomposed) ||
        (p = AppleTouchIconDefaultWidth),
    r
      ? (a = parseInt(r))
      : r ||
        (t !== IconTypeAppleTouchIcon &&
          t !== IconTypeAppleTouchIconPrecomposed) ||
        (a = AppleTouchIconDefaultWidth),
    a > p
      ? 1
      : a < p
        ? -1
        : c !== IconTypeAppleTouchIconPrecomposed &&
            t === IconTypeAppleTouchIconPrecomposed
          ? 1
          : t !== IconTypeAppleTouchIconPrecomposed &&
              c === IconTypeAppleTouchIconPrecomposed
            ? -1
            : 0
  );
}
function colorComponentsFromString(e) {
  var o = document.createElement("canvas");
  ((o.width = 1), (o.height = 1));
  var c = o.getContext("2d");
  ((c.fillStyle = e), c.fillRect(0, 0, 1, 1));
  var t = c.getImageData(0, 0, 1, 1);
  return [t.data[0], t.data[1], t.data[2]];
}
var MetadataExtractor = function () {};
const IconTypeFavicon = 0,
  IconTypeAppleTouchIcon = 1,
  IconTypeAppleTouchIconPrecomposed = 2,
  AppleTouchIconDefaultWidth = 60;
MetadataExtractor.prototype = {
  extractAndSortIconsWithSelector: function (e) {
    var o = document.head.querySelectorAll(e);
    return o.length
      ? Array.prototype.slice.call(o).sort(compareIconsDescending)
      : [];
  },
  extractAppleTouchIconURLs: function () {
    for (
      var e = this.extractAndSortIconsWithSelector(
          "link[rel=apple-touch-icon], link[rel=apple-touch-icon-precomposed]",
        ),
        o = [],
        c = 0;
      c < e.length;
      ++c
    ) {
      var t = e[c].href;
      t && o.push(t);
    }
    return o;
  },
  extractFaviconURLs: function () {
    for (
      var e = this.extractAndSortIconsWithSelector(
          "link[rel='shortcut icon'], link[rel=icon]",
        ),
        o = [],
        c = e.length,
        t = 0;
      t < c;
      ++t
    )
      o.push(e[t].href);
    return o;
  },
  extractTemplateIconURLAndColor: function () {
    var e = document.head.querySelector("link[rel=mask-icon]");
    if (!e) return null;
    var o = e.getAttribute("color");
    return o && e.href
      ? { url: e.href, color: colorComponentsFromString(o) }
      : null;
  },
};
var MetadataExtractorJS = new MetadataExtractor();
