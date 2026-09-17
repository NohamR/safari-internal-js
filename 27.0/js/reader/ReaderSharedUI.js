//# sourceURL=__InjectedScript_ReaderSharedUI.js
/* Copyright (c) 2026 Apple Inc. All rights reserved. */
// Copyright (c) 2013-2024 Apple Inc. All rights reserved.
function articleHeight() {
  return (
    document.getElementById("article").offsetHeight +
    2 *
      parseFloat(getComputedStyle(document.getElementById("article")).marginTop)
  );
}
function smoothScroll(e, t, n, i) {
  function o(t, n) {
    ((scrollEventIsSmoothScroll = !0),
      (e.scrollTop = n),
      setTimeout(function () {
        scrollEventIsSmoothScroll = !1;
      }, 0));
  }
  const r = 1e3 / 60;
  let a = e.scrollTop,
    l = a + t,
    s = 0,
    d = articleHeight() - window.innerHeight;
  if ((l < s && (l = s), l > d && (l = d), a == l)) return;
  let c = Math.abs(l - a);
  if (
    (c < Math.abs(t) && (n = (n * c) / Math.abs(t)), smoothScrollingAnimator)
  ) {
    let e = smoothScrollingAnimator.animations[0].progress,
      t = e > 0.5 ? 1 - e : e,
      s = n / (1 - t),
      d = -t * s,
      c = Math.sin((Math.PI / 2) * t),
      m = c * c,
      u = (a - l * m) / (1 - m);
    return (
      abortSmoothScroll(),
      (smoothScrollingAnimator = new AppleAnimator(s, r, i)),
      (smoothScrollingAnimation = new AppleAnimation(u, l, o)),
      smoothScrollingAnimator.addAnimation(smoothScrollingAnimation),
      void smoothScrollingAnimator.start(d)
    );
  }
  ((smoothScrollingAnimator = new AppleAnimator(n, r, i)),
    (smoothScrollingAnimation = new AppleAnimation(a, l, o)),
    smoothScrollingAnimator.addAnimation(smoothScrollingAnimation),
    smoothScrollingAnimator.start());
}
function abortSmoothScroll() {
  (smoothScrollingAnimator.stop(AnimationTerminationCondition.Interrupted),
    (smoothScrollingAnimator = null),
    (smoothScrollingAnimation = null));
}
function articleScrolled() {
  (!scrollEventIsSmoothScroll && smoothScrollingAnimator && abortSmoothScroll(),
    isReaderViewInSeparateProcess
      ? (void 0 !== articleScrolledNotificationCoalescer &&
          clearTimeout(articleScrolledNotificationCoalescer),
        (articleScrolledNotificationCoalescer = setTimeout(function () {
          (readerViewMessageHandler.postMessage({
            command: "didScroll",
            scrollPosition: getArticleScrollPosition(),
          }),
            (articleScrolledNotificationCoalescer = void 0));
        }, 1e3)))
      : ReaderJSController.articleScrolled());
}
function traverseReaderContent(e, t) {
  if (!e) return;
  let n = e.offsetTop,
    i = document.createTreeWalker(
      document.getElementById("article"),
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: function (e) {
          let t = e.classList;
          return t.contains("page-number") ||
            t.contains("float") ||
            t.contains("page") ||
            t.contains("scrollable") ||
            "HR" === e.tagName ||
            0 === e.offsetHeight ||
            "inline" === getComputedStyle(e).display ||
            n === e.offsetTop
            ? NodeFilter.FILTER_SKIP
            : NodeFilter.FILTER_ACCEPT;
        },
      },
    );
  return ((i.currentNode = e), i[t]());
}
function nextReaderContentElement(e) {
  return traverseReaderContent(e, "nextNode");
}
function previousReaderContentElement(e) {
  return traverseReaderContent(e, "previousNode");
}
function articleTitleElement() {
  return document.querySelector("#article .page .title");
}
function articleTitleContainer() {
  return document.querySelector('[data-reader-unique-id="titleElement"]');
}
function mediaElementIsPlaying(e) {
  return !!(e.currentTime > 0 && !e.paused && !e.ended && e.readyState > 2);
}
function keyDown(e) {
  let t = !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey),
    n = !e.metaKey && !e.altKey && !e.ctrlKey && e.shiftKey;
  switch (e.keyCode) {
    case 8:
      (n ? ReaderJSController.goForward() : t && ReaderJSController.goBack(),
        e.preventDefault());
      break;
    case 74:
      ContentAwareScrollerJS.scroll(ContentAwareNavigationDirection.Down);
      break;
    case 75:
      ContentAwareScrollerJS.scroll(ContentAwareNavigationDirection.Up);
      break;
    case 82:
      t && ReaderJS.reloadArticlePreservingScrollPosition();
  }
}
function getArticleScrollPosition() {
  ((scrollInfo = {}), (scrollInfo.version = 1));
  let e = document.getElementsByClassName("page"),
    t = e.length;
  if (!t) return ((scrollInfo.pageIndex = 0), scrollInfo);
  scrollInfo.pageIndex = e.length - 1;
  let n = window.scrollY;
  for (let i = 0; i < t; i++) {
    let t = e[i];
    if (t.offsetTop + t.offsetHeight >= n) {
      scrollInfo.pageIndex = i;
      break;
    }
  }
  return scrollInfo;
}
function restoreInitialArticleScrollPosition() {
  let e =
    document.getElementsByClassName("page")[initialScrollPosition.pageIndex];
  e && (document.scrollingElement.scrollTop = e.offsetTop);
}
function restoreInitialArticleScrollPositionIfPossible() {
  if (didRestoreInitialScrollPosition) return;
  if (
    !initialScrollPosition &&
    ((initialScrollPosition =
      ReaderJSController.initialArticleScrollPosition()),
    !initialScrollPosition || !initialScrollPosition.pageIndex)
  )
    return void (didRestoreInitialScrollPosition = !0);
  let e = document.getElementsByClassName("page-number").length;
  initialScrollPosition.pageIndex >= e ||
    (setTimeout(
      restoreInitialArticleScrollPosition,
      DelayBeforeRestoringScrollPositionInMs,
    ),
    (didRestoreInitialScrollPosition = !0));
}
function makeWideElementsScrollable() {
  let e = document.querySelectorAll("table, pre");
  for (let t of e) {
    if (t.classList.contains("float")) continue;
    if (t.parentElement.classList.contains("scrollable")) continue;
    let e = document.createElement("div");
    (t.parentElement.insertBefore(e, t),
      t.remove(),
      e.appendChild(t),
      e.classList.add("scrollable"));
  }
}
function fontSettings(e) {
  function t(e) {
    return e.replace(/\W/g, "").toLowerCase();
  }
  const n = [15, 16, 17, 18, 19, 20, 21, 23, 26, 28, 37, 46],
    i = [
      "25px",
      "26px",
      "27px",
      "28px",
      "29px",
      "30px",
      "31px",
      "33px",
      "37px",
      "39px",
      "51px",
      "62px",
    ];
  let o = {
    System: {
      lineHeights: [
        "25px",
        "26px",
        "27px",
        "29px",
        "30px",
        "31px",
        "32px",
        "33px",
        "38px",
        "39px",
        "51px",
        "62px",
      ],
      usesSystemFont: !0,
    },
    Charter: {
      lineHeights: [
        "25px",
        "26px",
        "27px",
        "28px",
        "29px",
        "30px",
        "32px",
        "34px",
        "38px",
        "39px",
        "51px",
        "62px",
      ],
    },
    Georgia: {
      lineHeights: [
        "25px",
        "26px",
        "27px",
        "28px",
        "29px",
        "30px",
        "32px",
        "34px",
        "38px",
        "41px",
        "51px",
        "62px",
      ],
    },
    "Iowan Old Style": {
      lineHeights: [
        "25px",
        "26px",
        "27px",
        "28px",
        "29px",
        "30px",
        "32px",
        "34px",
        "38px",
        "39px",
        "51px",
        "62px",
      ],
    },
    Palatino: {
      lineHeights: [
        "25px",
        "26px",
        "27px",
        "28px",
        "29px",
        "30px",
        "31px",
        "34px",
        "37px",
        "40px",
        "51px",
        "62px",
      ],
    },
    Seravek: {
      lineHeights: [
        "25px",
        "26px",
        "27px",
        "28px",
        "28px",
        "30px",
        "31px",
        "34px",
        "37px",
        "39px",
        "51px",
        "62px",
      ],
    },
    "Hiragino Sans W3": {
      lineHeights: [
        "1.85em",
        "1.78em",
        "1.74em",
        "1.71em",
        "1.72em",
        "1.73em",
        "1.75em",
        "1.76em",
        "1.78em",
        "1.9em",
        "1.92em",
        "2em",
      ],
    },
    "Hiragino Kaku Gothic ProN": {
      lineHeights: [
        "1.85em",
        "1.78em",
        "1.74em",
        "1.7em",
        "1.69em",
        "1.68em",
        "1.69em",
        "1.7em",
        "1.74em",
        "1.85em",
        "1.9em",
        "2em",
      ],
    },
    "Hiragino Mincho ProN": {
      lineHeights: [
        "1.75em",
        "1.72em",
        "1.69em",
        "1.66em",
        "1.64em",
        "1.56em",
        "1.53em",
        "1.56em",
        "1.6em",
        "1.65em",
        "1.69em",
        "1.72em",
      ],
    },
    "Hiragino Maru Gothic ProN": {
      lineHeights: [
        "1.85em",
        "1.78em",
        "1.74em",
        "1.7em",
        "1.69em",
        "1.68em",
        "1.69em",
        "1.7em",
        "1.74em",
        "1.85em",
        "1.9em",
        "2em",
      ],
    },
    "PingFang SC": {
      lineHeights: [
        "1.85em",
        "1.78em",
        "1.74em",
        "1.7em",
        "1.69em",
        "1.68em",
        "1.69em",
        "1.7em",
        "1.74em",
        "1.85em",
        "1.9em",
        "2em",
      ],
      usesSystemFont: !0,
    },
    "Heiti SC": {
      lineHeights: [
        "1.85em",
        "1.78em",
        "1.74em",
        "1.7em",
        "1.7em",
        "1.71em",
        "1.72em",
        "1.75em",
        "1.8em",
        "1.9em",
        "1.95em",
        "2em",
      ],
    },
    "Songti SC": {
      lineHeights: [
        "1.8em",
        "1.78em",
        "1.74em",
        "1.72em",
        "1.71em",
        "1.72em",
        "1.73em",
        "1.75em",
        "1.8em",
        "1.9em",
        "1.95em",
        "1.96em",
      ],
    },
    "Kaiti SC": {
      lineHeights: [
        "1.75em",
        "1.72em",
        "1.69em",
        "1.66em",
        "1.64em",
        "1.56em",
        "1.53em",
        "1.56em",
        "1.6em",
        "1.65em",
        "1.69em",
        "1.72em",
      ],
    },
    "Yuanti SC": {
      lineHeights: [
        "1.95em",
        "1.93em",
        "1.9em",
        "1.87em",
        "1.85em",
        "1.8em",
        "1.83em",
        "1.85em",
        "1.88em",
        "1.9em",
        "1.91em",
        "1.92em",
      ],
    },
    "Libian SC": {
      fontSizes: [27, 28, 29, 30, 31, 32, 33, 35, 37, 40, 42, 46],
      lineHeights: [
        "1.65em",
        "1.63em",
        "1.62em",
        "1.61em",
        "1.6em",
        "1.6em",
        "1.61em",
        "1.62em",
        "1.63em",
        "1.64em",
        "1.64em",
        "1.65em",
      ],
    },
    "Weibei SC": {
      fontSizes: [21, 22, 23, 24, 25, 26, 27, 29, 32, 34, 39, 43],
      lineHeights: [
        "1.65em",
        "1.63em",
        "1.62em",
        "1.61em",
        "1.6em",
        "1.6em",
        "1.61em",
        "1.62em",
        "1.63em",
        "1.64em",
        "1.64em",
        "1.65em",
      ],
    },
    "Yuppy SC": {
      lineHeights: [
        "1.75em",
        "1.73em",
        "1.7em",
        "1.67em",
        "1.65em",
        "1.6em",
        "1.63em",
        "1.65em",
        "1.68em",
        "1.7em",
        "1.71em",
        "1.72em",
      ],
    },
    "PingFang TC": {
      lineHeights: [
        "1.85em",
        "1.78em",
        "1.75em",
        "1.72em",
        "1.7em",
        "1.7em",
        "1.7em",
        "1.72em",
        "1.75em",
        "1.82em",
        "1.85em",
        "1.9em",
      ],
      usesSystemFont: !0,
    },
    "Heiti TC": {
      lineHeights: [
        "1.85em",
        "1.78em",
        "1.75em",
        "1.72em",
        "1.71em",
        "1.71em",
        "1.72em",
        "1.75em",
        "1.78em",
        "1.82em",
        "1.86em",
        "1.9em",
      ],
    },
    "Songti TC": {
      lineHeights: [
        "1.8em",
        "1.78em",
        "1.74em",
        "1.73em",
        "1.72em",
        "1.72em",
        "1.73em",
        "1.75em",
        "1.8em",
        "1.9em",
        "1.95em",
        "1.96em",
      ],
    },
    "Kaiti TC": {
      fontSizes: [20, 21, 22, 23, 24, 25, 26, 28, 31, 33, 38, 43],
      lineHeights: [
        "1.63em",
        "1.62em",
        "1.62em",
        "1.6em",
        "1.56em",
        "1.53em",
        "1.5em",
        "1.53em",
        "1.56em",
        "1.6em",
        "1.62em",
        "1.63em",
      ],
    },
    "Yuanti TC": {
      lineHeights: [
        "1.95em",
        "1.93em",
        "1.9em",
        "1.87em",
        "1.85em",
        "1.8em",
        "1.83em",
        "1.85em",
        "1.88em",
        "1.9em",
        "1.91em",
        "1.92em",
      ],
    },
    "Libian TC": {
      fontSizes: [27, 28, 29, 30, 31, 32, 33, 35, 37, 40, 42, 46],
      lineHeights: [
        "1.65em",
        "1.63em",
        "1.62em",
        "1.61em",
        "1.6em",
        "1.6em",
        "1.61em",
        "1.62em",
        "1.63em",
        "1.64em",
        "1.64em",
        "1.65em",
      ],
    },
    "Weibei TC": {
      fontSizes: [21, 22, 23, 24, 25, 26, 27, 29, 32, 34, 39, 43],
      lineHeights: [
        "1.65em",
        "1.63em",
        "1.62em",
        "1.61em",
        "1.6em",
        "1.6em",
        "1.61em",
        "1.62em",
        "1.63em",
        "1.64em",
        "1.64em",
        "1.65em",
      ],
    },
    "Yuppy TC": {
      lineHeights: [
        "1.75em",
        "1.73em",
        "1.7em",
        "1.67em",
        "1.65em",
        "1.6em",
        "1.63em",
        "1.65em",
        "1.68em",
        "1.7em",
        "1.71em",
        "1.72em",
      ],
    },
    "Noto Nastaliq Urdu": {
      lineHeights: [
        "2.6em",
        "2.7em",
        "2.8em",
        "2.8em",
        "2.8em",
        "2.8em",
        "2.8em",
        "2.6em",
        "2.5em",
        "2.5em",
        "2.5em",
        "2.6em",
      ],
    },
  }[e];
  return (
    o || (o = {}),
    (o.cssClassName = t(e)),
    o.usesSystemFont || (o.fontFamilyName = e),
    o.fontSizes || (o.fontSizes = n),
    o.lineHeights || (o.lineHeights = i),
    o
  );
}
function prepareTweetsInPrintingMailingFrame(e) {
  let t = e.querySelectorAll(".tweet-wrapper");
  for (let e of t) {
    let t = e.querySelector("iframe");
    t && t.remove();
    let n = e.querySelector(".simple-tweet");
    n && n.classList.remove("hidden");
  }
}
function urlFromString(e) {
  try {
    return new URL(e);
  } catch (e) {
    return null;
  }
}
function stopExtendingElementBeyondTextColumn(e) {
  (e.classList.remove("extendsBeyondTextColumn"),
    e.style &&
      (e.style.removeProperty("width"),
      e.style.removeProperty("-webkit-margin-start")));
}
function leadingMarginAndPaddingAppliedToElementFromAncestors(e) {
  let t = 0,
    n = e.parentElement;
  for (; n && !n.classList.contains("page");) {
    let e = getComputedStyle(n);
    ((t +=
      parseFloat(e["-webkit-padding-start"]) +
      parseFloat(e["-webkit-margin-start"])),
      (n = n.parentElement));
  }
  return t;
}
function extendElementBeyondTextColumn(e, t, n) {
  (e.classList.add("extendsBeyondTextColumn"),
    e.style &&
      (e.style.setProperty("width", t + "px"),
      e.style.setProperty(
        "-webkit-margin-start",
        (n - t) / 2 -
          leadingMarginAndPaddingAppliedToElementFromAncestors(e) +
          "px",
      )));
}
function removeAllZeroWidthSpace() {
  document.querySelectorAll("*").forEach((e) => {
    e.childNodes.forEach((e) => {
      e.nodeType === Node.TEXT_NODE &&
        (e.textContent = e.textContent.replace(/\u200B/g, ""));
    });
  });
}
function markWithZeroWidthSpaceDelimiterIfNeeded(e) {
  if (!e) return;
  let t = "\u200b",
    n = document.createElement("p");
  ((n.innerText = t),
    (n.style.height = "0px"),
    (n.style.width = "0px"),
    (n.style.margin = "0px"));
  let i = document.createElement("p");
  ((i.innerText = t),
    (i.style.height = "0px"),
    (i.style.width = "0px"),
    (i.style.margin = "0px"));
  let o = e.firstChild,
    r = e.lastChild;
  (o && "\u200b" != o.innerText && e.insertBefore(n, o),
    r && "\u200b" != r.innerText && e.appendChild(i));
}
function containsAssistantContent() {
  return ReaderController.hasAssistantContent;
}
function shouldShowAssistantSidebar() {
  let e = window.innerWidth,
    t = e - document.getElementById("article").offsetWidth,
    n = document.getElementById("assistant-container").offsetWidth;
  return ReaderJS._canShowAssistantSidebar() && e > 1e3 && t > n + 100;
}
function layoutAssistantContent() {
  let e = document.getElementById("sidebarButton"),
    t = document.getElementById("assistant-container"),
    n = window.innerWidth,
    i = document.getElementById("article"),
    o = document.getElementById("summary-collapsible"),
    r = document.getElementById("summary-collapsedContent"),
    a = document.getElementById("tableOfContentsInsideArticleHeader"),
    l = document.getElementById("tableOfContentsInsideArticle-list"),
    s = document.getElementById("tableOfContents-container"),
    d = document.getElementById("summary-container"),
    c = document.getElementById("innerAssistantContainer"),
    m = null != o,
    u = null != l,
    g = document.getElementById("onDeviceSummaryButton"),
    h = null != g && null != g,
    p = ReaderController.isShowingOnDeviceSummary;
  if (
    ((t.style.display = "inline-block"),
    (t.style.height = "100%"),
    (t.style.padding = "50 px"),
    (t.style.minWidth = "300px"),
    (t.style.overflowY = "auto"),
    (t.style.overflowX = "hidden"),
    (t.style.position = "fixed"),
    (t.style.zIndex = "1"),
    (i.style.zIndex = "2"),
    h && m && "none" != g.style.display && (g.style.display = "none"),
    markWithZeroWidthSpaceDelimiterIfNeeded(t),
    markWithZeroWidthSpaceDelimiterIfNeeded(c),
    shouldShowAssistantSidebar() && (u || (m && !p)))
  ) {
    if (
      ((e.style.display = "block"),
      (e.style.right = "0px"),
      (e.style.top = "0px"),
      (e.style.zIndex = "3"),
      (e.style.position = "fixed"),
      (e.style.display = "block"),
      (e.style.paddingInlineStart = "1.25em"),
      (e.style.paddingInlineEnd = "1em"),
      m && !p && ((o.style.display = "none"), (r.style.display = "none")),
      u && ((l.style.display = "none"), (a.style.display = "none")),
      (c.style.display = "none"),
      "true" === e.getAttribute("data-isHidingSidebar"))
    )
      return (
        (t.style.right = "-400px"),
        void (i.style.left = (n - i.offsetWidth) / 2 + "px")
      );
    ((i.style.position = "absolute"),
      (i.style.left = (n - t.offsetWidth - i.offsetWidth) / 2 + "px"),
      (t.style.right = "0px"),
      (t.style.display = "inline-block"),
      m && !p && (d.style.display = "block"),
      u && (s.style.display = "block"),
      m && !p
        ? (d.style.paddingTop = "0.75em")
        : u && (s.style.paddingTop = "0.75em"));
  } else {
    if (
      (e && (e.style.display = "none"),
      (i.style.position = "static"),
      (i.style.left = (n - i.offsetWidth) / 2 + "px"),
      (t.style.display = "none"),
      c && (c.style.display = "block"),
      m)
    ) {
      if (
        ((o.style.display = "block"),
        (r.style.display = "block"),
        ReaderController.summaryNeedsLayout)
      ) {
        let e = document.getElementById("summary-collapsible");
        (e.classList.contains("alwaysExpanded") ||
          e.classList.toggle("expandedContent"),
          (r.style.maxHeight = r.scrollHeight + "px"),
          (r.style.paddingBottom = "1.125em"),
          (ReaderController.summaryNeedsLayout = !1));
      }
      r.style.maxHeight && (r.style.maxHeight = r.scrollHeight + "px");
    }
    (u &&
      ((a.style.display = "block"),
      (l.style.display = "block"),
      l.style.maxHeight && (l.style.maxHeight = l.scrollHeight + "px")),
      (s.style.display = "none"),
      (d.style.display = "none"));
  }
}
function monitorMouseDownForPotentialDeactivation(e) {
  lastMouseDownWasOutsideOfPaper =
    e &&
    ReaderAppearanceJS.usesPaperAppearance() &&
    !document.getElementById("article").contains(e.target) &&
    !document.getElementById("assistant-container").contains(e.target);
}
function deactivateIfEventIsOutsideOfPaperContainer(e) {
  let t = !1,
    n = document.getElementById("sidebarButton");
  (n && (t = n.contains(e.target)),
    lastMouseDownWasOutsideOfPaper &&
      e &&
      ReaderAppearanceJS.usesPaperAppearance() &&
      !document.getElementById("article").contains(e.target) &&
      !document.getElementById("assistant-container").contains(e.target) &&
      !t &&
      ReaderJSController.requestDeactivationFromUserAction());
}
function makePromiseCancellable(e) {
  const t = Promise.withResolvers();
  return {
    promise: Promise.race([t.promise, e]),
    cancel: function () {
      t.reject(new Error("Cancelled"));
    },
  };
}
function updatePageNumbers() {
  let e = document.getElementsByClassName("page-number"),
    t = e.length,
    n = ReaderJS.isLoadingNextPage();
  for (let i = 0; i < t; ++i)
    e[i].textContent = n
      ? getLocalizedString("Page %@").format(i + 1)
      : getLocalizedString("Page %@ of %@").format(i + 1, t);
}
function incomingPagePlaceholder() {
  return document.getElementById("incoming-page-placeholder");
}
function addIncomingPagePlaceholder(e) {
  let t = document.createElement("div");
  ((t.className = "page"), (t.id = "incoming-page-placeholder"));
  let n = document.createElement("div");
  n.id = "incoming-page-corner";
  let i = document.createElement("div");
  ((i.id = "incoming-page-text"),
    (i.innerText = getLocalizedString(
      e
        ? "Loading Next Page\u2026"
        : "Connect to the internet to view remaining pages.",
    )),
    n.appendChild(i),
    t.appendChild(n),
    document.getElementById("article").appendChild(t));
}
function removeIncomingPagePlaceholder() {
  let e = incomingPagePlaceholder();
  e.parentNode.removeChild(e);
}
function nextPageContainer() {
  return document.getElementById("next-page-container");
}
function getLocalizedString(e) {
  let t = localizedStrings[e];
  return t || e;
}
function nextPageLoadComplete(e) {
  if (
    (isReaderViewInSeparateProcess ||
      nextPageContainer().removeEventListener("load", nextPageLoadComplete, !1),
    ReaderJS.pageNumber++,
    ReaderJS.readerOperationMode == ReaderOperationMode.OffscreenFetching)
  ) {
    let e = ReaderJS.pageURLs[ReaderJS.pageURLs.length - 1];
    ReaderJSController.nextPageLoadComplete(
      ReaderJS.pageNumber,
      e,
      "next-page-container",
    );
  }
  let t;
  isReaderViewInSeparateProcess
    ? (t = new Article(e))
    : (ReaderJSController.prepareNextPageFrame("next-page-container"),
      (t = ReaderJSController.nextPageArticleFinder()),
      (t.pageNumber = ReaderJS.pageNumber),
      (t.suggestedRouteToArticle = ReaderJS.routeToArticle),
      (t.previouslyDiscoveredPageURLStrings = ReaderJS.pageURLs));
  let n = t.adoptableArticle();
  (n &&
    (ReaderJS.createPageFromNode(n),
    (ReaderJS.routeToArticle = t.routeToArticleNode())),
    isReaderViewInSeparateProcess
      ? (fetchNextPageArticlePromiseWithCanceller = null)
      : (nextPageContainer().removeAttribute("src"),
        ReaderJSController.clearNextPageArticleFinder()),
    ReaderJS.canLoadNextPage()
      ? ReaderJS.setNextPageURL(t.nextPageURL())
      : ReaderJS.setCachedNextPageURL(t.nextPageURL()),
    updatePageNumbers(),
    restoreInitialArticleScrollPositionIfPossible(),
    ReaderJS.isLoadingNextPage() || ReaderJS.doneLoadingAllPages());
}
function firstContentElementAfterTopOfViewport() {
  let e,
    t = Number.MAX_VALUE;
  const n = window.innerWidth / 2;
  for (let i = 0; i <= 10; ++i) {
    const o = document
      .elementFromPoint(n, 4 * i)
      .closest("[data-reader-unique-id]");
    if (!o) continue;
    const r = o.offsetHeight;
    r < t && ((e = o), (t = r));
  }
  if (e) return e;
  let i = articleTitleElement();
  if (!i) return null;
  do {
    if (i.getBoundingClientRect().bottom >= 0) return i;
  } while ((i = nextReaderContentElement(i)));
  return null;
}
function setConfiguration(e) {
  ReaderAppearanceJS.applyConfiguration(e);
}
function setReaderIsActive(e) {
  ReaderJS.setReaderIsActive(e);
}
function setArticleLocale(e) {
  ((document.getElementById("article").style.webkitLocale = `'${e}'`),
    ReaderAppearanceJS.applyConfiguration(ReaderAppearanceJS.configuration));
}
function cleanUpTableOfContents(e, t, n, i) {
  if (0 == e) return null;
  t.length;
  for (var o = t.length - 1; o >= 0; --o) {
    if (1 == e) {
      const e =
        decodeURIComponent(t[o]).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
        "\\s*" +
        decodeURIComponent(i[o]).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (new RegExp(e).test(document.body.textContent)) continue;
    }
    (2 == e && document.body.textContent.includes(decodeURIComponent(i[o]))) ||
      (t.splice(o, 1), i.splice(o, 1), n.splice(o, 1));
  }
  return t.length < 2 ? null : [t, n, i];
}
function setTableOfContentsWith(e, t, n, i, o, r) {
  const a = cleanUpTableOfContents(r, n, i, o);
  if (!a) return;
  [n, i, o] = a;
  let l = document.createElement("button");
  ((l.id = "tableOfContentsInsideArticleHeader"),
    l.classList.toggle("collapsible"),
    l.classList.toggle("vision", isPlatformVision),
    l.classList.toggle("eligible-for-border-corner", isPlatformVision));
  articleTitleContainer();
  document.getElementById("innerAssistantContainer").appendChild(l);
  let s =
      '<svg width="1em" height="1em" viewBox="0 -11 30 30"> <g><path d="M6.00586 15.1074L18.8867 15.1074C19.3262 15.1074 19.6777 14.7656 19.6777 14.3262C19.6777 13.877 19.3262 13.5352 18.8867 13.5352L6.00586 13.5352C5.56641 13.5352 5.21484 13.877 5.21484 14.3262C5.21484 14.7656 5.56641 15.1074 6.00586 15.1074Z" fill="var(--body-font-color)"/><path d="M1.70898 16.4551C2.87109 16.4551 3.55469 15.9375 3.55469 15.1172C3.55469 14.5801 3.18359 14.209 2.50977 14.1504L2.50977 14.1211C2.99805 14.0332 3.38867 13.7012 3.38867 13.1348C3.38867 12.3926 2.66602 11.9824 1.69922 11.9824C0.9375 11.9824 0.107422 12.3438 0.107422 12.9883C0.107422 13.2617 0.302734 13.457 0.605469 13.457C0.820312 13.457 0.917969 13.3691 1.05469 13.2227C1.2793 12.9785 1.45508 12.9004 1.69922 12.9004C2.00195 12.9004 2.22656 13.0469 2.22656 13.3398C2.22656 13.6133 1.99219 13.75 1.5918 13.75L1.48438 13.75C1.21094 13.75 1.03516 13.8867 1.03516 14.1699C1.03516 14.4336 1.20117 14.5898 1.48438 14.5898L1.61133 14.5898C2.05078 14.5898 2.28516 14.7363 2.28516 15.0391C2.28516 15.3027 2.04102 15.498 1.70898 15.498C1.36719 15.498 1.12305 15.3027 0.9375 15.1172C0.820312 15.0098 0.722656 14.9316 0.537109 14.9316C0.224609 14.9316 0 15.1172 0 15.4199C0 16.0938 0.917969 16.4551 1.70898 16.4551Z" fill="var(--body-font-color)"/><path d="M6.00586 9.20898L18.8867 9.20898C19.3262 9.20898 19.6777 8.85742 19.6777 8.41797C19.6777 7.97852 19.3262 7.63672 18.8867 7.63672L6.00586 7.63672C5.56641 7.63672 5.21484 7.97852 5.21484 8.41797C5.21484 8.85742 5.56641 9.20898 6.00586 9.20898Z" fill="var(--body-font-color)"/><path d="M0.556641 10.3711L3.06641 10.3711C3.33008 10.3711 3.53516 10.1855 3.53516 9.91211C3.53516 9.61914 3.33984 9.43359 3.06641 9.43359L1.66992 9.43359L1.66992 9.4043L2.4707 8.75977C3.13477 8.21289 3.39844 7.90039 3.39844 7.32422C3.39844 6.54297 2.74414 6.01562 1.68945 6.01562C0.751953 6.01562 0.078125 6.50391 0.078125 7.12891C0.078125 7.44141 0.283203 7.60742 0.615234 7.60742C0.839844 7.60742 0.986328 7.53906 1.12305 7.31445C1.25977 7.08008 1.43555 6.95312 1.70898 6.95312C1.99219 6.95312 2.19727 7.13867 2.19727 7.41211C2.19727 7.64648 2.08008 7.85156 1.57227 8.25195L0.292969 9.30664C0.0976562 9.46289 0.0195312 9.63867 0.0195312 9.85352C0.0195312 10.1562 0.234375 10.3711 0.556641 10.3711Z" fill="var(--body-font-color)"/><path d="M6.00586 3.30078L18.8867 3.30078C19.3262 3.30078 19.6777 2.95898 19.6777 2.51953C19.6777 2.07031 19.3262 1.72852 18.8867 1.72852L6.00586 1.72852C5.56641 1.72852 5.21484 2.07031 5.21484 2.51953C5.21484 2.95898 5.56641 3.30078 6.00586 3.30078Z" fill="var(--body-font-color)"/><path d="M2.12891 4.48242C2.5 4.48242 2.76367 4.26758 2.76367 3.82812L2.76367 0.673828C2.76367 0.263672 2.4707 0 2.04102 0C1.69922 0 1.48438 0.117188 1.24023 0.283203L0.546875 0.761719C0.351562 0.898438 0.244141 1.02539 0.244141 1.23047C0.244141 1.48438 0.439453 1.66016 0.664062 1.66016C0.791016 1.66016 0.849609 1.64062 1.01562 1.52344L1.46484 1.2207L1.48438 1.2207L1.48438 3.82812C1.48438 4.26758 1.73828 4.48242 2.12891 4.48242Z" fill="var(--body-font-color)"/></g></svg>',
    d = document.createElement("ol");
  ((d.id = "tableOfContentsInsideArticle-list"),
    d.classList.toggle("collapsedContent"),
    (l.innerHTML = s + " " + e),
    l.parentNode.insertBefore(d, l.nextSibling),
    (d.style.display = "none"),
    isPlatformVision && (l.style.backgroundColor = "#00000001"));
  let c = 1.4 + 0.45 * Math.floor(Math.log10(n.length)) + "em";
  for (var m = 0; m < n.length; ++m) {
    let e = document.createElement("li");
    (e.classList.toggle("innerTableOfContents-listItem"),
      (e.id = "item" + n[m]),
      e.setAttribute("toc-item-index", m),
      e.addEventListener("click", function () {
        ReaderJSController.reportReaderEvent(
          ReaderEventType.ClickOnTableOfContentsLink,
          {
            index: parseInt(e.getAttribute("toc-item-index")),
            length: n.length,
          },
        );
      }));
    var u = document.createElement("a");
    (1 == r
      ? (u.href = t + "#:~:text=" + n[m] + ",-" + o[m])
      : 2 == r && (u.href = t + "#:~:text=" + o[m]),
      (u.textContent = decodeURIComponent(n[m])),
      (e.style.marginInlineStart = c),
      e.appendChild(u),
      document
        .getElementById("tableOfContentsInsideArticle-list")
        .appendChild(e));
  }
  (l.addEventListener("click", function () {
    const e = l.classList.toggle("expandedContent");
    (d.style.maxHeight
      ? ((d.style.maxHeight = null),
        (d.style.marginBottom = "0px"),
        d.classList.toggle("eligible-for-border-corner", !1),
        isPlatformVision &&
          setTimeout(() => {
            ((d.style.borderTop = null), (d.style.paddingTop = null));
          }, 200))
      : ((d.style.maxHeight = d.scrollHeight + "px"),
        (d.style.marginBottom = "0.75em"),
        d.classList.toggle("eligible-for-border-corner", isPlatformVision),
        isPlatformVision &&
          ((d.style.borderTop = "0.1em solid var(--separator-color)"),
          (d.style.paddingTop = "1em"))),
      ReaderJSController.reportReaderEvent(
        ReaderEventType.ClickOnTableOfContentsHeader,
        { expanded: e },
      ));
  }),
    (tableOfContentslistItemMarginLeft =
      1.4 + 0.45 * Math.floor(Math.log10(n.length)) + "em"),
    (document.getElementById("tableOfContents-header").innerHTML =
      s + " " + e));
  for (m = 0; m < n.length; ++m) {
    let e = document.createElement("li");
    e.id = "ToCItem" + n[m];
    var g = document.createElement("a");
    (1 == r
      ? (g.href = t + "#:~:text=" + n[m] + ",-" + o[m])
      : 2 == r && (g.href = t + "#:~:text=" + o[m]),
      (g.textContent = decodeURIComponent(n[m])),
      (e.style.marginInlineStart = tableOfContentslistItemMarginLeft),
      e.appendChild(g),
      e.setAttribute("toc-item-index", m),
      e.addEventListener("click", function () {
        ReaderJSController.reportReaderEvent(
          ReaderEventType.ClickOnTableOfContentsLink,
          {
            index: parseInt(e.getAttribute("toc-item-index")),
            length: n.length,
          },
        );
      }),
      document.getElementById("tableOfContents-list").appendChild(e));
  }
  ReaderJSController.reportReaderEvent(ReaderEventType.SetTableOfContents, {
    length: n.length,
  });
}
function summarizeGlyphString() {
  return usesTwoLineSummaryGlyph
    ? '<svg class="summarize-glyph" width="1em" height="1em" viewBox="0 -7.5 30 30"><g><path d="M7.34375 19.6293L16.5723 19.6293L16.5723 21.6215C16.5723 22.4222 17.3438 22.6859 17.9883 22.2269L21.7676 19.5316C22.2852 19.1605 22.2754 18.4183 21.7676 18.0472L17.9883 15.3129C17.3047 14.8148 16.5723 15.1078 16.5723 15.9281L16.5723 17.8812L7.34375 17.8812C3.68164 17.8812 1.74805 15.9281 1.74805 12.4418L1.74805 3.63318C1.74805 3.15466 1.35742 2.75427 0.869141 2.75427C0.390625 2.75427 0 3.15466 0 3.63318L0 12.4222C0 17.0414 2.55859 19.6293 7.34375 19.6293Z" fill="var(--body-font-color)"/><path d="M6.46484 4.3363L17.6172 4.3363C18.0566 4.3363 18.3984 3.98474 18.3984 3.54529C18.3984 3.10584 18.0566 2.76404 17.6172 2.76404L6.46484 2.76404C6.02539 2.76404 5.67383 3.10584 5.67383 3.54529C5.67383 3.98474 6.02539 4.3363 6.46484 4.3363ZM6.46484 11.5507L12.627 11.5507C13.0664 11.5507 13.4082 11.1992 13.4082 10.7597C13.4082 10.3203 13.0664 9.97852 12.627 9.97852L6.46484 9.97852C6.02539 9.97852 5.67383 10.3203 5.67383 10.7597C5.67383 11.1992 6.02539 11.5507 6.46484 11.5507Z" fill="var(--body-font-color)"/></g></svg>'
    : '<svg class="summarize-glyph" width="1em" height="1em" viewBox="0 -7.5 30 30"><g><path d="M7.34375 19.6293L16.5723 19.6293L16.5723 21.6215C16.5723 22.4222 17.3438 22.6859 17.9883 22.2269L21.7676 19.5316C22.2852 19.1605 22.2754 18.4183 21.7676 18.0472L17.9883 15.3129C17.3047 14.8148 16.5723 15.1078 16.5723 15.9281L16.5723 17.8812L7.34375 17.8812C3.68164 17.8812 1.74805 15.9281 1.74805 12.4418L1.74805 3.63318C1.74805 3.15466 1.35742 2.75427 0.869141 2.75427C0.390625 2.75427 0 3.15466 0 3.63318L0 12.4222C0 17.0414 2.55859 19.6293 7.34375 19.6293Z" fill="var(--body-font-color)"/><path d="M6.46484 4.3363L17.6172 4.3363C18.0566 4.3363 18.3984 3.98474 18.3984 3.54529C18.3984 3.10584 18.0566 2.76404 17.6172 2.76404L6.46484 2.76404C6.02539 2.76404 5.67383 3.10584 5.67383 3.54529C5.67383 3.98474 6.02539 4.3363 6.46484 4.3363ZM6.46484 9.14099L17.6172 9.14099C18.0566 9.14099 18.3984 8.7992 18.3984 8.35974C18.3984 7.92029 18.0566 7.56873 17.6172 7.56873L6.46484 7.56873C6.02539 7.56873 5.67383 7.92029 5.67383 8.35974C5.67383 8.7992 6.02539 9.14099 6.46484 9.14099ZM6.46484 13.9554L12.627 13.9554C13.0664 13.9554 13.4082 13.6039 13.4082 13.1644C13.4082 12.725 13.0664 12.3832 12.627 12.3832L6.46484 12.3832C6.02539 12.3832 5.67383 12.725 5.67383 13.1644C5.67383 13.6039 6.02539 13.9554 6.46484 13.9554Z" fill="var(--body-font-color)"/></g></svg>';
}
function thumbsUpGlyphString() {
  return '<svg class="summary-feedback-glyph" width="1em" height="1em" viewBox="0 -82 95 90" aria-hidden="true"><path fill="var(--body-font-color)" d="M6.83594 -20.8984C6.83594 -8.20312 15.1367 2.58789 25.2441 2.58789L37.793 2.58789C42.8711 5.32227 48.9746 6.88477 55.8105 6.88477L61.084 6.88477C65.7715 6.88477 69.873 6.5918 72.6074 5.9082C78.0762 4.63867 81.4941 0.78125 81.4941 -4.05273C81.4941 -4.93164 81.3965 -5.76172 81.1523 -6.54297C83.6914 -8.59375 85.1074 -11.5234 85.1074 -14.6973C85.1074 -16.1133 84.8633 -17.5781 84.375 -18.8477C86.084 -20.752 87.0117 -23.3887 87.0117 -26.0742C87.0117 -27.7832 86.6211 -29.6387 85.9375 -31.1035C86.9141 -32.666 87.5 -34.8145 87.5 -37.0605C87.5 -42.9199 82.9102 -47.5586 77.002 -47.5586L62.5977 -47.5586C62.1094 -47.5586 61.7676 -47.8027 61.7676 -48.291C61.7676 -52.1973 68.1641 -61.8164 68.1641 -69.5801C68.1641 -75.0977 64.3555 -79.0527 59.0332 -79.0527C55.127 -79.0527 52.5391 -77.0508 50 -72.168C45.459 -63.5254 39.5508 -54.8828 30.957 -44.5801L23.8281 -44.5801C14.4043 -44.5801 6.83594 -33.8867 6.83594 -20.8984ZM29.6387 -21.1914C29.6387 -29.2969 31.4453 -34.4727 36.5234 -41.2598C42.1875 -48.8281 50.0977 -57.9102 55.7129 -69.2383C57.1289 -72.0215 58.0078 -72.6074 59.3262 -72.6074C60.6934 -72.6074 61.7188 -71.5332 61.7188 -69.5801C61.7188 -63.5254 55.3223 -54.2969 55.3223 -48.291C55.3223 -43.8477 58.9844 -41.1621 63.5742 -41.1621L77.002 -41.1621C79.3457 -41.1621 81.0547 -39.4043 81.0547 -37.0605C81.0547 -35.2539 80.4688 -34.1797 78.9062 -32.5684C78.3203 -31.9824 78.2715 -31.2988 78.7109 -30.6152C80.0293 -28.6133 80.5664 -27.5391 80.5664 -26.0742C80.5664 -24.3652 79.7363 -22.9492 77.9785 -21.5332C77.0508 -20.8008 76.709 -19.8242 77.1973 -18.7012C78.2227 -16.748 78.6621 -16.0156 78.6621 -14.6973C78.6621 -12.7441 77.3926 -11.2793 74.5605 -9.76562C73.7305 -9.27734 73.584 -8.59375 73.9258 -7.86133C74.9023 -5.27344 75 -4.98047 75 -4.05273C75 -2.34375 73.7793 -1.02539 71.0938 -0.341797C68.8965 0.244141 65.332 0.488281 61.084 0.488281L56.3477 0.488281C40.2832 0.488281 29.6387 -8.59375 29.6387 -21.1914ZM13.2812 -20.8984C13.2812 -30.3223 18.3105 -38.1836 23.8281 -38.1836C24.8047 -38.1836 25.8301 -38.1836 26.8555 -38.1836C24.3164 -33.1055 23.1934 -27.6855 23.1934 -21.3379C23.1934 -14.5508 25.4883 -8.54492 29.6387 -3.85742C28.1738 -3.85742 26.709 -3.85742 25.2441 -3.85742C18.8965 -3.85742 13.2812 -11.7188 13.2812 -20.8984Z"/></svg>';
}
function thumbsDownGlyphString() {
  return '<svg class="summary-feedback-glyph" width="1em" height="1em" viewBox="0 -82 95 90" aria-hidden="true"><path fill="var(--body-font-color)" d="M87.5 -50.9766C87.5 -63.7207 79.1992 -74.5117 69.0918 -74.5117L56.543 -74.5117C51.4648 -77.1973 45.3613 -78.8086 38.5254 -78.8086L33.252 -78.8086C28.5645 -78.8086 24.4629 -78.5156 21.7285 -77.832C16.2598 -76.5137 12.8418 -72.6562 12.8418 -67.8711C12.8418 -66.9922 12.9395 -66.1133 13.1836 -65.332C10.6445 -63.2812 9.22852 -60.4004 9.22852 -57.2266C9.22852 -55.7617 9.47266 -54.2969 9.96094 -53.0273C8.25195 -51.123 7.32422 -48.5352 7.32422 -45.8008C7.32422 -44.0918 7.71484 -42.2363 8.39844 -40.8203C7.42188 -39.209 6.83594 -37.1094 6.83594 -34.8633C6.83594 -28.9551 11.4258 -24.3164 17.334 -24.3164L31.7383 -24.3164C32.2266 -24.3164 32.5684 -24.1211 32.5684 -23.584C32.5684 -19.6777 26.1719 -10.1074 26.1719 -2.29492C26.1719 3.17383 29.9805 7.12891 35.3027 7.12891C39.209 7.12891 41.7969 5.12695 44.3359 0.292969C48.877 -8.39844 54.7852 -17.041 63.3789 -27.2949L70.5078 -27.2949C79.9316 -27.2949 87.5 -37.9883 87.5 -50.9766ZM64.6973 -50.6836C64.6973 -42.5781 62.8906 -37.4512 57.8125 -30.6152C52.1484 -23.0469 44.2383 -13.9648 38.623 -2.68555C37.207 0.0976562 36.3281 0.732422 35.0098 0.732422C33.6426 0.732422 32.6172 -0.341797 32.6172 -2.29492C32.6172 -8.39844 39.0137 -17.627 39.0137 -23.584C39.0137 -28.0762 35.3516 -30.7617 30.7617 -30.7617L17.334 -30.7617C14.9902 -30.7617 13.2812 -32.4707 13.2812 -34.8633C13.2812 -36.6699 13.8672 -37.7441 15.4297 -39.3555C16.0156 -39.8926 16.0645 -40.5762 15.625 -41.3086C14.3066 -43.3105 13.7695 -44.3359 13.7695 -45.8008C13.7695 -47.5098 14.5996 -48.9258 16.3574 -50.3906C17.2852 -51.0742 17.627 -52.0508 17.1387 -53.1738C16.1133 -55.127 15.6738 -55.8594 15.6738 -57.2266C15.6738 -59.1797 16.9434 -60.6445 19.7754 -62.1094C20.6055 -62.5977 20.752 -63.2812 20.4102 -64.0137C19.4336 -66.6016 19.3359 -66.8945 19.3359 -67.8711C19.3359 -69.5312 20.5566 -70.8984 23.2422 -71.582C25.4395 -72.168 29.0039 -72.4121 33.252 -72.4121L37.9883 -72.4121C54.0527 -72.3633 64.6973 -63.2812 64.6973 -50.6836ZM81.0547 -50.9766C81.0547 -41.5527 76.0254 -33.7402 70.5078 -33.7402C69.5312 -33.7402 68.5059 -33.7402 67.4805 -33.7402C70.0195 -38.7695 71.1426 -44.2383 71.1426 -50.5859C71.1426 -57.373 68.8477 -63.3301 64.6973 -68.0176C66.1621 -68.0176 67.627 -68.0176 69.0918 -68.0176C75.4395 -68.0176 81.0547 -60.1562 81.0547 -50.9766Z"/></svg>';
}
function reportConcernGlyphString() {
  return '<svg class="summary-feedback-glyph" width="1em" height="1em" viewBox="0 -76 105 85" aria-hidden="true"><path fill="var(--body-font-color)" d="M34.2773 7.37305C36.4258 7.37305 37.8906 6.25 40.5273 3.85742L53.6133 -7.86133L76.5625 -7.86133C88.5742 -7.86133 94.873 -14.3555 94.873 -26.1719L94.873 -54.5898C94.873 -66.4062 88.5742 -72.9004 76.5625 -72.9004L28.0762 -72.9004C16.0645 -72.9004 9.76562 -66.4062 9.76562 -54.5898L9.76562 -26.1719C9.76562 -14.3555 16.0645 -7.86133 28.0762 -7.86133L29.4922 -7.86133L29.4922 1.85547C29.4922 5.22461 31.2012 7.37305 34.2773 7.37305ZM36.084 -0.634766L36.084 -11.6211C36.084 -14.0137 35.2051 -14.8926 32.8125 -14.8926L28.0762 -14.8926C20.2148 -14.8926 16.7969 -18.6523 16.7969 -26.1719L16.7969 -54.5898C16.7969 -62.0605 20.2148 -65.8203 28.0762 -65.8203L76.5625 -65.8203C84.4238 -65.8203 87.8418 -62.0605 87.8418 -54.5898L87.8418 -26.1719C87.8418 -18.6523 84.4238 -14.8926 76.5625 -14.8926L53.2227 -14.8926C50.8789 -14.8926 49.6582 -14.5508 48.0957 -12.8906Z"/><path fill="var(--body-font-color)" d="M52.2949 -33.4473C54.3945 -33.4473 55.5664 -34.5703 55.6152 -36.8164L56.25 -56.8359C56.25 -58.9844 54.541 -60.6445 52.2461 -60.6445C49.9512 -60.6445 48.291 -59.0332 48.3398 -56.8848L48.9258 -36.8164C48.9746 -34.6191 50.1465 -33.4473 52.2949 -33.4473ZM52.2949 -20.6543C54.6875 -20.6543 56.7871 -22.5098 56.7871 -24.9512C56.7871 -27.3926 54.7363 -29.248 52.2949 -29.248C49.9023 -29.248 47.8516 -27.3438 47.8516 -24.9512C47.8516 -22.5586 49.9512 -20.6543 52.2949 -20.6543Z"/></svg>';
}
function createSummaryFeedbackButton(e, t, n) {
  let i = document.createElement("button");
  return (
    i.classList.add("summary-feedback-button"),
    i.setAttribute("aria-label", n),
    (i.title = n),
    (i.innerHTML = t),
    i.addEventListener("click", function (t) {
      (t.preventDefault(),
        t.stopPropagation(),
        ReaderJSController.reportSummaryFeedback(e));
    }),
    i
  );
}
function createSummaryFeedbackButtonGroup() {
  let e = document.createElement("div");
  return (
    (e.id = "summary-feedback-buttons"),
    e.classList.add("summary-feedback-buttons"),
    "internal" === summaryFeedbackButtonMode
      ? (e.appendChild(
          createSummaryFeedbackButton(
            SummaryFeedbackActionType.ThumbsUp,
            thumbsUpGlyphString(),
            getLocalizedString("Looks Good"),
          ),
        ),
        e.appendChild(
          createSummaryFeedbackButton(
            SummaryFeedbackActionType.ThumbsDown,
            thumbsDownGlyphString(),
            getLocalizedString("Something Isn\u2019t Right"),
          ),
        ))
      : "external" === summaryFeedbackButtonMode &&
        e.appendChild(
          createSummaryFeedbackButton(
            SummaryFeedbackActionType.Concern,
            reportConcernGlyphString(),
            getLocalizedString("Report a Concern"),
          ),
        ),
    e
  );
}
function upgradeSummaryButtonForFeedbackIfNeeded(e, t) {
  if ("none" === summaryFeedbackButtonMode) return e;
  if (!ReaderController.isShowingOnDeviceSummary) return e;
  if (!e || e.classList.contains("alwaysExpanded")) return e;
  let n = document.createElement("div");
  for (let t of Array.from(e.attributes)) n.setAttribute(t.name, t.value);
  (n.classList.add("alwaysExpanded"), n.classList.add("expandedContent"));
  let i = document.createElement("span");
  return (
    (i.id = "summary-header-label"),
    (i.innerHTML = e.innerHTML),
    n.appendChild(i),
    n.appendChild(createSummaryFeedbackButtonGroup()),
    e.parentNode.replaceChild(n, e),
    t &&
      ((t.style.maxHeight = "none"),
      (t.style.marginBottom = "12px"),
      (t.style.overflow = "visible"),
      t.classList.toggle("eligible-for-border-corner", isPlatformVision)),
    n
  );
}
function appendSummaryTextWithSettingsLink(e, t) {
  let n = t.indexOf(SummarySettingsLinkStartSentinel),
    i = t.indexOf(SummarySettingsLinkEndSentinel);
  if (-1 === n || -1 === i || i < n) return void (e.innerText = t);
  let o = t.substring(0, n),
    r = t.substring(n + SummarySettingsLinkStartSentinel.length, i),
    a = t.substring(i + SummarySettingsLinkEndSentinel.length);
  ((e.textContent = ""), o.length && e.appendChild(document.createTextNode(o)));
  let l = document.createElement("a");
  ((l.className = "summary-settings-link"),
    (l.textContent = r),
    l.setAttribute("href", "#"),
    l.setAttribute("role", "button"),
    (l.style.color = "#007AFF"),
    (l.style.textDecoration = "none"),
    (l.style.cursor = "pointer"),
    l.addEventListener("click", function (e) {
      (e.preventDefault(),
        "function" == typeof ReaderJSController.openSummarizationSettings &&
          ReaderJSController.openSummarizationSettings());
    }),
    e.appendChild(l),
    a.length && e.appendChild(document.createTextNode(a)));
}
function setSummaryTextWith(e, t, n, i) {
  let o = summarizeGlyphString(),
    r = document.getElementById("innerAssistantContainer"),
    a = document.getElementById("summary-collapsible"),
    l = document.getElementById("summary-collapsible-text-id-1");
  (l ||
    ((l = document.createElement("p")),
    (l.id = "summary-collapsible-text-id-1"),
    l.classList.toggle("vision", isPlatformVision)),
    n
      ? ((l.style.opacity = "0.5"),
        (l.style.visibility = "hidden"),
        l.classList.add("system"))
      : l.classList.remove("system"),
    appendSummaryTextWithSettingsLink(l, e));
  var s = "clock" === i,
    d = "shield" === i,
    c = s || d || "localized-error" === i;
  if (s || d) {
    document.createElement("attributionIcon");
    let e = s
      ? '<svg id="summary-inline-attribution" width="1em" height="1em" viewBox="0 0 119 101" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M49.92134,100.4175 C40.8806067,100.4175 32.5384733,98.1792267 24.89494,93.70268 C17.2514067,89.2261467 11.1913733,83.16612 6.71484,75.5226 C2.23828,67.8790667 4.97379915e-14,59.5369333 4.97379915e-14,50.4962 C4.97379915e-14,41.4554 2.23828,33.1132333 6.71484,25.4697 C11.1913733,17.8261667 17.2514067,11.7661333 24.89494,7.2896 C32.5384733,2.81306667 40.8806067,0.5748 49.92134,0.5748 C56.77594,0.5748 63.2214733,1.86663333 69.25794,4.4503 C68.3088067,5.62676667 67.44954,6.82423333 66.68014,8.0427 C65.9108067,9.26116667 65.24004,10.5442667 64.66784,11.892 C59.97204,10.0860667 55.05654,9.1831 49.92134,9.1831 C42.4342067,9.1831 35.5286733,11.0348667 29.20474,14.7384 C22.8808067,18.4419333 17.8670733,23.4556333 14.16354,29.7795 C10.4600733,36.1034333 8.60834,43.009 8.60834,50.4962 C8.60834,57.9833333 10.4600733,64.8888667 14.16354,71.2128 C17.8670733,77.5367 22.8808067,82.5504073 29.20474,86.253922 C35.5286733,89.9574407 42.4342067,91.8092 49.92134,91.8092 C56.75834,91.8092 63.1215733,90.2564767 69.01104,87.15103 C74.9005067,84.04559 79.76244,79.7921467 83.59684,74.3907 C87.4311733,68.9893 89.82284,62.9801333 90.77184,56.3632 C92.4841733,56.5200667 93.9550067,56.5691333 95.18434,56.5104 C96.4136733,56.4517333 97.8466733,56.2780333 99.48334,55.9893 C98.5826733,64.2012333 95.82014,71.6989067 91.19574,78.48232 C86.5712067,85.2657667 80.63544,90.61749 73.38844,94.53749 C66.1413733,98.4574967 58.3190067,100.4175 49.92134,100.4175 Z M14.69294,20.7129 L20.07574,15.33 L85.21204,80.46633 L79.82924,85.8491859 L14.69294,20.7129 Z M93.49234,49.7687 C89.0260067,49.7687 84.8874067,48.6513667 81.07654,46.4167 C77.26574,44.1820333 74.23444,41.1606667 71.98264,37.3526 C69.7309067,33.5445333 68.60504,29.3884333 68.60504,24.8843 C68.60504,20.4195 69.7314733,16.2823667 71.98434,12.4729 C74.2372733,8.66343333 77.26844,5.63223333 81.07784,3.3793 C84.88724,1.12643333 89.0244067,7.10542736e-15 93.48934,7.10542736e-15 C97.95534,7.10542736e-15 102.09334,1.12586667 105.90334,3.3776 C109.71334,5.6294 112.74434,8.6604 114.99634,12.4706 C117.247673,16.2807333 118.37334,20.4186333 118.37334,24.8843 C118.37334,29.3193 117.239007,33.4495667 114.97034,37.2751 C112.701673,41.1006333 109.66134,44.1392667 105.84934,46.391 C102.03734,48.6428 97.91834,49.7687 93.49234,49.7687 Z M93.75734,28.7005 C94.64334,28.7005 95.3750067,28.4019667 95.95234,27.8049 C96.53034,27.2078333 96.81934,26.4856 96.81934,25.6382 L96.81934,10.5121 C96.81934,9.66896667 96.5206733,8.96003333 95.92334,8.3853 C95.3266733,7.8105 94.6046733,7.5231 93.75734,7.5231 C92.87934,7.5231 92.1446733,7.8105 91.55334,8.3853 C90.9614733,8.96003333 90.66554,9.66896667 90.66554,10.5121 L90.66554,22.5979 L81.94564,22.5979 C81.0973067,22.5979 80.3681067,22.8942667 79.75804,23.487 C79.14804,24.0798 78.84304,24.7968667 78.84304,25.6382 C78.84304,26.4856 79.14804,27.2078333 79.75804,27.8049 C80.3681067,28.4019667 81.0973067,28.7005 81.94564,28.7005 L93.75734,28.7005 Z" fill="var(--body-font-color)" fill-rule="nonzero"></path></g></svg>'
      : '<svg id="summary-inline-attribution" width="1em" height="1em" viewBox="0 0 117 102" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M49.92134,101.217555 C40.8778733,101.217555 32.53504,98.9792814 24.89284,94.5027347 C17.2507067,90.0262014 11.1913733,83.9668414 6.71484,76.3246547 C2.23828,68.6825214 1.42108547e-14,60.3397214 1.42108547e-14,51.2962547 C1.42108547e-14,42.2527214 2.23828,33.909888 6.71484,26.2677547 C11.1913733,18.6255547 17.2507067,12.566188 24.89284,8.08965468 C32.53504,3.61312135 40.8778733,1.37485468 49.92134,1.37485468 C53.3576067,1.37485468 56.72554,1.73002135 60.02514,2.44035468 C63.3248067,3.15068802 66.5208067,4.17098802 69.61314,5.50125468 C69.18754,6.19585468 68.8426067,6.85985468 68.57834,7.49325468 C68.3140733,8.12665468 68.1116067,8.86102135 67.97094,9.69635468 C67.8302733,10.5317547 67.7427733,11.557388 67.70844,12.7732547 L67.70844,14.0503547 C64.9731733,12.7397547 62.11354,11.7342547 59.12954,11.0338547 C56.14554,10.333388 53.07614,9.98315468 49.92134,9.98315468 C42.4312067,9.98315468 35.52494,11.8349214 29.20254,15.5384547 C22.8800733,19.241988 17.8670733,24.2549547 14.16354,30.5773547 C10.4600733,36.8998214 8.60834,43.8061214 8.60834,51.2962547 C8.60834,58.7863214 10.4600733,65.692588 14.16354,72.0150547 C17.8670733,78.337488 22.8800733,83.350462 29.20254,87.0539767 C35.52494,90.7574954 42.4312067,92.6092547 49.92134,92.6092547 C56.7656733,92.6092547 63.1361733,91.0547014 69.03284,87.9455947 C74.9295067,84.836488 79.79324,80.5861747 83.62404,75.1946547 C87.4547733,69.8031214 89.8373733,63.7916214 90.77184,57.1601547 C91.0335067,57.2630214 91.2880067,57.386588 91.53534,57.5308547 C92.3326733,57.8807214 93.1726733,58.1156214 94.05534,58.2355547 C94.9386733,58.355488 95.8306733,58.370788 96.73134,58.2814547 C97.63134,58.1921214 98.51434,57.989688 99.38034,57.6741547 C98.3430067,65.7831547 95.50344,73.150458 90.86164,79.7760647 C86.22004,86.4016714 80.31854,91.6316547 73.15714,95.4660147 C65.99574,99.3003747 58.2504733,101.217555 49.92134,101.217555 Z M14.69294,21.5129547 L20.07574,16.1300547 L85.21204,81.2663847 L79.82924,86.6492406 L14.69294,21.5129547 Z M74.63334,12.4680547 C74.63334,11.0900547 74.92354,9.95738802 75.50394,9.07005468 C76.08434,8.18278802 77.0563067,7.43855468 78.41984,6.83735468 C79.19764,6.51535468 80.4045067,6.06155468 82.04044,5.47595468 C83.6763733,4.89035468 85.3765067,4.28602135 87.14084,3.66295468 L93.00834,1.57405468 C93.9056733,1.22932135 94.77034,1.03985468 95.60234,1.00565468 C96.4350067,0.971454684 97.2546733,1.09238802 98.06134,1.36845468 C100.12534,2.10378802 102.818673,3.06852135 106.14134,4.26265468 C109.46334,5.45678802 111.769673,6.31502135 113.06034,6.83735468 C114.423673,7.43855468 115.395673,8.18278802 115.97634,9.07005468 C116.557007,9.95738802 116.84734,11.0900547 116.84734,12.4680547 L116.84734,30.3277547 C116.84734,33.368088 116.230673,35.9178214 114.99734,37.9769547 C113.764673,40.036088 111.930673,41.9441547 109.49534,43.7011547 C107.060673,45.4581547 103.160007,47.912888 97.79334,51.0653547 C97.1506733,51.4590214 96.45234,51.6454547 95.69834,51.6246547 C94.94434,51.6039214 94.27034,51.417488 93.67634,51.0653547 C88.3172067,47.920088 84.42014,45.468988 81.98514,43.7120547 C79.5500733,41.9551214 77.7160067,40.0452547 76.48294,37.9824547 C75.2498733,35.9196547 74.63334,33.368088 74.63334,30.3277547 L74.63334,12.4680547 Z M95.75134,44.1376547 C96.2186733,44.206188 96.7066733,44.0753547 97.21534,43.7451547 L100.08734,42.0598547 C103.03534,40.291388 105.194673,38.859388 106.56534,37.7638547 C107.93534,36.6683214 108.891007,35.5042547 109.43234,34.2716547 C109.973007,33.0390547 110.24334,31.415988 110.24334,29.4024547 L110.24334,14.7294547 C110.24334,14.079388 110.09634,13.561988 109.80234,13.1772547 C109.507673,12.7924547 109.001007,12.4619547 108.28234,12.1857547 C106.443007,11.5264214 104.624673,10.8548547 102.82734,10.1710547 C101.030007,9.48725468 99.21534,8.79485468 97.38334,8.09385468 C96.84534,7.87372135 96.30134,7.79792135 95.75134,7.86645468 L95.75134,44.1376547 Z" fill="var(--body-font-color)" fill-rule="nonzero"></path></g></svg>';
    l.innerHTML = e + l.innerHTML;
  }
  if (
    ((l.style.textAlign = c ? "initial" : "inherit"),
    (l.tabIndex = -1),
    (l.style.outline = "none"),
    setTimeout(() => {
      l.focus();
    }, 0),
    !a)
  ) {
    ((a = document.createElement("button")),
      a.classList.toggle("collapsible"),
      a.classList.toggle("vision", isPlatformVision),
      a.classList.toggle("eligible-for-border-corner", isPlatformVision),
      (a.id = "summary-collapsible"),
      (a.innerHTML = o + " " + t),
      isPlatformVision && (a.style.backgroundColor = "#00000001"),
      r.appendChild(a));
    let e = document.createElement("div");
    ((e.id = "summary-collapsedContent"),
      e.appendChild(l),
      e.classList.toggle("collapsedContent"),
      e.classList.toggle("vision", isPlatformVision),
      r.appendChild(e),
      a.parentNode.insertBefore(e, a.nextSibling),
      a.addEventListener("click", function (t) {
        if (a.classList.contains("alwaysExpanded"))
          return void t.preventDefault();
        const n = a.classList.toggle("expandedContent");
        ((e.style.overflow = "auto"),
          e.style.maxHeight
            ? ((e.style.maxHeight = null),
              (e.style.marginBottom = "0px"),
              e.classList.toggle("eligible-for-border-corner", !1))
            : ((e.style.maxHeight = e.scrollHeight + "px"),
              (e.style.marginBottom = "12px"),
              e.classList.toggle(
                "eligible-for-border-corner",
                isPlatformVision,
              )),
          t.preventDefault(),
          ReaderJSController.reportReaderEvent(
            ReaderEventType.ClickOnSummaryHeader,
            { expanded: n },
          ));
      }));
  }
  if (!c && !n && e && e.trim().length > 0)
    upgradeSummaryButtonForFeedbackIfNeeded(
      a,
      document.getElementById("summary-collapsedContent"),
    );
  else {
    let e = document.getElementById("summary-feedback-buttons");
    e && e.remove();
  }
  let m = document.getElementById("summary-collapsedContent");
  m && m.appendChild(l);
  let u = document.getElementById("summary-attribution");
  (u ||
    !i ||
    c ||
    ((u = document.createElement("div")),
    (u.id = "summary-attribution"),
    (u.innerHTML = `<svg width="18" height="18" viewBox="0 0 427 427" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g fill="var(--assistant-secondary-color)" fill-opacity="0.85"><path d="M323.16,0 L324.877177,0.013911667 C381.434171,0.9309058 427,47.06449 427,103.84 L427,323.161 L426.986088,324.878177 C426.069094,381.435151 379.93551,427 323.16,427 L103.839,427 L102.121823,426.986089 C45.564849,426.069114 0,379.93651 0,323.161 L0,103.84 L0.013911369,102.122823 C0.9308859,45.5658291 47.06349,0 103.839,0 L323.16,0 Z M312.8477,189.4162 L281.0117,189.4162 C279.3897,189.4162 277.8897,190.2812 277.0787,191.6862 L259.8497,221.5282 L222.7697,285.7522 L205.5407,315.5942 C204.7297,316.9992 204.7297,318.7302 205.5407,320.1352 L221.4587,347.7062 C222.2697,349.1112 223.7697,349.9772 225.3917,349.9772 L257.2287,349.9772 C258.8507,349.9772 260.3497,349.1112 261.1607,347.7062 L278.3897,317.8642 L296.9297,285.7522 L331.3877,285.7522 C333.0107,285.7522 334.5097,284.8872 335.3207,283.4822 L351.2387,255.9102 C352.0497,254.5062 352.0497,252.7752 351.2387,251.3702 L316.7807,191.6862 C315.9697,190.2812 314.4707,189.4162 312.8477,189.4162 Z M127.4482,157.3039 L95.6122,157.3039 C93.9892,157.3039 92.4902,158.1689 91.6792,159.5739 L75.7612,187.1449 C74.9502,188.5499 74.9502,190.2809 75.7612,191.6859 L92.9902,221.5279 L111.5302,253.6399 L94.3012,283.4819 C93.4902,284.8869 93.4902,286.6179 94.3012,288.0229 L110.2192,315.5939 C111.0302,316.9989 112.5292,317.8639 114.1522,317.8639 L183.0682,317.8639 C184.6912,317.8639 186.1902,316.9989 187.0012,315.5939 L202.9192,288.0229 C203.7302,286.6179 203.7302,284.8869 202.9192,283.4819 L185.6902,253.6399 L148.6102,189.4159 L131.3812,159.5739 C130.5702,158.1689 129.0712,157.3039 127.4482,157.3039 Z M210.8782,77.023 L179.0422,77.023 C177.4192,77.023 175.9202,77.889 175.1092,79.294 L140.6512,138.977 C139.8402,140.382 139.8402,142.113 140.6512,143.518 L157.8802,173.36 L303.5782,173.36 C305.2012,173.36 306.7002,172.495 307.5112,171.09 L323.4292,143.518 C324.2402,142.113 324.2402,140.382 323.4292,138.977 L307.5112,111.406 C306.7002,110.001 305.2012,109.136 303.5782,109.136 L232.0402,109.136 L214.8112,79.294 C214.0002,77.889 212.5012,77.023 210.8782,77.023 Z" id="Combined-Shape"></path></g></g></svg><span id="summary-attribution-name">${i}</span>`),
    m.appendChild(u)),
    appendSummaryTextWithSettingsLink(
      document.getElementById("sidebar-summary-text-id-1"),
      e,
    ),
    (document.getElementById("summary-header").innerHTML = o + " " + t));
}
function updateSummaryTextVisibility(e) {
  document.getElementById("summary-collapsible-text-id-1").style.visibility = e
    ? "visible"
    : "hidden";
}
function insertSummaryTextPlaceholder() {
  const e =
    (document.getElementById("summary-collapsible-text-id-1").clientWidth *
      2.5) /
    9;
  (setSummaryTextWith(
    "\udbc2\udfb7".repeat(e),
    getLocalizedString("Summary"),
    !0,
  ),
    layoutAssistantContent());
}
function setArticleSummary(e, t, n, i, o, r, a, l, s) {
  let d = null != e && e.length > 0,
    c = null != o && o.length > 0;
  if (!d && !c) return;
  removeAllZeroWidthSpace();
  let m = document.getElementById("innerAssistantContainer");
  m ||
    ((m = document.createElement("div")),
    (m.id = "innerAssistantContainer"),
    (m.style.display = "none"));
  let u = articleTitleContainer();
  u.parentNode.insertBefore(m, u.nextSibling);
  let g = document.getElementById("article");
  ((g.style.left = (window.innerWidth - g.offsetWidth) / 2 + "px"),
    (ReaderController.hasAssistantContent = !0));
  let h = document.getElementById("summary-collapsible-text-id-1");
  d &&
    (h && (h.style.opacity = "1"),
    setSummaryTextWith(e, t, !1, s),
    "true" != m.getAttribute("showedSummary") &&
      (ReaderJSController.reportReaderEvent(ReaderEventType.SetSummary, {}),
      m.setAttribute("showedSummary", !0)));
  let p = document.getElementById("tableOfContentsInsideArticle-list"),
    f = document.getElementById("tableOfContents-list"),
    C = f && f.children.length;
  (!c || p || C || setTableOfContentsWith(n, i, o, r, a, l),
    document.getElementById("sidebarButton") || setSidebarButton(),
    layoutAssistantContent());
}
function updateArticleLayout() {
  ReaderAppearanceJS.layOutElements();
}
function setSidebarButton() {
  let e = document.getElementById("assistant-container"),
    t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  (t.setAttribute("width", "1.5em"),
    t.setAttribute("height", "1.5em"),
    t.setAttribute("viewbox", "0 0 24 24"),
    t.setAttribute("fill", "#000000"),
    t.setAttribute("xmlns", "http://www.w3.org/2000/svg"));
  let n = document.createElementNS("http://www.w3.org/2000/svg", "path");
  (n.setAttribute(
    "d",
    "M3.06641 17.998L19.9609 17.998C22.0117 17.998 23.0273 16.9824 23.0273 14.9707L23.0273 3.04688C23.0273 1.03516 22.0117 0.0195312 19.9609 0.0195312L3.06641 0.0195312C1.02539 0.0195312 0 1.02539 0 3.04688L0 14.9707C0 16.9922 1.02539 17.998 3.06641 17.998ZM3.08594 16.4258C2.10938 16.4258 1.57227 15.9082 1.57227 14.8926L1.57227 3.125C1.57227 2.10938 2.10938 1.5918 3.08594 1.5918L19.9414 1.5918C20.9082 1.5918 21.4551 2.10938 21.4551 3.125L21.4551 14.8926C21.4551 15.9082 20.9082 16.4258 19.9414 16.4258ZM14.082 16.7285L15.6152 16.7285L15.6152 1.29883L14.082 1.29883ZM17.4902 5.21484L19.5801 5.21484C19.8828 5.21484 20.1367 4.95117 20.1367 4.66797C20.1367 4.375 19.8828 4.12109 19.5801 4.12109L17.4902 4.12109C17.1973 4.12109 16.9336 4.375 16.9336 4.66797C16.9336 4.95117 17.1973 5.21484 17.4902 5.21484ZM17.4902 7.74414L19.5801 7.74414C19.8828 7.74414 20.1367 7.48047 20.1367 7.1875C20.1367 6.89453 19.8828 6.65039 19.5801 6.65039L17.4902 6.65039C17.1973 6.65039 16.9336 6.89453 16.9336 7.1875C16.9336 7.48047 17.1973 7.74414 17.4902 7.74414ZM17.4902 10.2637L19.5801 10.2637C19.8828 10.2637 20.1367 10.0195 20.1367 9.72656C20.1367 9.43359 19.8828 9.17969 19.5801 9.17969L17.4902 9.17969C17.1973 9.17969 16.9336 9.43359 16.9336 9.72656C16.9336 10.0195 17.1973 10.2637 17.4902 10.2637Z",
  ),
    n.setAttribute("fill", "var(--body-font-color)"),
    t.appendChild(n));
  let i = t;
  (isPlatformVision &&
    (t.setAttribute("width", "24px"),
    t.setAttribute("height", "24px"),
    (i = document.createElement("button")),
    (i.style.borderStyle = "none"),
    (i.style.borderRadius = "8px"),
    (i.style.backgroundColor = "#00000001"),
    (i.style.paddingTop = "0.8em"),
    i.appendChild(t)),
    (i.id = "sidebarButton"),
    i.setAttribute("data-isHidingSidebar", "false"),
    i.addEventListener("click", function () {
      let e = "true" === i.getAttribute("data-isHidingSidebar");
      (i.setAttribute("data-isHidingSidebar", (!e).toString()),
        ReaderJSController.reportReaderEvent(
          ReaderEventType.ClickOnSideBarButton,
          { expanded: e },
        ),
        layoutAssistantContent());
    }),
    e.parentNode.appendChild(i));
}
function resetToSummarizeButton() {
  let e = document.getElementById("onDeviceSummaryButton"),
    t = document.getElementById("summary-collapsible"),
    n = document.getElementById("summary-collapsedContent");
  (n.parentNode.removeChild(n),
    t && t.parentNode.removeChild(t),
    e && (e.classList.remove("hiddenButton"), (e.style.display = "block")));
  let i = document.getElementById("innerAssistantContainer");
  i && i.remove();
}
function setOnDeviceSummaryButtonWithTitle(e) {
  let t = document.getElementById("summary-collapsible"),
    n = document.getElementById("summary-collapsible-text-id-1"),
    i = n && n.innerText.includes("\udbc2\udfb7"),
    o = n && n.innerText.length;
  if (t && o && !i) return;
  let r = document.getElementById("onDeviceSummaryButton");
  if (i || (!o && t)) return void resetToSummarizeButton();
  if (null != r && null != r)
    return (
      r.classList.remove("hiddenButton"),
      void (r.style.display = "block")
    );
  ((r = document.createElement("button")),
    removeAllZeroWidthSpace(),
    (r.id = "onDeviceSummaryButton"));
  let a = summarizeGlyphString();
  r.innerHTML = a + " " + e;
  let l = articleTitleContainer();
  l.parentNode.insertBefore(r, l.nextSibling);
  let s = "\u200b",
    d = document.createElement("p");
  ((d.innerText = s),
    (d.style.height = "0px"),
    (d.style.width = "0px"),
    (d.style.margin = "0px"));
  let c = document.createElement("p");
  ((c.innerText = s),
    (c.style.height = "0px"),
    (c.style.width = "0px"),
    (c.style.margin = "0px"),
    r.parentNode.insertBefore(d, r),
    r.parentNode.insertBefore(c, r.nextSibling),
    r.addEventListener("click", function (e) {
      (r.classList.add("hiddenButton"),
        showOnDeviceSummaryPlaceholderWithTitle(),
        setSummaryTextWith(" ", getLocalizedString("Summary")),
        layoutAssistantContent(),
        ReaderJSController.requestOnDeviceSummary(),
        e.preventDefault());
    }));
}
function isSummaryShownInSidebar() {
  let e = document.getElementById("summary-collapsible"),
    t = null != e;
  return (
    shouldShowAssistantSidebar() &&
    t &&
    !ReaderController.isShowingOnDeviceSummary
  );
}
function beginReaderSummarization() {
  if (isSummaryShownInSidebar()) return;
  let e = document.getElementById("summary-collapsible"),
    t = document.getElementById("summary-collapsedContent");
  (t && t.parentNode.removeChild(t), e && e.parentNode.removeChild(e));
  let n = document.getElementById("onDeviceSummaryButton");
  (n && n.classList.add("hiddenButton"),
    showOnDeviceSummaryPlaceholderWithTitle(),
    setSummaryTextWith(" ", getLocalizedString("Summary")),
    layoutAssistantContent(),
    ReaderJSController.requestOnDeviceSummary());
}
function scrollToSummary() {
  if (isSummaryShownInSidebar()) return;
  let e = document.getElementById("summary-collapsible");
  e && e.scrollIntoView({ behavior: "smooth", block: "start" });
}
function showOnDeviceSummaryPlaceholderWithTitle() {
  if (document.getElementById("first-placeholder-line"))
    return void resetToSummarizeButton();
  let e = document.createElement("button");
  (e.classList.toggle("collapsible"),
    e.classList.toggle("vision", isPlatformVision),
    e.classList.toggle("eligible-for-border-corner", isPlatformVision),
    (e.id = "summary-collapsible"));
  let t = summarizeGlyphString();
  ((e.innerHTML = t + " \u200b" + getLocalizedString("Summary") + "\u200b"),
    isPlatformVision && (e.style.backgroundColor = "#00000001"));
  let n = document.createElement("div");
  (n.classList.toggle("shimmer-container"),
    (n.id = "summary-collapsedContent"),
    n.classList.toggle("collapsedContent"),
    n.classList.toggle("vision", isPlatformVision),
    n.classList.toggle("eligible-for-border-corner", isPlatformVision),
    (n.style.overflow = "visible"));
  let i = document.getElementById("innerAssistantContainer");
  if (!i) {
    ((i = document.createElement("div")),
      (i.id = "innerAssistantContainer"),
      (i.style.display = "none"));
    let e = articleTitleContainer();
    e.parentNode.insertBefore(i, e.nextSibling);
  }
  (i.insertBefore(e, i.firstChild),
    i.insertBefore(n, e.nextSibling),
    (i.style.display = "block"),
    (i.style.opacity = "0"),
    i.offsetWidth,
    i.offsetHeight,
    (i.style.opacity = "1"),
    (ReaderController.isShowingOnDeviceSummary = !0),
    e.addEventListener("click", function () {
      if (e.classList.contains("alwaysExpanded")) return;
      const t = e.classList.toggle("expandedContent");
      ((n.style.overflow = "auto"),
        n.style.maxHeight
          ? ((n.style.maxHeight = null),
            (n.style.marginBottom = "0px"),
            n.classList.toggle("eligible-for-border-corner", !1))
          : ((n.style.maxHeight = n.scrollHeight + "px"),
            (n.style.marginBottom = "0.75em"),
            n.classList.toggle("eligible-for-border-corner", isPlatformVision)),
        ReaderJSController.reportReaderEvent(
          ReaderEventType.ClickOnSummaryHeader,
          { expanded: t },
        ));
    }),
    e.classList.toggle("expandedContent"),
    (n.style.maxHeight = n.scrollHeight + "px"),
    (n.style.marginBottom = "0.75em"));
}
function handleVisibilityChange() {
  ReaderJS.setDocumentIsVisible(!document.hidden);
}
const LoadNextPageDelay = 250,
  MaxNumberOfNextPagesToLoad = 80,
  ReaderOperationMode = { Normal: 0, OffscreenFetching: 1, ArchiveViewing: 2 },
  ReaderEventType = {
    SetSummary: 0,
    SetTableOfContents: 1,
    ClickOnSummaryHeader: 2,
    ClickOnTableOfContentsHeader: 3,
    ClickOnTableOfContentsLink: 4,
    ClickOnSideBarButton: 5,
  },
  SummarySettingsLinkStartSentinel = "\ue100",
  SummarySettingsLinkEndSentinel = "\ue101",
  LoadingMode = { Normal: 0, Reload: 1 },
  DelayBeforeRestoringScrollPositionInMs = 1e3;
