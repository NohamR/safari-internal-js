//# sourceURL=__InjectedScript_PatternRegexpToPasswordRulesConverter.js
/* Copyright (c) 2026 Apple Inc. All rights reserved. */
// Copyright (c) 2026 Apple Inc. Licensed under MIT License.
"use strict";
class PatternRegexpToPasswordRulesConverter {
  static convert(t) {
    try {
      return this.#t(t);
    } catch (t) {
      return null;
    }
  }
  static #t(t) {
    const e = this.#e(t),
      r = this.#r(e);
    if (r) return r;
    let s = e;
    const a = this.#s(s);
    if (((s = this.#a(s)), !this.#n(a))) return null;
    const n = s.match(/^\.[\*\+]?(?:\{(\d+),(\d*)\})?$/);
    if (n) {
      const t = this.#l(a),
        { min: e, max: r } = this.#i(n, 1, 2);
      return this.#c(t, null, e, r);
    }
    const l = s.match(/^\[((?:[^\]\\]|\\.)*)\](?:\{(\d+),(\d*)\})?$/);
    if (!l) return null;
    const i = this.#l(a),
      c = this.#o(l, i),
      { min: o, max: u } = this.#i(l, 2, 3);
    return this.#c(i, c, o, u);
  }
  static #e(t) {
    let e = t.trim();
    return (
      e.startsWith("^") && (e = e.substring(1)),
      e.endsWith("$") &&
        !e.endsWith("\\$") &&
        (e = e.substring(0, e.length - 1)),
      e
    );
  }
  static #r(t) {
    return "\\d*" === t || "\\d+" === t || "[0-9]*" === t || "[0-9]+" === t
      ? "required: digit;"
      : "[a-z]*" === t || "[a-z]+" === t
        ? "required: lower;"
        : "[A-Z]*" === t || "[A-Z]+" === t
          ? "required: upper;"
          : null;
  }
  static #s(t) {
    const e = [],
      r = /\(\?=\.\*(?:\[((?:[^\]\\]|\\.)*)\]|(\\[dDwWsS]))\)/g;
    let s;
    for (; (s = r.exec(t));)
      void 0 !== s[1] ? e.push(s[1]) : e.push(this.#u(s[2]));
    return e;
  }
  static #n(t) {
    for (const e of t)
      for (const t of ["(?", "|", "\\D", "\\W", "\\S", "\\s"])
        if (e.includes(t)) return !1;
    return !0;
  }
  static #l(t) {
    const e = [];
    for (let r of t) {
      ((r = r.replace(/\\d/g, "0-9")), (r = r.replace(/\\w/g, "a-zA-Z0-9_")));
      const t = [];
      let s = r;
      (s.includes("0-9") && (t.push("digit"), (s = s.replace(/0-9/g, ""))),
        s.includes("A-Z") && (t.push("upper"), (s = s.replace(/A-Z/g, ""))),
        s.includes("a-z") && (t.push("lower"), (s = s.replace(/a-z/g, ""))),
        (s = s.replace(/[a-zA-Z0-9]/g, "")),
        t.length > 0 && 0 === s.length
          ? e.push(t.join(", "))
          : 0 === t.length && s.length > 0
            ? e.push(this.#h(s))
            : t.length > 0 &&
              s.length > 0 &&
              (t.push(this.#h(s)), e.push(t.join(", "))));
    }
    return e;
  }
  static #u(t) {
    return { "\\d": "0-9", "\\w": "a-zA-Z0-9_" }[t] || t;
  }
  static #a(t) {
    let e = t.replace(/\(\?=\.\*\[((?:[^\]\\]|\\.)*)\]\)/g, "");
    return ((e = e.replace(/\(\?=\.\*(\\[dDwWsS])\)/g, "")), e);
  }
  static #h(t) {
    let e = t.replace(/\\\]/g, "]").split(""),
      r = !1,
      s = !1,
      a = [];
    for (const t of e) "-" === t ? (r = !0) : "]" === t ? (s = !0) : a.push(t);
    let n = "";
    return (r && (n += "-"), (n += a.join("")), s && (n += "]"), `[${n}]`);
  }
  static #o(t, e) {
    let r = t[1];
    const s = [];
    ((r = r.replace(/\\d/g, "0-9")), (r = r.replace(/\\w/g, "a-zA-Z0-9_")));
    const a = (t) => e.some((e) => e === t || e.split(", ").includes(t));
    (r.includes("a-z") && !a("lower") && s.push("lower"),
      r.includes("A-Z") && !a("upper") && s.push("upper"),
      r.includes("0-9") && !a("digit") && s.push("digit"));
    let n = r;
    if (
      ((n = n.replace(/a-z/g, "")),
      (n = n.replace(/A-Z/g, "")),
      (n = n.replace(/0-9/g, "")),
      (n = n.replace(/[a-zA-Z0-9]/g, "")),
      (n = n.replace(/\\(.)/g, "$1")),
      n)
    ) {
      const t = this.#h(n),
        r = (t) => {
          const e = t.match(/^\[(.*)\]$/);
          return e ? "[" + [...e[1]].sort().join("") + "]" : t;
        };
      e.some((e) => r(e) === r(t)) || s.push(t);
    }
    return s.length ? s.join(", ") : null;
  }
  static #i(t, e, r) {
    let s = null,
      a = null;
    if (t[e]) {
      const r = parseInt(t[e], 10);
      isNaN(r) || (s = r);
    }
    if (t[r]) {
      const e = parseInt(t[r], 10);
      isNaN(e) || (a = e);
    }
    return { min: s, max: a };
  }
  static #c(t, e, r, s) {
    const a = [];
    for (const e of t) a.push(`required: ${e}`);
    return (
      e && a.push(`allowed: ${e}`),
      null !== r && a.push(`minlength: ${r}`),
      null !== s && a.push(`maxlength: ${s}`),
      a.join("; ") + ";"
    );
  }
}
0;
