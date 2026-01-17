//# sourceURL=__InjectedScript_PasswordRulesParserJS.js
/* Copyright (c) 2025 Apple Inc. All rights reserved. */
// Copyright (c) 2019 - 2022 Apple Inc. Licensed under MIT License.
"use strict";
function _isIdentifierCharacter(e) {
  return (e >= "a" && e <= "z") || (e >= "A" && e <= "Z") || "-" === e;
}
function _isASCIIDigit(e) {
  return e >= "0" && e <= "9";
}
function _isASCIIPrintableCharacter(e) {
  return e >= " " && e <= "~";
}
function _isASCIIWhitespace(e) {
  return " " === e || "\f" === e || "\n" === e || "\r" === e || "\t" === e;
}
function _bitSetIndexForCharacter(e) {
  return e.codePointAt(0) - SPACE_CODE_POINT;
}
function _characterAtBitSetIndex(e) {
  return String.fromCodePoint(e + SPACE_CODE_POINT);
}
function _markBitsForNamedCharacterClass(e, r) {
  r.name === Identifier.UPPER
    ? e.fill(
        !0,
        _bitSetIndexForCharacter("A"),
        _bitSetIndexForCharacter("Z") + 1,
      )
    : r.name === Identifier.LOWER
      ? e.fill(
          !0,
          _bitSetIndexForCharacter("a"),
          _bitSetIndexForCharacter("z") + 1,
        )
      : r.name === Identifier.DIGIT
        ? e.fill(
            !0,
            _bitSetIndexForCharacter("0"),
            _bitSetIndexForCharacter("9") + 1,
          )
        : r.name === Identifier.SPECIAL &&
          (e.fill(
            !0,
            _bitSetIndexForCharacter(" "),
            _bitSetIndexForCharacter("/") + 1,
          ),
          e.fill(
            !0,
            _bitSetIndexForCharacter(":"),
            _bitSetIndexForCharacter("@") + 1,
          ),
          e.fill(
            !0,
            _bitSetIndexForCharacter("["),
            _bitSetIndexForCharacter("`") + 1,
          ),
          e.fill(
            !0,
            _bitSetIndexForCharacter("{"),
            _bitSetIndexForCharacter("~") + 1,
          ));
}
function _markBitsForCustomCharacterClass(e, r) {
  for (let t of r.characters) e[_bitSetIndexForCharacter(t)] = !0;
}
function _canonicalizedPropertyValues(e, r) {
  function t(e, r) {
    let t = [];
    for (
      let n = _bitSetIndexForCharacter(e);
      n <= _bitSetIndexForCharacter(r);
      ++n
    )
      a[n] && t.push(_characterAtBitSetIndex(n));
    let i =
      t.length ===
      _bitSetIndexForCharacter(r) - _bitSetIndexForCharacter(e) + 1;
    return (i || (n = n.concat(t)), i);
  }
  let a = new Array("~".codePointAt(0) - " ".codePointAt(0) + 1);
  for (let r of e)
    if (r instanceof NamedCharacterClass) {
      if (r.name === Identifier.UNICODE)
        return [new NamedCharacterClass(Identifier.UNICODE)];
      if (r.name === Identifier.ASCII_PRINTABLE)
        return [new NamedCharacterClass(Identifier.ASCII_PRINTABLE)];
      _markBitsForNamedCharacterClass(a, r);
    } else
      r instanceof CustomCharacterClass &&
        _markBitsForCustomCharacterClass(a, r);
  let n = [],
    i = t("A", "Z"),
    l = t("a", "z"),
    s = t("0", "9"),
    u = !1,
    c = !1,
    o = !1,
    _ = [];
  for (
    let e = _bitSetIndexForCharacter(" ");
    e <= _bitSetIndexForCharacter("/");
    ++e
  ) {
    if (!a[e]) continue;
    let t = _characterAtBitSetIndex(e);
    r && "-" === t ? (c = !0) : _.push(t);
  }
  for (
    let e = _bitSetIndexForCharacter(":");
    e <= _bitSetIndexForCharacter("@");
    ++e
  )
    a[e] && _.push(_characterAtBitSetIndex(e));
  for (
    let e = _bitSetIndexForCharacter("[");
    e <= _bitSetIndexForCharacter("`");
    ++e
  ) {
    if (!a[e]) continue;
    let t = _characterAtBitSetIndex(e);
    r && "]" === t ? (o = !0) : _.push(t);
  }
  for (
    let e = _bitSetIndexForCharacter("{");
    e <= _bitSetIndexForCharacter("~");
    ++e
  )
    a[e] && _.push(_characterAtBitSetIndex(e));
  (c && _.unshift("-"), o && _.push("]"));
  let C =
    _bitSetIndexForCharacter("/") -
    _bitSetIndexForCharacter(" ") +
    1 +
    (_bitSetIndexForCharacter("@") - _bitSetIndexForCharacter(":") + 1) +
    (_bitSetIndexForCharacter("`") - _bitSetIndexForCharacter("[") + 1) +
    (_bitSetIndexForCharacter("~") - _bitSetIndexForCharacter("{") + 1);
  ((u = _.length === C), u || (n = n.concat(_)));
  let h = [];
  return i && l && s && u
    ? [new NamedCharacterClass(Identifier.ASCII_PRINTABLE)]
    : (i && h.push(new NamedCharacterClass(Identifier.UPPER)),
      l && h.push(new NamedCharacterClass(Identifier.LOWER)),
      s && h.push(new NamedCharacterClass(Identifier.DIGIT)),
      u && h.push(new NamedCharacterClass(Identifier.SPECIAL)),
      n.length && h.push(new CustomCharacterClass(n)),
      h);
}
function _indexOfNonWhitespaceCharacter(e, r = 0) {
  let t = e.length;
  for (; r < t && _isASCIIWhitespace(e[r]); ) ++r;
  return r;
}
function _parseIdentifier(e, r) {
  let t = e.length,
    a = [];
  do {
    let t = e[r];
    if (!_isIdentifierCharacter(t)) break;
    (a.push(t), ++r);
  } while (r < t);
  return [a.join(""), r];
}
function _isValidRequiredOrAllowedPropertyValueIdentifier(e) {
  return e && Object.values(Identifier).includes(e.toLowerCase());
}
function _parseCustomCharacterClass(e, r) {
  let t = e.length;
  if (++r >= t) return [null, r];
  let a = r,
    n = [];
  do {
    let t = e[r];
    if (_isASCIIPrintableCharacter(t)) {
      if ("-" === t && r - a > 0) ++r;
      else if ((n.push(t), ++r, t === CHARACTER_CLASS_END_SENTINEL)) break;
    } else ++r;
  } while (r < t);
  return (r < t && e[r] !== CHARACTER_CLASS_END_SENTINEL) ||
    (r == t && e[r - 1] == CHARACTER_CLASS_END_SENTINEL)
    ? (n.pop(), [n, r])
    : r < t && e[r] == CHARACTER_CLASS_END_SENTINEL
      ? [n, r + 1]
      : [null, r];
}
function _parsePasswordRequiredOrAllowedPropertyValue(e, r) {
  let t = e.length,
    a = [];
  for (;;) {
    if (_isIdentifierCharacter(e[r])) {
      let t = r;
      var [n, r] = _parseIdentifier(e, r);
      if (!_isValidRequiredOrAllowedPropertyValueIdentifier(n))
        return [null, t];
      a.push(new NamedCharacterClass(n));
    } else {
      if (e[r] != CHARACTER_CLASS_START_SENTINEL) return [null, r];
      var [n, r] = _parseCustomCharacterClass(e, r);
      n && n.length && a.push(new CustomCharacterClass(n));
    }
    if (
      (r = _indexOfNonWhitespaceCharacter(e, r)) >= t ||
      e[r] === PROPERTY_SEPARATOR
    )
      break;
    if (e[r] !== PROPERTY_VALUE_SEPARATOR) return [null, r];
    if ((r = _indexOfNonWhitespaceCharacter(e, r + 1)) >= t) return [null, r];
  }
  return [a, r];
}
function _parsePasswordRule(e, r) {
  let t = e.length;
  var a = r,
    [n, r] = _parseIdentifier(e, r);
  if (!Object.values(RuleName).includes(n)) return [null, a];
  if (r >= t) return [null, r];
  if (e[r] !== PROPERTY_VALUE_START_SENTINEL) return [null, r];
  let i = { name: n, value: null };
  if (
    (r = _indexOfNonWhitespaceCharacter(e, r + 1)) >= t ||
    e[r] === PROPERTY_SEPARATOR
  )
    return [new Rule(i.name, i.value), r];
  switch (n) {
    case RuleName.ALLOWED:
    case RuleName.REQUIRED:
      var [l, r] = _parsePasswordRequiredOrAllowedPropertyValue(e, r);
      return (l && (i.value = l), [new Rule(i.name, i.value), r]);
    case RuleName.MAX_CONSECUTIVE:
      var [l, r] = _parseMaxConsecutivePropertyValue(e, r);
      return (l && (i.value = l), [new Rule(i.name, i.value), r]);
    case RuleName.MIN_LENGTH:
    case RuleName.MAX_LENGTH:
      var [l, r] = _parseMinLengthMaxLengthPropertyValue(e, r);
      return (l && (i.value = l), [new Rule(i.name, i.value), r]);
  }
}
function _parseMinLengthMaxLengthPropertyValue(e, r) {
  return _parseInteger(e, r);
}
function _parseMaxConsecutivePropertyValue(e, r) {
  return _parseInteger(e, r);
}
function _parseInteger(e, r) {
  if (!_isASCIIDigit(e[r])) return [null, r];
  let t = e.length,
    a = 0;
  do {
    ((a = 10 * a + parseInt(e[r], 10)), ++r);
  } while (r < t && e[r] !== PROPERTY_SEPARATOR && _isASCIIDigit(e[r]));
  return r >= t || e[r] === PROPERTY_SEPARATOR ? [a, r] : [null, r];
}
function _parsePasswordRulesInternal(e) {
  let r = [],
    t = e.length;
  for (var a = _indexOfNonWhitespaceCharacter(e); a < t; ) {
    if (!_isIdentifierCharacter(e[a])) return r;
    var [n, a] = _parsePasswordRule(e, a);
    if (
      (n && n.value && r.push(n),
      (a = _indexOfNonWhitespaceCharacter(e, a)) >= t)
    )
      break;
    if (e[a] !== PROPERTY_SEPARATOR) return null;
    if ((a = _indexOfNonWhitespaceCharacter(e, a + 1)) >= t) return r;
  }
  return r;
}
function parsePasswordRules(e, r) {
  let t = _parsePasswordRulesInternal(e) || [],
    a = r,
    n = [],
    i = [],
    l = null,
    s = 0,
    u = null;
  for (let e of t)
    switch (e.name) {
      case RuleName.MAX_CONSECUTIVE:
        l = l ? Math.min(e.value, l) : e.value;
        break;
      case RuleName.MIN_LENGTH:
        s = Math.max(e.value, s);
        break;
      case RuleName.MAX_LENGTH:
        u = u ? Math.min(e.value, u) : e.value;
        break;
      case RuleName.REQUIRED:
        ((e.value = _canonicalizedPropertyValues(e.value, r)),
          n.push(e),
          a || (i = i.concat(e.value)));
        break;
      case RuleName.ALLOWED:
        i = i.concat(e.value);
    }
  return (
    (i = _canonicalizedPropertyValues(i, a)),
    a ||
      i.length ||
      (i = [new NamedCharacterClass(Identifier.ASCII_PRINTABLE)]),
    i.length && n.push(new Rule(RuleName.ALLOWED, i)),
    null !== l && n.push(new Rule(RuleName.MAX_CONSECUTIVE, l)),
    s > 0 && n.push(new Rule(RuleName.MIN_LENGTH, s)),
    null !== u && n.push(new Rule(RuleName.MAX_LENGTH, u)),
    n
  );
}
console ||
  (console = {
    assert: function () {},
    error: function () {},
    warn: function () {},
  });
