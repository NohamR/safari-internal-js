//# sourceURL=__InjectedScript_AutoFillBootstrapper.js
/* Copyright (c) 2026 Apple Inc. All rights reserved. */
"use strict";
function initAutoFillBootstrapper() {
  function e(e) {
    return (
      e.isContentEditable && "textbox" === e.role && "true" !== e.ariaMultiLine
    );
  }
  function t(t) {
    if (t instanceof HTMLTextAreaElement) return !0;
    if (e(t)) return !0;
    if (!(t instanceof HTMLInputElement)) return !1;
    const n = {
      date: !0,
      "datetime-local": !0,
      email: !0,
      isindex: !0,
      month: !0,
      number: !0,
      password: !0,
      search: !0,
      tel: !0,
      telephone: !0,
      text: !0,
      time: !0,
      url: !0,
      week: !0,
    };
    var i = t.type;
    return !i || i in n;
  }
  function n(e) {
    const n = e.composedPath()[0];
    return t(n) ? n : null;
  }
  function i(e) {
    const n = e.composedPath()[0];
    return !t(n) || n instanceof HTMLTextAreaElement ? null : n;
  }
  class a {
    #e = [];
    #t = null;
    #n(e) {
      switch (e.type) {
        case "webkitsubmit":
          return e.target;
        case "webkitautofillrequest":
        case "webkitbeforefocus":
        case "webkitbeforeblur":
        case "webkitfocusedelementdisconnected":
        case "keydown":
          return i(e);
        case "webkitusertextinput":
          return n(e);
        default:
          return null;
      }
    }
    processAndEnqueue(e, t = !0) {
      const n = this.#n(e);
      if (!n) return;
      let i = null;
      "keydown" === e.type && (i = { key: e.key, shiftKey: e.shiftKey });
      const a = { target: n, type: e.type, data: i };
      this.#t
        ? this.#t.dispatchEvent(a)
        : (this.#e.push(a), t && o.scheduleIfNeeded());
    }
    setDelegate(e) {
      this.#t = e;
      for (const e of this.#e) this.#t.dispatchEvent(e);
      this.#e.length = 0;
    }
  }
  globalThis.eventQueue = new a();
  class s {
    #i = null;
    #a = !1;
    scheduleIfNeeded() {
      this.#a ||
        this.#i ||
        ("complete" === document.readyState
          ? this.requestImmediately()
          : (this.#i = setTimeout(this.requestImmediately.bind(this), 100)));
    }
    requestImmediately() {
      if (this.#a) return;
      if (((this.#a = !0), (this.#i = null), !window.webkit.evaluateScript))
        return void window.webkit.messageHandlers.controller.postMessage({
          name: "loadMainScriptRequest",
        });
      const e = {
        "safari://FormMetadataContactsAutoFillMappings.js":
          window.webkit.buffers.FormMetadataContactsAutoFillMappings,
        "safari://passwordRulesParserJS.js":
          window.webkit.buffers.PasswordRulesParserJS,
        "safari://PatternRegexpToPasswordRulesConverter.js":
          window.webkit.buffers.PatternRegexpToPasswordRulesConverter,
        "safari://FormMetadataClassification.js":
          window.webkit.buffers.FormMetadataClassification,
        "safari://FormMetadata.js": window.webkit.buffers.FormMetadata,
        "safari://FormMetadataJSController.js":
          window.webkit.buffers.FormMetadataJSController,
        "safari://FormMetadataUtilities.js":
          window.webkit.buffers.FormMetadataUtilities,
        "safari://AutomaticPasswords.js":
          window.webkit.buffers.AutomaticPasswords,
      };
      window.webkit.buffers.NodePath &&
        (e["safari://NodePath.js"] = window.webkit.buffers.NodePath);
      for (const t in e) {
        let n = e[t].asLatin1String();
        (AutoFillControllerConfig.isEngineeringBuild &&
          (n = new TextDecoder("utf8").decode(
            new Uint8Array([...n].map((e) => e.codePointAt(0))),
          )),
          window.webkit.evaluateScript(n, t));
      }
    }
  }
  const o = new s();
  ((globalThis.evaluateMainScripts = function () {
    o.requestImmediately();
  }),
    (globalThis.addGlobalEventHandler = function (e, t, n = !1, i = !1) {
      if ("webkitfocusedelementdisconnected" === e)
        return (
          window.addEventListener(
            "webkitbeforefocus",
            function (n) {
              n.target.addEventListener(e, t, {
                capture: !0,
                webkitTrustedOnly: i,
                once: !0,
              });
            },
            { capture: !0 },
          ),
          void window.addEventListener(
            "webkitbeforeblur",
            function (n) {
              n.target.removeEventListener(e, t, { capture: !0 });
            },
            { capture: !0 },
          )
        );
      const a = [];
      (n &&
        a.push(function (t) {
          return function (n) {
            const a = n;
            window.addEventListener(
              e,
              function (e) {
                e === a && (e.defaultPrevented || t(e));
              },
              { once: !0, capture: !1, webkitTrustedOnly: i },
            );
          };
        }),
        e.startsWith("webkit") &&
          a.push(function (t) {
            return function (n) {
              ("webkitbeforefocus" === e || "webkitbeforeblur" === e
                ? n.stopPropagation()
                : n.stopImmediatePropagation(),
                t(n));
            };
          }));
      let s = t;
      for (const e of a) s = e(s);
      window.addEventListener(e, s, { capture: !0, webkitTrustedOnly: i });
    }),
    (globalThis.addEventListeners = function () {
      (addGlobalEventHandler("webkitbeforefocus", (e) =>
        eventQueue.processAndEnqueue(e, AutoFillControllerConfig.isMac),
      ),
        addGlobalEventHandler("webkitbeforeblur", (e) =>
          eventQueue.processAndEnqueue(e),
        ),
        addGlobalEventHandler("webkitusertextinput", (e) =>
          eventQueue.processAndEnqueue(e),
        ),
        addGlobalEventHandler(
          "keydown",
          (e) => eventQueue.processAndEnqueue(e),
          !0,
          !0,
        ),
        addGlobalEventHandler("webkitsubmit", (e) =>
          eventQueue.processAndEnqueue(e),
        ),
        addGlobalEventHandler("webkitautofillrequest", (e) =>
          eventQueue.processAndEnqueue(e),
        ),
        addGlobalEventHandler("webkitfocusedelementdisconnected", (e) =>
          eventQueue.processAndEnqueue(e),
        ));
    }));
}
(void 0 === globalThis.autoFillBootstrapperInited &&
  (initAutoFillBootstrapper(), (globalThis.autoFillBootstrapperInited = !0)),
  globalThis.addEventListeners());
0;
