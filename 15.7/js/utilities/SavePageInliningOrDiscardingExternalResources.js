//# sourceURL=__InjectedScript_SavePageInliningOrDiscardingExternalResources.js
/* Copyright (c) 2025 Apple Inc. All rights reserved. */
function copyPage() {
  function e(e) {
    function t(e) {
      var t = document.createElement("a");
      return ((t.href = e), t);
    }
    function r(e) {
      var t = e.pathname.substring(1).split("/");
      return (t[t.length - 1] || t.pop(), t);
    }
    function n(e) {
      var t = r(e);
      return t.length ? t[t.length - 1] : null;
    }
    return n(t(e));
  }
  function t(t) {
    const r = /url\((.*?\/.*?)\)/gi;
    for (;;) {
      var n = r.exec(t);
      if (!n) break;
      t = t.replace(n[0], "url(" + e(n[1]) + ")");
    }
    return t;
  }
  function r(e) {
    function r(e, n) {
      if (e) {
        var i, o;
        try {
          i = e.rules;
        } catch (e) {
          i = null;
        }
        if (!i) {
          var u = e.ownerNode;
          if (!u) return;
          var c = u.parentNode;
          if (!c) return;
          var l = u.nextSibling;
          return (c.removeChild(u), r(e, n), void c.insertBefore(u, l));
        }
        for (var d = i.length, s = 0; s < d; ++s) {
          var m = i[s];
          m.type !== CSSRule.IMPORT_RULE
            ? (o ||
                ((o = document.createElement("style")),
                e.media &&
                  e.media.length > 0 &&
                  o.setAttribute("media", e.media.mediaText),
                n && n.media && o.setAttribute("media", n.media.mediaText),
                a.push(o)),
              o.appendChild(document.createTextNode(t(m.cssText) + "\n")))
            : r(m.styleSheet, m);
        }
      }
    }
    for (var n = e.styleSheets, a = [], i = n.length, o = 0; o < i; ++o)
      r(n[o]);
    return a;
  }
  function n(e, r) {
    for (var n = e.attributes, a = n.length, i = 0; i < a; ++i) {
      var o = n[i],
        u = o.name.toLowerCase();
      if ("on" !== u.substr(0, 2)) {
        var c = o.value;
        "style" === u && (c = t(c));
        try {
          r.setAttribute(o.name, c);
        } catch (e) {}
      }
    }
  }
  function a(e, t) {
    for (var r = e.childNodes, n = r.length, a = 0; a < n; ++a) {
      var o = i(r[a]);
      o && t.appendChild(o);
    }
  }
  function i(t) {
    if (!t) return t;
    if (t.nodeType === Node.TEXT_NODE) return document.createTextNode(t.data);
    if (t.nodeType !== Node.ELEMENT_NODE) return null;
    const c = new Set(["AUDIO", "OBJECT", "SCRIPT", "STYLE", "VIDEO"]);
    var l = t.tagName.toUpperCase();
    if (c.has(l)) return null;
    if ("LINK" === l && "STYLESHEET" === t.rel.toUpperCase()) return null;
    if ("META" === l && "CONTENT-TYPE" === t.httpEquiv.toUpperCase())
      return null;
    var d = document.createElement(t.tagName);
    if (
      (n(t, d),
      a(t, d),
      "IMG" === l || ("INPUT" === l && "IMAGE" === t.type.toUpperCase()))
    )
      return (
        (d.src = e(t.src)),
        d.setAttribute("width", t.width),
        d.setAttribute("height", t.height),
        d
      );
    if ("IFRAME" === l) {
      try {
        var s = i(t.contentDocument.documentElement);
        if (s) {
          var m = "iframe_" + u + ".html";
          ((d.src = m),
            (s.dataset.originalSource = t.src),
            (o[m] = s.outerHTML),
            u++);
        }
      } catch (e) {
        ((d.src = ""),
          d.appendChild(
            document.createTextNode(
              "Failed to copy <iframe>: " + e + ": " + e.stack,
            ),
          ));
      }
      return d;
    }
    if ("INPUT" === l) d.setAttribute("value", t.value);
    else if ("HEAD" === l) {
      for (var f = r(t.ownerDocument), h = f.length, p = 0; p < h; ++p)
        (d.appendChild(document.createTextNode("\n")), d.appendChild(f[p]));
      var v = document.createElement("meta");
      ((v.httpEquiv = "Content-Type"),
        (v.content = "text/html; charset=UTF-8"),
        d.insertBefore(v, d.firstChild));
    }
    return d;
  }
  var o = {},
    u = 0,
    c = i(document.documentElement);
  return (
    (c.dataset.originSource = window.location),
    (o["main.html"] = c.outerHTML),
    o
  );
}
copyPage();
