//# sourceURL=__InjectedScript_FormMetadataJSController.js
/* Copyright (c) 2026 Apple Inc. All rights reserved. */
"use strict";
const WBSMinimumLogicalWidthToShowManualAutoFillButton = 100,
  WKInputFieldActionTypeMoveUp = 0,
  WKInputFieldActionTypeMoveDown = 1,
  WKInputFieldActionTypeCancel = 2,
  WKInputFieldActionTypeInsertTab = 3,
  WKInputFieldActionTypeInsertBacktab = 4,
  WKInputFieldActionTypeInsertNewline = 5,
  WKInputFieldActionTypeInsertDelete = 6,
  textDidChangeCoalescingTime = 100;
class FormMetadataFieldPatternMatcher {
  searchRegularExpression;
  constructor(e) {
    this.buffer = e;
  }
  dfa() {
    return this.buffer.asUTF16String();
  }
}
class FormMetadataJSController {
  static isDebugConsoleLoggingEnabled =
    AutoFillControllerConfig.isDebugConsoleLoggingEnabled;
  static collectAllFields = AutoFillControllerConfig.collectAllFields;
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
      window.webkit.buffers.keywordsIndicatingLoginFormTypeToScoreForMatching,
    ),
  ];
  static oneTimeCodeFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      window.webkit.buffers.oneTimeCodeFieldLabels,
    ),
  ];
  static nonAccountPasswordSecureTextEntryFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      window.webkit.buffers.nonAccountPasswordSecureTextEntryFieldLabels,
    ),
  ];
  static ignoredDataTypeFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      window.webkit.buffers.ignoredDataTypeFieldLabels,
    ),
  ];
  static genericAdditionalClassificationLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      window.webkit.buffers.genericAdditionalClassificationLabels,
    ),
  ];
  static additionalClassificationControlLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      window.webkit.buffers.additionalClassificationControlLabels,
    ),
  ];
  static oldPasswordFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      window.webkit.buffers.oldPasswordFieldLabels,
    ),
  ];
  static confirmPasswordFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      window.webkit.buffers.confirmPasswordFieldLabels,
    ),
  ];
  static confirmEmailFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      window.webkit.buffers.confirmEmailFieldLabels,
    ),
  ];
  static showHideButtonLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      window.webkit.buffers.showHideButtonLabels,
    ),
  ];
  static searchFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      window.webkit.buffers.searchFieldLabels,
    ),
  ];
  static nonUsernameFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      window.webkit.buffers.nonUsernameFieldLabels,
    ),
  ];
  static passwordFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      window.webkit.buffers.passwordFieldLabels,
    ),
  ];
  static usernameFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      window.webkit.buffers.usernameFieldLabels,
    ),
  ];
  static nonEmailFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      window.webkit.buffers.nonEmailFieldLabels,
    ),
  ];
  static weakOneTimeCodeFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      window.webkit.buffers.WeakOneTimeCodeFieldLabels,
    ),
  ];
  static codeButNotOneTimeCodeFieldLabelsPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      window.webkit.buffers.CodeButNotOneTimeCodeFieldLabels,
    ),
  ];
  static oneTimeCodeEmailProvenancePatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      window.webkit.buffers.oneTimeCodeEmailProvenanceKeywords,
    ),
  ];
  static oneTimeCodeTextMessageProvenancePatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      window.webkit.buffers.oneTimeCodeTextMessageProvenanceKeywords,
    ),
  ];
  static oneTimeCodeAuthenticatorAppProvenancePatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      window.webkit.buffers.oneTimeCodeAuthenticatorAppProvenanceKeywords,
    ),
  ];
  static dayFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(window.webkit.buffers.dayFieldLabels),
  ];
  static monthFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(window.webkit.buffers.monthFieldLabels),
  ];
  static yearFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(window.webkit.buffers.yearFieldLabels),
  ];
  static addressBookFieldLabelPatternMatchers =
    newAddressBookFieldLabelPatternMatchers();
  static emailFieldLabelPatternMatchers = newEmailFieldLabelPatternMatchers();
  static creditCardNumberFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      window.webkit.buffers.creditCardNumberFieldLabels,
    ),
  ];
  static creditCardSecurityCodeFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      window.webkit.buffers.creditCardSecurityCodeFieldLabels,
    ),
  ];
  static creditCardCardholderFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      window.webkit.buffers.creditCardCardholderFieldLabels,
    ),
  ];
  static creditCardTypeFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      window.webkit.buffers.creditCardTypeFieldLabels,
    ),
  ];
  static nonCreditCardCardNumberFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      window.webkit.buffers.nonCreditCardCardNumberFieldLabels,
    ),
  ];
  static creditCardCompositeExpirationDateFieldLabelPatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      window.webkit.buffers.creditCardCompositeExpirationDateFieldLabels,
    ),
  ];
  static newAccountFormTypePatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      window.webkit.buffers
        .keywordsIndicatingNewAccountFormTypeToScoreForMatching,
    ),
  ];
  static federatedSignInAffordancePatternMatchers = [
    new FormMetadataFieldPatternMatcher(
      window.webkit.buffers.federatedSignInAffordanceLabels,
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
  static regularExpressionsForOneTimeCodeEmailProvenance =
    FormAutoFillKeywords.OneTimeCodeEmailProvenanceRegularExpressions;
  static regularExpressionsForOneTimeCodeTextMessageProvenance =
    FormAutoFillKeywords.OneTimeCodeTextMessageProvenanceRegularExpressions;
  static regularExpressionsForOneTimeCodeAuthenticatorAppProvenance =
    FormAutoFillKeywords.OneTimeCodeAuthenticatorAppProvenanceRegularExpressions;
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
        this.focusManager.cleanUp();
        let e = null;
        (document.activeElement instanceof HTMLInputElement &&
          (e = FormMetadataJS.textFieldOrSelectElementMetadata(
            document.activeElement,
            WBSFormMetadataRequestNormal,
          )[0]),
          window.webkit.messageHandlers.controller.postMessage({
            name: "pageHide",
            focusedControlMetadata: e,
          }));
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
  textEditingStatus() {
    const [e, t] = FormMetadataJS.visibleNonEmptyFormTextControls(),
      a = e.filter((e) => e.lastChangeWasUserEdit),
      o = t.filter((e) => e.lastChangeWasUserEdit),
      r = document.body.onbeforeunload,
      n = null != r;
    return {
      numberOfTextInputElements: a.length,
      numberOfTextAreaElements: o.length,
      hasOnBeforeUnloadEventHandler: n,
    };
  }
  async fillFormWithPassword(e, t, a, o) {
    const r = await FormMetadataJS.fillFormWithPassword(e, a, t);
    if (r)
      for (const e of r) {
        const t = FormMetadataJS.formControlWithUniqueID(e);
        t && (t.autofillVisibility = o ? "hidden" : "visible");
      }
    o && AutomaticPasswordsJS.blurControlWithID(t);
    let n = null;
    const i = FormMetadataJS.formsAndMetadata(WBSFormMetadataRequestNormal)[1];
    for (const t of i)
      if (t.FormID === e) {
        n = t;
        break;
      }
    return { controlIDs: r, formMetadata: n };
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
  static autocompleteTokenMapDFA() {
    return window.webkit.buffers.autocompleteTokenMapMatcher.asUTF16String();
  }
  static fieldLabelMapDFA() {
    return window.webkit.buffers.fieldLabelMapMatcher.asUTF16String();
  }
  static getValueSpecifiers(e) {
    return valueSpecifiers[e];
  }
  showAutoFillButtonInControl(e, t) {
    const a = FormMetadataJS.formControlWithUniqueID(e);
    (FormMetadataJSController.#t(a) || "none" === t) &&
      a._setAutofillButtonType(t);
  }
  hideAutoFillButtonInControl(e) {
    FormMetadataJS.formControlWithUniqueID(e)._setAutofillButtonType("none");
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
    this.#a(e).forEach((e) => e.blur());
  }
  clearControls(e) {
    e.forEach((e) => FormMetadataJS.clearField(e));
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
  getMetadataForFocusedElement(e = WBSFormMetadataRequestNormal) {
    const t = innermostActiveElement();
    return t ? this._getMetadataForControl(t, e) : [null, null];
  }
  getMetadataForControl(e, t = WBSFormMetadataRequestNormal) {
    const a = FormMetadataJS.formControlWithUniqueID(e);
    return a ? this._getMetadataForControl(a, t) : [null, null];
  }
  static #o(e) {
    let t = 0;
    const a = e.FirstCreditCardCardholderFieldOrCreditCardNumberFieldUniqueID,
      o = e.UserNameElementUniqueID,
      r = e.PasswordElementUniqueID,
      n = e.ConfirmPasswordElementUniqueID,
      i = 1,
      l = 10;
    if ((a && (t += i), o && (t += i), r && (t += i), n && (t += i), !t))
      return t;
    for (const i of e.FormControls) {
      const e = i.ControlUniqueID;
      if (e === a || e === o || e === r || e === n) {
        i.ControlValue && (t += l);
      }
    }
    return t;
  }
  getMetadataForForm(e) {
    const [t, a] = FormMetadataJS.formsAndMetadata(
      WBSFormMetadataRequestNormal,
    );
    let o = -1,
      r = null;
    for (let n = 0; n < t.length; n++)
      if (t[n] === e) {
        const e = a[n],
          t = FormMetadataJSController.#o(e);
        t > o && ((o = t), (r = e));
      }
    return r;
  }
  _getMetadataForControl(e, t) {
    let [a, o] = FormMetadataJS.textFieldOrSelectElementMetadata(e, t);
    return (this.populateRectFieldsInFormElementMetadata(a, e), [a, o]);
  }
  focusControl(e, t = !1) {
    FormMetadataJS.focusControl(e, t);
  }
  replaceRangeInControl(e, t, a, o, r) {
    FormMetadataJS.replaceFormFieldRangeAndSelectTail(e, t, a, o, r);
    const n = FormMetadataJS.formControlWithUniqueID(e);
    if (n)
      return FormMetadataJS.textFieldOrSelectElementMetadata(
        n,
        WBSFormMetadataRequestNormal,
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
    return e.flatMap((e) => FormMetadataJS.formControlWithUniqueID(e));
  }
  static autoFilledFieldWithMetadata(e) {
    let [t, a] = FormMetadataJS.textFieldOrSelectElementMetadata(
      e,
      WBSFormMetadataRequestNormal,
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
  static logicalFormObservedNewControlsWereAdded(e) {
    window.webkit.messageHandlers.controller.postMessage({
      name: "formObservedNewControlsWereAdded",
      formMetadata: e,
    });
  }
  static fieldLabelToInfo(e) {
    if (void 0 === e) return null;
    const [t, a] = e;
    if (t === 65535) return [a, "", "", ""];
    const o = valueSpecifiers[t];
    return [a, o.property, o.category, o.parentProperty];
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
class EventDispatcher {
  #r = new Map();
  addGlobalListener(e, t) {
    (this.#r.has(e) || this.#r.set(e, new Set()), this.#r.get(e).add(t));
  }
  dispatchEvent(e) {
    if (this.#r.has(e.type))
      for (const t of this.#r.get(e.type)) t(e.target, e.data);
  }
}
const formMetadataEventDispatcher = new EventDispatcher();
class FocusManager {
  jsController;
  fieldMovementChecker;
  #n = null;
  constructor(e) {
    ((this.jsController = e),
      (this.fieldMovementChecker = new FieldMovementChecker(
        this.handleElementFocused.bind(this),
      )));
  }
  addEventListeners() {
    (formMetadataEventDispatcher.addGlobalListener(
      "webkitsubmit",
      this.submitEventHandler.bind(this),
    ),
      formMetadataEventDispatcher.addGlobalListener(
        "webkitbeforefocus",
        this.focusInEventHandler.bind(this),
      ),
      formMetadataEventDispatcher.addGlobalListener(
        "webkitbeforeblur",
        this.focusOutEventHandler.bind(this),
      ),
      formMetadataEventDispatcher.addGlobalListener(
        "webkitfocusedelementdisconnected",
        this.focusOutEventHandler.bind(this),
      ),
      formMetadataEventDispatcher.addGlobalListener(
        "webkitusertextinput",
        this.inputEventHandler.bind(this),
      ),
      formMetadataEventDispatcher.addGlobalListener(
        "keydown",
        this.keydownEventHandler.bind(this),
      ));
  }
  focusInEventHandler(e) {
    this.fieldMovementChecker.reset();
    let [t, a] = FormMetadataJS.textFieldOrSelectElementMetadata(
      e,
      WBSFormMetadataRequestNormal,
    );
    t &&
      (e.setUserInfo({ form: a, textField: t }),
      this.fieldMovementChecker.setTextFieldToMonitor(e, t, a),
      this.fieldMovementChecker.scheduleNextCheckForFieldMovement(),
      this.handleElementFocused(e, t, a));
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
    let [t, a] = FormMetadataJS.textFieldOrSelectElementMetadata(
      e,
      WBSFormMetadataRequestNormal,
    );
    t &&
      window.webkit.messageHandlers.controller.postMessage({
        name: "elementBlurred",
        focusedElementMetadata: t,
        formMetadata: a,
      });
  }
  cleanUp() {
    this.#n && (clearTimeout(this.#n), (this.#n = null));
  }
  inputEventHandler(e) {
    (this.#n && clearTimeout(this.#n),
      (this.#n = setTimeout(() => {
        this.#i(e);
      }, textDidChangeCoalescingTime)));
  }
  #i(e) {
    let [t, a] = FormMetadataJS.textFieldOrSelectElementMetadata(
      e,
      WBSFormMetadataRequestTextChange,
    );
    t &&
      (this.jsController.populateRectFieldsInFormElementMetadata(t, e),
      window.webkit.messageHandlers.controller.postMessage({
        name: "elementInput",
        focusedElementMetadata: t,
        formMetadata: a,
      }));
  }
  static #l(e, t) {
    switch (e) {
      case "ArrowUp":
        return WKInputFieldActionTypeMoveUp;
      case "ArrowDown":
        return WKInputFieldActionTypeMoveDown;
      case "Escape":
        return WKInputFieldActionTypeCancel;
      case "Tab":
        return t
          ? WKInputFieldActionTypeInsertBacktab
          : WKInputFieldActionTypeInsertTab;
      case "Enter":
        return WKInputFieldActionTypeInsertNewline;
      case "Backspace":
        return WKInputFieldActionTypeInsertDelete;
      default:
        return null;
    }
  }
  keydownEventHandler(e, t) {
    const a = FocusManager.#l(t.key, t.shiftKey);
    if (null === a) return;
    const [o, r] = this.jsController._getMetadataForControl(
      e,
      WBSFormMetadataRequestNormal,
    );
    window.webkit.messageHandlers.controller.postMessage({
      name: "observedActionInFormTextField",
      action: a,
      controlMetadata: o,
      formMetadata: r,
    });
  }
  submitEventHandler(e) {
    const t = this.jsController.getMetadataForForm(e);
    e.setUserInfo(t);
  }
}
class AutoFillButtonManager {
  jsController;
  constructor(e) {
    this.jsController = e;
  }
  addEventListeners() {
    formMetadataEventDispatcher.addGlobalListener(
      "webkitautofillrequest",
      this.webKitAutofillRequestEventHandler.bind(this),
    );
  }
  webKitAutofillRequestEventHandler(e) {
    let [t, a] = this.jsController._getMetadataForControl(
      e,
      WBSFormMetadataRequestNormal,
    );
    window.webkit.messageHandlers.controller.postMessage({
      name: "manualAutoFillRequest",
      focusedElementMetadata: t,
      formMetadata: a,
    });
  }
}
let formMetadataJSController = new FormMetadataJSController();
eventQueue.setDelegate(formMetadataEventDispatcher);
0;
