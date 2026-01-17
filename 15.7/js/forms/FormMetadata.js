//# sourceURL=__InjectedScript_FormMetadata.js
/* Copyright (c) 2025 Apple Inc. All rights reserved. */
function regularExpressionForDomainMatching(e) {
  let t = cachedRegularExpressionsForDomainMatching[e];
  return (
    t ||
    ((t = new RegExp("(^|.)" + e.replaceAll(".", "\\.") + "$")),
    (cachedRegularExpressionsForDomainMatching[e] = t),
    t)
  );
}
function userIsOnDomain(e) {
  return regularExpressionForDomainMatching(e).test(document.location.hostname);
}
function legacyPlaceholderInfoForInputElement(e) {
  if ("text" !== e.type) return null;
  if (doctypeLooksLikeHTML5) return null;
  var t = e.value.trim();
  if (!t) return null;
  for (var o = !1, r = !0, n = e.attributes, i = n.length, l = 0; l < i; ++l) {
    var a = n[l];
    if (t === a.value.trim() && ((o = !0), "value" !== a.name.toLowerCase())) {
      r = !1;
      break;
    }
  }
  return o ? { Text: t, AttributeMatchedWasValue: r } : null;
}
function placeholderInfoForElement(e) {
  var t = e.getAttribute("placeholder");
  if (t) return { Text: t, AttributeMatchedWasValue: !1 };
  var o = e.getAttribute("data-placeholder");
  return o && o.length
    ? { Text: o, AttributeMatchedWasValue: !1 }
    : isInputElement(e)
      ? legacyPlaceholderInfoForInputElement(e)
      : null;
}
function sharedPrefixLength(e, t) {
  for (var o = 0, r = 0, n = e.length; r < n && e[r] === t[r]; ++r) o++;
  return o;
}
function rowContainingLabelAboveRow(e) {
  for (
    var t = e.getBoundingClientRect(), o = e.previousElementSibling;
    o instanceof HTMLTableRowElement;
    o = o.previousElementSibling
  ) {
    if (o.querySelector("input, select, textarea")) return null;
    var r = o.getBoundingClientRect();
    if (t.top - r.bottom > t.height / 2) return null;
    if (o.innerText.match(/\S/)) return o;
  }
  return null;
}
function cellVisuallyAbove(e) {
  let t = e.parentElementIncludingShadowDOMHost();
  if (!(t && t instanceof HTMLTableRowElement)) return null;
  var o = rowContainingLabelAboveRow(t);
  if (!o) return null;
  for (
    var r = e.getBoundingClientRect(),
      n = o.children,
      i = n.length,
      l = null,
      a = 0,
      s = 0;
    s < i;
    ++s
  ) {
    var u = n[s],
      c = u.getBoundingClientRect(),
      d = Math.min(c.right, r.right) - Math.max(c.left, r.left);
    (!l || d > a) && ((a = d), (l = u));
  }
  return l;
}
function couldBeFormSubmissionControl(e) {
  if (e instanceof HTMLButtonElement) return !0;
  if (e instanceof HTMLInputElement) {
    var t = e.type;
    return "submit" === t || "image" === t;
  }
  return !1;
}
function isInputElement(e) {
  return e instanceof HTMLInputElement;
}
function isDateTimeInputElement(e) {
  return !!isInputElement(e) && DateTimeInputTypes.includes(e.type);
}
function isRadioButtonElement(e) {
  return !!isInputElement(e) && "radio" === e.type;
}
function anchorWithURLString(e) {
  var t = document.createElement("a");
  return ((t.href = e), t);
}
function pathComponentsForLocation(e) {
  var t = e.pathname.substring(1).split("/");
  return (t[t.length - 1] || t.pop(), t);
}
function lastPathComponentFromAnchor(e) {
  var t = pathComponentsForLocation(e);
  return t.length ? t[t.length - 1] : null;
}
function lastPathComponentForURLString(e) {
  return lastPathComponentFromAnchor(anchorWithURLString(e));
}
function urlEncode(e) {
  return encodeURIComponent(e).replace(/%20/g, "+");
}
function isCheckboxOrRadioButtonInDefaultState(e) {
  return e.checked === e.defaultChecked;
}
function isSelectInDefaultState(e) {
  for (var t = e.options, o = t.length, r = 0; r < o; ++r) {
    var n = t[r];
    if (n.selected !== n.defaultSelected) {
      if (n.defaultSelected) return !1;
      if (e.multiple || r) return !1;
    }
  }
  return !0;
}
function formActionAsAnchorElement(e, t) {
  if (!(e instanceof HTMLFormElement)) return null;
  let o = e.getAttribute("action");
  if (!o && t) return null;
  var r = document.createElement("a");
  return ((r.href = o || ""), r);
}
function eventThatBubbles(e) {
  return new CustomEvent(e, { bubbles: !0 });
}
function formControlHasBeenClassifiedInAnInterestingWay(e) {
  return (
    e.ControlIsActiveElement ||
    e.ControlIsSecureTextField ||
    e.ControlLooksLikePasswordCredentialField ||
    e.ControlLooksLikeCreditCardNumberField ||
    e.ControlLooksLikeCreditCardSecurityCodeField ||
    e.ControlLooksLikeCreditCardCardholderField ||
    e.ControlLooksLikeCreditCardTypeField ||
    e.AddressBookLabel ||
    e.ControlLooksLikeDayField ||
    e.ControlLooksLikeMonthField ||
    e.ControlLooksLikeYearField ||
    e.ControlLooksLikeOneTimeCodeField ||
    e.ControlLooksLikeCreditCardCompositeExpirationDateField ||
    e.ControlLooksLikeEIDField ||
    e.ControlLooksLikeIMEIField
  );
}
function isValidUsernameOrEmail(e) {
  const t = /^[a-z_][a-z0-9_.]{2,30}$/i,
    o = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
  return (
    !(!e || e.length < 3 || "true" === e || "false" === e) &&
    (t.test(e) || o.test(e))
  );
}
function selectorForElement(e) {
  let t = e.localName,
    o = e.getAttribute("id");
  o && (t += `#${o}`);
  let r = e.classList,
    n = r.length;
  for (let e = 0; e < n; e++) t += "." + r[e];
  return t;
}
function hasOwnProperties(e) {
  return Object.getOwnPropertyNames(e).length > 0;
}
function defaultOptionForSelectElement(e) {
  for (var t = e.options, o = t.length, r = 0; r < o; ++r) {
    var n = t[r];
    if (n.defaultSelected) return n;
  }
  return t[0];
}
function selectElementOptionsSequenceAnalysis(e, t) {
  for (
    var o = e.options, r = o.length, n = 0, i = -1, l = -1, a = 0, s = 0;
    s < r;
    ++s
  ) {
    var u = o[s],
      c = parseInt(u[t]);
    isFiniteNumber(c)
      ? -1 === l
        ? ((l = c), (a = 1))
        : c === l + 1 && ((l = c), a++)
      : (a >= n && ((n = a), (i = l)), (l = -1), (a = 0));
  }
  return (
    a >= n && ((n = a), (i = l)),
    { lengthOfLongestSequence: n, lastNumberInSequence: i }
  );
}
function isElementPositionedToBeEffectivelyInvisible(e) {
  var t = !1;
  for (let o = e; o; o = o.parentElementIncludingShadowDOMHost())
    if ("fixed" === getComputedStyle(o).position) {
      t = !0;
      break;
    }
  var o,
    r,
    n,
    i = e.getBoundingClientRect();
  if (t) ((o = i), (r = window.innerWidth), (n = window.innerHeight));
  else {
    var l = window.scrollY,
      a = window.scrollX;
    ((o = {
      top: i.top + l,
      right: i.right + a,
      bottom: i.bottom + l,
      left: i.left + a,
      width: i.width,
      height: i.height,
    }),
      (r = document.documentElement.scrollWidth),
      (n = Math.max(
        document.documentElement.scrollHeight,
        window.innerHeight,
      )));
  }
  return o.top >= n || o.right <= 0 || o.bottom <= 0 || o.left >= r;
}
function rectIsWithinDocumentViewport(e) {
  return (
    e.right >= 0 &&
    e.bottom >= 0 &&
    e.left <= window.innerWidth &&
    e.top <= window.innerHeight
  );
}
function isCredentialElementUniqueID(e, t) {
  return (
    t === e.UsernameElementUniqueID ||
    t === e.PasswordElementUniqueID ||
    t === e.ConfirmPasswordElementUniqueID ||
    t === e.OldPasswordElementUniqueID
  );
}
function autocompleteTokens(e) {
  const t = ["autocomplete", "autocompletetype", "x-autocompletetype"];
  let o = [];
  for (const r of t)
    e.hasAttribute(r) && o.push(e.getAttribute(r).trim().toLowerCase());
  if (!o.length) return null;
  let r = o
    .join(" ")
    .split(/\s+/)
    .filter(function (e) {
      return e.length && "off" !== e && "on" !== e;
    });
  return r.length ? r : null;
}
function elementIDOrAutocompleteTokensHasToken(e, t, o) {
  return !!e.id?.includes(o) || !!t?.includes(o);
}
function controlAppearsToBePartOfPhotoTaggingInterface(e) {
  const t = /photo.*tag/i;
  for (
    let o = e.parentElementIncludingShadowDOMHost();
    o;
    o = o.parentElementIncludingShadowDOMHost()
  )
    if (t.test(o.className)) return !0;
  return !1;
}
function levenshteinDistance(e, t) {
  for (
    var o = e.length, r = t.length, n = new Array(o + 1), i = 0;
    i < o + 1;
    ++i
  )
    ((n[i] = new Array(r + 1)), (n[i][0] = i));
  for (var l = 0; l < r + 1; ++l) n[0][l] = l;
  for (l = 1; l < r + 1; ++l)
    for (i = 1; i < o + 1; ++i)
      if (e[i - 1] === t[l - 1]) n[i][l] = n[i - 1][l - 1];
      else {
        var a = n[i - 1][l] + 1,
          s = n[i][l - 1] + 1,
          u = n[i - 1][l - 1] + 1;
        n[i][l] = Math.min(a, s, u);
      }
  return n[o][r];
}
function stringSimilarity(e, t) {
  var o = Math.max(e.length, t.length);
  return o ? (o - levenshteinDistance(e, t)) / o : 0;
}
function stripCommonPrefix(e, t) {
  const o = e.length,
    r = t.length,
    n = o < r ? o : r;
  let i = 0;
  for (; i < n && e[i] === t[i]; ) i++;
  return [e.slice(i), t.slice(i)];
}
function articleTitleAndSiteNameFromTitleString(e, t) {
  const o = [" - ", " \u2013 ", " \u2014 ", ": ", " | ", " \xbb "],
    r = o.length,
    n = 0.6;
  for (
    var i,
      l,
      a = e.replace(/^(www|m|secure)\./, ""),
      s = a.replace(/\.(com|info|net|org|edu|gov)$/, "").toLowerCase(),
      u = 0;
    u < r;
    ++u
  ) {
    var c = t.split(o[u]);
    if (2 === c.length) {
      var d = c[0].trim(),
        h = c[1].trim(),
        m = d.toLowerCase(),
        F = h.toLowerCase(),
        f = Math.max(stringSimilarity(m, a), stringSimilarity(m, s)),
        g = Math.max(stringSimilarity(F, a), stringSimilarity(F, s)),
        p = Math.max(f, g);
      (!l || p > l) &&
        ((l = p),
        (i =
          f > g
            ? { siteName: d, articleTitle: h }
            : { siteName: h, articleTitle: d }));
    }
  }
  return i && l >= n ? i : null;
}
function documentTitleWithoutHostNamePrefix() {
  const e = document.title,
    t = articleTitleAndSiteNameFromTitleString(window.location.host, e);
  return t ? t.articleTitle : e;
}
function querySelectorAllIncludingWithinShadowRoots(e, t) {
  let o = [];
  for (let r of e.querySelectorAll("*"))
    if (r.shadowRoot) {
      let e = querySelectorAllIncludingWithinShadowRoots(r.shadowRoot, t);
      e.length && (o = o.concat(e));
    } else r.matches(t) && o.push(r);
  return o;
}
function queryAllBySelector(e, t) {
  try {
    return window.collectMatchingElementsInFlatTree
      ? window.collectMatchingElementsInFlatTree(e, t)
      : querySelectorAllIncludingWithinShadowRoots(e, t);
  } catch (e) {
    return [];
  }
}
function getElementByID(e) {
  let t = queryAllBySelector(document, `[id='${e}']`);
  return t.length ? t[0] : null;
}
function siblingsIncludingSelfForElement(e) {
  let t = e.parentElement;
  if (t) return t.children;
  let o = e;
  for (; o.previousElementSibling; ) o = o.previousElementSibling;
  let r = [],
    n = o;
  for (; n; ) (r.push(n), (n = n.nextElementSibling));
  return r;
}
function regularExpressionFromUntrustedPatternAttributeString(e) {
  if ((e.startsWith("/") && e.endsWith("/") && (e = e.slice(1, -1)), !e.length))
    return null;
  try {
    return (new RegExp(e, "v"), new RegExp("^(?:" + e + ")$", "v"));
  } catch (e) {
    return null;
  }
}
function regularExpressionsFromStrings(e) {
  return e.map((e) => new RegExp(e));
}
function stringsMatchAnyRegularExpressions(e, t) {
  for (let o of t) for (let t of e) if (o.test(t.toLowerCase())) return !0;
  return !1;
}
function pathFromAnchorWithoutLeadingSlash(e) {
  let t = /\/(.*)/.exec(e.pathname);
  return t && 2 === t.length ? t[1] : null;
}
function innermostActiveElement() {
  let e = document.activeElement,
    t = e;
  for (; t; ) ((t = t?.shadowRoot?.activeElement), t && (e = t));
  return e;
}
function elementAppearsToContinueCaptchaWidget(e) {
  return !!e.querySelector(
    "iframe[title*=captcha i], input[type=hidden][name*=recaptcha]",
  );
}
function isFiniteNumber(e) {
  return "number" == typeof e && isFinite(e);
}
const WBSAutoFillFormTypeUndetermined = 0,
  WBSAutoFillFormTypeAutoFillableStandard = 1,
  WBSAutoFillFormTypeNonAutoFillable = 2,
  WBSAutoFillFormTypeAutoFillableLogin = 3,
  WBSAutoFillFormTypeNewAccount = 4,
  WBSAutoFillFormTypeChangePassword = 5,
  WBSFormMetadataRequestNormal = 0,
  WBSFormMetadataRequestPreFill = 1,
  WBSFormMetadataRequestTesting = 2,
  WBSFormMetadataRequestTextChange = 3,
  WBSFormMetadataRequestCollectMetadataFromDebugMenu = 4,
  ShouldStopAfterFirstMatch = { CollectAllMatches: 0, StopAfterFirstMatch: 1 },
  ShouldFocus = { No: 0, Yes: 1 },
  ShouldBlur = { No: 0, Yes: 1 },
  ShouldAbandonCharacterByCharacterEntryIfTooSlow = { No: 0, Yes: 1 },
  ShouldObscure = { No: 0, Yes: 1 },
  ShouldSetAutoFilled = { No: 0, Yes: 1 },
  ForceNonFormElementAsLogicalBackingElement = { No: !1, Yes: !0 },
  LogicalFormCreationIsProvisional = { No: !1, Yes: !0 },
  MatchCriteria = { Property: 0, Category: 1, Literal: 2 },
  PageScanCharactersSearchedThreshold = 500,
  PageScanMaxCharactersSearched = 600,
  MaximumNumberOfCharactersToCollectForLanguageIdentification = 300,
  MinValueForMaxLengthAttributeToTreatAsPasswordField = 4,
  UsernameCandidateScoreForPlainTextField = 1,
  UsernameCandidateScoreForPlainTextFieldDirectlyBeforePasswordField = 2,
  UsernameCandidateScoreForEmailLabeledFieldBelowPasswordField = 3,
  UsernameCandidateScoreForUsernameLabeledFieldBelowPasswordField = 4,
  UsernameCandidateScoreForEmailLabeledFieldAbovePasswordField = 5,
  UsernameCandidateScoreForUsernameLabeledFieldAbovePasswordField = 6,
  UsernameCandidateScoreBonusForVisibleElement = 0.5,
  UsernameCandidateScorePenaltyForReadOnlyElement = 0.5,
  UsernameCandidateScorePenaltyForMatchingNonUsernameFieldLabelPattern = 2,
  UsernameCandidateScorePenaltyForMatchingSearchFieldLabelPattern = 1.5,
  UsernameCandidateScorePenaltyForAnonymousElement = 1,
  LowestScoreForUsernameFieldCandidate =
    UsernameCandidateScoreForPlainTextField,
  LowestScoreForLabeledUsernameFieldCandidate =
    UsernameCandidateScoreForEmailLabeledFieldBelowPasswordField,
  MaxLengthForFieldAboveWhichToTreatPotentialOneTimeCodeFieldAsRequiringHigherScrutiny = 10,
  DateTimeInputTypes = ["date", "datetime-local", "month", "time", "week"],
  DateTimeInputTypeFormats = {
    date: "yyyy-MM-dd",
    "datetime-local": "yyyy-MM-dd'T'hh:mm",
    month: "yyyy-MM",
    time: "hh:mm",
    week: "yyyy-'W'ww",
  },
  numberOfConsecutiveElementsWithoutSuccessfulPageScanAfterWhichPageScanIsAbandoned = 40;
var mapOfFormTypeToProducerOfAssociatedKeywords = (function () {
    var e = {};
    return (
      (e[WBSAutoFillFormTypeNewAccount] = function () {
        return FormMetadataJSController.mapOfKeywordsIndicatingNewAccountFormTypeToScoreForMatching;
      }),
      (e[WBSAutoFillFormTypeAutoFillableLogin] = function () {
        return FormMetadataJSController.mapOfKeywordsIndicatingLoginFormTypeToScoreForMatching;
      }),
      (e[WBSAutoFillFormTypeChangePassword] = function () {
        return FormMetadataJSController.mapOfKeywordsIndicatingChangePasswordFormTypeToScoreForMatching;
      }),
      e
    );
  })(),
  visibilityCacheGeneration = 0;
let doctypeLooksLikeHTML5 =
  "html" === document.doctype?.name &&
  "" === document.doctype?.publicId &&
  "" === document.doctype?.systemId;
