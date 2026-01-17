//# sourceURL=__InjectedScript_FormMetadataJSController.js
/* Copyright (c) 2025 Apple Inc. All rights reserved. */
"use strict";
function addGlobalEventHandler(e, t) {
  function* a(e) {
    const t = document.createTreeWalker(
      e,
      NodeFilter.SHOW_ELEMENT,
      function (e) {
        return e.shadowRoot
          ? "user-agent" === e.shadowRoot.mode
            ? NodeFilter.FILTER_REJECT
            : NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP;
      },
    );
    for (; t.nextNode(); ) {
      const e = t.currentNode;
      (yield* a(e.shadowRoot), yield e);
    }
  }
  const o = "focus" === e || "blur" === e,
    r = (() => {
      switch (e) {
        case "focus":
        case "blur":
        case "input":
          return !0;
        case "submit":
        case "webkitassociateformcontrols":
          return !1;
        default:
          throw new Error(`uncategorized event ${e}. Please categorize it`);
      }
    })();
  let l = t;
  if (
    (o &&
      (l = function (e) {
        e.target === e.composedPath()[0] && t(e);
      }),
    window.addEventListener(e, t, { capture: !0 }),
    !r || o)
  ) {
    for (const t of a(document.documentElement))
      t.shadowRoot.addEventListener(e, l, { capture: !0 });
    window.addEventListener("webkitshadowrootattached", function (t) {
      t.composedPath()[0].shadowRoot.addEventListener(e, l, { capture: !0 });
    });
  }
}
const WBSMinimumLogicalWidthToShowManualAutoFillButton = 100;
class FormMetadataFieldPatternMatcher {
  searchRegularExpression;
  constructor(e, t = !1) {
    const a = (Array.isArray(e) ? e : Object.keys(e))
        .toSorted((e, t) => t.length - e.length)
        .map(RegExp.escape),
      o = "(?=(\\W|$))",
      r = "(?<=(\\W|^))";
    this.searchRegularExpression = t
      ? new RegExp("(?:" + a.join("|") + ")" + o, "ig")
      : new RegExp(r + "(?:" + a.join("|") + ")" + o, "ig");
  }
  longestMatch(e) {
    const t = e.match(this.searchRegularExpression);
    if (!t) return null;
    let a = "";
    for (const e of t) e.length > a.length && (a = e);
    if (!a) return null;
    const o = fieldLabelMap[a.toLowerCase()];
    if (!o) return [a, "", "", ""];
    const r = o.valueSpecifier;
    return [a, r.property, r.category, r.parentProperty];
  }
  searchReverse(e) {
    const t = e.match(this.searchRegularExpression);
    if (!t) return null;
    const a = t.at(-1);
    if (!a) return null;
    const o = fieldLabelMap[a.toLowerCase()];
    if (!o) return [a, "", "", ""];
    const r = o.valueSpecifier;
    return [a, r.property, r.category, r.parentProperty];
  }
}
class FormMetadataJSController {
  static isDebugConsoleLoggingEnabled =
    AutoFillControllerConfig.isDebugConsoleLoggingEnabled;
  static _nextControlUniqueID = 1;
  static get nextControlUniqueID() {
    return this._nextControlUniqueID++;
  }
  static _nextFormUniqueID = 1;
  static get nextFormUniqueID() {
    return this._nextFormUniqueID++;
  }
  static regularExpressionsIndicatingNonAutoFillableFormType =
    FormAutoFillKeywords.NonAutoFillableFormTypeRegularExpressions;
  static loginFormTypePatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      FormAutoFillKeywords.LoginFormTypeKeywords,
    ),
  ];
  static oneTimeCodeFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      FormAutoFillKeywords.OneTimeCodeFieldLabels,
    ),
  ];
  static nonAccountPasswordSecureTextEntryFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      FormAutoFillKeywords.NonAccountPasswordSecureTextEntryFieldLabels,
    ),
  ];
  static ignoredDataTypeFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      FormAutoFillKeywords.IgnoredDataTypeFieldLabels,
      !0,
    ),
  ];
  static oldPasswordFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      FormAutoFillKeywords.OldPasswordFieldLabels,
    ),
  ];
  static confirmPasswordFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      FormAutoFillKeywords.ConfirmPasswordFieldLabels,
    ),
  ];
  static confirmEmailFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      FormAutoFillKeywords.ConfirmEmailFieldLabels,
    ),
  ];
  static showHideButtonLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      FormAutoFillKeywords.ShowHideButtonLabels,
    ),
  ];
  static searchFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(FormAutoFillKeywords.SearchFieldLabels),
  ];
  static nonUsernameFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      FormAutoFillKeywords.NonUsernameFieldLabels,
    ),
  ];
  static passwordFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      FormAutoFillKeywords.PasswordFieldLabels,
    ),
  ];
  static usernameFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      FormAutoFillKeywords.UsernameFieldLabels,
    ),
  ];
  static nonEmailFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      FormAutoFillKeywords.NonEmailFieldLabels,
    ),
  ];
  static weakOneTimeCodeFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      FormAutoFillKeywords.WeakOneTimeCodeFieldLabels,
      !0,
    ),
  ];
  static codeButNotOneTimeCodeFieldLabelsPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      FormAutoFillKeywords.CodeButNotOneTimeCodeFieldLabels,
      !0,
    ),
  ];
  static dayFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      FormAutoFillKeywords.DayFieldLabels,
      !0,
    ),
  ];
  static monthFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      FormAutoFillKeywords.MonthFieldLabels,
      !0,
    ),
  ];
  static yearFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      FormAutoFillKeywords.YearFieldLabels,
      !0,
    ),
  ];
  static addressBookFieldLabelPatternMatchers =
    newAddressBookFieldLabelPatternMatchers();
  static emailFieldLabelPatternMatchers = newEmailFieldLabelPatternMatchers();
  static creditCardNumberFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      FormAutoFillKeywords.creditCardAutoFill.numberFieldLabels,
    ),
  ];
  static creditCardSecurityCodeFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      FormAutoFillKeywords.creditCardAutoFill.securityCodeFieldLabels,
    ),
  ];
  static creditCardCardholderFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      FormAutoFillKeywords.creditCardAutoFill.cardholderLabels,
    ),
  ];
  static creditCardTypeFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      FormAutoFillKeywords.creditCardAutoFill.cardTypeLabels,
    ),
  ];
  static nonCreditCardCardNumberFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      FormAutoFillKeywords.creditCardAutoFill.nonCreditCardNumberLabels,
    ),
  ];
  static creditCardCompositeExpirationDateFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      FormAutoFillKeywords.creditCardAutoFill.compositeExpirationDateLabels,
    ),
  ];
  static newAccountFormTypePatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      FormAutoFillKeywords.NewAccountFormTypeKeywords,
    ),
  ];
  static federatedSignInAffordancePatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      FormAutoFillKeywords.FederatedSignInAffordanceLabels,
    ),
  ];
  static mapOfKeywordsIndicatingLoginFormTypeToScoreForMatching =
    FormAutoFillKeywords.LoginFormTypeKeywords;
  static mapOfKeywordsIndicatingNewAccountFormTypeToScoreForMatching =
    FormAutoFillKeywords.NewAccountFormTypeKeywords;
  static mapOfKeywordsIndicatingChangePasswordFormTypeToScoreForMatching =
    FormAutoFillKeywords.ChangePasswordFormTypeKeywords;
  static regularExpressionsForForgotPasswordAffordance =
    FormAutoFillKeywords.ForgotPasswordAffordanceRegularExpressions;
  static regularExpressionsForForgotUserNameAffordance =
    FormAutoFillKeywords.ForgotUserNameAffordanceRegularExpressions;
  static regularExpressionsForForgotEmailAffordance =
    FormAutoFillKeywords.ForgotEmailAffordanceRegularExpressions;
  static specifierForAutocompleteTokensAndAddressBookLabel(e, t) {
    if (e) {
      if (!Array.isArray(e))
        throw new Error("Expected an array of autocomplete tokens");
      for (let t of e) {
        const e = autocompleteTokenMap[t]?.valueSpecifier;
        if (e) return e;
      }
    }
    if (t) {
      const e = fieldLabelMap[t]?.valueSpecifier;
      if (e) return e;
    }
    return null;
  }
  autoFillButtonManager;
  focusManager;
  didAssociateFormControlsTimeout;
  constructor() {
    ((this.focusManager = new FocusManager(this)),
      this.focusManager.addEventListeners(),
      (this.autoFillButtonManager = new AutoFillButtonManager(this)),
      this.autoFillButtonManager.addEventListeners(),
      (this.didAssociateFormControlsTimeout = null),
      addGlobalEventHandler(
        "webkitassociateformcontrols",
        this.didAssociateFormControls.bind(this),
      ),
      (this.shouldNotifyOnFormChanges = !1),
      window.addEventListener("pagehide", () => {
        window.webkit.messageHandlers.controller.postMessage({
          name: "pageHide",
        });
      }));
  }
  didAssociateFormControls(e) {
    if (!this.shouldNotifyOnFormChanges) return;
    if (this.didAssociateFormControlsTimeout) return;
    const t = e.composedPath()[0];
    if ("hidden" === t.type || "button" === t.type) return;
    const [a, o] = FormMetadataJS.formsAndMetadata(
      WBSFormMetadataRequestPreFill,
    );
    this.didAssociateFormControlsTimeout = setTimeout(
      this.sendDidAssociateFormControlsMessage.bind(this),
      0,
    );
  }
  sendDidAssociateFormControlsMessage() {
    ((this.didAssociateFormControlsTimeout = null),
      window.webkit.messageHandlers.controller.postMessage({
        name: "didAssociateFormControls",
      }));
  }
  reset() {
    FormMetadataJS.clearTextFieldOrSelectElementMetadataCache();
  }
  textEditingStatus() {
    const [e, t] = FormMetadataJS.visibleNonEmptyFormTextControls(),
      a = e.filter((e) => e.lastChangeWasUserEdit),
      o = t.filter((e) => e.lastChangeWasUserEdit),
      r = document.body.onbeforeunload,
      l = null != r;
    return {
      numberOfTextInputElements: a.length,
      numberOfTextAreaElements: o.length,
      hasOnBeforeUnloadEventHandler: l,
    };
  }
  async fillFormWithPassword(e, t, a, o) {
    const r = await FormMetadataJS.fillFormWithPassword(e, a, t);
    for (let e of r) e.autofillVisibility = o ? "hidden" : "visible";
    o && AutomaticPasswords.blurControlWithID(t);
  }
  static #e(e) {
    const t = getComputedStyle(e).writingMode,
      a = !("horizontal-tb" === t || "horizontal-bt" === t),
      o = e.getBoundingClientRect();
    return (
      (a ? o.height : o.width) >=
      WBSMinimumLogicalWidthToShowManualAutoFillButton
    );
  }
  static #t(e) {
    return !!FormMetadataJSController.#e(e) && e === innermostActiveElement();
  }
  showAutoFillButtonInControl(e, t) {
    const a = FormMetadataJS.formControlWithUniqueID(e);
    (FormMetadataJSController.#t(a) || "none" === t) &&
      a._setAutofillButtonType(t);
  }
  setAutofillAvailable(e, t) {
    const a = FormMetadataJS.formControlWithUniqueID(e);
    a && (a.autofillAvailable = t);
  }
  setControlsAsAutoFilled(e, t) {
    this.#a(e).forEach((e) => {
      FormMetadataJSController.setInputElementAutofilled(e, t);
    });
  }
  blurControls(e) {
    this.#a.forEach((e) => e.blur());
  }
  clearControls(e) {
    this.#a.forEach(FormMetadataJS.clearField);
  }
  annotateForm(e, t) {
    FormMetadataJS.annotateFormWithID(e, t);
  }
  formsMetadata(e) {
    (e !== WBSFormMetadataRequestPreFill &&
      e !== WBSFormMetadataRequestTesting) ||
      (this.shouldNotifyOnFormChanges = !0);
    let [t, a] = FormMetadataJS.formsAndMetadata(e);
    for (const e of a)
      for (const t of e.FormControls) {
        const e = FormMetadataJS.formControlWithUniqueID(t.ControlUniqueID);
        this.populateRectFieldsInFormElementMetadata(t, e);
      }
    return a;
  }
  getMetadataForControl(e, t = WBSFormMetadataRequestNormal) {
    const a = FormMetadataJS.formControlWithUniqueID(e);
    return a ? this._getMetadataForControl(a, t) : [null, null];
  }
  getMetadataForForm(e) {
    const [t, a] = FormMetadataJS.formsAndMetadata(
      WBSFormMetadataRequestNormal,
    );
    for (let o = 0; o < t.length; o++) if (t[o] === e) return a[o];
    return null;
  }
  _getMetadataForControl(e, t) {
    let [a, o] = FormMetadataJS.textFieldOrSelectElementMetadata(e, t, !1);
    return (
      this.populateRectFieldsInFormElementMetadata(a, e),
      FormMetadataJS.clearTextFieldOrSelectElementMetadataCache(),
      [a, o]
    );
  }
  focusControl(e, t = !1) {
    const a = FormMetadataJS.formControlWithUniqueID(e);
    a && (t ? FormMetadataJS._focusControlForStreamlinedLogin(a) : a.focus());
  }
  replaceRangeInControl(e, t, a, o, r) {
    FormMetadataJS.replaceFormFieldRangeAndSelectTail(e, t, a, o, r);
    const l = FormMetadataJS.formControlWithUniqueID(e);
    if (l)
      return FormMetadataJS.textFieldOrSelectElementMetadata(
        l,
        WBSFormMetadataRequestNormal,
        !0,
      );
  }
  selectRangeInControl(e, t, a) {
    FormMetadataJS.setFormFieldSelection(e, t, a);
  }
  static setInputElementSpellCheckEnabled(e, t) {
    e.autofillSpellcheck = !!t;
  }
  static setInputElementAutofilled(e, t) {
    ((e.autofilled = t),
      t && FormMetadataJSController.autoFilledFieldWithMetadata(e));
  }
  static setInputElementAutoFilledAndViewable(e, t) {
    e.autofilledAndViewable = t;
  }
  static setInputElementAutofilledAndObscured(e, t) {
    ((e.autofilledAndObscured = t),
      t && FormMetadataJSController.autoFilledFieldWithMetadata(e));
  }
  populateRectFieldsInFormElementMetadata(e, t) {
    const a = t.getBoundingClientRect();
    ((e.ControlRectLeft = a.left),
      (e.ControlRectTop = a.top),
      (e.ControlRectWidth = a.width),
      (e.ControlRectHeight = a.height));
  }
  #a(e) {
    return e.flatMap(FormMetadataJS.formControlWithUniqueID);
  }
  static autoFilledFieldWithMetadata(e) {
    let [t, a] = FormMetadataJS.textFieldOrSelectElementMetadata(
      e,
      WBSFormMetadataRequestNormal,
      !1,
    );
    window.webkit.messageHandlers.controller.postMessage({
      name: "autoFilledFieldWithMetadata",
      controlMetadata: t,
      formMetadata: a,
    });
  }
  static logicalFormObservedChangeIndicatingFormSubmission(e, t) {
    window.webkit.messageHandlers.controller.postMessage({
      name: "formObservedChangeIndicatingFormSubmission",
      formMetadata: e,
      removedControlsMetadata: t,
    });
  }
}
class FieldMovementChecker {
  textField;
  textFieldMetadata;
  formMetadata;
  numberOfTimesFieldMovementTimerHasFired;
  checkForFieldMovementTimeout;
  pollingIntervals;
  onFieldMoved;
  constructor(e) {
    ((this.textField = null),
      (this.textFieldMetadata = null),
      (this.numberOfTimesFieldMovementTimerHasFired = 0),
      (this.checkForFieldMovementTimeout = null),
      (this.pollingIntervals = [10, 50, 100, 850]),
      (this.onFieldMoved = e));
  }
  setTextFieldToMonitor(e, t, a) {
    ((this.textField = e),
      (this.textFieldMetadata = t),
      (this.formMetadata = a));
  }
  performNextCheckForFieldMovement() {
    if (
      ((this.checkForFieldMovementTimeout = null),
      !this.textField || !this.textFieldMetadata)
    )
      return void this.reset();
    const e = this.textField.getBoundingClientRect();
    (this.textFieldMetadata.ControlRectLeft != e.left ||
    this.textFieldMetadata.ControlRectTop != e.top ||
    this.textFieldMetadata.ControlRectWidth != e.width ||
    this.textFieldMetadata.ControlRectHeight != e.height
      ? (this.onFieldMoved(
          this.textField,
          this.textFieldMetadata,
          this.formMetadata,
        ),
        (this.numberOfTimesFieldMovementTimerHasFired = 0))
      : (this.numberOfTimesFieldMovementTimerHasFired += 1),
      this.numberOfTimesFieldMovementTimerHasFired >=
      this.pollingIntervals.length
        ? this.reset()
        : this.scheduleNextCheckForFieldMovement());
  }
  reset() {
    (this.checkForFieldMovementTimeout &&
      window.clearTimeout(this.checkForFieldMovementTimeout),
      (this.checkForFieldMovementTimeout = null));
  }
  scheduleNextCheckForFieldMovement() {
    this.reset();
    const e =
      this.pollingIntervals[this.numberOfTimesFieldMovementTimerHasFired];
    this.checkForFieldMovementTimeout = window.setTimeout(
      this.performNextCheckForFieldMovement.bind(this),
      e,
    );
  }
}
class FocusManager {
  jsController;
  fieldMovementChecker;
  constructor(e) {
    ((this.jsController = e),
      (this.fieldMovementChecker = new FieldMovementChecker(
        this.handleElementFocused.bind(this),
      )));
  }
  addEventListeners() {
    (addGlobalEventHandler("submit", this.submitEventHandler.bind(this)),
      addGlobalEventHandler("focus", this.focusInEventHandler.bind(this)),
      addGlobalEventHandler("blur", this.focusOutEventHandler.bind(this)),
      addGlobalEventHandler("input", this.inputEventHandler.bind(this)));
  }
  static #o(e) {
    for (const t of e.composedPath()) {
      if (FormMetadataJS._isTextField(t)) return t;
      if (t instanceof HTMLSelectElement) return t;
    }
    return null;
  }
  focusInEventHandler(e) {
    this.fieldMovementChecker.reset();
    const t = FocusManager.#o(e);
    if (!t) return;
    let [a, o] = FormMetadataJS.textFieldOrSelectElementMetadata(
      t,
      WBSFormMetadataRequestNormal,
      !0,
    );
    a &&
      (t.setUserInfo({ form: o, textField: a }),
      this.fieldMovementChecker.setTextFieldToMonitor(t, a, o),
      this.fieldMovementChecker.scheduleNextCheckForFieldMovement(),
      this.handleElementFocused(t, a, o));
  }
  handleElementFocused(e, t, a) {
    (this.jsController.populateRectFieldsInFormElementMetadata(t, e),
      window.webkit.messageHandlers.controller.postMessage({
        name: "elementFocused",
        focusedElementMetadata: t,
        formMetadata: a,
      }));
  }
  focusOutEventHandler(e) {
    this.fieldMovementChecker.reset();
    const t = FocusManager.#o(e);
    if (!t) return;
    let [a, o] = FormMetadataJS.textFieldOrSelectElementMetadata(
      t,
      WBSFormMetadataRequestNormal,
      !0,
    );
    a &&
      window.webkit.messageHandlers.controller.postMessage({
        name: "elementBlurred",
        focusedElementMetadata: a,
        formMetadata: o,
      });
  }
  inputEventHandler(e) {
    const t = FocusManager.#o(e);
    if (!t) return;
    let [a, o] = FormMetadataJS.textFieldOrSelectElementMetadata(
      t,
      WBSFormMetadataRequestTextChange,
      !0,
    );
    a &&
      (this.jsController.populateRectFieldsInFormElementMetadata(a, t),
      window.webkit.messageHandlers.controller.postMessage({
        name: "elementInput",
        focusedElementMetadata: a,
        formMetadata: o,
      }));
  }
  submitEventHandler(e) {
    const t = e.target,
      a = this.jsController.getMetadataForForm(t);
    t.setUserInfo(a);
  }
}
class AutoFillButtonManager {
  jsController;
  constructor(e) {
    this.jsController = e;
  }
  addEventListeners() {
    document.addEventListener(
      "webkitautofillrequest",
      this.webKitAutofillRequestEventHandler.bind(this),
      { capture: !0 },
    );
  }
  webKitAutofillRequestEventHandler(e) {
    const t = e.target;
    let [a, o] = this.jsController._getMetadataForControl(
      t,
      WBSFormMetadataRequestNormal,
    );
    window.webkit.messageHandlers.controller.postMessage({
      name: "manualAutoFillRequest",
      focusedElementMetadata: a,
      formMetadata: o,
    });
  }
}
let formMetadataJSController = new FormMetadataJSController();
