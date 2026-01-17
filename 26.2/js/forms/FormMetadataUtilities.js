//# sourceURL=__InjectedScript_FormMetadataUtilities.js
/* Copyright (c) 2025 Apple Inc. All rights reserved. */
// Copyright (c) 2025 Apple Inc. All rights reserved.
"use strict";
globalThis.FormMetadataUtilitiesJS = class {
  static #t(t, e) {
    const n = /([A-Za-z0-9])/;
    let o = null,
      s = -1,
      i = -1;
    const l = t.replaceAll(".", "").toLowerCase();
    for (let t = 0; t < e.length; t++) {
      const r = e[t].replaceAll(".", "").toLowerCase(),
        a = r.indexOf(l);
      if (-1 === a) continue;
      if (a > 0 && n.test(r.charAt(a - 1))) continue;
      let c = a + l.length;
      (c < r.length && n.test(r.charAt(c))) ||
        ((!o || r.length < o.length) && ((o = r), (s = t), (i = a)));
    }
    return { index: s, startPosition: i };
  }
  static bestIndexToFillSelectControl(t, e) {
    const n = t.length,
      o = [];
    for (let e = 0; e < n; e++) {
      const n = t[e][1];
      o.push(n);
    }
    let s = -1,
      i = Number.MAX_SAFE_INTEGER;
    for (let t = e.length - 1; t >= 0; t--) {
      const n = e[t];
      Number.MAX_SAFE_INTEGER;
      const l = this.#t(n, o);
      -1 !== l.index &&
        l.startPosition < i &&
        ((i = l.startPosition), (s = l.index));
    }
    return -1 === s ? -1 : t[s][0];
  }
};
