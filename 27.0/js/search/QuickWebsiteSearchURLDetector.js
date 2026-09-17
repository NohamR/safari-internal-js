//# sourceURL=__InjectedScript_QuickWebsiteSearchURLDetector.js
/* Copyright (c) 2026 Apple Inc. All rights reserved. */
(function () {
  "use strict";
  function e(e) {
    return encodeURIComponent(e).replace(/%20/g, "+");
  }
  function t(e) {
    return new RegExp("(^|.)" + e.replaceAll(".", "\\.") + "$");
  }
  function n(e) {
    return t(e).test(document.location.hostname);
  }
  function r(e) {
    if (e instanceof HTMLTextAreaElement) return !0;
    if (!(e instanceof HTMLInputElement)) return !1;
    const t = {
      date: !0,
      "datetime-local": !0,
      email: !0,
      isindex: !0,
      month: !0,
      number: !0,
      password: !0,
      search: !0,
      tel: !0,
      telephone: !0,
      text: !0,
      time: !0,
      url: !0,
      week: !0,
    };
    var n = e.type;
    return !n || n in t;
  }
  function u(e, t) {
    try {
      return window.collectMatchingElementsInFlatTree(e, t);
    } catch (e) {
      return [];
    }
  }
  function i(e) {
    e.elements;
    return u(
      e,
      "button, fieldset, input:not([type='image']), object, output, select, textarea",
    );
  }
  function o(e) {
    var t = e.localName;
    return "string" == typeof t || "string" == typeof (t = e.nodeName)
      ? t
      : void 0;
  }
  function c(e) {
    let t = e.options,
      n = t.length;
    for (var r = 0; r < n; ++r) {
      let n = t[r];
      if (n.selected !== n.defaultSelected) {
        if (n.defaultSelected) return !1;
        if (e.multiple || r) return !1;
      }
    }
    return !0;
  }
  function l(e) {
    return (
      (e instanceof HTMLButtonElement || e instanceof HTMLInputElement) &&
      e.type &&
      "submit" === e.type
    );
  }
  function s(e) {
    if (!(e instanceof HTMLInputElement)) return !1;
    try {
      if (e.matches(":-webkit-autofill-strong-password")) return !0;
    } catch (e) {}
    const t = getComputedStyle(e, null).getPropertyValue(
        "-webkit-text-security",
      ),
      r = e.type;
    if ("none" !== t || "password" === r) return !0;
    if (r && "text" !== r) return !1;
    if (n("ninehours.co.jp")) {
      let t = e.name;
      if ("guestPassword" === t || "guestPasswordConfirm" === t) return !0;
    }
    return !1;
  }
  function a(e) {
    return e.checked === e.defaultChecked;
  }
  function f(e) {
    return (
      e instanceof HTMLTextAreaElement &&
      ("search" === e.getAttribute("type") ||
        "search" === e.inputMode ||
        "search" === e.getAttribute("enterkeyhint"))
    );
  }
  function d(e) {
    const t = o(e).toLowerCase();
    if ("button" === t || "fieldset" === t) return !0;
    if ("select" === t) return c(e);
    if ("input" !== t && !f(e)) return !1;
    const n = e.type;
    return "radio" === n || "checkbox" === n
      ? a(e)
      : "hidden" === n ||
          "reset" === n ||
          "submit" === n ||
          "button" === n ||
          "image" === n ||
          (r(e) && !s(e));
  }
  function h(e) {
    if ("get" !== e.method) return !1;
    const t = i(e),
      n = t.length;
    for (let e = 0; e < n; ++e) if (!d(t[e])) return !1;
    return !0;
  }
  function m(e) {
    let t = [],
      n = i(e),
      u = n.length;
    for (let e = 0; e < u; ++e) {
      let u = n[e];
      u.checkVisibility() &&
        null != u.value &&
        u.value.length &&
        r(u) &&
        t.push(u);
    }
    return t;
  }
  function p(e) {
    if (e.disabled) return !1;
    if (!e.name.length) return !1;
    if (!e.value.length) return !1;
    if (e instanceof HTMLSelectElement) return !0;
    var t = o(e).toLowerCase(),
      n = e.type;
    return "button" === t
      ? "submit" === n
      : "input" === t &&
          ("submit" === n ||
            ("checkbox" === n || "radio" === n
              ? e.checked
              : "hidden" === n || r(e)));
  }
  function g(t) {
    const n = t.form;
    if (!n) return null;
    let r = n.getAttribute("action");
    if (!r || !r.length) return null;
    if (!/^https?:/i.test(n.action)) return null;
    let u = null,
      o = "",
      c = i(n),
      s = c.length;
    for (let n = 0; n < s; ++n) {
      let r = c[n];
      if ((r === t || p(r)) && (!l(r) || (u || (u = r), r === u))) {
        o.length && (o += "&");
        var a = r === t ? "{searchTerms}" : e(r.value);
        o += e(r.name) + "=" + a;
      }
    }
    let f = document.createElement("a");
    return ((f.href = n.action), (f.search = o), f.href);
  }
  function b(e) {
    const t = e.target;
    if (!h(t)) return;
    const n = m(t);
    if (n.length > 1) return;
    const r = n[0];
    if (!r) return;
    const u = g(r);
    u &&
      window.webkit.messageHandlers.quickWebsiteSearchDetectedSearchURL.postMessage(
        u,
      );
  }
  window.addEventListener("submit", b);
})();
0;