String.prototype.format = function () {
  let e = this.split("%@");
  for (let t = 0, n = arguments.length; t < n; ++t)
    e.splice(2 * t + 1, 0, arguments[t].toString());
  return e.join("");
};
const debounceTimeoutSymbol = Symbol("debounce-timeout"),
  debounceSoonProxySymbol = Symbol("debounce-soon-proxy");
(Object.defineProperty(Object.prototype, "debounce", {
  value(e) {
    return new Proxy(this, {
      get:
        (t, n) =>
        (...i) => {
          let o = t[n];
          o[debounceTimeoutSymbol] && clearTimeout(o[debounceTimeoutSymbol]);
          let r = () => {
            ((o[debounceTimeoutSymbol] = void 0), o.apply(t, i));
          };
          o[debounceTimeoutSymbol] = setTimeout(r, e);
        },
    });
  },
}),
  Object.defineProperty(Function.prototype, "cancelDebounce", {
    value() {
      this[debounceTimeoutSymbol] &&
        (clearTimeout(this[debounceTimeoutSymbol]),
        (this[debounceTimeoutSymbol] = void 0));
    },
  }));
const AnimationTerminationCondition = {
  Interrupted: 0,
  CompletedSuccessfully: 1,
};
((AppleAnimator = function (e, t, n) {
  ((this.startTime = 0),
    (this.duration = e),
    (this.interval = t),
    (this.animations = []),
    (this.animationFinishedCallback = n),
    (this.currentFrameRequestID = null),
    (this._firstTime = !0));
  let i = this;
  this.animate = function () {
    function e(e, t, n) {
      return e < t ? t : e > n ? n : e;
    }
    let t,
      n,
      o,
      r = new Date().getTime(),
      a = i.duration;
    ((t = e(r - i.startTime, 0, a)),
      (r = t / a),
      (n = 0.5 - 0.5 * Math.cos(Math.PI * r)),
      (o = t >= a));
    let l = i.animations,
      s = l.length,
      d = i._firstTime;
    for (let e = 0; e < s; ++e) l[e].doFrame(i, n, d, o, r);
    o
      ? i.stop(AnimationTerminationCondition.CompletedSuccessfully)
      : ((i._firstTime = !1),
        (this.currentFrameRequestID = requestAnimationFrame(i.animate)));
  };
}),
  (AppleAnimator.prototype = {
    start: function (e) {
      let t = new Date().getTime(),
        n = this.interval;
      ((this.startTime = t - n),
        e && (this.startTime += e),
        (this.currentFrameRequestID = requestAnimationFrame(this.animate)));
    },
    stop: function (e) {
      (this.animationFinishedCallback && this.animationFinishedCallback(e),
        this.currentFrameRequestID &&
          cancelAnimationFrame(this.currentFrameRequestID));
    },
    addAnimation: function (e) {
      this.animations[this.animations.length] = e;
    },
  }),
  (AppleAnimation = function (e, t, n) {
    ((this.from = e),
      (this.to = t),
      (this.callback = n),
      (this.now = e),
      (this.ease = 0),
      (this.progress = 0));
  }),
  (AppleAnimation.prototype = {
    doFrame: function (e, t, n, i, o) {
      let r;
      ((r = i ? this.to : this.from + (this.to - this.from) * t),
        (this.now = r),
        (this.ease = t),
        (this.progress = o),
        this.callback(e, r, n, i));
    },
  }));
