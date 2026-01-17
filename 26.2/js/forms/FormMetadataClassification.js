//# sourceURL=__InjectedScript_FormMetadataClassification.js
/* Copyright (c) 2025 Apple Inc. All rights reserved. */
"use strict";
function datePlaceholderParser(e) {
  for (const t of e) {
    const e = t.toLowerCase();
    if (e >= "a" && e <= "z" && !["d", "y", "m"].includes(e)) return null;
  }
  return e.includes("d")
    ? e.includes("yyyy")
      ? { year: "numeric", month: "2-digit", day: "2-digit" }
      : { year: "2-digit", month: "2-digit", day: "2-digit" }
    : e.includes("M")
      ? e.includes("yyyy")
        ? { year: "numeric", month: "2-digit" }
        : { year: "2-digit", month: "2-digit" }
      : e.includes("y")
        ? e.includes("yyyy")
          ? { year: "numeric" }
          : { year: "2-digit" }
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
  AllowedControlTagsForStandaloneCreditCardCompositeExpirationControl = new Set(
    ["input", "select", "textarea"],
  );
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
    if (e && (e = e.replace(/\s/g, "")).length && !/[^dmyDMY\/.-]/g.test(e))
      return (e = (e = (e = e.replace(/D/g, "d")).replace(/m/g, "M")).replace(
        /Y/g,
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
          e &&
            ((s = new Intl.DateTimeFormat(a, e).format(t)),
            (i = referenceDateToDateFormat(s)));
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
    let [s, l, d, C] = this.identifyDateFields(e);
    if (!s) return !1;
    if (C && !d) return !1;
    let c = 0;
    for (const a of e)
      ((a.ControlClassification = t),
        (a.ControlContinuationID = i),
        (a.ControlContinuationIndex = c++),
        a === C
          ? (a.ControlOrderedParts = [n])
          : a === d
            ? (a.ControlOrderedParts = [r])
            : a === l && (a.ControlOrderedParts = [o]));
    return !0;
  }
  classify(e) {
    const t = e.FormControls,
      o = t.length,
      r = e.AutoFillFormType === WBSAutoFillFormTypeNewAccount,
      n = e.AutoFillFormType === WBSAutoFillFormTypeChangePassword,
      i = e.UsernameElementUniqueID,
      a = e.PasswordElementUniqueID,
      s = e.OldPasswordElementUniqueID,
      l = e.ConfirmPasswordElementUniqueID;
    for (let e of t)
      (e.AutocompleteTokens || e.AddressBookLabel) &&
        (e.AddressBookValueSpecifier =
          FormMetadataJSController.specifierForAutocompleteTokensAndAddressBookLabel(
            e.AutocompleteTokens,
            e.AddressBookLabel,
          ));
    let d = !1,
      C = !1,
      c = !1,
      f = !1,
      u = !1,
      k = 0;
    for (let S = 0, T = 1; S < o; S += T, T = 1) {
      const o = t[S];
      if (o.ControlLooksLikeIgnoredDataTypeField) {
        o.ControlClassification = WBSIgnoredClassificationToken;
        continue;
      }
      const h = o.ControlUniqueID;
      if (h === a || h === l) {
        o.ControlClassification =
          r || n
            ? WBSCredentialNewPasswordClassificationToken
            : WBSCredentialCurrentPasswordClassificationToken;
        continue;
      }
      if (h === s) {
        o.ControlClassification =
          WBSCredentialCurrentPasswordClassificationToken;
        continue;
      }
      const B = o.AddressBookValueSpecifier?.classification;
      if (B === WBSContactEmailClassificationToken) {
        o.ControlClassification = WBSContactEmailClassificationToken;
        continue;
      }
      if (h === i) {
        o.ControlClassification = WBSCredentialUsernameClassificationToken;
        continue;
      }
      if (!C && o.ControlLooksLikeCreditCardCardholderField) {
        if (((C = !0), B && WBSNameOrderedPartTokensSet.has(B))) {
          const e = this.classifyControlsRelatedToNameParts(
            t,
            S,
            WBSCreditCardHolderNameClassificationToken,
          );
          if (e.length > 1) {
            let t = ++k,
              o = 0;
            for (let r of e)
              ((r.ControlContinuationID = t),
                (r.ControlContinuationIndex = o++));
          }
          T = e.length;
          continue;
        }
        ((o.ControlClassification = WBSCreditCardHolderNameClassificationToken),
          (o.ControlOrderedParts =
            WBSCreditCardHolderNameClassificationDefaultOrderedParts));
        continue;
      }
      if (!d && o.ControlLooksLikeCreditCardNumberField) {
        d = !0;
        const e = this.continuingFieldsInFormControls(t, S, !0, !1);
        let o = 0,
          r = e.length > 1 ? ++k : 0;
        for (let t of e)
          ((t.ControlClassification = WBSCreditCardNumberClassificationToken),
            (t.ControlContinuationID = r),
            (t.ControlContinuationIndex = o++));
        T = e.length;
        continue;
      }
      const P =
        this.fieldLooksLikeDateField(o) ||
        o.ControlLooksLikeCreditCardCompositeExpirationDateField;
      if (!c && P) {
        let e = f || C || d;
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
          c = !0;
          const e = this.continuingFieldsInFormControls(t, S, !1, !0);
          let o = e.length > 1 ? ++k : 0;
          (this.classifyDateFields(
            e,
            WBSCreditCardExpirationClassificationToken,
            WBSDateYearOrderedPartToken,
            WBSDateMonthOrderedPartToken,
            void 0,
            o,
            WBSLocaleForCreditCardExpirationDate,
          ),
            (T = e.length));
          continue;
        }
      }
      if (u || !o.ControlLooksLikeCreditCardSecurityCodeField)
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
                S,
                WBSContactNameClassificationToken,
              );
              if (e.length > 1) {
                let t = ++k,
                  o = 0;
                for (let r of e)
                  ((r.ControlContinuationID = t),
                    (r.ControlContinuationIndex = o++));
              }
              T = e.length;
              continue;
            }
            if (B === WBSContactPostalCodeClassificationToken) {
              const e = this.continuingFieldsInFormControls(t, S, !0, !1);
              let o = e.length > 1 ? ++k : 0,
                r = 0;
              for (let t of e)
                ((t.ControlClassification =
                  WBSContactPostalCodeClassificationToken),
                  (t.ControlContinuationID = o),
                  (t.ControlContinuationIndex = r++));
              T = e.length;
              continue;
            }
            if (B === WBSContactStreetAddressClassificationToken) {
              const e = this.continuingFieldsInFormControls(t, S, !0, !0);
              let o = e.length > 1 ? ++k : 0,
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
              T = e.length;
              continue;
            }
            if (B === WBSContactInstantMessageClassificationToken) {
              const e = this.continuingFieldsInFormControls(t, S, !0, !0);
              (1 === e.length &&
                ((e[0].ControlClassification =
                  WBSContactInstantMessageClassificationToken),
                r && (e[0].ControlClassificationHints = [r])),
                (T = e.length));
              continue;
            }
            if (B.startsWith(WBSContactTelephoneClassificationToken)) {
              const e = this.continuingFieldsInFormControls(t, S, !0, !1);
              if (1 == e.length) {
                ((e[0].ControlClassification =
                  WBSContactTelephoneClassificationToken),
                  (e[0].ControlOrderedParts = WBSTelephoneDefaultOrderedParts),
                  r && (e[0].ControlClassificationHints = [r]));
                continue;
              }
              let o = ++k,
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
                (T = e.length));
              continue;
            }
            if (B === WBSContactBirthdayClassificationToken) {
              const o = this.continuingFieldsInFormControls(t, S, !1, !1),
                r = o.length > 1 ? ++k : void 0,
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
                (T = o.length));
              continue;
            }
            o.ControlClassification = B;
          } else
            o.ControlLooksLikeEIDField
              ? (o.ControlClassification = WBSDeviceEIDClassificationToken)
              : o.ControlLooksLikeIMEIField &&
                (o.ControlClassification = WBSDeviceIMEIClassificationToken);
        else
          ((f = !0),
            (o.ControlClassification = WBSCreditCardTypeClassificationToken));
      else
        ((u = !0),
          (o.ControlClassification =
            WBSCreditCardSecurityCodeClassificationToken));
    }
  }
}
globalThis.FormMetadataClassificationJS = new FormMetadataClassification();
