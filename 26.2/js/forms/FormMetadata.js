//# sourceURL=__InjectedScript_FormMetadata.js
/* Copyright (c) 2025 Apple Inc. All rights reserved. */
"use strict";
function addPasswordRequirementsToFormMetadata(e) {
  if (
    e.AutoFillFormType != WBSAutoFillFormTypeNewAccount &&
    e.AutoFillFormType != WBSAutoFillFormTypeChangePassword
  )
    return ((e.PasswordRules = null), void (e.PasswordRequirements = null));
  const t = e.PasswordElementUniqueID,
    r = e.ConfirmPasswordElementUniqueID;
  let n = !!t?.length,
    o = !!r?.length;
  if (!n && !o)
    return ((e.PasswordRules = null), void (e.PasswordRequirements = null));
  let i = null,
    l = null;
  for (const a of e.FormControls) {
    if (!n && !o) break;
    const e = a.ControlUniqueID;
    e &&
      (n && e === t
        ? ((i = a), (n = !1))
        : o && e === r && ((l = a), (o = !1)));
  }
  let a,
    s = null,
    u = null;
  if (i?.ControlPasswordRules) {
    const e = parsePasswordRules(i?.ControlPasswordRules, !1);
    s = new PasswordRuleSet(e);
  }
  if (l?.ControlPasswordRules) {
    const e = parsePasswordRules(l?.ControlPasswordRules, !1);
    u = new PasswordRuleSet(e);
  }
  s && u ? ((a = s.copy()), a.merge(u)) : (a = s || u);
  let c = i?.ControlMaxLength ?? 0,
    d = i?.ControlMinLength ?? 0;
  const h = l?.ControlMaxLength ?? 0,
    m = l?.ControlMinLength ?? 0;
  ((c = c < h ? c : h), (d = d > m ? d : m));
  const F = { passwordRuleSet: a, minLength: d, maxLength: c },
    f = {};
  (i &&
    ((f.passwordFieldPasswordRules = i.ControlPasswordRules),
    (f.passwordFieldMinLength = i.ControlMinLength),
    (f.passwordFieldMaxLength = i.ControlMaxLength)),
    l &&
      ((f.confirmPasswordFieldPasswordRules = l.ControlPasswordRules),
      (f.confirmPasswordFieldMinLength = l.ControlMinLength),
      (f.confirmPasswordFieldMaxLength = l.ControlMaxLength)),
    (e.PasswordRules = f),
    (e.PasswordRequirements = F));
}
function regularExpressionForDomainMatching(e) {
  return new RegExp("(^|.)" + e.replaceAll(".", "\\.") + "$");
}
function userIsOnDomain(e) {
  let t = cachedUserIsOnDomain[e];
  return (
    void 0 !== t ||
      ((t = regularExpressionForDomainMatching(e).test(
        document.location.hostname,
      )),
      (cachedUserIsOnDomain[e] = t)),
    t
  );
}
function legacyPlaceholderInfoForInputElement(e) {
  if ("text" !== e.type) return null;
  if (doctypeLooksLikeHTML5) return null;
  var t = e.value.trim();
  if (!t) return null;
  for (var r = !1, n = !0, o = e.attributes, i = o.length, l = 0; l < i; ++l) {
    var a = o[l];
    if (t === a.value.trim() && ((r = !0), "value" !== a.name.toLowerCase())) {
      n = !1;
      break;
    }
  }
  return r ? { Text: t, AttributeMatchedWasValue: n } : null;
}
function placeholderInfoForElement(e) {
  var t = e.getAttribute("placeholder");
  if (t) return { Text: t, AttributeMatchedWasValue: !1 };
  var r = e.getAttribute("data-placeholder");
  return r && r.length
    ? { Text: r, AttributeMatchedWasValue: !1 }
    : isInputElement(e)
      ? legacyPlaceholderInfoForInputElement(e)
      : null;
}
function sharedPrefixLength(e, t) {
  for (var r = 0, n = 0, o = e.length; n < o && e[n] === t[n]; ++n) r++;
  return r;
}
function rowContainingLabelAboveRow(e) {
  for (
    var t = e.getBoundingClientRect(), r = e.previousElementSibling;
    r instanceof HTMLTableRowElement;
    r = r.previousElementSibling
  ) {
    if (r.querySelector("input, select, textarea")) return null;
    var n = r.getBoundingClientRect();
    if (t.top - n.bottom > t.height / 2) return null;
    if (r.innerText.match(/\S/)) return r;
  }
  return null;
}
function cellVisuallyAbove(e) {
  let t = e.parentElementIncludingShadowDOMHost();
  if (!(t && t instanceof HTMLTableRowElement)) return null;
  var r = rowContainingLabelAboveRow(t);
  if (!r) return null;
  for (
    var n = e.getBoundingClientRect(),
      o = r.children,
      i = o.length,
      l = null,
      a = 0,
      s = 0;
    s < i;
    ++s
  ) {
    var u = o[s],
      c = u.getBoundingClientRect(),
      d = Math.min(c.right, n.right) - Math.max(c.left, n.left);
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
function elementsInFormPiercingShadowDOM(e) {
  e.elements;
  return queryAllBySelector(
    e,
    "button, fieldset, input:not([type='image']), object, output, select, textarea",
  );
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
function isSelectElement(e) {
  return e instanceof HTMLSelectElement;
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
  for (var t = e.options, r = t.length, n = 0; n < r; ++n) {
    var o = t[n];
    if (o.selected !== o.defaultSelected) {
      if (o.defaultSelected) return !1;
      if (e.multiple || n) return !1;
    }
  }
  return !0;
}
function formActionAsAnchorElement(e, t) {
  if (!(e instanceof HTMLFormElement)) return null;
  let r = e.getAttribute("action");
  if (!r && t) return null;
  var n = document.createElement("a");
  return ((n.href = r || ""), n);
}
function createTextInputEvent(e) {
  let t = document.createEvent("TextEvent");
  return (t.initTextEvent("textInput", !0, !0, null, e), t);
}
function createMouseOrPointerEventAtPoint(e, t) {
  const r = {
    bubbles: !0,
    cancelable: !0,
    screenX: t.x,
    screenY: t.y,
    clientX: t.x,
    clientY: t.y,
    button: 0,
    detail: 1,
  };
  switch (e) {
    case "mousedown":
    case "mouseup":
      return new MouseEvent(e, { ...r, buttons: "mousedown" === e ? 1 : 0 });
    case "pointerdown":
    case "pointerup":
    case "click":
      const t = "pointerdown" === e;
      return new PointerEvent(e, {
        ...r,
        buttons: t ? 1 : 0,
        pointerType: "mouse",
        isPrimary: !0,
        pressure: t ? 0.5 : 0,
        altitudeAngle: Math.PI / 2,
      });
  }
}
function dispatchEventsSimulatingClickOnElement(e) {
  const t = e.getBoundingClientRect().centerPoint();
  e.dispatchEvent(createMouseOrPointerEventAtPoint("pointerdown", t)) &&
    e.dispatchEvent(createMouseOrPointerEventAtPoint("mousedown", t)) &&
    e.dispatchEvent(createMouseOrPointerEventAtPoint("pointerup", t)) &&
    e.dispatchEvent(createMouseOrPointerEventAtPoint("mouseup", t)) &&
    e.dispatchEvent(createMouseOrPointerEventAtPoint("pointerdown", t));
}
function createCustomEventThatBubbles(e) {
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
    r = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
  return (
    !(!e || e.length < 3 || "true" === e || "false" === e) &&
    (t.test(e) || r.test(e))
  );
}
function selectorForElement(e) {
  let t = e.localName,
    r = e.getAttribute("id");
  r && (t += `#${r}`);
  let n = e.classList,
    o = n.length;
  for (let e = 0; e < o; e++) t += "." + n[e];
  return t;
}
function controlSeemsToBeSingleCharacterFieldPartOfSingleLogicalEntity(e) {
  function t(e) {
    let t = e.height / e.width;
    return 0.95 <= t && t <= 1.05;
  }
  const r = 4,
    n = 8;
  let o = e.getBoundingClientRect();
  if (!t(o)) return !1;
  let i = siblingsIncludingSelfForElement(e),
    l = i.length;
  if (l < r || l > n) return !1;
  for (let t = 0; t < l; ++t) {
    let r = i[t];
    if (e === r) continue;
    let n = r.getBoundingClientRect();
    if (o.top !== n.top || o.width !== n.width || o.height !== n.height)
      return !1;
  }
  return !0;
}
async function yieldToEventLoop(e = 0) {
  await new Promise((t) => {
    setTimeout(t, e);
  });
}
async function yieldToEventLoopAfterAnimationFrameAndDelay(e = 0) {
  (await Promise.all([
    yieldToEventLoop(e),
    new Promise((e) => {
      requestAnimationFrame(e);
    }),
  ]),
    await yieldToEventLoop());
}
async function yieldUntilDocumentIsFocusedOrTimeout(e) {
  if (document.hasFocus()) return;
  const t = new AbortController();
  (await Promise.race([
    yieldToEventLoop(e),
    new Promise((e) => {
      window.addEventListener("focus", e, {
        once: !0,
        passive: !0,
        signal: t.signal,
      });
    }),
  ]),
    t.abort(null));
}
function hasOwnProperties(e) {
  return Object.getOwnPropertyNames(e).length > 0;
}
function defaultOptionForSelectElement(e) {
  for (var t = e.options, r = t.length, n = 0; n < r; ++n) {
    var o = t[n];
    if (o.defaultSelected) return o;
  }
  return t[0];
}
function selectElementOptionsSequenceAnalysis(e, t) {
  for (
    var r = e.options, n = r.length, o = 0, i = -1, l = -1, a = 0, s = 0;
    s < n;
    ++s
  ) {
    var u = r[s],
      c = parseInt(u[t]);
    isFiniteNumber(c)
      ? -1 === l
        ? ((l = c), (a = 1))
        : c === l + 1 && ((l = c), a++)
      : (a >= o && ((o = a), (i = l)), (l = -1), (a = 0));
  }
  return (
    a >= o && ((o = a), (i = l)),
    { lengthOfLongestSequence: o, lastNumberInSequence: i }
  );
}
function isElementPositionedToBeEffectivelyInvisible(e) {
  var t = !1;
  for (let r = e; r; r = r.parentElementIncludingShadowDOMHost())
    if ("fixed" === getComputedStyle(r).position) {
      t = !0;
      break;
    }
  var r,
    n,
    o,
    i = e.getBoundingClientRect();
  if (t) ((r = i), (n = window.innerWidth), (o = window.innerHeight));
  else {
    var l = window.scrollY,
      a = window.scrollX;
    ((r = {
      top: i.top + l,
      right: i.right + a,
      bottom: i.bottom + l,
      left: i.left + a,
      width: i.width,
      height: i.height,
    }),
      (n = document.documentElement.scrollWidth),
      (o = Math.max(
        document.documentElement.scrollHeight,
        window.innerHeight,
      )));
  }
  return r.top >= o || r.right <= 0 || r.bottom <= 0 || r.left >= n;
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
  let r = [];
  for (const n of t)
    e.hasAttribute(n) && r.push(e.getAttribute(n).trim().toLowerCase());
  if (!r.length) return null;
  let n = r
    .join(" ")
    .split(/\s+/)
    .filter(function (e) {
      return e.length && "off" !== e && "on" !== e;
    });
  return n.length ? n : null;
}
function elementIDOrAutocompleteTokensHasToken(e, t, r) {
  return !!e.id?.includes(r) || !!t?.includes(r);
}
function controlAppearsToBePartOfPhotoTaggingInterface(e) {
  const t = /photo.*tag/i;
  for (
    let r = e.parentElementIncludingShadowDOMHost();
    r;
    r = r.parentElementIncludingShadowDOMHost()
  )
    if (t.test(r.className)) return !0;
  return !1;
}
function levenshteinDistance(e, t) {
  for (
    var r = e.length, n = t.length, o = new Array(r + 1), i = 0;
    i < r + 1;
    ++i
  )
    ((o[i] = new Array(n + 1)), (o[i][0] = i));
  for (var l = 0; l < n + 1; ++l) o[0][l] = l;
  for (l = 1; l < n + 1; ++l)
    for (i = 1; i < r + 1; ++i)
      if (e[i - 1] === t[l - 1]) o[i][l] = o[i - 1][l - 1];
      else {
        var a = o[i - 1][l] + 1,
          s = o[i][l - 1] + 1,
          u = o[i - 1][l - 1] + 1;
        o[i][l] = Math.min(a, s, u);
      }
  return o[r][n];
}
function stringSimilarity(e, t) {
  var r = Math.max(e.length, t.length);
  return r ? (r - levenshteinDistance(e, t)) / r : 0;
}
function stripCommonPrefix(e, t) {
  const r = e.length,
    n = t.length,
    o = r < n ? r : n;
  let i = 0;
  for (; i < o && e[i] === t[i]; ) i++;
  return [e.slice(i), t.slice(i)];
}
function articleTitleAndSiteNameFromTitleString(e, t) {
  const r = [" - ", " \u2013 ", " \u2014 ", ": ", " | ", " \xbb "],
    n = r.length,
    o = 0.6;
  for (
    var i,
      l,
      a = e.replace(/^(www|m|secure)\./, ""),
      s = a.replace(/\.(com|info|net|org|edu|gov)$/, "").toLowerCase(),
      u = 0;
    u < n;
    ++u
  ) {
    var c = t.split(r[u]);
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
  return i && l >= o ? i : null;
}
function documentTitleWithoutHostNamePrefix() {
  const e = document.title,
    t = articleTitleAndSiteNameFromTitleString(window.location.host, e);
  return t ? t.articleTitle : e;
}
function querySelectorAllIncludingWithinShadowRoots(e, t) {
  let r = [];
  for (let n of e.querySelectorAll("*"))
    if (n.shadowRoot) {
      let e = querySelectorAllIncludingWithinShadowRoots(n.shadowRoot, t);
      e.length && (r = r.concat(e));
    } else n.matches(t) && r.push(n);
  return r;
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
  let r = e;
  for (; r.previousElementSibling; ) r = r.previousElementSibling;
  let n = [],
    o = r;
  for (; o; ) (n.push(o), (o = o.nextElementSibling));
  return n;
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
  for (let r of t) for (let t of e) if (r.test(t.toLowerCase())) return !0;
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
  WBSPasswordCharacterClassTypeASCIIPrintable = 0,
  WBSPasswordCharacterClassTypeDigit = 1,
  WBSPasswordCharacterClassTypeLower = 2,
  WBSPasswordCharacterClassTypeUpper = 3,
  WBSPasswordCharacterClassTypeSpecial = 4,
  WBSPasswordCharacterClassTypeUnicode = 5,
  WBSPasswordCharacterClassTypeCustom = 6,
  ShouldStopAfterFirstMatch = { CollectAllMatches: 0, StopAfterFirstMatch: 1 },
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
  numberOfConsecutiveElementsWithoutSuccessfulPageScanAfterWhichPageScanIsAbandoned = 40,
  insertTextInputType = "insertText";
class KeyInfo {
  static BackspaceKeyInfo = new KeyInfo("\b", "\b", null, "Backspace", {
    uiEventKey: "Backspace",
  });
  static #e = { bubbles: !0, cancelable: !0 };
  static #t = {
    ...KeyInfo.#e,
    keyCode: 16,
    which: 16,
    key: "Shift",
    code: "ShiftRight",
    location: KeyboardEvent.DOM_KEY_LOCATION_RIGHT,
  };
  #r;
  #n;
  #o;
  #i;
  #l;
  #a;
  #s;
  #u;
  constructor(
    e,
    t,
    r,
    n,
    { uiEventKey: o, useShiftedCharacterForLegacyKeyCode: i } = {},
  ) {
    ((this.#r = e),
      (this.#n = t),
      (this.#o = r),
      (this.#u = e === r),
      (this.#i = n),
      (this.#l = o ?? e),
      (this.#s = i ? r.codePointAt(0) : t.codePointAt(0)),
      (this.#a = e.codePointAt(0)));
  }
  get isShifted() {
    return this.#u;
  }
  keyEvent(e) {
    switch (e) {
      case "keydown":
      case "keyup":
        return new KeyboardEvent(e, {
          ...KeyInfo.#e,
          charCode: 0,
          keyCode: this.#s,
          which: this.#s,
          shiftKey: this.#u,
          key: this.#l,
          code: this.#i,
          location: KeyboardEvent.DOM_KEY_LOCATION_STANDARD,
        });
      case "keypress":
        return new KeyboardEvent(e, {
          ...KeyInfo.#e,
          charCode: this.#a,
          keyCode: this.#a,
          which: this.#a,
          shiftKey: this.#u,
          key: this.#l,
          code: this.#i,
          location: KeyboardEvent.DOM_KEY_LOCATION_STANDARD,
        });
    }
  }
  static forCharacter(e) {
    switch (e) {
      case "a":
      case "A":
        return new KeyInfo(e, "a", "A", "KeyA", {
          useShiftedCharacterForLegacyKeyCode: !0,
        });
      case "b":
      case "B":
        return new KeyInfo(e, "b", "B", "KeyB", {
          useShiftedCharacterForLegacyKeyCode: !0,
        });
      case "c":
      case "C":
        return new KeyInfo(e, "c", "C", "KeyC", {
          useShiftedCharacterForLegacyKeyCode: !0,
        });
      case "d":
      case "D":
        return new KeyInfo(e, "d", "D", "KeyD", {
          useShiftedCharacterForLegacyKeyCode: !0,
        });
      case "e":
      case "E":
        return new KeyInfo(e, "e", "E", "KeyE", {
          useShiftedCharacterForLegacyKeyCode: !0,
        });
      case "f":
      case "F":
        return new KeyInfo(e, "f", "F", "KeyF", {
          useShiftedCharacterForLegacyKeyCode: !0,
        });
      case "g":
      case "G":
        return new KeyInfo(e, "g", "G", "KeyG", {
          useShiftedCharacterForLegacyKeyCode: !0,
        });
      case "h":
      case "H":
        return new KeyInfo(e, "h", "H", "KeyH", {
          useShiftedCharacterForLegacyKeyCode: !0,
        });
      case "i":
      case "I":
        return new KeyInfo(e, "i", "I", "KeyI", {
          useShiftedCharacterForLegacyKeyCode: !0,
        });
      case "j":
      case "J":
        return new KeyInfo(e, "j", "J", "KeyJ", {
          useShiftedCharacterForLegacyKeyCode: !0,
        });
      case "k":
      case "K":
        return new KeyInfo(e, "k", "K", "KeyK", {
          useShiftedCharacterForLegacyKeyCode: !0,
        });
      case "l":
      case "L":
        return new KeyInfo(e, "l", "L", "KeyL", {
          useShiftedCharacterForLegacyKeyCode: !0,
        });
      case "m":
      case "M":
        return new KeyInfo(e, "m", "M", "KeyM", {
          useShiftedCharacterForLegacyKeyCode: !0,
        });
      case "n":
      case "N":
        return new KeyInfo(e, "n", "N", "KeyN", {
          useShiftedCharacterForLegacyKeyCode: !0,
        });
      case "o":
      case "O":
        return new KeyInfo(e, "o", "O", "KeyO", {
          useShiftedCharacterForLegacyKeyCode: !0,
        });
      case "p":
      case "P":
        return new KeyInfo(e, "p", "P", "KeyP", {
          useShiftedCharacterForLegacyKeyCode: !0,
        });
      case "q":
      case "Q":
        return new KeyInfo(e, "q", "Q", "KeyQ", {
          useShiftedCharacterForLegacyKeyCode: !0,
        });
      case "r":
      case "R":
        return new KeyInfo(e, "r", "R", "KeyR", {
          useShiftedCharacterForLegacyKeyCode: !0,
        });
      case "s":
      case "S":
        return new KeyInfo(e, "s", "S", "KeyS", {
          useShiftedCharacterForLegacyKeyCode: !0,
        });
      case "t":
      case "T":
        return new KeyInfo(e, "t", "T", "KeyT", {
          useShiftedCharacterForLegacyKeyCode: !0,
        });
      case "u":
      case "U":
        return new KeyInfo(e, "u", "U", "KeyU", {
          useShiftedCharacterForLegacyKeyCode: !0,
        });
      case "v":
      case "V":
        return new KeyInfo(e, "v", "V", "KeyV", {
          useShiftedCharacterForLegacyKeyCode: !0,
        });
      case "w":
      case "W":
        return new KeyInfo(e, "w", "W", "KeyW", {
          useShiftedCharacterForLegacyKeyCode: !0,
        });
      case "x":
      case "X":
        return new KeyInfo(e, "x", "X", "KeyX", {
          useShiftedCharacterForLegacyKeyCode: !0,
        });
      case "y":
      case "Y":
        return new KeyInfo(e, "y", "Y", "KeyY", {
          useShiftedCharacterForLegacyKeyCode: !0,
        });
      case "z":
      case "Z":
        return new KeyInfo(e, "z", "Z", "KeyZ", {
          useShiftedCharacterForLegacyKeyCode: !0,
        });
      case "0":
      case ")":
        return new KeyInfo(e, "0", ")", "Digit0", {});
      case "1":
      case "!":
        return new KeyInfo(e, "1", "!", "Digit1", {});
      case "2":
      case "@":
        return new KeyInfo(e, "2", "@", "Digit2", {});
      case "3":
      case "#":
        return new KeyInfo(e, "3", "#", "Digit3", {});
      case "4":
      case "$":
        return new KeyInfo(e, "4", "$", "Digit4", {});
      case "5":
      case "%":
        return new KeyInfo(e, "5", "%", "Digit5", {});
      case "6":
      case "^":
        return new KeyInfo(e, "6", "^", "Digit6", {});
      case "7":
      case "&":
        return new KeyInfo(e, "7", "&", "Digit7", {});
      case "8":
      case "*":
        return new KeyInfo(e, "8", "*", "Digit8", {});
      case "9":
      case "(":
        return new KeyInfo(e, "9", "(", "Digit9", {});
      case ";":
      case ":":
        return new KeyInfo(e, ";", ":", "Semicolon", {});
      case "=":
      case "+":
        return new KeyInfo(e, "=", "+", "Equal", {});
      case ",":
      case "<":
        return new KeyInfo(e, ",", "<", "Comma", {});
      case "-":
      case "_":
        return new KeyInfo(e, "-", "_", "Minus", {});
      case ".":
      case ">":
        return new KeyInfo(e, ".", ">", "Period", {});
      case "/":
      case "?":
        return new KeyInfo(e, "/", "?", "Slash", {});
      case "`":
      case "~":
        return new KeyInfo(e, "`", "~", "Backquote", {});
      case "[":
      case "{":
        return new KeyInfo(e, "[", "{", "BracketLeft", {});
      case "\\":
      case "|":
        return new KeyInfo(e, "\\", "|", "Backslash", {});
      case "]":
      case "}":
        return new KeyInfo(e, "]", "}", "BracketRight", {});
      case "'":
      case '"':
        return new KeyInfo(e, "'", '"', "Quote", {});
      case " ":
        return new KeyInfo(e, " ", null, "Space", {});
      case "\t":
        return new KeyInfo(e, "\t", null, "Tab", { uiEventKey: "Tab" });
      case "\n":
        return new KeyInfo(e, "\n", null, "Enter", { uiEventKey: "Enter" });
    }
    return new KeyInfo(e, e.toLowerCase(), e.toUpperCase(), "Unidentified");
  }
  static shiftKeyEvent(e) {
    switch (e) {
      case "keydown":
        return new KeyboardEvent(e, { ...KeyInfo.#t, shiftKey: !0 });
      case "keyup":
        return new KeyboardEvent(e, KeyInfo.#t);
    }
  }
}
class PasswordRule {
  standardCharacter = 0;
  customCharacters = "";
  static asciiPrintableBit = 1 << WBSPasswordCharacterClassTypeASCIIPrintable;
  static digitBit = 1 << WBSPasswordCharacterClassTypeDigit;
  static lowercaseBit = 1 << WBSPasswordCharacterClassTypeLower;
  static uppercaseBit = 1 << WBSPasswordCharacterClassTypeUpper;
  static specialCharacterBit = 1 << WBSPasswordCharacterClassTypeSpecial;
  static unicodeBit = 1 << WBSPasswordCharacterClassTypeUnicode;
  copy() {
    const e = new PasswordRule();
    return (
      (e.standardCharacter = this.standardCharacter),
      (e.customCharacters = this.customCharacters),
      e
    );
  }
  intersection(e) {
    ((this.standardCharacter &= e.standardCharacter),
      (this.customCharacters = [
        ...new Set([...this.customCharacters]).intersection(
          new Set([...e.customCharacters]),
        ),
      ].join("")),
      this.#c());
  }
  union(e) {
    ((this.standardCharacter |= e.standardCharacter),
      (this.customCharacters = [
        ...new Set(this.customCharacters + e.customCharacters),
      ].join("")),
      this.#c());
  }
  addAllowedCharacterClass(e) {
    if (e instanceof NamedCharacterClass)
      switch (e.name) {
        case Identifier.ASCII_PRINTABLE:
          this.standardCharacter = PasswordRule.asciiPrintableBit;
          break;
        case Identifier.UNICODE:
          this.standardCharacter = PasswordRule.unicodeBit;
          break;
        case Identifier.DIGIT:
          this.standardCharacter |= PasswordRule.digitBit;
          break;
        case Identifier.LOWER:
          this.standardCharacter |= PasswordRule.lowercaseBit;
          break;
        case Identifier.UPPER:
          this.standardCharacter |= PasswordRule.uppercaseBit;
          break;
        case Identifier.SPECIAL:
          this.standardCharacter |= PasswordRule.specialCharacterBit;
      }
    else
      e instanceof CustomCharacterClass &&
        (this.customCharacters = [
          ...new Set([...this.customCharacters, ...e.characters]),
        ].join(""));
    ((this.customCharacters = [...new Set([...this.customCharacters])].join(
      "",
    )),
      this.#c());
  }
  #c() {
    if (this.standardCharacter & PasswordRule.asciiPrintableBit)
      return (
        (this.standardCharacter = PasswordRule.asciiPrintableBit),
        void (this.customCharacters = "")
      );
    if (this.standardCharacter & PasswordRule.unicodeBit)
      return (
        (this.standardCharacter = PasswordRule.unicodeBit),
        void (this.customCharacters = "")
      );
    if (0 === this.customCharacters.length) return;
    const e = new Set(this.customCharacters);
    if (this.standardCharacter & PasswordRule.digitBit)
      for (const t of "0123456789") e.delete(t);
    if (this.standardCharacter & PasswordRule.lowercaseBit)
      for (const t of "abcdefghijklmnopqrstuvwxyz") e.delete(t);
    if (this.standardCharacter & PasswordRule.uppercaseBit)
      for (const t of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") e.delete(t);
    this.customCharacters = [...e].join("");
  }
}
class PasswordRuleSet {
  allowedRule = null;
  requiredRules = null;
  maxConsecutiveRule = null;
  minLengthRule = null;
  maxLengthRule = null;
  constructor(e) {
    for (const t of e)
      switch (t.name) {
        case RuleName.ALLOWED:
          this.#d(t);
          break;
        case RuleName.REQUIRED:
          this.#h(t);
          break;
        case RuleName.MAX_CONSECUTIVE:
          this.#m(t);
          break;
        case RuleName.MIN_LENGTH:
          this.#F(t);
          break;
        case RuleName.MAX_LENGTH:
          this.#f(t);
      }
    this.#c();
  }
  copy() {
    const e = new PasswordRuleSet([]);
    return (
      null !== this.allowedRule && (e.allowedRule = this.allowedRule.copy()),
      null !== this.requiredRules &&
        (e.requiredRules = this.requiredRules.map((e) => e.copy())),
      (e.maxConsecutiveRule = this.maxConsecutiveRule),
      (e.minLengthRule = this.minLengthRule),
      (e.maxLengthRule = this.maxLengthRule),
      e
    );
  }
  merge(e) {
    (this.#g(e), this.#p(e), this.#C(e), this.#y(e), this.#b(e), this.#c());
  }
  #g(e) {
    null !== e.allowedRule &&
      (null === this.allowedRule
        ? (this.allowedRule = e.allowedRule.copy())
        : this.allowedRule.intersection(e.allowedRule));
  }
  #p(e) {
    if (null !== e.requiredRules) {
      null === this.requiredRules && (this.requiredRules = []);
      for (const t of e.requiredRules) this.requiredRules.push(t.copy());
    }
  }
  #C(e) {
    null !== e.maxConsecutiveRule &&
      (null !== this.maxConsecutiveRule
        ? (this.maxConsecutiveRule = Math.min(
            this.maxConsecutiveRule,
            e.maxConsecutiveRule,
          ))
        : (this.maxConsecutiveRule = e.maxConsecutiveRule));
  }
  #y(e) {
    null !== e.minLengthRule &&
      (null !== this.minLengthRule
        ? (this.minLengthRule = Math.max(this.minLengthRule, e.minLengthRule))
        : (this.minLengthRule = e.minLengthRule));
  }
  #b(e) {
    null !== e.maxLengthRule &&
      (null !== this.maxLengthRule
        ? (this.maxLengthRule = Math.min(this.maxLengthRule, e.maxLengthRule))
        : (this.maxLengthRule = e.maxLengthRule));
  }
  #h(e) {
    null === this.requiredRules && (this.requiredRules = []);
    const t = new PasswordRule();
    for (const r of e.value) t.addAllowedCharacterClass(r);
    this.requiredRules.push(t);
  }
  #d(e) {
    this.allowedRule || (this.allowedRule = new PasswordRule());
    for (const t of e.value) this.allowedRule.addAllowedCharacterClass(t);
  }
  #m(e) {
    (null === this.maxConsecutiveRule && (this.maxConsecutiveRule = 1 / 0),
      (this.maxConsecutiveRule = Math.min(this.maxConsecutiveRule, e.value)));
  }
  #F(e) {
    (null === this.minLengthRule && (this.minLengthRule = 0),
      (this.minLengthRule = Math.max(this.minLengthRule, e.value)));
  }
  #f(e) {
    (null === this.minLengthRule && (this.minLengthRule = 1 / 0),
      (this.maxLengthRule = Math.min(this.maxLengthRule, e.value)));
  }
  #c() {
    if (null !== this.requiredRules) {
      null === this.allowedRule && (this.allowedRule = new PasswordRule());
      for (const e of this.requiredRules) this.allowedRule.union(e);
    }
  }
}
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
  (Element.prototype.traversePreviousElement = function () {
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
    let t = e instanceof Element ? e : e.parentElementIncludingShadowDOMHost(),
      r = getComputedStyle(t, null);
    if (
      ((e._isVisible = -visibilityCacheGeneration),
      "none" === r.display || "visible" !== r.visibility)
    )
      return !1;
    let n = 0 === parseFloat(r.opacity) ? 6 : 2;
    var o = t.getBoundingClientRect();
    return (
      !(o.width < n) &&
      !(o.height < n) &&
      ((e._isVisible = visibilityCacheGeneration), !0)
    );
  }),
  Object.defineProperty(Array.prototype, "joinFirstItems", {
    value(e, t) {
      t > this.length && (t = this.length);
      for (var r = "", n = 0; n < t; ++n) (n > 0 && (r += e), (r += this[n]));
      return r;
    },
  }),
  (DOMRect.prototype.isZeroRect = function () {
    return !(this.top || this.right || this.bottom || this.left);
  }),
  (DOMRect.prototype.centerPoint = function () {
    return {
      x: Math.round(this.x + this.width / 2),
      y: Math.round(this.y + this.height / 2),
    };
  }),
  (DOMRect.prototype.distanceToRect = function (e) {
    function t(e) {
      function t(e, t) {
        return Math.pow(e.x - t.x, 2) + Math.pow(e.y - t.y, 2);
      }
      var r = e[0],
        n = e[1];
      return (r[0].x >= n[0].x && r[0].x < n[1].x) ||
        (n[0].x >= r[0].x && n[0].x < r[1].x)
        ? Math.abs(r[0].y - n[0].y)
        : (r[0].y >= n[0].y && r[0].y < n[1].y) ||
            (n[0].y >= r[0].y && n[0].y < r[1].y)
          ? Math.abs(r[0].x - n[0].x)
          : Math.sqrt(Math.min(t(r[0], n[1]), t(r[1], n[0])));
    }
    var r = [
        { x: this.left, y: this.top },
        { x: this.right, y: this.top },
      ],
      n = [
        { x: this.right, y: this.top },
        { x: this.right, y: this.bottom },
      ],
      o = [
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
        [r, l],
        [r, s],
        [n, u],
        [n, a],
        [o, l],
        [o, s],
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
    let r = this.allAncestorsAndSelfIncludingShadowDOMHosts().reverse(),
      n = e.allAncestorsAndSelfIncludingShadowDOMHosts().reverse(),
      o = Math.min(r.length, n.length),
      i = null;
    for (let e = 0; e < o; ++e) {
      if (!(r[e] === n[e])) break;
      i = r[e];
    }
    return i || null;
  }),
  (Element.prototype.isHiddenFromAccessibilityTree = function () {
    const e = 2;
    for (
      let r = 0, n = this;
      r <= e && n;
      ++r, n = n.parentElementIncludingShadowDOMHost()
    ) {
      var t = n.getAttribute("aria-hidden");
      if (t && "true" === t.toLowerCase()) return !0;
    }
    return !1;
  }),
  (HTMLElement.prototype._setAutofillButtonType = function (e) {
    const t = this.autofillButtonType;
    e !== t &&
      ((this._lastAutofillButtonType = t), (this.autofillButtonType = e));
  }),
  (HTMLElement.prototype.isDisabledOrReadOnly = function () {
    return this.disabled || this.readOnly;
  }),
  (HTMLElement.prototype.shouldFocusDuringFilling = function () {
    return !isRadioButtonElement(this) && !isSelectElement(this);
  }),
  (HTMLFormElement.prototype.isVisible = function () {
    if (Node.prototype.isVisible.call(this)) return !0;
    for (var e = this.elements, t = e.length, r = 0; r < t; ++r)
      if (e[r].isVisible()) return !0;
    return !1;
  }));
let cachedUserIsOnDomain = {};
class LogicalForm {
  #A;
  #w = !1;
  constructor(e, t, r) {
    let n = e.length;
    var o = e[0].form,
      i = o;
    let l = e[0],
      a = e[n - 1];
    ((!t && i) || (i = 1 === n ? l : l.closestCommonAncestor(a)),
      (o && o.contains(a)) || (o = i));
    let s = i.closest('*[role~="dialog"]');
    s && (i = s);
    let u = l._provisionalLogicalFormUniqueIDForFirstControlInLogicalForm;
    (u ||
      ((u = FormMetadataJSController.nextFormUniqueID),
      (l._provisionalLogicalFormUniqueIDForFirstControlInLogicalForm = u)),
      (this._formUniqueID = u),
      (this._metadata = {}),
      (this._weakControls = Array.prototype.map.call(e, (e) => new WeakRef(e))),
      (this._weakFormElement = new WeakRef(o)),
      (this._weakBackingElement = new WeakRef(i)),
      (this.#A = new MutationObserver(this.#E.bind(this))),
      r || this.markElementsAsPartOfLogicalForm());
  }
  get elements() {
    return this._weakControls.flatMap((e) => e.deref() ?? []);
  }
  get formElement() {
    return this._weakFormElement.deref();
  }
  get backingElement() {
    return this._weakBackingElement.deref();
  }
  get formUniqueID() {
    return this._formUniqueID;
  }
  get metadata() {
    return this._metadata;
  }
  set metadata(e) {
    ((this._metadata = e), this.#_());
  }
  containsControl(e) {
    return e.hasOwnProperty("_logicalFormUniqueID")
      ? e._logicalFormUniqueID === this.formUniqueID
      : e.form === this.formElement;
  }
  radioButtonsWithName(e) {
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
  }
  annotate(e) {
    let t = this.formElement;
    if (t) {
      var r = t._annotations;
      if (r) {
        for (var n in e) {
          var o = e[n];
          o ? (r[n] = o) : delete r[n];
        }
        hasOwnProperties(r) || delete t._annotations;
      } else t._annotations = e;
    }
  }
  markElementsAsPartOfLogicalForm() {
    let e = this._weakControls.length;
    for (let t = 0; t < e; t++) {
      let r = this._weakControls[t].deref();
      r &&
        ((r._logicalFormUniqueID = this.formUniqueID),
        t + 1 < e &&
          (r._weakNextControlInLogicalForm = this._weakControls[t + 1]),
        t > 0 &&
          (r._weakPreviousControlInLogicalForm = this._weakControls[t - 1]));
    }
  }
  get hasVisibleControls() {
    return (
      this.formElement.isVisible() &&
      this._weakControls.some((e) => e.deref()?.isVisible())
    );
  }
  get annotations() {
    return this.formElement?._annotations;
  }
  get isAnnotated() {
    return !!this.annotations;
  }
  get passwordControls() {
    const e = this.metadata;
    return e
      ? Object.fromEntries(
          [
            e.PasswordElementUniqueID,
            e.ConfirmPasswordElementUniqueID,
            e.OldPasswordElementUniqueID,
          ]
            .map((e) => {
              if (!e) return null;
              const t = FormMetadataJS.formControlWithUniqueID(e);
              return t ? [e, t] : null;
            })
            .filter((e) => !!e),
        )
      : [];
  }
  #_() {
    Object.values(this.passwordControls).forEach((e) => {
      e.addEventListener(
        "input",
        () => {
          this.#w ||
            (this.#A.observe(document, {
              subtree: !0,
              childList: !0,
              attributes: !0,
            }),
            (this.#w = !0));
        },
        { once: !0, passive: !0 },
      );
    });
  }
  #E(e) {
    const t = this.metadata,
      r = this.passwordControls;
    for (const n of e) {
      (n.target, n.type, n.addedNodes);
      const e = n.removedNodes;
      if (e.length) {
        let n = new Set();
        for (const t of e) {
          for (const [e, o] of Object.entries(r))
            n.has(o) || (t.contains(o) && n.add(e));
          if (r.size === n.size) break;
        }
        if (n.size) {
          const e = t.FormControls.filter((e) => n.has(e.ControlUniqueID));
          FormMetadataJSController.logicalFormObservedChangeIndicatingFormSubmission(
            t,
            e,
          );
        }
      }
    }
  }
}
class LogicalFormCache {
  constructor() {
    ((this._logicalFormsByUniqueID = new Map()), (this._allLogicalForms = []));
  }
  get size() {
    return this._logicalFormsByUniqueID.size;
  }
  removeUnparentedLogicalFormsFromCache() {
    let e = new Set();
    for (let t of this._allLogicalForms) t.formElement?.isConnected || e.add(t);
    for (let t of e) this._logicalFormsByUniqueID.delete(t.formUniqueID);
    this._allLogicalForms = Array.from(this._logicalFormsByUniqueID.values());
  }
  logicalFormForControl(e) {
    for (let t of this._allLogicalForms) if (t.containsControl(e)) return t;
    return null;
  }
  allForms() {
    return this._allLogicalForms.slice();
  }
  cachedForms() {
    return Array.from(this._logicalFormsByUniqueID.values());
  }
  addOrUpdate(e) {
    (this._logicalFormsByUniqueID.set(e.formUniqueID, e),
      this._allLogicalForms.push(e));
  }
  clearCacheAndAdd(e) {
    (this._logicalFormsByUniqueID.clear(), (this._allLogicalForms = []));
    for (let t of e) this.addOrUpdate(t);
  }
  logicalFormWithUniqueID(e) {
    return this._logicalFormsByUniqueID.get(e);
  }
  get numberOfVisibleFormsWithVisibleElements() {
    return this.cachedForms().reduce(
      (e, t) => (t.hasVisibleControls ? e + 1 : e),
      0,
    );
  }
}
class FormMetadata {
  canUseTextInputEventsToFill = !0;
  #T = null;
  constructor() {
    ((this._logicalFormsCache = new LogicalFormCache()),
      (this._elementsWithGeneratedPasswords = []),
      (this._generatedPasswords = []),
      (this._controlUniqueIDToWeakControlMap = new Map()),
      (this._mapOfFormTypeToExtraScoreProducer = (function () {
        let e = {};
        return (
          (e[WBSAutoFillFormTypeNewAccount] = function () {
            return 0;
          }),
          (e[WBSAutoFillFormTypeAutoFillableLogin] = function (e) {
            const t = 2,
              r = function (e) {
                return (
                  "checkbox" === e.type &&
                  FormMetadataJS._labelsForElement(e).some(
                    (e) =>
                      /(remember|keep) me/i.test(e.innerText.trim()) &&
                      e.isVisible(),
                  )
                );
              };
            return 1 === e.elements.filter((e) => r(e)).length ? t : 0;
          }),
          (e[WBSAutoFillFormTypeChangePassword] = function () {
            return 0;
          }),
          e
        );
      })()),
      (this._requiredFormatForDateTimeInput = DateTimeInputTypes.reduce(
        function (e, t) {
          let r = document.createElement("input");
          r.type = t;
          let n = "a";
          return (
            (r.value = n),
            (e[t] = "" === r.value ? DateTimeInputTypeFormats[t] : ""),
            e
          );
        },
        {},
      )));
  }
  get _labels() {
    null === this.#T &&
      (this.#T = Array.from(queryAllBySelector(document, "label")).map(
        (e) => new WeakRef(e),
      ));
    const e = [];
    for (const t of this.#T) {
      const r = t.deref();
      r && e.push(r);
    }
    return e;
  }
  _getTagName(e) {
    var t = e.tagName;
    return "string" == typeof t || "string" == typeof (t = e.nodeName)
      ? t
      : void 0;
  }
  _getNameOrId(e) {
    return e.name && e.name.length ? e.name : e.id;
  }
  controlUniqueID(e) {
    if (e._controlUniqueID) return e._controlUniqueID;
    var t = "ControlID-" + FormMetadataJSController.nextControlUniqueID;
    e._controlUniqueID = t;
    this._controlUniqueIDToWeakControlMap.get(t);
    return (
      this._controlUniqueIDToWeakControlMap.set(t, new WeakRef(e)),
      e._controlUniqueID
    );
  }
  _searchForLabelsAboveCell(e, t) {
    var r = window.getComputedStyle(t, null);
    if (!r || "table-cell" !== r.getPropertyValue("display")) return null;
    var n = cellVisuallyAbove(t);
    if (!n) return null;
    for (var o = 0, i = n.firstChild; i; i = i.traverseNextNode(n))
      if (i.nodeType == Node.TEXT_NODE && i.isVisible()) {
        var l = i.nodeValue,
          a = e.searchReverse(l);
        if (a)
          return {
            Distance: o,
            Match: a[0],
            Property: a[1],
            Category: a[2],
            ParentProperty: a[3],
          };
        o += l.length;
      }
    return null;
  }
  _collectStringFromNodeForPageScan(e, t, r) {
    var n = e.nodeValue,
      o = n.length;
    return (
      r + o > PageScanMaxCharactersSearched &&
        ((n = n.substr(-(PageScanCharactersSearchedThreshold - r))),
        (o = PageScanCharactersSearchedThreshold - r)),
      (n = n.trim()).length && t.push(n),
      r
    );
  }
  _dataForComputingMatchFromPageScanBeforeElement(e, t) {
    function r(e) {
      return e && e.nodeType == Node.ELEMENT_NODE && e.matches("nav");
    }
    var n,
      o = [],
      i = 0;
    let l = this._logicalFormsCache.logicalFormForControl(e);
    if (!l) return [[], null];
    var a = l.formElement,
      s = a && a.isVisible();
    t || (t = a);
    for (
      var u = e.traversePreviousNode(r);
      u && i < PageScanCharactersSearchedThreshold;
      u = u.traversePreviousNode(r)
    ) {
      var c = u.localName;
      if (u === t) break;
      if (this._isRenderedFormControl(u)) {
        if (u.isVisible() || !s) break;
      } else {
        if (this._isLabelElement(u) && u.isVisible()) break;
        if ("td" !== c || n) {
          if ("tr" === c && n) break;
          if ("ul" === c || "ol" === c || "dl" === c) break;
          if ("li" === c) {
            if (!u.parentNode.contains(e)) break;
          } else
            u.nodeType == Node.TEXT_NODE &&
              u.isVisible() &&
              (i += this._collectStringFromNodeForPageScan(u, o, i));
        } else n = u;
      }
    }
    return [o, n];
  }
  _matchFromPageScanBeforeElement(e, t, r) {
    var n = this._pageScanContext
        ? this._pageScanContext.backwardScanCache
        : null,
      o = this._pageScanDataForElementWithCacheAndDataProducer(
        t,
        n,
        this._dataForComputingMatchFromPageScanBeforeElement.bind(this),
        r,
      ),
      i = o[0],
      l = this._matchFromPatternMatcherAndStringsFromPageScan(e, i);
    if (l) return l;
    var a = o[1];
    if (a) {
      var s = this._searchForLabelsAboveCell(e, a);
      if (s) return ((s.IsInCellAbove = !0), s);
    }
    return null;
  }
  _isElementFollowedByForgotUserNameOrEmailOrFederatedSignInAffordance(e, t) {
    (this._forgotUserNameRegularExpressions ||
      (this._forgotUserNameRegularExpressions = regularExpressionsFromStrings(
        FormMetadataJSController.regularExpressionsForForgotUserNameAffordance,
      )),
      this._forgotEmailRegularExpressions ||
        (this._forgotEmailRegularExpressions = regularExpressionsFromStrings(
          FormMetadataJSController.regularExpressionsForForgotEmailAffordance,
        )));
    let r = this._stringsToEvaluateToDetermineIfElementIsFollowedByAffordance(
      e,
      t,
    );
    if (
      stringsMatchAnyRegularExpressions(
        r,
        this._forgotUserNameRegularExpressions,
      )
    )
      return !0;
    if (
      stringsMatchAnyRegularExpressions(r, this._forgotEmailRegularExpressions)
    )
      return !0;
    let n = this._cachedFederatedSignInAffordancePatternMatcher();
    for (let e of r) if (this._matchPatternAgainstString(n, e)) return !0;
    return !1;
  }
  _isElementFollowedByForgotPasswordAffordance(e, t) {
    return (
      this._forgotPasswordRegularExpressions ||
        (this._forgotPasswordRegularExpressions = regularExpressionsFromStrings(
          FormMetadataJSController.regularExpressionsForForgotPasswordAffordance,
        )),
      stringsMatchAnyRegularExpressions(
        this._stringsToEvaluateToDetermineIfElementIsFollowedByAffordance(e, t),
        this._forgotPasswordRegularExpressions,
      )
    );
  }
  _numberOfForgotUserNameEmailOrPasswordAffordancesFollowingElement(e, t) {
    (this._forgotEmailRegularExpressions ||
      (this._forgotEmailRegularExpressions = regularExpressionsFromStrings(
        FormMetadataJSController.regularExpressionsForForgotEmailAffordance,
      )),
      this._forgotPasswordRegularExpressions ||
        (this._forgotPasswordRegularExpressions = regularExpressionsFromStrings(
          FormMetadataJSController.regularExpressionsForForgotPasswordAffordance,
        )),
      this._forgotUserNameRegularExpressions ||
        (this._forgotUserNameRegularExpressions = regularExpressionsFromStrings(
          FormMetadataJSController.regularExpressionsForForgotUserNameAffordance,
        )));
    let r = this._stringsToEvaluateToDetermineIfElementIsFollowedByAffordance(
        e,
        t,
      ),
      n = 0;
    return (
      stringsMatchAnyRegularExpressions(
        r,
        this._forgotUserNameRegularExpressions,
      ) && n++,
      stringsMatchAnyRegularExpressions(
        r,
        this._forgotEmailRegularExpressions,
      ) && n++,
      stringsMatchAnyRegularExpressions(
        r,
        this._forgotPasswordRegularExpressions,
      ) && n++,
      n
    );
  }
  _stringsToEvaluateToDetermineIfElementIsFollowedByAffordance(e, t) {
    let r = this._dataForComputingMatchFromPageScanAfterElement(e, "A");
    if (!r.length) {
      const t = e.traverseNextNode();
      if (t) {
        let e = t;
        t instanceof Node && (e = t.parentElementIncludingShadowDOMHost());
        const n = e.querySelector("a:not(svg a)");
        if (n) {
          const e = n.innerText;
          e?.length && r.push(e);
          const t = pathFromAnchorWithoutLeadingSlash(n);
          t?.length && r.push(t);
        }
      }
    }
    if (!r.length) {
      for (let n of queryAllBySelector(t, "a:not(svg a)")) {
        if (e.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_FOLLOWING) {
          const e = n.innerText;
          e?.length && r.push(e);
          const t = pathFromAnchorWithoutLeadingSlash(n);
          t?.length && r.push(t);
        }
      }
      for (let n of queryAllBySelector(t, "button")) {
        if (e.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_FOLLOWING) {
          const e = n.innerText;
          e.length && r.push(e);
        }
      }
    }
    const n = e._weakNextControlInLogicalForm?.deref();
    if (n && "button" === n.type) {
      const e = n.innerText;
      e.length && r.push(e);
    }
    return r;
  }
  _shouldDetectStandaloneUserNameFields() {
    return "https://discord.com/channels/@me" !== window.location.href;
  }
  _dataForComputingMatchFromPageScanAfterElement(e, t, r) {
    var n = [],
      o = 0,
      i = this._logicalFormsCache.logicalFormForControl(e);
    if (!i) return [];
    var l = i.formElement,
      a = l && l.isVisible();
    let s = void 0 !== t;
    r || (r = l);
    for (
      var u = e.traverseNextNode();
      u && o < PageScanCharactersSearchedThreshold;
      u = u.traverseNextNode()
    ) {
      var c = u.localName;
      if (u === r) {
        var d = this._pageScanContext;
        d && !o && (d.forwardScanIsFutile = !0);
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
          if (((o += this._collectStringFromNodeForPageScan(u, n, o)), s))
            break;
        }
      }
    }
    return n;
  }
  _matchFromPageScanAfterElement(e, t, r) {
    var n = this._pageScanContext
        ? this._pageScanContext.forwardScanCache
        : null,
      o = this._pageScanDataForElementWithCacheAndDataProducer(
        t,
        n,
        this._dataForComputingMatchFromPageScanAfterElement.bind(this),
        r,
      );
    return this._matchFromPatternMatcherAndStringsFromPageScan(e, o);
  }
  _pageScanDataForElementWithCacheAndDataProducer(e, t, r, n) {
    if (!t) return r(e, n);
    if ((o = t.get(e))) return o;
    var o = r(e, n);
    return (t.set(e, o), o);
  }
  _matchFromPatternMatcherAndStringsFromPageScan(e, t) {
    for (var r = t.length, n = 0, o = 0; o < r; ++o) {
      var i = t[o];
      n += i.length;
      var l = e.searchReverse(i);
      if (l)
        return {
          Distance: n,
          Match: l[0],
          Property: l[1],
          Category: l[2],
          ParentProperty: l[3],
        };
    }
    return null;
  }
  _matchPatternAgainstString(e, t) {
    if (!t) return null;
    var r = t.replace(/[\d_.-]/g, " ");
    return (
      (r = r.replace(/[a-z][A-Z]/g, function (e) {
        return e[0] + " " + e[1];
      })),
      e.longestMatch(r)
    );
  }
  _controlsAreAllButtons(e) {
    for (var t = e.length, r = 0; r < t; ++r) {
      if (!(e[r] instanceof HTMLButtonElement)) return !1;
    }
    return !0;
  }
  _createLogicalFormsForControls(e, t, r) {
    if (this._controlsAreAllButtons(e)) return [];
    let n,
      o,
      i = e.map(function (e) {
        return e.getBoundingClientRect();
      }),
      l = e.length,
      a = 0;
    i[0].isZeroRect() ? ((n = 0), (o = null)) : ((n = 1), (o = i[0]));
    for (let d = 1; d < l; ++d) {
      let h = i[d];
      if (!h.isZeroRect()) {
        if (o) {
          let m = o.distanceToRect(h);
          m && (++n, (a += m));
        }
        o = h;
      }
    }
    if (1 === n) {
      function F(e) {
        return e.closest("header, footer, aside");
      }
      let f = [],
        g = 0;
      for (; g < l; ) {
        let p = [e[g]],
          C = F(e[g]);
        for (let y = g + 1; y < l; ++y) {
          let b = e[y];
          if (C !== F(e[y])) break;
          p.push(b);
        }
        (f.push(new LogicalForm(p, t, r)), (g += p.length));
      }
      return f;
    }
    let s = n ? a / n : 0,
      u = [],
      c = 0;
    for (; c < l; ) {
      let A = [e[c]],
        w = !1,
        E = i[c].isZeroRect() ? null : i[c];
      for (let _ = c + 1; _ < l; ++_) {
        let T = e[_],
          S = i[_];
        if (!S.isZeroRect()) {
          if (w) {
            if (E && E.distanceToRect(S) > s) break;
          } else w = couldBeFormSubmissionControl(T);
          E = S;
        }
        A.push(T);
      }
      (u.push(new LogicalForm(A, t, r)), (c += A.length));
    }
    return u;
  }
  _formLooksLikeAspnetForm(e) {
    const t = 3;
    var r = 0;
    ("aspnetForm" === e.getAttribute("id") && ++r,
      "aspnetForm" === e.getAttribute("name") && ++r);
    for (
      var n = queryAllBySelector(e, "input"), o = 0, i = n.length;
      o < i;
      ++o
    ) {
      var l = n[o],
        a = l.getAttribute("id"),
        s = l.getAttribute("name");
      (/ctl\d\d_/.test(a) && ++r,
        /ctl\d\d\$/.test(s) && ++r,
        "hidden" === l.getAttribute("type") &&
          (("__VIEWSTATE" === s && "__VIEWSTATE" === a) ||
            ("__EVENTTARGET" === s && "__EVENTTARGET" === a) ||
            ("__EVENTARGUMENT" === s && "__EVENTARGUMENT" === a) ||
            ("__LASTFOCUS" === s && "__LASTFOCUS" === a)) &&
          ++r);
    }
    for (
      var u = queryAllBySelector(document, "script"), c = u.length, d = 0;
      d < c;
      ++d
    ) {
      var h = anchorWithURLString(u[d].src);
      if (h.host === window.location.host) {
        var m = lastPathComponentFromAnchor(h);
        ("WebResource.axd" !== m && "ScriptResource.axd" !== m) || ++r;
      }
    }
    return r >= t;
  }
  _anchorLooksLikeSubmitButton(e) {
    return (
      !(
        !e.classList.contains("button") ||
        !/submit/i.test(e.getAttribute("action"))
      ) || /submit|button/i.test(e.getAttribute("id"))
    );
  }
  _visibleInputAndSelectElementsInForm(e) {
    let t = queryAllBySelector(e, "input:not([type='hidden']), select"),
      r = [];
    for (var n = 0, o = t.length; n < o; ++n) {
      let e = t[n];
      e.isVisible() && r.push(e);
    }
    return r;
  }
  _elementsActingAsButtonsInForm(e) {
    let t = Array.prototype.slice.call(
        queryAllBySelector(e, "input[type='submit'], input[type='image']"),
      ),
      r = queryAllBySelector(e, "a");
    for (var n = 0, o = r.length; n < o; ++n) {
      let e = r[n];
      this._anchorLooksLikeSubmitButton(e) && e.isVisible() && t.push(e);
    }
    return t;
  }
  _logicalFormsForAspnetForm(e) {
    function t(e) {
      var r = e.length;
      if (r <= 1)
        a.push(
          new LogicalForm(e, ForceNonFormElementAsLogicalBackingElement.Yes),
        );
      else {
        var n = r - 1,
          o = e[n];
        if (e[0].closestCommonAncestor(o) instanceof HTMLTableRowElement) {
          for (var i = 0; i < n; ++i) {
            if (!(e[i].closestCommonAncestor(o) instanceof HTMLTableRowElement))
              return (t(e.slice(0, i)), void t(e.slice(i)));
          }
          a.push(
            new LogicalForm(e, ForceNonFormElementAsLogicalBackingElement.Yes),
          );
        } else
          a.push(
            new LogicalForm(e, ForceNonFormElementAsLogicalBackingElement.Yes),
          );
      }
    }
    for (
      var r = this._visibleInputAndSelectElementsInForm(e),
        n = r.length,
        o = this._elementsActingAsButtonsInForm(e),
        i = o.length,
        l = 0;
      l < i;
      ++l
    ) {
      (s = o[l]).getAttribute("id") &&
        (s._aspNetIDComponents = s.getAttribute("id").split("_"));
    }
    o.sort(function (e, t) {
      var r = e._aspNetIDComponents || [];
      return (t._aspNetIDComponents || []).length - r.length;
    });
    var a = [];
    for (l = 0; l < i; ++l) {
      var s,
        u = (s = o[l])._aspNetIDComponents;
      if (u) {
        var c = u.length;
        if (!(c < 2)) {
          for (
            var d = u.joinFirstItems("_", c - 1) + "_", h = [], m = n - 1;
            m >= 0;
            --m
          ) {
            var F = r[m],
              f = F.getAttribute("id");
            f && f.startsWith(d) && (h.push(F), r.splice(m, 1));
          }
          if ((h.length && t(h.reverse()), !(n = r.length))) break;
        }
      }
    }
    return (n && t(r), a);
  }
  _logicalFormsInPage(e, t) {
    let r = [];
    const n = document.querySelector("form form");
    let o = {},
      i = n ? document.forms : queryAllBySelector(document, "form");
    const l = 400,
      a = (e) => (e.length <= l ? e : Array.from(e).slice(0, l)),
      s = (e, t, r) => {
        let n = queryAllBySelector(e, t);
        return n.length <= l ? n : a(queryAllBySelector(e, r));
      };
    let u = 0,
      c = i.length,
      d = new Set();
    for (var h = 0; h < c; ++h) {
      let l = i[h],
        c = n
          ? a(l.elements)
          : s(
              l,
              "input, select, textarea, button, fieldset",
              "input, select, textarea, button[type='submit'], fieldset",
            );
      for (let e of c) d.add(e);
      if (c.length) {
        if ((u++, e && u >= e)) return r;
        if (t) {
          let e = [l.method, l.name, l.action, l.className].join("|"),
            r = o[e] || 0;
          if (r > t) continue;
          o[e] = r + 1;
        }
        this._formLooksLikeAspnetForm(l)
          ? (r = r.concat(this._logicalFormsForAspnetForm(l)))
          : r.push(new LogicalForm(c));
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
        ((r = r.concat(this._createLogicalFormsForControls(m))), (m = []));
      } else
        (this._isRenderedFormControl(t) || autocompleteTokens(t)) && m.push(t);
    }
    m.length && (r = r.concat(this._createLogicalFormsForControls(m)));
    let g = r.length;
    for (h = 0; h < g - 1; ++h) {
      let e = r[h],
        t = e.backingElement,
        n = t.getBoundingClientRect(),
        o = r[h + 1],
        i = o.backingElement,
        l = i.getBoundingClientRect();
      const a = 40;
      if (
        t.nextElementSibling === i &&
        t.action === i.action &&
        n.height &&
        l.height &&
        n.x === l.x &&
        n.width === l.width &&
        n.bottom + a >= l.top
      ) {
        let t = e.elements,
          n =
            1 ===
            t.filter(function (e) {
              return e.isVisible();
            }).length,
          i = t.includes(function (e) {
            return e.matches("input[type=submit], button") && e.isVisible();
          });
        if (n && !i) {
          let e = t.concat(o.elements),
            n = this._createLogicalFormsForControls(
              e,
              ForceNonFormElementAsLogicalBackingElement.Yes,
              LogicalFormCreationIsProvisional.Yes,
            );
          if (1 === n.length) {
            let e = n[0];
            (e.markElementsAsPartOfLogicalForm(), r.splice(h, 2, e), g--);
          }
        }
      }
    }
    return r;
  }
  _matchPatternAgainstElement(e, t, r) {
    function n(e, t) {
      if (!e) return null;
      var n = r[t],
        o = sharedPrefixLength(n, e[t]);
      return o ? n.substr(o) : null;
    }
    function o(e, t) {
      if (!t) return null;
      const r = t.text;
      if (/^-.+-$/.test(r)) return r;
      if (!t.value.length && r.length) {
        const n = e.options,
          o = n.length;
        let i = !0;
        for (let e = 0; e < o; ++e) {
          const r = n[e];
          if (r !== t && !r.value.length) {
            i = !1;
            break;
          }
        }
        if (i) return r;
      }
      return null;
    }
    this._logicalFormsCache.logicalFormForControl(r);
    var i = r._weakPreviousControlInLogicalForm?.deref(),
      l = r._weakNextControlInLogicalForm?.deref();
    const a = ["name", "id"],
      s = a.length;
    for (var u = new Array(s), c = new Array(s), d = 0; d < s; ++d) {
      var h = a[d];
      ((u[d] = n(i, h)), (c[d] = n(l, h)));
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
        !(f = this._matchPatternAgainstString(g, r[a[d]]));
        ++d
      );
      const n = isSelectElement(r);
      if (!f && n) {
        const e = n ? defaultOptionForSelectElement(r) : null,
          t = n ? r.options[0] : null;
        let i = o(r, e);
        (i || e === t || (i = o(r, t)),
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
  }
  _labelsForElement(e) {
    if (e._cachedLabels) return e._cachedLabels;
    e._cachedLabels = [];
    let t = e.getAttribute("aria-labelledby");
    if (t && t.length) {
      let n = t.split(" ");
      for (var r = 0; r < n.length; r++) {
        let t = getElementByID(n[r]);
        t && e._cachedLabels.push(t);
      }
    }
    if (e._cachedLabels.length) return e._cachedLabels;
    let n = function (e) {
      return e.replace(/[^a-zA-Z0-9]+/g, "");
    };
    for (let t of [e.getAttribute("id"), e.getAttribute("name")]) {
      if (!t || !t.length) continue;
      let r = [],
        o = e.form;
      for (let i of this._labels) {
        if (o === i.closest("form")) {
          let o = i.getAttribute("for");
          if (o === t) e._cachedLabels.push(i);
          else if (o) {
            let e = n(o);
            e.length > 0 && e === n(t) && r.push(i);
          }
        }
      }
      if (
        (0 === e._cachedLabels.length &&
          1 === r.length &&
          (e._cachedLabels = r),
        e._cachedLabels.length)
      )
        return e._cachedLabels;
    }
    let o = this._logicalFormsCache.logicalFormForControl(e)?.formElement;
    for (
      let t = e.parentElementIncludingShadowDOMHost();
      t && t !== o;
      t = t.parentElementIncludingShadowDOMHost()
    )
      if (this._isLabelElement(t)) {
        e._cachedLabels.push(t);
        break;
      }
    return e._cachedLabels;
  }
  _matchesForElement(e, t, r = !1) {
    function n(e, r) {
      for (var n = 0; n < l; ++n) {
        var o = t[n].searchReverse(e);
        if (
          o &&
          (i.push({
            FoundByPageScan: !1,
            Match: o[0].toLowerCase(),
            Property: o[1],
            Category: o[2],
            ParentProperty: o[3],
            Priority: n,
          }),
          r === ShouldStopAfterFirstMatch.StopAfterFirstMatch)
        )
          return;
      }
    }
    function o(e, t) {
      return e &&
        e.Match.length &&
        (!t ||
          (!e.IsInCellAbove && t.IsInCellAbove) ||
          (e.IsInCellAbove == t.IsInCellAbove && e.Distance < t.Distance))
        ? {
            FoundByPageScan: !0,
            Match: y.Match.toLowerCase(),
            Property: y.Property,
            Category: y.Category,
            ParentProperty: y.ParentProperty,
            Priority: w,
          }
        : t;
    }
    var i = [],
      l = t.length;
    this._matchPatternAgainstElement(i, t, e);
    for (var a = !1, s = this._labelsForElement(e), u = 0; u < s.length; ++u) {
      var c = s[u].innerText;
      c && ((a = !0), n(c, ShouldStopAfterFirstMatch.StopAfterFirstMatch));
    }
    let d = placeholderInfoForElement(e);
    d &&
      !d.AttributeMatchedWasValue &&
      n(d.Text, ShouldStopAfterFirstMatch.StopAfterFirstMatch);
    var h = e.getAttribute("title");
    h && n(h, ShouldStopAfterFirstMatch.StopAfterFirstMatch);
    var m =
      this._labelForElementIfElementAndLabelAreOnlyElementsOfTheirKindAmongSiblingElements(
        e,
      );
    m?.innerText.length &&
      ((a = !0), n(m.innerText, ShouldStopAfterFirstMatch.CollectAllMatches));
    let F = this._ariaLabelForElementOrParentOfElement(e);
    F && n(F, ShouldStopAfterFirstMatch.StopAfterFirstMatch);
    var f = e.getAttribute("formcontrolname");
    f && f.length && n(f, ShouldStopAfterFirstMatch.StopAfterFirstMatch);
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
    if (!0 === r) return i;
    for (var y, b = null, A = null, w = 0; w < l; ++w)
      ((b = o((y = this._matchFromPageScanBeforeElement(t[w], e)), b)),
        (g && g.forwardScanIsFutile) ||
          (A = o((y = this._matchFromPageScanAfterElement(t[w], e)), A)));
    var E = !1;
    if ((b && (i.push(b), (E = !0)), A))
      for (var _ = 0, T = i.length; _ < T; ++_) {
        var S = i[_];
        if (A.Priority === S.Priority) {
          (i.push(A), (E = !0));
          break;
        }
      }
    return (
      C && g.reportPageScanUsedSuccessfully(E),
      i.length &&
        d &&
        d.AttributeMatchedWasValue &&
        n(d.Text, ShouldStopAfterFirstMatch.StopAfterFirstMatch),
      i
    );
  }
  _bestMatchFromMatches(e, t, r) {
    function n(e, t) {
      for (var r = e.length, n = {}, o = 0; o < r; ++o) {
        var i,
          l = e[o];
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
        n[i]
          ? (n[i].Frequency += 1)
          : (n[i] = { Frequency: 1, FirstMatchObject: l });
      }
      var a = [];
      for (var s in n) a.push(n[s]);
      var u = a.sort(function (e, t) {
          return t.Frequency - e.Frequency;
        }),
        c = u.length;
      if (c <= 1) return null;
      if (t === MatchCriteria.Property)
        for (o = 0; o < c; ++o) {
          if (u[o].FirstMatchObject.ParentProperty in n)
            return u[o].FirstMatchObject;
        }
      return u[0].Frequency > u[1].Frequency ? u[0].FirstMatchObject : void 0;
    }
    var o = e.length;
    if (0 === o) return null;
    if (1 === o) return e[0];
    var i = n(e, MatchCriteria.Property);
    return (
      i ||
      ((i = n(e, MatchCriteria.Category))
        ? i
        : e.sort(function (e, t) {
            return e.Priority - t.Priority;
          })[0])
    );
  }
  _bestMatchForElement(e, t, r = !1) {
    if (!e) return null;
    var n = this._matchesForElement(e, t, r);
    return this._bestMatchFromMatches(n, e, t);
  }
  _labelForElementIfElementAndLabelAreOnlyElementsOfTheirKindAmongSiblingElements(
    e,
  ) {
    for (
      var t = null,
        r = e.tagName,
        n = siblingsIncludingSelfForElement(e),
        o = n.length,
        i = 0;
      i < o;
      ++i
    ) {
      var l = n[i];
      if (e !== l) {
        if (r === l.tagName) return null;
        if (this._isLabelElement(l)) {
          if (t) return null;
          t = l;
        }
      }
    }
    return t;
  }
  _ariaLabelForElementOrParentOfElement(e) {
    var t = e;
    let r = 3;
    for (var n = 0; n < r && t; ++n) {
      let e = t.getAttribute("aria-label");
      if (e && !t.isHiddenFromAccessibilityTree()) return e;
      t = t.parentElementIncludingShadowDOMHost();
    }
    return null;
  }
  _cachedOneTimeCodePatternMatcher() {
    return this._cachedPatternMatchers(
      "oneTimeCodeFieldLabelPatternMatchers",
    )[0];
  }
  _cachedLoginFormTypePatternMatcher() {
    return this._cachedPatternMatchers("loginFormTypePatternMatchers")[0];
  }
  _cachedFederatedSignInAffordancePatternMatcher() {
    return this._cachedPatternMatchers(
      "federatedSignInAffordancePatternMatchers",
    )[0];
  }
  _cachedPatternMatchers(e) {
    let t = "_" + e,
      r = this[t];
    return (r || ((this[t] = FormMetadataJSController[e]), (r = this[t])), r);
  }
  _cachedElementPatternMatch(e, t, r) {
    var n = t + "_wasVisible",
      o = e[n];
    if (!0 === o) return e[t];
    var i = e.isVisible();
    if (o === i) return e[t];
    e[n] = i;
    let l = this._cachedPatternMatchers(r);
    return ((e[t] = this._bestMatchForElement(e, l)), e[t]);
  }
  _isLabeledUsernameField(e) {
    return (
      !!this._isAutoFillableTextField(e) &&
      null !==
        this._cachedElementPatternMatch(
          e,
          "_usernameFieldPatternMatch",
          "usernameFieldLabelPatternMatchers",
        )
    );
  }
  _isLabeledLoginField(e) {
    return (
      !!this._isAutoFillableTextField(e) &&
      null !==
        this._cachedElementPatternMatch(
          e,
          "_loginFieldPatternMatch",
          "loginFormTypePatternMatchers",
        )
    );
  }
  _isLabeledSignUpField(e) {
    return (
      !!this._isAutoFillableTextField(e) &&
      null !==
        this._cachedElementPatternMatch(
          e,
          "_signUpFieldPatternMatch",
          "newAccountFormTypePatternMatchers",
        )
    );
  }
  _isLabeledEmailField(e) {
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
  }
  _addressBookLabelForElement(e) {
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
  }
  _elementDisallowsAutocomplete(e) {
    var t = e.getAttribute("autocomplete");
    return t && "off" === t.toLowerCase();
  }
  _isTextArea(e) {
    return e instanceof HTMLTextAreaElement;
  }
  _isLabelElement(e) {
    return e instanceof HTMLLabelElement;
  }
  _isRenderedFormControl(e) {
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
        (!!this._isElementAHiddenUsername(e) || !e.type || "hidden" !== e.type))
    );
  }
  _isEditablePlainTextField(e) {
    return (
      !!isInputElement(e) &&
      !e.disabled &&
      !e.readOnly &&
      (!e.type || "text" === e.type)
    );
  }
  _isTextField(e) {
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
    var r = e.type;
    return !r || r in t;
  }
  _isAutofocusedTextField(e) {
    return !!this._isTextField(e) && !0 === e.autofocus;
  }
  _isAutoFilledTextField(e) {
    return !!this._isTextField(e) && e.matches(":-webkit-autofill");
  }
  _isSecureTextField(e) {
    if (!isInputElement(e)) return !1;
    if (e._wasPreviouslySecureTextField) return !0;
    try {
      if (e.matches(":-webkit-autofill-strong-password"))
        return ((e._wasPreviouslySecureTextField = !0), !0);
    } catch (e) {}
    const t = getComputedStyle(e, null).getPropertyValue(
        "-webkit-text-security",
      ),
      r = e.type;
    if ("none" !== t || "password" === r)
      return ((e._wasPreviouslySecureTextField = !0), !0);
    if (r && "text" !== r) return !1;
    if (userIsOnDomain("ninehours.co.jp")) {
      let t = e.name;
      if ("guestPassword" === t || "guestPasswordConfirm" === t) return !0;
    }
    const n = e._weakNextControlInLogicalForm?.deref();
    return (
      !(!n || !this._looksLikeShowHidePasswordButton(n)) &&
      !!this._matchesPasswordFieldLabelPattern(e) &&
      !this._isLabeledUsernameField(e) &&
      ((e._wasPreviouslySecureTextField = !0), !0)
    );
  }
  _isVerticalWritingMode(e) {
    const t = getComputedStyle(e).writingMode;
    return !("horizontal-tb" === t || "horizontal-bt" === t);
  }
  _looksLikePasswordCredentialField(e, t) {
    if (!this._isSecureTextField(e)) return !1;
    var r = e.getAttribute("maxlength");
    return (
      !(
        r && parseInt(r) < MinValueForMaxLengthAttributeToTreatAsPasswordField
      ) &&
      null ===
        this._cachedElementPatternMatch(
          e,
          "_nonAccountPasswordSecureTextEntryFieldPatternMatch",
          "nonAccountPasswordSecureTextEntryFieldLabelPatternMatchers",
        )
    );
  }
  _looksLikeShowHidePasswordButton(e) {
    return (
      !(!this._isCustomFormButton(e) && !this._isCheckboxInputElement(e)) &&
      !!this._cachedElementPatternMatch(
        e,
        "_showHideButtonPatternMatch",
        "showHideButtonLabelPatternMatchers",
      )
    );
  }
  _isAutoFillable(e) {
    return !e.disabled && !e.readOnly;
  }
  _isAutoFillableSelectElement(e) {
    return this._isAutoFillable(e) && isSelectElement(e);
  }
  _isAutoFillableTextAreaElement(e) {
    return this._isAutoFillable(e) && this._isTextArea(e);
  }
  _isAutoFillableTextField(e) {
    return this._isAutoFillable(e) && this._isTextField(e);
  }
  _looksLikeCreditCardNumberField(e, t) {
    if (!this._isAutoFillableTextField(e)) return !1;
    let r = e.pattern;
    if (r) {
      let e = regularExpressionFromUntrustedPatternAttributeString(r);
      if (e && (e.test("a") || e.test("A"))) return !1;
    }
    if (
      this._cachedElementPatternMatch(
        e,
        "_nonCreditCardNumberPatternMatch",
        "nonCreditCardCardNumberFieldLabelPatternMatchers",
      )
    )
      return !1;
    if (
      this._matchesCreditCardCompositeExpirationDateFieldLabelPatternMatchers(e)
    )
      return !1;
    if (elementIDOrAutocompleteTokensHasToken(e, t, "cc-number")) return !0;
    const n = e.placeholder;
    let o = new RegExp("[0-9]{4}[ -][0-9]{4}[ -][0-9]{4}[ -][0-9]{4}");
    if (n && o.test(n)) return !0;
    let i = e.getAttribute("data-val-regex-pattern");
    if (i) {
      let e = regularExpressionFromUntrustedPatternAttributeString(i);
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
  }
  _looksLikeCreditCardSecurityCodeField(e, t) {
    if (!this._isAutoFillableTextField(e)) return !1;
    if (elementIDOrAutocompleteTokensHasToken(e, t, "cc-csc")) return !0;
    let r = e.getAttribute("pattern");
    if (r) {
      let e = regularExpressionFromUntrustedPatternAttributeString(r);
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
  }
  _looksLikeCreditCardCardholderField(e, t) {
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
  }
  _looksLikeCreditCardCompositeExpirationDateField(e, t) {
    return (
      !(!this._isAutoFillableTextField(e) || this._isSecureTextField(e)) &&
      (!!elementIDOrAutocompleteTokensHasToken(e, t, "cc-exp") ||
        this._matchesCreditCardCompositeExpirationDateFieldLabelPatternMatchers(
          e,
        ))
    );
  }
  _matchesCreditCardCompositeExpirationDateFieldLabelPatternMatchers(e) {
    return (
      null !==
      this._cachedElementPatternMatch(
        e,
        "_creditCardCompositeExpirationDateFieldPatternMatch",
        "creditCardCompositeExpirationDateFieldLabelPatternMatchers",
      )
    );
  }
  _looksLikeCreditCardTypeField(e, t) {
    return (
      !(!isSelectElement(e) && !isRadioButtonElement(e)) &&
      (!!elementIDOrAutocompleteTokensHasToken(e, t, "cc-type") ||
        null !==
          this._cachedElementPatternMatch(
            e,
            "_creditCardTypePatternMatch",
            "creditCardTypeFieldLabelPatternMatchers",
          ))
    );
  }
  _looksLikeEIDField(e, t) {
    return !!elementIDOrAutocompleteTokensHasToken(e, t, "device-eid");
  }
  _looksLikeIMEIField(e, t) {
    return !!elementIDOrAutocompleteTokensHasToken(e, t, "device-imei");
  }
  _looksLikeDayField(e) {
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
  }
  _looksLikeMonthField(e, t) {
    if (
      !this._isAutoFillableTextField(e) &&
      !this._isAutoFillableSelectElement(e)
    )
      return !1;
    if (elementIDOrAutocompleteTokensHasToken(e, t, "cc-exp-month")) return !0;
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
    var r = e.options.length;
    if (12 === r || 13 === r)
      for (
        var n = [
            selectElementOptionsSequenceAnalysis(e, "text"),
            selectElementOptionsSequenceAnalysis(e, "value"),
          ],
          o = n.length,
          i = 0;
        i < o;
        i++
      ) {
        var l = n[i],
          a = l.lengthOfLongestSequence,
          s = l.lastNumberInSequence;
        if (a >= 11 && 12 === s) return !0;
      }
    return !1;
  }
  _looksLikeYearField(e, t) {
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
    var r = selectElementOptionsSequenceAnalysis(e, "text"),
      n = r.lengthOfLongestSequence,
      o = r.lastNumberInSequence;
    const i = 3;
    return n >= e.options.length - i && 1e3 < o && o < 3e3;
  }
  _looksLikeOneTimeCodeField(e, t, r, n, o, i, l) {
    if (
      !this._isAutoFillableTextField(e) &&
      !this._isAutoFillableSelectElement(e)
    )
      return !1;
    if (elementIDOrAutocompleteTokensHasToken(e, t, "one-time-code")) return !0;
    const a = e.type;
    if ("password" === a) {
      if (/^(.+\.)?chase\.com\.?$/.test(document.location.hostname)) return !1;
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
    const s = e.getAttribute("maxlength"),
      u = s ? parseInt(s) : void 0;
    if (
      isFiniteNumber(u) &&
      u >
        MaxLengthForFieldAboveWhichToTreatPotentialOneTimeCodeFieldAsRequiringHigherScrutiny
    ) {
      if (!i) return !1;
      if (
        l.ControlLooksLikeIgnoredDataTypeField ||
        l.ControlLooksLikeCreditCardCardholderField ||
        l.ControlLooksLikeCreditCardNumberField ||
        l.ControlLooksLikeCreditCardSecurityCodeField ||
        l.ControlLooksLikeCreditCardTypeField ||
        l.AddressBookLabel
      )
        return !1;
    }
    let c = e.pattern;
    if (c) {
      let e = regularExpressionFromUntrustedPatternAttributeString(c);
      if (
        e &&
        (e.test("1234") || e.test("123456") || e.test("12345678")) &&
        !e.test("a") &&
        !e.test("A")
      )
        return !0;
    }
    const d = "number" === a || "tel" === a;
    if (1 === u) {
      if (d || r || n) return !0;
      const t = this._cachedOneTimeCodePatternMatcher(),
        o = e.closest("fieldset"),
        i = o?.querySelector("legend");
      if (i) {
        if (
          e === (o ? Array.from(queryAllBySelector(o, "input")) : [])[0] &&
          this._matchPatternAgainstString(t, i.innerText)
        )
          return !0;
      }
      for (let t of [o, e.parentElement, e.closest('*[role~="dialog"]')]) {
        if (!t) continue;
        const r = Array.from(queryAllBySelector(t, "input")),
          n = r.length;
        if (n >= 5 && n <= 8) {
          if (e === r[0] && r.every((e) => 1 === parseInt(e.maxLength)))
            return !0;
        }
      }
    }
    const h =
      null !==
      this._cachedElementPatternMatch(
        e,
        "_weakOneTimeCodePatternMatch",
        "weakOneTimeCodeFieldLabelPatternMatchers",
      );
    if (d && h) return !0;
    const m = e.placeholder;
    if (m && h && /^[#]+$/.test(m.replace(/ /g, ""))) return !0;
    const F = (function () {
      if (isFiniteNumber(u)) return u;
      const e = m?.length;
      return e && e < 10 && m === m[0].repeat(e) ? e : void 0;
    })();
    if ((4 === F || 6 === F) && h) return !0;
    if (7 === u && m && /\d{3} \d{3}/.test(m)) return !0;
    if (this._isAutofocusedTextField(e)) {
      if (h) return !0;
      if ("0" === e.min && "9" === e.max) return !0;
    }
    if (i) {
      if (h) {
        if (
          !(
            null !==
            this._cachedElementPatternMatch(
              e,
              "_codeButNotOneTimeCodeFieldLabelsPatternMatch",
              "codeButNotOneTimeCodeFieldLabelsPatternMatchers",
            )
          ) &&
          !this._matchSearchFieldLabelPattern(e)
        ) {
          let t = !0;
          for (
            let r = e.traversePreviousElement();
            r;
            r = r.traversePreviousElement()
          )
            if (isInputElement(r) && r.isVisible()) {
              t = !1;
              break;
            }
          if (t) return !0;
        }
      }
      let t = 0;
      (h && t++, r && t++, n && t++, o && t++, (4 !== F && 6 !== F) || t++);
      const i = this._cachedOneTimeCodePatternMatcher(),
        l = this._logicalFormsCache.logicalFormForControl(e);
      if (l) {
        const e = l.backingElement;
        if (e) {
          let r = !1;
          for (let n of Array.from(
            querySelectorAllIncludingWithinShadowRoots(e, "h1, h2, h3"),
          )) {
            let e = n.innerText.trim();
            if (e.length) {
              this._matchPatternAgainstString(i, e) && ((r = !0), t++);
              break;
            }
          }
          if (!r) {
            const r = e.closest("section")?.querySelector("h1, h2, h3");
            r && this._matchPatternAgainstString(i, r.innerText) && t++;
          }
          this._matchPatternAgainstString(i, e.getAttribute("id")) && t++;
        }
      }
      const a = e.dataset.valRequired;
      if (
        ("string" == typeof a && this._matchPatternAgainstString(i, a) && t++,
        t >= 2)
      )
        return !0;
      const s = function (e) {
          if (this._matchPatternAgainstString(i, e)) return !0;
          const t = e.replaceAll("-", " ");
          return e !== t && this._matchPatternAgainstString(i, t);
        }.bind(this),
        u = window.location.protocol,
        c = "http:" === u || "https:" === u,
        d = lastPathComponentFromAnchor(window.location);
      if (c && d && s(d)) return !0;
      {
        const e = document.querySelector("link[rel=canonical]"),
          t = e ? lastPathComponentForURLString(e.href) : null;
        if (t && s(t)) return !0;
      }
      if (this._matchFromPageScanBeforeElement(i, e, document.body)) return !0;
    }
    return !1;
  }
  _looksLikeIgnoredDataTypeField(e, t) {
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
  }
  _collectTextSample(e) {
    if (!e) return "";
    var t,
      r = "",
      n = e;
    do {
      ((t = (r = n.innerText.replace(/\s+/g, " ").trim()).length),
        (n = n.parentElementIncludingShadowDOMHost()));
    } while (
      t < MaximumNumberOfCharactersToCollectForLanguageIdentification &&
      n
    );
    return (
      t > MaximumNumberOfCharactersToCollectForLanguageIdentification &&
        (r = r.substr(
          0,
          MaximumNumberOfCharactersToCollectForLanguageIdentification,
        )),
      r
    );
  }
  _explicitMaxLength(e) {
    var t = e.getAttribute("maxlength");
    return t ? parseInt(t) : void 0;
  }
  _explicitMinLength(e) {
    let t = e.getAttribute("minlength");
    return t ? parseInt(t) : void 0;
  }
  _heuristicallyDeterminedMaxLength(e) {
    const t = 20;
    if ("password" !== e.type) return null;
    const r = e.getAttribute("data-ng-maxlength");
    if (r) {
      const e = parseInt(r, 10);
      if (isFiniteNumber(e)) return e;
    }
    const n = e.getAttribute("ng-pattern");
    if (!n) return null;
    if (!n.startsWith("/") || !n.endsWith("/")) return null;
    let o = regularExpressionFromUntrustedPatternAttributeString(n);
    if (!o) return null;
    let i,
      l = "a1Abbb",
      a = !1;
    for (; l.length <= t; ) {
      let e = o.test(l);
      if (a && !e) return i;
      (e && ((a = !0), (i = l.length)), (l += "b"));
    }
    return null;
  }
  _collectControlMetadata(e, t, r, n, o, i, l, a) {
    var s = {
      ControlTagName: this._getTagName(e),
      ControlFieldName: this._getNameOrId(e),
      ControlUniqueID: this.controlUniqueID(e),
    };
    (e === innermostActiveElement() && (s.ControlIsActiveElement = !0),
      this._isAutoFilledTextField(e) && (s.ControlIsAutoFilledTextField = !0),
      e.disabled && (s.ControlIsDisabled = !0),
      e.readOnly && (s.ControlIsReadOnly = !0),
      this._isTextField(e) && (s.ControlIsTextField = !0),
      this._isSecureTextField(e) && (s.ControlIsSecureTextField = !0),
      this._isLabeledUsernameField(e) && (s.ControlIsLabeledUsernameField = !0),
      this._elementDisallowsAutocomplete(e) && (s.DisallowsAutocomplete = !0),
      this._isAutofocusedTextField(e) && (s.ControlIsAutofocusedTextField = !0),
      (s.ControlAutoFillButtonType = e.autofillButtonType),
      (s.ControlLastAutoFillButtonType = e._lastAutofillButtonType));
    const u = e.className;
    u && u.length && (s.ControlFieldClass = u);
    const c = e.id;
    c && c.length && (s.ControlFieldID = c);
    const d = e.value;
    d && (s.ControlValue = d);
    const h = this._associatedUsernameForControl(e);
    h && (s.ControlAssociatedUsername = h);
    const m = e.maxLength;
    if (-1 !== m) s.ControlMaxLength = m;
    else {
      const t = this._heuristicallyDeterminedMaxLength(e);
      t && (s.ControlMaxLength = t);
    }
    const F = this._explicitMinLength(e);
    F && F > 0 && (s.ControlMinLength = F);
    const f = e.size;
    (f > 0 && (s.ControlSize = f),
      e.isVisible() && (s.IsVisible = !0),
      isDateTimeInputElement(e) &&
        (s.ControlRequiredFormatForDateTimeInput =
          this._requiredFormatForDateTimeInput[e.type]));
    var g = autocompleteTokens(e);
    (g &&
      ((s.AutocompleteTokens = g),
      -1 !== g.indexOf("username")
        ? (s.ControlClaimsToBeUsernameViaAutocompleteAttribute = !0)
        : -1 !== g.indexOf("current-password")
          ? (s.ControlClaimsToBeCurrentPasswordViaAutocompleteAttribute = !0)
          : -1 !== g.indexOf("new-password") &&
            (s.ControlClaimsToBeNewPasswordViaAutocompleteAttribute = !0)),
      this._looksLikePasswordCredentialField(e) &&
        ((s.ControlLooksLikePasswordCredentialField = !0),
        this._collectExtraControlMetadata(e, s),
        s.IsVisible &&
          !r &&
          (s.IsVisible = !isElementPositionedToBeEffectivelyInvisible(e))));
    let p = t === WBSFormMetadataRequestPreFill,
      C = s.ControlIsActiveElement || !p;
    if (C) {
      const t = this._collectSelectElementInfo(e);
      (t && (s.SelectElementInfo = t),
        this._isVerticalWritingMode(e) &&
          (s.ControlIsVerticalWritingMode = !0));
      var y = placeholderInfoForElement(e);
      y && !y.AttributeMatchedWasValue && (s.ControlPlaceholder = y.Text);
      var b = e.getAttribute("type");
      b && (s.ControlType = b);
    }
    if (
      (this._looksLikeIgnoredDataTypeField(e, g)
        ? (s.ControlLooksLikeIgnoredDataTypeField = !0)
        : this._looksLikeCreditCardCardholderField(e, g)
          ? (s.ControlLooksLikeCreditCardCardholderField = !0)
          : this._looksLikeCreditCardNumberField(e, g)
            ? (s.ControlLooksLikeCreditCardNumberField = !0)
            : this._looksLikeCreditCardSecurityCodeField(e, g)
              ? (s.ControlLooksLikeCreditCardSecurityCodeField = !0)
              : this._looksLikeCreditCardTypeField(e, g) &&
                (s.ControlLooksLikeCreditCardTypeField = !0),
      C &&
        (this._looksLikeMonthField(e, g)
          ? (s.ControlLooksLikeMonthField = !0)
          : this._looksLikeYearField(e, g)
            ? (s.ControlLooksLikeYearField = !0)
            : this._looksLikeDayField(e)
              ? (s.ControlLooksLikeDayField = !0)
              : !s.ControlLooksLikeCreditCardSecurityCodeField &&
                this._looksLikeCreditCardCompositeExpirationDateField(e, g) &&
                (s.ControlLooksLikeCreditCardCompositeExpirationDateField =
                  !0)),
      p ||
        (this._looksLikeEIDField(e, g)
          ? (s.ControlLooksLikeEIDField = !0)
          : this._looksLikeIMEIField(e, g) &&
            (s.ControlLooksLikeIMEIField = !0)),
      p ||
        s.ControlLooksLikeIgnoredDataTypeField ||
        s.ControlIsSecureTextField ||
        s.ControlLooksLikeCreditCardNumberField ||
        s.ControlLooksLikeCreditCardSecurityCodeField ||
        s.ControlLooksLikeCreditCardTypeField ||
        s.ControlLooksLikeCreditCardCompositeExpirationDateField ||
        s.ControlLooksLikeEIDField ||
        s.ControlLooksLikeIMEIField ||
        (s.AddressBookLabel = this._addressBookLabelForElement(e)),
      s.ControlIsActiveElement || t === WBSFormMetadataRequestTesting || a)
    ) {
      let t = l && s.IsVisible;
      this._looksLikeOneTimeCodeField(e, g, n, o, i, t, s) &&
        (s.ControlLooksLikeOneTimeCodeField = !0);
    }
    return (
      t === WBSFormMetadataRequestTesting &&
        globalThis.WAS &&
        (s.ControlNodePath = WAS.NodePath.fromNode(e)?.objectRepresentation),
      s
    );
  }
  _usesGeneratedPassword(e) {
    for (
      var t = !1, r = this._elementsWithGeneratedPasswords.length, n = 0;
      n < r;
      ++n
    ) {
      var o = this._elementsWithGeneratedPasswords[n];
      if (e.containsControl(o)) {
        if (o.value !== this._generatedPasswords[n]) return !1;
        t = !0;
      }
    }
    return t;
  }
  _associatedUsernameForControl(e) {
    return this._isAutoFillableTextField(e)
      ? e.getAttribute("data-username")
      : null;
  }
  _collectSelectElementInfo(e) {
    if (!this._isAutoFillableSelectElement(e)) return null;
    if (!e.options.length) return null;
    for (var t = [], r = e.options, n = r.length, o = 0; o < n; ++o) {
      var i = r[o];
      i.disabled ||
        ((i.label || i.text) && t.push([o, i.label ? i.label : i.text]));
    }
    return t.length ? t : null;
  }
  _stringsToInspectForDeterminingFormType(e) {
    let t = [],
      r = e.formElement,
      n = r.getAttribute("id"),
      o = r.getAttribute("name");
    (n && t.push(n), o && t.push(o));
    let i = queryAllBySelector(r, "legend");
    1 === i.length && t.push(i[0].innerText);
    const l = 0.8;
    if (
      1 === this._logicalFormsCache.numberOfVisibleFormsWithVisibleElements &&
      r.isVisible() &&
      !r.ownerDocument.defaultView.frameElement &&
      r.getBoundingClientRect().top < l * document.documentElement.clientHeight
    ) {
      let e = documentTitleWithoutHostNamePrefix();
      e && t.push(e);
      const r = lastPathComponentFromAnchor(window.location);
      r && r.length && t.push(r);
    }
    let a = [];
    if (r.isVisible()) {
      const e = function (e, t) {
        return (
          (t.left <= e.left &&
            e.right <= t.right &&
            e.distanceToRect(t) < 100) ||
          (e.left - t.left == t.right - e.right && e.distanceToRect(t) < 200)
        );
      };
      let n = r.getBoundingClientRect(),
        o = !1,
        i = new Set();
      for (
        let l = 0, a = r;
        l <= 2 && a;
        ++l, a = a.parentElementIncludingShadowDOMHost()
      ) {
        let r = Array.prototype.slice.call(
            queryAllBySelector(
              a,
              "h1, h2, h3, [class*='header' i], [class*='heading' i]",
            ),
          ),
          l = [[], [], [], []];
        for (const e of r) {
          let t = e.tagName;
          "H1" === t
            ? l[0].push(e)
            : "H2" === t
              ? l[1].push(e)
              : "H3" === t
                ? l[2].push(e)
                : l[3].push(e);
        }
        let s = !0;
        for (const r of l) {
          let l = r.length;
          if (0 === l) {
            s = !1;
            continue;
          }
          if (l > 1) break;
          let a = r[0];
          if (!a.isVisible()) break;
          e(a.getBoundingClientRect(), n) &&
            (i.add(a), t.push(a.innerText), (o = !0));
          break;
        }
        if (s) break;
      }
      const l = 100;
      for (
        let a = r.traversePreviousElement(), s = 0;
        a && s < l;
        a = a.traversePreviousElement(), s++
      )
        if (!i.has(a) && a.matches("h1, h2, h3")) {
          const r = a.previousElementSibling;
          if (r && r.matches("h1, h2, h3")) break;
          e(a.getBoundingClientRect(), n) && (t.push(a.innerText), (o = !0));
          break;
        }
      if (!o) {
        let r = queryAllBySelector(document.documentElement, "h1");
        if (1 === r.length) {
          let o = r[0];
          e(o.getBoundingClientRect(), n) && t.push(o.innerText);
        }
      }
      for (
        let e = 0, t = r;
        e <= 2 && t;
        ++e, t = t.parentElementIncludingShadowDOMHost()
      ) {
        let e = Array.prototype.slice
          .call(
            queryAllBySelector(
              t,
              'button, input[type=submit], a[class~="button"]',
            ),
          )
          .filter(function (e) {
            if (!e.isVisible()) return !1;
            let t = e.getBoundingClientRect();
            return (
              t.top > n.bottom &&
              !r.contains(e) &&
              n.left <= t.left &&
              t.right <= n.right &&
              t.distanceToRect(n) < 100
            );
          });
        if (e.length) {
          a = e;
          break;
        }
      }
    }
    let s = !1,
      u = [],
      c = this._elementsActingAsButtonsInForm(r),
      d = [...new Set(e.elements.concat(a, c))];
    for (const e of d) {
      if (!e.matches("a")) {
        const t = e.type;
        if (("password" === t && (s = !0), "submit" !== t && "button" !== t))
          continue;
      }
      s &&
        (e.isVisible()
          ? this._addInterestingStringsForButton(e, t)
          : u.push(e));
    }
    if (0 === t.length)
      for (const e of u) this._addInterestingStringsForButton(e, t);
    return t;
  }
  _addInterestingStringsForButton(e, t) {
    const r = e.getAttribute("id");
    r && t.push(r);
    const n = e.getAttribute("value");
    n && t.push(n);
    const o = e.innerText;
    o && o.length > 0 && t.push(o);
  }
  _autoFillFormTypeOfTypesUsingKeywordMatching(e, t, r, n) {
    for (var o = t.length, i = [], l = 0; l < o; ++l) {
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
    for (l = 0; l < o; ++l) d.push(0);
    if (n)
      for (const [e, r] of Object.entries(n)) d[t.indexOf(parseInt(e))] += r;
    for (var h = s.length, m = 0; m < h; ++m) {
      for (var F = s[m].toLowerCase(), f = 0; f < c; ++f)
        if (u[f].test(F)) return WBSAutoFillFormTypeNonAutoFillable;
      for (l = 0; l < o; ++l) {
        a = i[l];
        for (var g in a) -1 !== F.indexOf(g) && (d[l] += a[g]);
      }
    }
    for (let r = 0; r < o; ++r) {
      const n = this._mapOfFormTypeToExtraScoreProducer[t[r]];
      d[r] += n(e);
    }
    for (l = 0; l < o; ++l) 0 !== d[l] && 0;
    var p = formActionAsAnchorElement(e.formElement, !0);
    if (p) {
      var C = p.pathname.toLowerCase() + p.search.toLowerCase();
      for (l = 0; l < o; ++l) {
        a = i[l];
        for (var g in a) -1 !== C.indexOf(g) && (d[l] += a[g]);
      }
    }
    var y = [],
      b = 0;
    for (l = 0; l < o; ++l) {
      var A = d[l];
      A > 0 && (A >= b ? ((b = A), y.unshift(l)) : y.push(l));
    }
    if (1 === y.length) return t[y[0]];
    if (y.length > 1) {
      var w = y[0];
      if (d[w] > d[y[1]]) return t[w];
    }
    return r;
  }
  _matchesNonUsernameFieldLabelPattern(e) {
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
  }
  _matchSearchFieldLabelPattern(e) {
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
  }
  _matchesNonEmailFieldLabelPattern(e) {
    return (
      this._nonEmailFieldPatternMatchers ||
        (this._nonEmailFieldPatternMatchers =
          FormMetadataJSController.nonEmailFieldLabelPatternMatchers),
      !!this._bestMatchForElement(e, this._nonEmailFieldPatternMatchers)
    );
  }
  _scoreForUsernameFieldCandidateFromLabelingAndPositionOfField(e, t, r) {
    return this._isLabeledUsernameField(e)
      ? t
        ? UsernameCandidateScoreForUsernameLabeledFieldBelowPasswordField
        : UsernameCandidateScoreForUsernameLabeledFieldAbovePasswordField
      : this._isLabeledEmailField(e) &&
          !this._matchesNonEmailFieldLabelPattern(e)
        ? t
          ? UsernameCandidateScoreForEmailLabeledFieldBelowPasswordField
          : UsernameCandidateScoreForEmailLabeledFieldAbovePasswordField
        : r
          ? UsernameCandidateScoreForPlainTextFieldDirectlyBeforePasswordField
          : UsernameCandidateScoreForPlainTextField;
  }
  _scoreForUsernameFieldCandidate(e, t, r) {
    var n = this._scoreForUsernameFieldCandidateFromLabelingAndPositionOfField(
      e,
      t,
      r,
    );
    return (
      e.isVisible() && (n += UsernameCandidateScoreBonusForVisibleElement),
      this._matchesNonUsernameFieldLabelPattern(e) &&
        (n -=
          UsernameCandidateScorePenaltyForMatchingNonUsernameFieldLabelPattern),
      this._matchSearchFieldLabelPattern(e) &&
        (n -= UsernameCandidateScorePenaltyForMatchingSearchFieldLabelPattern),
      e.readOnly && (n -= UsernameCandidateScorePenaltyForReadOnlyElement),
      e.id || e.name || (n -= UsernameCandidateScorePenaltyForAnonymousElement),
      n
    );
  }
  _matchesPasswordFieldLabelPattern(e) {
    return (
      this._passwordFieldPatternMatchers ||
        (this._passwordFieldPatternMatchers =
          FormMetadataJSController.passwordFieldLabelPatternMatchers),
      !!this._bestMatchForElement(e, this._passwordFieldPatternMatchers)
    );
  }
  _matchesConfirmPasswordFieldLabelPattern(e, t = !1) {
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
  }
  _matchesConfirmEmailFieldLabelPattern(e) {
    return (
      !!this._isLabeledEmailField(e) &&
      (this._confirmEmailFieldPatternMatchers ||
        (this._confirmEmailFieldPatternMatchers =
          FormMetadataJSController.confirmEmailFieldLabelPatternMatchers),
      !!this._bestMatchForElement(e, this._confirmEmailFieldPatternMatchers))
    );
  }
  _collectRadioButtonInfo(e, t) {
    function r(e, t) {
      var r = e.trim();
      r && t.push(r);
    }
    function n(e, t) {
      (r(e.alt, t), r(e.title, t), r(lastPathComponentForURLString(e.src), t));
    }
    function o(e) {
      let t = [];
      r(e.innerText, t);
      let o = queryAllBySelector(e, "img"),
        i = o.length;
      for (let e = 0; e < i; ++e) n(o[e], t);
      return t.length ? t : null;
    }
    for (
      var i = e.radioButtonsWithName(t), l = i.length, a = !1, s = {}, u = 0;
      u < l;
      ++u
    ) {
      s[(f = i[u]).value] = [f.value];
      for (var c = this._labelsForElement(f), d = c.length, h = 0; h < d; ++h) {
        a = !0;
        var m = o(c[h]);
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
        if ("td" === C || "tr" === C || "ul" === C || "ol" === C || "dl" === C)
          break;
        if (p instanceof HTMLImageElement) n(p, s[f.value]);
        else if (p.nodeType === Node.TEXT_NODE) {
          var y = p.nodeValue.trim();
          if ((y && (g += y.substr(0, F - g.length)), g.length >= F)) break;
        }
      }
      g && s[f.value].push(g);
    }
    return s;
  }
  _bestUsernameFieldCandidate(e, t, r) {
    var n = t.FormControls,
      o = n.filter(function (e) {
        return e.ControlClaimsToBeUsernameViaAutocompleteAttribute;
      });
    if (1 === o.length) return o[0];
    for (
      var i = 0, l = [], a = !1, s = n.indexOf(r), u = n.length, c = 0;
      c < u;
      ++c
    ) {
      var d = n[c];
      if (d === r) {
        a = !0;
        continue;
      }
      if (!d.ControlIsTextField || d.ControlIsSecureTextField) continue;
      if (t.IsVisible && !n[c].IsVisible && !d.ControlValue) continue;
      const o = 100;
      let F = e[c];
      if (!(F.value.length > o)) {
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
        return n[l[0]];
      default:
        var f = e[s].getBoundingClientRect(),
          g = {};
        return (
          l.forEach(function (t) {
            g[t] = f.distanceToRect(e[t].getBoundingClientRect());
          }),
          n[
            l.sort(function (e, t) {
              return g[e] - g[t];
            })[0]
          ]
        );
    }
  }
  _autoFillFormTypeFromCandidateFormTypes(e, t, r) {
    switch (t.length) {
      case 1:
        return t[0];
      case 2:
        return this._autoFillFormTypeOfTypesUsingKeywordMatching(
          e,
          [t[0], t[1]],
          r,
        );
      default:
        return WBSAutoFillFormTypeAutoFillableStandard;
    }
  }
  _shouldTrustElementThatClaimsToBeCurrentPasswordViaAutocompleteAttribute(e) {
    return !e.dataset.valRegexPattern;
  }
  _identifyFormTypeAndPasswordFieldIndicesFromAutocompleteAttributes(e, t) {
    const r = [null, null];
    if (/^(.+\.)?roll20\.net\.?$/.test(document.location.hostname)) return r;
    var n = t.length;
    if (n > 3) return r;
    for (var o = [], i = [], l = 0; l < n; ++l) {
      var a = t[l];
      a.ControlClaimsToBeCurrentPasswordViaAutocompleteAttribute &&
      this._shouldTrustElementThatClaimsToBeCurrentPasswordViaAutocompleteAttribute(
        e[l],
      )
        ? o.push(l)
        : a.ControlClaimsToBeNewPasswordViaAutocompleteAttribute && i.push(l);
    }
    var s = o.length,
      u = i.length;
    if (s + u !== n) return r;
    switch (n) {
      case 0:
        return r;
      case 1:
        if (s) return [null, null, WBSAutoFillFormTypeAutoFillableLogin];
        if (u) return [null, null, WBSAutoFillFormTypeNewAccount];
      case 2:
        if (1 === s && 1 === u)
          return [
            [WBSAutoFillFormTypeChangePassword],
            { OldPasswordFieldIndex: o[0], PasswordFieldIndex: i[0] },
          ];
        if (0 === s && 2 === u)
          return [
            [WBSAutoFillFormTypeNewAccount, WBSAutoFillFormTypeChangePassword],
            { PasswordFieldIndex: i[0], ConfirmationFieldIndex: i[1] },
          ];
        break;
      case 3:
        if (1 === s && 2 === u)
          return [
            [WBSAutoFillFormTypeChangePassword],
            {
              OldPasswordFieldIndex: o[0],
              PasswordFieldIndex: i[0],
              ConfirmationFieldIndex: i[1],
            },
          ];
    }
    return r;
  }
  _identifyPasswordFieldIndices(e, t) {
    var r = e.length;
    if (0 === r) return {};
    if (1 === r) return { PasswordFieldIndex: 0 };
    if (
      (this._oldPasswordPatternMatchers ||
        (this._oldPasswordPatternMatchers =
          FormMetadataJSController.oldPasswordFieldLabelPatternMatchers),
      2 === r)
    ) {
      return this._bestMatchForElement(t[0], this._oldPasswordPatternMatchers)
        ? { OldPasswordFieldIndex: 0, PasswordFieldIndex: 1 }
        : this._bestMatchForElement(t[1], this._oldPasswordPatternMatchers)
          ? { OldPasswordFieldIndex: 1, PasswordFieldIndex: 0 }
          : { PasswordFieldIndex: 0, ConfirmationFieldIndex: 1 };
    }
    return this._bestMatchForElement(t[r - 1], this._oldPasswordPatternMatchers)
      ? {
          PasswordFieldIndex: r - 3,
          ConfirmationFieldIndex: r - 2,
          OldPasswordFieldIndex: r - 1,
        }
      : {
          PasswordFieldIndex: r - 2,
          ConfirmationFieldIndex: r - 1,
          OldPasswordFieldIndex: r - 3,
        };
  }
  _removePlaceholderTextForFormMetadata(e, t) {
    for (var r = e.length, n = 0; n < r; ++n) {
      var o = t.FormControls[n];
      if (
        o.ControlValue &&
        o.ControlIsTextField &&
        !o.ControlIsSecureTextField &&
        !o.ControlIsReadOnly
      ) {
        var i = legacyPlaceholderInfoForInputElement(e[n]);
        i &&
          ((i.AttributeMatchedWasValue &&
            o.ControlUniqueID === t.UsernameElementUniqueID) ||
            (o.ControlValue = ""));
      }
    }
  }
  _isPasswordConfirmPair(e, t) {
    var r = this._matchesPasswordFieldLabelPattern(e),
      n = this._matchesConfirmPasswordFieldLabelPattern(t);
    return r && n;
  }
  _trailingArgumentsForCollectControlMetadataFunction(e, t, r) {
    let n = isElementPositionedToBeEffectivelyInvisible(e.backingElement),
      o = !1,
      i = !1,
      l = !1;
    if (innermostActiveElement() || t === WBSFormMetadataRequestTesting) {
      let e = documentTitleWithoutHostNamePrefix(),
        t = this._cachedOneTimeCodePatternMatcher();
      o = !!this._matchPatternAgainstString(t, e);
      let n = this._cachedLoginFormTypePatternMatcher();
      if (((i = !!this._matchPatternAgainstString(n, e)), r)) {
        let e = location.pathname.split("/"),
          n = stripCommonPrefix(r.pathname.split("/"), e)[0].join("/");
        n.length && (l = !!this._matchPatternAgainstString(t, n));
      }
    }
    let a = !1;
    for (let t of e.elements)
      if (this._isTextField(t) && t.isVisible()) {
        if (a) {
          a = !1;
          break;
        }
        a = !0;
      }
    return [n, l, o, i, a];
  }
  _collectFormMetadata(e, t) {
    var r,
      n,
      o =
        ((n = 0),
        {
          backwardScanCache: new WeakMap(),
          forwardScanCache: new WeakMap(),
          shouldUsePageScan: function () {
            return (
              n <
              numberOfConsecutiveElementsWithoutSuccessfulPageScanAfterWhichPageScanIsAbandoned
            );
          },
          willStartCollectingMetadataForControl: function () {
            r = null;
          },
          reportPageScanUsedSuccessfully: function (e) {
            r = !(!e && !r);
          },
          didFinishCollectingMetadataForControl: function () {
            !0 === r ? (n = 0) : !1 === r && n++;
          },
        });
    this._pageScanContext = o;
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
        (l.FormIsSearchForm = this.isSearchForm(i, !0)),
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
    let [d, h, m, F, f] =
      this._trailingArgumentsForCollectControlMetadataFunction(e, t, s);
    var g = 0,
      p = !1,
      C = [],
      y = [],
      b = [],
      A = [],
      w = void 0,
      E = void 0,
      _ = void 0,
      T = void 0,
      S = !1,
      I = !1,
      P = {},
      v = [];
    let L = !1;
    for (var M = u.length, x = 0; x < M; ++x) {
      var k = u[x];
      if (c && !k.isVisible() && !k._relatesToCredentials) continue;
      var B = isRadioButtonElement(k),
        D = k.name;
      if (B && P[D]) continue;
      o.willStartCollectingMetadataForControl();
      const r = !L;
      var U = this._collectControlMetadata(k, t, d, h, m, F, f, r);
      if (
        (o.didFinishCollectingMetadataForControl(),
        (L = !0),
        x + 1 < M &&
          (U.ControlNextFieldUniqueID = this.controlUniqueID(u[x + 1])),
        l.FormControls.push(U),
        v.push(k),
        U.IsVisible || !l.IsVisible || k._relatesToCredentials)
      )
        if (
          (U.ControlIsActiveElement && (l.ContainsActiveElement = !0), D && B)
        )
          ((P[D] = 1),
            (U.ControlValue = ""),
            (U.RadioButtonInfo = this._collectRadioButtonInfo(e, D)));
        else if (U.ControlIsTextField || U.SelectElementInfo)
          if (
            (!I && U.ControlLooksLikeCreditCardSecurityCodeField && (I = !0),
            S ||
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
                k.isHiddenFromAccessibilityTree()
                  ? (b.push(k), A.push(U))
                  : (C.push(k), y.push(U));
              }
              if (this._isLabeledEmailField(k)) {
                if (++g > 2) {
                  p = !1;
                  continue;
                }
                if (
                  !(
                    x + 1 < M &&
                    this._matchesConfirmEmailFieldLabelPattern(u[x + 1])
                  )
                )
                  continue;
                p = !0;
              }
            }
          } else
            ((S = !0),
              (l.FirstCreditCardCardholderFieldOrCreditCardNumberFieldUniqueID =
                U.ControlUniqueID));
    }
    !C.length && b.length && ((C = b), (y = A));
    var R,
      O,
      N =
        this._identifyFormTypeAndPasswordFieldIndicesFromAutocompleteAttributes(
          C,
          y,
        ),
      W = N[0],
      q = N[1],
      K = N[2],
      V = q || this._identifyPasswordFieldIndices(y, C);
    if (
      (void 0 !== V.PasswordFieldIndex &&
        ((w = y[V.PasswordFieldIndex]),
        (l.PasswordElementUniqueID = w.ControlUniqueID),
        (E = this._explicitMaxLength(C[V.PasswordFieldIndex]))),
      void 0 !== V.ConfirmationFieldIndex &&
        ((_ = y[V.ConfirmationFieldIndex]),
        (l.ConfirmPasswordElementUniqueID = _.ControlUniqueID),
        (T = this._explicitMaxLength(C[V.ConfirmationFieldIndex]))),
      void 0 !== V.OldPasswordFieldIndex)
    ) {
      var H = y[V.OldPasswordFieldIndex];
      l.OldPasswordElementUniqueID = H.ControlUniqueID;
    }
    if (
      (w && (R = this._bestUsernameFieldCandidate(v, l, w)),
      R
        ? (l.UsernameElementUniqueID = R.ControlUniqueID)
        : (O = this._findHiddenUsernameElement(e, l, v)),
      W)
    )
      l.AutoFillFormType = this._autoFillFormTypeFromCandidateFormTypes(
        e,
        W,
        W[0],
      );
    else if (1 === C.length && p)
      l.AutoFillFormType = this._autoFillFormTypeOfTypesUsingKeywordMatching(
        e,
        [WBSAutoFillFormTypeNewAccount, WBSAutoFillFormTypeChangePassword],
        WBSAutoFillFormTypeNewAccount,
      );
    else if (l.UsernameElementUniqueID)
      switch (C.length) {
        case 0:
          break;
        case 1:
          if (
            I &&
            l.UsernameElementUniqueID ===
              l.FirstCreditCardCardholderFieldOrCreditCardNumberFieldUniqueID &&
            y[0].ControlLooksLikeCreditCardNumberField
          )
            break;
          if (this._matchesConfirmPasswordFieldLabelPattern(C[0])) {
            let t = {};
            (this._isElementFollowedByForgotPasswordAffordance(k, i) &&
              (t[WBSAutoFillFormTypeAutoFillableLogin] = 2),
              (l.AutoFillFormType =
                this._autoFillFormTypeOfTypesUsingKeywordMatching(
                  e,
                  [
                    WBSAutoFillFormTypeNewAccount,
                    WBSAutoFillFormTypeChangePassword,
                  ],
                  K || WBSAutoFillFormTypeAutoFillableLogin,
                  t,
                )));
          } else {
            let t = C[0],
              r = {},
              n =
                2 *
                this._numberOfForgotUserNameEmailOrPasswordAffordancesFollowingElement(
                  t,
                  e.backingElement,
                );
            (n && (r[WBSAutoFillFormTypeAutoFillableLogin] = n),
              (l.AutoFillFormType =
                this._autoFillFormTypeOfTypesUsingKeywordMatching(
                  e,
                  [
                    WBSAutoFillFormTypeNewAccount,
                    WBSAutoFillFormTypeAutoFillableLogin,
                  ],
                  K || WBSAutoFillFormTypeAutoFillableLogin,
                  r,
                )));
          }
          break;
        case 2:
          E === T
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
              ? this._isPasswordConfirmPair(C[0], C[1])
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
          E === T ||
          !T ||
          this._isPasswordConfirmPair(
            C[V.PasswordFieldIndex],
            C[V.ConfirmationFieldIndex],
          )
            ? (l.AutoFillFormType = WBSAutoFillFormTypeChangePassword)
            : (l.AutoFillFormType = WBSAutoFillFormTypeNonAutoFillable);
          break;
        default:
          l.AutoFillFormType = WBSAutoFillFormTypeNonAutoFillable;
      }
    else if (2 === C.length || 3 === C.length)
      if (E !== T && T)
        2 === C.length
          ? this._isPasswordConfirmPair(C[0], C[1])
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
                C[V.PasswordFieldIndex],
                C[V.ConfirmationFieldIndex],
              )
            ? (l.AutoFillFormType = WBSAutoFillFormTypeChangePassword)
            : (l.AutoFillFormType = WBSAutoFillFormTypeNonAutoFillable);
      else {
        let t = {};
        (this._isPasswordConfirmPair(
          C[V.PasswordFieldIndex],
          C[V.ConfirmationFieldIndex],
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
    else if (1 === C.length) {
      var G = C[0];
      if (this._matchesConfirmPasswordFieldLabelPattern(G, !0)) {
        let t = {};
        (this._isElementFollowedByForgotPasswordAffordance(k, i) &&
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
      } else if (this._matchesPasswordFieldLabelPattern(G))
        if (this._isElementFollowedByForgotPasswordAffordance(G, i))
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
              O &&
              (l.AutoFillFormType = WBSAutoFillFormTypeNewAccount));
        }
      else l.AutoFillFormType = WBSAutoFillFormTypeNonAutoFillable;
    } else
      0 !== C.length &&
        (l.AutoFillFormType = WBSAutoFillFormTypeNonAutoFillable);
    if (
      l.AutoFillFormType === WBSAutoFillFormTypeAutoFillableStandard &&
      this._shouldDetectStandaloneUserNameFields()
    ) {
      var j = null,
        Y = null,
        z = null,
        $ = 0,
        Z = v.length;
      for (x = 0; x < Z; ++x) {
        k = v[x];
        var X = l.FormControls[x],
          Q = X.IsVisible;
        if ((Q && X.ControlIsTextField && $++, $ > 1)) break;
        if (k.closest("footer")) continue;
        let t = {};
        this._isElementFollowedByForgotUserNameOrEmailOrFederatedSignInAffordance(
          k,
          i,
        ) && (t[WBSAutoFillFormTypeAutoFillableLogin] = 2);
        var ee = this._isLabeledEmailField(k);
        if (
          Q &&
          (X.ControlClaimsToBeUsernameViaAutocompleteAttribute ||
            X.ControlIsLabeledUsernameField ||
            ee ||
            this._isLabeledLoginField(k)) &&
          !this._matchesNonUsernameFieldLabelPattern(k) &&
          !this._matchSearchFieldLabelPattern(k) &&
          !k.readOnly &&
          "INPUT" === k.tagName &&
          !this._isLabeledSignUpField(k)
        ) {
          this._autoFillFormTypeOfTypesUsingKeywordMatching(
            e,
            [
              WBSAutoFillFormTypeNewAccount,
              WBSAutoFillFormTypeAutoFillableLogin,
            ],
            ee
              ? WBSAutoFillFormTypeNewAccount
              : WBSAutoFillFormTypeAutoFillableLogin,
            t,
          ) === WBSAutoFillFormTypeAutoFillableLogin &&
            ((j = k), (Y = X), (z = WBSAutoFillFormTypeAutoFillableLogin));
        }
        const r = X.AutocompleteTokens;
        if (r) {
          const n = r.includes("username"),
            o = r.includes("email");
          if (r.includes("webauthn") && (n || o)) {
            ((j = k), (Y = X), (z = WBSAutoFillFormTypeAutoFillableLogin));
            continue;
          }
          n &&
            ee &&
            ((j = k),
            (Y = X),
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
        Y &&
        z &&
        !controlAppearsToBePartOfPhotoTaggingInterface(j) &&
        ((l.AutoFillFormType = z),
        (l.UsernameElementUniqueID = Y.ControlUniqueID));
    }
    (l.AutoFillFormType === WBSAutoFillFormTypeNewAccount &&
      l.FirstCreditCardCardholderFieldOrCreditCardNumberFieldUniqueID ===
        l.UsernameElementUniqueID &&
      (l.UsernameElementUniqueID = void 0),
      !l.UsernameElementUniqueID &&
        O &&
        this._extractMetadataForHiddenUsernameElement(O, l, v),
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
    if (l.IsVisible && !FormMetadataJSController.collectAllFields)
      for (x = (Z = v.length) - 1; x >= 0; --x)
        this._shouldIncludeControlMetadata(l, v[x], l.FormControls[x]) ||
          (t !== WBSFormMetadataRequestCollectMetadataFromDebugMenu
            ? (l.FormControls.splice(x, 1), v.splice(x, 1))
            : (l.FormControls[x].WOULD_NORMALLY_NOT_BE_SENT_TO_UI_PROCESS =
                !0));
    return (
      this._removePlaceholderTextForFormMetadata(v, l),
      delete this._pageScanContext,
      t !== WBSFormMetadataRequestPreFill &&
        globalThis.FormMetadataClassificationJS &&
        globalThis.FormMetadataClassificationJS.classify(l),
      addPasswordRequirementsToFormMetadata(l),
      l
    );
  }
  _formIsEligibleForAutomaticLogin(e, t) {
    if (e.AutoFillFormType !== WBSAutoFillFormTypeAutoFillableLogin) return !1;
    let r = !1;
    for (const t of e.FormControls) {
      const n = t.ControlUniqueID;
      if (n === e.UsernameElementUniqueID || n === e.PasswordElementUniqueID)
        continue;
      if (t.ControlIsDisabled) continue;
      if (t.ControlIsReadOnly) continue;
      if (!t.IsVisible) continue;
      const o = this.formControlWithUniqueID(n);
      if (!o) continue;
      if (this._isTextArea(o)) return !1;
      if (isSelectElement(o)) return !1;
      if (this._isSubmitButton(o)) continue;
      if (this._looksLikeShowHidePasswordButton(o)) continue;
      if (!isInputElement(o)) continue;
      const i = o.type;
      if ("button" !== i && "reset" !== i && "submit" !== i && "image" !== i) {
        if (!this._isCheckboxInputElement(o)) return !1;
        if (r) return !1;
        r = !0;
      }
    }
    return !t || !elementAppearsToContinueCaptchaWidget(t);
  }
  _oneTimeCodeIsEligibleForAutomaticLogin(e, t) {
    for (const e of t.FormControls) {
      if (e.ControlLooksLikeOneTimeCodeField) continue;
      if (e.ControlIsDisabled) continue;
      if (e.ControlIsReadOnly) continue;
      if (!e.IsVisible) continue;
      const t = this.formControlWithUniqueID(e.ControlUniqueID);
      if (!t) continue;
      if (this._isTextArea(t)) return !1;
      if (isSelectElement(t)) return !1;
      if (this._isSubmitButton(t)) continue;
      if (this._looksLikeShowHidePasswordButton(t)) continue;
      if (!isInputElement(t)) continue;
      const r = t.type;
      if ("button" !== r && "reset" !== r && "submit" !== r && "image" !== r)
        return !1;
    }
    return !0;
  }
  _shouldIncludeControlMetadata(e, t, r) {
    if (t._relatesToCredentials) return !0;
    if (r.IsVisible) {
      if (formControlHasBeenClassifiedInAnInterestingWay(r)) return !0;
      if (r.ControlValue) return !0;
    }
    return !(
      !e.UsernameElementUniqueID ||
      r.ControlUniqueID !== e.UsernameElementUniqueID
    );
  }
  _isElementAHiddenUsername(e) {
    const t = /user|email/i;
    return (
      "hidden" === e.type &&
      !(!t.test(e.getAttribute("id")) && !t.test(e.getAttribute("name"))) &&
      !!isValidUsernameOrEmail(e.value)
    );
  }
  _findHiddenUsernameElement(e, t, r) {
    var n = e.formElement;
    if (!(n instanceof HTMLElement)) return;
    let o = queryAllBySelector(n, "input"),
      i = o.length;
    for (let e = 0; e < i; ++e) {
      let t = o[e];
      if (this._isElementAHiddenUsername(t)) return t;
    }
    return null;
  }
  _extractMetadataForHiddenUsernameElement(e, t, r) {
    var n = {
      ControlTagName: this._getTagName(e),
      ControlFieldName: this._getNameOrId(e),
      ControlUniqueID: this.controlUniqueID(e),
      ControlIsReadOnly: !0,
      ControlValue: e.value,
    };
    ((t.UsernameElementUniqueID = n.ControlUniqueID),
      t.FormControls.push(n),
      r.push(e));
  }
  _cachedMetadataForLogicalForm(e) {
    var t = e.metadata,
      r = t?.FormControls,
      n = r?.length ?? 0;
    if (!n) return null;
    const o = innermostActiveElement();
    for (var i = 0; i < n; ++i) {
      var l = r[i],
        a = this.formControlWithUniqueID(l.ControlUniqueID);
      a &&
        ((l.ControlIsActiveElement = a === o),
        (l.ControlValue = a.value),
        (l.ControlIsAutoFilledTextField = this._isAutoFilledTextField(a)));
    }
    return (
      (t.UsesGeneratedPassword = this._usesGeneratedPassword(e)),
      (t.Annotations = e.annotations),
      t
    );
  }
  _markFormIsBestForPageLevelAutoFill() {
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
    let r = this._logicalFormWithHighestScoreIfGreaterThanZero(function (r) {
      var n = r.PasswordElementUniqueID ? 0 : -1;
      return e(r.AutoFillFormType) + t(r.IsVisible) + n;
    });
    null !== r && (r.metadata.FormIsBestForPageLevelAutoFill = !0);
  }
  _markFormIsBestForStreamlinedLogin() {
    let e = this._logicalFormWithHighestScoreIfGreaterThanZero(function (e, t) {
      if (!e.IsVisible) return 0;
      let r = t.getBoundingClientRect();
      if (!rectIsWithinDocumentViewport(r)) return 0;
      if (r.bottom + window.scrollY < 80) {
        let e = !(
            location.hash ||
            (location.pathname && "/" !== location.pathname) ||
            location.search
          ),
          t = r.width / r.height;
        if (!e && t > 4) return 0;
      }
      if (t.closest("footer")) return 0;
      let n = e.AutoFillFormType === WBSAutoFillFormTypeAutoFillableLogin,
        o = 0,
        i = e.FormControls,
        l = i.length;
      for (var a = 0; a < l; ++a) {
        let t = i[a],
          r = FormMetadataJS.formControlWithUniqueID(t.ControlUniqueID);
        if (!r) continue;
        const l = parseInt(r.tabIndex, 10);
        if (!(isFiniteNumber(l) && l < 0)) {
          if (n) {
            t.ControlIsAutofocusedTextField && (o += 1);
            let r = t.ControlUniqueID;
            if (
              r === e.UsernameElementUniqueID ||
              r === e.PasswordElementUniqueID
            ) {
              o += 10;
              continue;
            }
          }
          t.OneTimeCodeIsEligibleForAutomaticLogin && (o += 5);
        }
      }
      return o;
    });
    null !== e && (e.metadata.FormIsBestForStreamlinedLogin = !0);
  }
  _logicalFormWithHighestScoreIfGreaterThanZero(e) {
    let t = null,
      r = null;
    for (let o of this._logicalFormsCache.allForms()) {
      var n = e(o.metadata, o.backingElement);
      (null === t || n > t) && ((r = o), (t = n));
    }
    return t > 0 ? r : null;
  }
  isAnyFormAnnotated() {
    return this._logicalFormsCache.allForms().some((e) => e.isAnnotated);
  }
  annotateFormWithID(e, t) {
    let r = this._logicalFormsCache.logicalFormWithUniqueID(e);
    r && r.annotate(t);
  }
  _collectMetadata(e) {
    const t = 100,
      r = 10;
    var n = this._logicalFormsInPage(t, r);
    this._logicalFormsCache.clearCacheAndAdd(n);
    for (var o = n.length, i = 0; i < o; ++i)
      n[i].metadata = this._collectFormMetadata(n[i], e);
    (this._markFormIsBestForPageLevelAutoFill(),
      e !== WBSFormMetadataRequestNormal &&
        this._markFormIsBestForStreamlinedLogin());
  }
  _collectAndCacheFormMetadata(e, t) {
    let r = this._collectFormMetadata(e, t),
      n = this._logicalFormsCache.logicalFormWithUniqueID(e.formUniqueID);
    return (
      n
        ? (n.metadata = r)
        : ((e.metadata = r), this._logicalFormsCache.addOrUpdate(e)),
      r
    );
  }
  _metadataForFormWithID(e) {
    return this._logicalFormsCache.logicalFormWithUniqueID(e)?.metadata;
  }
  _recollectMetadataForFormWithID(e) {
    const t = this._logicalFormsCache.logicalFormWithUniqueID(e);
    return t
      ? this._collectAndCacheFormMetadata(t, WBSFormMetadataRequestNormal)
      : null;
  }
  async _fillControlWithGeneratedPassword(e, t) {
    var r = this._elementsWithGeneratedPasswords.indexOf(e);
    (-1 === r &&
      (this._elementsWithGeneratedPasswords.push(e),
      (r = this._elementsWithGeneratedPasswords.length - 1)),
      (this._generatedPasswords[r] = t));
    const n = !0;
    await this._fillControl(e, t, n);
  }
  async fillFormWithPassword(e, t, r) {
    var n = this._metadataForFormWithID(e);
    if (null === n) return null;
    const o = n.PasswordElementUniqueID,
      i = o ? this.formControlWithUniqueID(o) : void 0,
      l = r ? this.formControlWithUniqueID(r) : void 0;
    var a = i || l;
    const s = o || r;
    if (!a) return null;
    await this._fillControlWithGeneratedPassword(a, t);
    let u = n.ConfirmPasswordElementUniqueID;
    u ||
      (n.AutoFillFormType !== WBSAutoFillFormTypeChangePassword &&
        n.AutoFillFormType !== WBSAutoFillFormTypeNewAccount) ||
      (u = (n = this._recollectMetadataForFormWithID(e) || n)
        .ConfirmPasswordElementUniqueID);
    let c = u ? this.formControlWithUniqueID(u) : null;
    return c
      ? (await this._fillControlWithGeneratedPassword(c, t), [s, u])
      : [s];
  }
  clearField(e) {
    const t = this.formControlWithUniqueID(e),
      r = !0;
    this._clearControl(t, r);
  }
  async _clearControl(e, t = !1) {
    if (!e) return;
    if (isSelectElement(e)) return void (e.selectedIndex = 0);
    if (isDateTimeInputElement(e)) return void (e.value = "");
    if (isRadioButtonElement(e)) {
      const t = this._logicalFormsCache
        .logicalFormForControl(e)
        .radioButtonsWithName(e.name);
      for (let e of t) e.checked = !1;
      return;
    }
    if (!this._isTextField(e)) return;
    if (!e.value.length) return;
    let r = innermostActiveElement();
    (e !== r && e.focus({ preventScroll: !0, focusVisible: !1 }),
      e.select(),
      e.dispatchEvent(new Event("select", { bubbles: !0, cancelable: !1 })));
    const n = KeyInfo.BackspaceKeyInfo;
    e.dispatchEvent(n.keyEvent("keydown"));
    const o = "deleteContentBackward";
    (e.dispatchEvent(
      new InputEvent("beforeinput", {
        bubbles: !0,
        cancelable: !0,
        inputType: o,
        data: null,
      }),
    ),
      (e.value = ""),
      e.dispatchEvent(
        new InputEvent("input", {
          bubbles: !0,
          cancelable: !1,
          inputType: o,
          data: null,
        }),
      ),
      e.dispatchEvent(n.keyEvent("keyup")),
      e.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !1 })),
      t || (await yieldToEventLoopAfterAnimationFrameAndDelay()),
      r && e !== r && r.focus({ preventScroll: !0 }));
  }
  focusFormForStreamlinedLogin(e) {
    const t = function (e) {
      for (const t of e.FormControls) {
        const r = t.ControlUniqueID;
        if (
          r === e.UsernameElementUniqueID ||
          r === e.PasswordElementUniqueID ||
          t.ControlLooksLikeOneTimeCodeField
        ) {
          let e = this.formControlWithUniqueID(r);
          if (e.isVisible() && !e.disabled) return e;
        }
      }
      return null;
    }.bind(this);
    var r = this._metadataForFormWithID(e);
    null !== r && this._focusControlForStreamlinedLogin(t(r));
  }
  focusControlForStreamlinedLogin(e) {
    this._focusControlForStreamlinedLogin(this.formControlWithUniqueID(e));
  }
  _focusControlForStreamlinedLogin(e) {
    e && rectIsWithinDocumentViewport(e.getBoundingClientRect()) && e.focus();
  }
  formsAndMetadata(e) {
    (visibilityCacheGeneration++, this._collectMetadata(e));
    let t = [],
      r = [];
    for (let e of this._logicalFormsCache.allForms())
      (t.push(e.formElement), r.push(e.metadata));
    return [t, r];
  }
  formControlWithUniqueID(e) {
    let t = this._controlUniqueIDToWeakControlMap.get(e)?.deref();
    return t;
  }
  formElementWithFormID(e) {
    return this._logicalFormsCache.logicalFormWithUniqueID(e)?.formElement;
  }
  selectIfTextField(e) {
    this._isTextField(e) && e.select();
  }
  _getOrCreateCachedMetadataForLogicalForm(e, t) {
    var r = this._cachedMetadataForLogicalForm(e);
    return !r ||
      (null != t &&
        r.RequestType === WBSFormMetadataRequestPreFill &&
        t !== WBSFormMetadataRequestPreFill)
      ? this._collectAndCacheFormMetadata(e, t)
      : r;
  }
  _getOrCreateLogicalFormForTextFieldOrSelectElement(e) {
    let t = this._logicalFormsCache.logicalFormForControl(e);
    if (t)
      for (
        var r = t.metadata,
          n = r?.FormControls,
          o = n?.length ?? 0,
          i = e._controlUniqueID,
          l = 0;
        l < o;
        ++l
      )
        if (n[l].ControlUniqueID === i) return t;
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
  }
  _cachedMetadataForFormWithTextFieldOrSelectElement(e, t) {
    if (!this._isTextField(e) && !isSelectElement(e)) return null;
    var r = this._getOrCreateLogicalFormForTextFieldOrSelectElement(e);
    return r ? this._getOrCreateCachedMetadataForLogicalForm(r, t) : null;
  }
  _isAnyPasswordElementUniqueID(e, t) {
    return (
      e.PasswordElementUniqueID === t ||
      e.ConfirmPasswordElementUniqueID === t ||
      e.OldPasswordElementUniqueID === t
    );
  }
  _isCurrentPasswordElementUniqueID(e, t) {
    switch (e.AutoFillFormType) {
      case WBSAutoFillFormTypeNewAccount:
      case WBSAutoFillFormTypeChangePassword:
        return e.OldPasswordElementUniqueID === t;
      default:
        return e.PasswordElementUniqueID === t;
    }
  }
  _isNewPasswordElementUniqueID(e, t) {
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
  }
  _updateAnnotationsForField(e) {
    var t = this._getOrCreateLogicalFormForTextFieldOrSelectElement(e);
    if (t) {
      var r = this._getOrCreateCachedMetadataForLogicalForm(t);
      if (r) {
        var n = e._controlUniqueID;
        (this._isCurrentPasswordElementUniqueID(r, n)
          ? t.annotate({ CurrentPassword: e.value })
          : this._isNewPasswordElementUniqueID(r, n)
            ? t.annotate({ NewPassword: e.value })
            : r.UsernameElementUniqueID === n &&
              t.annotate({ Username: e.value }),
          isCredentialElementUniqueID(r, n) &&
            (e._relatesToCredentials = "" !== e.value));
      }
    }
  }
  textFieldOrSelectElementMetadata(e, t, r) {
    (visibilityCacheGeneration++,
      this._logicalFormsCache.removeUnparentedLogicalFormsFromCache());
    var n = [null, null],
      o = this._cachedMetadataForFormWithTextFieldOrSelectElement(e, t);
    if (!o) return n;
    this._pageScanContext = {
      backwardScanCache: new WeakMap(),
      forwardScanCache: new WeakMap(),
    };
    let i = this._logicalFormsCache.logicalFormWithUniqueID(o.FormID),
      l = formActionAsAnchorElement(i.formElement),
      [a, s, u, c, d] =
        this._trailingArgumentsForCollectControlMetadataFunction(i, t, l);
    const h = !0;
    var m = this._collectControlMetadata(
      e,
      WBSFormMetadataRequestNormal,
      a,
      s,
      u,
      c,
      d,
      h,
    );
    if (
      (delete this._pageScanContext,
      m.ControlLooksLikeOneTimeCodeField &&
        this._oneTimeCodeIsEligibleForAutomaticLogin(m, o) &&
        (m.OneTimeCodeIsEligibleForAutomaticLogin = !0),
      (m.SelectionStart = e.selectionStart),
      (m.SelectionLength = e.selectionEnd - e.selectionStart),
      t === WBSFormMetadataRequestTextChange &&
        (!o.UsernameElementUniqueID &&
          this._isAnyPasswordElementUniqueID(o, m.ControlUniqueID) &&
          i.isAnnotated &&
          i.annotate({ Username: null }),
        this._updateAnnotationsForField(e)),
      o.RequestType !== WBSFormMetadataRequestPreFill)
    )
      for (let e of o.FormControls)
        if (m.ControlUniqueID === e.ControlUniqueID) {
          ((m.ControlClassification = e.ControlClassification),
            (m.ControlClassificationHints = e.ControlClassificationHints),
            (m.ControlOrderedParts = e.ControlOrderedParts),
            (m.ControlContinuationID = e.ControlContinuationID),
            (m.ControlContinuationIndex = e.ControlContinuationIndex));
          break;
        }
    if (r) {
      for (const e of o.FormControls)
        e.ControlUniqueID == m.ControlUniqueID && (e.ControlValue = null);
      this._cachedFormMetadata = JSON.stringify(o);
    }
    return ((n[0] = m), (n[1] = o), n);
  }
  clearTextFieldOrSelectElementMetadataCache() {
    this._cachedFormMetadata = null;
  }
  disableSpellCheckInFieldIfNeeded(e) {
    if (e) {
      var t = this.formControlWithUniqueID(e);
      t &&
        this._isAutoFillableTextField(t) &&
        FormMetadataJSController.setInputElementSpellCheckEnabled(t, !1);
    }
  }
  selectionRangeInField(e) {
    var t = this.formControlWithUniqueID(e);
    return t && this._isTextField(t)
      ? [t.selectionStart, t.selectionEnd - t.selectionStart]
      : null;
  }
  setFormFieldSelection(e, t, r) {
    var n = this.formControlWithUniqueID(e);
    n &&
      this._isTextField(n) &&
      ((n.selectionStart = t), (n.selectionEnd = t + r));
  }
  replaceFormFieldRangeAndSelectTail(e, t, r, n, o) {
    var i = this.formControlWithUniqueID(e);
    if (i && this._isTextField(i)) {
      var l = i.value,
        a = l.substr(0, t) + n + l.substr(t + r);
      ((i.value = a),
        (i.selectionStart = o),
        (i.selectionEnd = a.length),
        i.dispatchEvent(createCustomEventThatBubbles("input")),
        i.dispatchEvent(createCustomEventThatBubbles("change")));
    }
  }
  _collectVisibleNonEmptyTextFieldsAndTextAreasInForm(e, t, r) {
    visibilityCacheGeneration++;
    for (
      var n = elementsInFormPiercingShadowDOM(e), o = n.length, i = 0;
      i < o;
      ++i
    ) {
      var l = n[i];
      l.isVisible() &&
        null != l.value &&
        l.value.length &&
        (this._isTextField(l) ? t.push(l) : this._isTextArea(l) && r.push(l));
    }
  }
  visibleNonEmptyFormTextControls() {
    var e = [],
      t = [];
    let r = queryAllBySelector(document, "form");
    for (let n = 0; n < r.length; ++n)
      this._collectVisibleNonEmptyTextFieldsAndTextAreasInForm(r[n], e, t);
    return [e, t];
  }
  visibleNonEmptyFormTextControlsInForm(e) {
    var t = [],
      r = [];
    return (
      this._collectVisibleNonEmptyTextFieldsAndTextAreasInForm(e, t, r),
      [t, r]
    );
  }
  async _fillRadioButtonInGroupStartingWithControl(e, t) {
    const r = this._logicalFormsCache.logicalFormForControl(e);
    let n = r?.radioButtonsWithName(e.name);
    if (!n) return null;
    for (let e of n)
      if (e.value === t)
        return (
          dispatchEventsSimulatingClickOnElement(e),
          (e.checked = !0),
          e.dispatchEvent(
            new InputEvent("input", { bubbles: !0, cancelable: !1 }),
          ),
          e.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !1 })),
          await yieldToEventLoop(),
          e
        );
    return null;
  }
  _controlContainsAllCharactersFromValue(e, t) {
    let r = [...e.value.normalize()],
      n = [...t.normalize()];
    if (r.length < n.length) return !1;
    for (let e of r) {
      e === n[0] && n.shift();
    }
    return !n.length;
  }
  async _fillSelectControlWithBestOptionFromSynonyms(e, t) {
    const r = this._collectSelectElementInfo(e),
      n = FormMetadataUtilitiesJS.bestIndexToFillSelectControl(r, t);
    -1 !== n &&
      e.selectedIndex !== n &&
      (e.dispatchEvent(createCustomEventThatBubbles("focus")),
      e.dispatchEvent(createCustomEventThatBubbles("pointerdown")),
      e.dispatchEvent(createCustomEventThatBubbles("mousedown")),
      (e.selectedIndex = n),
      e.dispatchEvent(new InputEvent("input", { bubbles: !0, cancelable: !1 })),
      e.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !1 })),
      e.dispatchEvent(createCustomEventThatBubbles("blur")),
      await yieldToEventLoop());
  }
  async autoFillOneTimeCodeFieldsWithValue(e, t) {
    let r = innermostActiveElement();
    if (!this._isAutoFillableTextField(r))
      return {
        value: e,
        shouldSubmit: !1,
        codeAppearsToHaveBeenFilledInItsEntirety: !1,
      };
    const n = 10,
      o = {
        waitForSingleCharacterFieldsToAdvanceToNextField: {
          delayBetweenChecks: 1,
          numberOfTimesToCheck: 20,
        },
      },
      i = await this._executeWhilePreventingUserInteraction(
        async () => await this._fillTextControl(null, e, n, o),
      );
    let l = !0;
    if (RegExp.escape) {
      let t = i.map((e) => e.value).join(""),
        r = new RegExp(
          e
            .replaceAll("-", "")
            .split("")
            .map((e) => RegExp.escape(e))
            .join(".*"),
          "s",
        );
      if (((l = r.test(t)), !l)) {
        const e = this._logicalFormsCache.logicalFormForControl(
          i[0],
        )?.backingElement;
        e && (l = r.test(e.innerText));
      }
    }
    return {
      value: e,
      shouldSubmit: t,
      codeAppearsToHaveBeenFilledInItsEntirety: l,
    };
  }
  async _fillTextControl(e, t, r = 0, n = {}) {
    if (e && this._controlContainsAllCharactersFromValue(e, t)) return;
    if (
      e &&
      userIsOnDomain("m.facebook.com") &&
      document.location.pathname.startsWith("/login") &&
      "m_login_email" === e.id
    )
      return void (await this._fillGenericControl(e, t));
    let o = new Set();
    const i = !e;
    ((e ??= innermostActiveElement()), await this._clearControl(e));
    const l = !!n.waitForSingleCharacterFieldsToAdvanceToNextField;
    let a = !0;
    for (let s of t) {
      if (
        l &&
        !a &&
        (1 === e.maxLength ||
          controlSeemsToBeSingleCharacterFieldPartOfSingleLogicalEntity(e))
      ) {
        const t =
            n.waitForSingleCharacterFieldsToAdvanceToNextField
              .numberOfTimesToCheck,
          r =
            n.waitForSingleCharacterFieldsToAdvanceToNextField
              .delayBetweenChecks;
        let o = 0;
        for (; o < t; ++o) {
          const t = innermostActiveElement();
          if (!t || e !== t) break;
          await yieldToEventLoop(r);
        }
      }
      const t = innermostActiveElement();
      if (t !== e) {
        if (!i) break;
        ((e = t), await this._clearControl(e));
      }
      const u = KeyInfo.forCharacter(s);
      u.isShifted && e.dispatchEvent(KeyInfo.shiftKeyEvent("keydown"));
      let c = !e.dispatchEvent(u.keyEvent("keydown"));
      if ((c || (c = !e.dispatchEvent(u.keyEvent("keypress"))), !c))
        if (this.canUseTextInputEventsToFill)
          e.dispatchEvent(createTextInputEvent(s));
        else {
          const t = e.value + s;
          (e.dispatchEvent(
            new InputEvent("beforeinput", {
              bubbles: !0,
              cancelable: !0,
              inputType: insertTextInputType,
              data: t,
            }),
          ),
            (e.value = t),
            e.dispatchEvent(
              new InputEvent("input", {
                bubbles: !0,
                cancelable: !1,
                inputType: insertTextInputType,
                data: t,
              }),
            ));
        }
      (e.dispatchEvent(u.keyEvent("keyup")),
        u.isShifted && e.dispatchEvent(KeyInfo.shiftKeyEvent("keyup")),
        o.add(e),
        (a = !1),
        await yieldToEventLoop(r));
    }
    return (
      i ||
        this._controlContainsAllCharactersFromValue(e, t) ||
        (await yieldToEventLoopAfterAnimationFrameAndDelay(),
        await this._fillGenericControl(e, t)),
      Array.from(o)
    );
  }
  async _fillGenericControl(e, t) {
    (await this._clearControl(e),
      (this.canUseTextInputEventsToFill &&
        e === innermostActiveElement() &&
        (e.dispatchEvent(createTextInputEvent(t)),
        await yieldToEventLoop(),
        this._controlContainsAllCharactersFromValue(e, t))) ||
        (e.dispatchEvent(
          new InputEvent("beforeinput", {
            bubbles: !0,
            cancelable: !0,
            inputType: insertTextInputType,
            data: t,
          }),
        ),
        (e.value = t),
        e.dispatchEvent(
          new InputEvent("input", {
            bubbles: !0,
            cancelable: !1,
            inputType: insertTextInputType,
            data: t,
          }),
        ),
        e.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !1 })),
        await yieldToEventLoop(),
        this._controlContainsAllCharactersFromValue(e, t)));
  }
  async _fillControl(e, t, r, n) {
    if (e.isDisabledOrReadOnly()) return;
    if (e.shouldFocusDuringFilling()) {
      let t = !1;
      (document.hasFocus() ||
        (await yieldUntilDocumentIsFocusedOrTimeout(100), (t = !0)),
        e !== innermostActiveElement() &&
          (e.focus({ preventScroll: !0, focusVisible: !1 }), (t = !0)),
        t && (await yieldToEventLoopAfterAnimationFrameAndDelay(20)));
    }
    let o = !1;
    if (isRadioButtonElement(e)) {
      if (!(e = await this._fillRadioButtonInGroupStartingWithControl(e, t)))
        return;
    } else
      isSelectElement(e)
        ? await this._fillSelectControlWithBestOptionFromSynonyms(e, t)
        : ((o = !0),
          this._isTextField(e)
            ? await this._fillTextControl(e, t)
            : await this._fillGenericControl(e, t));
    const i = t.length && r;
    o && n
      ? FormMetadataJSController.setInputElementAutofilledAndObscured(e, i)
      : FormMetadataJSController.setInputElementAutofilled(e, i);
  }
  async _executeWhilePreventingUserInteraction(e) {
    const t = new AbortController(),
      r = [
        "keydown",
        "keyup",
        "keypress",
        "pointerdown",
        "pointerup",
        "touchstart",
        "touchend",
        "mousedown",
        "mouseup",
        "click",
        "dblclick",
      ];
    for (const e of r)
      window.addEventListener(
        e,
        (e) => {
          e.isTrusted && (e.preventDefault(), e.stopImmediatePropagation());
        },
        { capture: !0, signal: t.signal },
      );
    try {
      return await e();
    } finally {
      t.abort(null);
    }
  }
  async autoFillControlsByID(e, t, r, n, o, i, l) {
    let a = arguments[arguments.length - 1],
      s = n;
    if (s) {
      let e = s.getAttribute("onfocus");
      e && e.length && /this\.value/.test(e) && (s = null);
    } else s = innermostActiveElement();
    var u = null;
    for (let t in e) {
      u = this._logicalFormsCache.logicalFormForControl(
        this.formControlWithUniqueID(t),
      );
      break;
    }
    const c = Object.entries(e)
      .map(([e, t]) => [this.formControlWithUniqueID(e), t])
      .sort((e, t) => {
        const r = e[0],
          n = t[0],
          o = r.compareDocumentPosition(n);
        return o &
          (Node.DOCUMENT_POSITION_PRECEDING | Node.DOCUMENT_POSITION_CONTAINS)
          ? 1
          : o &
              (Node.DOCUMENT_POSITION_FOLLOWING |
                Node.DOCUMENT_POSITION_CONTAINED_BY)
            ? -1
            : 0;
      });
    return (
      await this._executeWhilePreventingUserInteraction(async () => {
        const e = new Set(i);
        for (let [t, n] of c) {
          const o = e.has(t._controlUniqueID);
          await this._fillControl(t, n, r, o);
        }
      }),
      o
        ? innermostActiveElement().blur()
        : s &&
          setTimeout(() => {
            this.selectIfTextField(s);
          }, 0),
      u?.backingElement &&
        elementAppearsToContinueCaptchaWidget(u.backingElement) &&
        (a = !1),
      {
        formMetadata: this._getOrCreateCachedMetadataForLogicalForm(u),
        shouldSubmit: a,
      }
    );
  }
  _isInputAllowedInSearchForm(e, t) {
    var r = this._getTagName(e).toLowerCase();
    if ("button" === r || "fieldset" === r) return !0;
    if ("select" === r) return !t || isSelectInDefaultState(e);
    if ("input" !== r && !this._textAreaElementLookLikeItIsPartOfASearchForm(e))
      return !1;
    var n = e.type;
    return "radio" === n || "checkbox" === n
      ? !t || isCheckboxOrRadioButtonInDefaultState(e)
      : "hidden" === n ||
          "reset" === n ||
          "submit" === n ||
          "button" === n ||
          "image" === n ||
          (this._isTextField(e) && !this._isSecureTextField(e));
  }
  isSearchForm(e, t) {
    if ("get" !== e.method) return !1;
    for (
      var r = elementsInFormPiercingShadowDOM(e), n = r.length, o = 0;
      o < n;
      ++o
    )
      if (!this._isInputAllowedInSearchForm(r[o], t)) return !1;
    return !0;
  }
  _textAreaElementLookLikeItIsPartOfASearchForm(e) {
    return (
      !!this._isTextArea(e) &&
      ("search" === e.getAttribute("type") ||
        "search" === e.inputMode ||
        "search" === e.getAttribute("enterkeyhint"))
    );
  }
  _shouldInputBeIncludedInSearchURLQuery(e) {
    if (e.disabled) return !1;
    if (!e.name.length) return !1;
    if (!e.value.length) return !1;
    if (isSelectElement(e)) return !0;
    var t = this._getTagName(e).toLowerCase(),
      r = e.type;
    return "button" === t
      ? "submit" === r
      : "input" === t &&
          ("submit" === r ||
            ("checkbox" === r || "radio" === r
              ? e.checked
              : "hidden" === r || this._isTextField(e)));
  }
  _isSubmitButton(e) {
    return (
      (e instanceof HTMLButtonElement || e instanceof HTMLInputElement) &&
      e.type &&
      "submit" === e.type
    );
  }
  _isCustomFormButton(e) {
    return (
      "button" === e.type &&
      (e instanceof HTMLButtonElement || e instanceof HTMLInputElement)
    );
  }
  _isCheckboxInputElement(e) {
    return "checkbox" === e.type && e instanceof HTMLInputElement;
  }
  _setQueryString(e, t) {
    var r = document.createElement("a");
    return ((r.href = e), (r.search = t), r.href);
  }
  searchTextFieldFormSubmissionURLString(e, t) {
    if (
      (visibilityCacheGeneration++,
      !this._isTextField(e) || this._isSecureTextField(e) || !e.isVisible())
    )
      return null;
    var r = e.form;
    if (!r) return null;
    var n = r.getAttribute("action");
    if (!n || !n.length) return null;
    if (!/^https?:/i.test(r.action)) return null;
    if (!this.isSearchForm(r, t)) return null;
    for (
      var o = null,
        i = "",
        l = elementsInFormPiercingShadowDOM(r),
        a = l.length,
        s = 0;
      s < a;
      ++s
    ) {
      var u = l[s];
      if (
        (u === e || this._shouldInputBeIncludedInSearchURLQuery(u)) &&
        (!this._isSubmitButton(u) || (o || (o = u), u === o))
      ) {
        i.length && (i += "&");
        var c = u === e ? "{searchTerms}" : urlEncode(u.value);
        i += urlEncode(u.name) + "=" + c;
      }
    }
    return this._setQueryString(r.action, i);
  }
  _collectExtraControlMetadata(e, t) {
    let r = e.getAttribute("passwordrules");
    t.ControlPasswordRules = r || void 0;
  }
  removeAutomaticStrongPasswordFromPasswordElement(e) {
    let t = this.formControlWithUniqueID(e);
    t &&
      this._isTextField(t) &&
      (this.clearField(e),
      this._updateAnnotationsForField(t),
      FormMetadataJSController.setInputElementAutofilled(t, !1));
  }
}
var FormMetadataJS = new FormMetadata();