let isPlatformVision = !1,
  usesTwoLineSummaryGlyph = !1,
  summaryFeedbackButtonMode = "none";
const readerViewMessageHandler =
    window.webkit?.messageHandlers?.SafariReaderView,
  isReaderViewInSeparateProcess = !!readerViewMessageHandler;
if (isReaderViewInSeparateProcess) {
  (window.addEventListener("error", (e) => {
    readerViewMessageHandler.postMessage({
      command: "logError",
      body: `${e.filename || "<nil>"}:${e.lineno}:${e.colno}: ${e.message}`,
    });
  }),
    window.addEventListener("unhandledrejection", (e) => {
      readerViewMessageHandler.postMessage({
        command: "logError",
        body: `Unhandled promise rejection: ${e.reason}`,
      });
    }));
  const e = void 0;
  console.error = function (...t) {
    (readerViewMessageHandler.postMessage({
      command: "logError",
      body: `Console: ${t.join(" - ")}`,
    }),
      e(...t));
  };
}
class Article {
  #e;
  #t;
  #n;
  #i;
  #o;
  #r;
  #a;
  #l;
  #s;
  #d;
  #c;
  #m;
  constructor(e) {
    ((this.#o = e.articleIsLTR),
      (this.#e = e.articleNode),
      (this.#t = e.articleSubhead),
      (this.#n = e.articleTitle),
      (this.#i = e.articleTitleInformation),
      (this.#r = e.baseURI),
      (this.#a = e.documentURLString),
      (this.#l = e.heightOfArticleNode),
      (this.#s = e.metadataBlock),
      (this.#d = e.multiPageContentElements),
      (this.#c = e.nextPageURL),
      (this.#m = e.routeToArticleNode));
  }
  articleIsLTR() {
    return this.#o;
  }
  articleNode() {
    return this.#e;
  }
  adoptableArticle() {
    return this.#e;
  }
  adoptableMetadataBlock() {
    return this.#s;
  }
  adoptableMultiPageContentElements() {
    return this.#d;
  }
  hasArticle() {
    return !!this.#e;
  }
  articleSubhead() {
    return this.#t;
  }
  articleTitle() {
    return this.#n;
  }
  articleTitleInformation() {
    return this.#i;
  }
  baseURI() {
    return this.#r;
  }
  documentURLString() {
    return this.#a;
  }
  heightOfArticleNodeOnOriginalPage() {
    return this.#l;
  }
  nextPageURL() {
    return this.#c;
  }
  routeToArticleNode() {
    return this.#m;
  }
  scrollToElementWithUniqueID(e, t) {
    return readerViewMessageHandler.postMessage({
      command: "callArticleFinder",
      method: "scrollToElementWithUniqueID",
      arguments: [e, t],
    });
  }
  uniqueIDAndScrollRatioOfElementPinnedToTop() {
    return readerViewMessageHandler.postMessage({
      command: "callArticleFinder",
      method: "uniqueIDAndScrollRatioOfElementPinnedToTop",
    });
  }
}
let smoothScrollingAnimator,
  smoothScrollingAnimation,
  articleScrolledNotificationCoalescer,
  scrollEventIsSmoothScroll = !1;
window.addEventListener("scroll", articleScrolled, {
  capture: !1,
  passive: !0,
});
const ContentAwareNavigationMarker = "reader-content-aware-navigation-marker",
  ContentAwareNavigationAnimationDuration = 200,
  ContentAwareNavigationElementOffset = 8,
  ContentAwareNavigationDirection = { Up: 0, Down: 1 };
((ContentAwareScroller = function () {
  this._numberOfContentAwareScrollAnimationsInProgress = 0;
}),
  (ContentAwareScroller.prototype = {
    _contentElementAtTopOfViewport: function () {
      let e = articleTitleElement();
      do {
        if (
          !(e.getBoundingClientRect().top < ContentAwareNavigationElementOffset)
        )
          return e;
      } while ((e = nextReaderContentElement(e)));
      return null;
    },
    _clearTargetOfContentAwareScrolling: function () {
      let e = document.getElementById(ContentAwareNavigationMarker);
      e && e.removeAttribute("id");
    },
    _contentAwareScrollFinished: function (e) {
      e === AnimationTerminationCondition.CompletedSuccessfully &&
        (--this._numberOfContentAwareScrollAnimationsInProgress,
        this._numberOfContentAwareScrollAnimationsInProgress ||
          ((smoothScrollingAnimator = null),
          (smoothScrollingAnimation = null),
          this._clearTargetOfContentAwareScrolling()));
    },
    scroll: function (e) {
      let t,
        n,
        i = document.getElementById(ContentAwareNavigationMarker),
        o = i || this._contentElementAtTopOfViewport();
      if (e === ContentAwareNavigationDirection.Down) {
        let e =
          Math.abs(
            o.getBoundingClientRect().top - ContentAwareNavigationElementOffset,
          ) < 1;
        t = i || e ? nextReaderContentElement(o) : o;
      } else if (e === ContentAwareNavigationDirection.Up)
        if (o === articleTitleElement()) {
          if (0 === document.scrollingElement.scrollTop) return;
          n = -1 * document.scrollingElement.scrollTop;
        } else t = previousReaderContentElement(o);
      (t &&
        (n =
          t.getBoundingClientRect().top - ContentAwareNavigationElementOffset),
        ++this._numberOfContentAwareScrollAnimationsInProgress,
        smoothScroll(
          document.scrollingElement,
          n,
          ContentAwareNavigationAnimationDuration,
          this._contentAwareScrollFinished.bind(this),
        ),
        this._clearTargetOfContentAwareScrolling(),
        t && (t.id = ContentAwareNavigationMarker));
    },
  }),
  window.addEventListener("keydown", keyDown, !1));
let initialScrollPosition,
  didRestoreInitialScrollPosition = !1;
const ThemeSettings = {
    White: { cssClassName: "white" },
    Gray: { cssClassName: "gray", tweetTheme: "dark" },
    Sepia: { cssClassName: "sepia" },
    Night: { cssClassName: "night", tweetTheme: "dark" },
  },
  ShouldRestoreReadingPosition = { No: !1, Yes: !0 },
  MinTextZoomIndex = 0,
  MaxTextZoomIndex = 11,
  MaximumWidthOfImageOrVideoExtendingBeyondTextContainer = 1050,
  ReaderConfigurationJavaScriptEnabledKey = "javaScriptEnabled";
((ReaderAppearanceController = function () {
  ((this._shouldUsePaperAppearance = function () {
    const e = 70;
    return this.articleWidth() + 2 * e < this.documentElementWidth();
  }),
    (this._isOLEDDisplay = function () {
      return !1;
    }),
    (this._tryApplyStaticConfiguration = function () {
      return !1;
    }),
    (this._defaultFontFamilyName = "System"),
    (this._defaultThemeName = "White"),
    (this.configuration = {}),
    (this._textSizeIndex = null),
    (this._fontFamilyName = this._defaultFontFamilyName),
    (this._themeName = this._defaultThemeName));
}),
  (ReaderAppearanceController.prototype = {
    initialize: function () {
      (this.applyConfiguration(ReaderJSController.initialConfiguration()),
        this._isOLEDDisplay()
          ? document.body.classList.add("oled")
          : isPlatformVision && document.body.classList.add("vision"));
    },
    applyConfiguration: function (e) {
      if (this._tryApplyStaticConfiguration()) return void this.layOutContent();
      let t = this._locale();
      this.setLocale(t);
      for (let n of [
        e.fontFamilyNameForLanguageTag[t],
        e.defaultFontFamilyNameForLanguage[t],
        "System",
      ])
        if (n && this.setFontFamily(n)) break;
      for (let t of [e.themeName, "White"]) if (t && this.setTheme(t)) break;
      (this.setCurrentTextSizeIndex(e.fontSizeIndex, e.defaultFontSizeIndex),
        (this.configuration = e),
        this.layOutContent(),
        containsAssistantContent() && layoutAssistantContent(),
        (isPlatformVision = !!e.isPlatformVision),
        (usesTwoLineSummaryGlyph = !!e.usesTwoLineSummaryGlyph),
        "string" == typeof e.summaryFeedbackButtonMode &&
          (summaryFeedbackButtonMode = e.summaryFeedbackButtonMode));
    },
    articleWidth: function () {
      return document.getElementById("article").getBoundingClientRect().width;
    },
    _textColumnWidthInPoints: function () {
      return parseFloat(
        getComputedStyle(document.querySelector("#article .page")).width,
      );
    },
    documentElementWidth: function () {
      return document.documentElement.clientWidth;
    },
    setCurrentTextSizeIndex: function (e, t) {
      ((this._textSizeIndex = e),
        (this._defaultTextSizeIndex = t),
        this._rebuildDynamicStyleSheet());
    },
    currentFontCSSClassName: function () {
      return this._currentFontSettings().cssClassName;
    },
    currentFontCSSFontFamilyName: function () {
      return this._currentFontSettings().fontFamilyName;
    },
    currentFontUsesSystemFont: function () {
      return this._currentFontSettings().usesSystemFont;
    },
    _currentFontSettings: function () {
      return fontSettings(this._fontFamilyName);
    },
    setLocale: function (e) {
      if (e === this._lastSetLocale) return;
      let t = document.body.classList;
      const n = "locale-";
      (t.remove(n + this._lastSetLocale),
        t.add(n + e),
        (this._lastSetLocale = e));
    },
    setFontFamily: function (e) {
      let t = document.body,
        n = fontSettings(e);
      if (!n) return !1;
      if (this._fontFamilyName) {
        let e = fontSettings(this._fontFamilyName);
        (t.classList.remove(e.cssClassName),
          (t.style.fontFamily = null),
          e.usesSystemFont && t.classList.remove("system"));
      }
      return (
        "function" == typeof ReaderJSController.makeFontAvailableIfNecessary &&
          ReaderJSController.makeFontAvailableIfNecessary(e),
        t.classList.add(n.cssClassName),
        n.fontFamilyName && (t.style.fontFamily = n.fontFamilyName),
        n.usesSystemFont && t.classList.add("system"),
        (this._fontFamilyName = e),
        !0
      );
    },
    _theme: function () {
      return ThemeSettings[this._themeName];
    },
    setTheme: function (e) {
      let t = document.body,
        n = ThemeSettings[e];
      return (
        !!n &&
        (t.classList.contains(n.cssClassName) ||
          (this._theme() && t.classList.remove(this._theme().cssClassName),
          t.classList.add(n.cssClassName),
          (this._themeName = e)),
        !0)
      );
    },
    usesPaperAppearance: function () {
      return document.documentElement.classList.contains("paper");
    },
    usesSpatialAppearance: function () {
      return document.body.classList.contains("spatial");
    },
    layOutContent: function (e = ShouldRestoreReadingPosition.Yes) {
      document.querySelector("#article .page") &&
        (this._shouldUsePaperAppearance()
          ? document.documentElement.classList.add("paper")
          : document.documentElement.classList.remove("paper"),
        this.layOutElements(),
        e === ShouldRestoreReadingPosition.Yes &&
          ReadingPositionStabilizerJS.restorePosition());
    },
    layOutElements: function () {
      (makeWideElementsScrollable(),
        this._layOutImagesAndVideoElementsBeyondTextColumn(),
        this._layOutElementsContainingTextBeyondTextColumn(),
        this._layOutVideos(),
        this._layOutMetadataBlock());
    },
    _layOutMetadataBlock: function () {
      let e = document.querySelector(".metadata");
      if (!e) return;
      let t = e.querySelector(".byline"),
        n = e.querySelector(".date");
      if (!t || !n) return void e.classList.add("singleline");
      let i = 0;
      for (let e of t.getClientRects()) i += e.width;
      for (let e of n.getClientRects()) i += e.width;
      i + 25 > this._textColumnWidthInPoints()
        ? e.classList.remove("singleline")
        : e.classList.add("singleline");
    },
    _layOutImagesAndVideoElementsBeyondTextColumn: function () {
      let e = this.canLayOutContentMaintainingAspectRatioBeyondTextColumn(),
        t = document.getElementById("article").querySelectorAll("img, video");
      for (let n of t)
        this.setImageOrVideoShouldLayOutBeyondTextColumnIfAppropriate(n, e);
    },
    _layOutElementsContainingTextBeyondTextColumn: function () {
      const e = { PRE: !0, TABLE: !1 },
        t = 22;
      let n = document.querySelectorAll(".scrollable pre, .scrollable table");
      for (let i of n) {
        let n = i.parentElement;
        for (let e = n; e; e = e.parentElement)
          "BLOCKQUOTE" === e.tagName && e.classList.add("simple");
        stopExtendingElementBeyondTextColumn(n);
        let o = i.scrollWidth,
          r = this._textColumnWidthInPoints();
        if (o <= r) continue;
        let a = getComputedStyle(document.querySelector(".page")),
          l = 0;
        if (e[i.tagName]) {
          let e =
            parseFloat(a["-webkit-padding-start"]) +
            parseFloat(a["-webkit-margin-start"]);
          l = Math.min(e, t);
        }
        extendElementBeyondTextColumn(
          n,
          Math.min(o, this._widthAvailableForLayout() - 2 * l),
          r,
        );
      }
    },
    _layOutVideos: function () {
      function e(e) {
        return (
          e.src &&
          /^(.+\.)?(youtube(-nocookie)?|vimeo)\.com\.?$/.test(
            urlFromString(e.src).hostname,
          )
        );
      }
      const t = 16 / 9;
      let n,
        i,
        o =
          ReaderAppearanceJS.canLayOutContentMaintainingAspectRatioBeyondTextColumn();
      for (let r of document
        .getElementById("article")
        .querySelectorAll("iframe")) {
        const a = r.parentElement.classList.contains("iframe-wrapper");
        if (!a && !e(r)) continue;
        let l;
        if (
          (a
            ? (l = r.parentElement)
            : ((l = document.createElement("div")),
              (l.className = "iframe-wrapper"),
              r.nextSibling
                ? r.parentNode.insertBefore(l, r.nextSibling)
                : r.parentNode.appendChild(l),
              l.appendChild(r)),
          n ||
            (n = Math.min(
              MaximumWidthOfImageOrVideoExtendingBeyondTextContainer,
              this._widthAvailableForLayout(),
            )),
          i || (i = this._textColumnWidthInPoints()),
          o && n > i)
        ) {
          ((l.style.height = n / t + "px"),
            extendElementBeyondTextColumn(l, n, i),
            (r.style.height = "100%"));
          let e = this.usesPaperAppearance() ? 2 : 0;
          r.style.width = n - e + "px";
        } else
          (stopExtendingElementBeyondTextColumn(l),
            (l.style.width = "100%"),
            (l.style.height = i / t + "px"));
      }
    },
    canLayOutContentMaintainingAspectRatioBeyondTextColumn: function () {
      const e = 700;
      if (window.innerHeight >= e) return !0;
      const t = 1.25;
      return window.innerWidth / window.innerHeight <= t;
    },
    setImageOrVideoShouldLayOutBeyondTextColumnIfAppropriate: function (e, t) {
      if (t && !e.closest("blockquote, table, .float")) {
        let t,
          n = this._textColumnWidthInPoints(),
          i = parseFloat(e.getAttribute("width"));
        t = isNaN(i) ? e.naturalWidth : i;
        let o = Math.min(
          t,
          Math.min(
            MaximumWidthOfImageOrVideoExtendingBeyondTextContainer,
            this._widthAvailableForLayout(),
          ),
        );
        if (o > n) return void extendElementBeyondTextColumn(e, o, n);
      }
      stopExtendingElementBeyondTextColumn(e);
    },
    _widthAvailableForLayout: function () {
      return this.usesPaperAppearance() && !this.usesSpatialAppearance()
        ? this.articleWidth()
        : this.documentElementWidth();
    },
    _rebuildDynamicStyleSheet: function () {
      let e = document.getElementById("dynamic-article-content").sheet;
      for (; e.cssRules.length;) e.removeRule(0);
      let t = this._currentFontSettings().fontSizes[this._textSizeIndex] + "px",
        n =
          this._currentFontSettings().fontSizes[this._defaultTextSizeIndex] +
          "px",
        i = this._currentFontSettings().lineHeights[this._textSizeIndex],
        o = this._currentFontSettings().lineHeights[this._defaultTextSizeIndex];
      (e.insertRule(
        ":root { --scaled-font-size:" +
          t +
          "; --scaled-line-height:" +
          i +
          "; --scaled-font-size-multiplier:calc(" +
          t +
          "/" +
          n +
          "); --scaled-line-height-multiplier:calc(" +
          i +
          "/" +
          o +
          "); }",
      ),
        e.insertRule(
          "#article { font-size: var(--scaled-font-size); line-height: var(--scaled-line-height); }",
        ),
        e.insertRule(
          "#assistant-container { font-size: var(--scaled-font-size); line-height: var(--scaled-line-height); }",
        ));
    },
    _locale: function () {
      let e = document.getElementById("article").style.webkitLocale;
      return e && e.length ? ('"' != e[0] ? e : e.substr(1, e.length - 2)) : "";
    },
  }));
let lastMouseDownWasOutsideOfPaper = !1;
((ReaderController = function () {
  ((this.pageNumber = 1),
    (this.pageURLs = []),
    (this.articleIsLTR = !0),
    (this.loadingNextPage = !1),
    (this.loadingNextPageManuallyStopped = !1),
    (this.cachedNextPageURL = null),
    (this.lastKnownDocumentElementWidth = 0),
    (this.cachedIframeURLMap = new Map()),
    (this._canShowAssistantSidebar = function () {
      return !0;
    }),
    (this._distanceFromBottomOfArticleToStartLoadingNextPage = function () {
      return NaN;
    }),
    (this._clickingOutsideOfPaperRectangleDismissesReader = !1),
    (this._shouldSkipActivationWhenPageLoads = function () {
      return !1;
    }),
    (this._shouldConvertRelativeURLsToAbsoluteURLsWhenPrintingOrMailing = !1),
    (this._deferSendingContentIsReadyForDisplay = !1),
    (this._isJavaScriptEnabled = function () {
      return !0;
    }),
    (this._readerIsActive = !0),
    (this._documentIsVisible = !document.hidden));
}),
  (ReaderController.prototype = {
    setOriginalURL: function (e) {
      ((this.originalURL = e),
        this.pageURLs.push(e),
        (document.head.getElementsByTagName("base")[0].href = this.originalURL),
        ReaderJSController.setArticleBaseURLString(e));
    },
    setNextPageURL: function (e) {
      if (
        !e ||
        -1 !== this.pageURLs.indexOf(e) ||
        this.pageNumber + 1 === MaxNumberOfNextPagesToLoad
      )
        return void this.setLoadingNextPage(!1);
      let t;
      (this.setLoadingNextPage(!0),
        this.pageURLs.push(e),
        (t = isReaderViewInSeparateProcess
          ? () => {
              ((fetchNextPageArticlePromiseWithCanceller =
                makePromiseCancellable(
                  readerViewMessageHandler.postMessage({
                    command: "fetchArticle",
                    url: e,
                    pageInformation: {
                      pageNumber: this.pageNumber + 1,
                      suggestedRouteToArticle: this.routeToArticle,
                      previouslyDiscoveredPageURLStrings: this.pageURLs,
                    },
                  }),
                )),
                fetchNextPageArticlePromiseWithCanceller.promise.then(
                  nextPageLoadComplete,
                ));
            }
          : () => {
              (nextPageContainer().addEventListener(
                "load",
                () => {
                  nextPageLoadComplete(null);
                },
                !1,
              ),
                (nextPageContainer().src = e));
            }),
        this.readerOperationMode == ReaderOperationMode.OffscreenFetching
          ? t()
          : (this.nextPageLoadTimer = setTimeout(t, LoadNextPageDelay)));
    },
    pauseLoadingNextPage: function () {
      this.readerOperationMode == ReaderOperationMode.Normal &&
        (isReaderViewInSeparateProcess
          ? (fetchNextPageArticlePromiseWithCanceller?.cancel(),
            (fetchNextPageArticlePromiseWithCanceller = null))
          : (nextPageContainer().removeEventListener(
              "load",
              nextPageLoadComplete,
              !1,
            ),
            (nextPageContainer().src = null)),
        this.cachedNextPageURL ||
          (this.cachedNextPageURL = this.pageURLs.pop()),
        this.nextPageLoadTimer && clearTimeout(this.nextPageLoadTimer),
        ReaderJSController.didChangeNextPageLoadingState(!1));
    },
    stopLoadingNextPage: function () {
      (isReaderViewInSeparateProcess
        ? (fetchNextPageArticlePromiseWithCanceller?.cancel(),
          (fetchNextPageArticlePromiseWithCanceller = null))
        : (nextPageContainer().removeEventListener(
            "load",
            nextPageLoadComplete,
            !1,
          ),
          (nextPageContainer().src = null)),
        this.nextPageLoadTimer && clearTimeout(this.nextPageLoadTimer),
        this.isLoadingNextPage() &&
          (this.setLoadingNextPage(!1),
          (this.loadingNextPageManuallyStopped = !0)));
    },
    isLoadingNextPage: function () {
      return this.loadingNextPage;
    },
    setLoadingNextPage: function (e) {
      this.loadingNextPage != e &&
        (e
          ? addIncomingPagePlaceholder(window.navigator.onLine)
          : removeIncomingPagePlaceholder(),
        (this.loadingNextPage = e),
        ReaderJSController.didChangeNextPageLoadingState(this.loadingNextPage));
    },
    doneLoadingAllPages: function () {
      ReaderJSController.doneLoadingReaderPage();
    },
    updateSerializedArticle: function (e) {
      const t = new Article(e);
      ReaderJSController.originalArticleFinder = function () {
        return t;
      };
    },
    loadSerializedArticle: function (e) {
      (this.updateSerializedArticle(e), this.loaded());
    },
    loaded: function () {
      this.readerOperationMode = ReaderJSController.readerOperationMode();
      const e = ReaderJSController.originalArticleFinder();
      if (!e || this._shouldSkipActivationWhenPageLoads())
        return void ReaderJSController.deactivateNow();
      this.loadArticle();
      let t = ReaderJSController.cachedTopScrollOffset();
      (t > 0
        ? (document.scrollingElement.scrollTop = t)
        : requestAnimationFrame(function () {
            ReadingPositionStabilizerJS.applyScrollPositionFromOriginalPage();
          }),
        ReadingPositionStabilizerJS.initialize(),
        this._clickingOutsideOfPaperRectangleDismissesReader &&
          (document.documentElement.addEventListener(
            "mousedown",
            monitorMouseDownForPotentialDeactivation,
          ),
          document.documentElement.addEventListener(
            "click",
            deactivateIfEventIsOutsideOfPaperContainer,
          )),
        window.addEventListener("resize", this.windowDidResize.bind(this), !1));
      var n = "",
        i = e.articleTitle();
      i && (n += i + " \n");
      var o = e.articleSubhead();
      o && (n += o + " \n");
      let r = n + e.adoptableArticle().textContent;
      r = r.toString().replace(/(<([^>]+)>)/gi, "");
      let a = function () {
        ReaderJSController.contentIsReadyForDisplay(r);
      };
      this._deferSendingContentIsReadyForDisplay ? setTimeout(a, 0) : a();
    },
    windowDidResize: function () {
      let e = ReaderAppearanceJS.documentElementWidth();
      e !== this.lastKnownDocumentElementWidth &&
        ((this.lastKnownDocumentElementWidth = e),
        ReaderAppearanceJS.layOutContent(),
        ReadingPositionStabilizerJS.windowDidResize(),
        layoutAssistantContent());
    },
    loadArticle: function (e = LoadingMode.Normal) {
      const t = ReaderJSController.originalArticleFinder();
      if (
        (isReaderViewInSeparateProcess || t.hasArticle() || t.articleNode(!0),
        !t.hasArticle())
      )
        return (
          this.setOriginalURL(t.baseURI()),
          void this.doneLoadingAllPages()
        );
      ((this.routeToArticle = t.routeToArticleNode()),
        (this.displayTitleInformation = t.articleTitleInformation()),
        (this._snapshotOfArticleTitle = t.articleTitle()),
        (this.displaySubhead = t.articleSubhead()),
        (this.metadataElement = t.adoptableMetadataBlock()),
        (this.articleIsLTR = t.articleIsLTR()),
        (this._heightOfArticleNodeOnOriginalPage = isReaderViewInSeparateProcess
          ? t.heightOfArticleNodeOnOriginalPage()
          : t.heightOfArticleNode()));
      let n,
        i = t.adoptableArticle();
      if (
        ((this._snapshotOfAdoptableArticle = i.cloneNode(!0)),
        (document.title = t.articleTitle()),
        this.setOriginalURL(t.baseURI()),
        this.readerOperationMode != ReaderOperationMode.ArchiveViewing)
      ) {
        if (this._isJavaScriptEnabled())
          ((n = t.nextPageURL()), this.setNextPageURL(n));
        else {
          for (let e of i.querySelectorAll("iframe")) e.remove();
          this.stopLoadingNextPage();
        }
        (e !== LoadingMode.Reload && ReaderAppearanceJS.initialize(),
          this.createAssistantElements(),
          this.createPageFromNode(i),
          n ||
            (t
              .adoptableMultiPageContentElements()
              .forEach(this.createPageFromNode, this),
            updatePageNumbers()),
          this.isLoadingNextPage() || this.doneLoadingAllPages(),
          e === LoadingMode.Reload &&
            setTimeout(function () {
              ReadingPositionStabilizerJS.contentWasReloaded();
            }, 0));
      } else ReaderAppearanceJS.layOutContent();
    },
    reloadArticlePreservingScrollPositionIfArticleNodeContentHasChanged:
      async function () {
        const e = ReaderJSController.originalArticleFinder();
        if (!e) return;
        const t = e.documentURLString(),
          n = 30;
        for (const e of document.querySelectorAll("audio, video"))
          if (mediaElementIsPlaying(e)) return;
        let i;
        if (
          ((i = isReaderViewInSeparateProcess
            ? await readerViewMessageHandler.postMessage({
                command: "callArticleFinder",
                method: "heightOfArticleNode",
              })
            : e.heightOfArticleNode()),
          !i)
        )
          return;
        const o = this._heightOfArticleNodeOnOriginalPage;
        if (i < o - n) return;
        if (this.originalURL !== t) return;
        let r;
        if (
          ((r = isReaderViewInSeparateProcess
            ? await readerViewMessageHandler.postMessage({
                command: "callArticleFinder",
                method: "reset",
              })
            : e.reset()),
          !r)
        )
          return;
        isReaderViewInSeparateProcess &&
          this.updateSerializedArticle(
            await readerViewMessageHandler.postMessage({
              command: "callArticleFinder",
              method: "serializableArticle",
            }),
          );
        const a = e.adoptableArticle();
        if (
          this._adoptableArticlesAreUserVisiblyEquivalent(
            this._snapshotOfAdoptableArticle,
            a,
          )
        )
          return;
        const l = e.articleTitle();
        this._snapshotOfArticleTitle === l &&
          this.reloadArticlePreservingScrollPosition();
      },
    _adoptableArticlesAreUserVisiblyEquivalent: function (e, t) {
      function n(e, t) {
        let i = e.nodeType;
        if (i !== t.nodeType) return !1;
        switch (i) {
          case Node.ELEMENT_NODE:
            if (e.tagName !== t.tagName) return !1;
            let n = e.attributes;
            if (n.length !== t.attributes.length) return !1;
            let i = t.attributes;
            for (let e of n)
              if (
                e.name !== READER_UNIQUE_ID_ATTRIBUTE_KEY &&
                e.value !== i[e.name].value
              )
                return !1;
            break;
          case Node.TEXT_NODE:
          case Node.COMMENT_NODE:
            if (e.data !== t.data) return !1;
            break;
          default:
            return !1;
        }
        let o = e.firstChild,
          r = t.firstChild;
        for (; o;) {
          if (!n(o, r)) return !1;
          ((o = o.nextSibling), (r = r.nextSibling));
        }
        return !r;
      }
      return n(e, t);
    },
    reloadArticlePreservingScrollPosition: function () {
      this._reloadArticleAndPreserveScrollPosition(!0);
    },
    loadNewArticle: function () {
      this._reloadArticleAndPreserveScrollPosition(!1);
    },
    _reloadArticleAndPreserveScrollPosition: async function (e) {
      if (!ReaderJSController.originalArticleFinder())
        return void ReaderJSController.deactivateNow();
      (isReaderViewInSeparateProcess &&
        this.updateSerializedArticle(
          await readerViewMessageHandler.postMessage({
            command: "callArticleFinder",
            method: "serializableArticle",
          }),
        ),
        ReadingPositionStabilizerJS.setTrackPosition(!1));
      const [t, n] = [scrollX, scrollY],
        [i, o] =
          ReadingPositionStabilizerJS.uniqueIDAndScrollRatioOfElementPinnedToTop();
      let r = document.getElementById("article");
      for (
        r.style.minHeight = r.getBoundingClientRect().height + "px";
        r.childNodes.length >= 1;
      )
        r.removeChild(r.firstChild);
      if (
        (this.reinitialize(),
        e || (document.scrollingElement.scrollTop = 0),
        this.loadArticle(LoadingMode.Reload),
        e)
      ) {
        let e;
        (i &&
          (e = ReadingPositionStabilizerJS.tryToScrollToUniqueIDAndRatio(i, o)),
          e || scrollTo(t, n));
      }
      (ReadingPositionStabilizerJS.setTrackPosition(!0),
        setTimeout(function () {
          r.style.minHeight = null;
        }, 0));
    },
    reinitialize: function () {
      ((this.pageNumber = 1),
        (this.pageURLs = []),
        (this.articleIsLTR = !0),
        (this.loadingNextPage = !1),
        (this.loadingNextPageManuallyStopped = !1),
        (this.routeToArticle = void 0),
        (this.displayTitleInformation = void 0),
        (this.displaySubhead = void 0),
        (this.originalURL = void 0),
        (this.nextPageLoadTimer = void 0),
        (this.readerOperationMode = ReaderJSController.readerOperationMode()),
        (this.cachedNextPageURL = null));
    },
    createAssistantElements: function () {
      let e = document.createElement("div");
      ((e.id = "assistant-container"), (e.style.display = "none"));
      let t = document.createElement("div");
      ((t.id = "summary-container"), (t.style.display = "none"));
      let n = document.createElement("H3");
      ((n.id = "summary-header"), t.appendChild(n));
      let i = document.createElement("p");
      ((i.id = "sidebar-summary-text-id-1"), t.appendChild(i));
      let o = document.createElement("div");
      ((o.id = "tableOfContents-container"), (o.style.display = "none"));
      let r = document.createElement("H3");
      ((r.id = "tableOfContents-header"), o.appendChild(r));
      let a = document.createElement("ol");
      ((a.id = "tableOfContents-list"),
        o.appendChild(a),
        e.appendChild(t),
        e.appendChild(o),
        document.body.appendChild(e));
    },
    createPageFromNode: function (e) {
      let t = document.createElement("div");
      ((t.className = "page"), this.articleIsLTR || t.classList.add("rtl"));
      let n = document.createElement("div");
      ((n.className = "page-number"), t.appendChild(n));
      let i = this.displayTitleInformation,
        o = document.createElement("h1");
      if (
        ((o.className = "title"),
        (o.textContent = i.titleText),
        i.linkURL && i.linkIsForExternalPage)
      ) {
        let e = document.createElement("a");
        ((e.href = i.linkURL),
          i.linkIsTargetBlank && e.setAttribute("target", "_blank"),
          e.appendChild(o),
          (o = e));
      }
      if (
        (o.setAttribute(READER_UNIQUE_ID_ATTRIBUTE_KEY, READER_UNIQUE_ID_TITLE),
        t.appendChild(o),
        this.displaySubhead)
      ) {
        let e = document.createElement("h2");
        ((e.className = "subhead"),
          (e.textContent = this.displaySubhead),
          e.setAttribute(
            READER_UNIQUE_ID_ATTRIBUTE_KEY,
            READER_UNIQUE_ID_SUBHEAD,
          ),
          t.appendChild(e));
      }
      if (this.metadataElement && this.metadataElement.innerText) {
        let e = document.createElement("div");
        for (e.className = "metadata"; this.metadataElement.firstChild;)
          e.appendChild(this.metadataElement.firstChild);
        t.appendChild(e);
      }
      let r = e.tagName;
      if ("PRE" === r || "CODE" === r) t.appendChild(e);
      else for (; e.firstChild;) t.appendChild(e.firstChild);
      (document
        .getElementById("article")
        .insertBefore(t, incomingPagePlaceholder()),
        ReaderJS._isJavaScriptEnabled() &&
          ReaderJSController.replaceSimpleTweetsWithRichTweets(
            this.optionsForTweetCreation(),
          ),
        ReaderAppearanceJS.layOutContent(ShouldRestoreReadingPosition.No),
        updatePageNumbers(),
        restoreInitialArticleScrollPositionIfPossible());
      for (let e of t.querySelectorAll("img"))
        e.onload = function (e) {
          let t = e.target;
          (ReaderAppearanceJS.setImageOrVideoShouldLayOutBeyondTextColumnIfAppropriate(
            t,
            ReaderAppearanceJS.canLayOutContentMaintainingAspectRatioBeyondTextColumn(),
          ),
            (t.onload = null));
        };
      this._fixImageElementsWithinPictureElements();
    },
    optionsForTweetCreation: function () {
      let e = { dnt: !0 },
        t = ReaderAppearanceJS._theme();
      return (t && t.tweetTheme && (e.theme = t.tweetTheme), e);
    },
    removeAttribute: function (e, t) {
      let n = e.querySelectorAll("[" + t + "]");
      for (let e of n) e.removeAttribute(t);
    },
    preparePrintingMailingFrame: function () {
      let e = this.printingMailingFrameElementId(),
        t = document.getElementById(e);
      (t && document.body.removeChild(t),
        (t = this.sanitizedFullArticleFrame()),
        (t.id = e));
    },
    sanitizedFullArticleFrame: function () {
      let e = document.createElement("iframe");
      ((e.style.display = "none"),
        (e.style.position = "absolute"),
        document.body.appendChild(e));
      let t = e.contentDocument,
        n = document.createElement("base");
      ((n.href = this.originalURL), t.head.appendChild(n));
      let i = document.createElement("div");
      i.className = "original-url";
      let o = document.createElement("a");
      ((o.href = this.originalURL),
        (o.textContent = this.originalURL),
        i.appendChild(document.createElement("br")),
        i.appendChild(o),
        i.appendChild(document.createElement("br")),
        i.appendChild(document.createElement("br")),
        t.body.appendChild(i),
        t.body.appendChild(this.sanitizedFullArticle()),
        t.head.appendChild(document.getElementById("print").cloneNode(!0)));
      let r = t.createElement("title");
      return ((r.innerText = document.title), t.head.appendChild(r), e);
    },
    getArticleHeadingElements: function () {
      const e = ReaderJSController.originalArticleFinder();
      var t = {};
      let n = e.articleSubhead();
      n && (t.subheadline = n);
      let i = e.adoptableMetadataBlock();
      return (
        i &&
          (t.articleMetadata =
            plaintextVersionOfNodeAppendingNewlinesBetweenBlockElements(i)),
        t
      );
    },
    sanitizedFullArticle: function () {
      let e = document.getElementById("article").cloneNode(!0);
      e.removeAttribute("tabindex");
      const t = e.querySelectorAll(".title");
      for (let e = 1, n = t.length; e < n; ++e) t[e].remove();
      for (let t of e.querySelectorAll(
        ".page-number, #incoming-page-placeholder, #onDeviceSummaryButton",
      ))
        t.remove();
      if (
        (prepareTweetsInPrintingMailingFrame(e),
        this._shouldConvertRelativeURLsToAbsoluteURLsWhenPrintingOrMailing)
      ) {
        const t = /^http:\/\/|^https:\/\/|^data:/i;
        let n = e.querySelectorAll("img, video, audio, source");
        for (let e of n) {
          let n = e.getAttribute("src");
          t.test(n) || e.setAttribute("src", e.src);
        }
      }
      for (let t of e.querySelectorAll(".extendsBeyondTextColumn"))
        stopExtendingElementBeyondTextColumn(t);
      for (let t of e.querySelectorAll(".delimeter")) t.innerText = "\u2022";
      e.classList.add(ReaderAppearanceJS.currentFontCSSClassName());
      let n = ReaderAppearanceJS.currentFontCSSFontFamilyName();
      (n && (e.style.fontFamily = n),
        ReaderAppearanceJS.currentFontUsesSystemFont() &&
          e.classList.add("system"),
        e.classList.add("exported"));
      ReaderJSController.originalArticleFinder();
      for (let t of e.getElementsByTagName("*"))
        t.removeAttribute(READER_UNIQUE_ID_ATTRIBUTE_KEY);
      let i = document.getElementById("article-content").sheet.cssRules,
        o = i.length;
      for (let t = 0; t < o; ++t) {
        let n = i[t].selectorText,
          o = i[t].style;
        if (!o) continue;
        let r = o.cssText;
        e.matches(n) && e.style && (e.style.cssText += r);
        for (let t of e.querySelectorAll(n)) t.style && (t.style.cssText += r);
      }
      return e;
    },
    printingMailingFrameElementId: function () {
      return "printing-mailing-frame";
    },
    canLoadNextPage: function () {
      if (this.readerOperationMode != ReaderOperationMode.Normal) return !0;
      let e = document.querySelectorAll(".page"),
        t = e[e.length - 1].getBoundingClientRect(),
        n = this._distanceFromBottomOfArticleToStartLoadingNextPage();
      return !!isNaN(n) || !(t.bottom - window.scrollY > n);
    },
    setCachedNextPageURL: function (e) {
      e
        ? ((this.cachedNextPageURL = e),
          ReaderJSController.didChangeNextPageLoadingState(!1))
        : this.setNextPageURL(e);
    },
    loadNextPage: function () {
      null != this.cachedNextPageURL &&
        (this.setNextPageURL(this.cachedNextPageURL),
        (this.cachedNextPageURL = null),
        ReaderJSController.didChangeNextPageLoadingState(!0));
    },
    resumeCachedNextPageLoadIfNecessary: function () {
      ReaderJS.cachedNextPageURL &&
        ReaderJS.canLoadNextPage() &&
        ReaderJS.loadNextPage();
    },
    setDocumentIsVisible: function (e) {
      ((this._documentIsVisible = e),
        this._readerForegroundednessMayHaveChanged(),
        e && ReaderAppearanceJS.layOutContent());
    },
    setReaderIsActive: function (e) {
      ((this._readerIsActive = e),
        this._readerForegroundednessMayHaveChanged());
    },
    readerIsForeground: function () {
      return this._documentIsVisible && this._readerIsActive;
    },
    _readerForegroundednessMayHaveChanged: function () {
      let e = this.readerIsForeground();
      this._readerIsForeground !== e &&
        (e ? this.readerWillBecomeVisible() : this.readerWillEnterBackground(),
        ReadingPositionStabilizerJS.setTrackPosition(e),
        (this._readerIsForeground = e));
    },
    readerWillBecomeVisible: function () {
      (document.body.classList.remove("cached"),
        this.resumeCachedNextPageLoadIfNecessary());
      for (let e of document.querySelectorAll("iframe")) {
        let t = this.cachedIframeURLMap.get(e);
        t && ((e.src = t), this.cachedIframeURLMap.delete(e));
      }
      this._readerIsActive &&
        requestAnimationFrame(function () {
          ReadingPositionStabilizerJS.applyScrollPositionFromOriginalPage();
        });
    },
    readerWillEnterBackground: function () {
      (ReaderJS.isLoadingNextPage() ||
        ReaderJS.loadingNextPageManuallyStopped) &&
        this.pauseLoadingNextPage();
      for (let e of document.querySelectorAll("audio")) e.pause();
      for (let e of document.querySelectorAll("video"))
        e.hasAttribute("data-reader-silent-looped-animation") || e.pause();
      for (let e of document.querySelectorAll("iframe")) {
        e.src &&
          (this.cachedIframeURLMap.set(e, e.src), e.removeAttribute("src"));
      }
    },
    _fixImageElementsWithinPictureElements: function () {
      requestAnimationFrame(function () {
        let e = !1,
          t = document.querySelectorAll("#article picture img");
        for (let n of t) {
          let t = n.previousElementSibling;
          if (t) (n.remove(), t.after(n), (e = !0));
          else {
            let t = n.parentElement;
            (n.remove(), t.appendChild(n), (e = !0));
          }
        }
        e && ReaderAppearanceJS.layOutContent();
      });
    },
    serializedDocumentElementForPrintingOrMailing: async function (e) {
      const t = Promise.withResolvers();
      ((globalThis.ReaderJSController = new (class {
        readerOperationMode() {
          return ReaderOperationMode.OffscreenFetching;
        }
        doneLoadingReaderPage() {
          t.resolve();
        }
        initialConfiguration() {
          return e;
        }
        articleScrolled() {}
        cachedTopScrollOffset() {
          return 0;
        }
        clearNextPageArticleFinder() {}
        contentIsReadyForDisplay() {}
        didChangeNextPageLoadingState() {}
        goBack() {}
        goForward() {}
        initialArticleScrollPosition() {
          return null;
        }
        isInStickyMode() {
          return !1;
        }
        log() {}
        makeFontAvailableIfNecessary() {}
        maxDistanceForLoadingNextPage() {}
        nextPageArticleFinder() {}
        nextPageLoadComplete() {}
        prepareNextPageFrame() {}
        setArticleBaseURLString(e) {}
        replaceSimpleTweetsWithRichTweets() {}
        requestDeactivationFromUserAction() {}
        requestOnDeviceSummary() {}
        openSummarizationSettings() {}
        reportReaderEvent() {}
      })()),
        ReaderJS.loadSerializedArticle(
          await readerViewMessageHandler.postMessage({
            command: "callArticleFinder",
            method: "serializableArticle",
          }),
        ),
        await t.promise);
      const n = ReaderJS.sanitizedFullArticleFrame();
      if (!n?.contentDocument?.documentElement)
        throw new Error("Unable to render article");
      return webkit.createNodeSnapshot(n.contentDocument.documentElement, {
        deep: !0,
      });
    },
  }));
let fetchNextPageArticlePromiseWithCanceller = null;
((ReadingPositionStabilizer = function () {
  ((this.elementTouchingTopOfViewport = null),
    (this.elementTouchingTopOfViewportOffsetFromTopOfElementRatio = 0),
    (this._trackingScrolling = !1),
    (this._hasEverScrolled = !1));
}),
  (ReadingPositionStabilizer.prototype = {
    initialize: function () {
      this.setTrackPosition(!0);
      const e = 250;
      ((this._checkForUpdatedContentSoon =
        this.debounce(e)._checkForUpdatedContentNow),
        (this.windowDidResize = this.debounce(e)._windowDidResize));
    },
    setTrackPosition: function (e) {
      if (e === this._trackingScrolling) return;
      this._trackingScrolling = e;
      const t = 250;
      (this._debouncedDidScroll ||
        (this._debouncedDidScroll = this.debounce(t)._didScroll),
        e
          ? window.addEventListener("scroll", this._debouncedDidScroll, {
              capture: !1,
              passive: !0,
            })
          : window.removeEventListener("scroll", this._debouncedDidScroll, {
              capture: !1,
              passive: !0,
            }));
    },
    _windowDidResize: function () {
      this._hasEverScrolled && this._updatePosition(!1);
    },
    contentWasReloaded: function () {
      this._updatePosition(!1);
    },
    _didScroll: function () {
      this._trackingScrolling &&
        ((this._hasEverScrolled = !0), this._updatePosition(!1));
    },
    _updatePosition: function (e = !0) {
      let t = firstContentElementAfterTopOfViewport();
      if (!t) return void (this.elementTouchingTopOfViewport = null);
      this.elementTouchingTopOfViewport = t;
      let n = this.elementTouchingTopOfViewport.getBoundingClientRect();
      ((this.elementTouchingTopOfViewportOffsetFromTopOfElementRatio =
        n.height > 0 ? n.top / n.height : 0),
        this._originalPageScrollSyncAndContentRefreshIsAllowed() &&
          ReaderJS.readerIsForeground() &&
          (this._pushScrollPositionToOriginalPage(),
          e && this._checkForUpdatedContentSoon()));
    },
    _pushScrollPositionToOriginalPage: function () {
      const e = ReaderJSController.originalArticleFinder(),
        [t, n] = this.uniqueIDAndScrollRatioOfElementPinnedToTop();
      t && e.scrollToElementWithUniqueID(t, n);
    },
    applyScrollPositionFromOriginalPage: async function () {
      let e =
        ReaderJSController.originalArticleFinder().uniqueIDAndScrollRatioOfElementPinnedToTop();
      e instanceof Promise && (e = await e);
      const [t, n] = e;
      t && this.tryToScrollToUniqueIDAndRatio(t, n);
    },
    _checkForUpdatedContentNow: async function () {
      await ReaderJS.reloadArticlePreservingScrollPositionIfArticleNodeContentHasChanged();
    },
    restorePosition: function () {
      if (!this.elementTouchingTopOfViewport) return;
      let e = this.elementTouchingTopOfViewport.getBoundingClientRect(),
        t =
          document.scrollingElement.scrollTop +
          e.top -
          e.height *
            this.elementTouchingTopOfViewportOffsetFromTopOfElementRatio;
      (t > 0 && (document.scrollingElement.scrollTop = t),
        this._updatePosition());
    },
    uniqueIDAndScrollRatioOfElementPinnedToTop: function () {
      if (!this.elementTouchingTopOfViewport) return [null, null];
      return [
        this.elementTouchingTopOfViewport.getAttribute(
          READER_UNIQUE_ID_ATTRIBUTE_KEY,
        ),
        this.elementTouchingTopOfViewportOffsetFromTopOfElementRatio,
      ];
    },
    tryToScrollToUniqueIDAndRatio: function (e, t) {
      const n = document.querySelector(
        "[" + READER_UNIQUE_ID_ATTRIBUTE_KEY + "='" + e + "']",
      );
      if (!n) return !1;
      const i = n.getBoundingClientRect();
      return (
        !!i.height &&
        ((document.scrollingElement.scrollTop =
          i.top - t * i.height + window.scrollY),
        this._updatePosition(!1),
        !0)
      );
    },
    _originalPageScrollSyncAndContentRefreshIsAllowed: function () {
      return !document.body.classList.contains("watch");
    },
  }));
const SummaryFeedbackActionType = { ThumbsUp: 0, ThumbsDown: 1, Concern: 2 };
document.addEventListener("visibilitychange", handleVisibilityChange, !1);
var ContentAwareScrollerJS = new ContentAwareScroller(),
  ReaderAppearanceJS = new ReaderAppearanceController(),
  ReadingPositionStabilizerJS = new ReadingPositionStabilizer(),
  ReaderJS = new ReaderController();
window.addEventListener(
  "load",
  async function () {
    function e() {
      window.dispatchEvent(new CustomEvent("readerLoaded"));
    }
    if (!isReaderViewInSeparateProcess) return (ReaderJS.loaded(), void e());
    (ReaderJS.setOriginalURL(
      await readerViewMessageHandler.postMessage({
        command: "callArticleFinder",
        method: "baseURI",
      }),
    ),
      ReaderJS.loadSerializedArticle(
        await readerViewMessageHandler.postMessage({
          command: "callArticleFinder",
          method: "serializableArticle",
        }),
      ),
      e());
  },
  !1,
);
0;