((console.autofillDebugLog = function () {
  FormMetadataJSController.isDebugConsoleLoggingEnabled;
}),
  (Node.prototype.traversePreviousElement = function () {
    for (var e = this.previousElementSibling; e && e.lastElementChild; )
      e = e.lastElementChild;
    return e || this.parentElement;
  }),
  (Node.prototype.traversePreviousNode = function (e) {
    if (this) {
      var t = this.previousSibling;
      if (e(t)) return null;
      for (; t && t.lastChild; ) if (e((t = t.lastChild))) return null;
      return t || this.parentNode;
    }
  }),
  (Node.prototype.traverseNextNode = function (e) {
    if (this) {
      var t = this.firstChild;
      if (t) return t;
      if (e && this === e) return null;
      if ((t = this.nextSibling)) return t;
      for (
        t = this;
        t && !t.nextSibling && (!e || !t.parentNode || t.parentNode !== e);
      )
        t = t.parentNode;
      return t ? t.nextSibling : null;
    }
  }),
  (Node.prototype.isVisible = function () {
    let e = this;
    if (e._isVisible === visibilityCacheGeneration) return !0;
    if (e._isVisible === -visibilityCacheGeneration) return !1;
    let t =
        e.nodeType == Node.TEXT_NODE
          ? e.parentElementIncludingShadowDOMHost()
          : e,
      o = getComputedStyle(t, null);
    if (
      ((e._isVisible = -visibilityCacheGeneration),
      "none" === o.display || "visible" !== o.visibility)
    )
      return !1;
    let r = 0 === parseFloat(o.opacity) ? 6 : 2;
    return (
      !(t.offsetWidth < r) &&
      !(t.offsetHeight < r) &&
      ((e._isVisible = visibilityCacheGeneration), !0)
    );
  }),
  Object.defineProperty(Array.prototype, "joinFirstItems", {
    value: function (e, t) {
      t > this.length && (t = this.length);
      for (var o = "", r = 0; r < t; ++r) (r > 0 && (o += e), (o += this[r]));
      return o;
    },
  }),
  (DOMRect.prototype.isZeroRect = function () {
    return !(this.top || this.right || this.bottom || this.left);
  }),
  (DOMRect.prototype.distanceToRect = function (e) {
    function t(e) {
      function t(e, t) {
        return Math.pow(e.x - t.x, 2) + Math.pow(e.y - t.y, 2);
      }
      var o = e[0],
        r = e[1];
      return (o[0].x >= r[0].x && o[0].x < r[1].x) ||
        (r[0].x >= o[0].x && r[0].x < o[1].x)
        ? Math.abs(o[0].y - r[0].y)
        : (o[0].y >= r[0].y && o[0].y < r[1].y) ||
            (r[0].y >= o[0].y && r[0].y < o[1].y)
          ? Math.abs(o[0].x - r[0].x)
          : Math.sqrt(Math.min(t(o[0], r[1]), t(o[1], r[0])));
    }
    var o = [
        { x: this.left, y: this.top },
        { x: this.right, y: this.top },
      ],
      r = [
        { x: this.right, y: this.top },
        { x: this.right, y: this.bottom },
      ],
      n = [
        { x: this.left, y: this.bottom },
        { x: this.right, y: this.bottom },
      ],
      i = [
        { x: this.left, y: this.top },
        { x: this.left, y: this.bottom },
      ],
      l = [
        { x: e.left, y: e.top },
        { x: e.right, y: e.top },
      ],
      a = [
        { x: e.right, y: e.top },
        { x: e.right, y: e.bottom },
      ],
      s = [
        { x: e.left, y: e.bottom },
        { x: e.right, y: e.bottom },
      ],
      u = [
        { x: e.left, y: e.top },
        { x: e.left, y: e.bottom },
      ],
      c = [
        [i, u],
        [i, a],
        [o, l],
        [o, s],
        [r, u],
        [r, a],
        [n, l],
        [n, s],
      ].map(t);
    return Math.min.apply(Math, c);
  }),
  (Node.prototype.parentElementIncludingShadowDOMHost = function () {
    let e = this.parentElement;
    if (e) return e;
    let t = this.getRootNode();
    return t && t.host ? t.host : null;
  }),
  (Node.prototype.allAncestorsAndSelfIncludingShadowDOMHosts = function () {
    let e = [],
      t = this;
    for (; t; ) (e.push(t), (t = t.parentElementIncludingShadowDOMHost()));
    return e;
  }),
  (HTMLElement.prototype.closestCommonAncestor = function (e) {
    let t = this.parentElement;
    for (; t; ) {
      if (t.contains(e)) return t;
      t = t.parentElement;
    }
    let o = this.allAncestorsAndSelfIncludingShadowDOMHosts().reverse(),
      r = e.allAncestorsAndSelfIncludingShadowDOMHosts().reverse(),
      n = Math.min(o.length, r.length),
      i = null;
    for (let e = 0; e < n; ++e) {
      if (!(o[e] === r[e])) break;
      i = o[e];
    }
    return i || null;
  }),
  (HTMLElement.prototype.isHiddenFromAccessibilityTree = function () {
    const e = 2;
    for (
      let o = 0, r = this;
      o <= e && r;
      ++o, r = r.parentElementIncludingShadowDOMHost()
    ) {
      var t = r.getAttribute("aria-hidden");
      if (t && "true" === t.toLowerCase()) return !0;
    }
    return !1;
  }),
  (HTMLFormElement.prototype.isVisible = function () {
    if (Node.prototype.isVisible.call(this)) return !0;
    for (var e = this.elements, t = e.length, o = 0; o < t; ++o)
      if (e[o].isVisible()) return !0;
    return !1;
  }));
