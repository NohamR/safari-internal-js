//# sourceURL=__InjectedScript_ReaderMobileUI.js
/* Copyright (c) 2026 Apple Inc. All rights reserved. */
/*
 * Copyright (c) 2010 Apple Inc. All rights reserved.
 */
function orientationChanged() {
  ReaderAppearanceJS.layOutContent();
}
function articleHasScrolled() {
  ReaderJS.resumeCachedNextPageLoadIfNecessary();
}
function contentInPrintingMailingFrame() {
  let e = document.getElementById(ReaderJS.printingMailingFrameElementId());
  return (
    e ||
      (ReaderJS.preparePrintingMailingFrame(),
      (e = document.getElementById(ReaderJS.printingMailingFrameElementId()))),
    e.contentDocument.documentElement.innerHTML
  );
}
(window.addEventListener("orientationchange", orientationChanged, !1),
  window.addEventListener("scroll", articleHasScrolled, !1));
let originalShouldUsePaperAppearance =
  ReaderAppearanceJS._shouldUsePaperAppearance.bind(ReaderAppearanceJS);
((ReaderAppearanceJS._shouldUsePaperAppearance = function () {
  return (
    0 !== window.orientation &&
    180 !== window.orientation &&
    originalShouldUsePaperAppearance()
  );
}),
  (ReaderAppearanceJS._isOLEDDisplay = function () {
    return !!(ReaderJSController.initialConfiguration() || {}).isOLEDDisplay;
  }),
  (ReaderJS._distanceFromBottomOfArticleToStartLoadingNextPage = function () {
    return (
      ReaderJSController.maxDistanceForLoadingNextPage() ||
      (screen.height >= 1024 ? 2048 : 1024)
    );
  }),
  (ReaderJS._shouldSkipActivationWhenPageLoads = function () {
    return (
      ReaderJSController.isLoadingFromOfflineReadingListArchive &&
      ReaderJSController.isLoadingFromOfflineReadingListArchive()
    );
  }),
  (ReaderJS._shouldConvertRelativeURLsToAbsoluteURLsWhenPrintingOrMailing = !0),
  (ReaderJS._deferSendingContentIsReadyForDisplay = !0),
  (ReaderJS._isJavaScriptEnabled = function () {
    return !!(ReaderJSController.initialConfiguration() || {})[
      ReaderConfigurationJavaScriptEnabledKey
    ];
  }),
  (ReaderAppearanceJS._tryApplyStaticConfiguration = function () {
    return (document.body.classList.add("ios"), !1);
  }));
0;
