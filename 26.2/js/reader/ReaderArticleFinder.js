//# sourceURL=__InjectedScript_ReaderArticleFinder.js
/* Copyright (c) 2025 Apple Inc. All rights reserved. */
/*
 * Copyright (c) 2010 Apple Inc. All rights reserved.
 *
 * Portions Copyright (c) 2009 Arc90 Inc
 * Readability. An Arc90 Lab Experiment.
 * Website: http://lab.arc90.com/experiments/readability
 * Source:  http://code.google.com/p/arc90labs-readability
 * Readability is licensed under the Apache License, Version 2.0.
 */
function hostnameMatchesHostKnownToContainEmbeddableMedia(e) {
  return /^(.+\.)?(youtube(-nocookie)?\.com|vimeo\.com|dailymotion\.com|soundcloud\.com|mixcloud\.com|embedly\.com|embed\.ly)\.?$/.test(
    e,
  );
}
function lazyLoadingImageURLForElement(e, t) {
  function n(e) {
    const t = /\.(jpe?g|png|gif|bmp)$/i;
    if (t.test(e)) return !0;
    let n = urlFromString(e);
    return !!n && t.test(n.pathname);
  }
  function r(e) {
    let t = attributesForElement(e);
    for (let r of t) {
      let t = r.name;
      if (a.has(t.toLowerCase())) return e.getAttribute(t);
      let i = n(r.value);
      if (o.has(t.toLowerCase()) && i) return e.getAttribute(t);
      if (s && /^data.*(src|source)$/i.test(t) && i) return e.getAttribute(t);
      if (
        e instanceof HTMLImageElement &&
        /^data-/.test(t) &&
        i &&
        1 === e.naturalWidth &&
        1 === e.naturalHeight
      )
        return e.getAttribute(t);
    }
  }
  const i =
      /(data:image\/)?gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==/,
    a = new Set([
      "data-lazy-src",
      "data-original",
      "datasrc",
      "data-src",
      "original-src",
      "rel:bf_image_src",
      "deferred-src",
      "data-mediaviewer-src",
      "data-hi-res-src",
      "data-native-src",
    ]),
    o = new Set(["original"]);
  let l = e.getAttribute("src"),
    s = /transparent|empty/i.test(l) || i.test(l);
  const c = 2;
  for (let t = e, n = 0; t && n < c; t = t.parentElement, ++n) {
    let e = r(t);
    if (e) return e;
  }
  let u = e.closest("*[itemscope]");
  if (
    u &&
    /^https?:\/\/schema\.org\/ImageObject\/?$/.test(u.getAttribute("itemtype"))
  ) {
    let e = u.getAttribute("itemid");
    if (n(e) && !u.querySelector("img")) return e;
  }
  if (LazyLoadRegex.test(t) && "function" == typeof URL) {
    var m;
    try {
      m = new URL(e.src);
    } catch (e) {}
    if (m && m.search) {
      var d, h;
      const t = ["w", "width"];
      for (var g = t.length, f = 0; f < g; ++f) {
        var p = t[f],
          E = m.searchParams.get(p);
        if (E && !isNaN(parseInt(E))) {
          d = p;
          break;
        }
      }
      const n = ["h", "height"];
      var v = n.length;
      for (f = 0; f < v; ++f) {
        var N = n[f],
          C = m.searchParams.get(N);
        if (C && !isNaN(parseInt(C))) {
          h = N;
          break;
        }
      }
      if (d && h) {
        var A = e.getAttribute("width"),
          S = e.getAttribute("height");
        if (!isNaN(parseInt(A)) && !isNaN(parseInt(S)))
          return (m.searchParams.set(d, A), m.searchParams.set(h, S), m.href);
      }
    }
  }
  return null;
}
function sanitizeElementByRemovingAttributes(e) {
  elementLooksLikeEmbeddedIframeTweetWithSrc(e) &&
    (e.setAttribute("height", e.style.height),
    e.setAttribute("width", e.style.width));
  const t = /^on|^id$|^class$|^style$|^autofocus$/;
  for (var n = attributesForElement(e), r = 0; r < n.length; ++r) {
    var i = n[r].nodeName;
    t.test(i) && (e.removeAttribute(i), r--);
  }
}
function characterAppearsToBeCJK(e) {
  if (!e || 0 === e.length) return !1;
  var t = e.charCodeAt(0);
  return (
    (t > 11904 && t < 12031) ||
    (t > 12352 && t < 12543) ||
    (t > 12736 && t < 19903) ||
    (t > 19968 && t < 40959) ||
    (t > 44032 && t < 55215) ||
    (t > 63744 && t < 64255) ||
    (t > 65072 && t < 65103) ||
    (t > 131072 && t < 173791) ||
    (t > 194560 && t < 195103)
  );
}
function domDistance(e, t, n) {
  for (var r = [], i = e; i; ) (r.unshift(i), (i = i.parentNode));
  var a = [];
  for (i = t; i; ) (a.unshift(i), (i = i.parentNode));
  for (
    var o = Math.min(r.length, a.length),
      l = Math.abs(r.length - a.length),
      s = o;
    s >= 0 && r[s] !== a[s];
    --s
  )
    if (((l += 2), n && l >= n)) return n;
  return l;
}
function fontSizeFromComputedStyle(e, t) {
  var n = parseInt(e.fontSize);
  return (isNaN(n) && (n = t || BaseFontSize), n);
}
function contentTextStyleForNode(e, t) {
  function n(e) {
    if (isNodeWhitespace(e)) return null;
    var t = getComputedStyle(e.parentNode);
    return "none" !== t.float ? null : t;
  }
  for (
    var r =
        "descendant::text()[not(parent::h1) and not(parent::h2) and not(parent::h3) and not(parent::h4) and not(parent::h5) and not(parent::h6)]",
      i = e.evaluate(r, t, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null),
      a = i.snapshotLength,
      o = 0;
    o < a;
    ++o
  ) {
    for (
      var l = i.snapshotItem(o), s = !1, c = l.parentElement;
      c !== t;
      c = c.parentElement
    )
      if (NegativeRegEx.test(c.className)) {
        s = !0;
        break;
      }
    if (!s) {
      var u = n(l);
      if (u) return u;
    }
  }
  return null;
}
function isNodeWhitespace(e) {
  return !(!e || e.nodeType !== Node.TEXT_NODE) && !/\S/.test(e.data);
}
function removeWhitespace(e) {
  return e.replace(/\s+/g, "");
}
function isElementNode(e) {
  return !(!e || e.nodeType !== Node.ELEMENT_NODE);
}
function computedStyleIndicatesElementIsInvisibleDueToClipping(e) {
  if ("absolute" !== e.position) return !1;
  var t = e.clip.match(
    /^rect\((\d+px|auto), (\d+px|auto), (\d+px|auto), (\d+px|auto)\)$/,
  );
  if (!t || 5 !== t.length) return !1;
  var n = t.map(function (e) {
      return parseInt(e);
    }),
    r = n[1];
  isNaN(r) && (r = 0);
  var i = n[2],
    a = n[3],
    o = n[4];
  return (isNaN(o) && (o = 0), r >= a || i >= o);
}
function isElementVisible(e) {
  var t = getComputedStyle(e);
  if ("visible" !== t.visibility || "none" === t.display) return !1;
  if (cachedElementBoundingRect(e).height) return !0;
  var n = document.createRange();
  return (n.selectNode(e), !!n.getBoundingClientRect().height);
}
function isElementPositionedOffScreen(e) {
  var t = cachedElementBoundingRect(e);
  return !(!t.height || !t.width) && (t.bottom <= 0 || t.right <= 0);
}
function elementDepth(e) {
  for (var t = 0; e; e = e.parentElement) t++;
  return t;
}
function depthOfElementWithinElement(e, t) {
  for (var n = 0; e !== t; e = e.parentElement) {
    if (!e) return NaN;
    n++;
  }
  return n;
}
function nearestAncestorElementWithTagName(e, t, n) {
  var r = {};
  if (n) for (var i = 0; i < n.length; ++i) r[n[i]] = !0;
  if (r[normalizedElementTagName(e)]) return null;
  for (; (e = e.parentElement); ) {
    var a = normalizedElementTagName(e);
    if (r[a]) break;
    if (a === t) return e;
  }
  return null;
}
function elementDescendsFromElementMatchingSelector(e, t) {
  do {
    if (e.matches(t)) return !0;
  } while ((e = e.parentElement));
  return !1;
}
function elementDescendsFromElementInSet(e, t) {
  do {
    if (t.has(e)) return !0;
  } while ((e = e.parentElement));
  return !1;
}
function elementIsHidingContentDueToContentVisibilityAuto(e) {
  return (
    !!window.ContentVisibilityAutoStateChangeEvent &&
    "auto" === getComputedStyle(e).contentVisibility &&
    !!e.children.length &&
    !e.children[0].checkVisibility({ contentVisibilityAuto: !0 })
  );
}
function cachedElementBoundingRect(e) {
  if (e._cachedElementBoundingRect) return e._cachedElementBoundingRect;
  if (
    ReaderArticleFinderJS.shouldSuppressBoundingRectCalculationForSkippedElements() &&
    elementIsHidingContentDueToContentVisibilityAuto(e)
  ) {
    let n = e.previousElementSibling;
    return n && !elementIsHidingContentDueToContentVisibilityAuto(n)
      ? (((t = cachedElementBoundingRect(n)).top += t.height),
        (t.bottom += t.height),
        t)
      : { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 };
  }
  var t = e.getBoundingClientRect();
  return (
    ReaderArticleFinderJS._elementsWithCachedBoundingRects.push(e),
    ReaderArticleFinderJS._cachedScrollX || ReaderArticleFinderJS._cachedScrollY
      ? ((e._cachedElementBoundingRect = {
          top: t.top + ReaderArticleFinderJS._cachedScrollY,
          right: t.right + ReaderArticleFinderJS._cachedScrollX,
          bottom: t.bottom + ReaderArticleFinderJS._cachedScrollY,
          left: t.left + ReaderArticleFinderJS._cachedScrollX,
          width: t.width,
          height: t.height,
        }),
        e._cachedElementBoundingRect)
      : ((e._cachedElementBoundingRect = t), e._cachedElementBoundingRect)
  );
}
function clearCachedElementBoundingRects() {
  for (
    var e = ReaderArticleFinderJS._elementsWithCachedBoundingRects,
      t = e.length,
      n = 0;
    n < t;
    ++n
  )
    e[n]._cachedElementBoundingRect = null;
  ReaderArticleFinderJS._elementsWithCachedBoundingRects = [];
}
function trimmedInnerTextIgnoringTextTransform(e) {
  var t = e.innerText;
  if (!/\S/.test(t)) return e.textContent.trim();
  var n = getComputedStyle(e).textTransform;
  return "uppercase" === n || "lowercase" === n
    ? e.textContent.trim()
    : t
      ? t.trim()
      : "";
}
function levenshteinDistance(e, t) {
  for (
    var n = e.length, r = t.length, i = new Array(n + 1), a = 0;
    a < n + 1;
    ++a
  )
    ((i[a] = new Array(r + 1)), (i[a][0] = a));
  for (var o = 0; o < r + 1; ++o) i[0][o] = o;
  for (o = 1; o < r + 1; ++o)
    for (a = 1; a < n + 1; ++a)
      if (e[a - 1] === t[o - 1]) i[a][o] = i[a - 1][o - 1];
      else {
        var l = i[a - 1][o] + 1,
          s = i[a][o - 1] + 1,
          c = i[a - 1][o - 1] + 1;
        i[a][o] = Math.min(l, s, c);
      }
  return i[n][r];
}
function stringSimilarity(e, t) {
  var n = Math.max(e.length, t.length);
  return n ? (n - levenshteinDistance(e, t)) / n : 0;
}
function stringsAreNearlyIdentical(e, t) {
  return (
    e === t ||
    stringSimilarity(e, t) > StringSimilarityToDeclareStringsNearlyIdentical
  );
}
function elementIsCommentBlock(e) {
  if (/(^|\s)comment/.test(e.className)) return !0;
  var t = e.getAttribute("id");
  return !(!t || (0 !== t.indexOf("comment") && 0 !== t.indexOf("Comment")));
}
function elementLooksLikeEmbeddedTweet(e) {
  var t = null;
  if ("iframe" === normalizedElementTagName(e)) {
    if (!e.contentDocument)
      return elementLooksLikeEmbeddedIframeTweetWithSrc(e);
    t = e.contentDocument.documentElement;
  } else "twitter-widget" === normalizedElementTagName(e) && (t = e.shadowRoot);
  if (!t) return !1;
  if (e.closest(".twitter-video") && t.querySelector("[data-tweet-id]"))
    return !0;
  let n = 0,
    r = t.querySelector("blockquote");
  r && TweetURLRegex.test(r.getAttribute("cite")) && ++n;
  let i = t.querySelector("[data-iframe-title]");
  return (
    i && TweetIframeTitleRegex.test(i.getAttribute("data-iframe-title")) && ++n,
    e.classList.contains("twitter-tweet") && ++n,
    t.querySelector("[data-tweet-id]") && ++n,
    n > 2
  );
}
function elementLooksLikeEmbeddedIframeTweetWithSrc(e) {
  if (!EmbeddedTwitterIframeSrcRegEx.test(e.getAttribute("src"))) return !1;
  const t = e.getAttribute("title");
  return "X Post" === t || "Twitter Tweet" === t;
}
function elementLooksLikeACarousel(e) {
  const t = /carousel-|carousel_|-carousel|_carousel|swiper-/;
  return t.test(e.className) || t.test(e.getAttribute("data-analytics"));
}
function elementLooksLikePartOfACarousel(e) {
  const t = 3;
  for (var n = e, r = 0; r < t; ++r) {
    if (!n) return !1;
    if (elementLooksLikeACarousel(n)) return !0;
    n = n.parentElement;
  }
  return !1;
}
function urlIsHTTPFamilyProtocol(e) {
  let t = e.protocol;
  return "http:" === t || "https:" === t;
}
function shouldPruneIframe(e) {
  if (e.srcdoc) return !0;
  let t = urlFromString(e.src);
  if (t) {
    if (!urlIsHTTPFamilyProtocol(t)) return !0;
    if (hostnameMatchesHostKnownToContainEmbeddableMedia(t.hostname)) return !1;
  }
  return !elementLooksLikeEmbeddedTweet(e.originalElement);
}
function textContentAppearsToBeCJK(e, t) {
  if (!e || !e.length) return !1;
  let n = e.length;
  t && !isNaN(t) && (n = Math.min(n, t));
  let r = 0;
  for (let t = 0; t < n; t++) characterAppearsToBeCJK(e[t]) && r++;
  return r >= n * MinimumRatioOfCharactersForLanguageMultiplier;
}
function languageScoreMultiplierForTextNodes(e) {
  if (!e || !e.length) return 1;
  for (
    var t = Math.min(
        e.length,
        DefaultNumberOfTextNodesToCheckForLanguageMultiplier,
      ),
      n = 0,
      r = 0,
      i = 0;
    i < t;
    i++
  ) {
    for (
      var a = e[i].nodeValue.trim(),
        o = Math.min(
          a.length,
          NumberOfCharactersPerTextNodeToEvaluateForLanguageMultiplier,
        ),
        l = 0;
      l < o;
      l++
    )
      characterAppearsToBeCJK(a[l]) && n++;
    r += o;
  }
  return n >= r * MinimumRatioOfCharactersForLanguageMultiplier
    ? ScoreMultiplierForChineseJapaneseKorean
    : 1;
}
function scoreMultiplierForElementTagNameAndAttributes(e) {
  for (var t = 1, n = e; n; n = n.parentElement) {
    var r = n.getAttribute("id");
    r &&
      (ArticleRegEx.test(r) && (t += ArticleMatchBonus),
      CommentRegEx.test(r) && (t -= CommentMatchPenalty),
      CarouselRegEx.test(r) && (t -= CarouselMatchPenalty));
    var i = n.className;
    (i &&
      (ArticleRegEx.test(i) && (t += ArticleMatchBonus),
      CommentRegEx.test(i) && (t -= CommentMatchPenalty),
      CarouselRegEx.test(i) && (t -= CarouselMatchPenalty)),
      "article" === normalizedElementTagName(n) && (t += ArticleMatchBonus));
  }
  return t < 0 ? 0 : t;
}
function elementAtPoint(e, t, n) {
  if (
    "undefined" != typeof ReaderArticleFinderJSController &&
    ReaderArticleFinderJSController.nodeAtPoint
  ) {
    var r = ReaderArticleFinderJSController.nodeAtPoint(e, t);
    return (r && r.nodeType !== Node.ELEMENT_NODE && (r = r.parentElement), r);
  }
  return n.elementFromPoint(e, t);
}
function userVisibleURLString(e) {
  return "undefined" != typeof ReaderArticleFinderJSController &&
    ReaderArticleFinderJSController.userVisibleURLString
    ? ReaderArticleFinderJSController.userVisibleURLString(e)
    : e;
}
function urlFromString(e, t) {
  try {
    return null != t ? new URL(e, t) : new URL(e);
  } catch (e) {
    return null;
  }
}
function urlStringShouldHaveItsAnchorMadeNonFunctional(e, t) {
  if (!e) return !0;
  var n = urlFromString(e);
  if ((n || (n = urlFromString(e, t)), !n || !n.href || !n.href.length))
    return !0;
  let r = n.href;
  return (
    "javascript:" === r.trim().substring(0, 11).toLowerCase() ||
    "data:" === r.trim().substring(0, 5).toLowerCase()
  );
}
function anchorLinksToAttachment(e) {
  return /\battachment\b/i.test(e.getAttribute("rel"));
}
function anchorLinksToTagOrCategoryPage(e) {
  return /\bcategory|tag\b/i.test(e.getAttribute("rel"));
}
function anchorLooksLikeDownloadFlashLink(e) {
  return /^https?:\/\/(www\.|get\.)(adobe|macromedia)\.com\/(((products|[a-zA-Z]{1,2}|)\/flashplayer|flashplayer|go\/getflash(player)?)|(shockwave\/download\/(index|download)\.cgi\?P1_Prod_Version=ShockwaveFlash)\/?$)/i.test(
    e.href,
  );
}
function elementsHaveSameTagAndClassNames(e, t) {
  return (
    normalizedElementTagName(e) === normalizedElementTagName(t) &&
    e.className === t.className
  );
}
function selectorForElement(e) {
  let t = normalizedElementTagName(e);
  for (var n = e.classList, r = n.length, i = 0; i < r; i++) t += "." + n[i];
  return t;
}
function elementFingerprintForDepth(e, t) {
  function n(e, t) {
    if (!e) return "";
    var o = [];
    o.push(selectorForElement(e));
    var l = e.children,
      s = l.length;
    if (s && t > 0) {
      o.push(r);
      for (var c = 0; c < s; ++c)
        (o.push(n(l[c], t - 1)), c !== s - 1 && o.push(a));
      o.push(i);
    }
    return o.join("");
  }
  const r = " / ",
    i = " \\",
    a = " | ";
  return n(e, t);
}
function childrenOfParentElement(e) {
  var t = e.parentElement;
  return t ? t.children : [];
}
function arrayOfKeysAndValuesOfObjectSortedByValueDescending(e) {
  var t = [];
  for (var n in e) e.hasOwnProperty(n) && t.push({ key: n, value: e[n] });
  return (
    t.sort(function (e, t) {
      return t.value - e.value;
    }),
    t
  );
}
function walkElementSubtree(e, t, n) {
  if (!(t < 0)) {
    for (var r = e.children, i = r.length, a = t - 1, o = 0; o < i; ++o)
      walkElementSubtree(r[o], a, n);
    n(e, t);
  }
}
function elementIndicatesItIsASchemaDotOrgArticleContainer(e) {
  var t = e.getAttribute("itemtype");
  return /^https?:\/\/schema\.org\/((News)?Article|APIReference)$/.test(t);
}
function elementIndicatesItIsASchemaDotOrgImageObject(e) {
  var t = e.getAttribute("itemtype");
  return (
    "https://schema.org/ImageObject" === t ||
    "http://schema.org/ImageObject" === t
  );
}
function elementWouldAppearBetterAsFigureOrAuxiliary(e, t) {
  const n = /caption/i;
  if (!e) return !1;
  if (t.closest("figure, .auxiliary")) return !1;
  if (
    elementIndicatesItIsASchemaDotOrgImageObject(e) &&
    !t.querySelector("figure, .auxiliary")
  )
    return !0;
  var r = t.ownerDocument.createTreeWalker(
    t,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
    {
      acceptNode: function () {
        return NodeFilter.FILTER_ACCEPT;
      },
    },
  );
  r.currentNode = t;
  for (var i = !1, a = !1; r.nextNode(); ) {
    var o = r.currentNode;
    if (o.nodeType === Node.TEXT_NODE) {
      if (!i && /\S/.test(o.nodeValue)) return !1;
      continue;
    }
    if (o.nodeType !== Node.ELEMENT_NODE) return !1;
    let e = normalizedElementTagName(o);
    if ("figure" === e || "table" === e) return !1;
    if (o.classList.contains("auxiliary")) return !1;
    if ("img" === e) {
      if (i) return !1;
      i = !0;
    }
    var l = o.originalElement;
    a ||
      (l && !hasClassMatchingRegexp(o.originalElement, n)) ||
      !/\S/.test(o.innerText) ||
      (a = !0);
  }
  return i && a;
}
function cleanStyleAndClassList(e) {
  (e.classList.length || e.removeAttribute("class"),
    e.getAttribute("style") || e.removeAttribute("style"));
}
function getVisibleNonWhitespaceTextNodes(e, t, n, r, i) {
  function a(e) {
    var t = e.children[0];
    if (t)
      for (var n = t.children, r = n.length, i = 0; i < r; ++i)
        if ("none" !== getComputedStyle(n[i]).float) return !1;
    return !0;
  }
  function o(e, r) {
    if (e.nodeType === Node.TEXT_NODE)
      return void (/\S/.test(e.nodeValue) && s.push(e));
    if (e.nodeType !== Node.ELEMENT_NODE) return;
    if (!isElementVisible(e)) return;
    if (n && ++l > n) return;
    if (i && i.has(e)) return;
    let u = normalizedElementTagName(e);
    if ("iframe" !== u && "form" !== u) {
      if (c.has(u)) r--;
      else if (("ul" !== u && "ol" !== u) || !a(e)) {
        var m = e.parentElement;
        if (m)
          "section" !== normalizedElementTagName(m) ||
            e.previousElementSibling ||
            e.nextElementSibling ||
            r--;
      } else r--;
      var d = r + 1;
      if (d < t)
        for (var h = e.childNodes, g = h.length, f = 0; f < g; ++f) o(h[f], d);
    }
  }
  var l = 0,
    s = [];
  let c = new Set(["p", "strong", "b", "em", "i", "span", "section"]);
  return (r && (c.add("center"), c.add("font")), o(e, 0), s);
}
function mapOfVisibleTextNodeComputedStyleReductionToNumberOfMatchingCharacters(
  e,
  t,
) {
  for (
    var n = {},
      r = getVisibleNonWhitespaceTextNodes(e, 100),
      i = r.length,
      a = 0;
    a < i;
    ++a
  ) {
    var o = r[a],
      l = o.length,
      s = o.parentElement,
      c = t(getComputedStyle(s));
    n[c] ? (n[c] += l) : (n[c] = l);
  }
  return n;
}
function keyOfMaximumValueInDictionary(e) {
  var t, n;
  for (var r in e) {
    var i = e[r];
    (!n || i > n) && ((t = r), (n = i));
  }
  return t;
}
function elementIsProtected(e) {
  return e.classList.contains("protected") || e.querySelector(".protected");
}
function dominantFontFamilyAndSizeForElement(e) {
  return keyOfMaximumValueInDictionary(
    mapOfVisibleTextNodeComputedStyleReductionToNumberOfMatchingCharacters(
      e,
      function (e) {
        return e.fontFamily + "|" + e.fontSize;
      },
    ),
  );
}
function dominantFontSizeInPointsFromFontFamilyAndSizeString(e) {
  return e ? parseInt(e.split("|")[1]) : null;
}
function canvasElementHasNoUserVisibleContent(e) {
  if (!e.width || !e.height) return !0;
  for (
    var t = e.getContext("2d").getImageData(0, 0, e.width, e.height).data,
      n = 0,
      r = t.length;
    n < r;
    n += 4
  ) {
    if (t[n + 3]) return !1;
  }
  return !0;
}
function findArticleNodeSelectorsInQuirksListForHostname(e, t) {
  const n = [
    [AppleDotComAndSubdomainsRegex, "*[itemprop='articleBody']"],
    [/^(.+\.)?buzzfeed\.com\.?$/, "article #buzz_sub_buzz"],
    [/^(.+\.)?mashable\.com\.?$/, ".parsec-body .parsec-container"],
    [/^(.+\.)?cnet\.com\.?$/, "#rbContent.container"],
    [/^(.+\.)?engadget\.com\.?$/, "main article #page_body"],
    [/^(.*\.)?m\.wikipedia\.org\.?$/, "#content #bodyContent"],
    [/^(.*\.)?theintercept\.com\.?$/, ".PostContent"],
    [/^(.*\.)?tools\.ietf\.org\.?$/, "div.content"],
    [/^(.*\.)?cntraveler\.com\.?$/, "article.gallery"],
    [/^(.+\.)?meteoinfo\.ru\.?$/, "#jm-content-bottom"],
    [/^(.*\.)?tmd\.go\.th\.?$/, "#sidebar"],
  ];
  for (var r = n.length, i = 0; i < r; ++i) {
    var a = n[i];
    if (a[0].test(e.toLowerCase())) if (t(a[1])) return;
  }
}
function functionToPreventPruningDueToInvisibilityInQuirksListForHostname(e) {
  const t = [
    [
      /^mobile\.nytimes\.com\.?$/,
      function (e, t) {
        var n = e;
        if (!t) return !1;
        for (; n && n !== t; ) {
          if (n.classList.contains("hidden")) return !0;
          n = n.parentElement;
        }
        return !1;
      },
    ],
  ];
  for (var n = t.length, r = 0; r < n; ++r) {
    var i = t[r];
    if (i[0].test(e.toLowerCase())) return i[1];
  }
  return null;
}
function elementIsAHeader(e) {
  return !!{ h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1 }[
    normalizedElementTagName(e)
  ];
}
function leafElementForElementAndDirection(e, t) {
  var n = e.ownerDocument,
    r = n.createTreeWalker(n.body, NodeFilter.SHOW_ELEMENT, {
      acceptNode: function (e) {
        return 0 === e.children.length
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP;
      },
    });
  return ((r.currentNode = e), r[t]());
}
function previousLeafElementForElement(e) {
  return leafElementForElementAndDirection(e, "previousNode");
}
function nextLeafElementForElement(e) {
  return leafElementForElementAndDirection(e, "nextNode");
}
function nextNonFloatingVisibleElementSibling(e) {
  for (var t = e; (t = t.nextElementSibling); )
    if (isElementVisible(t) && "none" === getComputedStyle(t).float) return t;
  return null;
}
function elementWithLargestAreaFromElements(e) {
  var t,
    n = e.length;
  if (!n) return null;
  for (var r = 0, i = 0; i < n; ++i) {
    var a = e[i],
      o = cachedElementBoundingRect(a),
      l = o.width * o.height;
    l > r && ((t = a), (r = l));
  }
  return t;
}
function unwrappedArticleContentElement(e) {
  for (var t = e; ; ) {
    for (var n = t.childNodes, r = n.length, i = null, a = 0; a < r; ++a) {
      var o = n[a],
        l = o.nodeType;
      if (
        l === Node.ELEMENT_NODE ||
        (l === Node.TEXT_NODE && !isNodeWhitespace(o))
      ) {
        if (i) return t;
        var s = normalizedElementTagName(o);
        if ("div" !== s && "article" !== s && "section" !== s) return t;
        i = o;
      }
    }
    if (!i) break;
    t = i;
  }
  return t;
}
function elementsMatchingClassesInClassList(e, t) {
  return elementsOfSameClassIgnoringClassNamesMatchingRegexp(e, t);
}
function elementsMatchingClassesInClassListIgnoringCommonLayoutClassNames(
  e,
  t,
) {
  return elementsOfSameClassIgnoringClassNamesMatchingRegexp(e, t, /clearfix/i);
}
function elementsMatchingClassesInClassListIgnoringClassesWithNumericSuffix(
  e,
  t,
) {
  return elementsOfSameClassIgnoringClassNamesMatchingRegexp(e, t, /\d+$/);
}
function elementsOfSameClassIgnoringClassNamesMatchingRegexp(e, t, n) {
  for (var r = "", i = e.length, a = 0; a < i; ++a) {
    var o = e[a];
    (n && n.test(o)) || (r += "." + o);
  }
  try {
    return t.querySelectorAll(r);
  } catch (e) {
    return [];
  }
}
function imageIsContainedByContainerWithImageAsBackgroundImage(e) {
  var t = e.parentElement;
  if (!t || !t.style || !t.style.backgroundImage) return !1;
  var n = /url\((.*)\)/.exec(t.style.backgroundImage);
  return !(!n || 2 !== n.length) && n[1] === e.src;
}
function pseudoElementContent(e, t) {
  var n = getComputedStyle(e, t).content,
    r = /^\"(.*)\"$/.exec(n);
  return r && 2 == r.length ? r[1] : null;
}
function hasClassMatchingRegexp(e, t) {
  for (var n = e.classList, r = n.length, i = 0; i < r; ++i)
    if (t.test(n[i])) return !0;
  return !1;
}
function elementLooksLikeDropCap(e) {
  return hasClassMatchingRegexp(e, DropCapRegex) && 1 === e.innerText.length;
}
function changeElementType(e, t) {
  for (
    var n = e.ownerDocument.createElement(t),
      r = attributesForElement(e),
      i = r.length,
      a = 0;
    a < i;
    ++a
  ) {
    var o = r.item(a);
    n.setAttribute(o.nodeName, o.nodeValue);
  }
  for (; e.firstChild; ) n.appendChild(e.firstChild);
  return (e.replaceWith(n), n);
}
function pathComponentsForAnchor(e) {
  var t = e.pathname.substring(1).split("/");
  return (t[t.length - 1] || t.pop(), t);
}
function lastPathComponentFromAnchor(e) {
  var t = pathComponentsForAnchor(e);
  return t.length ? t[t.length - 1] : null;
}
function clamp(e, t, n) {
  return Math.min(Math.max(e, t), n);
}
function childrenWithParallelStructure(e) {
  var t = e.children;
  if (!t) return [];
  var n = t.length;
  if (!n) return [];
  for (var r = {}, i = 0; i < n; ++i) {
    var a = t[i];
    if (
      !SetOfCandidateTagNamesToIgnore.has(normalizedElementTagName(a)) &&
      a.className
    )
      for (var o = a.classList, l = o.length, s = 0; s < l; ++s) {
        (m = r[(u = o[s])]) ? m.push(a) : (r[u] = [a]);
      }
  }
  var c = Math.floor(n / 2);
  for (var u in r) {
    var m;
    if ((m = r[u]).length > c) return m;
  }
  return [];
}
function elementAppearsToBeCollapsed(e) {
  return (
    !(
      !ReaderArticleFinderJS.isMediaWikiPage() || !/collaps/.test(e.className)
    ) ||
    ("false" === e.getAttribute("aria-expanded") && !isElementVisible(e))
  );
}
const ReaderMinimumScore = 1600,
  ReaderMinimumAdvantage = 15,
  ArticleMinimumScoreDensity = 4.25,
  CandidateMinimumWidthPortionForIndicatorElements = 0.5,
  CandidateMinumumListItemLineCount = 4,
  SetOfCandidateTagNamesToIgnore = new Set([
    "a",
    "embed",
    "form",
    "html",
    "iframe",
    "object",
    "ol",
    "option",
    "script",
    "style",
    "svg",
    "ul",
  ]),
  PrependedArticleCandidateMinimumHeight = 50,
  AppendedArticleCandidateMinimumHeight = 200,
  AppendedArticleCandidateMaximumVerticalDistanceFromArticle = 150,
  StylisticClassNames = { justfy: 1, justify: 1, left: 1, right: 1, small: 1 },
  CommentRegEx = /[Cc]omment|meta|footer|footnote|talkback/,
  CommentMatchPenalty = 0.75,
  ArticleRegEx =
    /(?:(?:^|\s)(?:(post|hentry|entry)[-_]{0,2}(?:content|text|body)?|article[-_]{0,2}(?:content|text|body|page|copy)?)(?:\s|$))/i,
  ArticleMatchBonus = 0.5,
  CarouselRegEx = /carousel/i,
  CarouselMatchPenalty = 0.75,
  SectionRegex = /section|content.*component/i,
  DropCapRegex = /first.*letter|drop.*cap/i,
  ProgressiveLoadingRegex = /progressive/i,
  DensityExcludedElementSelector = "#disqus_thread, #comments, .userComments",
  PositiveRegEx =
    /article|body|content|entry|hentry|page|pagination|post|related-asset|text/i,
  NegativeRegEx =
    /advertisement|breadcrumb|combx|comment|contact|disqus|footer|link|meta|mod-conversations|promo|related|scroll|share|shoutbox|sidebar|social|sponsor|spotim|subscribe|talkback|tags|toolbox|widget|[-_]ad$|zoom-(in|out)/i,
  VeryPositiveClassNameRegEx = /instapaper_body/,
  VeryNegativeClassNameRegEx = /instapaper_ignore/,
  SharingRegex =
    /email|print|rss|digg|slashdot|delicious|reddit|share|twitter|facebook|pinterest|whatsapp/i,
  VeryLiberalCommentRegex = /comment/i,
  AdvertisementHostRegex = /^adserver\.|doubleclick.net$/i,
  SidebarRegex = /sidebar/i,
  MinimumAverageDistanceBetweenHRElements = 400,
  MinimumAverageDistanceBetweenHeaderElements = 400,
  PortionOfCandidateHeightToIgnoreForHeaderCheck = 0.1,
  DefaultNumberOfTextNodesToCheckForLanguageMultiplier = 3,
  NumberOfCharactersPerTextNodeToEvaluateForLanguageMultiplier = 12,
  MinimumRatioOfCharactersForLanguageMultiplier = 0.5,
  ScoreMultiplierForChineseJapaneseKorean = 3,
  MinimumContentMediaHeight = 150,
  MinimumContentMediaWidthToArticleWidthRatio = 0.25,
  MaximumContentMediaAreaToArticleAreaRatio = 0.2,
  LinkContinueMatchRegEx = /continue/gi,
  LinkNextMatchRegEx = /next/gi,
  LinkPageMatchRegEx = /page/gi,
  LinkListItemBonus = 5,
  LinkPageMatchBonus = 10,
  LinkNextMatchBonus = 15,
  LinkContinueMatchBonus = 15,
  LinkNextOrdinalValueBase = 3,
  LinkMismatchValueBase = 2,
  LinkMatchWeight = 200,
  LinkMaxVerticalDistanceFromArticle = 200,
  LinkVerticalDistanceFromArticleWeight = 150,
  LinkCandidateXPathQuery =
    "descendant-or-self::*[(not(@id) or (@id!='disqus_thread' and @id!='comments')) and (not(@class) or @class!='userComments')]/a",
  LinkDateRegex =
    /\D(?:\d\d(?:\d\d)?[\-\/](?:10|11|12|0?[1-9])[\-\/](?:30|31|[12][0-9]|0?[1-9])|\d\d(?:\d\d)?\/(?:10|11|12|0[1-9])|(?:10|11|12|0?[1-9])\-(?:30|31|[12][0-9]|0?[1-9])\-\d\d(?:\d\d)?|(?:30|31|[12][0-9]|0?[1-9])\-(?:10|11|12|0?[1-9])\-\d\d(?:\d\d)?)\D/,
  LinkURLSearchParameterKeyMatchRegex = /(page|^p$|^pg$)/i,
  LinkURLPageSlashNumberMatchRegex = /\/.*page.*\/\d+/i,
  LinkURLSlashDigitEndMatchRegex = /\/\d+\/?$/,
  LinkURLArchiveSlashDigitEndMatchRegex = /archives?\/\d+\/?$/,
  LinkURLBadSearchParameterKeyMatchRegex =
    /author|comment|feed|id|nonce|related/i,
  LinkURLSemanticMatchBonus = 100,
  LinkMinimumURLSimilarityRatio = 0.75,
  SubheadRegex = /sub(head|title)|description|dec?k|abstract/i,
  HeaderMinimumDistanceFromArticleTop = 200,
  HeaderLevenshteinDistanceToLengthRatio = 0.75,
  MinimumRatioOfListItemsBeingRelatedToSharingToPruneEntireList = 0.5,
  FloatMinimumHeight = 130,
  ImageSizeTiny = 32,
  ToleranceForLeadingMediaWidthToArticleWidthForFullWidthPresentation = 80,
  MaximumFloatWidth = 325,
  AnchorImageMinimumWidth = 100,
  AnchorImageMinimumHeight = 100,
  MinimumHeightForImagesAboveTheArticleTitle = 50,
  MainImageMinimumWidthAndHeight = 83,
  BaseFontSize = 16,
  BaseLineHeightRatio = 1.125,
  MaximumExactIntegralValue = 9007199254740992,
  TitleCandidateDepthScoreMultiplier = 0.1,
  TextNodeLengthPower = 1.25,
  LazyLoadRegex = /lazy/i,
  HeaderElementsSelector = "h1, h2, h3, h4, h5, h6",
  StringSimilarityToDeclareStringsNearlyIdentical = 0.97,
  FindArticleMode = { Element: !1, ExistenceOfElement: !0 },
  AppleDotComAndSubdomainsRegex = /.*\.apple\.com\.?$/,
  SchemaDotOrgArticleContainerSelector =
    "*[itemtype='https://schema.org/Article'], *[itemtype='https://schema.org/NewsArticle'], *[itemtype='https://schema.org/APIReference'], *[itemtype='http://schema.org/Article'], *[itemtype='http://schema.org/NewsArticle'], *[itemtype='http://schema.org/APIReference']",
  CleaningType = { MainArticleContent: 0, MetadataContent: 1, LeadingMedia: 2 },
  MaximumWidthOrHeightOfImageInMetadataSection = 20;
