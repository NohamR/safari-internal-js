//# sourceURL=__InjectedScript_AutomaticPasswords.js
/* Copyright (c) 2025 Apple Inc. All rights reserved. */
"use strict";
class AutomaticPasswords {
  removeAutomaticPasswordElements(t, e, o) {
    for (let e of t)
      FormMetadataJS.removeAutomaticStrongPasswordFromPasswordElement(e);
    if (!o) return;
    let r = document.activeElement,
      a = e ? FormMetadataJS.formControlWithUniqueID(e) : null;
    (a && a.blur(), a && a === r && a.focus());
  }
  blurControlWithID(t) {
    let e = t ? FormMetadataJS.formControlWithUniqueID(t) : null;
    e && e.blur();
  }
  setStrongPasswordElementViewableIfAppropriate(t, e) {
    for (let o of t) {
      let t = FormMetadataJS.formControlWithUniqueID(o);
      if (!t) return;
      if ("text" === t.type)
        return (
          FormMetadataJSController.setInputElementAutoFilledAndViewable(t, !1),
          void FormMetadataJSController.setInputElementAutofilled(t, !1)
        );
      FormMetadataJSController.setInputElementAutoFilledAndViewable(t, e);
    }
  }
}
var AutomaticPasswordsJS = new AutomaticPasswords();
