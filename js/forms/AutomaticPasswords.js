//# sourceURL=__InjectedScript_AutomaticPasswords.js
/* Copyright (c) 2025 Apple Inc. All rights reserved. */
((FormMetadata.prototype._collectExtraControlMetadata = function (t, o) {
  let e = t.getAttribute("passwordrules");
  o.ControlPasswordRules = e || void 0;
}),
  (FormMetadata.prototype.removeAutomaticStrongPasswordFromPasswordElement =
    function (t) {
      let o = this.formControlWithUniqueID(t);
      o &&
        this._isTextField(o) &&
        (this.clearField(t),
        this._updateAnnotationsForField(o),
        FormMetadataJSController.setInputElementAutofilled(o, !1));
    }));
let AutomaticPasswords = function () {};
AutomaticPasswords.prototype = {
  removeAutomaticPasswordElements: function (t, o, e) {
    for (let o of t)
      FormMetadataJS.removeAutomaticStrongPasswordFromPasswordElement(o);
    if (!e) return;
    let r = document.activeElement,
      a = o ? FormMetadataJS.formControlWithUniqueID(o) : null;
    (a && a.blur(), a && a === r && a.focus());
  },
  blurControlWithID: function (t) {
    let o = t ? FormMetadataJS.formControlWithUniqueID(t) : null;
    o && o.blur();
  },
  setStrongPasswordElementViewableIfAppropriate: function (t, o) {
    for (let e of t) {
      let t = FormMetadataJS.formControlWithUniqueID(e);
      if (!t) return;
      if ("text" === t.type)
        return (
          FormMetadataJSController.setInputElementAutoFilledAndViewable(t, !1),
          void FormMetadataJSController.setInputElementAutofilled(t, !1)
        );
      FormMetadataJSController.setInputElementAutoFilledAndViewable(t, o);
    }
  },
};
var AutomaticPasswordsJS = new AutomaticPasswords();
