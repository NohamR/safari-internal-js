//# sourceURL=__InjectedScript_NodePath.js
/* Copyright (c) 2025 Apple Inc. All rights reserved. */
// Copyright (C) 2023-2024 Apple Inc. All rights reserved.
"use strict";
(globalThis.WAS || (globalThis.WAS = {}),
  (WAS.NodePath = class {
    static {
      function e(e, t) {
        if (e === t) return 0;
        for (
          var n = e.length, o = t.length, a = new Array(n + 1), i = 0;
          i < n + 1;
          ++i
        )
          ((a[i] = new Array(o + 1)), (a[i][0] = i));
        for (var s = 0; s < o + 1; ++s) a[0][s] = s;
        for (s = 1; s < o + 1; ++s) {
          let o = t[s - 1];
          for (i = 1; i < n + 1; ++i)
            if (e[i - 1] === o) a[i][s] = a[i - 1][s - 1];
            else {
              var d = a[i - 1][s] + 1,
                r = a[i][s - 1] + 1,
                h = a[i - 1][s - 1] + 1;
              a[i][s] = Math.min(d, r, h);
            }
        }
        return a[n][o];
      }
      ((WAS.Assert =
        WAS.Assert ||
        class {
          static isTrue(e, t, ...n) {}
          static isType(e, ...t) {}
          static optionalIsType(e, ...t) {}
          static arrayContentIsType(e, ...t) {}
          static optionalArrayContentIsType(e, ...t) {}
          static isEnum(e, t) {}
          static optionalIsEnum(e, t) {}
          static isSubclass(e, t) {}
          static notReached(e, ...t) {}
        }),
        Object.defineProperties(CharacterData, {
          nodePath_isCharacterData: {
            value(e) {
              switch (Node.nodePath_nodeType(e)) {
                case Node.TEXT_NODE:
                case Node.CDATA_SECTION_NODE:
                case Node.PROCESSING_INSTRUCTION_NODE:
                case Node.COMMENT_NODE:
                  return !0;
                default:
                  return !1;
              }
            },
          },
          nodePath_data: {
            value: (e) =>
              CharacterData.nodePath_isCharacterData(e)
                ? Object.nodePath_get(e, CharacterData, "data")
                : null,
          },
        }),
        Object.defineProperties(Document, {
          nodePath_isDocument: {
            value: (e) => Node.nodePath_nodeType(e) === Node.DOCUMENT_NODE,
          },
          nodePath_defaultView: {
            value: (e) =>
              Document.nodePath_isDocument(e)
                ? Object.nodePath_get(e, Document, "defaultView")
                : null,
          },
        }),
        Object.defineProperties(Element, {
          nodePath_isElement: {
            value: (e) => Node.nodePath_nodeType(e) === Node.ELEMENT_NODE,
          },
          nodePath_tagName: {
            value: (e) =>
              Element.nodePath_isElement(e)
                ? Object.nodePath_get(e, Element, "tagName")
                : null,
          },
          nodePath_id: {
            value: (e) =>
              Element.nodePath_isElement(e)
                ? Object.nodePath_get(e, Element, "id")
                : null,
          },
          nodePath_className: {
            value: (e) =>
              Element.nodePath_isElement(e)
                ? Object.nodePath_get(e, Element, "className")
                : null,
          },
          nodePath_shadowRoot: {
            value: (e) =>
              Element.nodePath_isElement(e)
                ? Object.nodePath_get(e, Element, "shadowRoot")
                : null,
          },
          nodePath_querySelectorAll: {
            value: (e, t) =>
              Element.nodePath_isElement(e)
                ? Element.prototype.querySelectorAll.call(e, t)
                : null,
          },
        }),
        Object.defineProperties(HTMLIFrameElement, {
          nodePath_isHTMLIFrameElement: {
            value: (e) =>
              Node.nodePath_nodeType(e) === Node.ELEMENT_NODE &&
              "HTMLIFrameElement" === Object.getPrototypeOf(e).constructor.name,
          },
          nodePath_contentWindowDocument: {
            value(e) {
              if (!HTMLIFrameElement.nodePath_isHTMLIFrameElement(e))
                return null;
              try {
                return Object.nodePath_get(
                  e,
                  HTMLIFrameElement,
                  "contentWindow",
                ).document;
              } catch (e) {
                return null;
              }
            },
          },
        }),
        Object.defineProperties(Node, {
          nodePath_nodeType: {
            value: (e) => (
              WAS.Assert.isType(e, Node),
              Object.nodePath_get(e, Node, "nodeType")
            ),
          },
          nodePath_firstChild: {
            value: (e) => (
              WAS.Assert.isType(e, Node),
              Object.nodePath_get(e, Node, "firstChild")
            ),
          },
          nodePath_nextSibling: {
            value: (e) => (
              WAS.Assert.isType(e, Node),
              Object.nodePath_get(e, Node, "nextSibling")
            ),
          },
          nodePath_previousSibling: {
            value: (e) => (
              WAS.Assert.isType(e, Node),
              Object.nodePath_get(e, Node, "previousSibling")
            ),
          },
          nodePath_childNodes: {
            value: (e) => (
              WAS.Assert.isType(e, Node),
              Object.nodePath_get(e, Node, "childNodes")
            ),
          },
          nodePath_textContent: {
            value: (e) => (
              WAS.Assert.isType(e, Node),
              Object.nodePath_get(e, Node, "textContent")
            ),
          },
          nodePath_cloneNode: {
            value: (e, { shouldIncludeSubtree: t }) => (
              WAS.Assert.isType(e, Node),
              Node.prototype.cloneNode.call(e, t)
            ),
          },
          nodePath_isEmptyTextNode: {
            value: (e) =>
              Text.nodePath_isText(e) &&
              CharacterData.nodePath_data(e)
                .nodePath_isEmptyExcludingWhitespace,
          },
          nodePath_siblingIndexOfNode: {
            value(e) {
              let t = 0;
              for (
                let n = Node.nodePath_previousSibling(e);
                n;
                n = Node.nodePath_previousSibling(n)
              )
                Node.nodePath_includeWhenComputingSiblingIndex(n) && ++t;
              return t;
            },
          },
          nodePath_includeWhenComputingSiblingIndex: {
            value: (e) =>
              !(
                Node.nodePath_isEmptyTextNode(e) ||
                (Element.nodePath_isElement(e) &&
                  "SCRIPT" === Element.nodePath_tagName(e).toUpperCase())
              ),
          },
          nodePath_immediateSourceMarkupOfNode: {
            value: (e) =>
              Node.nodePath_nodeType(e) === Node.DOCUMENT_FRAGMENT_NODE
                ? null
                : Node.nodePath_cloneNode(e, { shouldIncludeSubtree: !1 })
                    .outerHTML,
          },
          nodePath_immediateInnerTextOfNode: {
            value(e) {
              if (!Node.prototype.hasChildNodes.call(e))
                return Node.nodePath_textContent(e)?.trim();
              let t = "";
              for (let n of Node.nodePath_childNodes(e))
                Text.nodePath_isText(n) &&
                  (t += CharacterData.nodePath_data(n));
              return t.trim();
            },
          },
          nodePath_getBoundingClientRect: {
            value(e) {
              if ((WAS.Assert.isType(e, Node, Range), e instanceof Range))
                return e.getBoundingClientRect();
              if (Text.nodePath_isText(e)) {
                let t = new Range();
                return (
                  t.setStart(e, 0),
                  t.setEnd(e, CharacterData.nodePath_data(e).length),
                  t.getBoundingClientRect()
                );
              }
              return Element.nodePath_isElement(e)
                ? Element.prototype.getBoundingClientRect.call(e)
                : null;
            },
          },
        }),
        Object.defineProperties(Object, {
          nodePath_get: {
            value: (e, t, n) =>
              Object.getOwnPropertyDescriptor(t.prototype, n)?.get?.call?.(e),
          },
        }),
        Object.defineProperties(Range, {
          nodePath_fromNode: {
            value(e) {
              let t = new Range();
              return (t.selectNode(e), t);
            },
          },
          nodePath_isSingleElementRange: {
            value: (e) =>
              e.startContainer === e.endContainer &&
              !Text.nodePath_isText(e.commonAncestorContainer) &&
              1 === Math.abs(e.endOffset - e.startOffset),
          },
          nodePath_singleElementFromRange: {
            value: (e) =>
              Range.nodePath_isSingleElementRange(e)
                ? Node.nodePath_childNodes(e.commonAncestorContainer)[
                    e.startOffset
                  ]
                : null,
          },
          nodePath_startNodeFromRange: {
            value: (e) =>
              Text.nodePath_isText(e.startContainer)
                ? null
                : Node.nodePath_childNodes(e.startContainer)[e.startOffset],
          },
          nodePath_endNodeFromRange: {
            value: (e) =>
              Text.nodePath_isText(e.endContainer)
                ? Node.nodePath_childNodes(e.endContainer)[e.endOffset - 1]
                : null,
          },
        }),
        Object.defineProperties(Range.prototype, {
          nodePath_equals: {
            value(e) {
              return (
                this.commonAncestorContainer === e.commonAncestorContainer &&
                0 === this.compareBoundaryPoints(Range.START_TO_START, e) &&
                0 === this.compareBoundaryPoints(Range.END_TO_END, e)
              );
            },
          },
        }),
        Object.defineProperties(ShadowRoot, {
          nodePath_isShadowRoot: {
            value: (e) =>
              Node.nodePath_nodeType(e) === Node.DOCUMENT_FRAGMENT_NODE &&
              "ShadowRoot" === Object.getPrototypeOf(e).constructor.name,
          },
          nodePath_host: {
            value: (e) =>
              ShadowRoot.nodePath_isShadowRoot(e)
                ? Object.nodePath_get(e, ShadowRoot, "host")
                : null,
          },
        }),
        Object.defineProperties(String, {
          _nodePath_matchAnyNonWhitespaceRegex: { value: /\S/ },
        }),
        Object.defineProperties(String.prototype, {
          nodePath_isEmptyExcludingWhitespace: {
            get() {
              return (
                !this.length ||
                !String._nodePath_matchAnyNonWhitespaceRegex.test(this)
              );
            },
          },
          nodePath_similarityTo: {
            value(t) {
              if (!t) return this.length ? 0 : 1;
              let n = Math.max(this.length, t.length);
              return n ? (n - e(this, t)) / n : 0;
            },
          },
        }),
        Object.defineProperties(Text, {
          nodePath_isText: {
            value: (e) => Node.nodePath_nodeType(e) === Node.TEXT_NODE,
          },
        }));
    }
    static ObjectRepresentationCodableInfo = { classPath: "WAS.NodePath" };
    static #e = class {
      #t;
      #n;
      #o;
      #a;
      #i;
      #s;
      #d;
      #r;
      constructor(
        e,
        t,
        {
          tag: n,
          id: o,
          classes: a,
          text: i,
          sourceMarkup: s,
          boundingClientRect: d,
        } = {},
      ) {
        (WAS.Assert.isType(e, Number),
          WAS.Assert.isType(t, Number),
          WAS.Assert.optionalIsType(n, String),
          WAS.Assert.optionalIsType(o, String),
          WAS.Assert.optionalIsType(a, String),
          WAS.Assert.optionalIsType(i, String),
          WAS.Assert.optionalIsType(s, String),
          WAS.Assert.optionalIsType(d, Object),
          (this.#t = e),
          (this.#n = t),
          (this.#d = s),
          (this.#r = d),
          e === Node.ELEMENT_NODE
            ? (WAS.Assert.isTrue(n, "Tag must be present for ELEMENT_NODEs"),
              (this.#o = n),
              (this.#a = o?.length ? o : void 0),
              (this.#i = a?.length ? a : void 0),
              (this.#s = i))
            : e === Node.TEXT_NODE && (this.#s = i));
      }
      static fromNode(e) {
        WAS.Assert.isType(e, Node);
        let t = Node.nodePath_nodeType(e),
          n = Node.nodePath_siblingIndexOfNode(e),
          o = {};
        if (Element.nodePath_isElement(e)) {
          ((o.tag = Element.nodePath_tagName(e)),
            (o.id = Element.nodePath_id(e)),
            (o.classes = Element.nodePath_className(e)));
          let t = Node.nodePath_immediateInnerTextOfNode(e);
          t.length && (o.text = t);
        } else
          Text.nodePath_isText(e) && (o.text = CharacterData.nodePath_data(e));
        o.sourceMarkup = Node.nodePath_immediateSourceMarkupOfNode(e);
        let a = Node.nodePath_getBoundingClientRect(e);
        return (
          a &&
            (o.boundingClientRect = {
              x: a.x,
              y: a.y,
              width: a.width,
              height: a.height,
            }),
          new WAS.NodePath.#e(t, n, o)
        );
      }
      static fromObjectRepresentation(e) {
        return (
          WAS.Assert.isType(e, Object),
          new WAS.NodePath.#e(e.type, e.index, e)
        );
      }
      get objectRepresentation() {
        return {
          type: this.#t,
          index: this.#n,
          tag: this.#o,
          id: this.#a,
          classes: this.#i,
          text: this.#s,
          sourceMarkup: this.#d,
          boundingClientRect: this.#r,
        };
      }
      get type() {
        return this.#t;
      }
      get index() {
        return this.#n;
      }
      get tag() {
        return this.#o;
      }
      get id() {
        return this.#a;
      }
      get classes() {
        return this.#i;
      }
      get text() {
        return this.#s;
      }
      toElementCSSSelector() {
        if (this.type !== Node.ELEMENT_NODE) return null;
        let e = CSS.escape(this.tag);
        this.id && (e += `#${CSS.escape(this.id)}`);
        for (let t of this.classes?.split(" ") ?? [])
          t.length && (e += `.${CSS.escape(t)}`);
        return e;
      }
      toString() {
        return JSON.stringify(this.objectRepresentation);
      }
      equals(e) {
        return (
          WAS.Assert.optionalIsType(e, WAS.NodePath.#e),
          !!e &&
            this.#t === e.#t &&
            this.#n === e.#n &&
            this.#o === e.#o &&
            this.#a === e.#a &&
            this.#i === e.#i &&
            this.#s === e.#s
        );
      }
    };
    static #h = 1e3;
    static #l = 500;
    static #c = 200;
    static #m = 200;
    static #N = 100;
    static #p = 10;
    #u;
    #C;
    #_;
    #P;
    #A;
    #f;
    constructor(
      e,
      {
        startContainerAdditionalComponents: t,
        startContainerOffset: n,
        endContainerAdditionalComponents: o,
        endContainerOffset: a,
      } = {},
    ) {
      (WAS.Assert.arrayContentIsType(e, WAS.NodePath.#e),
        WAS.Assert.isTrue(
          e[0]?.type == Node.DOCUMENT_NODE,
          "First path component should always be a document node.",
        ),
        (this.#u = e),
        (this.#_ = t),
        (this.#P = n),
        (this.#A = o),
        (this.#f = a));
    }
    static #g(e, t) {
      WAS.Assert.isType(e, Node);
      let n = [],
        o = e,
        a = 0;
      for (; o && (++a, !(a > 512)); ) {
        let e;
        for (
          ;
          o && (n.push(WAS.NodePath.#e.fromNode(o)), (e = o), o !== t);
          o = o.parentNode
        );
        if (e === t) break;
        let a = Document.nodePath_defaultView(e);
        if (a) {
          o = a.frameElement;
          continue;
        }
        let i = ShadowRoot.nodePath_host(e);
        i && (o = i);
      }
      return n.toReversed();
    }
    static from(e, t) {
      return e instanceof Range
        ? WAS.NodePath.fromRange(e, t)
        : WAS.NodePath.fromNode(e, t);
    }
    static fromNode(e, t) {
      let n = new WAS.NodePath(WAS.NodePath.#g(e, t));
      return ((n.#C = new WeakRef(Range.nodePath_fromNode(e))), n);
    }
    static fromRange(e, t) {
      let n = Range.nodePath_singleElementFromRange(e);
      if (n) return WAS.NodePath.fromNode(n, t);
      let o,
        a,
        i,
        s,
        d = WAS.NodePath.#g(e.commonAncestorContainer, t),
        r = Range.nodePath_startNodeFromRange(e);
      r
        ? (o = WAS.NodePath.#g(r, e.commonAncestorContainer).toSpliced(0, 1))
        : e.startContainer !== e.commonAncestorContainer
          ? ((o = WAS.NodePath.#g(
              e.startContainer,
              e.commonAncestorContainer,
            ).toSpliced(0, 1)),
            (a = e.startOffset))
          : (o = []);
      let h = Range.nodePath_endNodeFromRange(e);
      h
        ? (i = WAS.NodePath.#g(h, e.commonAncestorContainer).toSpliced(0, 1))
        : e.endContainer !== e.commonAncestorContainer
          ? ((i = WAS.NodePath.#g(
              e.endContainer,
              e.commonAncestorContainer,
            ).toSpliced(0, 1)),
            (s = e.endOffset))
          : (i = []);
      let l = new WAS.NodePath(d, {
        startContainerAdditionalComponents: o,
        startContainerOffset: a,
        endContainerAdditionalComponents: i,
        endContainerOffset: s,
      });
      return ((l.#C = new WeakRef(e)), l);
    }
    static fromObjectRepresentation(e) {
      const t = (e) => (
        WAS.Assert.isType(e, Array),
        e.map((e) => WAS.NodePath.#e.fromObjectRepresentation(e))
      );
      return Array.isArray(e)
        ? new WAS.NodePath(t(e))
        : (WAS.Assert.isType(e, Object),
          new WAS.NodePath(t(e.pathComponents), {
            startContainerAdditionalComponents:
              e.startContainerAdditionalComponents
                ? t(e.startContainerAdditionalComponents)
                : void 0,
            startContainerOffset: e.startContainerOffset ?? void 0,
            endContainerAdditionalComponents: e.endContainerAdditionalComponents
              ? t(e.endContainerAdditionalComponents)
              : void 0,
            endContainerOffset: e.endContainerOffset ?? void 0,
          }));
    }
    get objectRepresentation() {
      const e = (e) => (
        WAS.Assert.isType(e, Array),
        e.map((e) => e.objectRepresentation)
      );
      return {
        pathComponents: e(this.#u),
        startContainerAdditionalComponents: this.#_ ? e(this.#_) : void 0,
        startContainerOffset: this.#P,
        endContainerAdditionalComponents: this.#A ? e(this.#A) : void 0,
        endContainerOffset: this.#f,
      };
    }
    static nodePathIsKnownFormControlInputElement(e) {
      let t = e?.pathComponents.at(-1)?.tag?.toUpperCase();
      switch (t) {
        case "INPUT":
        case "SELECT":
        case "TEXTAREA":
          return !0;
        default:
          return !1;
      }
    }
    get pathComponents() {
      return this.#u;
    }
    get userFriendlySummary() {
      let e = this.#u.at(-1);
      return e.type === Node.TEXT_NODE
        ? e.text.trim()
        : e.text
          ? `${e.tag.toLowerCase()}: "${e.text.trim()}"`
          : e.tag.toLowerCase();
    }
    toString() {
      return JSON.stringify(this.objectRepresentation);
    }
    equals(e) {
      if ((WAS.Assert.optionalIsType(e, WAS.NodePath), !e)) return !1;
      if (this.#u.length !== e.#u.length) return !1;
      for (let t = 0; t < this.#u.length; ++t)
        if (!this.#u[t].equals(e.#u[t])) return !1;
      if (this.#_?.length !== e.#_?.length) return !1;
      for (let t = 0; t < this.#_?.length; ++t)
        if (!this.#_[t].equals(e.#_[t])) return !1;
      if (this.#A?.length !== e.#A?.length) return !1;
      for (let t = 0; t < this.#A?.length; ++t)
        if (!this.#A[t].equals(e.#A[t])) return !1;
      return this.#P === e.#P && this.#f === e.#f;
    }
    resolvedRangeInDocument(e) {
      let t = this.#C?.deref();
      if (t?.intersectsNode(e)) return t;
      if (this.#_ && this.#A) {
        let t = WAS.NodePath.#E(e, [...this.#u, ...this.#_]),
          n = WAS.NodePath.#E(e, [...this.#u, ...this.#A]);
        if (!t || !n) return null;
        let o = new Range();
        return (
          this.#P ? o.setStart(t, this.#P) : o.setStartBefore(t),
          this.#f ? o.setEnd(n, this.#f) : o.setEndAfter(n),
          (this.#C = new WeakRef(o)),
          o
        );
      }
      let n = WAS.NodePath.#E(e, this.#u);
      if (!n) return null;
      let o = Range.nodePath_fromNode(n);
      return ((this.#C = new WeakRef(o)), o);
    }
    static #E(e, t) {
      (WAS.Assert.isType(e, Node),
        WAS.Assert.isTrue(
          Document.nodePath_isDocument(e),
          "Must provide root document node in which to resolve this NodePath.",
        ));
      let n = e;
      e: for (let e = 1; e < t.length && n; ++e) {
        let o = t[e],
          a = -1,
          i = null;
        const s = () => {
          n = i;
          let o = t.length > e ? t[e + 1] : null;
          return n &&
            HTMLIFrameElement.nodePath_isHTMLIFrameElement(n) &&
            o?.type === Node.DOCUMENT_NODE
            ? (++e,
              void (n = HTMLIFrameElement.nodePath_contentWindowDocument(n)))
            : n && o?.type === Node.DOCUMENT_FRAGMENT_NODE
              ? (++e, void (n = Element.nodePath_shadowRoot(n)))
              : void 0;
        };
        if (Element.nodePath_isElement(n)) {
          let o = [],
            a = e;
          for (; a < t.length; ++a) {
            let e = t[a];
            if (e.type !== Node.ELEMENT_NODE) break;
            o.push(e.toElementCSSSelector());
          }
          if (o.length) {
            const t = (e) => o.slice(0, o.length - e).join(" > ");
            let d = null;
            for (let r = 0; r < o.length; ++r)
              if (
                ((d = Element.nodePath_querySelectorAll(n, t(r))),
                1 === d.length)
              ) {
                ((i = d.item(0)), (e = a - r - 1), s());
                continue e;
              }
          }
        }
        let d = 0;
        for (
          let e = Node.nodePath_firstChild(n);
          e;
          e = Node.nodePath_nextSibling(e)
        ) {
          if (!Node.nodePath_includeWhenComputingSiblingIndex(e)) continue;
          let t = Number.MIN_VALUE,
            n = !0;
          const s = (e, o) => {
              e ? (t += o) : (n = !1);
            },
            r = (e, o) => {
              (1 !== e && (n = !1), (t += e * o));
            },
            h = (e) => {
              e && ((n = !1), (t -= e));
            };
          if (
            (s(Node.nodePath_nodeType(e) === o.type, WAS.NodePath.#h),
            Element.nodePath_isElement(e))
          ) {
            (s(Element.nodePath_tagName(e) == o.tag, WAS.NodePath.#l),
              s(Element.nodePath_id(e) == o.id, WAS.NodePath.#c));
            let t = Element.nodePath_className(e)?.split(" ") ?? [],
              n = t.length,
              a = o.classes?.split(" ") ?? [],
              i = a.length;
            for (let e = 0; e < a.length; ++e) {
              let n = a[e],
                o = t.indexOf(n);
              -1 !== o && (t.splice(o, 1), a.splice(e, 1), --e);
            }
            (r(
              (n ? (n - t.length) / n : 1) * (i ? (i - a.length) / i : 1),
              WAS.NodePath.#N,
            ),
              r(
                Node.nodePath_immediateInnerTextOfNode(e).nodePath_similarityTo(
                  o.text,
                ),
                WAS.NodePath.#m,
              ));
          } else if (Text.nodePath_isText(e)) {
            let t = CharacterData.nodePath_data(e)?.nodePath_similarityTo(
              o.text,
            );
            r(t, WAS.NodePath.#m);
          }
          if ((h(Math.abs(d - o.index) * WAS.NodePath.#p), n)) {
            ((a = Number.NaN), (i = e));
            break;
          }
          (t > a && ((a = t), (i = e)), ++d);
        }
        s();
      }
      return n;
    }
  }));
