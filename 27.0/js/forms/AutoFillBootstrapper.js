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
    var a = t.type;
    return !a || a in n;
  }
  function n(e) {
    const n = e.composedPath()[0];
    return t(n) ? n : null;
  }
  function a(e) {
    const n = e.composedPath()[0];
    return !t(n) || n instanceof HTMLTextAreaElement ? null : n;
  }
  class i {
    #e = [];
    #t = null;
    #n(e) {
      switch (e.type) {
        case "webkitsubmit":
          return e.target;
        case "webkitautofillrequest":
        case "webkitbeforefocus":
        case "webkitbeforeblur":
        case "keydown":
          return a(e);
        case "webkitusertextinput":
          return n(e);
        default:
          return null;
      }
    }
    processAndEnqueue(e, t = !0) {
      const n = this.#n(e);
      if (!n) return;
      let a = null;
      "keydown" === e.type && (a = { key: e.key, shiftKey: e.shiftKey });
      const i = { target: n, type: e.type, data: a };
      this.#t
        ? this.#t.dispatchEvent(i)
        : (this.#e.push(i), t && o.scheduleIfNeeded());
    }
    setDelegate(e) {
      this.#t = e;
      for (const e of this.#e) this.#t.dispatchEvent(e);
      this.#e.length = 0;
    }
  }
  globalThis.eventQueue = new i();
  class s {
    #a = null;
    #i = !1;
    scheduleIfNeeded() {
      this.#i ||
        this.#a ||
        ("complete" === document.readyState
          ? this.requestImmediately()
          : (this.#a = setTimeout(this.requestImmediately.bind(this), 100)));
    }
    requestImmediately() {
      if (this.#i) return;
      if (((this.#i = !0), (this.#a = null), !window.webkit.evaluateScript))
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
    (globalThis.addGlobalEventHandler = function (e, t, n = !1, a = !1) {
      const i = [];
      (n &&
        i.push(function (t) {
          return function (n) {
            const i = n;
            window.addEventListener(
              e,
              function (e) {
                e === i && (e.defaultPrevented || t(e));
              },
              { once: !0, capture: !1, webkitTrustedOnly: a },
            );
          };
        }),
        e.startsWith("webkit") &&
          i.push(function (e) {
            return function (t) {
              (t.stopImmediatePropagation(), e(t));
            };
          }));
      let s = t;
      for (const e of i) s = e(s);
      window.addEventListener(e, s, { capture: !0, webkitTrustedOnly: a });
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
        ));
    }));
}
(void 0 === globalThis.autoFillBootstrapperInited &&
  (initAutoFillBootstrapper(), (globalThis.autoFillBootstrapperInited = !0)),
  globalThis.addEventListeners());
0;