var attributesForElement = (function () {
  var e = Element.prototype.__lookupGetter__("attributes");
  return function (t) {
    return e.call(t);
  };
})();
const TweetURLRegex =
    /^https?:\/\/(.+\.)?twitter\.com\/.*\/status\/(.*\/)*[0-9]+\/?$/i,
  TweetIframeTitleRegex = /tweet/i,
  EmbeddedTwitterIframeSrcRegEx =
    /^https?:\/\/platform\.twitter\.com\/embed\/Tweet\.html/i;
((CandidateElement = function (e, t) {
  ((this.element = e),
    (this.contentDocument = t),
    (this.textNodes = this.usableTextNodesInElement(this.element)),
    (this.rawScore = this.calculateRawScore()),
    (this.tagNameAndAttributesScoreMultiplier =
      this.calculateElementTagNameAndAttributesScoreMultiplier()),
    (this.languageScoreMultiplier = 0),
    (this.depthInDocument = 0));
}),
  (CandidateElement.extraArticleCandidateIfElementIsViable = function (
    e,
    t,
    n,
    r,
  ) {
    const i = "a, b, strong, i, em, u, span";
    var a = cachedElementBoundingRect(e),
      o = cachedElementBoundingRect(t.element);
    if (
      ((r && a.height < PrependedArticleCandidateMinimumHeight) ||
        (!r && a.height < AppendedArticleCandidateMinimumHeight)) &&
      e.childElementCount &&
      e.querySelectorAll("*").length !== e.querySelectorAll(i).length
    )
      return null;
    if (r) {
      if (a.bottom > o.top) return null;
    } else if (a.top < o.bottom) return null;
    if (
      !r &&
      a.top - o.bottom >
        AppendedArticleCandidateMaximumVerticalDistanceFromArticle
    )
      return null;
    if (a.left > o.right || a.right < o.left) return null;
    if (elementLooksLikePartOfACarousel(e)) return null;
    var l = new CandidateElement(e, n);
    return ((l.isPrepended = r), l);
  }),
  (CandidateElement.candidateIfElementIsViable = function (e, t, n) {
    var r = cachedElementBoundingRect(e),
      i = ReaderArticleFinderJS.candidateElementFilter;
    return r.width < i.minimumWidth ||
      r.height < i.minimumHeight ||
      r.width * r.height < i.minimumArea ||
      (!n && r.top > i.maximumTop) ||
      CandidateElement.candidateElementAdjustedHeight(e) < i.minimumHeight
      ? null
      : new CandidateElement(e, t);
  }),
  (CandidateElement.candidateElementAdjustedHeight = function (e) {
    for (
      var t = cachedElementBoundingRect(e),
        n = t.height,
        r = e.getElementsByTagName("form"),
        i = r.length,
        a = 0;
      a < i;
      ++a
    ) {
      var o = cachedElementBoundingRect(r[a]);
      o.width > t.width * CandidateMinimumWidthPortionForIndicatorElements &&
        (n -= o.height);
    }
    var l = e.querySelectorAll("ol, ul"),
      s = l.length,
      c = null;
    for (a = 0; a < s; ++a) {
      var u = l[a];
      if (
        !(
          c &&
          c.compareDocumentPosition(u) & Node.DOCUMENT_POSITION_CONTAINED_BY
        )
      ) {
        var m = u.getElementsByTagName("li"),
          d = m.length,
          h = cachedElementBoundingRect(u);
        if (d) {
          var g = h.height / d,
            f = getComputedStyle(m[0]),
            p = parseInt(f.lineHeight);
          if (isNaN(p)) p = fontSizeFromComputedStyle(f) * BaseLineHeightRatio;
          h.width >
            t.width * CandidateMinimumWidthPortionForIndicatorElements &&
            g / p < CandidateMinumumListItemLineCount &&
            ((n -= h.height), (c = u));
        } else n -= h.height;
      }
    }
    return n;
  }),
  (CandidateElement.prototype = {
    calculateRawScore: function () {
      for (var e = 0, t = this.textNodes, n = t.length, r = 0; r < n; ++r)
        e += this.rawScoreForTextNode(t[r]);
      return e;
    },
    calculateElementTagNameAndAttributesScoreMultiplier: function () {
      return scoreMultiplierForElementTagNameAndAttributes(this.element);
    },
    calculateLanguageScoreMultiplier: function () {
      0 === this.languageScoreMultiplier &&
        (this.languageScoreMultiplier = languageScoreMultiplierForTextNodes(
          this.textNodes,
        ));
    },
    depth: function () {
      return (
        this.depthInDocument ||
          (this.depthInDocument = elementDepth(this.element)),
        this.depthInDocument
      );
    },
    finalScore: function () {
      return (
        this.calculateLanguageScoreMultiplier(),
        this.basicScore() * this.languageScoreMultiplier
      );
    },
    basicScore: function () {
      return this.rawScore * this.tagNameAndAttributesScoreMultiplier;
    },
    scoreDensity: function () {
      var e = 0,
        t = this.element.querySelector(DensityExcludedElementSelector);
      t && (e = t.clientWidth * t.clientHeight);
      for (
        var n = this.element.children || [], r = n.length, i = 0;
        i < r;
        ++i
      ) {
        var a = n[i];
        elementIsCommentBlock(a) && (e += a.clientWidth * a.clientHeight);
      }
      var o =
          cachedElementBoundingRect(this.element).width *
          cachedElementBoundingRect(this.element).height,
        l = o * MaximumContentMediaAreaToArticleAreaRatio,
        s =
          cachedElementBoundingRect(this.element).width *
          MinimumContentMediaWidthToArticleWidthRatio,
        c = this.element.querySelectorAll("img, video"),
        u = c.length;
      for (i = 0; i < u; ++i) {
        var m = cachedElementBoundingRect(c[i]);
        if (m.width >= s && m.height > MinimumContentMediaHeight) {
          var d = m.width * m.height;
          d < l && (e += d);
        }
      }
      var h = this.basicScore(),
        g = o - e,
        f = this.textNodes.length,
        p = 0,
        E = 0;
      for (i = 0; i < f; ++i) {
        var v = this.textNodes[i].parentNode;
        v && ((E += fontSizeFromComputedStyle(getComputedStyle(v))), p++);
      }
      var N = BaseFontSize;
      return (
        p && (N = E /= p),
        this.calculateLanguageScoreMultiplier(),
        (h / g) * 1e3 * (N / BaseFontSize) * this.languageScoreMultiplier
      );
    },
    usableTextNodesInElement: function (e) {
      var t = [];
      if (!e) return t;
      const n = new Set([
        "a",
        "dd",
        "dt",
        "noscript",
        "ol",
        "option",
        "pre",
        "script",
        "style",
        "td",
        "ul",
        "iframe",
      ]);
      var r = this.contentDocument,
        i = function (e) {
          const i =
            "text()|*/text()|*/a/text()|*/li/text()|*/li/p/text()|*/span/text()|*/em/text()|*/i/text()|*/strong/text()|*/b/text()|*/font/text()|blockquote/*/text()|div[count(./p)=count(./*)]/p/text()|div[count(*)=1]/div/p/text()|div[count(*)=1]/div/p/*/text()|div/div/text()";
          for (
            var a = r.evaluate(
                i,
                e,
                null,
                XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                null,
              ),
              o = a.snapshotLength,
              l = 0;
            l < o;
            ++l
          ) {
            var s = a.snapshotItem(l);
            n.has(normalizedElementTagName(s.parentNode)) ||
              s._countedTextNode ||
              isNodeWhitespace(s) ||
              ((s._countedTextNode = !0), t.push(s));
          }
        };
      i(e);
      for (
        var a = childrenWithParallelStructure(e), o = a.length, l = 0;
        l < o;
        ++l
      ) {
        i(a[l]);
      }
      var s = t.length;
      for (l = 0; l < s; ++l) delete t[l]._countedTextNode;
      return t;
    },
    addTextNodesFromCandidateElement: function (e) {
      for (var t = this.textNodes.length, n = 0; n < t; ++n)
        this.textNodes[n].alreadyCounted = !0;
      var r = e.textNodes,
        i = r.length;
      for (n = 0; n < i; ++n) r[n].alreadyCounted || this.textNodes.push(r[n]);
      for (t = this.textNodes.length, n = 0; n < t; ++n)
        this.textNodes[n].alreadyCounted = null;
      this.rawScore = this.calculateRawScore();
    },
    rawScoreForTextNode: function (e) {
      const t = 20;
      if (!e) return 0;
      var n = e.length;
      if (n < t) return 0;
      var r = e.parentNode;
      if (!isElementVisible(r)) return 0;
      for (var i = 1; r && r !== this.element; )
        ((i -= 0.1), (r = r.parentNode));
      return Math.pow(n * i, TextNodeLengthPower);
    },
    shouldDisqualifyDueToScoreDensity: function () {
      return this.scoreDensity() < ArticleMinimumScoreDensity;
    },
    shouldDisqualifyDueToHorizontalRuleDensity: function () {
      for (
        var e = this.element.getElementsByTagName("hr"),
          t = e.length,
          n = 0,
          r = cachedElementBoundingRect(this.element),
          i = 0.7 * r.width,
          a = 0;
        a < t;
        ++a
      )
        e[a].clientWidth > i && n++;
      if (n && r.height / n < MinimumAverageDistanceBetweenHRElements)
        return !0;
      return !1;
    },
    shouldDisqualifyDueToHeaderDensity: function () {
      var e = "(h1|h2|h3|h4|h5|h6|*/h1|*/h2|*/h3|*/h4|*/h5|*/h6)[a[@href]]",
        t = this.contentDocument.evaluate(
          e,
          this.element,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null,
        ),
        n = t.snapshotLength;
      if (n > 2) {
        for (
          var r = 0,
            i = cachedElementBoundingRect(this.element),
            a = i.height * PortionOfCandidateHeightToIgnoreForHeaderCheck,
            o = 0;
          o < n;
          ++o
        ) {
          var l = t.snapshotItem(o);
          if (
            "#" !==
            l.querySelector("a[href]").getAttribute("href").substring(0, 1)
          ) {
            var s = cachedElementBoundingRect(l);
            s.top - i.top > a && i.bottom - s.bottom > a && r++;
          }
        }
        if (i.height / r < MinimumAverageDistanceBetweenHeaderElements)
          return !0;
      }
      return !1;
    },
    shouldDisqualifyDueToSimilarElements: function (e) {
      function t(e, t) {
        if (!e || !t) return !1;
        var n = 1;
        return e.className
          ? e.className === t.className
          : elementFingerprintForDepth(e, n) ===
              elementFingerprintForDepth(t, n);
      }
      var n = function (e) {
          const t = /related-posts/i;
          for (
            var n = e.parentElement;
            n && n !== this.contentDocument.body;
            n = n.parentElement
          )
            if (t.test(n.className)) return !0;
          return !1;
        }.bind(this),
        r = this.element;
      if ("article" === normalizedElementTagName(r.parentElement)) return !1;
      let i = normalizedElementTagName(r);
      if ("li" === i || "dd" === i)
        for (var a = r.parentNode, o = a.children.length, l = 0; l < o; ++l) {
          var s = a.children[l];
          if (
            normalizedElementTagName(s) === i &&
            s.className === r.className &&
            s !== r
          )
            return !0;
        }
      var c = r.classList;
      if (
        (c.length ||
          ((r = r.parentElement) &&
            ((c = r.classList).length ||
              ((r = r.parentElement) && (c = r.classList)))),
        c.length)
      ) {
        e || (e = []);
        var u = e.length;
        for (l = 0; l < u; ++l) e[l].element.candidateElement = e[l];
        var m =
            elementsMatchingClassesInClassListIgnoringCommonLayoutClassNames(
              c,
              this.contentDocument,
            ),
          d = !1,
          h = elementDepth(r),
          g = n(r),
          f = m.length;
        for (l = 0; l < f; ++l) {
          if (
            (s = m[l]) !== r &&
            s.parentElement !== r &&
            r.parentElement !== s &&
            isElementVisible(s)
          ) {
            var p = s.candidateElement;
            if (
              (p || (p = new CandidateElement(s, this.contentDocument))) &&
              p.basicScore() * ReaderMinimumAdvantage > this.basicScore()
            ) {
              if (s.closest("section") && r.closest("section")) return !1;
              if (
                SectionRegex.test(s.className) &&
                SectionRegex.test(r.className)
              )
                return !1;
              if (n(s) && !g) return !1;
              if (
                !d &&
                cachedElementBoundingRect(s).bottom <
                  cachedElementBoundingRect(this.element).top
              ) {
                d = !0;
                continue;
              }
              if (
                t(r.previousElementSibling, s.previousElementSibling) ||
                t(r.nextElementSibling, s.nextElementSibling)
              ) {
                var E = r.querySelector(HeaderElementsSelector),
                  v = s.querySelector(HeaderElementsSelector);
                if (E && v && elementsHaveSameTagAndClassNames(E, v)) return !0;
                if (
                  ((E = r.previousElementSibling),
                  (v = s.previousElementSibling),
                  E &&
                    v &&
                    elementIsAHeader(E) &&
                    elementIsAHeader(v) &&
                    elementsHaveSameTagAndClassNames(E, v))
                )
                  return !0;
              }
              if (elementDepth(s) === h)
                for (
                  ;
                  s.parentElement &&
                  r.parentElement &&
                  s.parentElement !== r.parentElement;
                )
                  ((s = s.parentElement), (r = r.parentElement));
              for (; r.childElementCount <= 1; ) {
                if (!r.childElementCount || !s.childElementCount) return !1;
                if (s.childElementCount > 1) return !1;
                if (
                  normalizedElementTagName(r.firstElementChild) !==
                  normalizedElementTagName(s.firstElementChild)
                )
                  return !1;
                ((r = r.firstElementChild), (s = s.firstElementChild));
              }
              if (s.childElementCount <= 1) return !1;
              v = s.firstElementChild;
              var N = s.lastElementChild,
                C = ((E = r.firstElementChild), r.lastElementChild);
              if (normalizedElementTagName(v) !== normalizedElementTagName(E))
                return !1;
              if (normalizedElementTagName(N) !== normalizedElementTagName(C))
                return !1;
              var A = v.className,
                S = N.className,
                b = E.className,
                y = N.className,
                T = y === b ? 2 : 1;
              if (A.length || b.length) {
                if (!A.length || !b.length) return !1;
                if (
                  A === b &&
                  elementsMatchingClassesInClassList(E.classList, r).length <= T
                )
                  return !0;
              }
              if (S.length || y.length) {
                if (!S.length || !y.length) return !1;
                if (
                  S === y &&
                  elementsMatchingClassesInClassList(N.classList, r).length <= T
                )
                  return !0;
              }
              var x = E.clientHeight,
                R = C.clientHeight;
              return (
                !(!x || !v.clientHeight) &&
                !(!R || !N.clientHeight) &&
                (x === v.clientHeight || R === N.clientHeight)
              );
            }
          }
        }
        for (l = 0; l < u; ++l) e[l].element.candidateElement = null;
      }
      return !1;
    },
    shouldDisqualifyForDeepLinking: function () {
      const e = 5;
      for (
        var t = this.element,
          n = this.contentDocument.location,
          r = pathComponentsForAnchor(n).length,
          i = [],
          a = t.getElementsByTagName("a"),
          o = a.length,
          l = 0;
        l < o;
        l++
      ) {
        var s = a[l];
        if (
          n.host === s.host &&
          !(
            pathComponentsForAnchor(s).length <= r ||
            0 !== (s.host + s.pathname).indexOf(n.host + n.pathname) ||
            anchorLinksToAttachment(s) ||
            (i.push(s), i.length < e)
          )
        ) {
          var c = t.offsetTop + t.offsetHeight / e;
          return i[0].offsetTop < c;
        }
      }
      return !1;
    },
  }),
  (String.prototype.lastInteger = function () {
    const e = /[0-9]+/g;
    var t = this.match(e);
    return t ? parseInt(t[t.length - 1]) : NaN;
  }));