const Identifier = {
    ASCII_PRINTABLE: "ascii-printable",
    DIGIT: "digit",
    LOWER: "lower",
    SPECIAL: "special",
    UNICODE: "unicode",
    UPPER: "upper",
  },
  RuleName = {
    ALLOWED: "allowed",
    MAX_CONSECUTIVE: "max-consecutive",
    REQUIRED: "required",
    MIN_LENGTH: "minlength",
    MAX_LENGTH: "maxlength",
  },
  CHARACTER_CLASS_START_SENTINEL = "[",
  CHARACTER_CLASS_END_SENTINEL = "]",
  PROPERTY_VALUE_SEPARATOR = ",",
  PROPERTY_SEPARATOR = ";",
  PROPERTY_VALUE_START_SENTINEL = ":",
  SPACE_CODE_POINT = " ".codePointAt(0),
  SHOULD_NOT_BE_REACHED = "Should not be reached";
class Rule {
  constructor(e, r) {
    ((this._name = e), (this.value = r));
  }
  get name() {
    return this._name;
  }
  toString() {
    return JSON.stringify(this);
  }
}
class NamedCharacterClass {
  constructor(e) {
    this._name = e;
  }
  get name() {
    return this._name.toLowerCase();
  }
  toString() {
    return this._name;
  }
  toHTMLString() {
    return this._name;
  }
}
class CustomCharacterClass {
  constructor(e) {
    this._characters = e;
  }
  get characters() {
    return this._characters;
  }
  toString() {
    return `[${this._characters.join("")}]`;
  }
  toHTMLString() {
    return `[${this._characters.join("").replace(/"/g, "&quot;")}]`;
  }
}
