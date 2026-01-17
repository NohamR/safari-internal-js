//# sourceURL=__InjectedScript_WebContentLayoutAnalyzer.js
/* Copyright (c) 2025 Apple Inc. All rights reserved. */
//  Copyright (c) 2013 Apple Inc. All rights reserved.
function elementAppearsCentered(e, t) {
  var n = window.innerWidth - t.right - t.left;
  return Math.abs(n) <= 1;
}
function centeredElementIsNotAContainer(e, t) {
  if (e === document.documentElement || e === document.body) return !0;
  if (0 === t.left && t.width === window.innerWidth) return !0;
  if (!t.height) return !0;
  var n = e.innerText;
  return !n || !n.trim();
}
var WebContentLayoutAnalyzer = function () {
  ((this.centeredContainerElement = null),
    (this.rectOfCenteredContainerElementBeforeResize = null),
    (this.rectOfCenteredContainerElementAfterResize = null));
};
WebContentLayoutAnalyzer.prototype = {
  findCenteredContainerElement: function () {
    for (
      var e = null,
        t = null,
        n = document.getElementsByTagName("*"),
        r = n.length,
        i = 0;
      i < r;
      ++i
    ) {
      var o = n[i],
        l = o.getBoundingClientRect();
      elementAppearsCentered(o, l) &&
        (centeredElementIsNotAContainer(o, l) ||
          ((!t || l.width > t.width) && ((e = o), (t = l))));
    }
    return e;
  },
  collectInformationBeforeResize: function () {
    ((this.centeredContainerElement = this.findCenteredContainerElement()),
      this.centeredContainerElement &&
        (this.rectOfCenteredContainerElementBeforeResize =
          this.centeredContainerElement.getBoundingClientRect()));
  },
  collectInformationAfterResize: function () {
    this.centeredContainerElement &&
      document.contains(this.centeredContainerElement) &&
      (this.rectOfCenteredContainerElementAfterResize =
        this.centeredContainerElement.getBoundingClientRect());
  },
  layoutInformation: function () {
    var e = !1,
      t = null;
    return (
      this.rectOfCenteredContainerElementBeforeResize &&
        this.rectOfCenteredContainerElementAfterResize &&
        ((e =
          this.rectOfCenteredContainerElementBeforeResize.width ===
          this.rectOfCenteredContainerElementAfterResize.width),
        (t =
          this.rectOfCenteredContainerElementBeforeResize.left -
          this.rectOfCenteredContainerElementAfterResize.left)),
      {
        FoundCenteredContainer: !!this.centeredContainerElement,
        CenteredContainerIsFixedWidth: e,
        DistanceContainerMoved: t,
      }
    );
  },
};
var WebContentLayoutAnalyzerJS = new WebContentLayoutAnalyzer();