((ReaderArticleFinder = function (e) {
  ((this.contentDocument = e),
    (this.didSearchForArticleNode = !1),
    (this.didChangeContentDocumentToFrameOnPage = !1),
    (this.article = null),
    (this.didSearchForExtraArticleNode = !1),
    (this.extraArticle = null),
    (this._leadingMediaElement = null),
    (this._isMediaWikiPage = void 0),
    (this._cachedScrollY = 0),
    (this._cachedScrollX = 0),
    (this._elementsWithCachedBoundingRects = []),
    (this._cachedContentTextStyle = null),
    (this.pageNumber = 1),
    (this.prefixWithDateForNextPageURL = null),
    (this.previouslyDiscoveredPageURLStrings = []),
    (this.candidateElementFilter = {
      minimumWidth: 280,
      minimumHeight: 295,
      minimumArea: 17e4,
      maxTop: 1300,
    }));
  let t = 0;
  ((this._nextUniqueID = function () {
    return t++ + "";
  }),
    (this._mapOfUniqueIDToOriginalElement = new Map()),
    (this._weakMapOfOriginalElementToUniqueID = new WeakMap()));
}),
  (ReaderArticleFinder.prototype = {
    setConfigurationForTesting: function (e) {
      this.configurationForTesting = e;
    },
    setCandidateElementFilter: function (e) {
      let [t, n] = this._validityAndValidCandidateElementFilterFromFilter(e);
      t && (this.candidateElementFilter = n);
    },
    _validityAndValidCandidateElementFilterFromFilter: function (e) {
      let t = {},
        n = !1;
      for (let i of [
        "minimumWidth",
        "minimumHeight",
        "minimumArea",
        "maxTop",
      ]) {
        let r = (e || {})[i];
        if (void 0 === r || "number" != typeof r || r < 0) {
          ((t = {}), (n = !1));
          break;
        }
        ((t[i] = r), (n = !0));
      }
      return [n, t];
    },
    pointsForDominantIframeHitTest: function () {
      const e = 60;
      return [
        [e, e],
        [window.innerWidth - e, e],
        [e, window.innerHeight - e],
        [window.innerWidth - e, window.innerHeight - e],
      ];
    },
    dominantContentIframe: function () {
      let e,
        t = this.pointsForDominantIframeHitTest(),
        n = t.length;
      for (let i = 0; i < n; i++) {
        if (
          ((cornerElement = document.elementFromPoint(t[i][0], t[i][1])),
          !cornerElement || "IFRAME" !== cornerElement.tagName)
        )
          return null;
        if (e) {
          if (e !== cornerElement) return null;
        } else e = cornerElement;
      }
      return e;
    },
    checkForIframeCoveringMostOfWebpage: function () {
      let e = this.dominantContentIframe();
      e &&
        !this.didChangeContentDocumentToFrameOnPage &&
        ((this.contentDocument = e.contentDocument),
        this.resetArticleInformation(),
        (this.didChangeContentDocumentToFrameOnPage = !0));
    },
    isReaderModeAvailable: function () {
      return (
        this.setSuppressBoundingRectCalculationForSkippedElements(!0),
        this.checkForIframeCoveringMostOfWebpage(),
        !!this.findArticleBySearchingQuirksList() ||
          (this.cacheWindowScrollPosition(),
          !!this.findArticleFromMetadata(FindArticleMode.ExistenceOfElement) ||
            ((this.article = this.findArticleByVisualExamination()),
            this.article && this.articleIsLTR(),
            !!this.article))
      );
    },
    hasDominantContentIframe: function () {
      return document !== this.contentDocument;
    },
    previewReaderImageURL: function () {
      const e = this.adoptableArticle(!0);
      if (!e) return null;
      const t = e.querySelectorAll("img");
      if (!t.length) return null;
      const n = window.innerWidth / 2,
        i = window.innerHeight / 2,
        r = this.contentDocument
          .elementsFromPoint(n, i)
          .find((e) => "IMG" === e.tagName),
        a = t[0].currentSrc;
      if (!r) return a;
      const l = [...t].find((e) => e.currentSrc === r.currentSrc);
      return l ? l.currentSrc : a;
    },
    resetArticleInformation: function () {
      ((this.didSearchForArticleNode = !1),
        (this.didSearchForExtraArticleNode = !1),
        delete this.article,
        delete this.extraArticle,
        delete this._articleTitleInformation,
        delete this._articleTitleElement,
        delete this._leadingMediaElement,
        delete this._cachedContentTextStyle,
        delete this._adoptableArticle,
        delete this._articleIsLTR,
        delete this._nextPageURL,
        delete this._cachedScrollY,
        delete this._cachedScrollX,
        clearCachedElementBoundingRects());
    },
    reset: function () {
      (this.resetArticleInformation(), this.prepareToTransitionToReader());
    },
    prepareToTransitionToReader: function () {
      (this.adoptableArticle(!0), this.nextPageURL(), this.articleIsLTR());
    },
    nextPageURL: function () {
      if (!this._nextPageURL) {
        var e = this.nextPageURLString();
        ("undefined" != typeof ReaderArticleFinderJSController &&
          e &&
          (e = ReaderArticleFinderJSController.substituteURLForNextPageURL(e)),
          (this._nextPageURL = e));
      }
      return this._nextPageURL;
    },
    containerElementsForMultiPageContent: function () {
      const e = /(.*page[^0-9]*|.*article.*item[^0-9]*)(\d{1,2})(.*)/i,
        t = 3;
      for (
        var n, i = [], r = this.articleNode(), a = 0;
        !(n = e.exec(r.getAttribute("id")));
      )
        if (!(r = r.parentElement) || a++ === t) return [];
      for (
        var l = childrenOfParentElement(r), o = l.length, s = 0;
        s < o;
        ++s
      ) {
        var c = l[s];
        if (c !== r) {
          var m = e.exec(c.getAttribute("id"));
          m &&
            m[1] === n[1] &&
            m[3] === n[3] &&
            ((isElementVisible(c) && !isElementPositionedOffScreen(c)) ||
              i.push(c));
        }
      }
      return i;
    },
    adoptableMultiPageContentElements: function () {
      return this.containerElementsForMultiPageContent().map(function (e) {
        return this.cleanArticleNode(
          e,
          e.cloneNode(!0),
          CleaningType.MainArticleContent,
          !1,
        );
      }, this);
    },
    classNameIsSignificantInRouteComputation: function (e) {
      return !!e && !(e.toLowerCase() in StylisticClassNames);
    },
    shouldIgnoreInRouteComputation: function (e) {
      let t = normalizedElementTagName(e);
      return (
        "script" === t ||
        "link" === t ||
        "style" === t ||
        ("tr" === t && !e.offsetHeight)
      );
    },
    routeToArticleNode: function () {
      for (var e = [], t = this.articleNode(); t; ) {
        var n = {};
        n.tagName = normalizedElementTagName(t);
        var i = t.getAttribute("id");
        (i && (n.id = i),
          this.classNameIsSignificantInRouteComputation(t.className) &&
            (n.className = t.className),
          (n.index = 1));
        for (var r = t.previousElementSibling; r; r = r.previousElementSibling)
          this.shouldIgnoreInRouteComputation(r) || n.index++;
        (e.unshift(n), (t = t.parentElement));
      }
      return e;
    },
    adjustArticleNodeUpwardIfNecessary: function () {
      if (!this.article) return;
      var e = this.article.element;
      if (!e.parentElement) return;
      for (var t = e; t; t = t.parentElement)
        if (VeryPositiveClassNameRegEx.test(t.className))
          return void (this.article.element = t);
      if (
        "header" === normalizedElementTagName(e) &&
        "article" === normalizedElementTagName(e.parentElement)
      )
        return void (this.article.element = e.parentElement);
      var n = e.previousElementSibling;
      if (
        n &&
        "figure" === normalizedElementTagName(n) &&
        "article" === normalizedElementTagName(e.parentElement)
      )
        return void (this.article.element = e.parentElement);
      var i =
        "section" === normalizedElementTagName(e)
          ? e
          : nearestAncestorElementWithTagName(e, "section", ["article"]);
      if (i) {
        var r = i.parentElement,
          a = (function () {
            for (var e = r.children, t = e.length, n = 0; n < t; ++n) {
              var a = e[n],
                l = normalizedElementTagName(a);
              if (a !== i && ("section" === l || "header" === l)) return !0;
            }
            return !1;
          })();
        if (
          a &&
          (/\barticleBody\b/.test(r.getAttribute("itemprop")) ||
            "main" === normalizedElementTagName(r) ||
            "main" === r.getAttribute("role") ||
            "article" === normalizedElementTagName(r) ||
            r === this.contentDocument.body ||
            r.classList.contains("entry-content"))
        )
          return void (this.article.element = r);
      }
      const l = /intro/i,
        o = /body|content/i;
      if (
        ((e = this.article.element),
        (l.test(e.className) &&
          e.nextElementSibling &&
          o.test(e.nextElementSibling.className)) ||
          (o.test(e.className) &&
            e.previousElementSibling &&
            l.test(e.previousElementSibling.className)))
      )
        return void (this.article.element = e.parentElement);
      if ("article" !== normalizedElementTagName(e)) {
        var s = e.parentElement.closest("*[itemprop='articleBody']");
        if (s && s.parentElement.closest(SchemaDotOrgArticleContainerSelector))
          return void (this.article.element = s);
      }
      var c = e.closest("article");
      if (c) {
        e = unwrappedArticleContentElement(e);
        var m,
          d = elementDepth(e);
        ("p" !== normalizedElementTagName(e) ||
          e.className ||
          ((e = e.parentElement), d--),
          e.classList.length
            ? 1 ===
                (m =
                  elementsMatchingClassesInClassListIgnoringCommonLayoutClassNames(
                    e.classList,
                    this.contentDocument,
                  )).length &&
              (m =
                elementsMatchingClassesInClassListIgnoringClassesWithNumericSuffix(
                  e.classList,
                  this.contentDocument,
                ))
            : (m = e.parentElement.children));
        for (var h = m.length, u = 0; u < h; ++u) {
          var g = m[u];
          if (
            e !== g &&
            d === elementDepth(g) &&
            isElementVisible(g) &&
            !g.querySelector("article") &&
            Object.keys(e.dataset).join() === Object.keys(g.dataset).join() &&
            dominantFontFamilyAndSizeForElement(e) ===
              dominantFontFamilyAndSizeForElement(g)
          )
            return void (this.article.element = c);
        }
      }
      let f = this.findExtraArticle(),
        p = f ? f.element : null;
      if (
        p &&
        p.parentElement &&
        e.parentElement === p.parentElement &&
        ArticleRegEx.test(e.parentElement.className)
      ) {
        if (
          dominantFontFamilyAndSizeForElement(e) ===
          dominantFontFamilyAndSizeForElement(p)
        )
          return void (this.article.element = e.parentElement);
      }
      let E = e.parentElement;
      if (
        elementIsCommentBlock(e) &&
        !elementIsCommentBlock(E) &&
        ArticleRegEx.test(E.className)
      ) {
        let e = CandidateElement.candidateIfElementIsViable(
          E,
          this.contentDocument,
          !0,
        );
        if (e && e.finalScore() >= ReaderMinimumScore)
          return void (this.article.element = E);
      }
      if (!(e = this.article.element).getAttribute("id") && e.className) {
        var v = normalizedElementTagName(e),
          T = e.className,
          S = e.parentElement;
        if (S)
          for (var A = S.children, N = ((u = 0), A.length); u < N; ++u) {
            var y = A[u];
            if (
              y !== e &&
              normalizedElementTagName(y) === v &&
              y.className === T
            ) {
              var b = CandidateElement.candidateIfElementIsViable(
                y,
                this.contentDocument,
                !0,
              );
              if (b && !(b.finalScore() < ReaderMinimumScore))
                return void (this.article.element = S);
            }
          }
      }
    },
    findArticleBySearchingQuirksList: function () {
      var e,
        t = this.contentDocument;
      return (
        findArticleNodeSelectorsInQuirksListForHostname(
          t.location.hostname,
          function (n) {
            var i = t.querySelectorAll(n);
            if (1 === i.length)
              return ((e = new CandidateElement(i[0], t)), !0);
          },
        ),
        e
      );
    },
    articleNode: function (e) {
      return (
        this.checkForIframeCoveringMostOfWebpage(),
        this.didSearchForArticleNode ||
          ((this.article = this.findArticleBySearchingQuirksList()),
          this.article ||
            (this.article = this.findArticleBySearchingAllElements()),
          this.article ||
            (this.article = this.findArticleByVisualExamination()),
          this.article || (this.article = this.findArticleFromMetadata()),
          !this.article &&
            e &&
            (this.article = this.findArticleBySearchingAllElements(!0)),
          (this.didSearchForArticleNode = !0),
          this.adjustArticleNodeUpwardIfNecessary(),
          this.article &&
            (this.article.element = unwrappedArticleContentElement(
              this.article.element,
            )),
          this.article && this.articleIsLTR()),
        this.article ? this.article.element : null
      );
    },
    extraArticleNode: function () {
      return (
        this.didSearchForArticleNode || this.articleNode(),
        this.didSearchForExtraArticleNode ||
          ((this.extraArticle = this.findExtraArticle()),
          (this.didSearchForExtraArticleNode = !0)),
        this.extraArticle ? this.extraArticle.element : null
      );
    },
    cacheWindowScrollPosition: function () {
      ((this._cachedScrollY = window.scrollY),
        (this._cachedScrollX = window.scrollX));
    },
    contentTextStyle: function () {
      return (
        this._cachedContentTextStyle ||
          ((this._cachedContentTextStyle = contentTextStyleForNode(
            this.contentDocument,
            this.articleNode(),
          )),
          this._cachedContentTextStyle ||
            (this._cachedContentTextStyle = getComputedStyle(
              this.articleNode(),
            ))),
        this._cachedContentTextStyle
      );
    },
    commaCountIsLessThan: function (e, t) {
      for (
        var n = 0, i = e.textContent, r = -1;
        n < t && (r = i.indexOf(",", r + 1)) >= 0;
      )
        n++;
      return n < t;
    },
    calculateLinkDensityForPruningElement: function (e, t) {
      var n = removeWhitespace(e.textContent).length;
      if (!n) return 0;
      for (
        var i = this.article.element,
          r = (function () {
            for (var t = e.originalElement; t && t !== i; t = t.parentElement)
              if ("none" !== getComputedStyle(t).float) return t;
            return null;
          })(),
          a = e.getElementsByTagName("a"),
          l = 0,
          o = a.length,
          s = 0;
        s < o;
        ++s
      ) {
        var c = a[s];
        (!r &&
          c.href &&
          t &&
          t === dominantFontFamilyAndSizeForElement(c.originalElement)) ||
          (l += removeWhitespace(c.textContent).length);
      }
      return l / n;
    },
    shouldPruneElement: function (e, t, n) {
      const i = 0.33,
        r = 0.5,
        a = 0.2,
        l = 25,
        o = 4e4;
      let s = normalizedElementTagName(e);
      if (!e.parentElement) return !1;
      if (t.classList.contains("footnotes")) return !1;
      if (e.querySelector(".tweet-wrapper")) return !1;
      if (
        "figure" === normalizedElementTagName(e.parentElement) &&
        e.querySelector("img")
      )
        return !1;
      if ("iframe" === s) return shouldPruneIframe(e);
      if ("canvas" !== s) {
        for (var c = !1, m = e.childNodes.length, d = 0; d < m; ++d) {
          var h = e.childNodes[d],
            u = h.nodeType;
          if (
            u === Node.ELEMENT_NODE ||
            (u === Node.TEXT_NODE && !isNodeWhitespace(h))
          ) {
            c = !0;
            break;
          }
        }
        if (!c) {
          if ("p" === s) {
            var g = e.previousSibling,
              f = e.nextSibling;
            if (
              g &&
              g.nodeType === Node.TEXT_NODE &&
              !isNodeWhitespace(g) &&
              f &&
              f.nodeType === Node.TEXT_NODE &&
              !isNodeWhitespace(f)
            )
              return !1;
          }
          return !0;
        }
        if ("p" === s) return !1;
      }
      if ("canvas" === s)
        return (
          (window.innerWidth === t.width && window.innerHeight === t.height) ||
          !(
            !ProgressiveLoadingRegex.test(t.className) ||
            "img" !== normalizedElementTagName(t.nextElementSibling)
          ) ||
          !!canvasElementHasNoUserVisibleContent(t) ||
          "cufon" === normalizedElementTagName(e.parentNode)
        );
      if (e.closest("figure") && e.querySelector("picture")) return !1;
      var p = 0;
      if (t) {
        if (VeryNegativeClassNameRegEx.test(t.className)) return !0;
        var E = t.className,
          v = t.getAttribute("id");
        (PositiveRegEx.test(E) && p++,
          PositiveRegEx.test(v) && p++,
          NegativeRegEx.test(E) && p--,
          NegativeRegEx.test(v) && p--);
      }
      let T = this.isMediaWikiPage();
      if (p < 0 && !T) return !0;
      if (elementIsProtected(e)) return !1;
      if ("ul" === s || "ol" === s) {
        if (t.querySelector("iframe") && t.querySelector("script")) return !0;
        var S = t.children,
          A = S.length;
        if (!A && !/\S/.test(e.innerText)) return !0;
        var N = 0,
          y = 0;
        for (d = 0; d < A; ++d) {
          var b = S[d];
          if (SharingRegex.test(b.className)) N++;
          else {
            var x = b.children;
            1 === x.length && SharingRegex.test(x[0].className) && N++;
          }
          NegativeRegEx.test(S[d].className) && y++;
        }
        return (
          N / A >=
            MinimumRatioOfListItemsBeingRelatedToSharingToPruneEntireList ||
          y / A >= MinimumRatioOfListItemsBeingRelatedToSharingToPruneEntireList
        );
      }
      if (1 === e.childElementCount) {
        var I = e.firstElementChild;
        if ("a" === normalizedElementTagName(I)) return !1;
        if (
          "span" === normalizedElementTagName(I) &&
          "converted-anchor" === I.className &&
          nearestAncestorElementWithTagName(I, "table")
        )
          return !1;
      }
      var D = e.getElementsByTagName("img"),
        C = D.length;
      if (C) {
        var R = 0;
        for (d = 0; d < C; ++d) {
          var L = D[d].originalElement;
          if (isElementVisible(L)) {
            var M = cachedElementBoundingRect(L);
            R += (M.width / C) * (M.height / C);
          }
        }
        if (R > o) return !1;
      }
      if (!this.commaCountIsLessThan(e, 10)) return !1;
      var _ = e.getElementsByTagName("p").length,
        w = e.getElementsByTagName("br").length,
        F = _ + Math.floor(w / 2);
      if (C > F && "table" !== s) return !0;
      if (
        !e.closest("table") &&
        !e._originalElementDepthInCollapsedArea &&
        !T
      ) {
        if (
          e.getElementsByTagName("li").length > F &&
          dominantFontFamilyAndSizeForElement(t.querySelector("li")) !== n
        )
          return !0;
        if (e.textContent.length < l && 1 !== C) return !0;
        let i = this.calculateLinkDensityForPruningElement(e, n);
        if (p >= 1 && i > r) return !0;
        if (p < 1 && i > a) return !0;
      }
      if (e.getElementsByTagName("input").length / F > i) return !0;
      if ("table" === s) {
        if (
          removeWhitespace(e.innerText).length <=
          0.5 * removeWhitespace(t.innerText).length
        )
          return !0;
        if (T && t.classList.contains("toc")) return !0;
      }
      return !1;
    },
    wordCountIsLessThan: function (e, t) {
      for (
        var n = 0, i = e.textContent, r = -1;
        (r = i.indexOf(" ", r + 1)) >= 0 && n < t;
      )
        n++;
      return n < t;
    },
    leadingMediaIsAppropriateWidth: function (e) {
      return (
        !(!this.article || !e) &&
        e.getBoundingClientRect().width >=
          this.article.element.getBoundingClientRect().width -
            ToleranceForLeadingMediaWidthToArticleWidthForFullWidthPresentation
      );
    },
    newDivFromNode: function (e) {
      var t = this.contentDocument.createElement("div");
      return (e && (t.innerHTML = e.innerHTML), t);
    },
    headerElement: function () {
      if (!this.article) return null;
      var e = this.article.element.previousElementSibling;
      if (e && "header" === normalizedElementTagName(e)) return e;
      var t = this._articleTitleElement;
      if (!t) return null;
      var n = t.parentElement;
      if (
        n &&
        "header" === normalizedElementTagName(n) &&
        !this.article.element.contains(n)
      )
        for (
          var i = n.querySelectorAll("img"), r = i.length, a = 0;
          a < r;
          ++a
        ) {
          var l = i[a],
            o = cachedElementBoundingRect(l);
          if (
            o.width >= MainImageMinimumWidthAndHeight &&
            o.height >= MainImageMinimumWidthAndHeight
          )
            return n;
        }
      return null;
    },
    adoptableLeadingMedia: function () {
      if (!this.article || !this._leadingMediaElement) return null;
      var e = this._leadingMediaElement.closest("figure");
      if (e)
        return this.cleanArticleNode(
          e,
          e.cloneNode(!0),
          CleaningType.LeadingMedia,
          !0,
        );
      if (!this.leadingMediaIsAppropriateWidth(this._leadingMediaElement))
        return null;
      if ("img" !== normalizedElementTagName(this._leadingMediaElement))
        return this.cleanArticleNode(
          this._leadingMediaElement,
          this._leadingMediaElement.cloneNode(!0),
          CleaningType.LeadingMedia,
          !0,
        );
      const t = 5,
        n = /credit/,
        i = /caption/,
        r = /src|alt/;
      var a = this._leadingMediaElement.parentNode,
        l = null,
        o = null,
        s = a.children.length;
      if ("div" === normalizedElementTagName(a) && s > 1 && s < t)
        for (
          var c = a.cloneNode(!0).querySelectorAll("p, div"),
            m = c.length,
            d = 0;
          d < m;
          ++d
        ) {
          var h = c[d];
          n.test(h.className)
            ? (l = h.cloneNode(!0))
            : i.test(h.className) && (o = h.cloneNode(!0));
        }
      var u = this._leadingMediaElement.cloneNode(!1),
        g = lazyLoadingImageURLForElement(u, u.className);
      (g && u.setAttribute("src", g),
        (!g && u.hasAttribute("src")) ||
          !u.hasAttribute("data-srcset") ||
          u.setAttribute("srcset", u.getAttribute("data-srcset")));
      var f = attributesForElement(u);
      for (d = 0; d < f.length; ++d) {
        var p = f[d].nodeName;
        r.test(p) || (u.removeAttribute(p), d--);
      }
      var E = this.contentDocument.createElement("div");
      if (((E.className = "leading-image"), E.appendChild(u), l)) {
        var v = this.newDivFromNode(l);
        ((v.className = "credit"), E.appendChild(v));
      }
      if (o) {
        var T = this.newDivFromNode(o);
        ((T.className = "caption"), E.appendChild(T));
      }
      return E;
    },
    articleBoundingRect: function () {
      return (
        this._articleBoundingRect ||
          (this._articleBoundingRect = cachedElementBoundingRect(
            this.article.element,
          )),
        this._articleBoundingRect
      );
    },
    updatePageInformation: function (e) {
      ((this.pageNumber = e.pageNumber),
        (this.suggestedRouteToArticle = e.suggestedRouteToArticle),
        (this.previouslyDiscoveredPageURLStrings =
          e.previouslyDiscoveredPageURLStrings));
    },
    hasArticle: function () {
      return !!this.article;
    },
    serializableArticle: function () {
      const e = this.adoptableArticle(!0);
      if (!e) return null;
      let t;
      const n = this.adoptableMetadataBlock();
      return (
        n && (t = webkit.serializeNode(n, { deep: !0 })),
        {
          articleIsLTR: this.articleIsLTR(),
          articleNode: webkit.serializeNode(e, { deep: !0 }),
          articleTitle: this.articleTitle(),
          articleTitleInformation: this.articleTitleInformation(),
          articleSubhead: this.articleSubhead(),
          baseURI: this.contentDocument.baseURI,
          documentURLString: this.documentURLString(),
          heightOfArticle: this.articleNode().getBoundingClientRect().height,
          metadataBlock: t,
          multiPageContentElements:
            this.adoptableMultiPageContentElements().map(() =>
              webkit.serializeNode(multiPageContentElements, { deep: !0 }),
            ),
          nextPageURL: this.nextPageURL(),
          routeToArticleNode: this.routeToArticleNode(),
        }
      );
    },
    updatePageInformation: function (e) {
      ((this.pageNumber = e.pageNumber),
        (this.suggestedRouteToArticle = e.suggestedRouteToArticle),
        (this.previouslyDiscoveredPageURLStrings =
          e.previouslyDiscoveredPageURLStrings));
    },
    adoptableArticle: function (e) {
      if (this._adoptableArticle) return this._adoptableArticle.cloneNode(!0);
      (this.setSuppressBoundingRectCalculationForSkippedElements(!1),
        clearCachedElementBoundingRects(),
        this.cacheWindowScrollPosition());
      var t = this.articleNode(e);
      if (
        ((this._adoptableArticle = t ? t.cloneNode(!0) : null),
        !this._adoptableArticle)
      )
        return this._adoptableArticle;
      if (
        ((this._adoptableArticle = this.cleanArticleNode(
          t,
          this._adoptableArticle,
          CleaningType.MainArticleContent,
          !1,
        )),
        "p" === normalizedElementTagName(this._adoptableArticle))
      ) {
        var n = document.createElement("div");
        (n.appendChild(this._adoptableArticle), (this._adoptableArticle = n));
      }
      var i = this.extraArticleNode();
      if (i) {
        var r = this.cleanArticleNode(
          i,
          i.cloneNode(!0),
          CleaningType.MainArticleContent,
          !0,
        );
        r
          ? this.extraArticle.isPrepended
            ? this._adoptableArticle.insertBefore(
                r,
                this._adoptableArticle.firstChild,
              )
            : this._adoptableArticle.appendChild(r)
          : (i = null);
        var a = cachedElementBoundingRect(this.article.element),
          l = cachedElementBoundingRect(this.extraArticle.element),
          o = {
            top: Math.min(a.top, l.top),
            right: Math.max(a.right, l.right),
            bottom: Math.max(a.bottom, l.bottom),
            left: Math.min(a.left, l.left),
          };
        ((o.width = o.right - o.left),
          (o.height = o.bottom - o.top),
          (this._articleBoundingRect = o));
      }
      this._articleTextContent = this._adoptableArticle.innerText;
      var s = this.headerElement();
      if (
        this._leadingMediaElement &&
        (!s || !s.contains(this._leadingMediaElement))
      ) {
        var c = this.adoptableLeadingMedia();
        c &&
          this._adoptableArticle.insertBefore(
            c,
            this._adoptableArticle.firstChild,
          );
      }
      var m = !!s;
      if (m && i && (i === s && (m = !1), m)) {
        var d = i.compareDocumentPosition(s);
        (d & Node.DOCUMENT_POSITION_CONTAINS ||
          d & Node.DOCUMENT_POSITION_CONTAINED_BY) &&
          (m = !1);
      }
      if (m) {
        var h = this.cleanArticleNode(
          s,
          s.cloneNode(!0),
          CleaningType.MainArticleContent,
          !0,
        );
        h &&
          this._adoptableArticle.insertBefore(
            h,
            this._adoptableArticle.firstChild,
          );
      }
      return this._adoptableArticle;
    },
    dominantContentSelectorAndDepth: function (e) {
      var t,
        n = {},
        i = {};
      walkElementSubtree(e, 2, function (e, t) {
        if (isElementVisible(e)) {
          var r = selectorForElement(e) + " | " + t;
          i[r] ? (i[r] += 1) : ((i[r] = 1), (n[r] = e));
        }
      });
      var r = arrayOfKeysAndValuesOfObjectSortedByValueDescending(i);
      switch (r.length) {
        case 0:
          break;
        case 1:
          t = r[0].key;
          break;
        default:
          var a = r[0];
          a.value > r[1].value && (t = a.key);
      }
      if (!t) return null;
      var l = n[t];
      return {
        selector: selectorForElement(l),
        depth: depthOfElementWithinElement(l, e),
      };
    },
    functionToPreventPruningElementDueToInvisibility: function () {
      return (
        functionToPreventPruningDueToInvisibilityInQuirksListForHostname(
          this.contentDocument.location.hostname,
        ) ||
        function () {
          return !1;
        }
      );
    },
    cleanArticleNode: function (e, t, n, i) {
      function r(e) {
        ((v += e),
          T && (T += e),
          S && (S += e),
          A && (A += e),
          N && (N += e),
          y && (y += e));
      }
      function a() {
        (1 === T && (T = 0),
          1 === S && (S = 0),
          1 === A && (A = 0),
          1 === N && (N = 0),
          1 === y && (y = 0));
      }
      function l() {
        const t = 0.8;
        var n = cachedElementBoundingRect(e);
        if (0 === n.width || 0 === n.height) return !0;
        var i,
          r = childrenWithParallelStructure(e),
          a = r.length;
        if (a) {
          i = [];
          for (var l = 0; l < a; ++l) {
            var o = r[l];
            if ("none" === getComputedStyle(o).float)
              for (var s = o.children, c = s.length, m = 0; m < c; ++m)
                i.push(s[m]);
            else i.push(o);
          }
        } else i = e.children;
        var d = i.length,
          h = 0;
        for (l = 0; l < d; ++l) {
          var u = i[l];
          "none" !== getComputedStyle(u).float && (h += u.innerText.length);
        }
        return h / e.innerText.length > t;
      }
      function o(t) {
        const n = 50;
        if (cachedElementBoundingRect(t).height > n) return !1;
        return (
          !!new Set(["ul", "li", "nav"]).has(normalizedElementTagName(t)) ||
          (t.parentElement === e && !t.nextElementSibling)
        );
      }
      function s(e, t) {
        const n = 0.9;
        return !(
          cachedElementBoundingRect(e).height >
          n * cachedElementBoundingRect(t).height
        );
      }
      function c(e, t) {
        const n = 1.1,
          i = 1.4;
        t &&
          H &&
          (e.matches(HeaderElementsSelector) ||
            ((t > i * H || (V.test(b.className) && t > n * H)) &&
              !e.closest(".pullquote") &&
              (e.classList.add("pullquote"),
              e.classList.contains("float") ||
                ((e.style.width = null), cleanStyleAndClassList(e)))));
      }
      function m(e, t) {
        for (var n = e[t]; n; n = n[t])
          if (!isNodeWhitespace(n) && n.nodeType !== Node.COMMENT_NODE)
            return !1;
        return !0;
      }
      const d = new Set([
          "form",
          "script",
          "style",
          "link",
          "button",
          "object",
          "embed",
          "applet",
        ]),
        h = new Set([
          "div",
          "table",
          "ul",
          "canvas",
          "p",
          "iframe",
          "aside",
          "section",
          "footer",
          "nav",
          "ol",
          "menu",
          "svg",
        ]),
        u = new Set(["i", "em"]),
        g = new Set(["b", "strong", "h1", "h2", "h3", "h4", "h5", "h6"]),
        f = new Set(["i-amphtml-sizer"]),
        p = /lightbox/i;
      var E = [],
        v = 0,
        T = 0,
        S = 0,
        A = 0,
        N = 0,
        y = 0,
        b = e,
        x = b.ownerDocument.defaultView,
        I = t,
        D = this.articleTitle(),
        C = this._articleTitleElement,
        R = (this.articleSubhead(), this._articleSubheadElement),
        L =
          C &&
          cachedElementBoundingRect(C).top >
            cachedElementBoundingRect(e).bottom,
        M = isElementVisible(e),
        _ = new Set([C, R]),
        w = new Set();
      if (n === CleaningType.MainArticleContent) {
        this.updateArticleBylineAndDateElementsIfNecessary();
        var F = this.articleBylineElement();
        F && w.add(F);
        var O = this.articleDateElement();
        O && w.add(O);
      }
      var B = this.dominantContentSelectorAndDepth(e),
        P = l(),
        k = new Set();
      this.previouslyDiscoveredPageURLStrings.forEach(function (e) {
        k.add(e);
      });
      var q = this.nextPageURL();
      q && k.add(q);
      var U = null;
      this._articleTitleElement &&
        (U = cachedElementBoundingRect(this._articleTitleElement));
      var z = this.functionToPreventPruningElementDueToInvisibility(),
        W = dominantFontFamilyAndSizeForElement(e),
        H = dominantFontSizeInPointsFromFontFamilyAndSizeString(W);
      const V = /pull(ed)?quote/i;
      for (var j = [], Y = [], G = [], Q = [], X = []; b; ) {
        try {
          var J,
            K = null,
            $ = normalizedElementTagName(I),
            Z = !1,
            ee = elementLooksLikeDropCap(b);
          if (
            ((I.originalElement = b),
            !y && elementAppearsToBeCollapsed(b) && (y = 1),
            (d.has($) || (this.isAMPPage() && f.has($))) && (K = I),
            !K && b !== e && _.has(b)
              ? (K = I)
              : !K && b !== e && w.has(b)
                ? ((I.parentElementBeforePruning = I.parentElement),
                  (K = I),
                  j.push(I))
                : elementIsAHeader(I) &&
                  previousLeafElementForElement(b) === C &&
                  I.classList.add("protected"),
            "twitter-widget" === $ && I.classList.add("protected"),
            !K && ("h1" === $ || "h2" === $))
          )
            if (
              b.offsetTop - e.offsetTop <
              HeaderMinimumDistanceFromArticleTop
            ) {
              var te = trimmedInnerTextIgnoringTextTransform(b),
                ne = te.length * HeaderLevenshteinDistanceToLengthRatio;
              levenshteinDistance(D, te) <= ne && (K = I);
            }
          if (
            (K ||
              (this.isMediaWikiPage() &&
                /editsection|icon-edit|edit-page|mw-empty-elt/.test(
                  b.className,
                ) &&
                (K = I)),
            "video" === $)
          )
            if (I.getAttribute("src")) {
              I.classList.add("protected");
              var ie = cachedElementBoundingRect(b);
              (I.setAttribute("width", ie.width),
                I.setAttribute("height", ie.height),
                I.removeAttribute("style"));
              b.hasAttribute("autoplay") &&
              b.hasAttribute("muted") &&
              b.hasAttribute("loop")
                ? I.setAttribute("data-reader-silent-looped-animation", "")
                : (I.setAttribute("controls", !0),
                  I.removeAttribute("autoplay"),
                  I.removeAttribute("preload"));
            } else K = I;
          K || (J = getComputedStyle(b));
          let t = (function () {
            if ("div" !== $ && "span" !== $) return !1;
            if (LazyLoadRegex.test(b.className)) return !0;
            for (let e of attributesForElement(b))
              if (
                /^data-/.test(e.name) &&
                LazyLoadRegex.test(e.value) &&
                cachedElementBoundingRect(b).height
              )
                return !0;
            return !1;
          })();
          if (
            !K &&
            t &&
            (!b.innerText ||
              (b.previousElementSibling &&
                "noscript" ===
                  normalizedElementTagName(b.previousElementSibling)))
          )
            if ((Ce = lazyLoadingImageURLForElement(I, b.className))) {
              var re = this.contentDocument.createElement("img");
              (re.setAttribute("src", Ce),
                I.parentNode.replaceChild(re, I),
                ((I = re).originalElement = b),
                ($ = normalizedElementTagName(I)),
                (K = I),
                I.classList.add("protected"));
            }
          if (!K && "img" !== $ && /img/.test($)) {
            lazyLoadingImageURLForElement(I, b.className) &&
              (((I = changeElementType(I, "img")).originalElement = b),
              ($ = "img"));
          }
          if (!K && "div" === $ && I.parentNode) {
            var ae = b.querySelectorAll(
                "a, blockquote, dl, div, img, ol, p, pre, table, ul",
              ),
              le = T || "none" !== J.float,
              oe = null;
            if (
              (le || ae.length
                ? elementIndicatesItIsASchemaDotOrgImageObject(b) &&
                  !I.querySelector("figure, .auxiliary")
                  ? (oe = "figure")
                  : ee && (oe = "span")
                : (oe = "p"),
              oe)
            ) {
              for (
                var se = I.parentNode,
                  ce = this.contentDocument.createElement(oe);
                I.firstChild;
              ) {
                var me = I.firstChild;
                ce.appendChild(me);
              }
              (se.replaceChild(ce, I),
                ((I = ce).originalElement = b),
                ($ = normalizedElementTagName(I)));
            }
          }
          if (
            (b.dataset &&
              b.dataset.mathml &&
              b.querySelector("math") &&
              G.push(I),
            !K &&
              I.parentNode &&
              h.has($) &&
              ((I._originalElementDepthInCollapsedArea = y), E.push(I)),
            K ||
              (isElementPositionedOffScreen(b)
                ? (K = I)
                : b === e ||
                  T ||
                  "none" === J.float ||
                  P ||
                  !(
                    cachedElementBoundingRect(b).height >= FloatMinimumHeight ||
                    b.childElementCount > 1
                  ) ||
                  (T = 1)),
            !K)
          ) {
            if (
              (sanitizeElementByRemovingAttributes(I),
              n === CleaningType.MetadataContent)
            )
              if ("|" === I.innerText)
                ((I.innerText = ""), I.classList.add("delimiter"));
              else if ("time" === normalizedElementTagName(I)) {
                var de = I.previousElementSibling;
                if (
                  de &&
                  "span" === normalizedElementTagName(de) &&
                  !de.classList.contains("delimiter")
                ) {
                  var he = this.contentDocument.createElement("span");
                  (he.classList.add("delimiter"), I.before(he));
                }
              } else "figure" === $ && (K = I);
            if (
              ("both" === J.clear && I.classList.add("clear"),
              "ul" === $ || "ol" === $ || "menu" === $)
            ) {
              if (U && !y && cachedElementBoundingRect(b).top < U.top) K = I;
              else if (
                "none" === J["list-style-type"] &&
                "none" === J["background-image"]
              ) {
                for (
                  var ue = b.children, ge = ue.length, fe = !0, pe = 0;
                  pe < ge;
                  ++pe
                ) {
                  var Ee = ue[pe],
                    ve = getComputedStyle(Ee);
                  if (
                    "none" !== ve["list-style-type"] ||
                    0 !== parseInt(ve["-webkit-padding-start"])
                  ) {
                    fe = !1;
                    break;
                  }
                  var Te = getComputedStyle(Ee, ":before").content;
                  if (/\u2022|\u25e6|\u2023|\u2219|counter/.test(Te)) {
                    fe = !1;
                    break;
                  }
                }
                fe && I.classList.add("list-style-type-none");
              }
              if (b.querySelector("code")) {
                const e = /monospace|menlo|courier/i;
                var Se = dominantFontFamilyAndSizeForElement(b);
                e.test(Se) &&
                  (I.classList.add("code-block"), I.classList.add("protected"));
              }
            }
            if (
              (A ||
                "normal" === J.fontStyle ||
                (u.has($) || (I.style && (I.style.fontStyle = J.fontStyle)),
                (A = 1)),
              !N && "normal" !== J.fontWeight)
            ) {
              if (!g.has($)) {
                var Ae = parseInt(J.fontWeight),
                  Ne = null;
                (isNaN(Ae)
                  ? (Ne = J.fontWeight)
                  : Ae <= 400 || (Ae >= 500 && (Ne = "bold")),
                  Ne && I.style && (I.style.fontWeight = Ne));
              }
              N = 1;
            }
            if ((T && "section" !== $ && s(b, e)) || "aside" === $) {
              Se = dominantFontFamilyAndSizeForElement(b);
              var ye = dominantFontSizeInPointsFromFontFamilyAndSizeString(Se),
                be = Se && Se === W;
              if (
                (1 !== T ||
                  ee ||
                  (cachedElementBoundingRect(b).width <= MaximumFloatWidth
                    ? I.setAttribute("class", "auxiliary float " + J.float)
                    : be || I.classList.add("auxiliary")),
                I.closest(".auxiliary") && b.style)
              ) {
                var xe = b.style.getPropertyValue("width");
                if ("table" === J.display && /%/.test(xe) && parseInt(xe) < 2)
                  I.style.width = J.width;
                else if (xe) I.style.width = xe;
                else {
                  var Ie = x.getMatchedCSSRules(b, "", !0);
                  if (Ie)
                    for (pe = Ie.length - 1; pe >= 0; --pe) {
                      xe = Ie[pe].style.getPropertyValue("width");
                      var De = parseInt(xe);
                      if (xe && (isNaN(De) || De > 0)) {
                        I.style.width = xe;
                        break;
                      }
                    }
                }
                1 !== T ||
                  xe ||
                  (I.style.width = cachedElementBoundingRect(b).width + "px");
              }
              ee || c(I, ye);
            }
            if ("table" === $) S || (S = 1);
            else if ("img" === $) {
              var Ce;
              if ((Ce = lazyLoadingImageURLForElement(I, b.className))) {
                I.setAttribute("src", Ce);
                var Re = !!I.closest("figure");
                if (!Re) {
                  var Le = attributesForElement(b),
                    Me = Le.length;
                  for (pe = 0; pe < Me; ++pe)
                    if (p.test(Le[pe].nodeName)) {
                      Re = !0;
                      break;
                    }
                }
                (Re && I.classList.add("protected"), (Z = !0));
              }
              ((!Ce && I.hasAttribute("src")) ||
                !b.hasAttribute("data-srcset") ||
                I.setAttribute("srcset", b.getAttribute("data-srcset")),
                I.removeAttribute("border"),
                I.removeAttribute("hspace"),
                I.removeAttribute("vspace"));
              var _e = I.getAttribute("align");
              if (
                (I.removeAttribute("align"),
                ("left" !== _e && "right" !== _e) ||
                  (I.classList.add("float"), I.classList.add(_e)),
                !T && !Z)
              ) {
                var we,
                  Fe = (we = cachedElementBoundingRect(b)).width,
                  Oe = we.height;
                hasClassMatchingRegexp(b, ProgressiveLoadingRegex) &&
                b.nextElementSibling &&
                "img" === normalizedElementTagName(b.nextElementSibling)
                  ? (K = I)
                  : imageIsContainedByContainerWithImageAsBackgroundImage(b)
                    ? I.classList.add("protected")
                    : (1 === Fe && 1 === Oe) ||
                        (U &&
                          Oe < MinimumHeightForImagesAboveTheArticleTitle &&
                          we.bottom < U.top)
                      ? (K = I)
                      : Fe < ImageSizeTiny &&
                        Oe < ImageSizeTiny &&
                        I.setAttribute("class", "reader-image-tiny");
              }
              if (n === CleaningType.MetadataContent)
                ((we = cachedElementBoundingRect(b)).width >
                  MaximumWidthOrHeightOfImageInMetadataSection ||
                  we.height > MaximumWidthOrHeightOfImageInMetadataSection) &&
                  (K = I);
              if (b.classList.contains("emoji")) {
                let e = urlFromString(I.src);
                if (
                  e &&
                  "s.w.org" === e.hostname &&
                  e.pathname.startsWith("/images/core/emoji/")
                ) {
                  let e = this.replaceImageWithAltText(I);
                  e &&
                    (((I = e).originalElement = b),
                    ($ = normalizedElementTagName(I)),
                    (K = I),
                    I.classList.add("protected"));
                }
              }
            } else if ("font" === $)
              (I.removeAttribute("size"),
                I.removeAttribute("face"),
                I.removeAttribute("color"));
            else if ("a" === $ && I.parentNode) {
              let e, t;
              I instanceof HTMLAnchorElement
                ? ((e = I.getAttribute("href")), (t = HTMLAnchorElement))
                : I instanceof SVGAElement &&
                  ((e = I.getAttribute("xlink:href")), (t = SVGAElement));
              let i = I.originalElement.ownerDocument.location,
                r = urlStringShouldHaveItsAnchorMadeNonFunctional(e, i);
              if (
                t === HTMLAnchorElement &&
                "author" === b.getAttribute("itemprop")
              )
                I.classList.add("protected");
              else if (e && e.length && ("#" === e[0] || r)) {
                const e = new Set(["li", "sup"]);
                if (
                  !S &&
                  !I.childElementCount &&
                  1 === I.parentElement.childElementCount &&
                  !e.has(normalizedElementTagName(I.parentElement))
                )
                  this.contentDocument.evaluate(
                    "text()",
                    I.parentElement,
                    null,
                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                    null,
                  ).snapshotLength || (K = I);
                if (!K) {
                  ce = this.contentDocument.createElement("span");
                  if (
                    1 === I.childElementCount &&
                    "img" === normalizedElementTagName(I.firstElementChild)
                  ) {
                    var Be = I.firstElementChild;
                    Be.width > AnchorImageMinimumWidth &&
                      Be.height > AnchorImageMinimumHeight &&
                      ce.setAttribute("class", "converted-image-anchor");
                  }
                  for (
                    ce.className ||
                    ce.setAttribute("class", "converted-anchor");
                    I.firstChild;
                  )
                    ce.appendChild(I.firstChild);
                  (I.parentNode.replaceChild(ce, I),
                    ((I = ce).originalElement = b));
                }
              } else if (AdvertisementHostRegex.test(I.host) && !I.innerText)
                K = I;
              else if (
                n !== CleaningType.MetadataContent &&
                C &&
                !L &&
                C.compareDocumentPosition(b) &
                  document.DOCUMENT_POSITION_PRECEDING &&
                cachedElementBoundingRect(b).top <
                  cachedElementBoundingRect(C).top
              )
                Y.push(I);
              else {
                var Pe = b.children;
                1 === Pe.length &&
                  "img" === normalizedElementTagName(Pe[0]) &&
                  !b.innerText &&
                  anchorLooksLikeDownloadFlashLink(b) &&
                  (K = I);
              }
              r && (I.removeAttribute("xlink:href"), I.removeAttribute("href"));
            } else if (
              "aside" === $ ||
              "blockquote" === $ ||
              "q" === $ ||
              ("div" === $ && V.test(b.className))
            ) {
              ((Se = dominantFontFamilyAndSizeForElement(b)),
                (ye = dominantFontSizeInPointsFromFontFamilyAndSizeString(Se)));
              ee || c(I, ye);
            } else if ("cite" === $) {
              var ke = pseudoElementContent(b, ":after") ?? "",
                qe = document.createElement("span");
              ((qe.innerText = ke), I.after(qe));
            } else
              "pre" === $
                ? (I.style.whiteSpace = J.whiteSpace)
                : "source" === $ && b.hasAttribute("data-srcset")
                  ? (I.setAttribute("srcset", b.getAttribute("data-srcset")),
                    I.classList.add("protected"))
                  : I instanceof SVGAnimateElement &&
                    "xlink:href" === I.attributes.attributeName.value &&
                    (K = I);
          }
          if (J && M && !Z) {
            var Ue =
              "none" === J.display ||
              "visible" !== J.visibility ||
              computedStyleIndicatesElementIsInvisibleDueToClipping(J);
            if (
              (Ue ||
                "img" === $ ||
                (Ue =
                  "0" === J.opacity &&
                  "absolute" === J.position &&
                  !I.closest("figure")),
              Ue && !y)
            )
              (!!B && v === B.depth && selectorForElement(b) === B.selector) ||
                z(b, e) ||
                (K = I);
          }
          if (
            (!K && elementIsCommentBlock(b) && (K = I),
            !K &&
              U &&
              cachedElementBoundingRect(b).top < U.top &&
              VeryLiberalCommentRegex.test(b.className) &&
              I.parentElement &&
              (K = I),
            !K && "a" === $ && k.has(b.href))
          ) {
            for (
              var ze, We, He = b, Ve = I;
              (He = He.parentElement) && (Ve = Ve.parentElement);
            ) {
              const t = 10;
              if (
                cachedElementBoundingRect(He).top -
                  cachedElementBoundingRect(b).top >
                t
              )
                break;
              if (He === e) break;
              o(He) && ((ze = He), (We = Ve));
            }
            (ze &&
              ((K = We),
              (b = ze),
              ((I = We).originalElement = b),
              ($ = normalizedElementTagName(I))),
              (He = null),
              (Ve = null),
              (ze = null),
              (We = null));
          }
        } catch (e) {
          K = I;
        }
        if (
          (!K || K.parentElement || i || (K = null),
          "div" === $ ? Q.push(I) : "aside" === $ && X.push(I),
          !K)
        ) {
          let e = this._weakMapOfOriginalElementToUniqueID.get(
            I.originalElement,
          );
          (e || (e = this._nextUniqueID()),
            this._mapOfUniqueIDToOriginalElement.set(e, I.originalElement),
            I.setAttribute(READER_UNIQUE_ID_ATTRIBUTE_KEY, e),
            this._weakMapOfOriginalElementToUniqueID.set(I.originalElement, e));
        }
        var je = K ? null : b.firstElementChild;
        if (je) ((b = je), (I = I.firstElementChild), r(1));
        else {
          for (var Ye; b !== e && !(Ye = b.nextElementSibling); )
            ((b = b.parentElement), (I = I.parentElement), r(-1));
          if (b === e) {
            if (K && !elementIsProtected(K))
              if (K.parentElement) K.remove();
              else if (i) return null;
            break;
          }
          ((b = Ye), (I = I.nextElementSibling), a());
        }
        if (K && !elementIsProtected(K))
          if (K.parentElement) K.remove();
          else if (i) return null;
      }
      for (let e of t.querySelectorAll("iframe")) {
        if (elementLooksLikeEmbeddedTweet(e.originalElement))
          (Ge = this.adoptableSimpleTweetFromTwitterElement(e)) &&
            e.parentElement.replaceChild(Ge, e);
        (e.classList.add("protected"),
          e.setAttribute("sandbox", "allow-scripts allow-same-origin"));
      }
      for (let e of t.querySelectorAll("twitter-widget")) {
        var Ge;
        if (elementLooksLikeEmbeddedTweet(e.originalElement))
          (Ge = this.adoptableSimpleTweetFromTwitterElement(e)) &&
            e.parentElement.replaceChild(Ge, e);
        e.classList.add("protected");
      }
      const Qe = t.querySelectorAll("blockquote"),
        Xe = Qe.length;
      for (pe = 0; pe < Xe; ++pe) {
        const e = Qe[pe],
          t = e.originalElement;
        t && this.convertBlockquoteTweetToSimpleTweetIfAppropriate(e, t);
      }
      for (pe = E.length - 1; pe >= 0; --pe) {
        ((vt = E[pe]).parentNode &&
          this.shouldPruneElement(vt, vt.originalElement, W) &&
          vt.remove(),
          delete vt._originalElementDepthInCollapsedArea);
      }
      var Je = Y.length;
      for (pe = 0; pe < Je; ++pe) Y[pe].remove();
      var Ke = t.querySelectorAll(".float");
      for (pe = 0; pe < Ke.length; ++pe) {
        var $e = !1,
          Ze = Ke[pe];
        if (!$e) {
          var et = Ze.querySelectorAll("a, span.converted-image-anchor"),
            tt = Ze.querySelectorAll("span.converted-anchor");
          $e = Ze.parentNode && tt.length > et.length;
        }
        if (!$e) {
          var nt = Ze.querySelectorAll("embed, object").length,
            it = Ze.originalElement.querySelectorAll("embed, object").length;
          !nt && it && ($e = !0);
        }
        if (!$e) {
          for (
            var rt = Ze.originalElement.getElementsByTagName("img"),
              at = rt.length,
              lt = 0,
              ot = 0;
            ot < at && (M && isElementVisible(rt[ot]) && lt++, !(lt > 1));
            ++ot
          );
          if (1 === lt) Ze.getElementsByTagName("img").length || ($e = !0);
        }
        if (!$e) {
          const e = "img, video, embed, iframe, object, svg";
          /\S/.test(Ze.innerText) ||
            Ze.matches(e) ||
            Ze.querySelector(e) ||
            ($e = !0);
        }
        $e && !elementIsProtected(Ze) && Ze.remove();
      }
      var st = t.querySelectorAll("br");
      for (pe = st.length - 1; pe >= 0; --pe) {
        var ct = st[pe];
        ct.originalElement &&
          "block" ===
            getComputedStyle(ct.originalElement.parentElement).display &&
          (m(ct, "nextSibling") || m(ct, "previousSibling")) &&
          ct.remove();
      }
      if (
        i &&
        !removeWhitespace(t.innerText).length &&
        (n !== CleaningType.LeadingMedia ||
          !t.querySelector("video, iframe, img"))
      )
        return null;
      var mt = {},
        dt = (et = t.querySelectorAll("a")).length;
      for (pe = 0; pe < dt; ++pe) {
        (mt[(ht = (ft = et[pe]).style.fontWeight)] || (mt[ht] = []),
          mt[ht].push(ft));
      }
      for (var ht in mt) {
        var ut = mt[ht],
          gt = ut.length;
        if (gt > 0.7 * dt)
          for (pe = 0; pe < gt; ++pe) {
            var ft;
            (((ft = ut[pe]).style.fontWeight = null),
              ft.getAttribute("style") || ft.removeAttribute("style"));
          }
      }
      var pt = t.querySelectorAll(".protected"),
        Et = pt.length;
      for (pe = 0; pe < Et; ++pe) {
        var vt;
        ((vt = pt[pe]).classList.remove("protected"),
          vt.classList.length || vt.removeAttribute("class"));
      }
      var Tt = t.querySelectorAll("p.auxiliary"),
        St = Tt.length;
      for (pe = 0; pe < St; ++pe) {
        for (
          var At = Tt[pe], Nt = [At], yt = At.nextElementSibling;
          yt &&
          "p" === normalizedElementTagName(yt) &&
          yt.classList.contains("auxiliary");
        )
          (Nt.push(yt), (yt = yt.nextElementSibling));
        var bt = Nt.length;
        if (bt > 1) {
          for (ot = 0; ot < bt; ++ot) {
            var xt = Nt[ot];
            (xt.classList.remove("auxiliary"),
              xt.style && (xt.style.width = null),
              cleanStyleAndClassList(xt));
          }
          pe += bt - 1;
        }
      }
      for (pe = Q.length - 1; pe >= 0; --pe) {
        var It = Q[pe];
        It !== t &&
          elementWouldAppearBetterAsFigureOrAuxiliary(It.originalElement, It) &&
          changeElementType(It, "figure");
      }
      for (pe = X.length - 1; pe >= 0; --pe) {
        var Dt = X[pe];
        Dt !== t &&
          elementWouldAppearBetterAsFigureOrAuxiliary(Dt.originalElement, Dt) &&
          Dt.classList.add("auxiliary");
      }
      var Ct = j.length;
      for (pe = 0; pe < Ct; ++pe) {
        var Rt = j[pe],
          Lt = Rt.parentElementBeforePruning,
          Mt = null,
          _t = null;
        if (Lt)
          ((Mt = depthOfElementWithinElement(Lt, t)),
            (_t = selectorForElement(Lt)));
        var wt = Lt ? Lt.closest("ul") : null;
        if (wt) wt.remove();
        else {
          const e = 40;
          Lt &&
          cachedElementBoundingRect(Lt.originalElement).height < e &&
          (!B || B.selector !== _t || B.depth !== Mt)
            ? Lt.remove()
            : Rt.remove();
        }
      }
      var Ft = G.length;
      for (pe = 0; pe < Ft; ++pe) {
        var Ot = G[pe],
          Bt = this.contentDocument.createElement("div");
        ((Bt.innerHTML = Ot.dataset ? Ot.dataset.mathml : ""),
          Ot.parentNode.replaceChild(Bt, Ot));
      }
      return t;
    },
    convertBlockquoteTweetToSimpleTweetIfAppropriate: function (e, t) {
      const n = t.classList;
      if (!n.contains("twitter-tweet") && !n.contains("twitter-video")) return;
      const i = t.getElementsByTagName("a"),
        r = i.length;
      if (r < 1) return;
      const a = i[r - 1];
      if ("twitter.com" !== a.host) return;
      const l = lastPathComponentFromAnchor(a);
      if (isNaN(parseInt(l))) return;
      const o = this.contentDocument.createElement("div");
      (o.setAttribute("data-reader-tweet-id", l),
        o.classList.add("tweet-wrapper"),
        e.parentElement.replaceChild(o, e),
        e.classList.add("simple-tweet"),
        o.appendChild(e));
    },
    adoptableSimpleTweetFromTwitterElement: function (e) {
      var t = function (e) {
        var t = this.contentDocument.createElement("div"),
          n = this.contentDocument.createTextNode(e);
        return (t.appendChild(n), t.innerHTML);
      }.bind(this);
      let n = null,
        i = e.originalElement;
      if (
        ("iframe" === normalizedElementTagName(e)
          ? (n = i.contentDocument ? i.contentDocument.documentElement : null)
          : "twitter-widget" === normalizedElementTagName(e) &&
            (n = i.shadowRoot),
        !n)
      )
        return null;
      var r =
        n.querySelector("[data-tweet-id].expanded") ||
        n.querySelector("[data-tweet-id]");
      if (!r) return null;
      var a = this.contentDocument.createElement("div");
      a.classList.add("tweet-wrapper");
      var l = this.contentDocument.createElement("blockquote");
      (l.classList.add("simple-tweet"), a.appendChild(l));
      var o = r.getAttribute("data-tweet-id");
      a.setAttribute("data-reader-tweet-id", o);
      var s = r.querySelector(".dateline"),
        c = r.querySelector('[data-scribe="element:screen_name"]'),
        m = r.querySelector('[data-scribe="element:name"]'),
        d = r.querySelector(".e-entry-title");
      if (!(s && c && m && d)) return a;
      var h = "&mdash; " + t(m.innerText) + " (" + t(c.innerText) + ")",
        u = this.contentDocument.createElement("p");
      ((u.innerHTML = d.innerHTML),
        l.appendChild(u),
        l.insertAdjacentHTML("beforeend", h));
      var g = this.contentDocument.createElement("span");
      ((g.innerHTML = s.innerHTML), l.appendChild(g));
      for (let e of l.querySelectorAll("img.twitter-emoji"))
        this.replaceImageWithAltText(e);
      for (
        var f = l.getElementsByTagName("*"), p = f.length, E = 0;
        E < p;
        ++E
      ) {
        e = f[E];
        "script" === normalizedElementTagName(e)
          ? e.remove()
          : sanitizeElementByRemovingAttributes(e);
      }
      return a;
    },
    replaceImageWithAltText: function (e) {
      var t = e.getAttribute("alt");
      if (!t || t.length < 1) return null;
      let n = this.contentDocument.createElement("span");
      return ((n.innerText = t), e.parentNode.replaceChild(n, e), n);
    },
    leadingVideoNode: function () {
      var e = this.leadingContentNodeWithSelector("video, iframe");
      return e &&
        e.parentElement &&
        !e.previousElementSibling &&
        !e.nextElementSibling
        ? e.parentElement
        : null;
    },
    leadingImageNode: function () {
      return this.leadingContentNodeWithSelector("figure img, img");
    },
    ancestorsOfElement: function (e) {
      let t = [],
        n = e.parentNode;
      for (; n; ) (t.push(n), (n = n.parentNode));
      return t;
    },
    leadingContentNodeWithSelector: function (e) {
      const t = 250,
        n = 0.5,
        i = 0.9,
        r = 3;
      if (!this.article || !this.article.element) return null;
      let a = 0;
      if (this._articleTitleElement) {
        let e,
          t = this.ancestorsOfElement(this.article.element);
        for (let n of t)
          if (n.contains(this._articleTitleElement)) {
            e = n;
            break;
          }
        a = t.length - this.ancestorsOfElement(e).length + 2;
      }
      let l = Math.max(r, a);
      for (var o = this.article.element, s = 0; s < l && o.parentNode; ++s) {
        var c = (o = o.parentNode).querySelectorAll(e);
        for (var m of c)
          if (m && isElementVisible(m)) {
            var d = cachedElementBoundingRect(m);
            if (!(d.width >= window.innerWidth * i) && d.height < t) continue;
            if (d.width < this._articleWidth * n) continue;
            var h = this.article.element.compareDocumentPosition(m);
            if (
              !(h & Node.DOCUMENT_POSITION_PRECEDING) ||
              h & Node.DOCUMENT_POSITION_CONTAINED_BY
            )
              continue;
            var u = this.extraArticle ? this.extraArticle.element : null;
            if (
              u &&
              this.article.element.compareDocumentPosition(u) &
                Node.DOCUMENT_POSITION_FOLLOWING &&
              (h = u.compareDocumentPosition(m)) &&
              (!(h & Node.DOCUMENT_POSITION_PRECEDING) ||
                h & Node.DOCUMENT_POSITION_CONTAINED_BY)
            )
              continue;
            return m;
          }
      }
      return null;
    },
    pageImageURLFromMetadata: function (e) {
      var t = e["property:og:image"];
      if (
        (t || (t = e["property:twitter:image"]),
        t || (t = e["property:twitter:image:src"]),
        t)
      ) {
        let e = urlFromString(t);
        if (e) {
          let n = e.href;
          n && urlIsHTTPFamilyProtocol(e) && (t = n);
        }
      }
      return t;
    },
    mainImageNode: function () {
      var e = this.leadingImageNode();
      if (e) return e;
      if (this.article && this.article.element)
        for (
          var t = this.article.element.querySelectorAll("img"),
            n = t.length,
            i = 0;
          i < n;
          ++i
        ) {
          var r = t[i],
            a = r._cachedElementBoundingRect;
          if (
            (a || (a = r.getBoundingClientRect()),
            a.width >= MainImageMinimumWidthAndHeight &&
              a.height >= MainImageMinimumWidthAndHeight)
          )
            return r;
        }
      return null;
    },
    schemaDotOrgMetadataObjectForArticle: function () {
      if (this._schemaDotOrgMetadataObjectForArticle)
        return this._schemaDotOrgMetadataObjectForArticle;
      const e = new Set([
        "Article",
        "NewsArticle",
        "Report",
        "ScholarlyArticle",
        "SocialMediaPosting",
        "BlogPosting",
        "LiveBlogPosting",
        "DiscussionForumPosting",
        "TechArticle",
        "APIReference",
      ]);
      var t = this.contentDocument.querySelectorAll(
          "script[type='application/ld+json']",
        ),
        n = t.length;
      try {
        for (var i = 0; i < n; ++i) {
          var r = t[i],
            a = JSON.parse(r.textContent),
            l = a["@context"];
          if ("https://schema.org" === l || "http://schema.org" === l) {
            var o = a["@type"];
            if (e.has(o))
              return ((this._schemaDotOrgMetadataObjectForArticle = a), a);
          }
        }
        return null;
      } catch (e) {
        return null;
      }
    },
    articleTitle: function () {
      var e = this.articleTitleInformation();
      return e ? e.titleText : "";
    },
    articleTitleInformation: function () {
      function e(e, t) {
        var n = e ? t.indexOf(e) : -1;
        return -1 !== n && (0 === n || n + e.length === t.length);
      }
      function t(e, t) {
        return (
          e.host === t.host && e.pathname === t.pathname && e.hash === t.hash
        );
      }
      function n(e) {
        let t =
          nearestAncestorElementWithTagName(e, "a") || e.querySelector("a");
        return t
          ? urlStringShouldHaveItsAnchorMadeNonFunctional(
              t.href,
              t.ownerDocument.location,
            )
            ? null
            : t
          : null;
      }
      if (!this.articleNode()) return;
      if (this._articleTitleInformation) return this._articleTitleInformation;
      const i =
          /((article|post).*title|headline|instapaper_title|inside-head)/i,
        r = 600,
        a = 20,
        l = 8,
        o = 1.1,
        s = 1.25,
        c = /header|title|headline|instapaper_title/i,
        m = 1.5,
        d = 1.8,
        h = 1.5,
        u = 0.6,
        g = 3,
        f = 1.5,
        p = 0.8,
        E = 0.8,
        v = 9,
        T = 1.5,
        S = /byline|author/i;
      var A = function (e, t) {
          var n = this.contentFromUniqueMetadataSelector(e, t);
          if (n) {
            var i = this.articleTitleAndSiteNameFromTitleString(n);
            i && (n = i.articleTitle);
          }
          return n;
        }.bind(this),
        N = function () {
          for (var e = this.articleNode(); e; e = e.parentElement)
            if (elementIndicatesItIsASchemaDotOrgArticleContainer(e)) return e;
          return null;
        }.bind(this)(),
        y = N
          ? this.contentFromUniqueMetadataSelector(N, "meta[itemprop=headline]")
          : "",
        b = N
          ? this.contentFromUniqueMetadataSelector(
              N,
              "meta[itemprop=alternativeHeadline]",
            )
          : "",
        x = this.contentDocument,
        I = x.location,
        D = x.title,
        C = A(x, "meta[property='og:title']"),
        R = this.contentFromUniqueMetadataSelector(
          x,
          "meta[property='og:site_name']",
        ),
        L = A(x, "meta[name='twitter:title']"),
        M = A(x, "meta[name='sailthru.headline']"),
        _ = this.schemaDotOrgMetadataObjectForArticle(),
        w = _ ? _.headline : null,
        F = this.articleNode(),
        O = cachedElementBoundingRect(F);
      this.extraArticleNode() &&
        this.extraArticle.isPrepended &&
        (O = cachedElementBoundingRect(this.extraArticleNode()));
      var B = O.left + O.width / 2,
        P = O.top,
        k = P;
      ((this._articleWidth = O.width),
      (this._leadingMediaElement = this.leadingImageNode()),
      this._leadingMediaElement ||
        (this._leadingMediaElement = this.leadingVideoNode()),
      this._leadingMediaElement) &&
        (k =
          (cachedElementBoundingRect(this._leadingMediaElement).top + P) / 2);
      var q = "h1, h2, h3, h4, h5, a:not(svg a), p, div, span",
        U = normalizedElementTagName(this.article.element);
      ("dl" !== U && "dd" !== U) || (q += ", dt");
      for (
        var z = [], W = x.querySelectorAll(q), H = W.length, V = 0;
        V < H;
        ++V
      ) {
        var j = W[V],
          Y = normalizedElementTagName(j);
        if ("a" === Y)
          j.innerText === C &&
            t(j, I) &&
            (j.previousElementSibling || j.nextElementSibling
              ? z.push(j)
              : z.push(j.parentElement));
        else if ("div" === Y || "span" === Y || "p" === Y) {
          if (hasClassMatchingRegexp(j, i) || i.test(j.getAttribute("id"))) {
            var G = j.parentElement;
            elementIsAHeader(G) || z.push(j);
          }
        } else z.push(j);
      }
      z = Array.prototype.slice.call(z, 0);
      const Q = 2;
      var X = this.article.element;
      for (V = 0; V < Q; ++V) X.parentElement && (X = X.parentElement);
      for (
        var J, K = X.querySelectorAll("a:not(svg a)"), $ = ((V = 0), K.length);
        V < $;
        ++V
      ) {
        var Z = K[V];
        if (Z.offsetTop > F.offsetTop + a) break;
        if (t(Z, I) && "#" !== Z.getAttribute("href")) {
          z.push(Z);
          break;
        }
      }
      var ee = z.map(trimmedInnerTextIgnoringTextTransform),
        te = z.length,
        ne = 0,
        ie = [],
        re = [],
        ae = [],
        le = [],
        oe = [],
        se = [],
        ce = [];
      const me = {},
        de = (e) => {
          const t = me[e];
          if (t) return t;
          const n = stringSimilarity(D, e);
          return ((me[e] = n), n);
        };
      for (V = 0; V < te; ++V) {
        var he = z[V],
          ue = ee[V];
        const e = {},
          t = (t) => {
            const n = e[t];
            if (n) return n;
            const i = stringSimilarity(ue, t);
            return ((e[t] = i), i);
          };
        let n = de(ue);
        if (C) {
          const e = t(C);
          ((n += e),
            e > StringSimilarityToDeclareStringsNearlyIdentical && re.push(he));
        }
        if (L) {
          const e = t(L);
          ((n += e),
            e > StringSimilarityToDeclareStringsNearlyIdentical && ae.push(he));
        }
        if (y) {
          const e = t(y);
          ((n += e),
            e > StringSimilarityToDeclareStringsNearlyIdentical && le.push(he));
        }
        if (b) {
          const e = t(b);
          ((n += e),
            e > StringSimilarityToDeclareStringsNearlyIdentical && oe.push(he));
        }
        if (M) {
          const e = t(M);
          ((n += e),
            e > StringSimilarityToDeclareStringsNearlyIdentical && se.push(he));
        }
        if (w) {
          const e = t(w);
          ((n += e),
            e > StringSimilarityToDeclareStringsNearlyIdentical && ce.push(he));
        }
        n === ne ? ie.push(he) : n > ne && ((ne = n), (ie = [he]));
      }
      let ge = [];
      for (let e of z) {
        let t = e.nextElementSibling;
        t && SubheadRegex.test(t.className) && ge.push(e);
      }
      if (
        (1 === re.length
          ? ((J = re[0]).headerText = trimmedInnerTextIgnoringTextTransform(J))
          : 1 === ae.length
            ? ((J = ae[0]).headerText =
                trimmedInnerTextIgnoringTextTransform(J))
            : 1 === le.length
              ? ((J = le[0]).headerText =
                  trimmedInnerTextIgnoringTextTransform(J))
              : 1 === se.length
                ? ((J = se[0]).headerText =
                    trimmedInnerTextIgnoringTextTransform(J))
                : 1 === ce.length &&
                  ((J = ce[0]).headerText =
                    trimmedInnerTextIgnoringTextTransform(J)),
        !J)
      )
        for (V = 0; V < te; ++V) {
          he = z[V];
          if (!isElementVisible(he)) continue;
          var fe = cachedElementBoundingRect(he),
            pe = fe.left + fe.width / 2,
            Ee = pe - B,
            ve = fe.top + fe.height / 2 - k,
            Te = -1 !== re.indexOf(he),
            Se = -1 !== ae.indexOf(he),
            Ae = he.classList.contains("instapaper_title"),
            Ne = /\bheadline\b/.test(he.getAttribute("itemprop")),
            ye = -1 !== le.indexOf(he),
            be = -1 !== oe.indexOf(he),
            xe = -1 !== se.indexOf(he),
            Ie = -1 !== ce.indexOf(he);
          let t = ge.includes(he) && ve < 0;
          var De = Te || Se || Ae || Ne || ye || be || xe || Ie || t,
            Ce = Math.sqrt(Ee * Ee + ve * ve),
            Re = De ? r : Math.max(r - Ce, 0),
            Le = ((ue = ee[V]), he.getAttribute("property"));
          if (Le) {
            var Me = /dc.title/i.exec(Le);
            if (Me && Me[0])
              if (
                1 ===
                this.contentDocument.querySelectorAll(
                  '*[property~="' + Me[0] + '"]',
                ).length
              ) {
                (J = he).headerText = ue;
                break;
              }
          }
          if (!S.test(he.className)) {
            if (!De) {
              if (Ce > r) continue;
              if (pe < O.left || pe > O.right) continue;
            }
            if (D && stringsAreNearlyIdentical(ue, D)) Re *= g;
            else if (e(ue, D)) Re *= f;
            else if (ue.length < l) continue;
            if (ue !== R || !C) {
              var _e = !1;
              if ((ze = n(he))) {
                if ("author" === ze.getAttribute("rel")) continue;
                var we = ze.host === I.host,
                  Fe = ze.pathname === I.pathname;
                if (we && Fe) Re *= h;
                else {
                  if (we && nearestAncestorElementWithTagName(he, "li"))
                    continue;
                  ((Re *= u), (_e = !0));
                }
              }
              var Oe = fontSizeFromComputedStyle(getComputedStyle(he));
              (_e || (Re *= Oe / BaseFontSize),
                (Re *=
                  1 + TitleCandidateDepthScoreMultiplier * elementDepth(he)));
              var Be = parseInt(this.contentTextStyle().fontSize);
              (parseInt(Oe) > Be * o && (Re *= s),
                (c.test(he.className) || c.test(he.getAttribute("id"))) &&
                  (Re *= m));
              var Pe = he.parentElement;
              (Pe &&
                (c.test(Pe.className) || c.test(Pe.getAttribute("id"))) &&
                (Re *= m),
                -1 !== ie.indexOf(he) && (Re *= d));
              F = this.article.element;
              for (var ke = he; ke && ke !== F; ke = ke.parentElement)
                if (SidebarRegex.test(ke.className)) {
                  Re *= p;
                  break;
                }
              (he.closest("li") && (Re *= E),
                (!J || Re > J.headerScore) &&
                  (((J = he).headerScore = Re), (J.headerText = ue)));
            }
          }
        }
      var qe;
      if (
        (J &&
          domDistance(J, F, v + 1) > v &&
          parseInt(getComputedStyle(J).fontSize) < T * Be &&
          (J = null),
        J)
      ) {
        this._articleTitleElement = J;
        var Ue = J.headerText.trim();
        qe = C && e(C, Ue) ? C : D && e(D, Ue) ? D : Ue;
      }
      (this._leadingMediaElement ||
        (this._leadingMediaElement = this.leadingImageNode()),
        this._leadingMediaElement ||
          (this._leadingMediaElement = this.leadingVideoNode()),
        qe || (qe = C && e(C, D) ? C : D));
      var ze,
        We = null,
        He = !1,
        Ve = !1;
      J &&
        (ze = n(J)) &&
        ((We = ze.href),
        (He = "_blank" === ze.getAttribute("target")),
        (Ve = ze.host !== I.host || ze.pathname !== I.pathname));
      let je = {
        titleText: qe,
        linkURL: We,
        linkIsTargetBlank: He,
        linkIsForExternalPage: Ve,
      };
      return (
        this._articleTitleElement &&
          (this._mapOfUniqueIDToOriginalElement.set(READER_UNIQUE_ID_TITLE, J),
          this._weakMapOfOriginalElementToUniqueID.set(
            J,
            READER_UNIQUE_ID_TITLE,
          )),
        (this._articleTitleInformation = je),
        je
      );
    },
    contentFromUniqueMetadataSelector: function (e, t) {
      var n = e.querySelectorAll(t);
      if (1 !== n.length) return null;
      var i = n[0];
      return i
        ? this.elementAttributesContainImproperQuote(i)
          ? null
          : i.content
        : null;
    },
    elementAttributesContainImproperQuote: function (e) {
      for (var t = attributesForElement(e), n = t.length, i = 0; i < n; ++i)
        if (/['"]/.test(t[i].name)) return !0;
      return !1;
    },
    articleSubhead: function () {
      function e(e) {
        return elementIsAHeader(e)
          ? parseInt(/h(\d)?/.exec(normalizedElementTagName(e))[1])
          : NaN;
      }
      function t(e) {
        if (!e) return null;
        var t = e.content;
        return t ? t.trim() : null;
      }
      const n = /author|kicker/i;
      if (this._articleSubhead) return this._articleSubhead;
      var i = this.articleNode();
      if (!i) return;
      var r = this._articleTitleElement;
      if (!r) return;
      var a = this.contentDocument,
        l = a.location,
        o = e(r),
        s = cachedElementBoundingRect(r),
        c = new Set(),
        m = t(a.querySelector("meta[property='og:description']"));
      m && c.add(m);
      var d = t(a.querySelector("meta[name=description]"));
      d && c.add(d);
      var h,
        u = this.schemaDotOrgMetadataObjectForArticle();
      if (u) {
        var g = u.description;
        g && "string" == typeof g && c.add(g.trim());
      }
      var f = this.contentFromUniqueMetadataSelector(
        a,
        "head meta.swiftype[name=dek]",
      );
      f && (h = f);
      let p = [],
        E = nextNonFloatingVisibleElementSibling(r);
      E && p.push(E);
      let v = nextLeafElementForElement(r);
      if (
        (v &&
          r &&
          r.contains(v) &&
          v.innerText &&
          v.innerText.trim() === r.innerText.trim() &&
          (v = nextLeafElementForElement(v)),
        v && p.push(v),
        c.size)
      )
        for (
          var T = a.querySelectorAll(
              HeaderElementsSelector + ", *[itemprop=description]",
            ),
            S = T.length,
            A = 0;
          A < S;
          ++A
        ) {
          var N = T[A];
          c.has(N.innerText.trim()) && p.push(N);
        }
      var y = p.length;
      for (A = 0; A < y; ++A) {
        var b = p[A];
        if (b && b !== i) {
          var x = b.className;
          if (!n.test(x)) {
            var I = b.closest("a");
            if (I) {
              var D = I.host === l.host,
                C = I.pathname === l.pathname;
              if (!D || !C) continue;
            }
            var R = !1;
            if (elementIsAHeader(b))
              if (isNaN(o)) R = !0;
              else e(b) - 1 === o && (R = !0);
            if ((!R && SubheadRegex.test(x) && (R = !0), !R)) {
              const e = b.getAttribute("itemprop");
              /\bdescription\b/.test(e) &&
                !/\barticleBody\b/.test(e) &&
                (R = !0);
            }
            if (
              (!R && c.has(b.innerText) && (R = !0),
              !R && h && h === b.innerText && (R = !0),
              R || "summary" !== b.getAttribute("itemprop") || (R = !0),
              R)
            ) {
              var L;
              if ("meta" === normalizedElementTagName(b)) {
                var M = b.getAttribute("content");
                L = M ? M.trim() : "";
                var _ = b.nextElementSibling;
                if (!_ || trimmedInnerTextIgnoringTextTransform(_) !== L)
                  continue;
                b = _;
              } else {
                if (cachedElementBoundingRect(b).top < (s.bottom + s.top) / 2)
                  continue;
                L = trimmedInnerTextIgnoringTextTransform(b).trim();
              }
              if (L.length) {
                ((this._articleSubheadElement = b),
                  this._mapOfUniqueIDToOriginalElement.set(
                    READER_UNIQUE_ID_SUBHEAD,
                    b,
                  ),
                  this._weakMapOfOriginalElementToUniqueID.set(
                    b,
                    READER_UNIQUE_ID_SUBHEAD,
                  ),
                  (this._articleSubhead = L));
                break;
              }
            }
          }
        }
      }
      return this._articleSubhead;
    },
    adoptableMetadataBlock: function () {
      function e(e) {
        function t(e, i) {
          if (e.nodeType !== Node.TEXT_NODE) {
            if (e.nodeType === Node.ELEMENT_NODE) {
              var r = e.childNodes,
                a = r.length;
              0 !== a &&
                (1 !== a
                  ? (i !== n.Right && t(r[0], n.Left),
                    i !== n.Left && t(r[a - 1], n.Right))
                  : t(r[0], i));
            }
          } else
            i === n.Left
              ? (e.textContent = e.textContent.trimLeft())
              : i === n.Right
                ? (e.textContent = e.textContent.trimRight())
                : (e.textContent = e.textContent.trim());
        }
        const n = { Left: 1, Right: 2, Both: 3 };
        t(e);
      }
      this.updateArticleBylineAndDateElementsIfNecessary();
      var t = this.articleBylineElement(),
        n = this.articleDateElement();
      if (!t && !n) return null;
      if (t && n) {
        var i = t.compareDocumentPosition(n);
        (i & Node.DOCUMENT_POSITION_CONTAINS && (t = null),
          i & Node.DOCUMENT_POSITION_CONTAINED_BY && (n = null),
          t === n && (n = null));
      }
      var r,
        a = this.contentDocument.createElement("div"),
        l = !1,
        o = !1;
      t &&
        (e(
          (r = this.cleanArticleNode(
            t,
            t.cloneNode(!0),
            CleaningType.MetadataContent,
            !1,
          )),
        ),
        r.innerText.trim() && ((l = !0), r.classList.add("byline")));
      if (n) {
        var s = this.cleanArticleNode(
          n,
          n.cloneNode(!0),
          CleaningType.MetadataContent,
          !1,
        );
        (e(s), s.innerText.trim() && ((o = !0), s.classList.add("date")));
      }
      if ((l && a.appendChild(r), l && o)) {
        var c = document.createElement("span");
        (c.classList.add("delimiter"), a.appendChild(c));
      }
      return (o && a.appendChild(s), a);
    },
    articleBylineElement: function () {
      return this._articleBylineElement;
    },
    findArticleBylineElement: function () {
      var e = this.findArticleBylineElementWithoutRejection();
      return e &&
        ("footer" === normalizedElementTagName(e) || e.closest("figure"))
        ? null
        : e;
    },
    findArticleBylineElementWithoutRejection: function () {
      function e(e) {
        if (!e.length) return null;
        e = e.filter(isElementVisible);
        for (
          var t = new Set(), n = new Set(), r = e.length, o = 0;
          o < r - 1;
          ++o
        ) {
          var s = e[o],
            c = e[o + 1];
          if (isElementVisible(s) && isElementVisible(c)) {
            var m = s.parentElement;
            m === c.parentElement &&
              (m.contains(i) || (n.add(s.parentElement), t.add(s), t.add(c)));
          }
        }
        var d = new Set(e);
        (n.forEach(function (e) {
          d.add(e);
        }),
          t.forEach(function (e) {
            d.delete(e);
          }),
          (e = []),
          d.forEach(function (t) {
            e.push(t);
          }));
        var h,
          u = null;
        r = e.length;
        for (o = 0; o < r; ++o) {
          s = e[o];
          if (isElementVisible(s)) {
            var g = cachedElementBoundingRect(s),
              f = g.left + g.width / 2,
              p = g.top + g.height / 2,
              E = a - f,
              v = l - p,
              T = Math.sqrt(E * E + v * v);
            (!u || T < h) && ((u = s), (h = T));
          }
        }
        return u;
      }
      const t = "[itemprop~=author], a[rel='author']:not(svg a)",
        n =
          "#byline, .byline, .article-byline, .byline__author, .entry-meta, .author-name, .byline-dateline, .article-author, [itemprop~=author], a[rel='author']:not(svg a)";
      var i = this._articleSubheadElement || this._articleTitleElement;
      if (i)
        var r,
          a = (r = i ? cachedElementBoundingRect(i) : null).left + r.width / 2,
          l = r.top + r.height / 2;
      var o = this.contentFromUniqueMetadataSelector(
        this.contentDocument,
        "head meta[name=author]",
      );
      if (
        (o ||
          (o = this.contentFromUniqueMetadataSelector(
            this.contentDocument,
            "head meta[property=author]",
          )),
        !o)
      ) {
        var s = this.schemaDotOrgMetadataObjectForArticle();
        if (s) {
          var c = s.author;
          c && "object" == typeof c && (o = c.name);
        }
      }
      var m = this.article.element,
        d = m.querySelectorAll(n);
      if (1 === d.length) return d[0];
      var h = i ? i.nextElementSibling : null;
      if (h) {
        if ((h.matches(n) || h.innerText === o || (h = h.querySelector(n)), h))
          if (h.querySelector("li")) {
            var u = h.querySelector(n);
            u && (h = u);
          }
        if (h) return h;
      }
      for (
        var g = this.contentDocument.getElementsByTagName("a"),
          f = 0,
          p = g.length;
        f < p;
        ++f
      ) {
        var E = g[f];
        if (trimmedInnerTextIgnoringTextTransform(E) === o) return E;
      }
      var v = m.closest("article");
      if (i && v) {
        if ((S = e(Array.from(v.querySelectorAll(t))))) return S;
        if ((S = e(Array.from(v.querySelectorAll(n))))) return S;
      }
      var T = m.previousElementSibling;
      if (T) {
        var S;
        if ((S = e(Array.from(T.querySelectorAll(t))))) return S;
        if ((S = e(Array.from(T.querySelectorAll(n))))) return S;
      }
      return null;
    },
    articleDateElement: function () {
      return this._articleDateElement;
    },
    findArticleDateElement: function () {
      function e(e) {
        for (var t = e; t && t !== l; t = t.parentElement)
          if (elementIsCommentBlock(t) || elementLooksLikeACarousel(t))
            return !0;
        return !1;
      }
      function t(t) {
        for (var n, i = null, r = t.length, a = 0; a < r; ++a) {
          var l = t[a];
          if (isElementVisible(l) && !e(l)) {
            var o = cachedElementBoundingRect(l),
              s = o.left + o.width / 2,
              d = o.top + o.height / 2,
              h = c - s,
              u = m - d,
              g = Math.sqrt(h * h + u * u);
            (!i || g < n) && ((i = l), (n = g));
          }
        }
        return i;
      }
      const n = /date/i,
        i = "time, .dateline, .entry-date";
      var r,
        a = this._articleSubheadElement || this._articleTitleElement,
        l = this.article.element,
        o = a ? a.nextElementSibling : null;
      if (
        (o && 1 === (r = o.querySelectorAll(i)).length && (o = r[0]),
        !o ||
          o.matches(i) ||
          hasClassMatchingRegexp(o, n) ||
          o.querySelector(i) ||
          (o = null),
        o && o.contains(l) && (o = null),
        o)
      )
        return o;
      if (a)
        var s,
          c = (s = a ? cachedElementBoundingRect(a) : null).left + s.width / 2,
          m = s.top + s.height / 2;
      if ((r = l.querySelectorAll(i)).length) return t(r);
      if ((l = l.closest("article")) && (r = l.querySelectorAll(i)).length)
        return t(r);
      return null;
    },
    articleDateElementWithBylineElementHint: function (e) {
      function t(e) {
        return (
          /date/.test(e.className) ||
          /\bdatePublished\b/.test(e.getAttribute("itemprop"))
        );
      }
      var n = e.nextElementSibling;
      if (n && t(n)) return n;
      var i = nextLeafElementForElement(e);
      return i && t(i) ? i : null;
    },
    updateArticleBylineAndDateElementsIfNecessary: function () {
      this.article &&
        (this._didArticleBylineAndDateElementDetection ||
          (this.updateArticleBylineAndDateElements(),
          (this._didArticleBylineAndDateElementDetection = !0)));
    },
    updateArticleBylineAndDateElements: function () {
      var e = this.findArticleBylineElement(),
        t = this.findArticleDateElement();
      (!t && e && (t = this.articleDateElementWithBylineElementHint(e)),
        (this._articleDateElement = t),
        (this._articleBylineElement = e));
    },
    articleIsLTR: function () {
      if (!this._articleIsLTR) {
        var e = getComputedStyle(this.article.element);
        this._articleIsLTR = !e || "ltr" === e.direction;
      }
      return this._articleIsLTR;
    },
    findSuggestedCandidate: function () {
      var e,
        t,
        n = this.suggestedRouteToArticle;
      if (!n || !n.length) return null;
      for (
        t = n.length - 1;
        t >= 0 &&
        (!n[t].id || !(e = this.contentDocument.getElementById(n[t].id)));
        --t
      );
      for (t++, e || (e = this.contentDocument); t < n.length; ) {
        for (
          var i = n[t],
            r =
              e.nodeType === Node.DOCUMENT_NODE
                ? e.documentElement
                : e.firstElementChild,
            a = 1;
          r && a < i.index;
          r = r.nextElementSibling
        )
          this.shouldIgnoreInRouteComputation(r) || a++;
        if (!r) return null;
        if (normalizedElementTagName(r) !== normalizedElementTagName(i))
          return null;
        if (i.className && r.className !== i.className) return null;
        ((e = r), t++);
      }
      return isElementVisible(e)
        ? new CandidateElement(e, this.contentDocument)
        : null;
    },
    findArticleBySearchingAllElements: function (e) {
      var t = this.findSuggestedCandidate(),
        n = this.findCandidateElements();
      if (!n || !n.length) return t;
      if (t && t.basicScore() >= ReaderMinimumScore) return t;
      for (
        var i = this.highestScoringCandidateFromCandidates(n), r = i.element;
        r !== this.contentDocument;
        r = r.parentNode
      )
        if ("blockquote" === normalizedElementTagName(r)) {
          for (var a = r.parentNode, l = n.length, o = 0; o < l; ++o) {
            var s = n[o];
            if (s.element === a) {
              i = s;
              break;
            }
          }
          break;
        }
      if (t && i.finalScore() < ReaderMinimumScore) return t;
      if (!e) {
        if (i.shouldDisqualifyDueToScoreDensity()) return null;
        if (i.shouldDisqualifyDueToHorizontalRuleDensity()) return null;
        if (i.shouldDisqualifyDueToHeaderDensity()) return null;
        if (i.shouldDisqualifyDueToSimilarElements(n)) return null;
      }
      return i;
    },
    findExtraArticle: function () {
      if (!this.article) return null;
      for (
        var e = 0, t = this.article.element;
        e < 3 && t;
        ++e, t = t.parentNode
      ) {
        var n = this.findExtraArticleCandidateElements(t);
        if (n && n.length)
          for (
            var i,
              r = this.sortCandidateElementsInDescendingScoreOrder(n),
              a = 0;
            a < r.length && (i = r[a]) && i.basicScore();
            a++
          )
            if (
              !i.shouldDisqualifyDueToScoreDensity() &&
              !i.shouldDisqualifyDueToHorizontalRuleDensity() &&
              !(
                i.shouldDisqualifyDueToHeaderDensity() ||
                (cachedElementBoundingRect(i.element).height <
                  PrependedArticleCandidateMinimumHeight &&
                  cachedElementBoundingRect(this.article.element).width !==
                    cachedElementBoundingRect(i.element).width)
              )
            ) {
              var l = contentTextStyleForNode(this.contentDocument, i.element);
              if (
                l &&
                l.fontFamily === this.contentTextStyle().fontFamily &&
                l.fontSize === this.contentTextStyle().fontSize &&
                i
              )
                return i;
            }
      }
      return null;
    },
    highestScoringCandidateFromCandidates: function (e) {
      for (var t = 0, n = null, i = e.length, r = 0; r < i; ++r) {
        var a = e[r],
          l = a.basicScore();
        l >= t && ((t = l), (n = a));
      }
      return n;
    },
    sortCandidateElementsInDescendingScoreOrder: function (e) {
      function t(e, t) {
        return e.basicScore() !== t.basicScore()
          ? t.basicScore() - e.basicScore()
          : t.depth() - e.depth();
      }
      return e.sort(t);
    },
    findCandidateElements: function () {
      const e = 1e3;
      for (
        var t = Date.now() + e,
          n = this.contentDocument.getElementsByTagName("*"),
          i = n.length,
          r = [],
          a = 0;
        a < i;
        ++a
      ) {
        var l = n[a];
        if (!SetOfCandidateTagNamesToIgnore.has(normalizedElementTagName(l))) {
          var o = CandidateElement.candidateIfElementIsViable(
            l,
            this.contentDocument,
          );
          if ((o && r.push(o), Date.now() > t)) {
            r = [];
            break;
          }
        }
      }
      var s = r.length;
      for (a = 0; a < s; ++a) r[a].element.candidateElement = r[a];
      for (a = 0; a < s; ++a) {
        var c = r[a];
        if ("blockquote" === normalizedElementTagName(c.element)) {
          var m = c.element.parentElement.candidateElement;
          m && m.addTextNodesFromCandidateElement(c);
        }
      }
      for (a = 0; a < s; ++a) r[a].element.candidateElement = null;
      return r;
    },
    findExtraArticleCandidateElements: function (e) {
      if (!this.article) return [];
      e || (e = this.article.element);
      for (
        var t = "preceding-sibling::*/descendant-or-self::*",
          n = this.contentDocument.evaluate(
            t,
            e,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null,
          ),
          i = n.snapshotLength,
          r = [],
          a = 0;
        a < i;
        ++a
      ) {
        var l = n.snapshotItem(a);
        if (!SetOfCandidateTagNamesToIgnore.has(normalizedElementTagName(l)))
          (o = CandidateElement.extraArticleCandidateIfElementIsViable(
            l,
            this.article,
            this.contentDocument,
            !0,
          )) && r.push(o);
      }
      ((t = "following-sibling::*/descendant-or-self::*"),
        (i = (n = this.contentDocument.evaluate(
          t,
          e,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null,
        )).snapshotLength));
      for (a = 0; a < i; ++a) {
        var o;
        l = n.snapshotItem(a);
        if (!SetOfCandidateTagNamesToIgnore.has(normalizedElementTagName(l)))
          (o = CandidateElement.extraArticleCandidateIfElementIsViable(
            l,
            this.article,
            this.contentDocument,
            !1,
          )) && r.push(o);
      }
      return r;
    },
    isGeneratedBy: function (e) {
      var t = this.contentDocument.head
        ? this.contentDocument.head.querySelector("meta[name=generator]")
        : null;
      if (!t) return !1;
      var n = t.content;
      return !!n && e.test(n);
    },
    isMediaWikiPage: function () {
      return (
        void 0 === this._isMediaWikiPage &&
          (this._isMediaWikiPage = this.isGeneratedBy(/^MediaWiki /)),
        this._isMediaWikiPage
      );
    },
    isWordPressSite: function () {
      return this.isGeneratedBy(/^WordPress/);
    },
    isAMPPage: function () {
      return this.contentDocument.documentElement.hasAttribute("amp-version");
    },
    nextPageURLString: function () {
      if (!this.article) return null;
      if (this.isMediaWikiPage()) return null;
      var e,
        t = 0,
        n = this.article.element;
      n.parentNode &&
        "inline" === getComputedStyle(n).display &&
        (n = n.parentNode);
      for (
        var i = n,
          r =
            cachedElementBoundingRect(n).bottom +
            LinkMaxVerticalDistanceFromArticle;
        isElementNode(i) && cachedElementBoundingRect(i).bottom <= r;
      )
        i = i.parentNode;
      i === n || (i !== this.contentDocument && !isElementNode(i)) || (n = i);
      var a = this.contentDocument.evaluate(
          LinkCandidateXPathQuery,
          n,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null,
        ),
        l = a.snapshotLength;
      if (this.pageNumber <= 2 && !this.prefixWithDateForNextPageURL) {
        var o = this.contentDocument.location.pathname,
          s = o.match(LinkDateRegex);
        s &&
          ((s = s[0]),
          (this.prefixWithDateForNextPageURL = o.substring(
            0,
            o.indexOf(s) + s.length,
          )));
      }
      for (var c = 0; c < l; ++c) {
        var m = a.snapshotItem(c),
          d = this.scoreNextPageLinkCandidate(m);
        d > t && ((e = m), (t = d));
      }
      return e ? e.href : null;
    },
    scoreNextPageLinkCandidate: function (e) {
      function t(e, t, n, i) {
        t.substring(0, e.length) === e &&
          ((t = t.substring(e.length)), (e = ""));
        var r = t.lastInteger();
        if (isNaN(r)) return !1;
        var a = e ? e.lastInteger() : NaN;
        return (
          (isNaN(a) || a >= MaximumExactIntegralValue) && (a = i),
          r === a ? n.lastInteger() === a + 1 : r === a + 1
        );
      }
      function n(e) {
        for (
          var t = {}, n = e.substring(1).split("&"), i = n.length, r = 0;
          r < i;
          ++r
        ) {
          var a = n[r],
            l = a.indexOf("=");
          -1 === l
            ? (t[a] = null)
            : (t[a.substring(0, l)] = a.substring(l + 1));
        }
        return t;
      }
      var i = this.contentDocument.location;
      if (e.host !== i.host) return 0;
      if (e.pathname === i.pathname && e.search === i.search) return 0;
      if (-1 !== e.toString().indexOf("#")) return 0;
      if (anchorLinksToAttachment(e) || anchorLinksToTagOrCategoryPage(e))
        return 0;
      if (!isElementVisible(e)) return 0;
      var r = cachedElementBoundingRect(e),
        a = this.articleBoundingRect(),
        l = Math.max(
          0,
          Math.max(a.top - (r.top + r.height), r.top - (a.top + a.height)),
        );
      if (r.top < a.top) return 0;
      if (l > LinkMaxVerticalDistanceFromArticle) return 0;
      if (
        Math.max(
          0,
          Math.max(a.left - (r.left + r.width), r.left - (a.left + a.width)),
        ) > 0
      )
        return 0;
      var o = i.pathname,
        s = e.pathname;
      if (this.prefixWithDateForNextPageURL) {
        if (-1 === e.pathname.indexOf(this.prefixWithDateForNextPageURL))
          return 0;
        ((o = o.substring(this.prefixWithDateForNextPageURL.length)),
          (s = s.substring(this.prefixWithDateForNextPageURL.length)));
      }
      var c = s.substring(1).split("/");
      c[c.length - 1] || c.pop();
      var m = c.length,
        d = o.substring(1).split("/"),
        h = !1;
      d[d.length - 1] || ((h = !0), d.pop());
      var u = d.length;
      if (m < u) return 0;
      for (var g = 0, f = 0, p = e.textContent, E = 0; E < m; ++E) {
        var v = c[E],
          T = E < u ? d[E] : "";
        if (T !== v) {
          if (E < u - 2) return 0;
          if (v.length >= T.length) {
            for (var S = 0; v[v.length - 1 - S] === T[T.length - 1 - S]; ) S++;
            S &&
              ((v = v.substring(0, v.length - S)),
              (T = T.substring(0, T.length - S)));
            var A = v.indexOf(T);
            -1 !== A && (v = v.substring(A));
          }
          t(T, v, p, this.pageNumber)
            ? (f = Math.pow(LinkNextOrdinalValueBase, E - m + 1))
            : g++;
        }
        if (g > 1) return 0;
      }
      var N = !1;
      if (e.search)
        for (var y in ((linkParameters = n(e.search)),
        (referenceParameters = n(i.search)),
        linkParameters)) {
          var b = linkParameters[y],
            x = y in referenceParameters ? referenceParameters[y] : null;
          if (x !== b)
            if (
              (null === x && (x = ""),
              null === b && (b = ""),
              b.length < x.length)
            )
              g++;
            else if (t(x, b, p, this.pageNumber)) {
              if (LinkURLSearchParameterKeyMatchRegex.test(y)) {
                if (o.toLowerCase() !== s.toLowerCase()) return 0;
                if (this.isWordPressSite() && h) return 0;
                N = !0;
              }
              if (LinkURLBadSearchParameterKeyMatchRegex.test(y)) {
                g++;
                continue;
              }
              f = Math.max(f, 1 / LinkNextOrdinalValueBase);
            } else g++;
        }
      if (!f) return 0;
      if (
        ((LinkURLPageSlashNumberMatchRegex.test(e.href) ||
          LinkURLSlashDigitEndMatchRegex.test(e.href)) &&
          (N = !0),
        !N && m === u && stringSimilarity(o, s) < LinkMinimumURLSimilarityRatio)
      )
        return 0;
      if (LinkURLArchiveSlashDigitEndMatchRegex.test(e)) return 0;
      var I =
        LinkMatchWeight * (Math.pow(LinkMismatchValueBase, -g) + f) +
        (LinkVerticalDistanceFromArticleWeight * l) /
          LinkMaxVerticalDistanceFromArticle;
      (N && (I += LinkURLSemanticMatchBonus),
        "li" === normalizedElementTagName(e.parentNode) &&
          (I += LinkListItemBonus));
      p = e.innerText;
      return (
        LinkNextMatchRegEx.test(p) && (I += LinkNextMatchBonus),
        LinkPageMatchRegEx.test(p) && (I += LinkPageMatchBonus),
        LinkContinueMatchRegEx.test(p) && (I += LinkContinueMatchBonus),
        I
      );
    },
    elementContainsEnoughTextOfSameStyle: function (e, t, n) {
      const i = 110;
      var r = "body" === normalizedElementTagName(e),
        a = getVisibleNonWhitespaceTextNodes(e, r ? 2 : 3, i, r, t);
      const l = 0.2,
        o =
          n /
          clamp(scoreMultiplierForElementTagNameAndAttributes(e), l, 1 / 0) /
          languageScoreMultiplierForTextNodes(a);
      for (var s = {}, c = a.length, m = 0; m < c; ++m) {
        var d = a[m],
          h = d.length,
          u = d.parentElement,
          g = window.getComputedStyle(u),
          f = g.fontFamily + "|" + g.fontSize,
          p = Math.pow(h, TextNodeLengthPower);
        if (s[f]) {
          if ((s[f] += p) > o) break;
        } else s[f] = p;
      }
      for (var f in s) if (s[f] > o) return !0;
      return !1;
    },
    openGraphMetadataClaimsPageTypeIsArticle: function () {
      if (!this._openGraphMetadataClaimsPageTypeIsArticle) {
        var e = this.contentDocument.querySelector(
          "head meta[property='og:type']",
        );
        this._openGraphMetadataClaimsPageTypeIsArticle =
          e && "article" === e.content;
      }
      return this._openGraphMetadataClaimsPageTypeIsArticle;
    },
    prismGenreClaimsPageIsHomepage: function () {
      return (
        "homePage" ===
        this.contentFromUniqueMetadataSelector(
          this.contentDocument,
          "head meta[name='prism.genre']",
        )
      );
    },
    pointsToUseForHitTesting: function () {
      const e = window.innerWidth,
        t = e / 4,
        n = e / 2,
        i = 128,
        r = 320;
      var a = [
        [n, 800],
        [n, 600],
        [t, 800],
        [n, 400],
        [n - i, 1100],
        [r, 700],
        [3 * t, 800],
        [e - r, 700],
      ];
      return (
        this.openGraphMetadataClaimsPageTypeIsArticle() &&
          a.push([n - i, 1400]),
        a
      );
    },
    findArticleByVisualExamination: function () {
      for (
        var e = new Set(),
          t = this.pointsToUseForHitTesting(),
          n = t.length,
          i = AppleDotComAndSubdomainsRegex.test(
            this.contentDocument.location.hostname.toLowerCase(),
          )
            ? 7200
            : 1800,
          r = this.candidateElementFilter,
          a = 0;
        a < n;
        a++
      )
        for (
          var l = t[a][0],
            o = t[a][1],
            s = elementAtPoint(l, o, this.contentDocument);
          s && !e.has(s);
          s = s.parentElement
        ) {
          if (VeryPositiveClassNameRegEx.test(s.className))
            return new CandidateElement(s, this.contentDocument);
          if (
            !SetOfCandidateTagNamesToIgnore.has(normalizedElementTagName(s))
          ) {
            var c = s.offsetWidth,
              m = s.offsetHeight;
            if (!c && !m) {
              var d = cachedElementBoundingRect(s);
              ((c = d.width), (m = d.height));
            }
            if (
              !(
                c < r.minimumWidth ||
                m < r.minimumHeight ||
                c * m < r.minimumArea
              )
            ) {
              var h = this.elementContainsEnoughTextOfSameStyle(s, e, i);
              if (
                (e.add(s),
                h &&
                  !(
                    CandidateElement.candidateElementAdjustedHeight(s) <
                    r.minimumHeight
                  ))
              ) {
                var u = new CandidateElement(s, this.contentDocument);
                if (!u.shouldDisqualifyDueToSimilarElements()) {
                  if (u.shouldDisqualifyDueToHorizontalRuleDensity())
                    return null;
                  if (u.shouldDisqualifyDueToHeaderDensity()) return null;
                  if (!u.shouldDisqualifyForDeepLinking()) return u;
                }
              }
            }
          }
        }
      return null;
    },
    findTextSamplesByVisualExamination: function () {
      function e(e) {
        if (!e || !e.innerText) return null;
        let n = t(e.innerText.trim());
        return (n && a.add(e), n);
      }
      function t(e) {
        const t = 10;
        let i = textContentAppearsToBeCJK(e, d) ? d : m,
          r = e.length;
        if (r < i) return null;
        if (r > f * c) return null;
        let a = n(e);
        return (a.match(/\n/g) || []).length > t ? null : a;
      }
      function n(e) {
        return e.substring(0, h);
      }
      function i(t, n) {
        let i = [],
          r = s.querySelectorAll(t);
        for (let t of r) {
          if (i.length >= n) break;
          if (elementDescendsFromElementInSet(t, l)) continue;
          let r = e(t);
          r && i.push([t, r]);
        }
        return i;
      }
      function r(e) {
        const n = document.querySelectorAll("div"),
          i = new Set();
        for (let r of n) {
          if (r.firstElementChild) continue;
          let n = t(r.textContent);
          if (n && (i.add(n), i.size >= e)) break;
        }
        return i;
      }
      this.setSuppressBoundingRectCalculationForSkippedElements(!0);
      var a = new Set(),
        l = new Set(),
        o = new Set(),
        s = this.contentDocument,
        c = s.body.innerText.length;
      const m = 20,
        d = 10,
        h = 200,
        u = 5,
        g = 5,
        f = 0.8;
      let p = s.title,
        E = t(p);
      E && (o.add(E), l.add(p));
      let v = this.pointsToUseForHitTesting(),
        T = v.length;
      for (var S = 0; S < T; S++) {
        let t = v[S][0],
          n = v[S][1],
          i = 0;
        for (
          let r = elementAtPoint(t, n, this.contentDocument);
          r && !a.has(r) && !(i > u);
          r = r.parentElement, i++
        ) {
          let t = e(r);
          if (t) {
            if (elementDescendsFromElementMatchingSelector(r, "code, form"))
              break;
            (o.add(t), l.add(r));
            break;
          }
        }
      }
      let A = { p: 3, h1: 2, h2: 2, h3: 1 };
      for (let [e, t] of Object.entries(A)) {
        let n = i(e, t);
        for (let [e, t] of n) e && t && (o.add(t), l.add(e));
      }
      if (o.size < g) {
        let e = ["article", "header", "a", "footer", "body"];
        for (let t of e) {
          let e = i(t, 1) || [],
            [n, r] = e.length > 0 ? e[0] : [null, null];
          if (n && r) {
            (o.add(r), l.add(n));
            break;
          }
        }
      }
      if (o.size < g) {
        const e = r(g - o.size);
        o = o.union(e);
      }
      return Array.from(o);
    },
    findArticleFromMetadata: function (e) {
      var t = this.contentDocument.querySelectorAll(
        SchemaDotOrgArticleContainerSelector,
      );
      if (1 === t.length) {
        var n = t[0];
        if (n.matches("article, *[itemprop=articleBody]"))
          if (
            (o = CandidateElement.candidateIfElementIsViable(
              n,
              this.contentDocument,
              !0,
            ))
          )
            return e === FindArticleMode.ExistenceOfElement || o;
        var i = n.querySelectorAll("article, *[itemprop=articleBody]"),
          r = elementWithLargestAreaFromElements(i);
        if (r)
          if (
            (o = CandidateElement.candidateIfElementIsViable(
              r,
              this.contentDocument,
              !0,
            ))
          )
            return e === FindArticleMode.ExistenceOfElement || o;
        return new CandidateElement(n, this.contentDocument);
      }
      if (
        this.openGraphMetadataClaimsPageTypeIsArticle() &&
        !this.prismGenreClaimsPageIsHomepage()
      ) {
        var a = this.contentDocument.querySelectorAll("main article"),
          l = elementWithLargestAreaFromElements(a);
        if (l)
          if (
            (o = CandidateElement.candidateIfElementIsViable(
              l,
              this.contentDocument,
              !0,
            ))
          )
            return e === FindArticleMode.ExistenceOfElement || o;
        var o,
          s = this.contentDocument.querySelectorAll("article");
        if (1 === s.length)
          if (
            (o = CandidateElement.candidateIfElementIsViable(
              s[0],
              this.contentDocument,
              !0,
            ))
          )
            return e === FindArticleMode.ExistenceOfElement || o;
      }
      return null;
    },
    articleTextContent: function () {
      return (
        this._articleTextContent || this.adoptableArticle(),
        this._articleTextContent
      );
    },
    unformattedArticleTextContentIncludingMetadata: function (e) {
      this.setSuppressBoundingRectCalculationForSkippedElements(!0);
      var t = this.articleNode();
      if (t) {
        if (!e) return t.innerText;
        var n = "",
          i = this.articleTitle();
        i && (n += i + "\n");
        var r = this.articleSubhead();
        r && (n += r + "\n");
        var a = this.adoptableMetadataBlock();
        return (
          a &&
            (n +=
              plaintextVersionOfNodeAppendingNewlinesBetweenBlockElements(a) +
              "\n"),
          n + t.innerText
        );
      }
    },
    pageDescription: function (e) {
      var t = e["name:description"] || e["property:og:description"];
      return t && (t = t.trim()).length ? t : null;
    },
    articleTitleAndSiteNameFromTitleString: function (e) {
      const t = [" - ", " \u2013 ", " \u2014 ", ": ", " | ", " \xbb "],
        n = t.length,
        i = 0.6;
      for (
        var r,
          a,
          l = this.contentDocument.location.host.replace(
            /^(www|m|secure)\./,
            "",
          ),
          o = l.replace(/\.(com|info|net|org|edu|gov)$/, "").toLowerCase(),
          s = 0;
        s < n;
        ++s
      ) {
        var c = e.split(t[s]);
        if (2 === c.length) {
          var m = c[0].trim(),
            d = c[1].trim(),
            h = m.toLowerCase(),
            u = d.toLowerCase(),
            g = Math.max(stringSimilarity(h, l), stringSimilarity(h, o)),
            f = Math.max(stringSimilarity(u, l), stringSimilarity(u, o)),
            p = Math.max(g, f);
          (!a || p > a) &&
            ((a = p),
            (r =
              g > f
                ? { siteName: m, articleTitle: d }
                : { siteName: d, articleTitle: m }));
        }
      }
      return r && a >= i ? r : null;
    },
    pageInformation: function (e, t) {
      var n,
        i = this.buildMapOfMetaTags(),
        r = this.pageDescription(i),
        a = !1;
      this.adoptableArticle()
        ? ((n = this.articleTitle()),
          (r = r || this.articleTextContent()),
          (a = !0))
        : ((n = this.contentDocument.title),
          this.contentDocument.body &&
            (r = r || this.contentDocument.body.innerText));
      var l = "",
        o = this.pageImageURLFromMetadata(i);
      if (o) l = o;
      else {
        var s = this.mainImageNode();
        s && (l = s.src);
      }
      (n || (n = userVisibleURLString(this.contentDocument.location.href)),
        (n = n.trim()),
        e && (n = n.substring(0, e)));
      var c = this.contentFromUniqueMetadataSelector(
        this.contentDocument,
        "head meta[property='og:site_name']",
      );
      if (!c) {
        var m = this.articleTitleAndSiteNameFromTitleString(
          this.contentDocument.title,
        );
        m && m.articleTitle === n && (c = m.siteName);
      }
      return (
        c || (c = ""),
        (r = r ? r.trim() : ""),
        t && (r = r.substring(0, t)),
        {
          title: n,
          previewText: (r = r.replace(/[\s]+/g, " ")),
          siteName: c,
          mainImageURL: l,
          isReaderAvailable: a,
        }
      );
    },
    readingListItemInformation: function () {
      const e = 220,
        t = 220;
      return this.pageInformation(e, t);
    },
    buildMapOfMetaTags: function () {
      var e = {};
      const t = this.contentDocument.head.getElementsByTagName("meta"),
        n = t.length;
      for (var i = 0; i < n; ++i) {
        const n = t[i],
          r = n.content;
        if (!r) continue;
        if (this.elementAttributesContainImproperQuote(n)) continue;
        n.name && (e["name:" + n.name.toLowerCase()] = r);
        const a = n.getAttribute("property");
        a && (e["property:" + a.toLowerCase()] = r);
      }
      return e;
    },
    pageTitleForTextAnalysis: function (e) {
      const t = this.contentDocument;
      var n = e["property:og:title"];
      return (
        n || (n = e["name:twitter:title"]),
        n || (n = e["name:sailthru.headline"]),
        n || (n = t.title),
        n
      );
    },
    pageAuthorForTextAnalysis: function (e) {
      return e["name:author"] || e["property:author"];
    },
    pageMetadataCommonToTextAnalysisAndArticleContent: function () {
      var e = {};
      const t = this.buildMapOfMetaTags(),
        n = this.pageTitleForTextAnalysis(t);
      n && (e.title = n);
      const i = this.pageAuthorForTextAnalysis(t);
      i && (e.author = i);
      const r = this.pageImageURLFromMetadata(t);
      return (r && (e.imageURL = r), e);
    },
    extractedArticleContent: function () {
      try {
        const e = this.adoptableArticle(!0);
        for (let t of e.getElementsByTagName("*"))
          t.removeAttribute(READER_UNIQUE_ID_ATTRIBUTE_KEY);
        let t = this.pageMetadataCommonToTextAnalysisAndArticleContent();
        if (e) {
          const n = e.innerHTML;
          t.body = n;
        }
        this.updateArticleBylineAndDateElementsIfNecessary();
        const n = this.articleDateElement();
        n && (t.publishedDate = trimmedInnerTextIgnoringTextTransform(n));
        const i = this.articleBylineElement();
        return (
          !t.author &&
            i &&
            (t.author = trimmedInnerTextIgnoringTextTransform(i)),
          t
        );
      } catch (e) {
        let t = {};
        const n = e.message,
          i = e.stack;
        return (n && (t.error = n), i && (t.stack = i), t);
      }
    },
    readerUniqueIDOfElementPinnedToTopOfViewport: function () {
      const e = 120;
      if (window.scrollY < e) return null;
      const t = this.articleNode();
      if (!t) return null;
      const n = t.getBoundingClientRect(),
        i = (n.left + n.right) / 2;
      for (const e of [0, 15, 35, 50, 80, 110]) {
        const n = t.ownerDocument.elementFromPoint(i, e);
        if (
          n !== t &&
          (t.contains(n) ||
            n === this._articleTitleElement ||
            n === this._articleSubheadElement)
        ) {
          const e = this._weakMapOfOriginalElementToUniqueID.get(n);
          if (e) return e;
        }
      }
      return null;
    },
    scrollToElementWithUniqueID: function (e, t) {
      const n = this._rectOfElementWithReaderUniqueID(e);
      if (!n || !n.top || isNaN(n.top) || !n.height || isNaN(n.height)) return;
      const i = -t * n.height;
      this.scrollToOffset(n.top + i);
    },
    uniqueIDAndScrollRatioOfElementPinnedToTop: function () {
      const e = this.readerUniqueIDOfElementPinnedToTopOfViewport();
      if (!e) return [null, null];
      const t = this._rectOfElementWithReaderUniqueID(e);
      if (!t || !t.top || isNaN(t.top) || !t.height || isNaN(t.height))
        return [null, null];
      return [e, (t.top - this.scrollY()) / t.height];
    },
    _rectOfElementWithReaderUniqueID: function (e) {
      function t(e) {
        return {
          top: e.top + window.scrollY,
          right: e.right + window.scrollX,
          bottom: e.bottom + window.scrollY,
          left: e.left + window.scrollX,
          width: e.width,
          height: e.height,
        };
      }
      if (!this._mapOfUniqueIDToOriginalElement) return null;
      let n = this._mapOfUniqueIDToOriginalElement.get(e);
      return n && n.parentElement ? t(n.getBoundingClientRect()) : null;
    },
    scrollY: function () {
      return window.scrollY;
    },
    scrollToOffset: function (e) {
      if ("number" == typeof e)
        try {
          (clearCachedElementBoundingRects(),
            this.cacheWindowScrollPosition(),
            (this.contentDocument.scrollingElement.scrollTop = e));
        } catch (e) {}
    },
    documentURLString: function () {
      return this.contentDocument.location.href;
    },
    baseURI: function () {
      return this.contentDocument.baseURI;
    },
    usesSearchEngineOptimizationMetadata: function () {
      return !!document.head.querySelector('meta[property^="og:"]');
    },
    extractCanonicalLink: function () {
      var e = document.head.querySelector("link[rel='canonical']");
      if (!e) return null;
      var t = e.getAttribute("href");
      if (!t) return null;
      var n = document.baseURI,
        i = urlFromString(t, n);
      return ("/" !== document.location.pathname && "/" === i.pathname) ||
        ("localhost" === i.hostname &&
          "localhost" !== document.location.hostname)
        ? null
        : i.href;
    },
    setSuppressBoundingRectCalculationForSkippedElements: function (e) {
      this._shouldSuppressBoundingRectCalculationForSkippedElements = e;
    },
    shouldSuppressBoundingRectCalculationForSkippedElements: function () {
      return !!this._shouldSuppressBoundingRectCalculationForSkippedElements;
    },
    handleNavigation: function (e) {
      e.hashChange || this.resetArticleInformation();
    },
  }));
var ReaderArticleFinderJS = new ReaderArticleFinder(document);
navigation.addEventListener("navigate", (e) => {
  ReaderArticleFinderJS.handleNavigation(e);
});
