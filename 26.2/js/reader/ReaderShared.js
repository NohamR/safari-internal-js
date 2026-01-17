//# sourceURL=__InjectedScript_ReaderShared.js
/* Copyright (c) 2025 Apple Inc. All rights reserved. */
// Copyright (c) 2025 Apple Inc. All rights reserved.
"use strict";
function normalizedElementTagName(e) {
  return e.localName;
}
function plaintextVersionOfNodeAppendingNewlinesBetweenBlockElements(e) {
  const n = (e.ownerDocument ?? document).createTreeWalker(
    e,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
    null,
  );
  let t = "";
  for (n.currentNode = e; n.nextNode(); ) {
    const e = n.currentNode;
    if (e.nodeType === Node.TEXT_NODE) {
      t += e.textContent;
      continue;
    }
    let o = normalizedElementTagName(e);
    ("p" !== o && "div" !== o) || (t += "\n");
  }
  return t;
}
const READER_UNIQUE_ID_ATTRIBUTE_KEY = "data-reader-unique-id",
  READER_UNIQUE_ID_TITLE = "titleElement",
  READER_UNIQUE_ID_SUBHEAD = "subheadElement";
