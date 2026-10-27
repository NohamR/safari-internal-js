//# sourceURL=__InjectedScript_FormMetadataClassification.js
/* Copyright (c) 2026 Apple Inc. All rights reserved. */
"use strict";
function datePlaceholderParser(e) {
  const t = [];
  for (const o of e)
    "d" !== o || t.includes("day")
      ? "M" !== o || t.includes("month")
        ? "y" !== o || t.includes("year") || t.push("year")
        : t.push("month")
      : t.push("day");
  return e.includes("d")
    ? e.includes("yyyy")
      ? {
          format: { year: "numeric", month: "2-digit", day: "2-digit" },
          order: t,
        }
      : {
          format: { year: "2-digit", month: "2-digit", day: "2-digit" },
          order: t,
        }
    : e.includes("M")
      ? e.includes("yyyy")
        ? { format: { year: "numeric", month: "2-digit" }, order: t }
        : { format: { year: "2-digit", month: "2-digit" }, order: t }
      : e.includes("y")
        ? e.includes("yyyy")
          ? { format: { year: "numeric" }, order: t }
          : { format: { year: "2-digit" }, order: t }
        : null;
}
function referenceDateToDateFormat(e) {
  let t = e.replace("12", "MM");
  return (
    (t = t.replace("30", "dd")),
    (t = t.replace("1999", "y")),
    (t = t.replace("99", "yy")),
    t
  );
}
function referenceDatePartsToOrderedDateFormat(e, t) {
  const o = {};
  let r = "";
  for (const t of e)
    switch (t.type) {
      case "day":
        o.day = "dd";
        break;
      case "month":
        o.month = "MM";
        break;
      case "year":
        o.year = "1999" === t.value ? "yyyy" : "yy";
        break;
      case "literal":
        r = t.value;
    }
  let n = "";
  for (const [e, i] of t.entries())
    (o[i] && (n += o[i]), e < t.length - 1 && r && (n += r));
  return n;
}
const WBSABAddressProperty = "Address",
  WBSABPhoneProperty = "Phone",
  _WBSABAddressZIPKey = "ZIP",
  WBSFormControlMetadataDefaultMaxLength = 524288,
  WBSIgnoredClassificationToken = "-sf-ignored",
  WBSDateDayOrderedPartToken = "-sf-day",
  WBSDateMonthOrderedPartToken = "-sf-month",
  WBSDateYearOrderedPartToken = "-sf-year",
  WBSGivenNameOrderedPartToken = "given-name",
  WBSAdditionalNameOrderedPartToken = "additional-name",
  WBSFamilyNameOrderedPartToken = "family-name",
  WBSLocaleForCreditCardExpirationDate = "en-US-POSIX",
  WBSCreditCardTypeClassificationToken = "cc-type",
  WBSCreditCardHolderNameClassificationToken = "cc-name",
  WBSCreditCardNumberClassificationToken = "cc-number",
  WBSCreditCardExpirationClassificationToken = "cc-exp",
  WBSCreditCardSecurityCodeClassificationToken = "cc-csc",
  WBSCreditCardHolderNameClassificationDefaultOrderedParts = [
    WBSGivenNameOrderedPartToken,
    WBSAdditionalNameOrderedPartToken,
    WBSFamilyNameOrderedPartToken,
  ],
  WBSCreditCardExpirationClassificationDefaultOrderedParts = [
    WBSDateMonthOrderedPartToken,
    WBSDateYearOrderedPartToken,
  ],
  WBSCredentialUsernameClassificationToken = "username",
  WBSCredentialCurrentPasswordClassificationToken = "current-password",
  WBSCredentialNewPasswordClassificationToken = "new-password",
  WBSContactNameClassificationToken = "name",
  WBSContactNameClassificationDefaultOrderedParts = [
    WBSGivenNameOrderedPartToken,
    WBSAdditionalNameOrderedPartToken,
    WBSFamilyNameOrderedPartToken,
  ],
  WBSNameOrderedPartTokensSet = new Set(
    WBSContactNameClassificationDefaultOrderedParts,
  ),
  WBSContactInstantMessageClassificationToken = "-sf-instant-message",
  WBSContactPostalCodeClassificationToken = "postal-code",
  WBSContactStreetAddressClassificationToken = "street-address",
  WBSContactStreetAddressLine1OrderedPartToken = "address-line1",
  WBSContactStreetAddressLine2OrderedPartToken = "address-line2",
  WBSContactStreetAddressLine3OrderedPartToken = "address-line3",
  WBSContactTelephoneClassificationToken = "tel",
  WBSTelephoneCountryCodeOrderedPartToken = "tel-country-code",
  WBSTelephoneAreaCodeOrderedPartToken = "tel-area-code",
  WBSTelephoneLocalPrefixOrderedPartToken = "tel-local-prefix",
  WBSTelephoneLocalSuffixOrderedPartToken = "tel-local-suffix",
  WBSTelephoneExtensionOrderedPartToken = "tel-extension",
  WBSTelephoneDefaultOrderedParts = [
    WBSTelephoneCountryCodeOrderedPartToken,
    WBSTelephoneAreaCodeOrderedPartToken,
    WBSTelephoneLocalPrefixOrderedPartToken,
    WBSTelephoneLocalSuffixOrderedPartToken,
    WBSTelephoneExtensionOrderedPartToken,
  ],
  WBSContactBirthdayClassificationToken = "bday",
  WBSContactEmailClassificationToken = "email",
  WBSDeviceEIDClassificationToken = "device-eid",
  WBSDeviceIMEIClassificationToken = "device-imei",
  WBSDeviceIMEI1ClassificationToken = "device-imei1",
  WBSDeviceIMEI2ClassificationToken = "device-imei2",
  WBSDeviceNALClassificationToken = "device-nal",
  AllowedControlTagsForStandaloneCreditCardCompositeExpirationControl = new Set(
    ["input", "select", "textarea"],
  );
