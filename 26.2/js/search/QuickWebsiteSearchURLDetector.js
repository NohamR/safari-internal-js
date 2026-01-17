//# sourceURL=__InjectedScript_QuickWebsiteSearchURLDetector.js
/* Copyright (c) 2025 Apple Inc. All rights reserved. */
"use strict";
function urlEncode(e) {
  return encodeURIComponent(e).replace(/%20/g, "+");
}
function regularExpressionForDomainMatching(e) {
  return new RegExp("(^|.)" + e.replaceAll(".", "\\.") + "$");
}
function userIsOnDomain(e) {
  return regularExpressionForDomainMatching(e).test(document.location.hostname);
}
function isTextField(e) {
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
function queryAllBySelector(e, t) {
  try {
    return window.collectMatchingElementsInFlatTree(e, t);
  } catch (e) {
    return [];
  }
}
function elementsInFormPiercingShadowDOM(e) {
  e.elements;
  return queryAllBySelector(
    e,
    "button, fieldset, input:not([type='image']), object, output, select, textarea",
  );
}
function getLocalName(e) {
  var t = e.localName;
  return "string" == typeof t || "string" == typeof (t = e.nodeName)
    ? t
    : void 0;
}
function isSelectInDefaultState(e) {
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
function isSubmitButton(e) {
  return (
    (e instanceof HTMLButtonElement || e instanceof HTMLInputElement) &&
    e.type &&
    "submit" === e.type
  );
}
function isSecureTextField(e) {
  if (!(e instanceof HTMLInputElement)) return !1;
  try {
    if (e.matches(":-webkit-autofill-strong-password")) return !0;
  } catch (e) {}
  const t = getComputedStyle(e, null).getPropertyValue("-webkit-text-security"),
    n = e.type;
  if ("none" !== t || "password" === n) return !0;
  if (n && "text" !== n) return !1;
  if (userIsOnDomain("ninehours.co.jp")) {
    let t = e.name;
    if ("guestPassword" === t || "guestPasswordConfirm" === t) return !0;
  }
  return !1;
}
function isCheckboxOrRadioButtonInDefaultState(e) {
  return e.checked === e.defaultChecked;
}
function textAreaElementLookLikeItIsPartOfASearchForm(e) {
  return (
    e instanceof HTMLTextAreaElement &&
    ("search" === e.getAttribute("type") ||
      "search" === e.inputMode ||
      "search" === e.getAttribute("enterkeyhint"))
  );
}
function isInputAllowedInSearchForm(e) {
  const t = getLocalName(e).toLowerCase();
  if ("button" === t || "fieldset" === t) return !0;
  if ("select" === t) return isSelectInDefaultState(e);
  if ("input" !== t && !textAreaElementLookLikeItIsPartOfASearchForm(e))
    return !1;
  const n = e.type;
  return "radio" === n || "checkbox" === n
    ? isCheckboxOrRadioButtonInDefaultState(e)
    : "hidden" === n ||
        "reset" === n ||
        "submit" === n ||
        "button" === n ||
        "image" === n ||
        (isTextField(e) && !isSecureTextField(e));
}
function isSearchForm(e) {
  if ("get" !== e.method) return !1;
  const t = elementsInFormPiercingShadowDOM(e),
    n = t.length;
  for (let e = 0; e < n; ++e) if (!isInputAllowedInSearchForm(t[e])) return !1;
  return !0;
}
function visibleNonEmptyFormTextControlsInForm(e) {
  let t = [],
    n = elementsInFormPiercingShadowDOM(e),
    r = n.length;
  for (let e = 0; e < r; ++e) {
    let r = n[e];
    r.checkVisibility() &&
      null != r.value &&
      r.value.length &&
      isTextField(r) &&
      t.push(r);
  }
  return t;
}
function shouldInputBeIncludedInSearchURLQuery(e) {
  if (e.disabled) return !1;
  if (!e.name.length) return !1;
  if (!e.value.length) return !1;
  if (e instanceof HTMLSelectElement) return !0;
  var t = getLocalName(e).toLowerCase(),
    n = e.type;
  return "button" === t
    ? "submit" === n
    : "input" === t &&
        ("submit" === n ||
          ("checkbox" === n || "radio" === n
            ? e.checked
            : "hidden" === n || isTextField(e)));
}
function searchTextFieldFormSubmissionURLString(e) {
  const t = e.form;
  if (!t) return null;
  let n = t.getAttribute("action");
  if (!n || !n.length) return null;
  if (!/^https?:/i.test(t.action)) return null;
  let r = null,
    i = "",
    o = elementsInFormPiercingShadowDOM(t),
    u = o.length;
  for (let t = 0; t < u; ++t) {
    let n = o[t];
    if (
      (n === e || shouldInputBeIncludedInSearchURLQuery(n)) &&
      (!isSubmitButton(n) || (r || (r = n), n === r))
    ) {
      i.length && (i += "&");
      var l = n === e ? "{searchTerms}" : urlEncode(n.value);
      i += urlEncode(n.name) + "=" + l;
    }
  }
  let s = document.createElement("a");
  return ((s.href = t.action), (s.search = i), s.href);
}
function handleFormSubmission(e) {
  const t = e.target;
  if (!isSearchForm(t)) return;
  const n = visibleNonEmptyFormTextControlsInForm(t);
  if (n.length > 1) return;
  const r = n[0];
  if (!r) return;
  const i = searchTextFieldFormSubmissionURLString(r);
  i &&
    window.webkit.messageHandlers.quickWebsiteSearchDetectedSearchURL.postMessage(
      i,
    );
}
window.addEventListener("submit", handleFormSubmission);
