//# sourceURL=__InjectedScript_SearchEngineBannerDetector.js
/* Copyright (c) 2026 Apple Inc. All rights reserved. */
(function () {
  function e(e) {
    try {
      var t =
        window.webkit &&
        window.webkit.messageHandlers &&
        window.webkit.messageHandlers.safariSearchEngineBannerDetection;
      t && t.postMessage({ kind: e, category: M });
    } catch (e) {}
  }
  function t() {
    if (C) {
      try {
        C.disconnect();
      } catch (e) {}
      C = null;
    }
    q.length = 0;
  }
  function n() {
    if (_) {
      try {
        _.disconnect();
      } catch (e) {}
      _ = null;
    }
    if (B) {
      try {
        document.removeEventListener("pointerdown", B, !0);
      } catch (e) {}
      B = null;
    }
    D.length = 0;
  }
  function r() {
    (t(), n());
  }
  function i(e) {
    if (!e || !e.getAttribute) return null;
    var t = e.getAttribute("href") || "";
    return 0 === t.indexOf("googlechrome://") ||
      (0 === t.indexOf("intent://") &&
        -1 !== t.indexOf("scheme=googlechrome")) ||
      -1 !== t.indexOf("id535886823")
      ? E
      : 0 === t.indexOf("comgoogleapp://") || -1 !== t.indexOf("id284815942")
        ? O
        : null;
  }
  function o(e) {
    for (
      var t = e && e.querySelectorAll ? e.querySelectorAll("a[href]") : [],
        n = 0;
      n < t.length;
      n++
    ) {
      var r = i(t[n]);
      if (r) return r;
    }
    return null;
  }
  function a(e) {
    return null !== o(e);
  }
  function u(e) {
    var t = o(e);
    return (
      t || (-1 !== ((e && e.textContent) || "").indexOf("Chrome") ? E : "other")
    );
  }
  function d(e) {
    return (
      !(!e || !e.isConnected) &&
      (!e.getAttribute || "true" !== e.getAttribute("aria-hidden"))
    );
  }
  function l(e) {
    var t = e.ownerDocument && e.ownerDocument.defaultView;
    if (!t) return !1;
    var n = t.getComputedStyle(e);
    return !!n && "hidden" !== n.visibility && "none" !== n.display;
  }
  function c(e) {
    return d(e) && l(e);
  }
  function f(e) {
    if (!e || !e.getBoundingClientRect) return !1;
    var t = e.getBoundingClientRect();
    return t.width > 0 && t.height > 0;
  }
  function s(e) {
    d(e) &&
      ("promo_label_id" !==
      (e.getAttribute && e.getAttribute("aria-labelledby"))
        ? a(e) && l(e) && b(e)
        : l(e) && b(e));
  }
  function g(e) {
    for (
      var t = e.querySelectorAll
          ? e.querySelectorAll('[data-async-type="hpba"]')
          : [],
        n = 0;
      n < t.length;
      n++
    ) {
      var r = t[n];
      if (d(r) && r.children && r.children.length > 0 && l(r) && f(r))
        return void b(r);
    }
  }
  function h(e) {
    if (
      !L &&
      e &&
      e.querySelectorAll &&
      !(
        1 === e.nodeType &&
        e.matches &&
        e.matches('[role="dialog"]') &&
        (s(e), L)
      )
    ) {
      for (
        var t = e.querySelectorAll('[role="dialog"]'), n = 0;
        n < t.length;
        n++
      )
        if ((s(t[n]), L)) return;
      g(e);
    }
  }
  function v() {
    if (((k = !1), L)) q.length = 0;
    else {
      var e = q;
      q = [];
      for (var t = 0; t < e.length && !L; t++) h(e[t]);
    }
  }
  function m(e) {
    if (!L && e && (q.push(e), !k)) {
      k = !0;
      var t = window.requestIdleCallback;
      t ? t(v, { timeout: 500 }) : setTimeout(v, 16);
    }
  }
  function b(n) {
    L || ((L = !0), (M = u(n)), e("appearance"), t(), p(n));
  }
  function w() {
    x || ((x = !0), e("dismissed"), n());
  }
  function y() {
    if (!T && ((T = !0), e("interaction"), B)) {
      try {
        document.removeEventListener("pointerdown", B, !0);
      } catch (e) {}
      B = null;
    }
  }
  function p(e) {
    e &&
      (D.push(e),
      (B = function (e) {
        if (!T) {
          var t = e.target;
          if (t)
            for (var n = 0; n < D.length; n++) {
              var r = D[n];
              if (r.contains && r.contains(t)) return void y();
            }
        }
      }),
      document.addEventListener("pointerdown", B, !0),
      (_ = new MutationObserver(function (e) {
        if (!x) {
          for (var t = !1, n = 0; n < e.length; n++)
            if ("attributes" === e[n].type) {
              t = !0;
              break;
            }
          for (var r = 0; r < D.length; r++) if (t ? c(D[r]) : d(D[r])) return;
          w();
        }
      })).observe(document.documentElement, { childList: !0, subtree: !0 }),
      _.observe(e, {
        attributes: !0,
        attributeFilter: ["aria-hidden", "style", "class", "hidden"],
      }));
  }
  function A() {
    function e() {
      setTimeout(t, S);
    }
    (h(document),
      window.addEventListener("pagehide", r, { once: !0 }),
      L ||
        ((C = new MutationObserver(function (e) {
          if (!L)
            for (var t = 0; t < e.length; t++) {
              var n = e[t];
              if (
                "attributes" === n.type &&
                n.target &&
                1 === n.target.nodeType
              )
                m(n.target);
              else if (n.addedNodes)
                for (var r = 0; r < n.addedNodes.length; r++) {
                  var i = n.addedNodes[r];
                  1 === i.nodeType && m(i);
                }
            }
        })).observe(document.documentElement, {
          childList: !0,
          subtree: !0,
          attributes: !0,
          attributeFilter: ["aria-hidden"],
        }),
        "complete" === document.readyState
          ? e()
          : window.addEventListener("load", e, { once: !0 })));
  }
  if (window.__safariSearchEngineBannerDetectorInstalled) return;
  window.__safariSearchEngineBannerDetectorInstalled = !0;
  var S = 1e4;
  const E = "chrome",
    O = "googleApp";
  var L = !1,
    x = !1,
    C = null,
    q = [],
    k = !1,
    D = [],
    _ = null,
    B = null,
    T = !1,
    M = null;
  "loading" === document.readyState
    ? document.addEventListener("DOMContentLoaded", A, { once: !0 })
    : A();
})();
0;