class JSFieldLabelPatternMatcher {
  constructor(e, t) {
    ((this.dfa = e),
      (this.characters = t.toLowerCase()),
      (this.allowEndOfWordMatch = e.charCodeAt(1)));
    const o = e.charCodeAt(0),
      r = 2,
      n = 2;
    this.transitionsBegin = r + n * o;
  }
  static transitionsEndMatchSentinel = 0;
  longestMatch() {
    let e,
      t = 0;
    const o = this.characters.length;
    let r = this.search(t, o, o);
    for (; r.length;) {
      for (const o of r)
        ((!e || o.end - o.begin > e.end - e.begin) && (e = o),
          (t = o.begin + 1));
      r = this.search(t, o, o);
    }
    if (e) return [e.identifier, this.characters.substring(e.begin, e.end)];
  }
  searchReverse() {
    let e = 0;
    const t = this.characters.length;
    let o,
      r = this.search(e, t, t);
    for (; r.length;) {
      for (const t of r) ((!o || t.end > o.end) && (o = t), (e = t.begin + 1));
      r = this.search(e, t, t);
    }
    if (o) return [o.identifier, this.characters.substring(o.begin, o.end)];
  }
  exactMatch() {
    const e = this.characters.length,
      t = this.search(0, e, 1);
    for (const o of t) if (0 == o.begin && o.end == e) return o.identifier;
  }
  static isWordCharacter(e) {
    return (
      (e >= 97 && e <= 122) ||
      (e >= 65 && e <= 90) ||
      (e >= 48 && e <= 57) ||
      95 == e
    );
  }
  isWordBoundary(e) {
    return (
      !!this.characters.length &&
      (0 === e
        ? JSFieldLabelPatternMatcher.isWordCharacter(
            this.characters.charCodeAt(0),
          )
        : e === this.characters.length
          ? JSFieldLabelPatternMatcher.isWordCharacter(
              this.characters.charCodeAt(e - 1),
            )
          : JSFieldLabelPatternMatcher.isWordCharacter(
              this.characters.charCodeAt(e - 1),
            ) !=
            JSFieldLabelPatternMatcher.isWordCharacter(
              this.characters.charCodeAt(e),
            ))
    );
  }
  passesWordBoundaryCheck(e, t) {
    return (
      !(
        !this.allowEndOfWordMatch &&
        JSFieldLabelPatternMatcher.isWordCharacter(
          this.characters.charCodeAt(e),
        ) &&
        !this.isWordBoundary(e)
      ) &&
      (!JSFieldLabelPatternMatcher.isWordCharacter(
        this.characters.charCodeAt(t),
      ) ||
        this.isWordBoundary(t + 1))
    );
  }
  search(e, t, o) {
    let r = [];
    for (var n = e; n < o; n++) {
      let e = 0;
      for (
        var i = this.stateTransitionBegin(e),
          a = this.stateTransitionEnd(e),
          s = n;
        s < t;
        s++
      ) {
        ((i = this.stateTransitionBegin(e)), (a = this.stateTransitionEnd(e)));
        const t = this.characters.charCodeAt(s);
        let o = !1;
        for (var d = i, l = a - 1; d <= l;) {
          const r = ((d + l) / 2) | 0,
            n = this.transitionCharacter(r);
          if (n == t) {
            ((e = this.transitionStateIndex(r)),
              (i = this.stateTransitionBegin(e)),
              (a = this.stateTransitionEnd(e)),
              (o = !0));
            break;
          }
          n > t ? (l = r - 1) : (d = r + 1);
        }
        if (!o) break;
        for (; a == JSFieldLabelPatternMatcher.transitionsEndMatchSentinel;)
          (this.passesWordBoundaryCheck(n, s) &&
            r.push({ identifier: i, begin: n, end: s + 1 }),
            e++,
            (i = this.stateTransitionBegin(e)),
            (a = this.stateTransitionEnd(e)));
      }
    }
    return r;
  }
  stateTransitionBegin(e) {
    const t = 2,
      o = 2;
    return this.dfa.charCodeAt(t + o * e);
  }
  stateTransitionEnd(e) {
    const t = 2,
      o = 2;
    return this.dfa.charCodeAt(t + o * e + 1);
  }
  transitionCharacter(e) {
    const t = 2;
    return this.dfa.charCodeAt(this.transitionsBegin + t * e);
  }
  transitionStateIndex(e) {
    const t = 2;
    return this.dfa.charCodeAt(this.transitionsBegin + t * e + 1);
  }
}
class FormMetadataClassification {
  #e(e) {
    return null != e && "object" == typeof e;
  }
  #t(e) {
    return this.#e(e) && "string" == typeof e.ControlTagName;
  }
  #o(e) {
    return this.#e(e) && "string" == typeof e.property;
  }
  fieldLooksLikeDateField(e) {
    return !!(
      e.ControlLooksLikeDayField ||
      e.ControlLooksLikeMonthField ||
      e.ControlLooksLikeYearField
    );
  }
  #r(e) {
    let t = e.ControlMaxLength;
    return (
      (void 0 === t || t < 0 || t > WBSFormControlMetadataDefaultMaxLength) &&
        (t = WBSFormControlMetadataDefaultMaxLength),
      t
    );
  }
  fieldLooksLikeItExpectsDataOfSize(e, t) {
    return (e.ControlSize ?? 0) <= t || this.#r(e) <= t;
  }
  fieldCouldBeCreditCardNumberContinuation(e, t) {
    const o = 4;
    if (t.length >= o) return !1;
    if (!t[0]?.ControlLooksLikeCreditCardNumberField) return !1;
    const r = 2;
    if (e.ControlMaxLength === r) return !1;
    if (e.ControlLooksLikeCreditCardNumberField) return !0;
    if (e.ControlLooksLikeCreditCardSecurityCodeField) return !1;
    if (e.ControlLooksLikeCreditCardCompositeExpirationDateField) return !1;
    const n = 6;
    if (!this.fieldLooksLikeItExpectsDataOfSize(e, n)) return !1;
    const i = t.at(-1);
    return !(i && !this.fieldLooksLikeItExpectsDataOfSize(i, n));
  }
  labelsCouldRepresentContinuation(e, t, o, r) {
    return (
      !(!e || !o) &&
      (e === o ||
        (!!t &&
          (!r ||
            (t.property === r.property &&
              (!r.component || t.component === r.component)))))
    );
  }
  #n(e) {
    const t = [
        WBSContactStreetAddressLine1OrderedPartToken,
        WBSContactStreetAddressLine2OrderedPartToken,
        WBSContactStreetAddressLine3OrderedPartToken,
      ],
      o = [
        WBSContactStreetAddressLine2OrderedPartToken,
        WBSContactStreetAddressLine3OrderedPartToken,
      ];
    if (e.AutocompleteTokens)
      for (let o of e.AutocompleteTokens)
        switch (o) {
          case "street-address":
            return t;
          case "address-line1":
            return [WBSContactStreetAddressLine1OrderedPartToken];
          case "address-line2":
          case "address-level2":
            return [WBSContactStreetAddressLine2OrderedPartToken];
          case "address-line3":
          case "address-level1":
            return [WBSContactStreetAddressLine3OrderedPartToken];
        }
    let r = e.ControlFieldName,
      n = r?.indexOf("1") ?? -1,
      i = r?.indexOf("2") ?? -1;
    return -1 === n
      ? -1 === i
        ? t
        : o
      : -1 === i || n < i
        ? [WBSContactStreetAddressLine1OrderedPartToken]
        : o;
  }
  fieldCouldBePhoneNumberContinuation(e, t) {
    const o = 5;
    if (t.length >= o) return !1;
    if (t[0]?.AddressBookValueSpecifier?.property !== WBSABPhoneProperty)
      return !1;
    const r = 5;
    return !!this.fieldLooksLikeItExpectsDataOfSize(e, r);
  }
  fieldCouldBePostCodeContinuation(e, t) {
    const o = 3;
    if (t.length >= o) return !1;
    if (t[0]?.AddressBookValueSpecifier?.component != _WBSABAddressZIPKey)
      return !1;
    const r = 6;
    return !!this.fieldLooksLikeItExpectsDataOfSize(e, r);
  }
  fieldLooksLikeSameDataType(e, t) {
    const o = t.at(-1);
    return (
      !!this.labelsCouldRepresentContinuation(
        o?.AddressBookLabel,
        o?.AddressBookValueSpecifier,
        e?.AddressBookLabel,
        e?.AddressBookValueSpecifier,
      ) ||
      !!(
        o &&
        this.fieldLooksLikeDateField(o) &&
        this.fieldLooksLikeDateField(e)
      ) ||
      !!this.fieldCouldBePhoneNumberContinuation(e, t) ||
      !!this.fieldCouldBePostCodeContinuation(e, t) ||
      !!this.fieldCouldBeCreditCardNumberContinuation(e, t)
    );
  }
  #i(e) {
    if (
      (globalThis.DOMRect ||
        (globalThis.DOMRect = class {
          constructor(e, t, o, r) {
            ((this.left = e),
              (this.right = e + o),
              (this.top = t),
              (this.bottom = t + r),
              (this.width = o),
              (this.height = r));
          }
        }),
      e.ControlRectLeft ||
        e.ControlRectTop ||
        e.ControlRectWidth ||
        e.ControlRectHeight)
    )
      return new DOMRect(
        e.ControlRectLeft,
        e.ControlRectTop,
        e.ControlRectWidth,
        e.ControlRectHeight,
      );
    let t = globalThis.FormMetadataJS?.formControlWithUniqueID(
      e.ControlUniqueID,
    );
    return t ? t.getBoundingClientRect() : new DOMRect(0, 0, 0, 0);
  }
  fieldLooksLikeContinuation(e, t, o) {
    if (!e.ControlIsTextField && "SELECT" !== e.ControlTagName.toUpperCase())
      return !1;
    if (!this.fieldLooksLikeSameDataType(e, t)) return !1;
    if (o) return !0;
    const r = this.#i(t.at(-1)),
      n = this.#i(e);
    if (Math.abs(r.top - n.top) > 3) return !1;
    let i, a;
    return (
      r.left < n.left ? ((i = r), (a = n)) : ((i = n), (a = r)),
      !(a.left - i.right > 60)
    );
  }
  continuingFieldsInFormControls(e, t, o, r) {
    const n = [e[t]];
    for (let i = t + 1; i < e.length; ++i) {
      const t = e[i];
      if (o && !t.ControlIsTextField) break;
      if (!this.fieldLooksLikeContinuation(t, n, r)) break;
      n.push(t);
    }
    return n;
  }
  classifyControlsRelatedToNameParts(e, t, o) {
    const r = e[t];
    ((r.ControlClassification = o),
      (r.ControlOrderedParts = [r.AddressBookValueSpecifier?.classification]));
    const n = new Set([r.AddressBookValueSpecifier?.classification]),
      i = [e[t]];
    for (let r = t + 1; r < e.length; ++r) {
      const t = e[r];
      if (!t.ControlIsTextField) break;
      const a = t.AddressBookValueSpecifier?.classification;
      if (!a) break;
      if (!WBSNameOrderedPartTokensSet.has(a) || n.has(a)) break;
      ((t.ControlClassification = o),
        (t.ControlOrderedParts = [a]),
        n.add(a),
        i.push(t));
    }
    return i;
  }
  identifyDateFields(e) {
    let t,
      o,
      r,
      n = !1;
    for (let i of e)
      if (i.ControlLooksLikeDayField) {
        if (t) return [!1, null, null, null];
        ((t = i), (n = !0));
      } else if (i.ControlLooksLikeMonthField) {
        if (o) return [!1, null, null, null];
        ((o = i), (n = !0));
      } else if (i.ControlLooksLikeYearField) {
        if (r) return [!1, null, null, null];
        ((r = i), (n = !0));
      }
    return [n, r, o, t];
  }
  canonicalizedDateTemplate(e) {
    if (!e) return;
    if (!(e = e.replace(/\s/g, "")).length) return;
    const t = [
      {
        dateFormatCharactersRegex: /^[dmy\/.-]*$/i,
        dayRegex: /D/g,
        monthRegex: /m/g,
        yearRegex: /Y/g,
      },
      {
        dateFormatCharactersRegex: /^[jma\/.-]*$/i,
        dayRegex: /j/gi,
        monthRegex: /m/g,
        yearRegex: /a/gi,
      },
      {
        dateFormatCharactersRegex: /^[dma\/.-]*$/i,
        dayRegex: /D/g,
        monthRegex: /m/g,
        yearRegex: /a/gi,
      },
      {
        dateFormatCharactersRegex: /^[tmj\/.-]*$/i,
        dayRegex: /t/gi,
        monthRegex: /m/g,
        yearRegex: /j/gi,
      },
      {
        dateFormatCharactersRegex: /^[gma\/.-]*$/i,
        dayRegex: /g/gi,
        monthRegex: /m/g,
        yearRegex: /a/gi,
      },
    ];
    for (const {
      dateFormatCharactersRegex: o,
      dayRegex: r,
      monthRegex: n,
      yearRegex: i,
    } of t)
      if (o.test(e))
        return (e = (e = (e = e.replace(r, "d")).replace(n, "M")).replace(
          i,
          "y",
        ));
  }
  classifyDateFields(e, t, o, r, n, i, a) {
    if (e.length > 3) return !1;
    if ((a || (a = navigator.language), 1 === e.length)) {
      if (!e[0].ControlIsTextField) return !1;
      let i = e[0].ControlRequiredFormatForDateTimeInput;
      if (!i) {
        const t = new Date(1999, 11, 30);
        let o = this.#r(e[0]),
          r = this.canonicalizedDateTemplate(e[0].ControlPlaceholder),
          s = "";
        if (r?.length) {
          const e = datePlaceholderParser(r);
          if (e) {
            const o = new Intl.DateTimeFormat(a, e.format);
            s = o.format(t);
            i = referenceDatePartsToOrderedDateFormat(
              o.formatToParts(t),
              e.order,
            );
          }
        }
        if (!s || s.length > o) {
          const e = n
            ? [
                { year: "numeric", month: "2-digit", day: "2-digit" },
                { year: "2-digit", month: "2-digit", day: "2-digit" },
              ]
            : [{ year: "2-digit", month: "2-digit" }];
          for (const r of e)
            if (
              ((s = new Intl.DateTimeFormat(a, r).format(t)),
              (i = referenceDateToDateFormat(s)),
              s.length <= o)
            )
              break;
        }
        if (s.length > o) return !1;
      }
      const s = [];
      for (const e of i) {
        let t;
        ("y" === e ? (t = o) : "M" === e ? (t = r) : "d" === e && (t = n),
          t && !s.includes(t) && s.push(t));
      }
      return (
        (e[0].ControlClassification = t),
        (e[0].ControlOrderedParts = s),
        (e[0].ControlRequiredFormatForDateTimeInput = i),
        !0
      );
    }
    let [s, d, l, c] = this.identifyDateFields(e);
    if (!s) return !1;
    if (c && !l) return !1;
    let C = 0;
    for (const a of e)
      ((a.ControlClassification = t),
        (a.ControlContinuationID = i),
        (a.ControlContinuationIndex = C++),
        a === c
          ? (a.ControlOrderedParts = [n])
          : a === l
            ? (a.ControlOrderedParts = [r])
            : a === d && (a.ControlOrderedParts = [o]));
    return !0;
  }
  static specifierForAutocompleteTokensAndAddressBookLabel(e, t) {
    if (e) {
      if (!Array.isArray(e))
        throw new Error("Expected an array of autocomplete tokens");
      for (let t of e) {
        const e = new JSFieldLabelPatternMatcher(
          FormMetadataJSController.autocompleteTokenMapDFA(),
          t,
        ).exactMatch();
        if (void 0 !== e) return FormMetadataJSController.getValueSpecifiers(e);
      }
    }
    if (t) {
      const e = new JSFieldLabelPatternMatcher(
        FormMetadataJSController.fieldLabelMapDFA(),
        t,
      ).exactMatch();
      if (void 0 !== e) return FormMetadataJSController.getValueSpecifiers(e);
    }
    return null;
  }
  classify(e) {
    const t = e.FormControls,
      o = t.length,
      r = e.AutoFillFormType === WBSAutoFillFormTypeNewAccount,
      n = e.AutoFillFormType === WBSAutoFillFormTypeChangePassword,
      i = e.UsernameElementUniqueID,
      a = e.PasswordElementUniqueID,
      s = e.OldPasswordElementUniqueID,
      d = e.ConfirmPasswordElementUniqueID;
    for (let e of t)
      (e.AutocompleteTokens || e.AddressBookLabel) &&
        (e.AddressBookValueSpecifier =
          FormMetadataClassification.specifierForAutocompleteTokensAndAddressBookLabel(
            e.AutocompleteTokens,
            e.AddressBookLabel,
          ));
    let l = !1,
      c = !1,
      C = !1,
      f = !1,
      h = !1,
      u = 0;
    for (let k = 0, S = 1; k < o; k += S, S = 1) {
      const o = t[k];
      if (o.ControlLooksLikeIgnoredDataTypeField) {
        o.ControlClassification = WBSIgnoredClassificationToken;
        continue;
      }
      const T = o.ControlUniqueID;
      if (T === a || T === d) {
        o.ControlClassification =
          r || n
            ? WBSCredentialNewPasswordClassificationToken
            : WBSCredentialCurrentPasswordClassificationToken;
        continue;
      }
      if (T === s) {
        o.ControlClassification =
          WBSCredentialCurrentPasswordClassificationToken;
        continue;
      }
      const B = o.AddressBookValueSpecifier?.classification;
      if (B === WBSContactEmailClassificationToken) {
        o.ControlClassification = WBSContactEmailClassificationToken;
        continue;
      }
      if (T === i) {
        o.ControlClassification = WBSCredentialUsernameClassificationToken;
        continue;
      }
      if (!c && o.ControlLooksLikeCreditCardCardholderField) {
        if (((c = !0), B && WBSNameOrderedPartTokensSet.has(B))) {
          const e = this.classifyControlsRelatedToNameParts(
            t,
            k,
            WBSCreditCardHolderNameClassificationToken,
          );
          if (e.length > 1) {
            let t = ++u,
              o = 0;
            for (let r of e)
              ((r.ControlContinuationID = t),
                (r.ControlContinuationIndex = o++));
          }
          S = e.length;
          continue;
        }
        ((o.ControlClassification = WBSCreditCardHolderNameClassificationToken),
          (o.ControlOrderedParts =
            WBSCreditCardHolderNameClassificationDefaultOrderedParts));
        continue;
      }
      if (!l && o.ControlLooksLikeCreditCardNumberField) {
        l = !0;
        const e = this.continuingFieldsInFormControls(t, k, !0, !1);
        let o = 0,
          r = e.length > 1 ? ++u : 0;
        for (let t of e)
          ((t.ControlClassification = WBSCreditCardNumberClassificationToken),
            (t.ControlContinuationID = r),
            (t.ControlContinuationIndex = o++));
        S = e.length;
        continue;
      }
      const g =
        this.fieldLooksLikeDateField(o) ||
        o.ControlLooksLikeCreditCardCompositeExpirationDateField;
      if (!C && g) {
        let e = f || c || l;
        if (
          ((e ||=
            !o.ControlLooksLikeOneTimeCodeField &&
            1 ===
              t.filter((e) =>
                AllowedControlTagsForStandaloneCreditCardCompositeExpirationControl.has(
                  e.ControlTagName.toLowerCase(),
                ),
              ).length),
          e)
        ) {
          C = !0;
          const e = this.continuingFieldsInFormControls(t, k, !1, !0);
          let o = e.length > 1 ? ++u : 0;
          (this.classifyDateFields(
            e,
            WBSCreditCardExpirationClassificationToken,
            WBSDateYearOrderedPartToken,
            WBSDateMonthOrderedPartToken,
            void 0,
            o,
            WBSLocaleForCreditCardExpirationDate,
          ),
            (S = e.length));
          continue;
        }
      }
      if (h || !o.ControlLooksLikeCreditCardSecurityCodeField)
        if (f || !o.ControlLooksLikeCreditCardTypeField)
          if (B) {
            const r = o.AddressBookValueSpecifier.classificationHint;
            if (B === WBSContactNameClassificationToken) {
              ((o.ControlClassification = B),
                (o.ControlOrderedParts =
                  WBSContactNameClassificationDefaultOrderedParts));
              continue;
            }
            if (WBSNameOrderedPartTokensSet.has(B)) {
              const e = this.classifyControlsRelatedToNameParts(
                t,
                k,
                WBSContactNameClassificationToken,
              );
              if (e.length > 1) {
                let t = ++u,
                  o = 0;
                for (let r of e)
                  ((r.ControlContinuationID = t),
                    (r.ControlContinuationIndex = o++));
              }
              S = e.length;
              continue;
            }
            if (B === WBSContactPostalCodeClassificationToken) {
              const e = this.continuingFieldsInFormControls(t, k, !0, !1);
              let o = e.length > 1 ? ++u : 0,
                r = 0;
              for (let t of e)
                ((t.ControlClassification =
                  WBSContactPostalCodeClassificationToken),
                  (t.ControlContinuationID = o),
                  (t.ControlContinuationIndex = r++));
              S = e.length;
              continue;
            }
            if (B === WBSContactStreetAddressClassificationToken) {
              const e = this.continuingFieldsInFormControls(t, k, !0, !0);
              let o = e.length > 1 ? ++u : 0,
                r = 0;
              for (let t of e)
                ((t.ControlClassification =
                  WBSContactStreetAddressClassificationToken),
                  (t.ControlContinuationID = o),
                  (t.ControlContinuationIndex = r++));
              if (1 === e.length) {
                let t = e[0];
                t.ControlOrderedParts = this.#n(t);
              } else
                2 === e.length
                  ? ((e[0].ControlOrderedParts = [
                      WBSContactStreetAddressLine1OrderedPartToken,
                    ]),
                    (e[1].ControlOrderedParts = [
                      WBSContactStreetAddressLine2OrderedPartToken,
                      WBSContactStreetAddressLine3OrderedPartToken,
                    ]))
                  : e.length >= 3 &&
                    ((e[0].ControlOrderedParts = [
                      WBSContactStreetAddressLine1OrderedPartToken,
                    ]),
                    (e[1].ControlOrderedParts = [
                      WBSContactStreetAddressLine2OrderedPartToken,
                    ]),
                    (e[2].ControlOrderedParts = [
                      WBSContactStreetAddressLine3OrderedPartToken,
                    ]));
              S = e.length;
              continue;
            }
            if (B === WBSContactInstantMessageClassificationToken) {
              const e = this.continuingFieldsInFormControls(t, k, !0, !0);
              (1 === e.length &&
                ((e[0].ControlClassification =
                  WBSContactInstantMessageClassificationToken),
                r && (e[0].ControlClassificationHints = [r])),
                (S = e.length));
              continue;
            }
            if (B.startsWith(WBSContactTelephoneClassificationToken)) {
              const e = this.continuingFieldsInFormControls(t, k, !0, !1);
              if (1 == e.length) {
                ((e[0].ControlClassification =
                  WBSContactTelephoneClassificationToken),
                  (e[0].ControlOrderedParts = WBSTelephoneDefaultOrderedParts),
                  r && (e[0].ControlClassificationHints = [r]));
                continue;
              }
              let o = ++u,
                n = 0;
              for (let t of e)
                ((t.ControlClassification =
                  WBSContactTelephoneClassificationToken),
                  (t.ControlContinuationID = o),
                  (t.ControlContinuationIndex = n++),
                  r && (t.ControlClassificationHints = [r]));
              (2 === e.length
                ? ((e[0].ControlOrderedParts = [
                    WBSTelephoneAreaCodeOrderedPartToken,
                  ]),
                  (e[1].ControlOrderedParts = [
                    WBSTelephoneLocalPrefixOrderedPartToken,
                    WBSTelephoneLocalSuffixOrderedPartToken,
                  ]))
                : 3 === e.length
                  ? ((e[0].ControlOrderedParts = [
                      WBSTelephoneAreaCodeOrderedPartToken,
                    ]),
                    (e[1].ControlOrderedParts = [
                      WBSTelephoneLocalPrefixOrderedPartToken,
                    ]),
                    (e[2].ControlOrderedParts = [
                      WBSTelephoneLocalSuffixOrderedPartToken,
                    ]))
                  : 4 === e.length
                    ? ((e[0].ControlOrderedParts = [
                        WBSTelephoneCountryCodeOrderedPartToken,
                      ]),
                      (e[1].ControlOrderedParts = [
                        WBSTelephoneAreaCodeOrderedPartToken,
                      ]),
                      (e[2].ControlOrderedParts = [
                        WBSTelephoneLocalPrefixOrderedPartToken,
                      ]),
                      (e[3].ControlOrderedParts = [
                        WBSTelephoneLocalSuffixOrderedPartToken,
                      ]))
                    : ((e[0].ControlOrderedParts = [
                        WBSTelephoneCountryCodeOrderedPartToken,
                      ]),
                      (e[1].ControlOrderedParts = [
                        WBSTelephoneAreaCodeOrderedPartToken,
                      ]),
                      (e[2].ControlOrderedParts = [
                        WBSTelephoneLocalPrefixOrderedPartToken,
                      ]),
                      (e[3].ControlOrderedParts = [
                        WBSTelephoneLocalSuffixOrderedPartToken,
                      ]),
                      (e[4].ControlOrderedParts = [
                        WBSTelephoneExtensionOrderedPartToken,
                      ])),
                (S = e.length));
              continue;
            }
            if (B === WBSContactBirthdayClassificationToken) {
              const o = this.continuingFieldsInFormControls(t, k, !1, !1),
                r = o.length > 1 ? ++u : void 0,
                n =
                  e.RequestType === WBSFormMetadataRequestTesting
                    ? "en-US"
                    : void 0;
              (this.classifyDateFields(
                o,
                WBSContactBirthdayClassificationToken,
                WBSDateYearOrderedPartToken,
                WBSDateMonthOrderedPartToken,
                WBSDateDayOrderedPartToken,
                r,
                n,
              ),
                (S = o.length));
              continue;
            }
            o.ControlClassification = B;
          } else
            o.ControlLooksLikeEIDField
              ? (o.ControlClassification = WBSDeviceEIDClassificationToken)
              : o.ControlLooksLikeIMEIField
                ? (o.ControlClassification = WBSDeviceIMEIClassificationToken)
                : o.ControlLooksLikeIMEI1Field
                  ? (o.ControlClassification =
                      WBSDeviceIMEI1ClassificationToken)
                  : o.ControlLooksLikeIMEI2Field
                    ? (o.ControlClassification =
                        WBSDeviceIMEI2ClassificationToken)
                    : o.ControlLooksLikeNALField &&
                      (o.ControlClassification =
                        WBSDeviceNALClassificationToken);
        else
          ((f = !0),
            (o.ControlClassification = WBSCreditCardTypeClassificationToken));
      else
        ((h = !0),
          (o.ControlClassification =
            WBSCreditCardSecurityCodeClassificationToken));
    }
    return e;
  }
}
globalThis.FormMetadataClassificationJS = new FormMetadataClassification();
0;
