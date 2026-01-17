//# sourceURL=__InjectedScript_Reader.js
/* Copyright (c) 2025 Apple Inc. All rights reserved. */
/*
 * Copyright (c) 2010 Apple Inc. All rights reserved.
 */
function setScrollTop(e) {
  document.documentElement.scrollTop = e;
}
function readerWillBecomeVisible() {
  setReaderIsActive(!0);
}
function readerWillEnterBackground() {
  setReaderIsActive(!1);
}
((ReaderJS._clickingOutsideOfPaperRectangleDismissesReader = !0),
  (ReaderJS._isJavaScriptEnabled = function () {
    return !!(ReaderJSController.initialConfiguration() || {})[
      ReaderConfigurationJavaScriptEnabledKey
    ];
  }),
  (ReaderAppearanceJS._tryApplyStaticConfiguration = function () {
    return (document.body.classList.add("mac"), !1);
  }));