let cachedRegularExpressionsForDomainMatching = {};
((LogicalForm = function (e, t, o) {
  let r = e.length;
  var n = e[0].form,
    i = n;
  let l = e[0],
    a = e[r - 1];
  ((!t && i) || (i = 1 === r ? l : l.closestCommonAncestor(a)),
    (n && n.contains(a)) || (n = i));
  let s = i.closest('*[role~="dialog"]');
  s && (i = s);
  let u = l._provisionalLogicalFormUniqueIDForFirstControlInLogicalForm;
  (u ||
    ((u = FormMetadataJSController.nextFormUniqueID),
    (l._provisionalLogicalFormUniqueIDForFirstControlInLogicalForm = u)),
    (this._formUniqueID = u),
    (this._metadata = {}),
    (this._weakControls = Array.prototype.map.call(e, (e) => new WeakRef(e))),
    (this._weakFormElement = new WeakRef(n)),
    (this._weakBackingElement = new WeakRef(i)),
    o || this.markElementsAsPartOfLogicalForm());
}),
  (LogicalForm.prototype = {
    get elements() {
      return this._weakControls.flatMap((e) => e.deref());
    },
    get formElement() {
      return this._weakFormElement.deref();
    },
    get backingElement() {
      return this._weakBackingElement.deref();
    },
    get formUniqueID() {
      return this._formUniqueID;
    },
    get metadata() {
      return this._metadata;
    },
    set metadata(e) {
      this._metadata = e;
    },
    containsControl: function (e) {
      return e.hasOwnProperty("_logicalFormUniqueID")
        ? e._logicalFormUniqueID === this.formUniqueID
        : e.form === this.formElement;
    },
    radioButtonsWithName: function (e) {
      let t = queryAllBySelector(document.documentElement, `*[name="${e}"]`);
      return Array.prototype.filter.call(
        t,
        function (e) {
          return (
            (e.form === this.formElement || this.formElement?.contains(e)) &&
            isRadioButtonElement(e)
          );
        },
        this,
      );
    },
    annotate: function (e) {
      let t = this.formElement;
      if (t) {
        var o = t._annotations;
        if (o) {
          for (var r in e) {
            var n = e[r];
            n ? (o[r] = n) : delete o[r];
          }
          hasOwnProperties(o) || delete t._annotations;
        } else t._annotations = e;
      }
    },
    markElementsAsPartOfLogicalForm: function () {
      let e = this._weakControls.length;
      for (let t = 0; t < e; t++) {
        let o = this._weakControls[t].deref();
        o &&
          ((o._logicalFormUniqueID = this.formUniqueID),
          t + 1 < e &&
            (o._weakNextControlInLogicalForm = this._weakControls[t + 1]),
          t > 0 &&
            (o._weakPreviousControlInLogicalForm = this._weakControls[t - 1]));
      }
    },
    get annotations() {
      return this.formElement?._annotations;
    },
    get isAnnotated() {
      return !!this.annotations;
    },
  }),
  (LogicalFormCache = function () {
    ((this._logicalFormsByUniqueID = new Map()), (this._allLogicalForms = []));
  }),
  (LogicalFormCache.prototype = {
    get size() {
      return this._logicalFormsByUniqueID.size;
    },
    removeUnparentedLogicalFormsFromCache: function () {
      let e = new Set();
      for (let t of this._allLogicalForms)
        t.formElement?.isConnected || e.add(t);
      for (let t of e) this._logicalFormsByUniqueID.delete(t.formUniqueID);
      this._allLogicalForms = Array.from(this._logicalFormsByUniqueID.values());
    },
    logicalFormForControl: function (e) {
      for (let t of this._allLogicalForms) if (t.containsControl(e)) return t;
      return null;
    },
    allForms: function () {
      return this._allLogicalForms.slice();
    },
    cachedForms: function () {
      return Array.from(this._logicalFormsByUniqueID.values());
    },
    addOrUpdate: function (e) {
      (this._logicalFormsByUniqueID.set(e.formUniqueID, e),
        this._allLogicalForms.push(e));
    },
    clearCacheAndAdd: function (e) {
      (this._logicalFormsByUniqueID.clear(), (this._allLogicalForms = []));
      for (let t of e) this.addOrUpdate(t);
    },
    logicalFormWithUniqueID: function (e) {
      return this._logicalFormsByUniqueID.get(e);
    },
  }),
  (FormMetadata = function () {
    ((this._logicalFormsCache = new LogicalFormCache()),
      (this._elementsWithGeneratedPasswords = []),
      (this._generatedPasswords = []),
      (this._labels = queryAllBySelector(document, "label")),
      (this._controlUniqueIDToWeakControlMap = new Map()),
      (this._mapOfFormTypeToExtraScoreProducer = (function () {
        let e = {};
        return (
          (e[WBSAutoFillFormTypeNewAccount] = function () {
            return 0;
          }),
          (e[WBSAutoFillFormTypeAutoFillableLogin] = function (e) {
            const t = 2,
              o = function (e) {
                return (
                  "checkbox" === e.type &&
                  FormMetadataJS._labelsForElement(e).some(
                    (e) =>
                      /(remember|keep) me/i.test(e.innerText.trim()) &&
                      e.isVisible(),
                  )
                );
              };
            return 1 === e.elements.filter((e) => o(e)).length ? t : 0;
          }),
          (e[WBSAutoFillFormTypeChangePassword] = function () {
            return 0;
          }),
          e
        );
      })()),
      (this._requiredFormatForDateTimeInput = DateTimeInputTypes.reduce(
        function (e, t) {
          let o = document.createElement("input");
          o.type = t;
          let r = "a";
          return (
            (o.value = r),
            (e[t] = "" === o.value ? DateTimeInputTypeFormats[t] : ""),
            e
          );
        },
        {},
      )));
  }),
  (FormMetadata.prototype = {
    _getTagName: function (e) {
      var t = e.tagName;
      return "string" == typeof t || "string" == typeof (t = e.nodeName)
        ? t
        : void 0;
    },
    _getNameOrId: function (e) {
      return e.name && e.name.length ? e.name : e.id;
    },
    controlUniqueID: function (e) {
      if (e._controlUniqueID) return e._controlUniqueID;
      var t = "ControlID-" + FormMetadataJSController.nextControlUniqueID;
      e._controlUniqueID = t;
      this._controlUniqueIDToWeakControlMap.get(t);
      return (
        this._controlUniqueIDToWeakControlMap.set(t, new WeakRef(e)),
        e._controlUniqueID
      );
    },
    _searchForLabelsAboveCell: function (e, t) {
      var o = window.getComputedStyle(t, null);
      if (!o || "table-cell" !== o.getPropertyValue("display")) return null;
      var r = cellVisuallyAbove(t);
      if (!r) return null;
      for (var n = 0, i = r.firstChild; i; i = i.traverseNextNode(r))
        if (i.nodeType == Node.TEXT_NODE && i.isVisible()) {
          var l = i.nodeValue,
            a = e.searchReverse(l);
          if (a)
            return {
              Distance: n,
              Match: a[0],
              Property: a[1],
              Category: a[2],
              ParentProperty: a[3],
            };
          n += l.length;
        }
      return null;
    },
    _collectStringFromNodeForPageScan: function (e, t, o) {
      var r = e.nodeValue,
        n = r.length;
      return (
        o + n > PageScanMaxCharactersSearched &&
          ((r = r.substr(-(PageScanCharactersSearchedThreshold - o))),
          (n = PageScanCharactersSearchedThreshold - o)),
        (r = r.trim()).length && t.push(r),
        o
      );
    },
    _dataForComputingMatchFromPageScanBeforeElement: function (e, t) {
      function o(e) {
        return e && e.nodeType == Node.ELEMENT_NODE && e.matches("nav");
      }
      var r,
        n = [],
        i = 0;
      let l = this._logicalFormsCache.logicalFormForControl(e);
      if (!l) return [[], null];
      var a = l.formElement,
        s = a && a.isVisible();
      t || (t = a);
      for (
        var u = e.traversePreviousNode(o);
        u && i < PageScanCharactersSearchedThreshold;
        u = u.traversePreviousNode(o)
      ) {
        var c = u.localName;
        if (u === t) break;
        if (this._isRenderedFormControl(u)) {
          if (u.isVisible() || !s) break;
        } else {
          if (this._isLabelElement(u) && u.isVisible()) break;
          if ("td" !== c || r) {
            if ("tr" === c && r) break;
            if ("ul" === c || "ol" === c || "dl" === c) break;
            if ("li" === c) {
              if (!u.parentNode.contains(e)) break;
            } else
              u.nodeType == Node.TEXT_NODE &&
                u.isVisible() &&
                (i += this._collectStringFromNodeForPageScan(u, n, i));
          } else r = u;
        }
      }
      return [n, r];
    },
    _matchFromPageScanBeforeElement: function (e, t, o) {
      var r = this._pageScanContext
          ? this._pageScanContext.backwardScanCache
          : null,
        n = this._pageScanDataForElementWithCacheAndDataProducer(
          t,
          r,
          this._dataForComputingMatchFromPageScanBeforeElement.bind(this),
          o,
        ),
        i = n[0],
        l = this._matchFromPatternMatcherAndStringsFromPageScan(e, i);
      if (l) return l;
      var a = n[1];
      if (a) {
        var s = this._searchForLabelsAboveCell(e, a);
        if (s) return ((s.IsInCellAbove = !0), s);
      }
      return null;
    },
    _isElementFollowedByForgotUserNameOrEmailAffordance: function (e, t) {
      (this._forgotUserNameRegularExpressions ||
        (this._forgotUserNameRegularExpressions = regularExpressionsFromStrings(
          FormMetadataJSController.regularExpressionsForForgotUserNameAffordance,
        )),
        this._forgotEmailRegularExpressions ||
          (this._forgotEmailRegularExpressions = regularExpressionsFromStrings(
            FormMetadataJSController.regularExpressionsForForgotEmailAffordance,
          )));
      let o = this._stringsToEvaluateToDetermineIfElementIsFollowedByAffordance(
        e,
        t,
      );
      return (
        !!stringsMatchAnyRegularExpressions(
          o,
          this._forgotUserNameRegularExpressions,
        ) ||
        !!stringsMatchAnyRegularExpressions(
          o,
          this._forgotEmailRegularExpressions,
        )
      );
    },
    _isElementFollowedByForgotPasswordAffordance: function (e, t) {
      return (
        this._forgotPasswordRegularExpressions ||
          (this._forgotPasswordRegularExpressions =
            regularExpressionsFromStrings(
              FormMetadataJSController.regularExpressionsForForgotPasswordAffordance,
            )),
        stringsMatchAnyRegularExpressions(
          this._stringsToEvaluateToDetermineIfElementIsFollowedByAffordance(
            e,
            t,
          ),
          this._forgotPasswordRegularExpressions,
        )
      );
    },
    _numberOfForgotUserNameEmailOrPasswordAffordancesFollowingElement:
      function (e, t) {
        (this._forgotEmailRegularExpressions ||
          (this._forgotEmailRegularExpressions = regularExpressionsFromStrings(
            FormMetadataJSController.regularExpressionsForForgotEmailAffordance,
          )),
          this._forgotPasswordRegularExpressions ||
            (this._forgotPasswordRegularExpressions =
              regularExpressionsFromStrings(
                FormMetadataJSController.regularExpressionsForForgotPasswordAffordance,
              )),
          this._forgotUserNameRegularExpressions ||
            (this._forgotUserNameRegularExpressions =
              regularExpressionsFromStrings(
                FormMetadataJSController.regularExpressionsForForgotUserNameAffordance,
              )));
        let o =
            this._stringsToEvaluateToDetermineIfElementIsFollowedByAffordance(
              e,
              t,
            ),
          r = 0;
        return (
          stringsMatchAnyRegularExpressions(
            o,
            this._forgotUserNameRegularExpressions,
          ) && r++,
          stringsMatchAnyRegularExpressions(
            o,
            this._forgotEmailRegularExpressions,
          ) && r++,
          stringsMatchAnyRegularExpressions(
            o,
            this._forgotPasswordRegularExpressions,
          ) && r++,
          r
        );
      },
    _stringsToEvaluateToDetermineIfElementIsFollowedByAffordance: function (
      e,
      t,
    ) {
      let o = this._dataForComputingMatchFromPageScanAfterElement(e, "A");
      if (!o.length) {
        const t = e.traverseNextNode();
        if (t) {
          let e = t;
          t instanceof Node && (e = t.parentElementIncludingShadowDOMHost());
          const r = e.querySelector("a");
          if (r) {
            o.push(r.innerText);
            const e = pathFromAnchorWithoutLeadingSlash(r);
            e && o.push(e);
          }
        }
      }
      if (!o.length) {
        for (let r of queryAllBySelector(t, "a")) {
          if (e.compareDocumentPosition(r) & Node.DOCUMENT_POSITION_FOLLOWING) {
            o.push(r.innerText);
            const e = pathFromAnchorWithoutLeadingSlash(r);
            e && o.push(e);
          }
        }
        for (let r of queryAllBySelector(t, "button")) {
          e.compareDocumentPosition(r) & Node.DOCUMENT_POSITION_FOLLOWING &&
            o.push(r.innerText);
        }
      }
      const r = e._weakNextControlInLogicalForm?.deref();
      return (r && "button" === r.type && o.push(r.innerText), o);
    },
    _dataForComputingMatchFromPageScanAfterElement: function (e, t, o) {
      var r = [],
        n = 0,
        i = this._logicalFormsCache.logicalFormForControl(e);
      if (!i) return [];
      var l = i.formElement,
        a = l && l.isVisible();
      let s = void 0 !== t;
      o || (o = l);
      for (
        var u = e.traverseNextNode();
        u && n < PageScanCharactersSearchedThreshold;
        u = u.traverseNextNode()
      ) {
        var c = u.localName;
        if (u === o) {
          var d = this._pageScanContext;
          d && !n && (d.forwardScanIsFutile = !0);
          break;
        }
        if (this._isRenderedFormControl(u)) {
          if (u.isVisible() || !a) break;
        } else {
          if (this._isLabelElement(u) && u.isVisible()) break;
          if ("tr" === c) break;
          if ("ul" === c || "ol" === c || "dl" === c) break;
          if (u.nodeType == Node.TEXT_NODE && u.isVisible()) {
            if (void 0 !== t && (!u.parentNode || u.parentNode.tagName !== t))
              continue;
            if (((n += this._collectStringFromNodeForPageScan(u, r, n)), s))
              break;
          }
        }
      }
      return r;
    },
    _matchFromPageScanAfterElement: function (e, t, o) {
      var r = this._pageScanContext
          ? this._pageScanContext.forwardScanCache
          : null,
        n = this._pageScanDataForElementWithCacheAndDataProducer(
          t,
          r,
          this._dataForComputingMatchFromPageScanAfterElement.bind(this),
          o,
        );
      return this._matchFromPatternMatcherAndStringsFromPageScan(e, n);
    },
    _pageScanDataForElementWithCacheAndDataProducer: function (e, t, o, r) {
      if (!t) return o(e, r);
      if ((n = t.get(e))) return n;
      var n = o(e, r);
      return (t.set(e, n), n);
    },
    _matchFromPatternMatcherAndStringsFromPageScan: function (e, t) {
      for (var o = t.length, r = 0, n = 0; n < o; ++n) {
        var i = t[n];
        r += i.length;
        var l = e.searchReverse(i);
        if (l)
          return {
            Distance: r,
            Match: l[0],
            Property: l[1],
            Category: l[2],
            ParentProperty: l[3],
          };
      }
      return null;
    },
    _matchPatternAgainstString: function (e, t) {
      if (!t) return null;
      var o = t.replace(/[\d_.-]/g, " ");
      return (
        (o = o.replace(/[a-z][A-Z]/g, function (e) {
          return e[0] + " " + e[1];
        })),
        e.longestMatch(o)
      );
    },
    _controlsAreAllButtons: function (e) {
      for (var t = e.length, o = 0; o < t; ++o) {
        if (!(e[o] instanceof HTMLButtonElement)) return !1;
      }
      return !0;
    },
    _createLogicalFormsForControls: function (e, t, o) {
      if (this._controlsAreAllButtons(e)) return [];
      let r,
        n,
        i = e.map(function (e) {
          return e.getBoundingClientRect();
        }),
        l = e.length,
        a = 0;
      i[0].isZeroRect() ? ((r = 0), (n = null)) : ((r = 1), (n = i[0]));
      for (let h = 1; h < l; ++h) {
        let m = i[h];
        if (!m.isZeroRect()) {
          if (n) {
            let F = n.distanceToRect(m);
            F && (++r, (a += F));
          }
          n = m;
        }
      }
      if (1 === r) {
        function s(e) {
          return e.closest("header, footer, aside");
        }
        let f = [],
          g = 0;
        for (; g < l; ) {
          let p = [e[g]],
            C = s(e[g]);
          for (let A = g + 1; A < l; ++A) {
            let _ = e[A];
            if (C !== s(e[A])) break;
            p.push(_);
          }
          (f.push(new LogicalForm(p, t, o)), (g += p.length));
        }
        return f;
      }
      let u = r ? a / r : 0,
        c = [],
        d = 0;
      for (; d < l; ) {
        let b = [e[d]],
          y = !1,
          S = i[d].isZeroRect() ? null : i[d];
        for (let T = d + 1; T < l; ++T) {
          let E = e[T],
            I = i[T];
          if (!I.isZeroRect()) {
            if (y) {
              if (S && S.distanceToRect(I) > u) break;
            } else y = couldBeFormSubmissionControl(E);
            S = I;
          }
          b.push(E);
        }
        (c.push(new LogicalForm(b, t, o)), (d += b.length));
      }
      return c;
    },
    _formLooksLikeAspnetForm: function (e) {
      const t = 3;
      var o = 0;
      ("aspnetForm" === e.getAttribute("id") && ++o,
        "aspnetForm" === e.getAttribute("name") && ++o);
      for (
        var r = queryAllBySelector(e, "input"), n = 0, i = r.length;
        n < i;
        ++n
      ) {
        var l = r[n],
          a = l.getAttribute("id"),
          s = l.getAttribute("name");
        (/ctl\d\d_/.test(a) && ++o,
          /ctl\d\d\$/.test(s) && ++o,
          "hidden" === l.getAttribute("type") &&
            (("__VIEWSTATE" === s && "__VIEWSTATE" === a) ||
              ("__EVENTTARGET" === s && "__EVENTTARGET" === a) ||
              ("__EVENTARGUMENT" === s && "__EVENTARGUMENT" === a) ||
              ("__LASTFOCUS" === s && "__LASTFOCUS" === a)) &&
            ++o);
      }
      for (
        var u = queryAllBySelector(document, "script"), c = u.length, d = 0;
        d < c;
        ++d
      ) {
        var h = anchorWithURLString(u[d].src);
        if (h.host === window.location.host) {
          var m = lastPathComponentFromAnchor(h);
          ("WebResource.axd" !== m && "ScriptResource.axd" !== m) || ++o;
        }
      }
      return o >= t;
    },
    _anchorLooksLikeSubmitButton: function (e) {
      return /submit|button/i.test(e.getAttribute("id"));
    },
    _visibleInputAndSelectElementsInForm: function (e) {
      let t = queryAllBySelector(e, "input:not([type='hidden']), select"),
        o = [];
      for (var r = 0, n = t.length; r < n; ++r) {
        let e = t[r];
        e.isVisible() && o.push(e);
      }
      return o;
    },
    _elementsActingAsButtonsInForm: function (e) {
      let t = Array.prototype.slice.call(
          queryAllBySelector(e, "input[type='submit'], input[type='image']"),
        ),
        o = queryAllBySelector(e, "a");
      for (var r = 0, n = o.length; r < n; ++r) {
        let e = o[r];
        this._anchorLooksLikeSubmitButton(e) && e.isVisible() && t.push(e);
      }
      return t;
    },
    _logicalFormsForAspnetForm: function (e) {
      function t(e) {
        var o = e.length;
        if (o <= 1)
          a.push(
            new LogicalForm(e, ForceNonFormElementAsLogicalBackingElement.Yes),
          );
        else {
          var r = o - 1,
            n = e[r];
          if (e[0].closestCommonAncestor(n) instanceof HTMLTableRowElement) {
            for (var i = 0; i < r; ++i) {
              if (
                !(e[i].closestCommonAncestor(n) instanceof HTMLTableRowElement)
              )
                return (t(e.slice(0, i)), void t(e.slice(i)));
            }
            a.push(
              new LogicalForm(
                e,
                ForceNonFormElementAsLogicalBackingElement.Yes,
              ),
            );
          } else
            a.push(
              new LogicalForm(
                e,
                ForceNonFormElementAsLogicalBackingElement.Yes,
              ),
            );
        }
      }
      for (
        var o = this._visibleInputAndSelectElementsInForm(e),
          r = o.length,
          n = this._elementsActingAsButtonsInForm(e),
          i = n.length,
          l = 0;
        l < i;
        ++l
      ) {
        (s = n[l]).getAttribute("id") &&
          (s._aspNetIDComponents = s.getAttribute("id").split("_"));
      }
      n.sort(function (e, t) {
        var o = e._aspNetIDComponents || [];
        return (t._aspNetIDComponents || []).length - o.length;
      });
      var a = [];
      for (l = 0; l < i; ++l) {
        var s,
          u = (s = n[l])._aspNetIDComponents;
        if (u) {
          var c = u.length;
          if (!(c < 2)) {
            for (
              var d = u.joinFirstItems("_", c - 1) + "_", h = [], m = r - 1;
              m >= 0;
              --m
            ) {
              var F = o[m],
                f = F.getAttribute("id");
              f && f.startsWith(d) && (h.push(F), o.splice(m, 1));
            }
            if ((h.length && t(h.reverse()), !(r = o.length))) break;
          }
        }
      }
      return (r && t(o), a);
    },
    _logicalFormsInPage: function (e, t) {
      let o = [];
      const r = document.querySelector("form form");
      let n = {},
        i = r ? document.forms : queryAllBySelector(document, "form");
      const l = 400,
        a = (e) => (e.length <= l ? e : Array.from(e).slice(0, l)),
        s = (e, t, o) => {
          let r = queryAllBySelector(e, t);
          return r.length <= l ? r : a(queryAllBySelector(e, o));
        };
      let u = 0,
        c = i.length,
        d = new Set();
      for (var h = 0; h < c; ++h) {
        let l = i[h],
          c = r
            ? a(l.elements)
            : s(
                l,
                "input, select, textarea, button, fieldset",
                "input, select, textarea, button[type='submit'], fieldset",
              );
        for (let e of c) d.add(e);
        if (c.length) {
          if ((u++, e && u >= e)) return o;
          if (t) {
            let e = [l.method, l.name, l.action, l.className].join("|"),
              o = n[e] || 0;
            if (o > t) continue;
            n[e] = o + 1;
          }
          this._formLooksLikeAspnetForm(l)
            ? (o = o.concat(this._logicalFormsForAspnetForm(l)))
            : o.push(new LogicalForm(c));
        }
      }
      let m = [],
        F = s(
          document,
          "input, select, textarea, button",
          "input, select, textarea, button[type='submit']",
        ),
        f = F.length;
      for (let e = 0; e < f; ++e) {
        let t = F[e];
        if (d.has(t)) {
          if (!m.length) continue;
          ((o = o.concat(this._createLogicalFormsForControls(m))), (m = []));
        } else
          (this._isRenderedFormControl(t) || autocompleteTokens(t)) &&
            m.push(t);
      }
      m.length && (o = o.concat(this._createLogicalFormsForControls(m)));
      let g = o.length;
      for (h = 0; h < g - 1; ++h) {
        let e = o[h],
          t = e.backingElement,
          r = t.getBoundingClientRect(),
          n = o[h + 1],
          i = n.backingElement,
          l = i.getBoundingClientRect();
        const a = 40;
        if (
          t.nextElementSibling === i &&
          t.action === i.action &&
          r.height &&
          l.height &&
          r.x === l.x &&
          r.width === l.width &&
          r.bottom + a >= l.top
        ) {
          let t =
              1 ===
              e.elements.filter(function (e) {
                return e.isVisible();
              }).length,
            r = e.elements.includes(function (e) {
              return e.matches("input[type=submit], button") && e.isVisible();
            });
          if (t && !r) {
            let t = e.elements.concat(n.elements),
              r = this._createLogicalFormsForControls(
                t,
                ForceNonFormElementAsLogicalBackingElement.Yes,
                LogicalFormCreationIsProvisional.Yes,
              );
            if (1 === r.length) {
              let e = r[0];
              (e.markElementsAsPartOfLogicalForm(), o.splice(h, 2, e), g--);
            }
          }
        }
      }
      return o;
    },
    _matchPatternAgainstElement: function (e, t, o) {
      function r(e, t) {
        if (!e) return null;
        var r = o[t],
          n = sharedPrefixLength(r, e[t]);
        return n ? r.substr(n) : null;
      }
      function n(e, t) {
        if (!t) return null;
        const o = t.text;
        if (/^-.+-$/.test(o)) return o;
        if (!t.value.length && o.length) {
          const r = e.options,
            n = r.length;
          let i = !0;
          for (let e = 0; e < n; ++e) {
            const o = r[e];
            if (o !== t && !o.value.length) {
              i = !1;
              break;
            }
          }
          if (i) return o;
        }
        return null;
      }
      this._logicalFormsCache.logicalFormForControl(o);
      var i = o._weakPreviousControlInLogicalForm?.deref(),
        l = o._weakNextControlInLogicalForm?.deref();
      const a = ["name", "id"],
        s = a.length;
      for (var u = new Array(s), c = new Array(s), d = 0; d < s; ++d) {
        var h = a[d];
        ((u[d] = r(i, h)), (c[d] = r(l, h)));
      }
      const m = t.length;
      for (var F = 0; F < m; ++F) {
        var f,
          g = t[F];
        for (
          d = 0;
          d < s &&
          !(f = this._matchPatternAgainstString(g, u[d])) &&
          !(f = this._matchPatternAgainstString(g, c[d])) &&
          !(f = this._matchPatternAgainstString(g, o[a[d]]));
          ++d
        );
        const r = "select" === this._getTagName(o).toLowerCase();
        if (!f && r) {
          const e = r ? defaultOptionForSelectElement(o) : null,
            t = r ? o.options[0] : null;
          let i = n(o, e);
          (i || e === t || (i = n(o, t)),
            (f = this._matchPatternAgainstString(g, i)));
        }
        f &&
          e.push({
            FoundByPageScan: !1,
            Match: f[0].toLowerCase(),
            Property: f[1],
            Category: f[2],
            ParentProperty: f[3],
            Priority: F,
          });
      }
    },
    _labelsForElement: function (e) {
      if (e._cachedLabels) return e._cachedLabels;
      e._cachedLabels = [];
      let t = e.getAttribute("aria-labelledby");
      if (t && t.length) {
        let r = t.split(" ");
        for (var o = 0; o < r.length; o++) {
          let t = getElementByID(r[o]);
          t && e._cachedLabels.push(t);
        }
      }
      if (e._cachedLabels.length) return e._cachedLabels;
      let r = function (e) {
        return e.replace(/[^a-zA-Z0-9]+/g, "");
      };
      for (let t of [e.getAttribute("id"), e.getAttribute("name")]) {
        if (!t || !t.length) continue;
        let o = [],
          n = e.form;
        for (let i of this._labels) {
          if (n === i.closest("form")) {
            let n = i.getAttribute("for");
            if (n === t) e._cachedLabels.push(i);
            else if (n) {
              let e = r(n);
              e.length > 0 && e === r(t) && o.push(i);
            }
          }
        }
        if (
          (0 === e._cachedLabels.length &&
            1 === o.length &&
            (e._cachedLabels = o),
          e._cachedLabels.length)
        )
          return e._cachedLabels;
      }
      let n = this._logicalFormsCache.logicalFormForControl(e)?.formElement;
      for (
        let t = e.parentElementIncludingShadowDOMHost();
        t && t !== n;
        t = t.parentElementIncludingShadowDOMHost()
      )
        if (this._isLabelElement(t)) {
          e._cachedLabels.push(t);
          break;
        }
      return e._cachedLabels;
    },
    _matchesForElement: function (e, t, o = !1) {
      function r(e, o) {
        for (var r = 0; r < l; ++r) {
          var n = t[r].searchReverse(e);
          if (
            n &&
            (i.push({
              FoundByPageScan: !1,
              Match: n[0].toLowerCase(),
              Property: n[1],
              Category: n[2],
              ParentProperty: n[3],
              Priority: r,
            }),
            o === ShouldStopAfterFirstMatch.StopAfterFirstMatch)
          )
            return;
        }
      }
      function n(e, t) {
        return e &&
          e.Match.length &&
          (!t ||
            (!e.IsInCellAbove && t.IsInCellAbove) ||
            (e.IsInCellAbove == t.IsInCellAbove && e.Distance < t.Distance))
          ? {
              FoundByPageScan: !0,
              Match: A.Match.toLowerCase(),
              Property: A.Property,
              Category: A.Category,
              ParentProperty: A.ParentProperty,
              Priority: y,
            }
          : t;
      }
      var i = [],
        l = t.length;
      this._matchPatternAgainstElement(i, t, e);
      for (
        var a = !1, s = this._labelsForElement(e), u = 0;
        u < s.length;
        ++u
      ) {
        var c = s[u].innerText;
        c && ((a = !0), r(c, ShouldStopAfterFirstMatch.StopAfterFirstMatch));
      }
      let d = placeholderInfoForElement(e);
      d &&
        !d.AttributeMatchedWasValue &&
        r(d.Text, ShouldStopAfterFirstMatch.StopAfterFirstMatch);
      var h = e.getAttribute("title");
      h && r(h, ShouldStopAfterFirstMatch.StopAfterFirstMatch);
      var m =
        this._labelForElementIfElementAndLabelAreOnlyElementsOfTheirKindAmongSiblingElements(
          e,
        );
      m?.innerText.length &&
        ((a = !0), r(m.innerText, ShouldStopAfterFirstMatch.CollectAllMatches));
      let F = this._ariaLabelForElementOrParentOfElement(e);
      F && r(F, ShouldStopAfterFirstMatch.StopAfterFirstMatch);
      var f = e.getAttribute("formcontrolname");
      f && f.length && r(f, ShouldStopAfterFirstMatch.StopAfterFirstMatch);
      var g = this._pageScanContext,
        p = !0,
        C = !1;
      if (
        (g &&
          (g.shouldUsePageScan && (p = g.shouldUsePageScan()),
          g.reportPageScanUsedSuccessfully && (C = !0)),
        !p)
      )
        return i;
      if (a) return (C && g.reportPageScanUsedSuccessfully(!1), i);
      if (!0 === o) return i;
      for (var A, _ = null, b = null, y = 0; y < l; ++y)
        ((_ = n((A = this._matchFromPageScanBeforeElement(t[y], e)), _)),
          (g && g.forwardScanIsFutile) ||
            (b = n((A = this._matchFromPageScanAfterElement(t[y], e)), b)));
      var S = !1;
      if ((_ && (i.push(_), (S = !0)), b))
        for (var T = 0, E = i.length; T < E; ++T) {
          var I = i[T];
          if (b.Priority === I.Priority) {
            (i.push(b), (S = !0));
            break;
          }
        }
      return (
        C && g.reportPageScanUsedSuccessfully(S),
        i.length &&
          d &&
          d.AttributeMatchedWasValue &&
          r(d.Text, ShouldStopAfterFirstMatch.StopAfterFirstMatch),
        i
      );
    },
    _bestMatchFromMatches: function (e) {
      function t(e, t) {
        for (var o = e.length, r = {}, n = 0; n < o; ++n) {
          var i,
            l = e[n];
          switch (t) {
            case MatchCriteria.Property:
              i = l.Property || l.Match;
              break;
            case MatchCriteria.Category:
              i = l.Category || l.Match;
              break;
            case MatchCriteria.Literal:
              i = l.Match;
          }
          r[i]
            ? (r[i].Frequency += 1)
            : (r[i] = { Frequency: 1, FirstMatchObject: l });
        }
        var a = [];
        for (var s in r) a.push(r[s]);
        var u = a.sort(function (e, t) {
            return t.Frequency - e.Frequency;
          }),
          c = u.length;
        if (c <= 1) return null;
        if (t === MatchCriteria.Property)
          for (n = 0; n < c; ++n) {
            if (u[n].FirstMatchObject.ParentProperty in r)
              return u[n].FirstMatchObject;
          }
        return u[0].Frequency > u[1].Frequency ? u[0].FirstMatchObject : void 0;
      }
      var o = e.length;
      if (0 === o) return null;
      if (1 === o) return e[0];
      var r = t(e, MatchCriteria.Property);
      return (
        r ||
        ((r = t(e, MatchCriteria.Category))
          ? r
          : e.sort(function (e, t) {
              return e.Priority - t.Priority;
            })[0])
      );
    },
    _bestMatchForElement: function (e, t, o = !1) {
      if (!e) return null;
      var r = this._matchesForElement(e, t, o);
      return this._bestMatchFromMatches(r, e, t);
    },
    _labelForElementIfElementAndLabelAreOnlyElementsOfTheirKindAmongSiblingElements:
      function (e) {
        for (
          var t = null,
            o = e.tagName,
            r = siblingsIncludingSelfForElement(e),
            n = r.length,
            i = 0;
          i < n;
          ++i
        ) {
          var l = r[i];
          if (e !== l) {
            if (o === l.tagName) return null;
            if (this._isLabelElement(l)) {
              if (t) return null;
              t = l;
            }
          }
        }
        return t;
      },
    _ariaLabelForElementOrParentOfElement: function (e) {
      var t = e;
      let o = 3;
      for (var r = 0; r < o && t; ++r) {
        let e = t.getAttribute("aria-label");
        if (e && !t.isHiddenFromAccessibilityTree()) return e;
        t = t.parentElementIncludingShadowDOMHost();
      }
      return null;
    },
    _cachedOneTimeCodePatternMatcher: function () {
      return this._cachedPatternMatchers(
        "oneTimeCodeFieldLabelPatternMatchers",
      )[0];
    },
    _cachedPatternMatchers: function (e) {
      let t = "_" + e,
        o = this[t];
      return (o || ((this[t] = FormMetadataJSController[e]), (o = this[t])), o);
    },
    _cachedElementPatternMatch: function (e, t, o) {
      var r = t + "_wasVisible",
        n = e[r];
      if (!0 === n) return e[t];
      var i = e.isVisible();
      if (n === i) return e[t];
      e[r] = i;
      let l = this._cachedPatternMatchers(o);
      return ((e[t] = this._bestMatchForElement(e, l)), e[t]);
    },
    _isLabeledUsernameField: function (e) {
      return (
        !!this._isAutoFillableTextField(e) &&
        null !==
          this._cachedElementPatternMatch(
            e,
            "_usernameFieldPatternMatch",
            "usernameFieldLabelPatternMatchers",
          )
      );
    },
    _isLabeledLoginField: function (e) {
      return (
        !!this._isAutoFillableTextField(e) &&
        null !==
          this._cachedElementPatternMatch(
            e,
            "_loginFieldPatternMatch",
            "loginFormTypePatternMatchers",
          )
      );
    },
    _isLabeledSignUpField: function (e) {
      return (
        !!this._isAutoFillableTextField(e) &&
        null !==
          this._cachedElementPatternMatch(
            e,
            "_signUpFieldPatternMatch",
            "newAccountFormTypePatternMatchers",
          )
      );
    },
    _isLabeledEmailField: function (e) {
      return (
        !!this._isAutoFillableTextField(e) &&
        ("email" === e.type ||
          null !==
            this._cachedElementPatternMatch(
              e,
              "_emailFieldPatternMatch",
              "emailFieldLabelPatternMatchers",
            ))
      );
    },
    _addressBookLabelForElement: function (e) {
      if (
        !this._isAutoFillableTextField(e) &&
        !this._isAutoFillableSelectElement(e) &&
        !this._isAutoFillableTextAreaElement(e)
      )
        return null;
      var t = this._cachedElementPatternMatch(
        e,
        "_addressBookPatternMatch",
        "addressBookFieldLabelPatternMatchers",
      );
      return t ? t.Match : null;
    },
    _elementDisallowsAutocomplete: function (e) {
      var t = e.getAttribute("autocomplete");
      return t && "off" === t.toLowerCase();
    },
    _isTextArea: function (e) {
      return e instanceof HTMLTextAreaElement;
    },
    _isSelectElement: function (e) {
      return e instanceof HTMLSelectElement;
    },
    _isLabelElement: function (e) {
      return e instanceof HTMLLabelElement;
    },
    _isRenderedFormControl: function (e) {
      var t = e.localName;
      if (!t) return !1;
      return (
        t in
          {
            button: !0,
            isindex: !0,
            fieldset: !0,
            legend: !0,
            meter: !0,
            optgroup: !0,
            option: !0,
            progress: !0,
            select: !0,
            textarea: !0,
          } ||
        (e instanceof HTMLInputElement &&
          (!!this._isElementAHiddenUsername(e) ||
            !e.type ||
            "hidden" !== e.type))
      );
    },
    _isEditablePlainTextField: function (e) {
      return (
        !!isInputElement(e) &&
        !e.disabled &&
        !e.readOnly &&
        (!e.type || "text" === e.type)
      );
    },
    _isTextField: function (e) {
      if (this._isTextArea(e)) return !0;
      if (!isInputElement(e)) return !1;
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
      var o = e.type;
      return !o || o in t;
    },
    _isAutofocusedTextField: function (e) {
      return !!this._isTextField(e) && !0 === e.autofocus;
    },
    _isAutoFilledTextField: function (e) {
      return !!this._isTextField(e) && e.matches(":-webkit-autofill");
    },
    _isSecureTextField: function (e) {
      if (!isInputElement(e)) return !1;
      if (e._wasPreviouslySecureTextField) return !0;
      try {
        if (e.matches(":-webkit-autofill-strong-password"))
          return ((e._wasPreviouslySecureTextField = !0), !0);
      } catch (e) {}
      const t = getComputedStyle(e, null).getPropertyValue(
          "-webkit-text-security",
        ),
        o = e.type;
      if ("none" !== t || "password" === o)
        return ((e._wasPreviouslySecureTextField = !0), !0);
      if (o && "text" !== o) return !1;
      const r = e._weakNextControlInLogicalForm?.deref();
      return (
        !(!r || !this._looksLikeShowHidePasswordButton(r)) &&
        !!this._matchesPasswordFieldLabelPattern(e) &&
        !this._isLabeledUsernameField(e) &&
        ((e._wasPreviouslySecureTextField = !0), !0)
      );
    },
    _isVerticalWritingMode: function (e) {
      const t = getComputedStyle(e).writingMode;
      return !("horizontal-tb" === t || "horizontal-bt" === t);
    },
    _looksLikePasswordCredentialField: function (e) {
      if (!this._isSecureTextField(e)) return !1;
      var t = e.getAttribute("maxlength");
      return (
        !(
          t && parseInt(t) < MinValueForMaxLengthAttributeToTreatAsPasswordField
        ) &&
        null ===
          this._cachedElementPatternMatch(
            e,
            "_nonAccountPasswordSecureTextEntryFieldPatternMatch",
            "nonAccountPasswordSecureTextEntryFieldLabelPatternMatchers",
          )
      );
    },
    _looksLikeShowHidePasswordButton: function (e) {
      return (
        !(!this._isCustomFormButton(e) && !this._isCheckboxInputElement(e)) &&
        !!this._cachedElementPatternMatch(
          e,
          "_showHideButtonPatternMatch",
          "showHideButtonLabelPatternMatchers",
        )
      );
    },
    _isAutoFillable: function (e) {
      return !e.disabled && !e.readOnly;
    },
    _isAutoFillableSelectElement: function (e) {
      return this._isAutoFillable(e) && this._isSelectElement(e);
    },
    _isAutoFillableTextAreaElement: function (e) {
      return this._isAutoFillable(e) && this._isTextArea(e);
    },
    _isAutoFillableTextField: function (e) {
      return this._isAutoFillable(e) && this._isTextField(e);
    },
    _looksLikeCreditCardNumberField: function (e, t) {
      if (!this._isAutoFillableTextField(e)) return !1;
      if (
        this._cachedElementPatternMatch(
          e,
          "_nonCreditCardNumberPatternMatch",
          "nonCreditCardCardNumberFieldLabelPatternMatchers",
        )
      )
        return !1;
      if (
        this._matchesCreditCardCompositeExpirationDateFieldLabelPatternMatchers(
          e,
        )
      )
        return !1;
      if (elementIDOrAutocompleteTokensHasToken(e, t, "cc-number")) return !0;
      const o = e.placeholder;
      let r = new RegExp("[0-9]{4}[ -][0-9]{4}[ -][0-9]{4}[ -][0-9]{4}");
      if (o && r.test(o)) return !0;
      let n = e.getAttribute("data-val-regex-pattern");
      if (n) {
        let e = regularExpressionFromUntrustedPatternAttributeString(n);
        if (e && !e.test("12345")) return !1;
      }
      return (
        null !==
        this._cachedElementPatternMatch(
          e,
          "_creditCardNumberPatternMatch",
          "creditCardNumberFieldLabelPatternMatchers",
        )
      );
    },
    _looksLikeCreditCardSecurityCodeField: function (e, t) {
      if (!this._isAutoFillableTextField(e)) return !1;
      if (elementIDOrAutocompleteTokensHasToken(e, t, "cc-csc")) return !0;
      let o = e.getAttribute("pattern");
      if (o) {
        let e = regularExpressionFromUntrustedPatternAttributeString(o);
        if (e && !e.test("123") && !e.test("1234")) return !1;
      }
      return (
        null !==
        this._cachedElementPatternMatch(
          e,
          "_creditCardSecurityCodePatternMatch",
          "creditCardSecurityCodeFieldLabelPatternMatchers",
        )
      );
    },
    _looksLikeCreditCardCardholderField: function (e, t) {
      return (
        !!this._isEditablePlainTextField(e) &&
        (!!elementIDOrAutocompleteTokensHasToken(e, t, "cc-name") ||
          null !==
            this._cachedElementPatternMatch(
              e,
              "_creditCardCardholderPatternMatch",
              "creditCardCardholderFieldLabelPatternMatchers",
            ))
      );
    },
    _looksLikeCreditCardCompositeExpirationDateField: function (e, t) {
      return (
        !(!this._isAutoFillableTextField(e) || this._isSecureTextField(e)) &&
        (!!elementIDOrAutocompleteTokensHasToken(e, t, "cc-exp") ||
          this._matchesCreditCardCompositeExpirationDateFieldLabelPatternMatchers(
            e,
          ))
      );
    },
    _matchesCreditCardCompositeExpirationDateFieldLabelPatternMatchers:
      function (e) {
        return (
          null !==
          this._cachedElementPatternMatch(
            e,
            "_creditCardCompositeExpirationDateFieldPatternMatch",
            "creditCardCompositeExpirationDateFieldLabelPatternMatchers",
          )
        );
      },
    _looksLikeCreditCardTypeField: function (e, t) {
      return (
        !(!this._isSelectElement(e) && !isRadioButtonElement(e)) &&
        (!!elementIDOrAutocompleteTokensHasToken(e, t, "cc-type") ||
          null !==
            this._cachedElementPatternMatch(
              e,
              "_creditCardTypePatternMatch",
              "creditCardTypeFieldLabelPatternMatchers",
            ))
      );
    },
    _looksLikeEIDField: function (e, t) {
      return !!elementIDOrAutocompleteTokensHasToken(e, t, "device-eid");
    },
    _looksLikeIMEIField: function (e, t) {
      return !!elementIDOrAutocompleteTokensHasToken(e, t, "device-imei");
    },
    _looksLikeDayField: function (e) {
      return (
        !(
          !this._isAutoFillableTextField(e) &&
          !this._isAutoFillableSelectElement(e)
        ) &&
        null !==
          this._cachedElementPatternMatch(
            e,
            "_dayFieldPatternMatch",
            "dayFieldLabelPatternMatchers",
          )
      );
    },
    _looksLikeMonthField: function (e, t) {
      if (
        !this._isAutoFillableTextField(e) &&
        !this._isAutoFillableSelectElement(e)
      )
        return !1;
      if (elementIDOrAutocompleteTokensHasToken(e, t, "cc-exp-month"))
        return !0;
      if (
        null !==
        this._cachedElementPatternMatch(
          e,
          "_monthFieldPatternMatch",
          "monthFieldLabelPatternMatchers",
        )
      )
        return !0;
      if ("select" !== this._getTagName(e).toLowerCase()) return !1;
      var o = e.options.length;
      if (12 === o || 13 === o)
        for (
          var r = [
              selectElementOptionsSequenceAnalysis(e, "text"),
              selectElementOptionsSequenceAnalysis(e, "value"),
            ],
            n = r.length,
            i = 0;
          i < n;
          i++
        ) {
          var l = r[i],
            a = l.lengthOfLongestSequence,
            s = l.lastNumberInSequence;
          if (a >= 11 && 12 === s) return !0;
        }
      return !1;
    },
    _looksLikeYearField: function (e, t) {
      if (
        !this._isAutoFillableTextField(e) &&
        !this._isAutoFillableSelectElement(e)
      )
        return !1;
      if (elementIDOrAutocompleteTokensHasToken(e, t, "cc-exp-year")) return !0;
      if (
        null !==
        this._cachedElementPatternMatch(
          e,
          "_yearFieldPatternMatch",
          "yearFieldLabelPatternMatchers",
        )
      )
        return !0;
      if ("select" !== this._getTagName(e).toLowerCase()) return !1;
      var o = selectElementOptionsSequenceAnalysis(e, "text"),
        r = o.lengthOfLongestSequence,
        n = o.lastNumberInSequence;
      const i = 3;
      return r >= e.options.length - i && 1e3 < n && n < 3e3;
    },
    _looksLikeOneTimeCodeField: function (e, t, o, r, n, i) {
      if (
        !this._isAutoFillableTextField(e) &&
        !this._isAutoFillableSelectElement(e)
      )
        return !1;
      if (elementIDOrAutocompleteTokensHasToken(e, t, "one-time-code"))
        return !0;
      const l = e.type;
      if ("password" === l) {
        if (/^(.+\.)?chase\.com\.?$/.test(document.location.hostname))
          return !1;
        if (this._matchesPasswordFieldLabelPattern(e)) return !1;
      }
      if (
        /^(.+\.)?amazon\.(com|ae|com\.au|com\.br|ca|fr|de|in|it|com\.mx|nl|es|com\.tr|co\.uk|sa|sg|se|pl)\.?$/.test(
          document.location.hostname,
        )
      ) {
        const t = /claim|promo/i;
        if (t.test(e.id) || t.test(e.name)) return !1;
      }
      if (
        null !==
        this._cachedElementPatternMatch(
          e,
          "_oneTimeCodePatternMatch",
          "oneTimeCodeFieldLabelPatternMatchers",
        )
      )
        return !0;
      const a = e.getAttribute("maxlength"),
        s = a ? parseInt(a) : void 0;
      if (
        isFiniteNumber(s) &&
        s >
          MaxLengthForFieldAboveWhichToTreatPotentialOneTimeCodeFieldAsRequiringHigherScrutiny
      ) {
        if (!n) return !1;
        if (
          i.ControlLooksLikeIgnoredDataTypeField ||
          i.ControlLooksLikeCreditCardCardholderField ||
          i.ControlLooksLikeCreditCardNumberField ||
          i.ControlLooksLikeCreditCardSecurityCodeField ||
          i.ControlLooksLikeCreditCardTypeField ||
          i.AddressBookLabel
        )
          return !1;
      }
      let u = e.pattern;
      if (u) {
        let e = regularExpressionFromUntrustedPatternAttributeString(u);
        if (
          e &&
          (e.test("1234") || e.test("123456") || e.test("12345678")) &&
          !e.test("a") &&
          !e.test("A")
        )
          return !0;
      }
      const c = "number" === l || "tel" === l;
      if (1 === s) {
        if (c || o || r) return !0;
        const t = this._cachedOneTimeCodePatternMatcher(),
          n = e.closest("fieldset"),
          i = n?.querySelector("legend");
        if (i) {
          if (
            e === (n ? Array.from(queryAllBySelector(n, "input")) : [])[0] &&
            this._matchPatternAgainstString(t, i.innerText)
          )
            return !0;
        }
        for (let t of [n, e.parentElement, e.closest('*[role~="dialog"]')]) {
          if (!t) continue;
          const o = Array.from(queryAllBySelector(t, "input")),
            r = o.length;
          if (6 === r || 8 === r) {
            if (e === o[0] && o.every((e) => 1 === parseInt(e.maxLength)))
              return !0;
          }
        }
      }
      const d =
        null !==
        this._cachedElementPatternMatch(
          e,
          "_weakOneTimeCodePatternMatch",
          "weakOneTimeCodeFieldLabelPatternMatchers",
        );
      if (c && d) return !0;
      const h = e.placeholder;
      if (h && d && /^[#]+$/.test(h.replace(/ /g, ""))) return !0;
      const m = (function () {
        if (isFiniteNumber(s)) return s;
        const e = h?.length;
        return e && e < 10 && h === h[0].repeat(e) ? e : void 0;
      })();
      if ((4 === m || 6 === m) && d) return !0;
      if (7 === s && h && /\d{3} \d{3}/.test(h)) return !0;
      if (this._isAutofocusedTextField(e)) {
        if (d) return !0;
        if ("0" === e.min && "9" === e.max) return !0;
      }
      if (n) {
        let t = 0;
        (d && t++, o && t++, r && t++, (4 !== m && 6 !== m) || t++);
        const n = this._cachedOneTimeCodePatternMatcher(),
          i = this._logicalFormsCache.logicalFormForControl(e);
        if (i) {
          const e = i.backingElement;
          if (e) {
            let o = !1;
            for (let r of Array.from(
              querySelectorAllIncludingWithinShadowRoots(e, "h1, h2, h3"),
            )) {
              let e = r.innerText.trim();
              if (e.length) {
                this._matchPatternAgainstString(n, e) && ((o = !0), t++);
                break;
              }
            }
            if (!o) {
              const o = e.closest("section")?.querySelector("h1, h2, h3");
              o && this._matchPatternAgainstString(n, o.innerText) && t++;
            }
            this._matchPatternAgainstString(n, e.getAttribute("id")) && t++;
          }
        }
        const l = e.dataset.valRequired;
        if (
          ("string" == typeof l && this._matchPatternAgainstString(n, l) && t++,
          t >= 2)
        )
          return !0;
        const a = function (e) {
            if (this._matchPatternAgainstString(n, e)) return !0;
            const t = e.replaceAll("-", " ");
            return e !== t && this._matchPatternAgainstString(n, t);
          }.bind(this),
          s = window.location.protocol,
          u = "http:" === s || "https:" === s,
          c = lastPathComponentFromAnchor(window.location);
        if (u && c && a(c)) return !0;
        {
          const e = document.querySelector("link[rel=canonical]"),
            t = e ? lastPathComponentForURLString(e.href) : null;
          if (t && a(t)) return !0;
        }
        if (this._matchFromPageScanBeforeElement(n, e, document.body))
          return !0;
      }
      return !1;
    },
    _looksLikeIgnoredDataTypeField: function (e, t) {
      return (
        !!this._isAutoFillableTextField(e) &&
        !t?.length &&
        null !==
          this._cachedElementPatternMatch(
            e,
            "_ignoredDataTypePatternMatch",
            "ignoredDataTypeFieldLabelPatternMatchers",
          )
      );
    },
    _collectTextSample: function (e) {
      if (!e) return "";
      var t,
        o = "",
        r = e;
      do {
        ((t = (o = r.innerText.replace(/\s+/g, " ").trim()).length),
          (r = r.parentElementIncludingShadowDOMHost()));
      } while (
        t < MaximumNumberOfCharactersToCollectForLanguageIdentification &&
        r
      );
      return (
        t > MaximumNumberOfCharactersToCollectForLanguageIdentification &&
          (o = o.substr(
            0,
            MaximumNumberOfCharactersToCollectForLanguageIdentification,
          )),
        o
      );
    },
    _explicitMaxLength: function (e) {
      var t = e.getAttribute("maxlength");
      return t ? parseInt(t) : void 0;
    },
    _explicitMinLength: function (e) {
      let t = e.getAttribute("minlength");
      return t ? parseInt(t) : void 0;
    },
    _observedMaxLength: function (e) {
      const t = 20;
      if ("password" !== e.type) return null;
      const o = e.getAttribute("ng-pattern");
      if (!o) return null;
      if (!o.startsWith("/") || !o.endsWith("/")) return null;
      let r = regularExpressionFromUntrustedPatternAttributeString(o);
      if (!r) return null;
      let n,
        i = "a1Abbb",
        l = !1;
      for (; i.length <= t; ) {
        let e = r.test(i);
        if (l && !e) return n;
        (e && ((l = !0), (n = i.length)), (i += "b"));
      }
      return null;
    },
    _collectControlMetadata: function (e, t, o, r, n, i, l) {
      var a = {
        ControlTagName: this._getTagName(e),
        ControlFieldName: this._getNameOrId(e),
        ControlUniqueID: this.controlUniqueID(e),
      };
      (e === innermostActiveElement() && (a.ControlIsActiveElement = !0),
        this._isAutoFilledTextField(e) && (a.ControlIsAutoFilledTextField = !0),
        e.disabled && (a.ControlIsDisabled = !0),
        e.readOnly && (a.ControlIsReadOnly = !0),
        this._isTextField(e) && (a.ControlIsTextField = !0),
        this._isSecureTextField(e) && (a.ControlIsSecureTextField = !0),
        this._isLabeledUsernameField(e) &&
          (a.ControlIsLabeledUsernameField = !0),
        this._elementDisallowsAutocomplete(e) && (a.DisallowsAutocomplete = !0),
        this._isAutofocusedTextField(e) &&
          (a.ControlIsAutofocusedTextField = !0));
      const s = e.className;
      s && s.length && (a.ControlFieldClass = s);
      const u = e.id;
      u && u.length && (a.ControlFieldID = u);
      const c = e.value;
      c && (a.ControlValue = c);
      const d = this._associatedUsernameForControl(e);
      d && (a.ControlAssociatedUsername = d);
      const h = e.maxLength;
      if (-1 !== h) a.ControlMaxLength = h;
      else {
        const t = this._observedMaxLength(e);
        t && (a.ControlMaxLength = t);
      }
      const m = this._explicitMinLength(e);
      m && m > 0 && (a.ControlMinLength = m);
      const F = e.size;
      (F > 0 && (a.ControlSize = F),
        e.isVisible() && (a.IsVisible = !0),
        isDateTimeInputElement(e) &&
          (a.ControlRequiredFormatForDateTimeInput =
            this._requiredFormatForDateTimeInput[e.type]));
      var f = autocompleteTokens(e);
      (f &&
        ((a.AutocompleteTokens = f),
        -1 !== f.indexOf("username")
          ? (a.ControlClaimsToBeUsernameViaAutocompleteAttribute = !0)
          : -1 !== f.indexOf("current-password")
            ? (a.ControlClaimsToBeCurrentPasswordViaAutocompleteAttribute = !0)
            : -1 !== f.indexOf("new-password") &&
              (a.ControlClaimsToBeNewPasswordViaAutocompleteAttribute = !0)),
        this._looksLikePasswordCredentialField(e) &&
          ((a.ControlLooksLikePasswordCredentialField = !0),
          "function" == typeof this._collectExtraControlMetadata &&
            this._collectExtraControlMetadata(e, a),
          a.IsVisible &&
            !o &&
            (a.IsVisible = !isElementPositionedToBeEffectivelyInvisible(e))));
      let g = t === WBSFormMetadataRequestPreFill,
        p = a.ControlIsActiveElement || !g;
      if (p) {
        const t = this._collectSelectElementInfo(e);
        (t && (a.SelectElementInfo = t),
          this._isVerticalWritingMode(e) &&
            (a.ControlIsVerticalWritingMode = !0));
        var C = placeholderInfoForElement(e);
        C && !C.AttributeMatchedWasValue && (a.ControlPlaceholder = C.Text);
      }
      if (
        (this._looksLikeIgnoredDataTypeField(e, f)
          ? (a.ControlLooksLikeIgnoredDataTypeField = !0)
          : this._looksLikeCreditCardCardholderField(e, f)
            ? (a.ControlLooksLikeCreditCardCardholderField = !0)
            : this._looksLikeCreditCardNumberField(e, f)
              ? (a.ControlLooksLikeCreditCardNumberField = !0)
              : this._looksLikeCreditCardSecurityCodeField(e, f)
                ? (a.ControlLooksLikeCreditCardSecurityCodeField = !0)
                : this._looksLikeCreditCardTypeField(e, f) &&
                  (a.ControlLooksLikeCreditCardTypeField = !0),
        p &&
          (this._looksLikeMonthField(e, f)
            ? (a.ControlLooksLikeMonthField = !0)
            : this._looksLikeYearField(e, f)
              ? (a.ControlLooksLikeYearField = !0)
              : this._looksLikeDayField(e)
                ? (a.ControlLooksLikeDayField = !0)
                : !a.ControlLooksLikeCreditCardSecurityCodeField &&
                  this._looksLikeCreditCardCompositeExpirationDateField(e, f) &&
                  (a.ControlLooksLikeCreditCardCompositeExpirationDateField =
                    !0)),
        g ||
          (this._looksLikeEIDField(e, f)
            ? (a.ControlLooksLikeEIDField = !0)
            : this._looksLikeIMEIField(e, f) &&
              (a.ControlLooksLikeIMEIField = !0)),
        g ||
          a.ControlLooksLikeIgnoredDataTypeField ||
          a.ControlIsSecureTextField ||
          a.ControlLooksLikeCreditCardNumberField ||
          a.ControlLooksLikeCreditCardSecurityCodeField ||
          a.ControlLooksLikeCreditCardTypeField ||
          a.ControlLooksLikeCreditCardCompositeExpirationDateField ||
          a.ControlLooksLikeEIDField ||
          a.ControlLooksLikeIMEIField ||
          (a.AddressBookLabel = this._addressBookLabelForElement(e)),
        a.ControlIsActiveElement || t === WBSFormMetadataRequestTesting || l)
      ) {
        let t = i && a.IsVisible;
        this._looksLikeOneTimeCodeField(e, f, r, n, t, a) &&
          (a.ControlLooksLikeOneTimeCodeField = !0);
      }
      return (
        t === WBSFormMetadataRequestTesting &&
          globalThis.WAS &&
          (a.ControlNodePath = WAS.NodePath.fromNode(e)?.objectRepresentation),
        a
      );
    },
    _usesGeneratedPassword: function (e) {
      for (
        var t = !1, o = this._elementsWithGeneratedPasswords.length, r = 0;
        r < o;
        ++r
      ) {
        var n = this._elementsWithGeneratedPasswords[r];
        if (e.containsControl(n)) {
          if (n.value !== this._generatedPasswords[r]) return !1;
          t = !0;
        }
      }
      return t;
    },
    _associatedUsernameForControl: function (e) {
      return this._isAutoFillableTextField(e)
        ? e.getAttribute("data-username")
        : null;
    },
    _collectSelectElementInfo: function (e) {
      if (!this._isAutoFillableSelectElement(e)) return null;
      if (!e.options.length) return null;
      for (var t = [], o = e.options, r = o.length, n = 0; n < r; ++n) {
        var i = o[n];
        i.disabled ||
          ((i.label || i.text) && t.push([n, i.label ? i.label : i.text]));
      }
      return t.length ? t : null;
    },
    _stringsToInspectForDeterminingFormType: function (e) {
      let t = [],
        o = e.formElement,
        r = o.getAttribute("id"),
        n = o.getAttribute("name");
      (r && t.push(r), n && t.push(n));
      let i = queryAllBySelector(o, "legend");
      1 === i.length && t.push(i[0].innerText);
      let l = 0;
      for (let e of this._logicalFormsCache.cachedForms())
        e.formElement.isVisible() && l++;
      const a = 0.8;
      if (
        1 === l &&
        o.isVisible() &&
        !o.ownerDocument.defaultView.frameElement &&
        o.getBoundingClientRect().top <
          a * document.documentElement.clientHeight
      ) {
        let e = documentTitleWithoutHostNamePrefix();
        e && t.push(e);
        const o = lastPathComponentFromAnchor(window.location);
        o && o.length && t.push(o);
      }
      let s = [];
      if (o.isVisible()) {
        const e = function (e, t) {
          return (
            (t.left <= e.left &&
              e.right <= t.right &&
              e.distanceToRect(t) < 100) ||
            (e.left - t.left == t.right - e.right && e.distanceToRect(t) < 200)
          );
        };
        let r = o.getBoundingClientRect(),
          n = !1;
        for (
          let i = 0, l = o;
          i <= 2 && l;
          ++i, l = l.parentElementIncludingShadowDOMHost()
        ) {
          let o = Array.prototype.slice.call(
              queryAllBySelector(
                l,
                "h1, h2, h3, [class*='header' i], [class*='heading' i]",
              ),
            ),
            i = [[], [], [], []];
          for (headerElement of o) {
            let e = headerElement.tagName;
            "H1" === e
              ? i[0].push(headerElement)
              : "H2" === e
                ? i[1].push(headerElement)
                : "H3" === e
                  ? i[2].push(headerElement)
                  : i[3].push(headerElement);
          }
          let a = !0;
          for (headerElementsOfType of i) {
            let o = headerElementsOfType.length;
            if (0 === o) {
              a = !1;
              continue;
            }
            if (o > 1) break;
            let i = headerElementsOfType[0];
            if (!i.isVisible()) break;
            e(i.getBoundingClientRect(), r) && (t.push(i.innerText), (n = !0));
            break;
          }
          if (a) break;
        }
        const i = 100;
        for (
          let l = o.traversePreviousElement(), a = 0;
          l && a < i;
          l = l.traversePreviousElement(), a++
        )
          if (l.matches("h1, h2, h3")) {
            e(l.getBoundingClientRect(), r) && (t.push(l.innerText), (n = !0));
            break;
          }
        if (!n) {
          let o = queryAllBySelector(document.documentElement, "h1");
          if (1 === o.length) {
            let n = o[0];
            e(n.getBoundingClientRect(), r) && t.push(n.innerText);
          }
        }
        for (
          let e = 0, t = o;
          e <= 2 && t;
          ++e, t = t.parentElementIncludingShadowDOMHost()
        ) {
          let e = Array.prototype.slice
            .call(queryAllBySelector(t, "button, input[type=submit]"))
            .filter(function (e) {
              if (!e.isVisible()) return !1;
              let t = e.getBoundingClientRect();
              return (
                t.top > r.bottom &&
                !o.contains(e) &&
                r.left <= t.left &&
                t.right <= r.right &&
                t.distanceToRect(r) < 100
              );
            });
          if (e.length) {
            s = e;
            break;
          }
        }
      }
      let u = !1,
        c = [],
        d = e.elements.concat(s);
      for (const e of d) {
        const o = e.type;
        ("password" === o && (u = !0),
          ("submit" !== o && "button" !== o) ||
            (u &&
              (e.isVisible()
                ? this._addInterestingStringsForButton(e, t)
                : c.push(e))));
      }
      if (0 === t.length)
        for (control of c) this._addInterestingStringsForButton(control, t);
      return t;
    },
    _addInterestingStringsForButton: function (e, t) {
      const o = e.getAttribute("id");
      o && t.push(o);
      const r = e.getAttribute("value");
      r && t.push(r);
      const n = e.innerText;
      n && n.length > 0 && t.push(n);
    },
    _autoFillFormTypeOfTypesUsingKeywordMatching: function (e, t, o, r) {
      for (var n = t.length, i = [], l = 0; l < n; ++l) {
        var a = (0, mapOfFormTypeToProducerOfAssociatedKeywords[t[l]])();
        i.push(a);
      }
      var s = this._stringsToInspectForDeterminingFormType(e),
        u = this._regularExpressionsIndicatingNonAutoFillableFormType;
      u ||
        ((u = regularExpressionsFromStrings(
          FormMetadataJSController.regularExpressionsIndicatingNonAutoFillableFormType,
        )),
        (this._regularExpressionsIndicatingNonAutoFillableFormType = u));
      var c = u.length,
        d = [];
      for (l = 0; l < n; ++l) d.push(0);
      if (r)
        for (const [e, o] of Object.entries(r)) d[t.indexOf(parseInt(e))] += o;
      for (var h = s.length, m = 0; m < h; ++m) {
        for (var F = s[m].toLowerCase(), f = 0; f < c; ++f)
          if (u[f].test(F)) return WBSAutoFillFormTypeNonAutoFillable;
        for (l = 0; l < n; ++l) {
          a = i[l];
          for (var g in a) -1 !== F.indexOf(g) && (d[l] += a[g]);
        }
      }
      for (let o = 0; o < n; ++o) {
        const r = this._mapOfFormTypeToExtraScoreProducer[t[o]];
        d[o] += r(e);
      }
      for (l = 0; l < n; ++l) 0 !== d[l] && 0;
      var p = formActionAsAnchorElement(e.formElement, !0);
      if (p) {
        var C = p.pathname.toLowerCase() + p.search.toLowerCase();
        for (l = 0; l < n; ++l) {
          a = i[l];
          for (var g in a) -1 !== C.indexOf(g) && (d[l] += a[g]);
        }
      }
      var A = [],
        _ = 0;
      for (l = 0; l < n; ++l) {
        var b = d[l];
        b > 0 && (b >= _ ? ((_ = b), A.unshift(l)) : A.push(l));
      }
      if (1 === A.length) return t[A[0]];
      if (A.length > 1) {
        var y = A[0];
        if (d[y] > d[A[1]]) return t[y];
      }
      return o;
    },
    _matchesNonUsernameFieldLabelPattern: function (e) {
      if (
        (this._nonUsernameFieldPatternMatchers ||
          (this._nonUsernameFieldPatternMatchers =
            FormMetadataJSController.nonUsernameFieldLabelPatternMatchers),
        this._bestMatchForElement(e, this._nonUsernameFieldPatternMatchers))
      )
        return !0;
      const t = e.value;
      if (!e.id && !e.name && t && e.disabled)
        for (const e of this._nonUsernameFieldPatternMatchers)
          if (this._matchPatternAgainstString(e, t)) return !0;
      return !1;
    },
    _matchSearchFieldLabelPattern: function (e) {
      if (
        (this._searchFieldLabelPatternMatchers ||
          (this._searchFieldLabelPatternMatchers =
            FormMetadataJSController.searchFieldLabelPatternMatchers),
        this._bestMatchForElement(e, this._searchFieldLabelPatternMatchers, !0))
      )
        return !0;
      const t = e.value;
      if (!e.id && !e.name && t && e.disabled)
        for (const e of this._searchFieldLabelPatternMatchers)
          if (this._matchPatternAgainstString(e, t)) return !0;
      return !1;
    },
    _matchesNonEmailFieldLabelPattern: function (e) {
      return (
        this._nonEmailFieldPatternMatchers ||
          (this._nonEmailFieldPatternMatchers =
            FormMetadataJSController.nonEmailFieldLabelPatternMatchers),
        !!this._bestMatchForElement(e, this._nonEmailFieldPatternMatchers)
      );
    },
    _scoreForUsernameFieldCandidateFromLabelingAndPositionOfField: function (
      e,
      t,
      o,
    ) {
      return this._isLabeledUsernameField(e)
        ? t
          ? UsernameCandidateScoreForUsernameLabeledFieldBelowPasswordField
          : UsernameCandidateScoreForUsernameLabeledFieldAbovePasswordField
        : this._isLabeledEmailField(e) &&
            !this._matchesNonEmailFieldLabelPattern(e)
          ? t
            ? UsernameCandidateScoreForEmailLabeledFieldBelowPasswordField
            : UsernameCandidateScoreForEmailLabeledFieldAbovePasswordField
          : o
            ? UsernameCandidateScoreForPlainTextFieldDirectlyBeforePasswordField
            : UsernameCandidateScoreForPlainTextField;
    },
    _scoreForUsernameFieldCandidate: function (e, t, o) {
      var r =
        this._scoreForUsernameFieldCandidateFromLabelingAndPositionOfField(
          e,
          t,
          o,
        );
      return (
        e.isVisible() && (r += UsernameCandidateScoreBonusForVisibleElement),
        this._matchesNonUsernameFieldLabelPattern(e) &&
          (r -=
            UsernameCandidateScorePenaltyForMatchingNonUsernameFieldLabelPattern),
        this._matchSearchFieldLabelPattern(e) &&
          (r -=
            UsernameCandidateScorePenaltyForMatchingSearchFieldLabelPattern),
        e.readOnly && (r -= UsernameCandidateScorePenaltyForReadOnlyElement),
        e.id ||
          e.name ||
          (r -= UsernameCandidateScorePenaltyForAnonymousElement),
        r
      );
    },
    _matchesPasswordFieldLabelPattern: function (e) {
      return (
        this._passwordFieldPatternMatchers ||
          (this._passwordFieldPatternMatchers =
            FormMetadataJSController.passwordFieldLabelPatternMatchers),
        !!this._bestMatchForElement(e, this._passwordFieldPatternMatchers)
      );
    },
    _matchesConfirmPasswordFieldLabelPattern: function (e, t = !1) {
      return (
        this._confirmPasswordFieldPatternMatchers ||
          (this._confirmPasswordFieldPatternMatchers =
            FormMetadataJSController.confirmPasswordFieldLabelPatternMatchers),
        !!this._bestMatchForElement(
          e,
          this._confirmPasswordFieldPatternMatchers,
          t,
        )
      );
    },
    _matchesConfirmEmailFieldLabelPattern: function (e) {
      return (
        !!this._isLabeledEmailField(e) &&
        (this._confirmEmailFieldPatternMatchers ||
          (this._confirmEmailFieldPatternMatchers =
            FormMetadataJSController.confirmEmailFieldLabelPatternMatchers),
        !!this._bestMatchForElement(e, this._confirmEmailFieldPatternMatchers))
      );
    },
    _collectRadioButtonInfo: function (e, t) {
      function o(e, t) {
        var o = e.trim();
        o && t.push(o);
      }
      function r(e, t) {
        (o(e.alt, t),
          o(e.title, t),
          o(lastPathComponentForURLString(e.src), t));
      }
      function n(e) {
        let t = [];
        o(e.innerText, t);
        let n = queryAllBySelector(e, "img"),
          i = n.length;
        for (let e = 0; e < i; ++e) r(n[e], t);
        return t.length ? t : null;
      }
      for (
        var i = e.radioButtonsWithName(t), l = i.length, a = !1, s = {}, u = 0;
        u < l;
        ++u
      ) {
        s[(f = i[u]).value] = [f.value];
        for (
          var c = this._labelsForElement(f), d = c.length, h = 0;
          h < d;
          ++h
        ) {
          a = !0;
          var m = n(c[h]);
          m && (s[f.value] = s[f.value].concat(m));
        }
      }
      if (a) return s;
      const F = 64;
      for (u = 0; u < l; ++u) {
        for (
          var f, g = "", p = (f = i[u]).traverseNextNode();
          p && !this._isRenderedFormControl(p);
          p = p.traverseNextNode()
        ) {
          var C = p.localName;
          if (
            "td" === C ||
            "tr" === C ||
            "ul" === C ||
            "ol" === C ||
            "dl" === C
          )
            break;
          if (p instanceof HTMLImageElement) r(p, s[f.value]);
          else if (p.nodeType === Node.TEXT_NODE) {
            var A = p.nodeValue.trim();
            if ((A && (g += A.substr(0, F - g.length)), g.length >= F)) break;
          }
        }
        g && s[f.value].push(g);
      }
      return s;
    },
    _bestUsernameFieldCandidate: function (e, t, o) {
      var r = t.FormControls,
        n = r.filter(function (e) {
          return e.ControlClaimsToBeUsernameViaAutocompleteAttribute;
        });
      if (1 === n.length) return n[0];
      for (
        var i = 0, l = [], a = !1, s = r.indexOf(o), u = r.length, c = 0;
        c < u;
        ++c
      ) {
        var d = r[c];
        if (d === o) {
          a = !0;
          continue;
        }
        if (!d.ControlIsTextField || d.ControlIsSecureTextField) continue;
        if (t.IsVisible && !r[c].IsVisible && !d.ControlValue) continue;
        const n = 100;
        let F = e[c];
        if (!(F.value.length > n)) {
          var h = c + 1 < u && c + 1 === s,
            m = this._scoreForUsernameFieldCandidate(F, a, h);
          m > i ? ((l = [c]), (i = m)) : m === i && l.push(c);
        }
      }
      var F = l.length;
      if (i < LowestScoreForLabeledUsernameFieldCandidate && F > 1) return null;
      if (i < LowestScoreForUsernameFieldCandidate) return null;
      switch (F) {
        case 0:
          return null;
        case 1:
          return r[l[0]];
        default:
          var f = e[s].getBoundingClientRect(),
            g = {};
          return (
            l.forEach(function (t) {
              g[t] = f.distanceToRect(e[t].getBoundingClientRect());
            }),
            r[
              l.sort(function (e, t) {
                return g[e] - g[t];
              })[0]
            ]
          );
      }
    },
    _autoFillFormTypeFromCandidateFormTypes: function (e, t, o) {
      switch (t.length) {
        case 1:
          return t[0];
        case 2:
          return this._autoFillFormTypeOfTypesUsingKeywordMatching(
            e,
            [t[0], t[1]],
            o,
          );
        default:
          return WBSAutoFillFormTypeAutoFillableStandard;
      }
    },
    _shouldTrustElementThatClaimsToBeCurrentPasswordViaAutocompleteAttribute:
      function (e) {
        return !e.dataset.valRegexPattern;
      },
    _identifyFormTypeAndPasswordFieldIndicesFromAutocompleteAttributes:
      function (e, t) {
        const o = [null, null];
        if (/^(.+\.)?roll20\.net\.?$/.test(document.location.hostname))
          return o;
        var r = t.length;
        if (r > 3) return o;
        for (var n = [], i = [], l = 0; l < r; ++l) {
          var a = t[l];
          a.ControlClaimsToBeCurrentPasswordViaAutocompleteAttribute &&
          this._shouldTrustElementThatClaimsToBeCurrentPasswordViaAutocompleteAttribute(
            e[l],
          )
            ? n.push(l)
            : a.ControlClaimsToBeNewPasswordViaAutocompleteAttribute &&
              i.push(l);
        }
        var s = n.length,
          u = i.length;
        if (s + u !== r) return o;
        switch (r) {
          case 0:
            return o;
          case 1:
            if (s) return [null, null, WBSAutoFillFormTypeAutoFillableLogin];
            if (u) return [null, null, WBSAutoFillFormTypeNewAccount];
          case 2:
            if (1 === s && 1 === u)
              return [
                [WBSAutoFillFormTypeChangePassword],
                { OldPasswordFieldIndex: n[0], PasswordFieldIndex: i[0] },
              ];
            if (0 === s && 2 === u)
              return [
                [
                  WBSAutoFillFormTypeNewAccount,
                  WBSAutoFillFormTypeChangePassword,
                ],
                { PasswordFieldIndex: i[0], ConfirmationFieldIndex: i[1] },
              ];
            break;
          case 3:
            if (1 === s && 2 === u)
              return [
                [WBSAutoFillFormTypeChangePassword],
                {
                  OldPasswordFieldIndex: n[0],
                  PasswordFieldIndex: i[0],
                  ConfirmationFieldIndex: i[1],
                },
              ];
        }
        return o;
      },
    _identifyPasswordFieldIndices: function (e, t) {
      var o = e.length;
      if (0 === o) return {};
      if (1 === o) return { PasswordFieldIndex: 0 };
      if (
        (this._oldPasswordPatternMatchers ||
          (this._oldPasswordPatternMatchers =
            FormMetadataJSController.oldPasswordFieldLabelPatternMatchers),
        2 === o)
      ) {
        return this._bestMatchForElement(t[0], this._oldPasswordPatternMatchers)
          ? { OldPasswordFieldIndex: 0, PasswordFieldIndex: 1 }
          : this._bestMatchForElement(t[1], this._oldPasswordPatternMatchers)
            ? { OldPasswordFieldIndex: 1, PasswordFieldIndex: 0 }
            : { PasswordFieldIndex: 0, ConfirmationFieldIndex: 1 };
      }
      return this._bestMatchForElement(
        t[o - 1],
        this._oldPasswordPatternMatchers,
      )
        ? {
            PasswordFieldIndex: o - 3,
            ConfirmationFieldIndex: o - 2,
            OldPasswordFieldIndex: o - 1,
          }
        : {
            PasswordFieldIndex: o - 2,
            ConfirmationFieldIndex: o - 1,
            OldPasswordFieldIndex: o - 3,
          };
    },
    _removePlaceholderTextForFormMetadata: function (e, t) {
      for (var o = e.length, r = 0; r < o; ++r) {
        var n = t.FormControls[r];
        if (
          n.ControlValue &&
          n.ControlIsTextField &&
          !n.ControlIsSecureTextField &&
          !n.ControlIsReadOnly
        ) {
          var i = legacyPlaceholderInfoForInputElement(e[r]);
          i &&
            ((i.AttributeMatchedWasValue &&
              n.ControlUniqueID === t.UsernameElementUniqueID) ||
              (n.ControlValue = ""));
        }
      }
    },
    _isPasswordConfirmPair: function (e, t) {
      var o = this._matchesPasswordFieldLabelPattern(e),
        r = this._matchesConfirmPasswordFieldLabelPattern(t);
      return o && r;
    },
    _trailingArgumentsForCollectControlMetadataFunction: function (e, t, o) {
      let r = isElementPositionedToBeEffectivelyInvisible(e.backingElement),
        n = !1,
        i = !1;
      if (innermostActiveElement() || t === WBSFormMetadataRequestTesting) {
        let e = this._cachedOneTimeCodePatternMatcher();
        if (
          ((n = !!this._matchPatternAgainstString(
            e,
            documentTitleWithoutHostNamePrefix(),
          )),
          o)
        ) {
          let t = location.pathname.split("/"),
            r = stripCommonPrefix(o.pathname.split("/"), t)[0].join("/");
          r.length && (i = !!this._matchPatternAgainstString(e, r));
        }
      }
      let l = !1;
      for (let t of e.elements)
        if (this._isTextField(t) && t.isVisible()) {
          if (l) {
            l = !1;
            break;
          }
          l = !0;
        }
      return [r, i, n, l];
    },
    _collectFormMetadata: function (e, t) {
      var o,
        r,
        n =
          ((r = 0),
          {
            backwardScanCache: new WeakMap(),
            forwardScanCache: new WeakMap(),
            shouldUsePageScan: function () {
              return (
                r <
                numberOfConsecutiveElementsWithoutSuccessfulPageScanAfterWhichPageScanIsAbandoned
              );
            },
            willStartCollectingMetadataForControl: function () {
              o = null;
            },
            reportPageScanUsedSuccessfully: function (e) {
              o = !(!e && !o);
            },
            didFinishCollectingMetadataForControl: function () {
              !0 === o ? (r = 0) : !1 === o && r++;
            },
          });
      this._pageScanContext = n;
      var i = e.formElement,
        l = {
          FormID: e.formUniqueID,
          ContainsActiveElement: !1,
          FormControls: [],
          AutoFillFormType: WBSAutoFillFormTypeAutoFillableStandard,
          UsernameElementUniqueID: void 0,
          OldPasswordElementUniqueID: void 0,
          PasswordElementUniqueID: void 0,
          ConfirmPasswordElementUniqueID: void 0,
          UsesGeneratedPassword: this._usesGeneratedPassword(e),
          FirstCreditCardCardholderFieldOrCreditCardNumberFieldUniqueID: void 0,
          IsVisible: i.isVisible(),
          TextSample: void 0,
          RequestType: t,
        };
      (this._elementDisallowsAutocomplete(i) && (l.DisallowsAutocomplete = !0),
        i instanceof HTMLFormElement &&
          (l.FormIsSearchForm = this._isSearchForm(i, !0)),
        e.isAnnotated && (l.Annotations = e.annotations));
      var a = i.getAttribute("rel");
      a && "async" === a.toLowerCase() && (l.FormUsesRelAsync = !0);
      let s = formActionAsAnchorElement(i);
      if (
        (s && s.href && (l.FormAction = s.href),
        t == WBSFormMetadataRequestCollectMetadataFromDebugMenu ||
          t == WBSFormMetadataRequestTesting)
      ) {
        let e = selectorForElement(i);
        e && e.length && (l.LogicalFormElementSelector = e);
      }
      var u = e.elements,
        c = !u.some(this._isSecureTextField.bind(this));
      let [d, h, m, F] =
        this._trailingArgumentsForCollectControlMetadataFunction(e, t, s);
      var f = 0,
        g = !1,
        p = [],
        C = [],
        A = [],
        _ = [],
        b = void 0,
        y = void 0,
        S = void 0,
        T = void 0,
        E = !1,
        I = !1,
        v = {},
        P = [];
      let w = !1;
      for (var L = u.length, M = 0; M < L; ++M) {
        var x = u[M];
        if (c && !x.isVisible() && !x._relatesToCredentials) continue;
        var k = isRadioButtonElement(x),
          B = x.name;
        if (k && v[B]) continue;
        n.willStartCollectingMetadataForControl();
        const o = !w;
        var U = this._collectControlMetadata(x, t, d, h, m, F, o);
        if (
          (n.didFinishCollectingMetadataForControl(),
          (w = !0),
          M + 1 < L &&
            (U.ControlNextFieldUniqueID = this.controlUniqueID(u[M + 1])),
          l.FormControls.push(U),
          P.push(x),
          U.IsVisible || !l.IsVisible || x._relatesToCredentials)
        )
          if (
            (U.ControlIsActiveElement && (l.ContainsActiveElement = !0), B && k)
          )
            ((v[B] = 1),
              (U.ControlValue = ""),
              (U.RadioButtonInfo = this._collectRadioButtonInfo(e, B)));
          else if (U.ControlIsTextField || U.SelectElementInfo)
            if (
              (!I && U.ControlLooksLikeCreditCardSecurityCodeField && (I = !0),
              E ||
                (!U.ControlLooksLikeCreditCardCardholderField &&
                  !U.ControlLooksLikeCreditCardNumberField))
            ) {
              if (
                !(
                  U.ControlLooksLikeDayField ||
                  U.ControlLooksLikeMonthField ||
                  U.ControlLooksLikeYearField ||
                  U.ControlLooksLikeCreditCardCompositeExpirationDateField
                )
              ) {
                if (U.ControlLooksLikePasswordCredentialField) {
                  if (
                    U.ControlLooksLikeCreditCardSecurityCodeField ||
                    U.ControlLooksLikeCreditCardNumberField ||
                    U.ControlLooksLikeIgnoredDataTypeField
                  )
                    continue;
                  x.isHiddenFromAccessibilityTree()
                    ? (A.push(x), _.push(U))
                    : (p.push(x), C.push(U));
                }
                if (this._isLabeledEmailField(x)) {
                  if (++f > 2) {
                    g = !1;
                    continue;
                  }
                  if (
                    !(
                      M + 1 < L &&
                      this._matchesConfirmEmailFieldLabelPattern(u[M + 1])
                    )
                  )
                    continue;
                  g = !0;
                }
              }
            } else
              ((E = !0),
                (l.FirstCreditCardCardholderFieldOrCreditCardNumberFieldUniqueID =
                  U.ControlUniqueID));
      }
      !p.length && A.length && ((p = A), (C = _));
      var D,
        W,
        N =
          this._identifyFormTypeAndPasswordFieldIndicesFromAutocompleteAttributes(
            p,
            C,
          ),
        O = N[0],
        q = N[1],
        R = N[2],
        V = q || this._identifyPasswordFieldIndices(C, p);
      if (
        (void 0 !== V.PasswordFieldIndex &&
          ((b = C[V.PasswordFieldIndex]),
          (l.PasswordElementUniqueID = b.ControlUniqueID),
          (y = this._explicitMaxLength(p[V.PasswordFieldIndex]))),
        void 0 !== V.ConfirmationFieldIndex &&
          ((S = C[V.ConfirmationFieldIndex]),
          (l.ConfirmPasswordElementUniqueID = S.ControlUniqueID),
          (T = this._explicitMaxLength(p[V.ConfirmationFieldIndex]))),
        void 0 !== V.OldPasswordFieldIndex)
      ) {
        var H = C[V.OldPasswordFieldIndex];
        l.OldPasswordElementUniqueID = H.ControlUniqueID;
      }
      if (
        (b && (D = this._bestUsernameFieldCandidate(P, l, b)),
        D
          ? (l.UsernameElementUniqueID = D.ControlUniqueID)
          : (W = this._findHiddenUsernameElement(e, l, P)),
        O)
      )
        l.AutoFillFormType = this._autoFillFormTypeFromCandidateFormTypes(
          e,
          O,
          O[0],
        );
      else if (1 === p.length && g)
        l.AutoFillFormType = this._autoFillFormTypeOfTypesUsingKeywordMatching(
          e,
          [WBSAutoFillFormTypeNewAccount, WBSAutoFillFormTypeChangePassword],
          WBSAutoFillFormTypeNewAccount,
        );
      else if (l.UsernameElementUniqueID)
        switch (p.length) {
          case 0:
            break;
          case 1:
            if (
              I &&
              l.UsernameElementUniqueID ===
                l.FirstCreditCardCardholderFieldOrCreditCardNumberFieldUniqueID &&
              C[0].ControlLooksLikeCreditCardNumberField
            )
              break;
            if (this._matchesConfirmPasswordFieldLabelPattern(p[0])) {
              let t = {};
              (this._isElementFollowedByForgotPasswordAffordance(x, i) &&
                (t[WBSAutoFillFormTypeAutoFillableLogin] = 2),
                (l.AutoFillFormType =
                  this._autoFillFormTypeOfTypesUsingKeywordMatching(
                    e,
                    [
                      WBSAutoFillFormTypeNewAccount,
                      WBSAutoFillFormTypeChangePassword,
                    ],
                    R || WBSAutoFillFormTypeAutoFillableLogin,
                    t,
                  )));
            } else {
              let t = p[0],
                o = {},
                r =
                  2 *
                  this._numberOfForgotUserNameEmailOrPasswordAffordancesFollowingElement(
                    t,
                    e.backingElement,
                  );
              (r && (o[WBSAutoFillFormTypeAutoFillableLogin] = r),
                (l.AutoFillFormType =
                  this._autoFillFormTypeOfTypesUsingKeywordMatching(
                    e,
                    [
                      WBSAutoFillFormTypeNewAccount,
                      WBSAutoFillFormTypeAutoFillableLogin,
                    ],
                    R || WBSAutoFillFormTypeAutoFillableLogin,
                    o,
                  )));
            }
            break;
          case 2:
            y === T
              ? (l.AutoFillFormType =
                  this._autoFillFormTypeOfTypesUsingKeywordMatching(
                    e,
                    [
                      WBSAutoFillFormTypeNewAccount,
                      WBSAutoFillFormTypeChangePassword,
                    ],
                    WBSAutoFillFormTypeNewAccount,
                  ))
              : T
                ? this._isPasswordConfirmPair(p[0], p[1])
                  ? (l.AutoFillFormType =
                      this._autoFillFormTypeOfTypesUsingKeywordMatching(
                        e,
                        [
                          WBSAutoFillFormTypeNewAccount,
                          WBSAutoFillFormTypeChangePassword,
                        ],
                        WBSAutoFillFormTypeNonAutoFillable,
                      ))
                  : (l.AutoFillFormType = WBSAutoFillFormTypeNonAutoFillable)
                : (l.AutoFillFormType =
                    this._autoFillFormTypeOfTypesUsingKeywordMatching(
                      e,
                      [
                        WBSAutoFillFormTypeNewAccount,
                        WBSAutoFillFormTypeChangePassword,
                      ],
                      WBSAutoFillFormTypeNonAutoFillable,
                    ));
            break;
          case 3:
            y === T ||
            !T ||
            this._isPasswordConfirmPair(
              p[V.PasswordFieldIndex],
              p[V.ConfirmationFieldIndex],
            )
              ? (l.AutoFillFormType = WBSAutoFillFormTypeChangePassword)
              : (l.AutoFillFormType = WBSAutoFillFormTypeNonAutoFillable);
            break;
          default:
            l.AutoFillFormType = WBSAutoFillFormTypeNonAutoFillable;
        }
      else if (2 === p.length || 3 === p.length)
        if (y !== T && T)
          2 === p.length
            ? this._isPasswordConfirmPair(p[0], p[1])
              ? (l.AutoFillFormType =
                  this._autoFillFormTypeOfTypesUsingKeywordMatching(
                    e,
                    [
                      WBSAutoFillFormTypeNewAccount,
                      WBSAutoFillFormTypeChangePassword,
                    ],
                    WBSAutoFillFormTypeNonAutoFillable,
                  ))
              : (l.AutoFillFormType = WBSAutoFillFormTypeNonAutoFillable)
            : this._isPasswordConfirmPair(
                  p[V.PasswordFieldIndex],
                  p[V.ConfirmationFieldIndex],
                )
              ? (l.AutoFillFormType = WBSAutoFillFormTypeChangePassword)
              : (l.AutoFillFormType = WBSAutoFillFormTypeNonAutoFillable);
        else {
          let t = {};
          (this._isPasswordConfirmPair(
            p[V.PasswordFieldIndex],
            p[V.ConfirmationFieldIndex],
          ) && (t[WBSAutoFillFormTypeChangePassword] = 2),
            (l.AutoFillFormType =
              this._autoFillFormTypeOfTypesUsingKeywordMatching(
                e,
                [
                  WBSAutoFillFormTypeNewAccount,
                  WBSAutoFillFormTypeChangePassword,
                ],
                WBSAutoFillFormTypeChangePassword,
                t,
              )));
        }
      else if (1 === p.length) {
        var Y = p[0];
        if (this._matchesConfirmPasswordFieldLabelPattern(Y, !0)) {
          let t = {};
          (this._isElementFollowedByForgotPasswordAffordance(x, i) &&
            (t[WBSAutoFillFormTypeAutoFillableLogin] = 2),
            (l.AutoFillFormType =
              this._autoFillFormTypeOfTypesUsingKeywordMatching(
                e,
                [
                  WBSAutoFillFormTypeAutoFillableLogin,
                  WBSAutoFillFormTypeChangePassword,
                ],
                WBSAutoFillFormTypeChangePassword,
                t,
              )));
        } else if (this._matchesPasswordFieldLabelPattern(Y))
          if (this._isElementFollowedByForgotPasswordAffordance(Y, i))
            l.AutoFillFormType = WBSAutoFillFormTypeAutoFillableLogin;
          else {
            var J = [
              WBSAutoFillFormTypeNewAccount,
              WBSAutoFillFormTypeAutoFillableLogin,
              WBSAutoFillFormTypeChangePassword,
            ];
            ((l.AutoFillFormType =
              this._autoFillFormTypeOfTypesUsingKeywordMatching(
                e,
                J,
                WBSAutoFillFormTypeNonAutoFillable,
              )),
              l.AutoFillFormType === WBSAutoFillFormTypeNonAutoFillable &&
                W &&
                (l.AutoFillFormType = WBSAutoFillFormTypeNewAccount));
          }
        else l.AutoFillFormType = WBSAutoFillFormTypeNonAutoFillable;
      } else
        0 !== p.length &&
          (l.AutoFillFormType = WBSAutoFillFormTypeNonAutoFillable);
      if (l.AutoFillFormType === WBSAutoFillFormTypeAutoFillableStandard) {
        var G = null,
          K = null,
          z = null,
          $ = 0,
          j = P.length;
        for (M = 0; M < j; ++M) {
          x = P[M];
          var Z = l.FormControls[M],
            X = Z.IsVisible;
          if ((X && Z.ControlIsTextField && $++, $ > 1)) break;
          if (x.closest("footer")) continue;
          let t = {};
          this._isElementFollowedByForgotUserNameOrEmailAffordance(x, i) &&
            (t[WBSAutoFillFormTypeAutoFillableLogin] = 2);
          var Q = this._isLabeledEmailField(x);
          if (
            X &&
            (Z.ControlClaimsToBeUsernameViaAutocompleteAttribute ||
              Z.ControlIsLabeledUsernameField ||
              Q ||
              this._isLabeledLoginField(x)) &&
            !this._matchesNonUsernameFieldLabelPattern(x) &&
            !this._matchSearchFieldLabelPattern(x) &&
            !x.readOnly &&
            "INPUT" === x.tagName &&
            !this._isLabeledSignUpField(x)
          ) {
            let t = {};
            (this._isElementFollowedByForgotUserNameOrEmailAffordance(x, i) &&
              (t[WBSAutoFillFormTypeAutoFillableLogin] = 2),
              this._autoFillFormTypeOfTypesUsingKeywordMatching(
                e,
                [
                  WBSAutoFillFormTypeNewAccount,
                  WBSAutoFillFormTypeAutoFillableLogin,
                ],
                Q
                  ? WBSAutoFillFormTypeNewAccount
                  : WBSAutoFillFormTypeAutoFillableLogin,
                t,
              ) === WBSAutoFillFormTypeAutoFillableLogin &&
                ((G = x), (K = Z), (z = WBSAutoFillFormTypeAutoFillableLogin)));
          }
          const o = Z.AutocompleteTokens;
          if (o) {
            const r = o.includes("username"),
              n = o.includes("webauthn");
            if (r && n) {
              ((G = x), (K = Z), (z = WBSAutoFillFormTypeAutoFillableLogin));
              continue;
            }
            r &&
              Q &&
              ((G = x),
              (K = Z),
              (z = this._autoFillFormTypeOfTypesUsingKeywordMatching(
                e,
                [
                  WBSAutoFillFormTypeNewAccount,
                  WBSAutoFillFormTypeAutoFillableLogin,
                ],
                WBSAutoFillFormTypeAutoFillableLogin,
                t,
              )));
          }
        }
        1 === $ &&
          K &&
          z &&
          !controlAppearsToBePartOfPhotoTaggingInterface(G) &&
          ((l.AutoFillFormType = z),
          (l.UsernameElementUniqueID = K.ControlUniqueID));
      }
      (l.AutoFillFormType === WBSAutoFillFormTypeNewAccount &&
        l.FirstCreditCardCardholderFieldOrCreditCardNumberFieldUniqueID ===
          l.UsernameElementUniqueID &&
        (l.UsernameElementUniqueID = void 0),
        !l.UsernameElementUniqueID &&
          W &&
          this._extractMetadataForHiddenUsernameElement(W, l, P),
        l.AutoFillFormType != WBSAutoFillFormTypeAutoFillableLogin &&
          l.AutoFillFormType != WBSAutoFillFormTypeNewAccount &&
          l.AutoFillFormType != WBSAutoFillFormTypeChangePassword &&
          ((l.UsernameElementUniqueID = void 0),
          (l.OldPasswordElementUniqueID = void 0),
          (l.PasswordElementUniqueID = void 0),
          (l.ConfirmPasswordElementUniqueID = void 0)),
        l.IsVisible ||
          l.AutoFillFormType == WBSAutoFillFormTypeAutoFillableLogin ||
          l.AutoFillFormType == WBSAutoFillFormTypeNewAccount ||
          l.AutoFillFormType == WBSAutoFillFormTypeChangePassword ||
          (l.AutoFillFormType = WBSAutoFillFormTypeNonAutoFillable),
        t !== WBSFormMetadataRequestPreFill &&
          (l.TextSample = this._collectTextSample(e.formElement)),
        (l.FormIsEligibleForAutomaticLogin =
          this._formIsEligibleForAutomaticLogin(l, e.backingElement)));
      for (let e of l.FormControls)
        if (
          e.ControlLooksLikeOneTimeCodeField &&
          this._oneTimeCodeIsEligibleForAutomaticLogin(e, l)
        ) {
          e.OneTimeCodeIsEligibleForAutomaticLogin = !0;
          break;
        }
      if (l.IsVisible)
        for (M = (j = P.length) - 1; M >= 0; --M)
          this._shouldIncludeControlMetadata(l, P[M], l.FormControls[M]) ||
            (t !== WBSFormMetadataRequestCollectMetadataFromDebugMenu
              ? (l.FormControls.splice(M, 1), P.splice(M, 1))
              : (l.FormControls[M].WOULD_NORMALLY_NOT_BE_SENT_TO_UI_PROCESS =
                  !0));
      return (
        this._removePlaceholderTextForFormMetadata(P, l),
        delete this._pageScanContext,
        t !== WBSFormMetadataRequestPreFill &&
          globalThis.FormMetadataClassificationJS &&
          globalThis.FormMetadataClassificationJS.classify(l),
        l
      );
    },
    _formIsEligibleForAutomaticLogin: function (e, t) {
      if (e.AutoFillFormType !== WBSAutoFillFormTypeAutoFillableLogin)
        return !1;
      let o = !1;
      for (const t of e.FormControls) {
        const r = t.ControlUniqueID;
        if (r === e.UsernameElementUniqueID || r === e.PasswordElementUniqueID)
          continue;
        if (t.ControlIsDisabled) continue;
        if (t.ControlIsReadOnly) continue;
        if (!t.IsVisible) continue;
        const n = this.formControlWithUniqueID(r);
        if (!n) continue;
        if (this._isTextArea(n)) return !1;
        if (this._isSelectElement(n)) return !1;
        if (this._isSubmitButton(n)) continue;
        if (this._looksLikeShowHidePasswordButton(n)) continue;
        if (!isInputElement(n)) continue;
        const i = n.type;
        if (
          "button" !== i &&
          "reset" !== i &&
          "submit" !== i &&
          "image" !== i
        ) {
          if (!this._isCheckboxInputElement(n)) return !1;
          if (o) return !1;
          o = !0;
        }
      }
      return !t || !elementAppearsToContinueCaptchaWidget(t);
    },
    _oneTimeCodeIsEligibleForAutomaticLogin: function (e, t) {
      for (const e of t.FormControls) {
        if (e.ControlLooksLikeOneTimeCodeField) continue;
        if (e.ControlIsDisabled) continue;
        if (e.ControlIsReadOnly) continue;
        if (!e.IsVisible) continue;
        const t = this.formControlWithUniqueID(e.ControlUniqueID);
        if (!t) continue;
        if (this._isTextArea(t)) return !1;
        if (this._isSelectElement(t)) return !1;
        if (this._isSubmitButton(t)) continue;
        if (this._looksLikeShowHidePasswordButton(t)) continue;
        if (!isInputElement(t)) continue;
        const o = t.type;
        if ("button" !== o && "reset" !== o && "submit" !== o && "image" !== o)
          return !1;
      }
      return !0;
    },
    _shouldIncludeControlMetadata: function (e, t, o) {
      if (t._relatesToCredentials) return !0;
      if (o.IsVisible) {
        if (formControlHasBeenClassifiedInAnInterestingWay(o)) return !0;
        if (o.ControlValue) return !0;
      }
      return !(
        !e.UsernameElementUniqueID ||
        o.ControlUniqueID !== e.UsernameElementUniqueID
      );
    },
    _isElementAHiddenUsername: function (e) {
      const t = /user|email/i;
      return (
        "hidden" === e.type &&
        !(!t.test(e.getAttribute("id")) && !t.test(e.getAttribute("name"))) &&
        !!isValidUsernameOrEmail(e.value)
      );
    },
    _findHiddenUsernameElement: function (e) {
      var t = e.formElement;
      if (!(t instanceof HTMLElement)) return;
      let o = queryAllBySelector(t, "input"),
        r = o.length;
      for (let e = 0; e < r; ++e) {
        let t = o[e];
        if (this._isElementAHiddenUsername(t)) return t;
      }
      return null;
    },
    _extractMetadataForHiddenUsernameElement: function (e, t, o) {
      var r = {
        ControlTagName: this._getTagName(e),
        ControlFieldName: this._getNameOrId(e),
        ControlUniqueID: this.controlUniqueID(e),
        ControlIsReadOnly: !0,
        ControlValue: e.value,
      };
      ((t.UsernameElementUniqueID = r.ControlUniqueID),
        t.FormControls.push(r),
        o.push(e));
    },
    _cachedMetadataForLogicalForm: function (e) {
      var t = e.metadata,
        o = t?.FormControls,
        r = o?.length ?? 0;
      if (!r) return null;
      const n = innermostActiveElement();
      for (var i = 0; i < r; ++i) {
        var l = o[i],
          a = this.formControlWithUniqueID(l.ControlUniqueID);
        a &&
          ((l.ControlIsActiveElement = a === n),
          (l.ControlValue = a.value),
          (l.ControlIsAutoFilledTextField = this._isAutoFilledTextField(a)));
      }
      return (
        (t.UsesGeneratedPassword = this._usesGeneratedPassword(e)),
        (t.Annotations = e.annotations),
        t
      );
    },
    _markFormIsBestForPageLevelAutoFill: function () {
      function e(e) {
        switch (e) {
          case WBSAutoFillFormTypeAutoFillableLogin:
            return 30;
          case WBSAutoFillFormTypeNewAccount:
          case WBSAutoFillFormTypeChangePassword:
            return 20;
          case WBSAutoFillFormTypeAutoFillableStandard:
            return 10;
          case WBSAutoFillFormTypeUndetermined:
          case WBSAutoFillFormTypeNonAutoFillable:
            return 0;
        }
        return -100;
      }
      function t(e) {
        return e ? 50 : 0;
      }
      let o = this._logicalFormWithHighestScoreIfGreaterThanZero(function (o) {
        var r = o.PasswordElementUniqueID ? 0 : -1;
        return e(o.AutoFillFormType) + t(o.IsVisible) + r;
      });
      null !== o && (o.metadata.FormIsBestForPageLevelAutoFill = !0);
    },
    _markFormIsBestForStreamlinedLogin: function () {
      let e = this._logicalFormWithHighestScoreIfGreaterThanZero(
        function (e, t) {
          if (!e.IsVisible) return 0;
          let o = t.getBoundingClientRect();
          if (!rectIsWithinDocumentViewport(o)) return 0;
          if (o.bottom + window.scrollY < 80) {
            let e = !(
                location.hash ||
                (location.pathname && "/" !== location.pathname) ||
                location.search
              ),
              t = o.width / o.height;
            if (!e && t > 4) return 0;
          }
          if (t.closest("footer")) return 0;
          let r = e.AutoFillFormType === WBSAutoFillFormTypeAutoFillableLogin,
            n = 0,
            i = e.FormControls,
            l = i.length;
          for (var a = 0; a < l; ++a) {
            let t = i[a],
              o = FormMetadataJS.formControlWithUniqueID(t.ControlUniqueID);
            if (!o) continue;
            const l = parseInt(o.tabIndex, 10);
            if (!(isFiniteNumber(l) && l < 0)) {
              if (r) {
                t.ControlIsAutofocusedTextField && (n += 1);
                let o = t.ControlUniqueID;
                if (
                  o === e.UsernameElementUniqueID ||
                  o === e.PasswordElementUniqueID
                ) {
                  n += 10;
                  continue;
                }
              }
              t.OneTimeCodeIsEligibleForAutomaticLogin && (n += 5);
            }
          }
          return n;
        },
      );
      null !== e && (e.metadata.FormIsBestForStreamlinedLogin = !0);
    },
    _logicalFormWithHighestScoreIfGreaterThanZero: function (e) {
      let t = null,
        o = null;
      for (let n of this._logicalFormsCache.allForms()) {
        var r = e(n.metadata, n.backingElement);
        (null === t || r > t) && ((o = n), (t = r));
      }
      return t > 0 ? o : null;
    },
    isAnyFormAnnotated: function () {
      return this._logicalFormsCache.allForms().some((e) => e.isAnnotated);
    },
    annotateFormWithID: function (e, t) {
      let o = this._logicalFormsCache.logicalFormWithUniqueID(e);
      o && o.annotate(t);
    },
    _collectMetadata: function (e) {
      const t = 100,
        o = 10;
      var r = this._logicalFormsInPage(t, o);
      this._logicalFormsCache.clearCacheAndAdd(r);
      for (var n = r.length, i = 0; i < n; ++i)
        (e === WBSFormMetadataRequestTesting &&
          "function" == typeof willCollectFormMetadata &&
          willCollectFormMetadata(),
          (r[i].metadata = this._collectFormMetadata(r[i], e)));
      (this._markFormIsBestForPageLevelAutoFill(),
        e !== WBSFormMetadataRequestNormal &&
          this._markFormIsBestForStreamlinedLogin());
    },
    _collectAndCacheFormMetadata: function (e, t) {
      let o = this._collectFormMetadata(e, t),
        r = this._logicalFormsCache.logicalFormWithUniqueID(e.formUniqueID);
      return (
        r
          ? (r.metadata = o)
          : ((e.metadata = o), this._logicalFormsCache.addOrUpdate(e)),
        o
      );
    },
    _metadataForFormWithID: function (e) {
      return this._logicalFormsCache.logicalFormWithUniqueID(e)?.metadata;
    },
    _recollectMetadataForFormWithID: function (e) {
      const t = this._logicalFormsCache.logicalFormWithUniqueID(e);
      return t
        ? this._collectAndCacheFormMetadata(t, WBSFormMetadataRequestNormal)
        : null;
    },
    _fillControlWithGeneratedPassword: function (e, t) {
      var o = this._elementsWithGeneratedPasswords.indexOf(e);
      (-1 === o &&
        (this._elementsWithGeneratedPasswords.push(e),
        (o = this._elementsWithGeneratedPasswords.length - 1)),
        (this._generatedPasswords[o] = t),
        this._autoFillControlWithValueWithSingleValueUpdate(
          e,
          t,
          ShouldFocus.Yes,
          ShouldBlur.Yes,
          ShouldSetAutoFilled.Yes,
        ));
    },
    fillFormWithPassword: function (e, t, o) {
      var r = this._metadataForFormWithID(e);
      if (null === r) return null;
      const n = r.PasswordElementUniqueID,
        i = n ? this.formControlWithUniqueID(n) : void 0,
        l = o ? this.formControlWithUniqueID(o) : void 0;
      var a = i || l;
      const s = n || o;
      if (!a) return null;
      this._fillControlWithGeneratedPassword(a, t);
      let u = r.ConfirmPasswordElementUniqueID;
      u ||
        (r.AutoFillFormType !== WBSAutoFillFormTypeChangePassword &&
          r.AutoFillFormType !== WBSAutoFillFormTypeNewAccount) ||
        (u = (r = this._recollectMetadataForFormWithID(e) || r)
          .ConfirmPasswordElementUniqueID);
      let c = u ? this.formControlWithUniqueID(u) : null;
      return c ? (this._fillControlWithGeneratedPassword(c, t), [s, u]) : [s];
    },
    fillFieldWithGeneratedPassword: function (e, t) {
      var o = this.formControlWithUniqueID(e);
      o && this._isTextField(o) && this._fillControlWithGeneratedPassword(o, t);
    },
    clearField: function (e) {
      var t = this.formControlWithUniqueID(e);
      this._clearFormField(t);
    },
    _clearFormField: function (e, t) {
      if (e)
        if (this._isSelectElement(e)) e.selectedIndex = 0;
        else if (isDateTimeInputElement(e)) e.value = "";
        else if (isRadioButtonElement(e)) {
          let t = this._logicalFormsCache
              .logicalFormForControl(e)
              .radioButtonsWithName(e.name),
            o = t.length;
          for (let e = 0; e < o; ++e) t[e].checked = !1;
        } else if (this._isTextField(e) && e.value.length) {
          var o = e.matches(":focus");
          (o || e.dispatchEvent(new Event("focus")),
            e.dispatchEvent(eventThatBubbles("keydown")),
            (e.value = ""),
            e.dispatchEvent(eventThatBubbles("input")),
            e.dispatchEvent(eventThatBubbles("keyup")),
            e.dispatchEvent(eventThatBubbles("change")),
            o || t === ShouldBlur.No || e.dispatchEvent(new Event("blur")));
        }
    },
    focusFormForStreamlinedLogin: function (e) {
      const t = function (e) {
        for (const t of e.FormControls) {
          const o = t.ControlUniqueID;
          if (
            o === e.UsernameElementUniqueID ||
            o === e.PasswordElementUniqueID ||
            t.ControlLooksLikeOneTimeCodeField
          ) {
            let e = this.formControlWithUniqueID(o);
            if (e.isVisible() && !e.disabled) return e;
          }
        }
        return null;
      }.bind(this);
      var o = this._metadataForFormWithID(e);
      null !== o && this._focusControlForStreamlinedLogin(t(o));
    },
    focusControlForStreamlinedLogin: function (e) {
      this._focusControlForStreamlinedLogin(this.formControlWithUniqueID(e));
    },
    _focusControlForStreamlinedLogin: function (e) {
      e && rectIsWithinDocumentViewport(e.getBoundingClientRect()) && e.focus();
    },
    formsAndMetadata: function (e) {
      (visibilityCacheGeneration++, this._collectMetadata(e));
      let t = [],
        o = [];
      for (let e of this._logicalFormsCache.allForms())
        (t.push(e.formElement), o.push(e.metadata));
      return [t, o];
    },
    formControlWithUniqueID: function (e) {
      let t = this._controlUniqueIDToWeakControlMap.get(e)?.deref();
      return t;
    },
    formElementWithFormID: function (e) {
      return this._logicalFormsCache.logicalFormWithUniqueID(e)?.formElement;
    },
    selectIfTextField: function (e) {
      this._isTextField(e) && e.select();
    },
    _getOrCreateCachedMetadataForLogicalForm: function (e, t) {
      var o = this._cachedMetadataForLogicalForm(e);
      return !o ||
        (null != t &&
          o.RequestType === WBSFormMetadataRequestPreFill &&
          t !== WBSFormMetadataRequestPreFill)
        ? this._collectAndCacheFormMetadata(e, t)
        : o;
    },
    _getOrCreateLogicalFormForTextFieldOrSelectElement: function (e) {
      let t = this._logicalFormsCache.logicalFormForControl(e);
      if (t)
        for (
          var o = t.metadata,
            r = o?.FormControls,
            n = r?.length ?? 0,
            i = e._controlUniqueID,
            l = 0;
          l < n;
          ++l
        )
          if (r[l].ControlUniqueID === i) return t;
      var a = this._logicalFormsInPage(),
        s = a.length;
      for (l = 0; l < s; ++l) {
        var u = a[l];
        if (u.containsControl(e))
          return (
            this._logicalFormsCache.addOrUpdate(u),
            (u.metadata = this._collectFormMetadata(
              u,
              WBSFormMetadataRequestNormal,
            )),
            u
          );
      }
      return null;
    },
    _cachedMetadataForFormWithTextFieldOrSelectElement: function (e, t) {
      if (!this._isTextField(e) && !this._isSelectElement(e)) return null;
      var o = this._getOrCreateLogicalFormForTextFieldOrSelectElement(e);
      return o ? this._getOrCreateCachedMetadataForLogicalForm(o, t) : null;
    },
    _isAnyPasswordElementUniqueID: function (e, t) {
      return (
        e.PasswordElementUniqueID === t ||
        e.ConfirmPasswordElementUniqueID === t ||
        e.OldPasswordElementUniqueID === t
      );
    },
    _isCurrentPasswordElementUniqueID: function (e, t) {
      switch (e.AutoFillFormType) {
        case WBSAutoFillFormTypeNewAccount:
        case WBSAutoFillFormTypeChangePassword:
          return e.OldPasswordElementUniqueID === t;
        default:
          return e.PasswordElementUniqueID === t;
      }
    },
    _isNewPasswordElementUniqueID: function (e, t) {
      switch (e.AutoFillFormType) {
        case WBSAutoFillFormTypeNewAccount:
        case WBSAutoFillFormTypeChangePassword:
          return (
            e.PasswordElementUniqueID === t ||
            e.ConfirmPasswordElementUniqueID === t
          );
        default:
          return !1;
      }
    },
    _updateAnnotationsForField: function (e) {
      var t = this._getOrCreateLogicalFormForTextFieldOrSelectElement(e);
      if (t) {
        var o = this._getOrCreateCachedMetadataForLogicalForm(t);
        if (o) {
          var r = e._controlUniqueID;
          (this._isCurrentPasswordElementUniqueID(o, r)
            ? t.annotate({ CurrentPassword: e.value })
            : this._isNewPasswordElementUniqueID(o, r)
              ? t.annotate({ NewPassword: e.value })
              : o.UsernameElementUniqueID === r &&
                t.annotate({ Username: e.value }),
            isCredentialElementUniqueID(o, r) &&
              (e._relatesToCredentials = "" !== e.value));
        }
      }
    },
    textFieldOrSelectElementMetadata: function (e, t, o) {
      (visibilityCacheGeneration++,
        this._logicalFormsCache.removeUnparentedLogicalFormsFromCache());
      var r = [null, null],
        n = this._cachedMetadataForFormWithTextFieldOrSelectElement(e, t);
      if (!n) return r;
      this._pageScanContext = {
        backwardScanCache: new WeakMap(),
        forwardScanCache: new WeakMap(),
      };
      let i = this._logicalFormsCache.logicalFormWithUniqueID(n.FormID),
        l = formActionAsAnchorElement(i.formElement),
        [a, s, u, c] = this._trailingArgumentsForCollectControlMetadataFunction(
          i,
          t,
          l,
        );
      const d = !0;
      var h = this._collectControlMetadata(
        e,
        WBSFormMetadataRequestNormal,
        a,
        s,
        u,
        c,
        d,
      );
      if (
        (delete this._pageScanContext,
        h.ControlLooksLikeOneTimeCodeField &&
          this._oneTimeCodeIsEligibleForAutomaticLogin(h, n) &&
          (h.OneTimeCodeIsEligibleForAutomaticLogin = !0),
        (h.SelectionStart = e.selectionStart),
        (h.SelectionLength = e.selectionEnd - e.selectionStart),
        t === WBSFormMetadataRequestTextChange &&
          (!n.UsernameElementUniqueID &&
            this._isAnyPasswordElementUniqueID(n, h.ControlUniqueID) &&
            i.isAnnotated &&
            i.annotate({ Username: null }),
          this._updateAnnotationsForField(e)),
        n.RequestType !== WBSFormMetadataRequestPreFill)
      )
        for (let e of n.FormControls)
          if (h.ControlUniqueID === e.ControlUniqueID) {
            ((h.ControlClassification = e.ControlClassification),
              (h.ControlClassificationHints = e.ControlClassificationHints),
              (h.ControlOrderedParts = e.ControlOrderedParts),
              (h.ControlContinuationID = e.ControlContinuationID),
              (h.ControlContinuationIndex = e.ControlContinuationIndex));
            break;
          }
      if (o) {
        for (const e of n.FormControls)
          e.ControlUniqueID == h.ControlUniqueID && (e.ControlValue = null);
        this._cachedFormMetadata = JSON.stringify(n);
      }
      return ((r[0] = h), (r[1] = n), r);
    },
    clearTextFieldOrSelectElementMetadataCache: function () {
      this._cachedFormMetadata = null;
    },
    disableSpellCheckInFieldIfNeeded: function (e) {
      if (e) {
        var t = this.formControlWithUniqueID(e);
        t &&
          this._isAutoFillableTextField(t) &&
          FormMetadataJSController.setInputElementSpellCheckEnabled(t, !1);
      }
    },
    selectionRangeInField: function (e) {
      var t = this.formControlWithUniqueID(e);
      return t && this._isTextField(t)
        ? [t.selectionStart, t.selectionEnd - t.selectionStart]
        : null;
    },
    setFormFieldSelection: function (e, t, o) {
      var r = this.formControlWithUniqueID(e);
      r &&
        this._isTextField(r) &&
        ((r.selectionStart = t), (r.selectionEnd = t + o));
    },
    replaceFormFieldRangeAndSelectTail: function (e, t, o, r, n) {
      var i = this.formControlWithUniqueID(e);
      if (i && this._isTextField(i)) {
        var l = i.value,
          a = l.substr(0, t) + r + l.substr(t + o);
        ((i.value = a),
          (i.selectionStart = n),
          (i.selectionEnd = a.length),
          i.dispatchEvent(eventThatBubbles("input")),
          i.dispatchEvent(eventThatBubbles("change")));
      }
    },
    _collectVisibleNonEmptyTextFieldsAndTextAreasInForm: function (e, t, o) {
      visibilityCacheGeneration++;
      for (var r = e.elements, n = r.length, i = 0; i < n; ++i) {
        var l = r[i];
        l.isVisible() &&
          null != l.value &&
          l.value.length &&
          (this._isTextField(l) ? t.push(l) : this._isTextArea(l) && o.push(l));
      }
    },
    visibleNonEmptyFormTextControls: function () {
      var e = [],
        t = [];
      let o = queryAllBySelector(document, "form");
      for (let r = 0; r < o.length; ++r)
        this._collectVisibleNonEmptyTextFieldsAndTextAreasInForm(o[r], e, t);
      return [e, t];
    },
    visibleNonEmptyFormTextControlsInForm: function (e) {
      var t = [],
        o = [];
      return (
        this._collectVisibleNonEmptyTextFieldsAndTextAreasInForm(e, t, o),
        [t, o]
      );
    },
    _autoFillRadioButton: function (e, t, o) {
      var r = this._logicalFormsCache.logicalFormForControl(e),
        n = r?.radioButtonsWithName(e.name) ?? [];
      for (let e of n)
        if (e.value === t)
          return (
            e.dispatchEvent(eventThatBubbles("click")),
            (e.checked = !0),
            void FormMetadataJSController.setInputElementAutofilled(e, o)
          );
    },
    _autoFillControlWithValueWithSingleValueUpdate: function (
      e,
      t,
      o,
      r,
      n,
      i,
      l,
    ) {
      (o === ShouldFocus.Yes && e.dispatchEvent(new Event("focus")),
        e.dispatchEvent(eventThatBubbles("keydown")),
        (e.value = t),
        this._updateAnnotationsForField(e),
        l || e.dispatchEvent(eventThatBubbles("input")),
        e.dispatchEvent(eventThatBubbles("keyup")),
        l || e.dispatchEvent(eventThatBubbles("change")),
        r === ShouldBlur.Yes && e.dispatchEvent(new Event("blur")),
        i === ShouldObscure.Yes
          ? FormMetadataJSController.setInputElementAutofilledAndObscured(
              e,
              t.length && n === ShouldSetAutoFilled.Yes,
            )
          : FormMetadataJSController.setInputElementAutofilled(
              e,
              t.length && n === ShouldSetAutoFilled.Yes,
            ));
    },
    _autoFillControlWithValueCharacterByCharacter: function (
      e,
      t,
      o,
      r,
      n,
      i,
      l,
    ) {
      let a = t.split(""),
        s = a.length,
        u = Date.now(),
        c = !e;
      const d = 100,
        h = userIsOnDomain("account.ui.com") && l ? 40 : 0,
        m = () => {
          (this._autoFillControlWithValueWithSingleValueUpdate(
            e,
            t,
            ShouldFocus.Yes,
            ShouldBlur.Yes,
            o,
            r,
          ),
            i?.());
        };
      let F = (f) => {
        try {
          if (f >= s) return void i?.();
          c && (e = innermostActiveElement());
          let g = e.value,
            p = a[f],
            C = g.slice(-1);
          if (C === p && f && !t.slice(f - 1).startsWith(C + p))
            return void setTimeout(F, 0, f + 1);
          let A = 0 === f ? ShouldFocus.Yes : ShouldFocus.No,
            _ = f === s - 1,
            b = _ ? ShouldBlur.Yes : ShouldBlur.No,
            y = _ ? o : ShouldSetAutoFilled.No,
            S = _ ? r : ShouldObscure.No,
            T = g + p,
            E = !_;
          if (
            (l && (E = !1),
            this._autoFillControlWithValueWithSingleValueUpdate(
              e,
              T,
              A,
              b,
              y,
              S,
              E,
            ),
            !c &&
              !this._controlContainsAllCharactersFromFilling(
                e.value,
                t.substring(0, f + 1),
              ))
          )
            return void m();
          const I = Date.now() - u;
          if (
            ((u = Date.now()),
            I > d && n === ShouldAbandonCharacterByCharacterEntryIfTooSlow.Yes)
          )
            return void m();
          setTimeout(F, h, f + 1);
        } catch (e) {}
      };
      F(0);
    },
    _controlContainsAllCharactersFromFilling: function (e, t) {
      if (e.length < t.length) return !1;
      var o = t;
      for (let r = 0; r < t.length; r++) {
        -1 !== e.indexOf(t[r]) &&
          ((e = e.replace(t[r], "")), (o = o.replace(t[r], "")));
      }
      return !o.length;
    },
    _autoFillControlWithValueRecursively: function (e, t, o, r, n, i) {
      if (isRadioButtonElement(e))
        return (
          this._autoFillRadioButton(e, t, o === ShouldSetAutoFilled.Yes),
          void (i && i())
        );
      if (this._isSelectElement(e))
        return (
          this._autoFillSelectWithOptionIndex(
            e,
            t,
            o === ShouldSetAutoFilled.Yes,
          ),
          void (i && i())
        );
      let l = this._logicalFormsCache.logicalFormForControl(e);
      FormMetadataJS._cachedMetadataForLogicalForm(l);
      if (n || !this._isTextField(e))
        return (
          this._autoFillControlWithValueWithSingleValueUpdate(
            e,
            t,
            ShouldFocus.Yes,
            ShouldBlur.Yes,
            o,
            r,
          ),
          void (i && i())
        );
      this._clearFormField(e, ShouldBlur.No);
      let a = () => {
        (this._controlContainsAllCharactersFromFilling(e.value, t) ||
          this._autoFillControlWithValueWithSingleValueUpdate(
            e,
            t,
            ShouldFocus.Yes,
            ShouldBlur.Yes,
            o,
            r,
          ),
          i && i());
      };
      this._autoFillControlWithValueCharacterByCharacter(
        e,
        t,
        o,
        r,
        ShouldAbandonCharacterByCharacterEntryIfTooSlow.Yes,
        a,
      );
    },
    _autoFillSelectWithOptionIndex: function (e, t, o) {
      (e.dispatchEvent(eventThatBubbles("mousedown")),
        e.dispatchEvent(new Event("focus")),
        e.selectedIndex !== t &&
          ((e.selectedIndex = t),
          e.dispatchEvent(eventThatBubbles("input")),
          e.dispatchEvent(eventThatBubbles("change"))),
        e.dispatchEvent(eventThatBubbles("mouseup")),
        e.dispatchEvent(eventThatBubbles("click")),
        e.dispatchEvent(new Event("blur")),
        FormMetadataJSController.setInputElementAutofilled(e, o));
    },
    autoFillOneTimeCodeFieldsWithValue: function (e, t) {
      let o = innermostActiveElement();
      if (!this._isAutoFillableTextField(o)) return;
      this._clearFormField(o);
      let r = () => {
          FormMetadataJSController.finishedAutoFillingOneTimeCode(e, t);
        },
        n = !0;
      this._autoFillControlWithValueCharacterByCharacter(
        null,
        e,
        ShouldSetAutoFilled.Yes,
        ShouldObscure.No,
        ShouldAbandonCharacterByCharacterEntryIfTooSlow.No,
        r,
        n,
      );
    },
    _shouldSelectElementAfterFillingForm: function (e) {
      if (!/(^|\.)etrade\.com/.test(document.location.hostname)) return !0;
      var t = this._cachedMetadataForLogicalForm(e);
      return !t || t.AutoFillFormType !== WBSAutoFillFormTypeAutoFillableLogin;
    },
    autoFillControlsByID: function (e, t, o, r, n, i, l) {
      let a = arguments[arguments.length - 1],
        s = o ? ShouldSetAutoFilled.Yes : ShouldSetAutoFilled.No,
        u = r;
      if (u) {
        let e = u.getAttribute("onfocus");
        e && e.length && /this\.value/.test(e) && (u = null);
      } else u = innermostActiveElement();
      var c = null;
      for (let t in e) {
        c = this._logicalFormsCache.logicalFormForControl(
          this.formControlWithUniqueID(t),
        );
        break;
      }
      var d = function () {
        (n
          ? innermostActiveElement().blur()
          : u &&
            this._shouldSelectElementAfterFillingForm(c) &&
            this.selectIfTextField(u),
          c?.backingElement &&
            elementAppearsToContinueCaptchaWidget(c.backingElement) &&
            (a = !1),
          FormMetadataJSController.finishedAutoFillingControlsInForm(
            this._getOrCreateCachedMetadataForLogicalForm(c),
            a,
          ));
      }.bind(this);
      if (t) {
        var h = [];
        for (var m in e)
          e.hasOwnProperty(m) &&
            h.push([this.formControlWithUniqueID(m), e[m]]);
        this._synchronouslyAutoFillControls(h, s, l, d);
      } else this._asynchronouslyAutoFillControls(e, c, s, i, l, d);
    },
    _synchronouslyAutoFillControls: function (e, t, o, r) {
      for (var n = e.length, i = 0; i < n; ++i) {
        var l = e[i][0],
          a = e[i][1];
        this._autoFillControlWithValueRecursively(l, a, t, ShouldObscure.NO, o);
      }
      r();
    },
    _asynchronouslyAutoFillControls: function (e, t, o, r, n, i) {
      var l = t.elements,
        a = l.length,
        s = function (t) {
          if (t >= a) return void i();
          var u = l[t],
            c = e[u._controlUniqueID];
          let d = () => {
            s(t + 1);
          };
          if (void 0 !== c) {
            let e = r.some((e) => u._controlUniqueID.includes(e))
              ? ShouldObscure.Yes
              : ShouldObscure.No;
            this._autoFillControlWithValueRecursively(u, c, o, e, n, d);
          } else d();
        }.bind(this);
      s(0);
    },
    _isInputAllowedInSearchForm: function (e, t) {
      var o = this._getTagName(e).toLowerCase();
      if ("button" === o || "fieldset" === o) return !0;
      if ("select" === o) return !t || isSelectInDefaultState(e);
      if (
        "input" !== o &&
        !this._textAreaElementLookLikeItIsPartOfASearchForm(e)
      )
        return !1;
      var r = e.type;
      return "radio" === r || "checkbox" === r
        ? !t || isCheckboxOrRadioButtonInDefaultState(e)
        : "hidden" === r ||
            "reset" === r ||
            "submit" === r ||
            "button" === r ||
            "image" === r ||
            (this._isTextField(e) && !this._isSecureTextField(e));
    },
    _isSearchForm: function (e, t) {
      if ("get" !== e.method) return !1;
      for (var o = e.elements, r = o.length, n = 0; n < r; ++n)
        if (!this._isInputAllowedInSearchForm(o[n], t)) return !1;
      return !0;
    },
    _textAreaElementLookLikeItIsPartOfASearchForm: function (e) {
      return (
        !!this._isTextArea(e) &&
        ("search" === e.getAttribute("type") ||
          "search" === e.inputMode ||
          "search" === e.getAttribute("enterkeyhint"))
      );
    },
    _shouldInputBeIncludedInSearchURLQuery: function (e) {
      if (e.disabled) return !1;
      if (!e.name.length) return !1;
      if (!e.value.length) return !1;
      if (this._isSelectElement(e)) return !0;
      var t = this._getTagName(e).toLowerCase(),
        o = e.type;
      return "button" === t
        ? "submit" === o
        : "input" === t &&
            ("submit" === o ||
              ("checkbox" === o || "radio" === o
                ? e.checked
                : "hidden" === o || this._isTextField(e)));
    },
    _isSubmitButton: function (e) {
      return (
        (e instanceof HTMLButtonElement || e instanceof HTMLInputElement) &&
        e.type &&
        "submit" === e.type
      );
    },
    _isCustomFormButton: function (e) {
      return (
        "button" === e.type &&
        (e instanceof HTMLButtonElement || e instanceof HTMLInputElement)
      );
    },
    _isCheckboxInputElement: function (e) {
      return "checkbox" === e.type && e instanceof HTMLInputElement;
    },
    _setQueryString: function (e, t) {
      var o = document.createElement("a");
      return ((o.href = e), (o.search = t), o.href);
    },
    searchTextFieldFormSubmissionURLString: function (e, t) {
      if (
        (visibilityCacheGeneration++,
        !this._isTextField(e) || this._isSecureTextField(e) || !e.isVisible())
      )
        return null;
      var o = e.form;
      if (!o) return null;
      var r = o.getAttribute("action");
      if (!r || !r.length) return null;
      if (!/^https?:/i.test(o.action)) return null;
      if (!this._isSearchForm(o, t)) return null;
      for (
        var n = null, i = "", l = o.elements, a = l.length, s = 0;
        s < a;
        ++s
      ) {
        var u = l[s];
        if (
          (u === e || this._shouldInputBeIncludedInSearchURLQuery(u)) &&
          (!this._isSubmitButton(u) || (n || (n = u), u === n))
        ) {
          i.length && (i += "&");
          var c = u === e ? "{searchTerms}" : urlEncode(u.value);
          i += urlEncode(u.name) + "=" + c;
        }
      }
      return this._setQueryString(o.action, i);
    },
  }));
var FormMetadataJS = new FormMetadata();
