//# sourceURL=__InjectedScript_FormMetadata.js
/* Copyright (c) 2026 Apple Inc. All rights reserved. */
"use strict";
function addPasswordRequirementsToFormMetadata(e) {
  if (
    e.AutoFillFormType != WBSAutoFillFormTypeNewAccount &&
    e.AutoFillFormType != WBSAutoFillFormTypeChangePassword
  )
    return ((e.PasswordRules = null), void (e.PasswordRequirements = null));
  const t = e.PasswordElementUniqueID,
    r = e.ConfirmPasswordElementUniqueID;
  let o = !!t?.length,
    n = !!r?.length;
  if (!o && !n)
    return ((e.PasswordRules = null), void (e.PasswordRequirements = null));
  let i = null,
    a = null;
  for (const l of e.FormControls) {
    if (!o && !n) break;
    const e = l.ControlUniqueID;
    e &&
      (o && e === t
        ? ((i = l), (o = !1))
        : n && e === r && ((a = l), (n = !1)));
  }
  let l,
    s = null,
    c = null;
  if (i?.ControlPasswordRules) {
    const e = parsePasswordRules(i?.ControlPasswordRules, !1);
    s = new PasswordRuleSet(e);
  }
  if (a?.ControlPasswordRules) {
    const e = parsePasswordRules(a?.ControlPasswordRules, !1);
    c = new PasswordRuleSet(e);
  }
  s && c ? ((l = s.copy()), l.merge(c)) : (l = s || c);
  let u = i?.ControlMaxLength ?? 0,
    d = i?.ControlMinLength ?? 0;
  const h = a?.ControlMaxLength ?? 0,
    m = a?.ControlMinLength ?? 0;
  ((u = u < h ? u : h), (d = d > m ? d : m));
  const F = { passwordRuleSet: l, minLength: d, maxLength: u },
    f = {};
  (i &&
    ((f.passwordFieldPasswordRules = i.ControlPasswordRules),
    (f.passwordFieldMinLength = i.ControlMinLength),
    (f.passwordFieldMaxLength = i.ControlMaxLength)),
    a &&
      ((f.confirmPasswordFieldPasswordRules = a.ControlPasswordRules),
      (f.confirmPasswordFieldMinLength = a.ControlMinLength),
      (f.confirmPasswordFieldMaxLength = a.ControlMaxLength)),
    (e.PasswordRules = f),
    (e.PasswordRequirements = F));
}
function invalidateVisibilityCache() {
  visibilityCacheGeneration++;
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
  var t = e.af_value().trim();
  if (!t) return null;
  for (var r = !1, o = !0, n = e.attributes, i = n.length, a = 0; a < i; ++a) {
    var l = n[a];
    if (t === l.value.trim() && ((r = !0), "value" !== l.name.toLowerCase())) {
      o = !1;
      break;
    }
  }
  return r ? { Text: t, AttributeMatchedWasValue: o } : null;
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
  for (var r = 0, o = 0, n = e.length; o < n && e[o] === t[o]; ++o) r++;
  return r;
}
function rowContainingLabelAboveRow(e) {
  for (
    var t = e.getBoundingClientRect(), r = e.previousElementSibling;
    r instanceof HTMLTableRowElement;
    r = r.previousElementSibling
  ) {
    if (r.querySelector("input, select, textarea")) return null;
    var o = r.getBoundingClientRect();
    if (t.top - o.bottom > t.height / 2) return null;
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
    var o = e.getBoundingClientRect(),
      n = r.children,
      i = n.length,
      a = null,
      l = 0,
      s = 0;
    s < i;
    ++s
  ) {
    var c = n[s],
      u = c.getBoundingClientRect(),
      d = Math.min(u.right, o.right) - Math.max(u.left, o.left);
    (!a || d > l) && ((l = d), (a = c));
  }
  return a;
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
function isContentEditableSingleLineTextbox(e) {
  return (
    e.isContentEditable && "textbox" === e.role && "true" !== e.ariaMultiLine
  );
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
  for (var t = e.options, r = t.length, o = 0; o < r; ++o) {
    var n = t[o];
    if (n.selected !== n.defaultSelected) {
      if (n.defaultSelected) return !1;
      if (e.multiple || o) return !1;
    }
  }
  return !0;
}
function formActionAsAnchorElement(e, t) {
  if (!(e instanceof HTMLFormElement)) return null;
  let r = e.getAttribute("action");
  if (!r && t) return null;
  var o = document.createElement("a");
  return ((o.href = r || ""), o);
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
    e.ControlLooksLikeIMEIField ||
    e.ControlLooksLikeIMEI1Field ||
    e.ControlLooksLikeIMEI2Field ||
    e.ControlLooksLikeNALField
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
  let o = e.classList,
    n = o.length;
  for (let e = 0; e < n; e++) t += "." + o[e];
  return t;
}
function controlIsPartOfSingleCharacterLogicalField(e) {
  return !!allControlsForSingleCharacterLogicalFieldForControl(e).length;
}
function allControlsForSingleCharacterLogicalFieldForControl(e) {
  let t = siblingsIncludingSelfForElement(e);
  if (checkIfControlsAreASingleCharacterLogicalField(t)) return Array.from(t);
  const r = e._weakNextControlInLogicalForm?.deref();
  if (r) {
    const o = e.closestCommonAncestor(r);
    if (
      o &&
      ((t = queryAllBySelector(o, e.localName)),
      checkIfControlsAreASingleCharacterLogicalField(t))
    )
      return Array.from(t);
  }
  return [];
}
function checkIfControlsAreASingleCharacterLogicalField(e) {
  const t = 4,
    r = 8,
    o = e.length;
  if (o < t || o > r) return !1;
  const n = e[0].getBoundingClientRect();
  for (let t = 1; t < o; ++t) {
    const r = e[t].getBoundingClientRect();
    if (
      Math.abs(n.top - r.top) > 0.5 ||
      n.width !== r.width ||
      n.height !== r.height
    )
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
  document.hasFocus() || yieldUntilEventOrTimeout("focus", e);
}
async function yieldUntilEventOrTimeout(
  e,
  t,
  { eventTargetToIgnore: r, requireEventTargetBeDocumentActiveElement: o } = {},
) {
  const n = new AbortController();
  let i;
  (await Promise.race([
    new Promise((e) => {
      i = setTimeout(e, t);
    }),
    new Promise((t) => {
      window.addEventListener(
        e,
        (e) => {
          let n = innermostActiveElement(e.target);
          (r && n === r) || (o && n !== innermostActiveElement()) || t();
        },
        { passive: !0, signal: n.signal },
      );
    }),
  ]),
    clearTimeout(i),
    n.abort(null));
}
function hasOwnProperties(e) {
  return Object.getOwnPropertyNames(e).length > 0;
}
function defaultOptionForSelectElement(e) {
  for (var t = e.options, r = t.length, o = 0; o < r; ++o) {
    var n = t[o];
    if (n.defaultSelected) return n;
  }
  return t[0];
}
function selectElementOptionsSequenceAnalysis(e, t) {
  for (
    var r = e.options, o = r.length, n = 0, i = -1, a = -1, l = 0, s = 0;
    s < o;
    ++s
  ) {
    var c = r[s],
      u = parseInt(c[t]);
    isFiniteNumber(u)
      ? -1 === a
        ? ((a = u), (l = 1))
        : u === a + 1 && ((a = u), l++)
      : (l >= n && ((n = l), (i = a)), (a = -1), (l = 0));
  }
  return (
    l >= n && ((n = l), (i = a)),
    { lengthOfLongestSequence: n, lastNumberInSequence: i }
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
    o,
    n,
    i = e.getBoundingClientRect();
  if (t) ((r = i), (o = window.innerWidth), (n = window.innerHeight));
  else {
    var a = window.scrollY,
      l = window.scrollX;
    ((r = {
      top: i.top + a,
      right: i.right + l,
      bottom: i.bottom + a,
      left: i.left + l,
      width: i.width,
      height: i.height,
    }),
      (o = document.documentElement.scrollWidth),
      (n = Math.max(
        document.documentElement.scrollHeight,
        window.innerHeight,
      )));
  }
  return r.top >= n || r.right <= 0 || r.bottom <= 0 || r.left >= o;
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
  for (const o of t)
    e.hasAttribute(o) && r.push(e.getAttribute(o).trim().toLowerCase());
  if (!r.length) return null;
  let o = r
    .join(" ")
    .split(/\s+/)
    .filter(function (e) {
      return e.length && "off" !== e && "on" !== e;
    });
  return o.length ? o : null;
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
    var r = e.length, o = t.length, n = new Array(r + 1), i = 0;
    i < r + 1;
    ++i
  )
    ((n[i] = new Array(o + 1)), (n[i][0] = i));
  for (var a = 0; a < o + 1; ++a) n[0][a] = a;
  for (a = 1; a < o + 1; ++a)
    for (i = 1; i < r + 1; ++i)
      if (e[i - 1] === t[a - 1]) n[i][a] = n[i - 1][a - 1];
      else {
        var l = n[i - 1][a] + 1,
          s = n[i][a - 1] + 1,
          c = n[i - 1][a - 1] + 1;
        n[i][a] = Math.min(l, s, c);
      }
  return n[r][o];
}
function stringSimilarity(e, t) {
  var r = Math.max(e.length, t.length);
  return r ? (r - levenshteinDistance(e, t)) / r : 0;
}
function stripCommonPrefix(e, t) {
  const r = e.length,
    o = t.length,
    n = r < o ? r : o;
  let i = 0;
  for (; i < n && e[i] === t[i];) i++;
  return [e.slice(i), t.slice(i)];
}
function articleTitleAndSiteNameFromTitleString(e, t) {
  const r = [" - ", " \u2013 ", " \u2014 ", ": ", " | ", " \xbb "],
    o = r.length,
    n = 0.6;
  for (
    var i,
      a,
      l = e.replace(/^(www|m|secure)\./, ""),
      s = l.replace(/\.(com|info|net|org|edu|gov)$/, "").toLowerCase(),
      c = 0;
    c < o;
    ++c
  ) {
    var u = t.split(r[c]);
    if (2 === u.length) {
      var d = u[0].trim(),
        h = u[1].trim(),
        m = d.toLowerCase(),
        F = h.toLowerCase(),
        f = Math.max(stringSimilarity(m, l), stringSimilarity(m, s)),
        g = Math.max(stringSimilarity(F, l), stringSimilarity(F, s)),
        C = Math.max(f, g);
      (!a || C > a) &&
        ((a = C),
        (i =
          f > g
            ? { siteName: d, articleTitle: h }
            : { siteName: h, articleTitle: d }));
    }
  }
  return i && a >= n ? i : null;
}
function documentTitleWithoutHostNamePrefix() {
  const e = document.title,
    t = articleTitleAndSiteNameFromTitleString(window.location.host, e);
  return t ? t.articleTitle : e;
}
function querySelectorAllIncludingWithinShadowRoots(e, t) {
  let r = [];
  for (let o of e.querySelectorAll("*"))
    if (o.shadowRoot) {
      let e = querySelectorAllIncludingWithinShadowRoots(o.shadowRoot, t);
      e.length && (r = r.concat(e));
    } else o.matches(t) && r.push(o);
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
  for (; r.previousElementSibling;) r = r.previousElementSibling;
  let o = [],
    n = r;
  for (; n;) (o.push(n), (n = n.nextElementSibling));
  return o;
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
function innermostActiveElement(e = document.activeElement) {
  let t = e,
    r = t;
  for (; r;) ((r = r?.shadowRoot?.activeElement), r && (t = r));
  return t;
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
  WBSFormMetadataRequestAutomaticPasswordChange = 5,
  WBSSuspectedProvenanceOfOneTimeCodeNone = 0,
  WBSSuspectedProvenanceOfOneTimeCodeEmail = 1,
  WBSSuspectedProvenanceOfOneTimeCodeTextMessage = 2,
  WBSSuspectedProvenanceOfOneTimeCodeAuthenticatorApp = 4,
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
  DialogOrModalSelector =
    "[role=dialog], [role=alertdialog], [aria-modal=true]",
  DateTimeInputTypes = ["date", "datetime-local", "month", "time", "week"],
  DateTimeInputTypeFormats = {
    date: "yyyy-MM-dd",
    "datetime-local": "yyyy-MM-dd'T'hh:mm",
    month: "yyyy-MM",
    time: "hh:mm",
    week: "yyyy-'W'ww",
  };
class PhoneNumberRecognizer {
  static MaskedPhoneNumberRegexp =
    /(?<![\w@])(?=[+(]|(?:[0-9*xX\u2022\xb7\u2219\u25cf#]){0,15}?(?:[ \t().\-\u2013\u2014]|[*xX\u2022\xb7\u2219\u25cf#])|[0-9]{10})\+?[ \t().\-\u2013\u2014]{0,2}(?=(?:[ \t().\-\u2013\u2014]{0,2}[0-9*xX\u2022\xb7\u2219\u25cf#]){7,15}(?![ \t().\-\u2013\u2014]{0,2}[0-9*xX\u2022\xb7\u2219\u25cf#]))(?=(?:[ \t().\-\u2013\u2014]|[0-9*xX\u2022\xb7\u2219\u25cf#])*?[0-9])(?:[0-9*xX\u2022\xb7\u2219\u25cf#][ \t().\-\u2013\u2014]{0,2}){6,14}[0-9*xX\u2022\xb7\u2219\u25cf#](?<![A-Za-z@])/;
  static #e =
    /[+(]?[0-9*xX\u2022\xb7\u2219\u25cf#](?:[ \t().\-\u2013\u2014]{0,2}[0-9*xX\u2022\xb7\u2219\u25cf#])*/g;
  static isPlausibleMaskedOrUnmaskedPhoneNumberLength(e) {
    const t = (e.match(/[0-9*xX\u2022\xb7\u2219\u25cf#]/g) || []).length;
    return t >= 7 && t <= 15;
  }
  static stringContainsMaskedOrUnmaskedPhoneNumber(e) {
    const t = this.#e;
    t.lastIndex = 0;
    for (let r = t.exec(e); r; r = t.exec(e)) {
      const e = r[0];
      if (
        this.MaskedPhoneNumberRegexp.test(e) &&
        this.isPlausibleMaskedOrUnmaskedPhoneNumberLength(e)
      )
        return !0;
    }
    return !1;
  }
}
const MaskedEmailAddressRegexp =
    /[a-zA-Z0-9._%+\*-]+@[a-zA-Z0-9.\*-]+\.[a-zA-Z\*]{2,}/,
  numberOfConsecutiveElementsWithoutSuccessfulPageScanAfterWhichPageScanIsAbandoned = 40,
  insertTextInputType = "insertText";
class KeyInfo {
  static BackspaceKeyInfo = new KeyInfo("\b", "\b", null, "Backspace", {
    uiEventKey: "Backspace",
  });
  static #t = { bubbles: !0, cancelable: !0, trusted: !0 };
  static #r = {
    ...KeyInfo.#t,
    keyCode: 16,
    which: 16,
    key: "Shift",
    code: "ShiftRight",
    location: KeyboardEvent.DOM_KEY_LOCATION_RIGHT,
  };
  #o;
  #n;
  #i;
  #a;
  #l;
  #s;
  #c;
  #u;
  constructor(
    e,
    t,
    r,
    o,
    { uiEventKey: n, useShiftedCharacterForLegacyKeyCode: i } = {},
  ) {
    ((this.#o = e),
      (this.#n = t),
      (this.#i = r),
      (this.#u = e === r),
      (this.#a = o),
      (this.#l = n ?? e),
      (this.#c = i ? r.codePointAt(0) : t.codePointAt(0)),
      (this.#s = e.codePointAt(0)));
  }
  get isShifted() {
    return this.#u;
  }
  keyEvent(e) {
    switch (e) {
      case "keydown":
      case "keyup":
        return new KeyboardEvent(e, {
          ...KeyInfo.#t,
          charCode: 0,
          keyCode: this.#c,
          which: this.#c,
          shiftKey: this.#u,
          key: this.#l,
          code: this.#a,
          location: KeyboardEvent.DOM_KEY_LOCATION_STANDARD,
        });
      case "keypress":
        return new KeyboardEvent(e, {
          ...KeyInfo.#t,
          charCode: this.#s,
          keyCode: this.#s,
          which: this.#s,
          shiftKey: this.#u,
          key: this.#l,
          code: this.#a,
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
        return new KeyboardEvent(e, { ...KeyInfo.#r, shiftKey: !0 });
      case "keyup":
        return new KeyboardEvent(e, KeyInfo.#r);
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
      this.#d());
  }
  union(e) {
    ((this.standardCharacter |= e.standardCharacter),
      (this.customCharacters = [
        ...new Set(this.customCharacters + e.customCharacters),
      ].join("")),
      this.#d());
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
      this.#d());
  }
  #d() {
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
          this.#h(t);
          break;
        case RuleName.REQUIRED:
          this.#m(t);
          break;
        case RuleName.MAX_CONSECUTIVE:
          this.#F(t);
          break;
        case RuleName.MIN_LENGTH:
          this.#f(t);
          break;
        case RuleName.MAX_LENGTH:
          this.#g(t);
      }
    this.#d();
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
    (this.#C(e), this.#p(e), this.#y(e), this.#b(e), this.#A(e), this.#d());
  }
  #C(e) {
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
  #y(e) {
    null !== e.maxConsecutiveRule &&
      (null !== this.maxConsecutiveRule
        ? (this.maxConsecutiveRule = Math.min(
            this.maxConsecutiveRule,
            e.maxConsecutiveRule,
          ))
        : (this.maxConsecutiveRule = e.maxConsecutiveRule));
  }
  #b(e) {
    null !== e.minLengthRule &&
      (null !== this.minLengthRule
        ? (this.minLengthRule = Math.max(this.minLengthRule, e.minLengthRule))
        : (this.minLengthRule = e.minLengthRule));
  }
  #A(e) {
    null !== e.maxLengthRule &&
      (null !== this.maxLengthRule
        ? (this.maxLengthRule = Math.min(this.maxLengthRule, e.maxLengthRule))
        : (this.maxLengthRule = e.maxLengthRule));
  }
  #m(e) {
    null === this.requiredRules && (this.requiredRules = []);
    const t = new PasswordRule();
    for (const r of e.value) t.addAllowedCharacterClass(r);
    this.requiredRules.push(t);
  }
  #h(e) {
    this.allowedRule || (this.allowedRule = new PasswordRule());
    for (const t of e.value) this.allowedRule.addAllowedCharacterClass(t);
  }
  #F(e) {
    (null === this.maxConsecutiveRule && (this.maxConsecutiveRule = 1 / 0),
      (this.maxConsecutiveRule = Math.min(this.maxConsecutiveRule, e.value)));
  }
  #f(e) {
    (null === this.minLengthRule && (this.minLengthRule = 0),
      (this.minLengthRule = Math.max(this.minLengthRule, e.value)));
  }
  #g(e) {
    (null === this.minLengthRule && (this.minLengthRule = 1 / 0),
      (this.maxLengthRule = Math.min(this.maxLengthRule, e.value)));
  }
  #d() {
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
  (Element.prototype.af_setValue = function (e) {
    isContentEditableSingleLineTextbox(this)
      ? (this.textContent = e)
      : (this.value = e);
  }),
  (Element.prototype.af_value = function () {
    return isContentEditableSingleLineTextbox(this)
      ? this.textContent
      : (this.value ?? this.textContent ?? "");
  }),
  (HTMLFieldSetElement.prototype.af_setValue = function (e) {
    this.value = e;
  }),
  (HTMLFieldSetElement.prototype.af_value = function () {
    return this.value;
  }),
  (HTMLInputElement.prototype.af_setValue = function (e) {
    this.value = e;
  }),
  (HTMLInputElement.prototype.af_value = function () {
    return this.value;
  }),
  (HTMLTextAreaElement.prototype.af_setValue = function (e) {
    this.value = e;
  }),
  (HTMLTextAreaElement.prototype.af_value = function () {
    return this.value;
  }),
  (Element.prototype.traversePreviousElement = function () {
    for (var e = this.previousElementSibling; e && e.lastElementChild;)
      e = e.lastElementChild;
    return e || this.parentElement;
  }),
  (Node.prototype.traversePreviousNode = function (e) {
    if (this) {
      var t = this.previousSibling;
      if (e(t)) return null;
      for (; t && t.lastChild;) if (e((t = t.lastChild))) return null;
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
    let o = 0 === parseFloat(r.opacity) ? 6 : 2;
    var n = t.getBoundingClientRect();
    return (
      !(n.width < o) &&
      !(n.height < o) &&
      ((e._isVisible = visibilityCacheGeneration), !0)
    );
  }),
  Object.defineProperty(Array.prototype, "joinFirstItems", {
    value(e, t) {
      t > this.length && (t = this.length);
      for (var r = "", o = 0; o < t; ++o) (o > 0 && (r += e), (r += this[o]));
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
        o = e[1];
      return (r[0].x >= o[0].x && r[0].x < o[1].x) ||
        (o[0].x >= r[0].x && o[0].x < r[1].x)
        ? Math.abs(r[0].y - o[0].y)
        : (r[0].y >= o[0].y && r[0].y < o[1].y) ||
            (o[0].y >= r[0].y && o[0].y < r[1].y)
          ? Math.abs(r[0].x - o[0].x)
          : Math.sqrt(Math.min(t(r[0], o[1]), t(r[1], o[0])));
    }
    var r = [
        { x: this.left, y: this.top },
        { x: this.right, y: this.top },
      ],
      o = [
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
      a = [
        { x: e.left, y: e.top },
        { x: e.right, y: e.top },
      ],
      l = [
        { x: e.right, y: e.top },
        { x: e.right, y: e.bottom },
      ],
      s = [
        { x: e.left, y: e.bottom },
        { x: e.right, y: e.bottom },
      ],
      c = [
        { x: e.left, y: e.top },
        { x: e.left, y: e.bottom },
      ],
      u = [
        [i, c],
        [i, l],
        [r, a],
        [r, s],
        [o, c],
        [o, l],
        [n, a],
        [n, s],
      ].map(t);
    return Math.min.apply(Math, u);
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
    for (; t;) (e.push(t), (t = t.parentElementIncludingShadowDOMHost()));
    return e;
  }),
  (HTMLElement.prototype.closestCommonAncestor = function (e) {
    let t = this.parentElement;
    for (; t;) {
      if (t.contains(e)) return t;
      t = t.parentElement;
    }
    let r = this.allAncestorsAndSelfIncludingShadowDOMHosts().reverse(),
      o = e.allAncestorsAndSelfIncludingShadowDOMHosts().reverse(),
      n = Math.min(r.length, o.length),
      i = null;
    for (let e = 0; e < n; ++e) {
      if (!(r[e] === o[e])) break;
      i = r[e];
    }
    return i || null;
  }),
  (Element.prototype.isHiddenFromAccessibilityTree = function () {
    const e = 2;
    for (
      let r = 0, o = this;
      r <= e && o;
      ++r, o = o.parentElementIncludingShadowDOMHost()
    ) {
      var t = o.getAttribute("aria-hidden");
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
  #T;
  #_ = !1;
  #S = !1;
  constructor(e, t, r) {
    let o = e.length;
    var n = e[0].form,
      i = n;
    let a = e[0],
      l = e[o - 1];
    ((!t && i) || (i = 1 === o ? a : a.closestCommonAncestor(l)),
      (n && n.contains(l)) || (n = i));
    let s = i.closest(DialogOrModalSelector);
    s && (i = s);
    let c = a._provisionalLogicalFormUniqueIDForFirstControlInLogicalForm;
    (c ||
      ((c = FormMetadataJSController.nextFormUniqueID),
      (a._provisionalLogicalFormUniqueIDForFirstControlInLogicalForm = c)),
      (this._formUniqueID = c),
      (this._metadata = {}),
      (this._weakControls = Array.prototype.map.call(e, (e) => new WeakRef(e))),
      (this._weakFormElement = new WeakRef(n)),
      (this._weakBackingElement = new WeakRef(i)),
      (this.#T = new MutationObserver(this.#E.bind(this))),
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
    ((this._metadata = e), this.#w());
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
        for (var o in e) {
          var n = e[o];
          n ? (r[o] = n) : delete r[o];
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
  get hasVisibleTextEntryControls() {
    return (
      this.formElement.isVisible() &&
      this._weakControls.some((e) => {
        const t = e.deref();
        return !!t?.isVisible() && FormMetadataJS._isTextField(t);
      })
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
  #w() {
    Object.values(this.passwordControls).forEach((e) => {
      e.addEventListener(
        "input",
        () => {
          (this.#P(), (this.#S = !0));
        },
        { once: !0, passive: !0 },
      );
    });
  }
  startObservingAddedControls() {
    (this.#P(), (this.#_ = !0));
  }
  #P() {
    this.#_ ||
      this.#S ||
      this.#T.observe(document, { subtree: !0, childList: !0, attributes: !0 });
  }
  #E(e) {
    const t = this.metadata,
      r = this.passwordControls;
    let o = !1;
    for (const n of e) {
      const e = n.removedNodes;
      if (e.length && this.#S) {
        let n = new Set();
        for (const t of e) {
          for (const [e, o] of Object.entries(r))
            n.has(o) || (t.contains(o) && n.add(e));
          if (r.size === n.size) break;
        }
        if (n.size) {
          const e = t.FormControls.filter((e) => n.has(e.ControlUniqueID));
          (FormMetadataJSController.logicalFormObservedChangeIndicatingFormSubmission(
            t,
            e,
          ),
            (o = !0));
        }
      }
      const i = n.addedNodes;
      if (i.length && this.#_) {
        let e = [];
        for (const t of i)
          if (
            ((FormMetadataJS._isTextField(t) ||
              t instanceof HTMLSelectElement) &&
              e.push(t),
            t.querySelectorAll)
          ) {
            const r = t.querySelectorAll("input, textarea, select");
            for (const t of r)
              (FormMetadataJS._isTextField(t) ||
                t instanceof HTMLSelectElement) &&
                e.push(t);
          }
        if (e.length) {
          for (const r of e) {
            const e = FormMetadataJS._collectControlMetadata(
              r,
              null,
              !1,
              !1,
              !1,
              !1,
              !1,
              !1,
              this.backingElement,
            );
            t.FormControls && t.FormControls.push(e);
          }
          FormMetadataJSController.logicalFormObservedNewControlsWereAdded(t);
        }
      }
    }
    o && !this.#_ && (this.#T.disconnect(), (this.#S = !1));
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
  get numberOfVisibleFormsWithVisibleTextEntryControls() {
    return this.cachedForms().reduce(
      (e, t) => (t.hasVisibleTextEntryControls ? e + 1 : e),
      0,
    );
  }
}
class FormMetadata {
  canUseTextInputEventsToFill = !0;
  #I = null;
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
                if ("checkbox" !== e.type) return !1;
                return FormMetadataJS._labelsForElement(e).some(function (e) {
                  const t = e.innerText.trim();
                  return (
                    !(
                      !/(remember|keep) me/i.test(t) &&
                      !/remember.*checkbox/i.test(e.className)
                    ) && e.isVisible()
                  );
                });
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
          let o = "a";
          return (
            r.af_setValue(o),
            (e[t] = "" === r.af_value() ? DateTimeInputTypeFormats[t] : ""),
            e
          );
        },
        {},
      )));
  }
  get _labels() {
    null === this.#I &&
      (this.#I = Array.from(queryAllBySelector(document, "label")).map(
        (e) => new WeakRef(e),
      ));
    const e = [];
    for (const t of this.#I) {
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
  ensureElementHandle(e) {
    return (
      e._handle || (e._handle = window.webkit.createJSHandle(e)),
      e._handle
    );
  }
  _searchForLabelsAboveCell(e, t) {
    var r = window.getComputedStyle(t, null);
    if (!r || "table-cell" !== r.getPropertyValue("display")) return null;
    var o = cellVisuallyAbove(t);
    if (!o) return null;
    for (var n = 0, i = o.firstChild; i; i = i.traverseNextNode(o))
      if (i.nodeType == Node.TEXT_NODE && i.isVisible()) {
        var a = i.nodeValue,
          l = FormMetadataJSController.fieldLabelToInfo(
            new JSFieldLabelPatternMatcher(e.dfa(), a).searchReverse(),
          );
        if (l)
          return {
            Distance: n,
            Match: l[0],
            Property: l[1],
            Category: l[2],
            ParentProperty: l[3],
          };
        n += a.length;
      }
    return null;
  }
  _collectStringFromNodeForPageScan(e, t, r) {
    var o = e.nodeValue,
      n = o.length;
    return (
      r + n > PageScanMaxCharactersSearched &&
        ((o = o.substr(-(PageScanCharactersSearchedThreshold - r))),
        (n = PageScanCharactersSearchedThreshold - r)),
      (o = o.trim()).length && t.push(o),
      r
    );
  }
  _dataForComputingMatchFromPageScanBeforeElement(e, t) {
    function r(e) {
      return e && e.nodeType == Node.ELEMENT_NODE && e.matches("nav");
    }
    var o,
      n = [],
      i = 0;
    let a = this._logicalFormsCache.logicalFormForControl(e);
    if (!a) return [[], null];
    var l = a.formElement,
      s = l && l.isVisible();
    t || (t = l);
    for (
      var c = e.traversePreviousNode(r);
      c && i < PageScanCharactersSearchedThreshold;
      c = c.traversePreviousNode(r)
    ) {
      var u = c.localName;
      if (c === t) break;
      if (this._isRenderedFormControl(c)) {
        if (c.isVisible() || !s) break;
      } else {
        if (this._isLabelElement(c) && c.isVisible()) break;
        if ("td" !== u || o) {
          if ("tr" === u && o) break;
          if ("ul" === u || "ol" === u || "dl" === u) break;
          if ("li" === u) {
            if (!c.parentNode.contains(e)) break;
          } else
            c.nodeType == Node.TEXT_NODE &&
              c.isVisible() &&
              (i += this._collectStringFromNodeForPageScan(c, n, i));
        } else o = c;
      }
    }
    return [n, o];
  }
  _matchFromPageScanBeforeElement(e, t, r) {
    var o = this._pageScanContext
        ? this._pageScanContext.backwardScanCache
        : null,
      n = this._pageScanDataForElementWithCacheAndDataProducer(
        t,
        o,
        this._dataForComputingMatchFromPageScanBeforeElement.bind(this),
        r,
      ),
      i = n[0],
      a = this._matchFromPatternMatcherAndStringsFromPageScan(e, i);
    if (a) return a;
    var l = n[1];
    if (l) {
      var s = this._searchForLabelsAboveCell(e, l);
      if (s) return ((s.IsInCellAbove = !0), s);
    }
    return null;
  }
  _isElementFollowedByForgotUserNameOrEmailOrFederatedSignInAffordance(
    e,
    t,
    r,
    o,
  ) {
    (this._forgotUserNameRegularExpressions ||
      (this._forgotUserNameRegularExpressions = regularExpressionsFromStrings(
        FormMetadataJSController.regularExpressionsForForgotUserNameAffordance,
      )),
      this._forgotEmailRegularExpressions ||
        (this._forgotEmailRegularExpressions = regularExpressionsFromStrings(
          FormMetadataJSController.regularExpressionsForForgotEmailAffordance,
        )));
    const n = this._stringsToEvaluateToDetermineIfElementIsFollowedByAffordance(
      e,
      t,
      r,
      o,
    );
    if (
      stringsMatchAnyRegularExpressions(
        n,
        this._forgotUserNameRegularExpressions,
      )
    )
      return !0;
    if (
      stringsMatchAnyRegularExpressions(n, this._forgotEmailRegularExpressions)
    )
      return !0;
    let i = this._cachedFederatedSignInAffordancePatternMatcher();
    for (let e of n) if (this._matchPatternAgainstString(i, e)) return !0;
    return !1;
  }
  _isElementFollowedByForgotPasswordAffordance(e, t, r, o) {
    return (
      this._forgotPasswordRegularExpressions ||
        (this._forgotPasswordRegularExpressions = regularExpressionsFromStrings(
          FormMetadataJSController.regularExpressionsForForgotPasswordAffordance,
        )),
      stringsMatchAnyRegularExpressions(
        this._stringsToEvaluateToDetermineIfElementIsFollowedByAffordance(
          e,
          t,
          r,
          o,
        ),
        this._forgotPasswordRegularExpressions,
      )
    );
  }
  _numberOfForgotUserNameEmailOrPasswordAffordancesFollowingElement(
    e,
    t,
    r,
    o,
  ) {
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
    const n = this._stringsToEvaluateToDetermineIfElementIsFollowedByAffordance(
      e,
      t,
      r,
      o,
    );
    let i = 0;
    return (
      stringsMatchAnyRegularExpressions(
        n,
        this._forgotUserNameRegularExpressions,
      ) && i++,
      stringsMatchAnyRegularExpressions(
        n,
        this._forgotEmailRegularExpressions,
      ) && i++,
      stringsMatchAnyRegularExpressions(
        n,
        this._forgotPasswordRegularExpressions,
      ) && i++,
      i
    );
  }
  _stringsToEvaluateToDetermineIfElementIsFollowedByAffordance(e, t, r, o) {
    let n = this._dataForComputingMatchFromPageScanAfterElement(e, "A"),
      i = null;
    if (!n.length) {
      const t = e.traverseNextNode();
      if (t) {
        ((i = t),
          t instanceof Node && (i = t.parentElementIncludingShadowDOMHost()));
        const e = i.querySelector("a:not(svg a)");
        if (e) {
          const t = e.innerText;
          t?.length && n.push(t);
          const r = pathFromAnchorWithoutLeadingSlash(e);
          r?.length && n.push(r);
        }
      }
    }
    if (!n.length) {
      const e = i?.querySelector("*[tabindex]");
      if (this._looksClickableBasedOnCursorStyle(e)) {
        const t = e.innerText;
        t?.length && n.push(t);
      }
    }
    if (!n.length) {
      for (const t of r) {
        if (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) {
          const e = t.innerText;
          e?.length && n.push(e);
          const r = pathFromAnchorWithoutLeadingSlash(t);
          r?.length && n.push(r);
        }
      }
      for (const t of o) {
        if (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) {
          const e = t.innerText;
          e.length && n.push(e);
        }
      }
    }
    const a = e._weakNextControlInLogicalForm?.deref();
    if (a && "button" === a.type) {
      const e = a.innerText;
      e.length && n.push(e);
    }
    return n;
  }
  _shouldDetectStandaloneUserNameFields() {
    return "https://discord.com/channels/@me" !== window.location.href;
  }
  _dataForComputingMatchFromPageScanAfterElement(e, t, r) {
    var o = [],
      n = 0,
      i = this._logicalFormsCache.logicalFormForControl(e);
    if (!i) return [];
    var a = i.formElement,
      l = a && a.isVisible();
    let s = void 0 !== t;
    r || (r = a);
    for (
      var c = e.traverseNextNode();
      c && n < PageScanCharactersSearchedThreshold;
      c = c.traverseNextNode()
    ) {
      var u = c.localName;
      if (c === r) {
        var d = this._pageScanContext;
        d && !n && (d.forwardScanIsFutile = !0);
        break;
      }
      if (this._isRenderedFormControl(c)) {
        if (c.isVisible() || !l) break;
      } else {
        if (this._isLabelElement(c) && c.isVisible()) break;
        if ("tr" === u) break;
        if ("ul" === u || "ol" === u || "dl" === u) break;
        if (c.nodeType == Node.TEXT_NODE && c.isVisible()) {
          if (void 0 !== t && (!c.parentNode || c.parentNode.tagName !== t))
            continue;
          if (((n += this._collectStringFromNodeForPageScan(c, o, n)), s))
            break;
        }
      }
    }
    return o;
  }
  _matchFromPageScanAfterElement(e, t, r) {
    var o = this._pageScanContext
        ? this._pageScanContext.forwardScanCache
        : null,
      n = this._pageScanDataForElementWithCacheAndDataProducer(
        t,
        o,
        this._dataForComputingMatchFromPageScanAfterElement.bind(this),
        r,
      );
    return this._matchFromPatternMatcherAndStringsFromPageScan(e, n);
  }
  _pageScanDataForElementWithCacheAndDataProducer(e, t, r, o) {
    if (!t) return r(e, o);
    if ((n = t.get(e))) return n;
    var n = r(e, o);
    return (t.set(e, n), n);
  }
  _matchFromPatternMatcherAndStringsFromPageScan(e, t) {
    for (var r = t.length, o = 0, n = 0; n < r; ++n) {
      var i = t[n];
      o += i.length;
      var a = FormMetadataJSController.fieldLabelToInfo(
        new JSFieldLabelPatternMatcher(e.dfa(), i).searchReverse(),
      );
      if (a)
        return {
          Distance: o,
          Match: a[0],
          Property: a[1],
          Category: a[2],
          ParentProperty: a[3],
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
      FormMetadataJSController.fieldLabelToInfo(
        new JSFieldLabelPatternMatcher(e.dfa(), r).longestMatch(),
      )
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
    let o,
      n,
      i = e.map(function (e) {
        return e.getBoundingClientRect();
      }),
      a = e.map(function (e) {
        return e.closest(DialogOrModalSelector);
      }),
      l = e.length,
      s = 0;
    i[0].isZeroRect() ? ((o = 0), (n = null)) : ((o = 1), (n = i[0]));
    for (let h = 1; h < l; ++h) {
      let m = i[h];
      if (!m.isZeroRect()) {
        if (n) {
          let F = n.distanceToRect(m);
          F && (++o, (s += F));
        }
        n = m;
      }
    }
    if (1 === o) {
      function f(e) {
        return e.closest(`header, footer, aside, ${DialogOrModalSelector}`);
      }
      let g = [],
        C = 0;
      for (; C < l;) {
        let p = [e[C]],
          y = f(e[C]);
        for (let b = C + 1; b < l; ++b) {
          let A = e[b];
          if (y !== f(e[b])) break;
          p.push(A);
        }
        (g.push(new LogicalForm(p, t, r)), (C += p.length));
      }
      return g;
    }
    let c = o ? s / o : 0,
      u = [],
      d = 0;
    for (; d < l;) {
      let T = [e[d]],
        _ = !1,
        S = i[d].isZeroRect() ? null : i[d];
      for (let E = d + 1; E < l && a[E] === a[d]; ++E) {
        let w = e[E],
          P = i[E];
        if (!P.isZeroRect()) {
          if (_) {
            if (S && S.distanceToRect(P) > c) break;
          } else _ = couldBeFormSubmissionControl(w);
          S = P;
        }
        T.push(w);
      }
      (u.push(new LogicalForm(T, t, r)), (d += T.length));
    }
    return u;
  }
  _formLooksLikeAspnetForm(e) {
    const t = 3;
    var r = 0;
    ("aspnetForm" === e.getAttribute("id") && ++r,
      "aspnetForm" === e.getAttribute("name") && ++r);
    for (
      var o = queryAllBySelector(e, "input"), n = 0, i = o.length;
      n < i;
      ++n
    ) {
      var a = o[n],
        l = a.getAttribute("id"),
        s = a.getAttribute("name");
      (/ctl\d\d_/.test(l) && ++r,
        /ctl\d\d\$/.test(s) && ++r,
        "hidden" === a.getAttribute("type") &&
          (("__VIEWSTATE" === s && "__VIEWSTATE" === l) ||
            ("__EVENTTARGET" === s && "__EVENTTARGET" === l) ||
            ("__EVENTARGUMENT" === s && "__EVENTARGUMENT" === l) ||
            ("__LASTFOCUS" === s && "__LASTFOCUS" === l)) &&
          ++r);
    }
    for (
      var c = queryAllBySelector(document, "script"), u = c.length, d = 0;
      d < u;
      ++d
    ) {
      var h = anchorWithURLString(c[d].src);
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
    for (var o = 0, n = t.length; o < n; ++o) {
      let e = t[o];
      e.isVisible() && r.push(e);
    }
    return r;
  }
  _elementsActingAsButtonsInForm(e) {
    let t = Array.prototype.slice.call(
        queryAllBySelector(e, "input[type='submit'], input[type='image']"),
      ),
      r = queryAllBySelector(e, "a");
    for (var o = 0, n = r.length; o < n; ++o) {
      let e = r[o];
      this._anchorLooksLikeSubmitButton(e) && e.isVisible() && t.push(e);
    }
    return t;
  }
  _logicalFormsForAspnetForm(e) {
    function t(e) {
      var r = e.length;
      if (r <= 1)
        l.push(
          new LogicalForm(e, ForceNonFormElementAsLogicalBackingElement.Yes),
        );
      else {
        var o = r - 1,
          n = e[o];
        if (e[0].closestCommonAncestor(n) instanceof HTMLTableRowElement) {
          for (var i = 0; i < o; ++i) {
            if (!(e[i].closestCommonAncestor(n) instanceof HTMLTableRowElement))
              return (t(e.slice(0, i)), void t(e.slice(i)));
          }
          l.push(
            new LogicalForm(e, ForceNonFormElementAsLogicalBackingElement.Yes),
          );
        } else
          l.push(
            new LogicalForm(e, ForceNonFormElementAsLogicalBackingElement.Yes),
          );
      }
    }
    for (
      var r = this._visibleInputAndSelectElementsInForm(e),
        o = r.length,
        n = this._elementsActingAsButtonsInForm(e),
        i = n.length,
        a = 0;
      a < i;
      ++a
    ) {
      (s = n[a]).getAttribute("id") &&
        (s._aspNetIDComponents = s.getAttribute("id").split("_"));
    }
    n.sort(function (e, t) {
      var r = e._aspNetIDComponents || [];
      return (t._aspNetIDComponents || []).length - r.length;
    });
    var l = [];
    for (a = 0; a < i; ++a) {
      var s,
        c = (s = n[a])._aspNetIDComponents;
      if (c) {
        var u = c.length;
        if (!(u < 2)) {
          for (
            var d = c.joinFirstItems("_", u - 1) + "_", h = [], m = o - 1;
            m >= 0;
            --m
          ) {
            var F = r[m],
              f = F.getAttribute("id");
            f && f.startsWith(d) && (h.push(F), r.splice(m, 1));
          }
          if ((h.length && t(h.reverse()), !(o = r.length))) break;
        }
      }
    }
    return (o && t(r), l);
  }
  _logicalFormsInPage(e, t) {
    let r = [];
    const o = document.querySelector("form form");
    let n = {},
      i = o ? document.forms : queryAllBySelector(document, "form");
    const a = 400,
      l = (e) => (e.length <= a ? e : Array.from(e).slice(0, a)),
      s = (e, t, r) => {
        let o = queryAllBySelector(e, t);
        return o.length <= a ? o : l(queryAllBySelector(e, r));
      };
    let c = 0,
      u = i.length,
      d = new Set();
    for (var h = 0; h < u; ++h) {
      let a = i[h],
        u = o
          ? l(a.elements)
          : s(
              a,
              "input, select, textarea, button, fieldset, *[contenteditable]",
              "input, select, textarea, button[type='submit'], fieldset, *[contenteditable]",
            );
      for (let e of u) d.add(e);
      if (u.length) {
        if ((c++, e && c >= e)) return r;
        if (t) {
          let e = [a.method, a.name, a.action, a.className].join("|"),
            r = n[e] || 0;
          if (r > t) continue;
          n[e] = r + 1;
        }
        this._formLooksLikeAspnetForm(a)
          ? (r = r.concat(this._logicalFormsForAspnetForm(a)))
          : r.push(new LogicalForm(u));
      }
    }
    let m = [],
      F = s(
        document,
        "input, select, textarea, *[contenteditable=true][role=textbox], button",
        "input, select, textarea, *[contenteditable=true][role=textbox], button[type='submit']",
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
        o = t.getBoundingClientRect(),
        n = r[h + 1],
        i = n.backingElement,
        a = i.getBoundingClientRect();
      const l = 40;
      if (
        t.nextElementSibling === i &&
        t.action === i.action &&
        o.height &&
        a.height &&
        o.x === a.x &&
        o.width === a.width &&
        o.bottom + l >= a.top
      ) {
        let t = e.elements,
          o =
            1 ===
            t.filter(function (e) {
              return e.isVisible();
            }).length,
          i = t.includes(function (e) {
            return e.matches("input[type=submit], button") && e.isVisible();
          });
        if (o && !i) {
          let e = t.concat(n.elements),
            o = this._createLogicalFormsForControls(
              e,
              ForceNonFormElementAsLogicalBackingElement.Yes,
              LogicalFormCreationIsProvisional.Yes,
            );
          if (1 === o.length) {
            let e = o[0];
            (e.markElementsAsPartOfLogicalForm(), r.splice(h, 2, e), g--);
          }
        }
      }
    }
    return r;
  }
  _matchPatternAgainstElement(e, t, r) {
    function o(e, t) {
      if (!e) return null;
      const o = r[t] || "",
        n = sharedPrefixLength(o, e[t] || "");
      return n ? o.substr(n) : null;
    }
    function n(e, t) {
      if (!t) return null;
      const r = t.text;
      if (/^-.+-$/.test(r)) return r;
      if (!t.af_value().length && r.length) {
        const o = e.options,
          n = o.length;
        let i = !0;
        for (let e = 0; e < n; ++e) {
          const r = o[e];
          if (r !== t && !r.af_value().length) {
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
      a = r._weakNextControlInLogicalForm?.deref();
    const l = ["name", "id"],
      s = l.length;
    for (var c = new Array(s), u = new Array(s), d = 0; d < s; ++d) {
      var h = l[d];
      ((c[d] = o(i, h)), (u[d] = o(a, h)));
    }
    const m = t.length;
    for (var F = 0; F < m; ++F) {
      var f,
        g = t[F];
      for (
        d = 0;
        d < s &&
        !(f = this._matchPatternAgainstString(g, c[d])) &&
        !(f = this._matchPatternAgainstString(g, u[d])) &&
        !(f = this._matchPatternAgainstString(g, r[l[d]]));
        ++d
      );
      const o = isSelectElement(r);
      if (!f && o) {
        const e = o ? defaultOptionForSelectElement(r) : null,
          t = o ? r.options[0] : null;
        let i = n(r, e);
        (i || e === t || (i = n(r, t)),
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
      let o = t.split(" ");
      for (var r = 0; r < o.length; r++) {
        let t = getElementByID(o[r]);
        t && e._cachedLabels.push(t);
      }
    }
    if (e._cachedLabels.length) return e._cachedLabels;
    let o = function (e) {
      return e.replace(/[^a-zA-Z0-9]+/g, "");
    };
    for (let t of [e.getAttribute("id"), e.getAttribute("name")]) {
      if (!t || !t.length) continue;
      let r = [],
        n = e.form;
      for (let i of this._labels) {
        if (n === i.closest("form")) {
          let n = i.getAttribute("for");
          if (n === t) e._cachedLabels.push(i);
          else if (n) {
            let e = o(n);
            e.length > 0 && e === o(t) && r.push(i);
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
  }
  _matchesForElement(e, t, r = !1) {
    function o(e, r) {
      for (var o = 0; o < a; ++o) {
        var n = FormMetadataJSController.fieldLabelToInfo(
          new JSFieldLabelPatternMatcher(t[o].dfa(), e).searchReverse(),
        );
        if (
          n &&
          (i.push({
            FoundByPageScan: !1,
            Match: n[0].toLowerCase(),
            Property: n[1],
            Category: n[2],
            ParentProperty: n[3],
            Priority: o,
          }),
          r === ShouldStopAfterFirstMatch.StopAfterFirstMatch)
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
            Match: y.Match.toLowerCase(),
            Property: y.Property,
            Category: y.Category,
            ParentProperty: y.ParentProperty,
            Priority: T,
          }
        : t;
    }
    var i = [],
      a = t.length;
    this._matchPatternAgainstElement(i, t, e);
    for (var l = !1, s = this._labelsForElement(e), c = 0; c < s.length; ++c) {
      var u = s[c].innerText;
      u && ((l = !0), o(u, ShouldStopAfterFirstMatch.StopAfterFirstMatch));
    }
    let d = placeholderInfoForElement(e);
    d &&
      !d.AttributeMatchedWasValue &&
      o(d.Text, ShouldStopAfterFirstMatch.StopAfterFirstMatch);
    var h = e.getAttribute("title");
    h && o(h, ShouldStopAfterFirstMatch.StopAfterFirstMatch);
    var m =
      this._labelForElementIfElementAndLabelAreOnlyElementsOfTheirKindAmongSiblingElements(
        e,
      );
    m?.innerText.length &&
      ((l = !0), o(m.innerText, ShouldStopAfterFirstMatch.CollectAllMatches));
    let F = this._ariaLabelForElementOrParentOfElement(e);
    F && o(F, ShouldStopAfterFirstMatch.StopAfterFirstMatch);
    var f = e.getAttribute("formcontrolname");
    f && f.length && o(f, ShouldStopAfterFirstMatch.StopAfterFirstMatch);
    var g = this._pageScanContext,
      C = !0,
      p = !1;
    if (
      (g &&
        (g.shouldUsePageScan && (C = g.shouldUsePageScan()),
        g.reportPageScanUsedSuccessfully && (p = !0)),
      !C)
    )
      return i;
    if (l) return (p && g.reportPageScanUsedSuccessfully(!1), i);
    if (!0 === r) return i;
    for (var y, b = null, A = null, T = 0; T < a; ++T)
      ((b = n((y = this._matchFromPageScanBeforeElement(t[T], e)), b)),
        (g && g.forwardScanIsFutile) ||
          (A = n((y = this._matchFromPageScanAfterElement(t[T], e)), A)));
    var _ = !1;
    if ((b && (i.push(b), (_ = !0)), A))
      for (var S = 0, E = i.length; S < E; ++S) {
        var w = i[S];
        if (A.Priority === w.Priority) {
          (i.push(A), (_ = !0));
          break;
        }
      }
    return (
      p && g.reportPageScanUsedSuccessfully(_),
      i.length &&
        d &&
        d.AttributeMatchedWasValue &&
        o(d.Text, ShouldStopAfterFirstMatch.StopAfterFirstMatch),
      i
    );
  }
  _bestMatchFromMatches(e, t, r) {
    function o(e, t) {
      for (var r = e.length, o = {}, n = 0; n < r; ++n) {
        var i,
          a = e[n];
        switch (t) {
          case MatchCriteria.Property:
            i = a.Property || a.Match;
            break;
          case MatchCriteria.Category:
            i = a.Category || a.Match;
            break;
          case MatchCriteria.Literal:
            i = a.Match;
        }
        o[i]
          ? (o[i].Frequency += 1)
          : (o[i] = { Frequency: 1, FirstMatchObject: a });
      }
      var l = [];
      for (var s in o) l.push(o[s]);
      var c = l.sort(function (e, t) {
          return t.Frequency - e.Frequency;
        }),
        u = c.length;
      if (u <= 1) return null;
      if (t === MatchCriteria.Property)
        for (n = 0; n < u; ++n) {
          if (c[n].FirstMatchObject.ParentProperty in o)
            return c[n].FirstMatchObject;
        }
      return c[0].Frequency > c[1].Frequency ? c[0].FirstMatchObject : void 0;
    }
    var n = e.length;
    if (0 === n) return null;
    if (1 === n) return e[0];
    var i = o(e, MatchCriteria.Property);
    return (
      i ||
      ((i = o(e, MatchCriteria.Category))
        ? i
        : e.sort(function (e, t) {
            return e.Priority - t.Priority;
          })[0])
    );
  }
  _bestMatchForElement(e, t, r = !1) {
    if (!e) return null;
    var o = this._matchesForElement(e, t, r);
    return this._bestMatchFromMatches(o, e, t);
  }
  _labelForElementIfElementAndLabelAreOnlyElementsOfTheirKindAmongSiblingElements(
    e,
  ) {
    for (
      var t = null,
        r = e.tagName,
        o = siblingsIncludingSelfForElement(e),
        n = o.length,
        i = 0;
      i < n;
      ++i
    ) {
      var a = o[i];
      if (e !== a) {
        if (r === a.tagName) return null;
        if (this._isLabelElement(a)) {
          if (t) return null;
          t = a;
        }
      }
    }
    return t;
  }
  _ariaLabelForElementOrParentOfElement(e) {
    var t = e;
    let r = 3;
    for (var o = 0; o < r && t; ++o) {
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
  _oneTimeCodeProvenanceRegularExpressions(e, t) {
    let r = this[e];
    return (
      r ||
        ((r = regularExpressionsFromStrings(FormMetadataJSController[t])),
        (this[e] = r)),
      r
    );
  }
  _textMatchesOneTimeCodeProvenancePattern(e, t, r, o) {
    let n = this._cachedPatternMatchers(t)[0];
    return (
      !!FormMetadataJSController.fieldLabelToInfo(
        new JSFieldLabelPatternMatcher(n.dfa(), e).searchReverse(),
      ) ||
      !!this._oneTimeCodeProvenanceRegularExpressions(r, o).find((t) =>
        t.test(e),
      )
    );
  }
  _textMatchesOneTimeCodeEmailProvenancePattern(e) {
    return this._textMatchesOneTimeCodeProvenancePattern(
      e,
      "oneTimeCodeEmailProvenancePatternMatchers",
      "_oneTimeCodeEmailProvenanceRegularExpressions",
      "regularExpressionsForOneTimeCodeEmailProvenance",
    );
  }
  _textMatchesOneTimeCodeTextMessageProvenancePattern(e) {
    return this._textMatchesOneTimeCodeProvenancePattern(
      e,
      "oneTimeCodeTextMessageProvenancePatternMatchers",
      "_oneTimeCodeTextMessageProvenanceRegularExpressions",
      "regularExpressionsForOneTimeCodeTextMessageProvenance",
    );
  }
  _textMatchesOneTimeCodeAuthenticatorAppProvenancePattern(e) {
    return this._textMatchesOneTimeCodeProvenancePattern(
      e,
      "oneTimeCodeAuthenticatorAppProvenancePatternMatchers",
      "_oneTimeCodeAuthenticatorAppProvenanceRegularExpressions",
      "regularExpressionsForOneTimeCodeAuthenticatorAppProvenance",
    );
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
    var o = t + "_wasVisible",
      n = e[o];
    if (!0 === n) return e[t];
    var i = e.isVisible();
    if (n === i) return e[t];
    e[o] = i;
    let a = this._cachedPatternMatchers(r);
    return ((e[t] = this._bestMatchForElement(e, a)), e[t]);
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
    if (!this._isAutoFillableTextFieldOrSelectElementOrTextAreaElement(e))
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
      !!isContentEditableSingleLineTextbox(e) ||
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
    if (isContentEditableSingleLineTextbox(e)) return !0;
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
      },
      r = e.type;
    return !r || r in t;
  }
  _setSelectionStartAndEnd(e, t, r) {
    null !== e.selectionStart && null !== e.selectionEnd
      ? ((e.selectionStart = t), (e.selectionEnd = r))
      : 0 === t &&
        r === e.af_value().length &&
        "function" == typeof e.select &&
        e.select();
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
    const o = e._weakNextControlInLogicalForm?.deref();
    return (
      !!(
        (o && this._looksLikeShowHidePasswordButton(o)) ||
        userIsOnDomain("temu.com")
      ) &&
      !!this._matchesPasswordFieldLabelPattern(e) &&
      !this._isLabeledUsernameField(e) &&
      ((e._wasPreviouslySecureTextField = !0), !0)
    );
  }
  _isVerticalWritingMode(e) {
    const t = getComputedStyle(e).writingMode;
    return !("horizontal-tb" === t || "horizontal-bt" === t);
  }
  _looksClickableBasedOnCursorStyle(e) {
    const t = e?.parentElement;
    if (!t) return !1;
    const r = getComputedStyle(e).cursor;
    return "pointer" === r && r !== getComputedStyle(t).cursor;
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
  _isAutoFillableTextFieldOrSelectElementOrTextAreaElement(e) {
    return (
      !!this._isAutoFillable(e) &&
      (this._isTextField(e) || isSelectElement(e) || this._isTextArea(e))
    );
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
    const o = e.placeholder;
    let n = new RegExp("[0-9]{4}[ -][0-9]{4}[ -][0-9]{4}[ -][0-9]{4}");
    if (o && n.test(o)) return !0;
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
    return elementIDOrAutocompleteTokensHasToken(e, t, "device-eid");
  }
  _looksLikeIMEIField(e, t) {
    return elementIDOrAutocompleteTokensHasToken(e, t, "device-imei");
  }
  _looksLikeIMEI1Field(e, t) {
    return elementIDOrAutocompleteTokensHasToken(e, t, "device-imei1");
  }
  _looksLikeIMEI2Field(e, t) {
    return elementIDOrAutocompleteTokensHasToken(e, t, "device-imei2");
  }
  _looksLikeNALField(e, t) {
    return elementIDOrAutocompleteTokensHasToken(e, t, "device-nal");
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
        var o = [
            selectElementOptionsSequenceAnalysis(e, "text"),
            selectElementOptionsSequenceAnalysis(e, "value"),
          ],
          n = o.length,
          i = 0;
        i < n;
        i++
      ) {
        var a = o[i],
          l = a.lengthOfLongestSequence,
          s = a.lastNumberInSequence;
        if (l >= 11 && 12 === s) return !0;
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
      o = r.lengthOfLongestSequence,
      n = r.lastNumberInSequence;
    const i = 3;
    return o >= e.options.length - i && 1e3 < n && n < 3e3;
  }
  _isPotentialInvisibleOneTimeCodeControl(e) {
    return (
      userIsOnDomain("baidu.com") && 6 === parseInt(e.getAttribute("maxlength"))
    );
  }
  _looksLikeOneTimeCodeField(e, t, r, o, n, i, a) {
    if (
      !this._isAutoFillableTextField(e) &&
      !this._isAutoFillableSelectElement(e)
    )
      return !1;
    if (elementIDOrAutocompleteTokensHasToken(e, t, "one-time-code")) return !0;
    const l = e.type;
    if ("password" === l) {
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
      c = s ? parseInt(s) : void 0;
    if (
      isFiniteNumber(c) &&
      c >
        MaxLengthForFieldAboveWhichToTreatPotentialOneTimeCodeFieldAsRequiringHigherScrutiny
    ) {
      if (!i) return !1;
      if (
        a.ControlLooksLikeIgnoredDataTypeField ||
        a.ControlLooksLikeCreditCardCardholderField ||
        a.ControlLooksLikeCreditCardNumberField ||
        a.ControlLooksLikeCreditCardSecurityCodeField ||
        a.ControlLooksLikeCreditCardTypeField ||
        a.AddressBookLabel
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
    const d = "number" === l || "tel" === l;
    if (1 === c) {
      if (d || r || o) return !0;
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
        const r = Array.from(queryAllBySelector(t, "input")),
          o = r.length;
        if (o >= 5 && o <= 8) {
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
      if (isFiniteNumber(c)) return c;
      const e = m?.length;
      return e && e < 10 && m === m[0].repeat(e) ? e : void 0;
    })();
    if ((4 === F || 6 === F) && h) return !0;
    if (7 === c && m && /\d{3} \d{3}/.test(m)) return !0;
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
      (h && t++, r && t++, o && t++, n && t++, (4 !== F && 6 !== F) || t++);
      const i = this._cachedOneTimeCodePatternMatcher(),
        a = this._logicalFormsCache.logicalFormForControl(e);
      if (a) {
        const e = a.backingElement;
        if (e) {
          let r = !1;
          for (let o of Array.from(
            querySelectorAllIncludingWithinShadowRoots(e, "h1, h2, h3"),
          )) {
            let e = o.innerText.trim();
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
      const l = e.dataset.valRequired;
      if (
        ("string" == typeof l && this._matchPatternAgainstString(i, l) && t++,
        t >= 2)
      )
        return !0;
      const s = function (e) {
          if (this._matchPatternAgainstString(i, e)) return !0;
          const t = e.replaceAll("-", " ");
          return e !== t && this._matchPatternAgainstString(i, t);
        }.bind(this),
        c = window.location.protocol,
        u = "http:" === c || "https:" === c,
        d = lastPathComponentFromAnchor(window.location);
      if (u && d && s(d)) return !0;
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
  _looksLikeGenericAdditionalClassificationsControl(e) {
    return (
      null !==
      this._cachedElementPatternMatch(
        e,
        "_genericAdditionalClassificationPatternMatch",
        "genericAdditionalClassificationLabelPatternMatchers",
      )
    );
  }
  _looksLikeAdditionalClassificationsControl(e) {
    if (this._isAutoFillableTextFieldOrSelectElementOrTextAreaElement(e))
      return (
        null !==
        this._cachedElementPatternMatch(
          e,
          "_additionalClassificationControlPatternMatch",
          "additionalClassificationControlLabelPatternMatchers",
        )
      );
  }
  _collectTextSample(e) {
    if (!e) return "";
    var t,
      r = "",
      o = e;
    do {
      ((t = (r = o.innerText.replace(/\s+/g, " ").trim()).length),
        (o = o.parentElementIncludingShadowDOMHost()));
    } while (
      t < MaximumNumberOfCharactersToCollectForLanguageIdentification &&
      o
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
    const o = e.getAttribute("ng-pattern");
    if (!o) return null;
    if (!o.startsWith("/") || !o.endsWith("/")) return null;
    let n = regularExpressionFromUntrustedPatternAttributeString(o);
    if (!n) return null;
    let i,
      a = "a1Abbb",
      l = !1;
    for (; a.length <= t;) {
      let e = n.test(a);
      if (l && !e) return i;
      (e && ((l = !0), (i = a.length)), (a += "b"));
    }
    return null;
  }
  _collectControlMetadata(e, t, r, o, n, i, a, l, s) {
    var c = {
      ControlTagName: this._getTagName(e),
      ControlFieldName: this._getNameOrId(e),
      ControlUniqueID: this.controlUniqueID(e),
    };
    (e === innermostActiveElement() && (c.ControlIsActiveElement = !0),
      this._isAutoFilledTextField(e) && (c.ControlIsAutoFilledTextField = !0),
      e.disabled && (c.ControlIsDisabled = !0),
      e.readOnly && (c.ControlIsReadOnly = !0),
      this._isTextField(e) && (c.ControlIsTextField = !0),
      this._isSecureTextField(e) && (c.ControlIsSecureTextField = !0),
      this._isLabeledUsernameField(e) && (c.ControlIsLabeledUsernameField = !0),
      this._elementDisallowsAutocomplete(e) && (c.DisallowsAutocomplete = !0),
      this._isAutofocusedTextField(e) && (c.ControlIsAutofocusedTextField = !0),
      (c.ControlAutoFillButtonType = e.autofillButtonType),
      (c.ControlLastAutoFillButtonType = e._lastAutofillButtonType));
    const u = e.className;
    u && u.length && (c.ControlFieldClass = u);
    const d = e.id;
    d && d.length && (c.ControlFieldID = d);
    const h = e.af_value();
    h && (c.ControlValue = h);
    const m = this._associatedUsernameForControl(e);
    m && (c.ControlAssociatedUsername = m);
    const F = e.maxLength;
    if (-1 !== F) c.ControlMaxLength = F;
    else {
      const t = this._heuristicallyDeterminedMaxLength(e);
      t && (c.ControlMaxLength = t);
    }
    const f = this._explicitMinLength(e);
    f && f > 0 && (c.ControlMinLength = f);
    const g = e.size;
    (g > 0 && (c.ControlSize = g),
      e.isVisible() && (c.IsVisible = !0),
      isDateTimeInputElement(e) &&
        (c.ControlRequiredFormatForDateTimeInput =
          this._requiredFormatForDateTimeInput[e.type]));
    var C = autocompleteTokens(e);
    (C &&
      ((c.AutocompleteTokens = C),
      -1 !== C.indexOf("username")
        ? (c.ControlClaimsToBeUsernameViaAutocompleteAttribute = !0)
        : -1 !== C.indexOf("current-password")
          ? (c.ControlClaimsToBeCurrentPasswordViaAutocompleteAttribute = !0)
          : -1 !== C.indexOf("new-password") &&
            (c.ControlClaimsToBeNewPasswordViaAutocompleteAttribute = !0)),
      this._looksLikePasswordCredentialField(e) &&
        ((c.ControlLooksLikePasswordCredentialField = !0),
        this._collectExtraControlMetadata(e, c),
        c.IsVisible &&
          !r &&
          (c.IsVisible = !isElementPositionedToBeEffectivelyInvisible(e))));
    let p = t === WBSFormMetadataRequestPreFill,
      y = c.ControlIsActiveElement || !p;
    if (y) {
      const t = this._collectSelectElementInfo(e);
      (t && (c.SelectElementInfo = t),
        this._isVerticalWritingMode(e) &&
          (c.ControlIsVerticalWritingMode = !0));
      var b = placeholderInfoForElement(e);
      b && !b.AttributeMatchedWasValue && (c.ControlPlaceholder = b.Text);
      var A = e.getAttribute("type");
      A && (c.ControlType = A);
    }
    if (
      (this._looksLikeIgnoredDataTypeField(e, C)
        ? (c.ControlLooksLikeIgnoredDataTypeField = !0)
        : this._looksLikeCreditCardCardholderField(e, C)
          ? (c.ControlLooksLikeCreditCardCardholderField = !0)
          : this._looksLikeCreditCardNumberField(e, C)
            ? (c.ControlLooksLikeCreditCardNumberField = !0)
            : this._looksLikeCreditCardSecurityCodeField(e, C)
              ? (c.ControlLooksLikeCreditCardSecurityCodeField = !0)
              : this._looksLikeCreditCardTypeField(e, C) &&
                (c.ControlLooksLikeCreditCardTypeField = !0),
      y &&
        (this._looksLikeMonthField(e, C)
          ? (c.ControlLooksLikeMonthField = !0)
          : this._looksLikeYearField(e, C)
            ? (c.ControlLooksLikeYearField = !0)
            : this._looksLikeDayField(e)
              ? (c.ControlLooksLikeDayField = !0)
              : !c.ControlLooksLikeCreditCardSecurityCodeField &&
                this._looksLikeCreditCardCompositeExpirationDateField(e, C) &&
                (c.ControlLooksLikeCreditCardCompositeExpirationDateField = !0),
        this._looksLikeAdditionalClassificationsControl(e) &&
          (c.ControlIsCandidateForAdditionalClassifications = !0)),
      p ||
        (this._looksLikeEIDField(e, C)
          ? (c.ControlLooksLikeEIDField = !0)
          : this._looksLikeIMEIField(e, C)
            ? (c.ControlLooksLikeIMEIField = !0)
            : this._looksLikeIMEI1Field(e, C)
              ? (c.ControlLooksLikeIMEI1Field = !0)
              : this._looksLikeIMEI2Field(e, C)
                ? (c.ControlLooksLikeIMEI2Field = !0)
                : this._looksLikeNALField(e, C) &&
                  (c.ControlLooksLikeNALField = !0)),
      p ||
        c.ControlLooksLikeIgnoredDataTypeField ||
        c.ControlIsSecureTextField ||
        c.ControlLooksLikeCreditCardNumberField ||
        c.ControlLooksLikeCreditCardSecurityCodeField ||
        c.ControlLooksLikeCreditCardTypeField ||
        c.ControlLooksLikeCreditCardCompositeExpirationDateField ||
        c.ControlLooksLikeEIDField ||
        c.ControlLooksLikeIMEIField ||
        c.ControlLooksLikeIMEI1Field ||
        c.ControlLooksLikeIMEI2Field ||
        c.ControlLooksLikeNALField ||
        (c.AddressBookLabel = this._addressBookLabelForElement(e)),
      c.ControlIsActiveElement ||
        t === WBSFormMetadataRequestTesting ||
        t === WBSFormMetadataRequestAutomaticPasswordChange ||
        l)
    ) {
      let t = a && c.IsVisible;
      if (this._looksLikeOneTimeCodeField(e, C, o, n, i, t, c)) {
        c.ControlLooksLikeOneTimeCodeField = !0;
        if (!c.ControlLooksLikeIgnoredDataTypeField)
          for (let t of [s, document.documentElement]) {
            if (!t) continue;
            let r,
              o = t.innerText.toLowerCase(),
              n = WBSSuspectedProvenanceOfOneTimeCodeNone;
            const i = o.match(MaskedEmailAddressRegexp),
              a = this._textMatchesOneTimeCodeTextMessageProvenancePattern(o);
            if (
              (i && !a
                ? ((n |= WBSSuspectedProvenanceOfOneTimeCodeEmail), (r = i[0]))
                : this._textMatchesOneTimeCodeEmailProvenancePattern(o)
                  ? (n |= WBSSuspectedProvenanceOfOneTimeCodeEmail)
                  : a
                    ? (n |= WBSSuspectedProvenanceOfOneTimeCodeTextMessage)
                    : this._textMatchesOneTimeCodeAuthenticatorAppProvenancePattern(
                          o,
                        )
                      ? (n |=
                          WBSSuspectedProvenanceOfOneTimeCodeAuthenticatorApp)
                      : n & WBSSuspectedProvenanceOfOneTimeCodeTextMessage ||
                        !PhoneNumberRecognizer.stringContainsMaskedOrUnmaskedPhoneNumber(
                          o,
                        ) ||
                        (n |= WBSSuspectedProvenanceOfOneTimeCodeTextMessage),
              n === WBSSuspectedProvenanceOfOneTimeCodeNone &&
                (c.SuspectedProvenanceOfOneTimeCode =
                  this._provenanceOfOneTimeCodeFromControl(e)),
              r && (c.SuspectedMaskedEmailAddressForOneTimeCode = r),
              n !== WBSSuspectedProvenanceOfOneTimeCodeNone)
            ) {
              c.SuspectedProvenanceOfOneTimeCode = n;
              break;
            }
          }
      }
    }
    return (
      t === WBSFormMetadataRequestTesting &&
        globalThis.WAS &&
        (c.ControlNodePath = WAS.NodePath.fromNode(e)?.objectRepresentation),
      window.webkit?.createJSHandle &&
        (c.ControlJSHandle = this.ensureElementHandle(e)),
      c.ControlLooksLikeOneTimeCodeField &&
        1 === c.ControlMaxLength &&
        delete c.AddressBookLabel,
      c
    );
  }
  _provenanceOfOneTimeCodeFromControl(e) {
    const t = function (e) {
        return e.replace(/[\d_.-]/g, " ").replace(/[a-z][A-Z]/g, function (e) {
          return e[0] + " " + e[1];
        });
      },
      r = 3,
      o = [
        WBSSuspectedProvenanceOfOneTimeCodeEmail,
        WBSSuspectedProvenanceOfOneTimeCodeTextMessage,
        WBSSuspectedProvenanceOfOneTimeCodeAuthenticatorApp,
      ],
      n = [/\b(email|mail)\b/i, /\b(sms|rcs)\b/i, /\b(totp)\b/i];
    let i = [0, 0, 0];
    const a = e.className,
      l = e.getAttribute("name"),
      s = e.getAttribute("id");
    for (const e of [a, l, s]) {
      if (!e) continue;
      const o = t(e);
      for (let e = 0; e < r; ++e) n[e].test(o) && i[e]++;
    }
    const c = i.reduce((e, t, r, o) => (t > o[e] ? r : e), 0);
    return !i.includes(i[c], c + 1)
      ? o[c]
      : WBSSuspectedProvenanceOfOneTimeCodeNone;
  }
  _usesGeneratedPassword(e) {
    for (
      var t = !1, r = this._elementsWithGeneratedPasswords.length, o = 0;
      o < r;
      ++o
    ) {
      var n = this._elementsWithGeneratedPasswords[o];
      if (e.containsControl(n)) {
        if (n.af_value() !== this._generatedPasswords[o]) return !1;
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
    for (var t = [], r = e.options, o = r.length, n = 0; n < o; ++n) {
      var i = r[n];
      i.disabled ||
        ((i.label || i.text) && t.push([n, i.label ? i.label : i.text]));
    }
    return t.length ? t : null;
  }
  _stringsToInspectForDeterminingFormType(e) {
    let t = [],
      r = e.formElement,
      o = r.getAttribute("id"),
      n = r.getAttribute("name");
    (o && t.push(o), n && t.push(n));
    let i = queryAllBySelector(r, "legend");
    1 === i.length && t.push(i[0].innerText);
    const a = 0.8;
    if (
      1 ===
        this._logicalFormsCache
          .numberOfVisibleFormsWithVisibleTextEntryControls &&
      r.isVisible() &&
      !r.ownerDocument.defaultView.frameElement &&
      r.getBoundingClientRect().top < a * document.documentElement.clientHeight
    ) {
      let e = documentTitleWithoutHostNamePrefix();
      e && t.push(e);
      const r = lastPathComponentFromAnchor(window.location);
      r && r.length && t.push(r);
    }
    let l = [];
    if (r.isVisible()) {
      const e = r.getBoundingClientRect(),
        o = window.getComputedStyle(r),
        n = parseFloat(o.marginLeft),
        i = parseFloat(o.marginRight),
        a = n > 0 ? e.left - n : e.left,
        s = i > 0 ? e.right + i : e.right,
        c = function (t) {
          return (
            (a <= t.left && t.right <= s && t.distanceToRect(e) < 100) ||
            (Math.abs(t.left - e.left - (e.right - t.right)) < 1 &&
              t.distanceToRect(e) < 200) ||
            (Math.abs(t.left - a - (s - t.right)) < 1 &&
              t.distanceToRect(e) < 200)
          );
        };
      let u = !1,
        d = new Set();
      for (
        let e = 0, o = r;
        e <= 2 && o;
        ++e, o = o.parentElementIncludingShadowDOMHost()
      ) {
        let e = Array.prototype.slice.call(
            queryAllBySelector(
              o,
              "h1, h2, h3, [class*='header' i], [class*='heading' i]",
            ),
          ),
          r = [[], [], [], []];
        for (const t of e) {
          if (!t.innerText) continue;
          let e = t.tagName;
          "H1" === e
            ? r[0].push(t)
            : "H2" === e
              ? r[1].push(t)
              : "H3" === e
                ? r[2].push(t)
                : r[3].push(t);
        }
        let n = !0;
        for (const e of r) {
          let r = e.length;
          if (0 === r) {
            n = !1;
            continue;
          }
          if (r > 1) break;
          let o = e[0];
          if (!o.isVisible()) break;
          c(o.getBoundingClientRect()) &&
            (d.add(o), t.push(o.innerText), (u = !0));
          break;
        }
        if (n) break;
      }
      const h = 100;
      for (
        let e = r.traversePreviousElement(), o = 0;
        e && o < h;
        e = e.traversePreviousElement(), o++
      )
        if (!d.has(e) && e.matches("h1, h2, h3")) {
          const r = e.previousElementSibling;
          if (r && r.matches("h1, h2, h3")) break;
          c(e.getBoundingClientRect()) && (t.push(e.innerText), (u = !0));
          break;
        }
      if (!u) {
        let e = queryAllBySelector(document.documentElement, "h1");
        if (1 === e.length) {
          let r = e[0];
          c(r.getBoundingClientRect()) && t.push(r.innerText);
        }
      }
      for (
        let t = 0, o = r;
        t <= 2 && o;
        ++t, o = o.parentElementIncludingShadowDOMHost()
      ) {
        let t = Array.prototype.slice
          .call(
            queryAllBySelector(
              o,
              'button, input[type=submit], a[class~="button"]',
            ),
          )
          .filter(function (t) {
            if (!t.isVisible()) return !1;
            let o = t.getBoundingClientRect();
            return (
              o.top > e.bottom &&
              !r.contains(t) &&
              e.left <= o.left &&
              o.right <= e.right &&
              o.distanceToRect(e) < 100
            );
          });
        if (t.length) {
          l = t;
          break;
        }
      }
    }
    let s = !1,
      c = [],
      u = this._elementsActingAsButtonsInForm(r),
      d = [...new Set(e.elements.concat(l, u))];
    for (const e of d) {
      if (!e.matches("a")) {
        const t = e.type;
        if (("password" === t && (s = !0), "submit" !== t && "button" !== t))
          continue;
      }
      s &&
        (e.isVisible()
          ? this._addInterestingStringsForButton(e, t)
          : c.push(e));
    }
    if (0 === t.length)
      for (const e of c) this._addInterestingStringsForButton(e, t);
    return t;
  }
  _addInterestingStringsForButton(e, t) {
    const r = e.getAttribute("id");
    r && t.push(r);
    const o = e.getAttribute("value");
    o && t.push(o);
    const n = e.innerText;
    n && n.length > 0 && t.push(n);
  }
  _isPasswordFieldFollowedByPasswordRequirementText(e, t) {
    this._passwordRequirementTextCache ||
      (this._passwordRequirementTextCache = new WeakMap());
    let r = this._passwordRequirementTextCache.get(e);
    if (void 0 !== r) return r;
    let o = this._computeIsPasswordFieldFollowedByPasswordRequirementText(e, t);
    return (this._passwordRequirementTextCache.set(e, o), o);
  }
  _computeIsPasswordFieldFollowedByPasswordRequirementText(e, t) {
    let r = this._dataForComputingMatchFromPageScanAfterElement(e, void 0, t);
    if (!r.length) return !1;
    let o = r.join(" ").toLowerCase();
    return (
      this._passwordRequirementHeaderRegExp ||
        (this._passwordRequirementHeaderRegExp =
          /(your\s+)?password[s]?\s+(must|should|needs?\s+to|has\s+to)\s+(have|contain|include|be|meet)/),
      this._passwordRequirementRuleRegExp ||
        (this._passwordRequirementRuleRegExp =
          /(\d+\s*character|\d+\s*letter|one\s+(uppercase|lowercase|upper case|lower case|special|digit|number|symbol)|at least\s+(one|a|\d)|a\s+(number|digit|symbol|special)|no\s+spaces)/),
      this._passwordRequirementHeaderRegExp.test(o) &&
        this._passwordRequirementRuleRegExp.test(o)
    );
  }
  _autoFillFormTypeOfTypesUsingKeywordMatching(e, t, r, o) {
    for (var n = t.length, i = [], a = 0; a < n; ++a) {
      var l = mapOfFormTypeToProducerOfAssociatedKeywords[t[a]],
        s = l();
      i.push(s);
    }
    var c = this._stringsToInspectForDeterminingFormType(e),
      u = this._regularExpressionsIndicatingNonAutoFillableFormType;
    u ||
      ((u = regularExpressionsFromStrings(
        FormMetadataJSController.regularExpressionsIndicatingNonAutoFillableFormType,
      )),
      (this._regularExpressionsIndicatingNonAutoFillableFormType = u));
    var d = u.length,
      h = [];
    for (a = 0; a < n; ++a) h.push(0);
    if (o)
      for (const [e, r] of Object.entries(o)) h[t.indexOf(parseInt(e))] += r;
    for (var m = c.length, F = 0; F < m; ++F) {
      for (var f = c[F].toLowerCase(), g = 0; g < d; ++g)
        if (u[g].test(f))
          return {
            formType: WBSAutoFillFormTypeNonAutoFillable,
            confidence: 1,
          };
      for (a = 0; a < n; ++a) {
        s = i[a];
        for (var C in s) -1 !== f.indexOf(C) && (h[a] += s[C]);
      }
    }
    for (let r = 0; r < n; ++r) {
      const o = this._mapOfFormTypeToExtraScoreProducer[t[r]];
      h[r] += o(e);
    }
    for (a = 0; a < n; ++a) 0 !== h[a] && 0;
    var p = formActionAsAnchorElement(e.formElement, !0);
    if (p) {
      var y = p.pathname.toLowerCase() + p.search.toLowerCase();
      for (a = 0; a < n; ++a) {
        s = i[a];
        for (var C in s) -1 !== y.indexOf(C) && (h[a] += s[C]);
      }
    }
    var b = [],
      A = 0;
    for (a = 0; a < n; ++a) {
      var T = h[a];
      T > 0 && (T >= A ? ((A = T), b.unshift(a)) : b.push(a));
    }
    if (1 === b.length) return { formType: t[b[0]], confidence: 1 };
    if (b.length > 1) {
      var _ = b[0];
      if (h[_] > h[b[1]]) return { formType: t[_], confidence: 1 };
    }
    return { formType: r, confidence: 0 };
  }
  _autoFillFormTypeAndConfidence(e, t, r, o, n) {
    var { formType: i, confidence: a } =
      this._autoFillFormTypeOfTypesUsingKeywordMatching(e, t, r || o, n);
    return { formType: i, confidence: i === r ? a : 1 };
  }
  _matchesNonUsernameFieldLabelPattern(e) {
    if (
      (this._nonUsernameFieldPatternMatchers ||
        (this._nonUsernameFieldPatternMatchers =
          FormMetadataJSController.nonUsernameFieldLabelPatternMatchers),
      this._bestMatchForElement(e, this._nonUsernameFieldPatternMatchers))
    )
      return !0;
    const t = e.af_value();
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
    const t = e.af_value();
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
    var o = this._scoreForUsernameFieldCandidateFromLabelingAndPositionOfField(
      e,
      t,
      r,
    );
    return (
      e.isVisible() && (o += UsernameCandidateScoreBonusForVisibleElement),
      this._matchesNonUsernameFieldLabelPattern(e) &&
        (o -=
          UsernameCandidateScorePenaltyForMatchingNonUsernameFieldLabelPattern),
      this._matchSearchFieldLabelPattern(e) &&
        (o -= UsernameCandidateScorePenaltyForMatchingSearchFieldLabelPattern),
      e.readOnly && (o -= UsernameCandidateScorePenaltyForReadOnlyElement),
      e.id || e.name || (o -= UsernameCandidateScorePenaltyForAnonymousElement),
      o
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
    function o(e, t) {
      (r(e.alt, t), r(e.title, t), r(lastPathComponentForURLString(e.src), t));
    }
    function n(e) {
      let t = [];
      r(e.innerText, t);
      let n = queryAllBySelector(e, "img"),
        i = n.length;
      for (let e = 0; e < i; ++e) o(n[e], t);
      return t.length ? t : null;
    }
    for (
      var i = e.radioButtonsWithName(t), a = i.length, l = !1, s = {}, c = 0;
      c < a;
      ++c
    ) {
      s[(f = i[c]).af_value()] = [f.af_value()];
      for (var u = this._labelsForElement(f), d = u.length, h = 0; h < d; ++h) {
        l = !0;
        var m = n(u[h]);
        m && (s[f.af_value()] = s[f.af_value()].concat(m));
      }
    }
    if (l) return s;
    const F = 64;
    for (c = 0; c < a; ++c) {
      for (
        var f, g = "", C = (f = i[c]).traverseNextNode();
        C && !this._isRenderedFormControl(C);
        C = C.traverseNextNode()
      ) {
        var p = C.localName;
        if ("td" === p || "tr" === p || "ul" === p || "ol" === p || "dl" === p)
          break;
        if (C instanceof HTMLImageElement) o(C, s[f.af_value()]);
        else if (C.nodeType === Node.TEXT_NODE) {
          var y = C.nodeValue.trim();
          if ((y && (g += y.substr(0, F - g.length)), g.length >= F)) break;
        }
      }
      g && s[f.af_value()].push(g);
    }
    return s;
  }
  _bestUsernameFieldCandidate(e, t, r) {
    var o = t.FormControls,
      n = o.filter(function (e) {
        return e.ControlClaimsToBeUsernameViaAutocompleteAttribute;
      });
    if (1 === n.length) return n[0];
    for (
      var i = 0, a = [], l = !1, s = o.indexOf(r), c = o.length, u = 0;
      u < c;
      ++u
    ) {
      var d = o[u];
      if (d === r) {
        l = !0;
        continue;
      }
      if (!d.ControlIsTextField || d.ControlIsSecureTextField) continue;
      if (t.IsVisible && !o[u].IsVisible && !d.ControlValue) continue;
      const n = 100;
      let F = e[u];
      if (!(F.af_value().length > n)) {
        var h = u + 1 < c && u + 1 === s,
          m = this._scoreForUsernameFieldCandidate(F, l, h);
        m > i ? ((a = [u]), (i = m)) : m === i && a.push(u);
      }
    }
    var F = a.length;
    if (i < LowestScoreForLabeledUsernameFieldCandidate && F > 1) return null;
    if (i < LowestScoreForUsernameFieldCandidate) return null;
    switch (F) {
      case 0:
        return null;
      case 1:
        return o[a[0]];
      default:
        var f = e[s].getBoundingClientRect(),
          g = {};
        return (
          a.forEach(function (t) {
            g[t] = f.distanceToRect(e[t].getBoundingClientRect());
          }),
          o[
            a.sort(function (e, t) {
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
        ).formType;
      default:
        return WBSAutoFillFormTypeAutoFillableStandard;
    }
  }
  _shouldTrustElementThatClaimsToBeCurrentPasswordViaAutocompleteAttribute(e) {
    return !e.dataset.valRegexPattern;
  }
  _identifyPossibleFormTypesFromAutocompleteAttribute(e, t) {
    if (/^(.+\.)?roll20\.net\.?$/.test(document.location.hostname)) return null;
    var r = t.length;
    if (r > 3) return null;
    for (var o = [], n = [], i = 0; i < r; ++i) {
      var a = t[i];
      a.ControlClaimsToBeCurrentPasswordViaAutocompleteAttribute &&
      this._shouldTrustElementThatClaimsToBeCurrentPasswordViaAutocompleteAttribute(
        e[i],
      )
        ? o.push(i)
        : a.ControlClaimsToBeNewPasswordViaAutocompleteAttribute && n.push(i);
    }
    var l = o.length,
      s = n.length;
    if (l + s !== r) return null;
    switch (r) {
      case 0:
        return null;
      case 1:
        if (l) return WBSAutoFillFormTypeAutoFillableLogin;
        if (s) return WBSAutoFillFormTypeNewAccount;
      case 2:
        if (1 === l && 1 === s) return WBSAutoFillFormTypeChangePassword;
        if (0 === l && 2 === s) return WBSAutoFillFormTypeChangePassword;
        break;
      case 3:
        if (1 === l && 2 === s) return WBSAutoFillFormTypeChangePassword;
    }
    return null;
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
      const r = t[0];
      if (
        this._bestMatchForElement(r, this._oldPasswordPatternMatchers) ||
        (e[0].ControlClaimsToBeCurrentPasswordViaAutocompleteAttribute &&
          this._shouldTrustElementThatClaimsToBeCurrentPasswordViaAutocompleteAttribute(
            r,
          ) &&
          e[1].ControlClaimsToBeNewPasswordViaAutocompleteAttribute)
      )
        return { OldPasswordFieldIndex: 0, PasswordFieldIndex: 1 };
      return this._bestMatchForElement(t[1], this._oldPasswordPatternMatchers)
        ? { OldPasswordFieldIndex: 1, PasswordFieldIndex: 0 }
        : { PasswordFieldIndex: 0, ConfirmationFieldIndex: 1 };
    }
    var o = this._bestMatchForElement(
      t[r - 3],
      this._oldPasswordPatternMatchers,
    );
    return this._bestMatchForElement(
      t[r - 1],
      this._oldPasswordPatternMatchers,
    ) && !o
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
  _largestAdjacentPasswordFieldCluster(e, t, r) {
    const o = e.length;
    if (o < 4) return { passwordFields: e, passwordFieldsData: t };
    const n = new Set(t.map((e) => e.ControlUniqueID)),
      i = [];
    let a = null;
    for (const e of r)
      n.has(e.ControlUniqueID)
        ? (a || ((a = new Set()), i.push(a)), a.add(e.ControlUniqueID))
        : e.IsVisible &&
          (e.ControlIsTextField || e.SelectElementInfo) &&
          (a = null);
    if (i.length < 2) return { passwordFields: e, passwordFieldsData: t };
    let l = i[0];
    for (const e of i) e.size > l.size && (l = e);
    const s = [],
      c = [];
    for (let r = 0; r < o; ++r)
      l.has(t[r].ControlUniqueID) && (s.push(e[r]), c.push(t[r]));
    return { passwordFields: s, passwordFieldsData: c };
  }
  _removePlaceholderTextForFormMetadata(e, t) {
    for (var r = e.length, o = 0; o < r; ++o) {
      var n = t.FormControls[o];
      if (
        n.ControlValue &&
        n.ControlIsTextField &&
        !n.ControlIsSecureTextField &&
        !n.ControlIsReadOnly
      ) {
        var i = legacyPlaceholderInfoForInputElement(e[o]);
        i &&
          ((i.AttributeMatchedWasValue &&
            n.ControlUniqueID === t.UsernameElementUniqueID) ||
            (n.ControlValue = ""));
      }
    }
  }
  _isPasswordConfirmPair(e, t) {
    var r = this._matchesPasswordFieldLabelPattern(e),
      o = this._matchesConfirmPasswordFieldLabelPattern(t);
    return r && o;
  }
  _trailingArgumentsForCollectControlMetadataFunction(e, t, r) {
    let o = isElementPositionedToBeEffectivelyInvisible(e.backingElement),
      n = !1,
      i = !1,
      a = !1;
    if (innermostActiveElement() || t === WBSFormMetadataRequestTesting) {
      let e = documentTitleWithoutHostNamePrefix(),
        t = this._cachedOneTimeCodePatternMatcher();
      n = !!this._matchPatternAgainstString(t, e);
      let o = this._cachedLoginFormTypePatternMatcher();
      if (((i = !!this._matchPatternAgainstString(o, e)), r)) {
        let e = location.pathname.split("/"),
          o = stripCommonPrefix(r.pathname.split("/"), e)[0].join("/");
        o.length && (a = !!this._matchPatternAgainstString(t, o));
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
    return [o, a, n, i, l];
  }
  _collectFormMetadata(e, t) {
    var r,
      o,
      n =
        ((o = 0),
        {
          backwardScanCache: new WeakMap(),
          forwardScanCache: new WeakMap(),
          shouldUsePageScan: function () {
            return (
              o <
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
            !0 === r ? (o = 0) : !1 === r && o++;
          },
        });
    this._pageScanContext = n;
    var i = e.formElement,
      a = {
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
    const l = queryAllBySelector(i, "a:not(svg a)"),
      s = queryAllBySelector(i, "button"),
      c = queryAllBySelector(e.backingElement, "a:not(svg a)"),
      u = queryAllBySelector(e.backingElement, "button");
    (this._elementDisallowsAutocomplete(i) && (a.DisallowsAutocomplete = !0),
      i instanceof HTMLFormElement &&
        (a.FormIsSearchForm = this.isSearchForm(i, !0)),
      e.isAnnotated && (a.Annotations = e.annotations));
    var d = i.getAttribute("rel");
    d && "async" === d.toLowerCase() && (a.FormUsesRelAsync = !0);
    let h = formActionAsAnchorElement(i);
    if (
      (h && h.href && (a.FormAction = h.href),
      t == WBSFormMetadataRequestCollectMetadataFromDebugMenu ||
        t == WBSFormMetadataRequestTesting)
    ) {
      let e = selectorForElement(i);
      e && e.length && (a.LogicalFormElementSelector = e);
    }
    var m = e.elements,
      F = !m.some(this._isSecureTextField.bind(this));
    let [f, g, C, p, y] =
      this._trailingArgumentsForCollectControlMetadataFunction(e, t, h);
    var b = 0,
      A = !1,
      T = [],
      _ = [],
      S = [],
      E = [],
      w = void 0,
      P = void 0,
      I = void 0,
      v = void 0,
      L = !1,
      M = !1,
      x = {},
      k = [];
    let O = !1;
    for (var B = m.length, D = 0; D < B; ++D) {
      var R = m[D];
      if (
        F &&
        !R.isVisible() &&
        !R._relatesToCredentials &&
        !this._isPotentialInvisibleOneTimeCodeControl(R)
      )
        continue;
      var U = isRadioButtonElement(R),
        N = R.name;
      if (U && x[N]) continue;
      n.willStartCollectingMetadataForControl();
      const r = !O;
      var W = this._collectControlMetadata(
        R,
        t,
        f,
        g,
        C,
        p,
        y,
        r,
        e.backingElement,
      );
      if (
        (n.didFinishCollectingMetadataForControl(),
        (O = !0),
        D + 1 < B &&
          (W.ControlNextFieldUniqueID = this.controlUniqueID(m[D + 1])),
        a.FormControls.push(W),
        k.push(R),
        W.IsVisible || !a.IsVisible || R._relatesToCredentials)
      )
        if (
          (W.ControlIsActiveElement && (a.ContainsActiveElement = !0), N && U)
        )
          ((x[N] = 1),
            (W.ControlValue = ""),
            (W.RadioButtonInfo = this._collectRadioButtonInfo(e, N)));
        else if (W.ControlIsTextField || W.SelectElementInfo)
          if (
            (!M && W.ControlLooksLikeCreditCardSecurityCodeField && (M = !0),
            L ||
              (!W.ControlLooksLikeCreditCardCardholderField &&
                !W.ControlLooksLikeCreditCardNumberField))
          ) {
            if (!(
              W.ControlLooksLikeDayField ||
              W.ControlLooksLikeMonthField ||
              W.ControlLooksLikeYearField ||
              W.ControlLooksLikeCreditCardCompositeExpirationDateField
            )) {
              if (W.ControlLooksLikePasswordCredentialField) {
                if (
                  W.ControlLooksLikeCreditCardSecurityCodeField ||
                  W.ControlLooksLikeCreditCardNumberField ||
                  W.ControlLooksLikeIgnoredDataTypeField
                )
                  continue;
                R.isHiddenFromAccessibilityTree()
                  ? (S.push(R), E.push(W))
                  : (T.push(R), _.push(W));
              }
              if (this._isLabeledEmailField(R)) {
                if (++b > 2) {
                  A = !1;
                  continue;
                }
                if (!(
                  D + 1 < B &&
                  this._matchesConfirmEmailFieldLabelPattern(m[D + 1])
                ))
                  continue;
                A = !0;
              }
            }
          } else
            ((L = !0),
              (a.FirstCreditCardCardholderFieldOrCreditCardNumberFieldUniqueID =
                W.ControlUniqueID));
    }
    (!T.length && S.length && ((T = S), (_ = E)),
      ({ passwordFields: T, passwordFieldsData: _ } =
        this._largestAdjacentPasswordFieldCluster(T, _, a.FormControls)));
    let q = this._identifyPossibleFormTypesFromAutocompleteAttribute(T, _),
      K = this._identifyPasswordFieldIndices(_, T);
    if (
      (void 0 !== K.PasswordFieldIndex &&
        ((w = _[K.PasswordFieldIndex]),
        (a.PasswordElementUniqueID = w.ControlUniqueID),
        (P = this._explicitMaxLength(T[K.PasswordFieldIndex]))),
      void 0 !== K.ConfirmationFieldIndex &&
        ((I = _[K.ConfirmationFieldIndex]),
        (a.ConfirmPasswordElementUniqueID = I.ControlUniqueID),
        (v = this._explicitMaxLength(T[K.ConfirmationFieldIndex]))),
      void 0 !== K.OldPasswordFieldIndex)
    ) {
      var V = _[K.OldPasswordFieldIndex];
      a.OldPasswordElementUniqueID = V.ControlUniqueID;
    }
    var H, J;
    if (
      (w && (H = this._bestUsernameFieldCandidate(k, a, w)),
      H
        ? (a.UsernameElementUniqueID = H.ControlUniqueID)
        : (J = this._findHiddenUsernameElement(e, a, k)),
      1 === T.length && A)
    )
      a.AutoFillFormType = this._autoFillFormTypeOfTypesUsingKeywordMatching(
        e,
        [WBSAutoFillFormTypeNewAccount, WBSAutoFillFormTypeChangePassword],
        WBSAutoFillFormTypeNewAccount,
      ).formType;
    else if (a.UsernameElementUniqueID)
      switch (T.length) {
        case 0:
          break;
        case 1:
          if (
            M &&
            a.UsernameElementUniqueID ===
              a.FirstCreditCardCardholderFieldOrCreditCardNumberFieldUniqueID &&
            _[0].ControlLooksLikeCreditCardNumberField
          )
            break;
          if (this._matchesConfirmPasswordFieldLabelPattern(T[0])) {
            let t = {};
            this._isElementFollowedByForgotPasswordAffordance(R, i, l, s) &&
              (t[WBSAutoFillFormTypeAutoFillableLogin] = 2);
            const { formType: r, confidence: o } =
              this._autoFillFormTypeAndConfidence(
                e,
                [
                  WBSAutoFillFormTypeNewAccount,
                  WBSAutoFillFormTypeChangePassword,
                ],
                q,
                WBSAutoFillFormTypeAutoFillableLogin,
                t,
              );
            ((a.AutoFillFormType = r), (a.AutoFillFormTypeConfidence = o));
          } else {
            let t = T[0],
              r = {};
            const o =
              2 *
              this._numberOfForgotUserNameEmailOrPasswordAffordancesFollowingElement(
                t,
                e.backingElement,
                c,
                u,
              );
            o && (r[WBSAutoFillFormTypeAutoFillableLogin] = o);
            const { formType: n, confidence: i } =
              this._autoFillFormTypeAndConfidence(
                e,
                [
                  WBSAutoFillFormTypeNewAccount,
                  WBSAutoFillFormTypeAutoFillableLogin,
                ],
                q,
                WBSAutoFillFormTypeAutoFillableLogin,
                r,
              );
            ((a.AutoFillFormType = n), (a.AutoFillFormTypeConfidence = i));
          }
          break;
        case 2:
          if (P === v) {
            const { formType: t, confidence: r } =
              this._autoFillFormTypeAndConfidence(
                e,
                [
                  WBSAutoFillFormTypeNewAccount,
                  WBSAutoFillFormTypeChangePassword,
                ],
                q,
                WBSAutoFillFormTypeNewAccount,
              );
            ((a.AutoFillFormType = t), (a.AutoFillFormTypeConfidence = r));
          } else
            v
              ? this._isPasswordConfirmPair(T[0], T[1])
                ? (a.AutoFillFormType =
                    this._autoFillFormTypeOfTypesUsingKeywordMatching(
                      e,
                      [
                        WBSAutoFillFormTypeNewAccount,
                        WBSAutoFillFormTypeChangePassword,
                      ],
                      WBSAutoFillFormTypeNonAutoFillable,
                    ).formType)
                : (a.AutoFillFormType = WBSAutoFillFormTypeNonAutoFillable)
              : (a.AutoFillFormType =
                  this._autoFillFormTypeOfTypesUsingKeywordMatching(
                    e,
                    [
                      WBSAutoFillFormTypeNewAccount,
                      WBSAutoFillFormTypeChangePassword,
                    ],
                    WBSAutoFillFormTypeNonAutoFillable,
                  ).formType);
          break;
        case 3:
          P === v ||
          !v ||
          this._isPasswordConfirmPair(
            T[K.PasswordFieldIndex],
            T[K.ConfirmationFieldIndex],
          )
            ? (a.AutoFillFormType = WBSAutoFillFormTypeChangePassword)
            : (a.AutoFillFormType = WBSAutoFillFormTypeNonAutoFillable);
          break;
        default:
          a.AutoFillFormType = WBSAutoFillFormTypeNonAutoFillable;
      }
    else if (2 === T.length || 3 === T.length)
      if (P !== v && v)
        2 === T.length
          ? this._isPasswordConfirmPair(T[0], T[1])
            ? (a.AutoFillFormType =
                this._autoFillFormTypeOfTypesUsingKeywordMatching(
                  e,
                  [
                    WBSAutoFillFormTypeNewAccount,
                    WBSAutoFillFormTypeChangePassword,
                  ],
                  WBSAutoFillFormTypeNonAutoFillable,
                ).formType)
            : (a.AutoFillFormType = WBSAutoFillFormTypeNonAutoFillable)
          : this._isPasswordConfirmPair(
                T[K.PasswordFieldIndex],
                T[K.ConfirmationFieldIndex],
              )
            ? (a.AutoFillFormType = WBSAutoFillFormTypeChangePassword)
            : (a.AutoFillFormType = WBSAutoFillFormTypeNonAutoFillable);
      else {
        let t = {};
        (this._isPasswordConfirmPair(
          T[K.PasswordFieldIndex],
          T[K.ConfirmationFieldIndex],
        ) && (t[WBSAutoFillFormTypeChangePassword] = 2),
          (a.AutoFillFormType =
            this._autoFillFormTypeOfTypesUsingKeywordMatching(
              e,
              [
                WBSAutoFillFormTypeNewAccount,
                WBSAutoFillFormTypeChangePassword,
              ],
              WBSAutoFillFormTypeChangePassword,
              t,
            ).formType));
      }
    else if (1 === T.length) {
      var G = T[0];
      let t = {
        [WBSAutoFillFormTypeNewAccount]: 0,
        [WBSAutoFillFormTypeAutoFillableLogin]: 0,
        [WBSAutoFillFormTypeChangePassword]: 0,
      };
      this._isElementFollowedByForgotPasswordAffordance(R, i, l, s) &&
        (t[WBSAutoFillFormTypeAutoFillableLogin] = 2);
      const r = !0;
      if (this._matchesConfirmPasswordFieldLabelPattern(G, r))
        ((t[WBSAutoFillFormTypeChangePassword] += 2),
          this._isPasswordFieldFollowedByPasswordRequirementText(G, i) &&
            (t[WBSAutoFillFormTypeChangePassword] += 4),
          (a.AutoFillFormType =
            this._autoFillFormTypeOfTypesUsingKeywordMatching(
              e,
              [
                WBSAutoFillFormTypeAutoFillableLogin,
                WBSAutoFillFormTypeChangePassword,
              ],
              WBSAutoFillFormTypeChangePassword,
              t,
            ).formType));
      else if (this._matchesPasswordFieldLabelPattern(G))
        if (this._isElementFollowedByForgotPasswordAffordance(G, i, l, s))
          a.AutoFillFormType = WBSAutoFillFormTypeAutoFillableLogin;
        else {
          var j = [
            WBSAutoFillFormTypeNewAccount,
            WBSAutoFillFormTypeAutoFillableLogin,
            WBSAutoFillFormTypeChangePassword,
          ];
          (this._isPasswordFieldFollowedByPasswordRequirementText(G, i) &&
            ((t[WBSAutoFillFormTypeNewAccount] += 4),
            (t[WBSAutoFillFormTypeChangePassword] += 4)),
            (a.AutoFillFormType =
              this._autoFillFormTypeOfTypesUsingKeywordMatching(
                e,
                j,
                WBSAutoFillFormTypeNonAutoFillable,
                t,
              ).formType),
            a.AutoFillFormType === WBSAutoFillFormTypeNonAutoFillable &&
              J &&
              (a.AutoFillFormType = WBSAutoFillFormTypeNewAccount));
        }
      else a.AutoFillFormType = WBSAutoFillFormTypeNonAutoFillable;
    } else
      0 !== T.length &&
        (a.AutoFillFormType = WBSAutoFillFormTypeNonAutoFillable);
    if (
      a.AutoFillFormType === WBSAutoFillFormTypeAutoFillableStandard &&
      this._shouldDetectStandaloneUserNameFields()
    ) {
      var z = null,
        Y = null,
        X = null,
        Z = 0,
        $ = k.length;
      for (D = 0; D < $; ++D) {
        R = k[D];
        var Q = a.FormControls[D],
          ee = Q.IsVisible;
        if ((ee && Q.ControlIsTextField && Z++, Z > 1)) break;
        if (R.closest("footer")) continue;
        let t = { [WBSAutoFillFormTypeAutoFillableLogin]: 0 };
        this._isElementFollowedByForgotUserNameOrEmailOrFederatedSignInAffordance(
          R,
          i,
          l,
          s,
        ) && (t[WBSAutoFillFormTypeAutoFillableLogin] += 2);
        !!this._matchPatternAgainstString(
          this._cachedLoginFormTypePatternMatcher(),
          documentTitleWithoutHostNamePrefix(),
        ) && (t[WBSAutoFillFormTypeAutoFillableLogin] += 1);
        var te = this._isLabeledEmailField(R);
        if (
          ee &&
          (Q.ControlClaimsToBeUsernameViaAutocompleteAttribute ||
            Q.ControlIsLabeledUsernameField ||
            te ||
            this._isLabeledLoginField(R)) &&
          !this._matchesNonUsernameFieldLabelPattern(R) &&
          !this._matchSearchFieldLabelPattern(R) &&
          !R.readOnly &&
          "INPUT" === R.tagName &&
          !this._isLabeledSignUpField(R)
        ) {
          this._autoFillFormTypeOfTypesUsingKeywordMatching(
            e,
            [
              WBSAutoFillFormTypeNewAccount,
              WBSAutoFillFormTypeAutoFillableLogin,
            ],
            te
              ? WBSAutoFillFormTypeNewAccount
              : WBSAutoFillFormTypeAutoFillableLogin,
            t,
          ).formType === WBSAutoFillFormTypeAutoFillableLogin &&
            ((z = R), (Y = Q), (X = WBSAutoFillFormTypeAutoFillableLogin));
        }
        const r = Q.AutocompleteTokens;
        if (r) {
          const o = r.includes("username"),
            n = r.includes("email");
          if (r.includes("webauthn") && (o || n)) {
            ((z = R), (Y = Q), (X = WBSAutoFillFormTypeAutoFillableLogin));
            continue;
          }
          o &&
            te &&
            ((z = R),
            (Y = Q),
            (X = this._autoFillFormTypeOfTypesUsingKeywordMatching(
              e,
              [
                WBSAutoFillFormTypeNewAccount,
                WBSAutoFillFormTypeAutoFillableLogin,
              ],
              WBSAutoFillFormTypeAutoFillableLogin,
              t,
            ).formType));
        }
      }
      1 === Z &&
        Y &&
        X &&
        !controlAppearsToBePartOfPhotoTaggingInterface(z) &&
        ((a.AutoFillFormType = X),
        (a.UsernameElementUniqueID = Y.ControlUniqueID));
    }
    ((a.IsVisible ||= a.FormControls.some((e) => e.IsVisible)),
      a.AutoFillFormType === WBSAutoFillFormTypeNewAccount &&
        a.FirstCreditCardCardholderFieldOrCreditCardNumberFieldUniqueID ===
          a.UsernameElementUniqueID &&
        (a.UsernameElementUniqueID = void 0),
      !a.UsernameElementUniqueID &&
        J &&
        this._extractMetadataForHiddenUsernameElement(J, a, k),
      a.AutoFillFormType != WBSAutoFillFormTypeAutoFillableLogin &&
        a.AutoFillFormType != WBSAutoFillFormTypeNewAccount &&
        a.AutoFillFormType != WBSAutoFillFormTypeChangePassword &&
        t !== WBSFormMetadataRequestAutomaticPasswordChange &&
        ((a.UsernameElementUniqueID = void 0),
        (a.OldPasswordElementUniqueID = void 0),
        (a.PasswordElementUniqueID = void 0),
        (a.ConfirmPasswordElementUniqueID = void 0)),
      a.AutoFillFormType === WBSAutoFillFormTypeChangePassword &&
        a.PasswordElementUniqueID &&
        !a.OldPasswordElementUniqueID &&
        1 === T.length &&
        (this._oldPasswordPatternMatchers ||
          (this._oldPasswordPatternMatchers =
            FormMetadataJSController.oldPasswordFieldLabelPatternMatchers),
        this._bestMatchForElement(T[0], this._oldPasswordPatternMatchers) &&
          ((a.OldPasswordElementUniqueID = a.PasswordElementUniqueID),
          (a.PasswordElementUniqueID = void 0))),
      a.IsVisible ||
        a.AutoFillFormType == WBSAutoFillFormTypeAutoFillableLogin ||
        a.AutoFillFormType == WBSAutoFillFormTypeNewAccount ||
        a.AutoFillFormType == WBSAutoFillFormTypeChangePassword ||
        (a.AutoFillFormType = WBSAutoFillFormTypeNonAutoFillable),
      t !== WBSFormMetadataRequestPreFill &&
        (a.TextSample = this._collectTextSample(e.formElement)),
      (a.FormIsEligibleForAutomaticLogin =
        this._formIsEligibleForAutomaticLogin(a, e.backingElement)));
    let re = !1;
    for (let e of a.FormControls)
      if (
        e.ControlLooksLikeOneTimeCodeField &&
        ((re = !0), this._oneTimeCodeIsEligibleForAutomaticLogin(e, a))
      ) {
        e.OneTimeCodeIsEligibleForAutomaticLogin = !0;
        break;
      }
    if (re) {
      const e = function (e) {
        (delete e.ControlLooksLikeOneTimeCodeField,
          delete e.SuspectedProvenanceOfOneTimeCode,
          delete e.SuspectedMaskedEmailAddressForOneTimeCode);
      };
      let t = [],
        r = [];
      const o = a.FormControls.length;
      for (D = 0; D < o; ++D) {
        const o = a.FormControls[D],
          n = o.SuspectedProvenanceOfOneTimeCode;
        (n && n !== WBSSuspectedProvenanceOfOneTimeCodeNone && t.push(o),
          (o.ControlLooksLikeCreditCardNumberField ||
            o.ControlLooksLikeCreditCardSecurityCodeField ||
            o.ControlLooksLikeCreditCardTypeField ||
            o.ControlLooksLikeCreditCardCompositeExpirationDateField) &&
            r.push(o),
          a.FormControls[D - 1]?.AddressBookLabel &&
            o.AddressBookLabel &&
            a.FormControls[D + 1]?.AddressBookLabel &&
            e(o));
      }
      if (r.length >= 2) for (let r of t) e(r);
    }
    if (a.IsVisible && !FormMetadataJSController.collectAllFields)
      for (D = ($ = k.length) - 1; D >= 0; --D)
        this._shouldIncludeControlMetadata(a, k[D], a.FormControls[D]) ||
          (t !== WBSFormMetadataRequestCollectMetadataFromDebugMenu
            ? (a.FormControls.splice(D, 1), k.splice(D, 1))
            : (a.FormControls[D].WOULD_NORMALLY_NOT_BE_SENT_TO_UI_PROCESS =
                !0));
    return (
      this._removePlaceholderTextForFormMetadata(k, a),
      delete this._pageScanContext,
      t !== WBSFormMetadataRequestPreFill &&
        globalThis.FormMetadataClassificationJS &&
        globalThis.FormMetadataClassificationJS.classify(a),
      this._markFormIsCandidateForAdditionalClassifications(
        a,
        e.backingElement,
      ),
      addPasswordRequirementsToFormMetadata(a),
      a
    );
  }
  _markFormIsCandidateForAdditionalClassifications(e, t) {
    if (!e.IsVisible) return;
    if (
      e.AutoFillFormType === WBSAutoFillFormTypeAutoFillableLogin ||
      e.AutoFillFormType === WBSAutoFillFormTypeChangePassword
    )
      return;
    let r = 0;
    for (const t of e.FormControls) {
      if (!t.IsVisible) continue;
      const o = t.ControlUniqueID,
        n = this.formControlWithUniqueID(o);
      n &&
        this._isAutoFillableTextFieldOrSelectElementOrTextAreaElement(n) &&
        (isCredentialElementUniqueID(e, o) ||
          this._matchSearchFieldLabelPattern(n) ||
          (this._looksLikeGenericAdditionalClassificationsControl(n) && r++));
    }
    r < 1 || (e.FormIsCandidateForAdditionalClassifications = !0);
  }
  _formIsEligibleForAutomaticLogin(e, t) {
    if (e.AutoFillFormType !== WBSAutoFillFormTypeAutoFillableLogin) return !1;
    let r = !1;
    for (const t of e.FormControls) {
      const o = t.ControlUniqueID;
      if (o === e.UsernameElementUniqueID || o === e.PasswordElementUniqueID)
        continue;
      if (t.ControlIsDisabled) continue;
      if (t.ControlIsReadOnly) continue;
      if (!t.IsVisible) continue;
      const n = this.formControlWithUniqueID(o);
      if (!n) continue;
      if (this._isTextArea(n)) return !1;
      if (isSelectElement(n)) return !1;
      if (this._isSubmitButton(n)) continue;
      if (this._looksLikeShowHidePasswordButton(n)) continue;
      if (!isInputElement(n)) continue;
      const i = n.type;
      if ("button" !== i && "reset" !== i && "submit" !== i && "image" !== i) {
        if (!this._isCheckboxInputElement(n)) return !1;
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
    if (
      isContentEditableSingleLineTextbox(t) &&
      !r.ControlLooksLikeOneTimeCodeField
    )
      return !1;
    if (t._relatesToCredentials) return !0;
    if (r.IsVisible) {
      if (formControlHasBeenClassifiedInAnInterestingWay(r)) return !0;
      if (r.ControlValue) return !0;
    } else if (
      this._isPotentialInvisibleOneTimeCodeControl(t) &&
      r.ControlLooksLikeOneTimeCodeField
    )
      return !0;
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
      !!isValidUsernameOrEmail(e.af_value())
    );
  }
  _findHiddenUsernameElement(e, t, r) {
    var o = e.formElement;
    if (!(o instanceof HTMLElement)) return;
    let n = queryAllBySelector(o, "input"),
      i = n.length;
    for (let e = 0; e < i; ++e) {
      let t = n[e];
      if (this._isElementAHiddenUsername(t)) return t;
    }
    return null;
  }
  _extractMetadataForHiddenUsernameElement(e, t, r) {
    var o = {
      ControlTagName: this._getTagName(e),
      ControlFieldName: this._getNameOrId(e),
      ControlUniqueID: this.controlUniqueID(e),
      ControlIsReadOnly: !0,
      ControlValue: e.af_value(),
    };
    (window.webkit?.createJSHandle &&
      (o.ControlJSHandle = this.ensureElementHandle(e)),
      (t.UsernameElementUniqueID = o.ControlUniqueID),
      t.FormControls.push(o),
      r.push(e));
  }
  _cachedMetadataForLogicalForm(e) {
    var t = e.metadata,
      r = t?.FormControls,
      o = r?.length ?? 0;
    if (!o) return null;
    const n = innermostActiveElement();
    for (var i = 0; i < o; ++i) {
      var a = r[i],
        l = this.formControlWithUniqueID(a.ControlUniqueID);
      l &&
        ((a.ControlIsActiveElement = l === n),
        (a.ControlValue = l.af_value()),
        (a.ControlIsAutoFilledTextField = this._isAutoFilledTextField(l)));
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
      var o = r.PasswordElementUniqueID ? 0 : -1;
      return e(r.AutoFillFormType) + t(r.IsVisible) + o;
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
      let o = e.AutoFillFormType === WBSAutoFillFormTypeAutoFillableLogin,
        n = 0,
        i = e.FormControls,
        a = i.length;
      for (var l = 0; l < a; ++l) {
        let t = i[l],
          r = FormMetadataJS.formControlWithUniqueID(t.ControlUniqueID);
        if (!r) continue;
        const a = parseInt(r.tabIndex, 10);
        if (!(isFiniteNumber(a) && a < 0)) {
          if (o) {
            t.ControlIsAutofocusedTextField && (n += 1);
            let r = t.ControlUniqueID;
            if (
              r === e.UsernameElementUniqueID ||
              r === e.PasswordElementUniqueID
            ) {
              n += 10;
              continue;
            }
          }
          t.OneTimeCodeIsEligibleForAutomaticLogin && (n += 5);
        }
      }
      return n;
    });
    null !== e && (e.metadata.FormIsBestForStreamlinedLogin = !0);
  }
  _logicalFormWithHighestScoreIfGreaterThanZero(e) {
    let t = null,
      r = null;
    for (let n of this._logicalFormsCache.allForms()) {
      var o = e(n.metadata, n.backingElement);
      (null === t || o > t) && ((r = n), (t = o));
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
    var o = this._logicalFormsInPage(t, r);
    this._logicalFormsCache.clearCacheAndAdd(o);
    for (var n = o.length, i = 0; i < n; ++i)
      o[i].metadata = this._collectFormMetadata(o[i], e);
    (this._markFormIsBestForPageLevelAutoFill(),
      e !== WBSFormMetadataRequestNormal &&
        e !== WBSFormMetadataRequestAutomaticPasswordChange &&
        this._markFormIsBestForStreamlinedLogin());
  }
  _collectAndCacheFormMetadata(e, t) {
    let r = this._collectFormMetadata(e, t),
      o = this._logicalFormsCache.logicalFormWithUniqueID(e.formUniqueID);
    return (
      o
        ? (o.metadata = r)
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
    const o = !0;
    await this._fillControl(e, t, o);
  }
  async fillFormWithPassword(e, t, r) {
    var o = this._metadataForFormWithID(e);
    if (null === o) return null;
    const n = o.PasswordElementUniqueID,
      i = n ? this.formControlWithUniqueID(n) : void 0,
      a = r ? this.formControlWithUniqueID(r) : void 0;
    var l = i || a;
    const s = n || r;
    if (!l) return null;
    await this._fillControlWithGeneratedPassword(l, t);
    let c = o.ConfirmPasswordElementUniqueID;
    c ||
      (o.AutoFillFormType !== WBSAutoFillFormTypeChangePassword &&
        o.AutoFillFormType !== WBSAutoFillFormTypeNewAccount) ||
      (c = (o = this._recollectMetadataForFormWithID(e) || o)
        .ConfirmPasswordElementUniqueID);
    let u = c ? this.formControlWithUniqueID(c) : null;
    return u
      ? (await this._fillControlWithGeneratedPassword(u, t), [s, c])
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
    if (isDateTimeInputElement(e)) return void e.af_setValue("");
    if (isRadioButtonElement(e)) {
      const t = this._logicalFormsCache
        .logicalFormForControl(e)
        .radioButtonsWithName(e.name);
      for (let e of t) e.checked = !1;
      return;
    }
    if (!this._isTextField(e)) return;
    if (!e.af_value().length) return;
    let r = innermostActiveElement();
    (e !== r && e.focus({ preventScroll: !0, focusVisible: !1 }),
      e.select(),
      e.dispatchEvent(new Event("select", { bubbles: !0, cancelable: !1 })));
    const o = KeyInfo.BackspaceKeyInfo;
    e.dispatchEvent(o.keyEvent("keydown"));
    const n = "deleteContentBackward";
    (e.dispatchEvent(
      new InputEvent("beforeinput", {
        bubbles: !0,
        cancelable: !0,
        inputType: n,
        data: null,
      }),
    ),
      e.af_setValue(""),
      e.dispatchEvent(
        new InputEvent("input", {
          bubbles: !0,
          cancelable: !1,
          inputType: n,
          data: null,
        }),
      ),
      e.dispatchEvent(o.keyEvent("keyup")),
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
  focusControl(e, t = !1) {
    const r = this.formControlWithUniqueID(e);
    r && (t ? this._focusControlForStreamlinedLogin(r) : r.focus());
  }
  _focusControlForStreamlinedLogin(e) {
    e && rectIsWithinDocumentViewport(e.getBoundingClientRect()) && e.focus();
  }
  formsAndMetadata(e) {
    (invalidateVisibilityCache(), this._collectMetadata(e));
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
  startObservingDynamicallyAddedControls() {
    const e = this._logicalFormsCache.allForms();
    for (const t of e) t.startObservingAddedControls();
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
          o = r?.FormControls,
          n = o?.length ?? 0,
          i = e._controlUniqueID,
          a = 0;
        a < n;
        ++a
      )
        if (o[a].ControlUniqueID === i) return t;
    var l = this._logicalFormsInPage(),
      s = l.length;
    for (a = 0; a < s; ++a) {
      var c = l[a];
      if (c.containsControl(e))
        return (
          this._logicalFormsCache.addOrUpdate(c),
          (c.metadata = this._collectFormMetadata(
            c,
            WBSFormMetadataRequestNormal,
          )),
          c
        );
    }
    return null;
  }
  _cachedMetadataForFormWithTextFieldOrSelectElement(e, t) {
    if (
      !this._isTextField(e) &&
      !isSelectElement(e) &&
      !isContentEditableSingleLineTextbox(e)
    )
      return null;
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
        var o = e._controlUniqueID;
        (this._isCurrentPasswordElementUniqueID(r, o)
          ? t.annotate({ CurrentPassword: e.af_value() })
          : this._isNewPasswordElementUniqueID(r, o)
            ? t.annotate({ NewPassword: e.af_value() })
            : r.UsernameElementUniqueID === o &&
              t.annotate({ Username: e.af_value() }),
          isCredentialElementUniqueID(r, o) &&
            (e._relatesToCredentials = "" !== e.af_value()));
      }
    }
  }
  textFieldOrSelectElementMetadata(e, t) {
    (invalidateVisibilityCache(),
      this._logicalFormsCache.removeUnparentedLogicalFormsFromCache());
    var r = [null, null],
      o = this._cachedMetadataForFormWithTextFieldOrSelectElement(e, t);
    if (!o) return r;
    this._pageScanContext = {
      backwardScanCache: new WeakMap(),
      forwardScanCache: new WeakMap(),
    };
    let n = this._logicalFormsCache.logicalFormWithUniqueID(o.FormID),
      i = formActionAsAnchorElement(n.formElement),
      [a, l, s, c, u] =
        this._trailingArgumentsForCollectControlMetadataFunction(n, t, i);
    const d = !0;
    var h = this._collectControlMetadata(
      e,
      WBSFormMetadataRequestNormal,
      a,
      l,
      s,
      c,
      u,
      d,
      n.backingElement,
    );
    if (
      (delete this._pageScanContext,
      h.ControlLooksLikeOneTimeCodeField &&
        this._oneTimeCodeIsEligibleForAutomaticLogin(h, o) &&
        (h.OneTimeCodeIsEligibleForAutomaticLogin = !0),
      (h.SelectionStart = e.selectionStart),
      (h.SelectionLength = e.selectionEnd - e.selectionStart),
      t === WBSFormMetadataRequestTextChange &&
        (!o.UsernameElementUniqueID &&
          this._isAnyPasswordElementUniqueID(o, h.ControlUniqueID) &&
          n.isAnnotated &&
          n.annotate({ Username: null }),
        this._updateAnnotationsForField(e)),
      o.RequestType !== WBSFormMetadataRequestPreFill)
    )
      for (let e of o.FormControls)
        if (h.ControlUniqueID === e.ControlUniqueID) {
          ((h.ControlClassification = e.ControlClassification),
            (h.ControlClassificationHints = e.ControlClassificationHints),
            (h.ControlOrderedParts = e.ControlOrderedParts),
            (h.ControlContinuationID = e.ControlContinuationID),
            (h.ControlContinuationIndex = e.ControlContinuationIndex),
            (h.ControlNextFieldUniqueID = e.ControlNextFieldUniqueID),
            (h.ControlJSHandle = e.ControlJSHandle));
          break;
        }
    return ((r[0] = h), (r[1] = o), r);
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
    var o = this.formControlWithUniqueID(e);
    o && this._isTextField(o) && this._setSelectionStartAndEnd(o, t, t + r);
  }
  replaceFormFieldRangeAndSelectTail(e, t, r, o, n) {
    var i = this.formControlWithUniqueID(e);
    if (i && this._isTextField(i)) {
      var a = i.af_value(),
        l = a.substr(0, t) + o + a.substr(t + r);
      (i.af_setValue(l),
        this._setSelectionStartAndEnd(i, n, l.length),
        i.dispatchEvent(createCustomEventThatBubbles("input")),
        i.dispatchEvent(createCustomEventThatBubbles("change")));
    }
  }
  _collectVisibleNonEmptyTextFieldsAndTextAreasInForm(e, t, r) {
    invalidateVisibilityCache();
    for (
      var o = elementsInFormPiercingShadowDOM(e), n = o.length, i = 0;
      i < n;
      ++i
    ) {
      var a = o[i];
      a.isVisible() &&
        null != a.af_value() &&
        a.af_value().length &&
        (this._isTextField(a) ? t.push(a) : this._isTextArea(a) && r.push(a));
    }
  }
  visibleNonEmptyFormTextControls() {
    var e = [],
      t = [];
    let r = queryAllBySelector(document, "form");
    for (let o = 0; o < r.length; ++o)
      this._collectVisibleNonEmptyTextFieldsAndTextAreasInForm(r[o], e, t);
    return [e, t];
  }
  async _fillRadioButtonInGroupStartingWithControl(e, t) {
    const r = this._logicalFormsCache.logicalFormForControl(e);
    let o = r?.radioButtonsWithName(e.name);
    if (!o) return null;
    for (let e of o)
      if (e.af_value() === t)
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
    let r = [...e.af_value().normalize()],
      o = [...t.normalize()];
    if (r.length < o.length) return !1;
    for (let e of r) {
      e === o[0] && o.shift();
    }
    return !o.length;
  }
  async _fillSelectControlWithBestOptionFromSynonyms(e, t) {
    const r = this._collectSelectElementInfo(e),
      o = FormMetadataUtilitiesJS.bestIndexToFillSelectControl(r, t);
    -1 !== o &&
      e.selectedIndex !== o &&
      (e.dispatchEvent(createCustomEventThatBubbles("focus")),
      e.dispatchEvent(createCustomEventThatBubbles("pointerdown")),
      e.dispatchEvent(createCustomEventThatBubbles("mousedown")),
      (e.selectedIndex = o),
      e.dispatchEvent(new InputEvent("input", { bubbles: !0, cancelable: !1 })),
      e.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !1 })),
      e.dispatchEvent(createCustomEventThatBubbles("blur")),
      await yieldToEventLoop());
  }
  delayBetweenFillingCharactersForFillingOneTimeCode(e) {
    const t = 10,
      r = 100;
    for (let o = e; o; o = o.parentElementIncludingShadowDOMHost()) {
      const e = o.getAttribute("debounce");
      if (!e) continue;
      const n = parseFloat(e);
      if (0 < n && n <= r) return n + t;
      break;
    }
    return t;
  }
  async autoFillOneTimeCodeFieldsWithValue(e, t) {
    let r = !1;
    try {
      const t = innermostActiveElement();
      if (!this._isAutoFillableTextField(t))
        return {
          value: e,
          shouldSubmit: !1,
          codeAppearsToHaveBeenFilledInItsEntirety: !1,
        };
      const o = {
          delayBetweenFillingCharacters:
            this.delayBetweenFillingCharactersForFillingOneTimeCode(t),
          waitForSingleCharacterFields: {
            delayBetweenChecksInMilliseconds: 1,
            minimumNumberOfTimesToCheckBeforeGivingUp: 20,
            minimumDurationToCheckBeforeGivingUpInMilliseconds: 400,
          },
          bypassFallbackToGenericFilling: !0,
        },
        n = await this._performAutoFillOperationsWhilePreventingUserInteraction(
          async () => await this._fillTextControl(null, e, o),
        );
      if (((r = this._oneTimeCodeAppearsToHaveFilledProperly(e, n)), !r)) {
        const i = allControlsForSingleCharacterLogicalFieldForControl(t),
          a = i.length;
        i.length && e.length === a
          ? (await this._performAutoFillOperationsWhilePreventingUserInteraction(
              async () => {
                for (let t = 0; t < a; ++t)
                  await this._fillTextControl(i[t], e[t], o);
              },
            ),
            (r = this._oneTimeCodeAppearsToHaveFilledProperly(e, i)))
          : 1 === n.length &&
            (await this._performAutoFillOperationsWhilePreventingUserInteraction(
              async () => {
                await this._fillGenericControl(n[0], e);
              },
            ),
            (r = this._oneTimeCodeAppearsToHaveFilledProperly(e, n)));
      }
    } catch (e) {}
    return {
      value: e,
      shouldSubmit: t,
      codeAppearsToHaveBeenFilledInItsEntirety: r,
    };
  }
  _oneTimeCodeAppearsToHaveFilledProperly(e, t) {
    if (!RegExp.escape) return !0;
    let r = !0;
    const o = e.substring(0, e.length - 1),
      n = t.map((e) => e.af_value()).join(""),
      i = new RegExp(
        o
          .replaceAll("-", "")
          .split("")
          .map((e) => RegExp.escape(e))
          .join(".*"),
        "s",
      );
    if (((r = i.test(n)), !r)) {
      const e = this._logicalFormsCache.logicalFormForControl(
        t[0],
      )?.backingElement;
      e && (r = i.test(e.innerText));
    }
    return r;
  }
  async _waitForFocusToAdvanceFromControl(e, t, r, o) {
    const n = performance.now();
    let i = 0,
      a = !1,
      l = setTimeout(() => {
        a = !0;
      }, o);
    for (;;) {
      const o = innermostActiveElement();
      if (!o || e !== o) break;
      if ((++i, i >= t && a)) break;
      await yieldUntilEventOrTimeout("focusin", r, {
        eventTargetToIgnore: e,
        requireEventTargetBeDocumentActiveElement: !0,
      });
    }
    clearTimeout(l);
    performance.now();
  }
  async _fillTextControl(e, t, r = {}) {
    if (e && this._controlContainsAllCharactersFromValue(e, t)) return;
    if (
      e &&
      userIsOnDomain("m.facebook.com") &&
      document.location.pathname.startsWith("/login") &&
      "m_login_email" === e.id
    )
      return void (await this._fillGenericControl(e, t));
    let o = new Set();
    const n = !e;
    ((e ??= innermostActiveElement()), await this._clearControl(e));
    const i = !!r.waitForSingleCharacterFields;
    let a = 0,
      l = 0,
      s = 0;
    i &&
      ((a =
        r.waitForSingleCharacterFields
          .minimumNumberOfTimesToCheckBeforeGivingUp),
      (l = r.waitForSingleCharacterFields.delayBetweenChecksInMilliseconds),
      (s =
        r.waitForSingleCharacterFields
          .minimumDurationToCheckBeforeGivingUpInMilliseconds));
    let c,
      u = !0;
    for (let d of t) {
      let t =
        i &&
        (1 === e.maxLength || controlIsPartOfSingleCharacterLogicalField(e));
      t && !u && (await this._waitForFocusToAdvanceFromControl(e, a, l, s));
      const h = innermostActiveElement();
      if (h !== e) {
        if (!n) break;
        let t =
          e &&
          h &&
          !e.isConnected &&
          h.isConnected &&
          e.id === h.id &&
          e.className === h.className &&
          h.af_value()?.endsWith(c);
        ((e = h), t || (await this._clearControl(e)));
      }
      const m = t ? performance.now() : null;
      let F = 0,
        f = m,
        g = f - m;
      const C = r.delayBetweenFillingCharacters || 0;
      for (;;) {
        const t = KeyInfo.forCharacter(d);
        t.isShifted && e.dispatchEvent(KeyInfo.shiftKeyEvent("keydown"));
        let r = !e.dispatchEvent(t.keyEvent("keydown"));
        if ((r || (r = !e.dispatchEvent(t.keyEvent("keypress"))), !r))
          if (this.canUseTextInputEventsToFill)
            e.dispatchEvent(createTextInputEvent(d));
          else {
            const t = e.af_value() + d;
            (e.dispatchEvent(
              new InputEvent("beforeinput", {
                bubbles: !0,
                cancelable: !0,
                inputType: insertTextInputType,
                data: t,
              }),
            ),
              e.af_setValue(t),
              e.dispatchEvent(
                new InputEvent("input", {
                  bubbles: !0,
                  cancelable: !1,
                  inputType: insertTextInputType,
                  data: t,
                }),
              ));
          }
        if (
          (e.dispatchEvent(t.keyEvent("keyup")),
          t.isShifted && e.dispatchEvent(KeyInfo.shiftKeyEvent("keyup")),
          !m)
        )
          break;
        {
          if ((++F, (f = performance.now()), (g = f - m), F >= a && g > s))
            break;
          await yieldToEventLoop();
          const t = innermostActiveElement();
          if (!t || e !== t) break;
          if (e.af_value().at(-1) === d) break;
        }
      }
      (o.add(e), (u = !1), (c = d), await yieldToEventLoop(C));
    }
    return (
      n ||
        r.bypassFallbackToGenericFilling ||
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
        e.af_setValue(t),
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
  async _fillControl(e, t, r, o) {
    if (e.isDisabledOrReadOnly()) return;
    if (e.shouldFocusDuringFilling()) {
      let t = !1;
      (document.hasFocus() ||
        (await yieldUntilDocumentIsFocusedOrTimeout(100), (t = !0)),
        e !== innermostActiveElement() &&
          (e.focus({ preventScroll: !0, focusVisible: !1 }), (t = !0)),
        t && (await yieldToEventLoopAfterAnimationFrameAndDelay(20)));
    }
    let n = !1;
    if (isRadioButtonElement(e)) {
      if (!(e = await this._fillRadioButtonInGroupStartingWithControl(e, t)))
        return;
    } else
      isSelectElement(e)
        ? await this._fillSelectControlWithBestOptionFromSynonyms(e, t)
        : ((n = !0),
          this._isTextField(e)
            ? await this._fillTextControl(e, t)
            : await this._fillGenericControl(e, t));
    const i = t.length && r;
    n && o
      ? FormMetadataJSController.setInputElementAutofilledAndObscured(e, i)
      : FormMetadataJSController.setInputElementAutofilled(e, i);
  }
  async _performAutoFillOperationsWhilePreventingUserInteraction(e, t) {
    const r = new AbortController(),
      o = [
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
    for (const e of o)
      window.addEventListener(
        e,
        (e) => {
          e.isTrusted && (e.preventDefault(), e.stopImmediatePropagation());
        },
        { capture: !0, signal: r.signal, webkitTrustedOnly: !0 },
      );
    try {
      return await e();
    } finally {
      r.abort(null);
    }
  }
  async autoFillControlsByID(e, t, r, o, n, i, a) {
    let l = arguments[arguments.length - 1],
      s = o;
    if (s) {
      let e = s.getAttribute("onfocus");
      e && e.length && /this\.value/.test(e) && (s = null);
    } else s = innermostActiveElement();
    var c = null;
    for (let t in e) {
      c = this._logicalFormsCache.logicalFormForControl(
        this.formControlWithUniqueID(t),
      );
      break;
    }
    const u = Object.entries(e)
      .map(([e, t]) => [this.formControlWithUniqueID(e), t])
      .sort((e, t) => {
        const r = e[0],
          o = t[0],
          n = r.compareDocumentPosition(o);
        if (
          !(
            n &
            (Node.DOCUMENT_POSITION_DISCONNECTED |
              Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC)
          )
        ) {
          if (
            n &
            (Node.DOCUMENT_POSITION_PRECEDING | Node.DOCUMENT_POSITION_CONTAINS)
          )
            return 1;
          if (
            n &
            (Node.DOCUMENT_POSITION_FOLLOWING |
              Node.DOCUMENT_POSITION_CONTAINED_BY)
          )
            return -1;
        }
        const i = (e) => parseInt(e._controlUniqueID.substring(10));
        return i(r) - i(o);
      });
    return (
      await this._performAutoFillOperationsWhilePreventingUserInteraction(
        async () => {
          const e = new Set(i);
          for (let [t, o] of u) {
            const n = e.has(t._controlUniqueID);
            await this._fillControl(t, o, r, n);
          }
        },
      ),
      n
        ? innermostActiveElement().blur()
        : s &&
          setTimeout(() => {
            this.selectIfTextField(s);
          }, 0),
      c?.backingElement &&
        elementAppearsToContinueCaptchaWidget(c.backingElement) &&
        (l = !1),
      {
        formMetadata: this._getOrCreateCachedMetadataForLogicalForm(c),
        shouldSubmit: l,
      }
    );
  }
  _isInputAllowedInSearchForm(e, t) {
    var r = this._getTagName(e).toLowerCase();
    if ("button" === r || "fieldset" === r) return !0;
    if ("select" === r) return !t || isSelectInDefaultState(e);
    if ("input" !== r && !this._textAreaElementLookLikeItIsPartOfASearchForm(e))
      return !1;
    var o = e.type;
    return "radio" === o || "checkbox" === o
      ? !t || isCheckboxOrRadioButtonInDefaultState(e)
      : "hidden" === o ||
          "reset" === o ||
          "submit" === o ||
          "button" === o ||
          "image" === o ||
          (this._isTextField(e) && !this._isSecureTextField(e));
  }
  isSearchForm(e, t) {
    if ("get" !== e.method) return !1;
    for (
      var r = elementsInFormPiercingShadowDOM(e), o = r.length, n = 0;
      n < o;
      ++n
    )
      if (!this._isInputAllowedInSearchForm(r[n], t)) return !1;
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
  _collectExtraControlMetadata(e, t) {
    const r = e.getAttribute("passwordrules");
    if (r) return void (t.ControlPasswordRules = r);
    const o = e.pattern;
    if (o && "undefined" != typeof PatternRegexpToPasswordRulesConverter) {
      const e = PatternRegexpToPasswordRulesConverter.convert(o);
      e && (t.ControlPasswordRules = e);
    }
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
0;
