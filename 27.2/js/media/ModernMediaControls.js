//# sourceURL=__InjectedScript_ModernMediaControls.js
const MinimumSizeToShowAnyControl = 47;
const MaximumSizeToShowSmallProminentControl = 88;
if (!window.utils) {
  window.utils = {
    formattedStringForDuration: function (duration) {
      return "";
    },
  };
}
function createControls(shadowRoot, media, host) {
  if (host) {
    for (let styleSheet of host.shadowRootStyleSheets)
      shadowRoot.appendChild(document.createElement("style")).textContent =
        styleSheet;
  }
  controller = new MediaController(shadowRoot, media, host);
  if (host) host.controller = controller;
  return controller;
}
function UIString(stringToLocalize, ...replacementStrings) {
  let localizedString =
    window.UIStrings?.[stringToLocalize] ?? stringToLocalize;
  for (let replacementString of replacementStrings)
    localizedString = localizedString.replace("%s", replacementString);
  return localizedString;
}
function formatTimeByUnit(value) {
  const time = value || 0;
  const absTime = Math.abs(time);
  const sign = Math.sign(time);
  return {
    seconds: sign * Math.floor(absTime % 60).toFixed(0),
    minutes: sign * Math.floor((absTime / 60) % 60).toFixed(0),
    hours: sign * Math.floor(absTime / (60 * 60)).toFixed(0),
  };
}
function unitizeTime(value, unit) {
  let returnedUnit = UIString(unit);
  if (value > 1) returnedUnit = UIString(`${unit}s`);
  return `${value} ${returnedUnit}`;
}
class GestureRecognizer {
  constructor(target = null, delegate = null) {
    this._targetPointers = new Map();
    this.modifierKeys = { alt: false, ctrl: false, meta: false, shift: false };
    this._state = GestureRecognizer.States.Possible;
    this._enabled = true;
    this.target = target;
    this.delegate = delegate;
  }
  get state() {
    return this._state;
  }
  set state(state) {
    if (this._state === state && state !== GestureRecognizer.States.Changed)
      return;
    this._state = state;
    if (
      this.delegate &&
      typeof this.delegate.gestureRecognizerStateDidChange === "function"
    )
      this.delegate.gestureRecognizerStateDidChange(this);
  }
  get target() {
    return this._target;
  }
  set target(target) {
    if (!target || this._target === target) return;
    this._target = target;
    this._initRecognizer();
  }
  get numberOfTouches() {
    return this._targetPointers.size;
  }
  get enabled() {
    return this._enabled;
  }
  set enabled(enabled) {
    if (this._enabled === enabled) return;
    this._enabled = enabled;
    if (!enabled) {
      if (this.numberOfTouches === 0) {
        this._removeTrackingListeners();
        this.reset();
      } else this.enterCancelledState();
    }
    this._updateBaseListeners();
  }
  reset() {}
  locationInElement(element) {
    const p = new DOMPoint();
    const count = this._targetPointers.size;
    if (!count) return p;
    this._targetPointers.forEach(function (pointer) {
      p.x += pointer.pageX;
      p.y += pointer.pageY;
    });
    p.x /= count;
    p.y /= count;
    if (!element) return p;
    const wkPoint = window.webkitConvertPointFromPageToNode(
      element,
      new WebKitPoint(p.x, p.y),
    );
    return new DOMPoint(wkPoint.x, wkPoint.y);
  }
  locationInClient() {
    const p = new DOMPoint();
    const count = this._targetPointers.size;
    if (!count) return p;
    this._targetPointers.forEach(function (pointer) {
      p.x += pointer.clientX;
      p.y += pointer.clientY;
    });
    p.x /= count;
    p.y /= count;
    return p;
  }
  touchesBegan(event) {
    if (event.currentTarget !== this._target) return;
    this._captureTarget.addEventListener(
      GestureRecognizer.Events.PointerMove,
      this,
      true,
    );
    this._captureTarget.addEventListener(
      GestureRecognizer.Events.PointerUp,
      this,
      true,
    );
    this._captureTarget.addEventListener(
      GestureRecognizer.Events.PointerCancel,
      this,
      true,
    );
    this.enterPossibleState();
  }
  touchesMoved(event) {}
  touchesEnded(event) {}
  touchesCancelled(event) {}
  gestureBegan(event) {
    if (event.currentTarget !== this._target) return;
    this._target.addEventListener(
      GestureRecognizer.Events.GestureChange,
      this,
      true,
    );
    this._target.addEventListener(
      GestureRecognizer.Events.GestureEnd,
      this,
      true,
    );
    this.enterPossibleState();
  }
  gestureChanged(event) {}
  gestureEnded(event) {}
  enterPossibleState() {
    this.state = GestureRecognizer.States.Possible;
  }
  enterBeganState() {
    if (
      this.delegate &&
      typeof this.delegate.gestureRecognizerShouldBegin === "function" &&
      !this.delegate.gestureRecognizerShouldBegin(this)
    ) {
      this.enterFailedState();
      return;
    }
    this.state = GestureRecognizer.States.Began;
  }
  enterEndedState() {
    this.state = GestureRecognizer.States.Ended;
    this._removeTrackingListeners();
    this.reset();
  }
  enterCancelledState() {
    this.state = GestureRecognizer.States.Cancelled;
    this._removeTrackingListeners();
    this.reset();
  }
  enterFailedState() {
    this.state = GestureRecognizer.States.Failed;
    this._removeTrackingListeners();
    this.reset();
  }
  enterChangedState() {
    this.state = GestureRecognizer.States.Changed;
  }
  enterRecognizedState() {
    this.state = GestureRecognizer.States.Recognized;
  }
  handleEvent(event) {
    this._updateTargetTouches(event);
    this._updateKeyboardModifiers(event);
    switch (event.type) {
      case GestureRecognizer.Events.PointerDown:
        this.touchesBegan(event);
        break;
      case GestureRecognizer.Events.PointerMove:
        this.touchesMoved(event);
        break;
      case GestureRecognizer.Events.PointerUp:
        this.touchesEnded(event);
        break;
      case GestureRecognizer.Events.PointerCancel:
        this.touchesCancelled(event);
        break;
      case GestureRecognizer.Events.GestureStart:
        this.gestureBegan(event);
        break;
      case GestureRecognizer.Events.GestureChange:
        this.gestureChanged(event);
        break;
      case GestureRecognizer.Events.GestureEnd:
        this.gestureEnded(event);
        break;
    }
  }
  _initRecognizer() {
    this.reset();
    this.state = GestureRecognizer.States.Possible;
    this._updateBaseListeners();
  }
  _updateBaseListeners() {
    if (!this._target) return;
    if (this._enabled) {
      this._target.addEventListener(GestureRecognizer.Events.PointerDown, this);
      if (GestureRecognizer.SupportsGestures)
        this._target.addEventListener(
          GestureRecognizer.Events.GestureStart,
          this,
        );
    } else {
      this._target.removeEventListener(
        GestureRecognizer.Events.PointerDown,
        this,
      );
      if (GestureRecognizer.SupportsGestures)
        this._target.removeEventListener(
          GestureRecognizer.Events.GestureStart,
          this,
        );
    }
  }
  get _captureTarget() {
    if (GestureRecognizer.SupportsTouches) return this._target;
    return window;
  }
  _removeTrackingListeners() {
    this._captureTarget.removeEventListener(
      GestureRecognizer.Events.PointerMove,
      this,
      true,
    );
    this._captureTarget.removeEventListener(
      GestureRecognizer.Events.PointerUp,
      this,
      true,
    );
    this._captureTarget.removeEventListener(
      GestureRecognizer.Events.PointerCancel,
      this,
      true,
    );
    this._target.removeEventListener(
      GestureRecognizer.Events.GestureChange,
      this,
      true,
    );
    this._target.removeEventListener(
      GestureRecognizer.Events.GestureEnd,
      this,
      true,
    );
    this._targetPointers = new Map();
  }
  _updateTargetTouches(event) {
    if (!(event instanceof PointerEvent)) return;
    if (event.type === GestureRecognizer.Events.PointerDown) {
      this._targetPointers.set(event.pointerId, event);
      return;
    }
    if (event.type === GestureRecognizer.Events.PointerMove) {
      this._targetPointers.set(event.pointerId, event);
      return;
    }
    this._targetPointers.delete(event.pointerId);
  }
  _updateKeyboardModifiers(event) {
    this.modifierKeys.alt = event.altKey;
    this.modifierKeys.ctrl = event.ctrlKey;
    this.modifierKeys.meta = event.metaKey;
    this.modifierKeys.shift = event.shiftKey;
  }
}
GestureRecognizer.SupportsTouches = "createTouch" in document;
GestureRecognizer.SupportsGestures = !!window.GestureEvent;
GestureRecognizer.States = {
  Possible: "possible",
  Began: "began",
  Changed: "changed",
  Ended: "ended",
  Cancelled: "cancelled",
  Failed: "failed",
  Recognized: "ended",
};
GestureRecognizer.Events = {
  PointerDown: "pointerdown",
  PointerMove: "pointermove",
  PointerUp: "pointerup",
  PointerCancel: "pointercancel",
  GestureStart: "gesturestart",
  GestureChange: "gesturechange",
  GestureEnd: "gestureend",
};
const MOVE_TOLERANCE = GestureRecognizer.SupportsTouches ? 40 : 0;
const WAITING_FOR_NEXT_TAP_TO_START_TIMEOUT = 350;
const WAITING_FOR_TAP_COMPLETION_TIMEOUT = 750;
class TapGestureRecognizer extends GestureRecognizer {
  constructor(target, delegate) {
    super(target, delegate);
    this.numberOfTapsRequired = 1;
    this.numberOfTouchesRequired = 1;
    this.allowsRightMouseButton = false;
  }
  touchesBegan(event) {
    if (event.currentTarget !== this.target) return;
    if (event.button === 2 && !this.allowsRightMouseButton) return;
    super.touchesBegan(event);
    if (this.numberOfTouches !== this.numberOfTouchesRequired) {
      this.enterFailedState();
      return;
    }
    this._startPoint = super.locationInElement();
    this._startClientPoint = super.locationInClient();
    this._rewindTimer(WAITING_FOR_TAP_COMPLETION_TIMEOUT);
  }
  touchesMoved(event) {
    const touchLocation = super.locationInElement();
    const distance = Math.sqrt(
      Math.pow(this._startPoint.x - touchLocation.x, 2) +
        Math.pow(this._startPoint.y - touchLocation.y, 2),
    );
    if (distance > MOVE_TOLERANCE) this.enterFailedState();
  }
  touchesEnded(event) {
    this._taps++;
    if (this._taps === this.numberOfTapsRequired) {
      event.preventDefault();
      this.enterRecognizedState();
      this.reset();
    }
    this._rewindTimer(WAITING_FOR_NEXT_TAP_TO_START_TIMEOUT);
  }
  reset() {
    this._taps = 0;
    this._clearTimer();
  }
  locationInElement(element) {
    const p = this._startPoint || new DOMPoint();
    if (!element) return p;
    const wkPoint = window.webkitConvertPointFromPageToNode(
      element,
      new WebKitPoint(p.x, p.y),
    );
    return new DOMPoint(wkPoint.x, wkPoint.y);
  }
  locationInClient() {
    return this._startClientPoint || new DOMPoint();
  }
  _clearTimer() {
    window.clearTimeout(this._timerId);
    delete this._timerId;
  }
  _rewindTimer(timeout) {
    this._clearTimer();
    this._timerId = window.setTimeout(this._timerFired.bind(this), timeout);
  }
  _timerFired() {
    this.enterFailedState();
  }
}
const MAXIMUM_TIME_FOR_RECORDING_GESTURES = 100;
const MAXIMUM_DECELERATION_TIME = 500;
class PinchGestureRecognizer extends GestureRecognizer {
  constructor(target, delegate) {
    super(target, delegate);
    this.scaleThreshold = 0;
    this._scaledMinimumAmount = false;
  }
  get velocity() {
    const lastGesture = this._gestures[this._gestures.length - 1];
    if (!lastGesture) return this._velocity;
    const elapsedTime =
      Date.now() -
      (lastGesture.timeStamp + MAXIMUM_TIME_FOR_RECORDING_GESTURES);
    if (elapsedTime <= 0) return this._velocity;
    const f = Math.max(
      (MAXIMUM_DECELERATION_TIME - elapsedTime) / MAXIMUM_DECELERATION_TIME,
      0,
    );
    return this._velocity * f;
  }
  touchesBegan(event) {
    if (event.currentTarget !== this.target) return;
    if (!GestureRecognizer.SupportsGestures) {
      if (this.numberOfTouches > 2) {
        this.enterFailedState();
        return;
      }
      if (this.numberOfTouches !== 2) return;
      this._startDistance = this._distance();

      this._recordGesture(1);
      this._scaledMinimumAmount = false;
      this._updateStateWithEvent(event);
    } else if (this.numberOfTouches !== 2) {
      return;
    }
    super.touchesBegan(event);
  }
  touchesMoved(event) {
    if (GestureRecognizer.SupportsGestures) return;
    if (this.numberOfTouches !== 2) return;
    this._updateStateWithEvent(event);
  }
  touchesEnded(event) {
    if (GestureRecognizer.SupportsGestures) return;
    if (this.numberOfTouches >= 2 || !this._startDistance) return;
    if (this._scaledMinimumAmount) this.enterEndedState();
    else this.enterFailedState();
  }
  gestureBegan(event) {
    super.gestureBegan(event);

    this._recordGesture(event.scale);
    this._scaledMinimumAmount = false;
    this._updateStateWithEvent(event);
    event.preventDefault();
  }
  gestureChanged(event) {
    event.preventDefault();
    this._updateStateWithEvent(event);
  }
  gestureEnded(event) {
    if (this._scaledMinimumAmount) this.enterEndedState();
    else this.enterFailedState();
  }
  reset() {
    this.scale = 1;
    this._velocity = 0;
    this._gestures = [];
    delete this._startDistance;
  }
  _recordGesture(scale) {
    const currentTime = Date.now();
    const count = this._gestures.push({ scale: scale, timeStamp: currentTime });
    if (count <= 2) return;
    const scaleDirection =
      this._gestures[count - 1].scale >= this._gestures[count - 2].scale;
    let i = count - 3;
    for (; i >= 0; --i) {
      let gesture = this._gestures[i];
      if (
        currentTime - gesture.timeStamp > MAXIMUM_TIME_FOR_RECORDING_GESTURES ||
        this._gestures[i + 1].scale >= gesture.scale !== scaleDirection
      )
        break;
    }
    if (i > 0) this._gestures = this._gestures.slice(i + 1);
  }
  _updateStateWithEvent(event) {
    const scaleSinceStart = GestureRecognizer.SupportsGestures
      ? event.scale
      : this._distance() / this._startDistance;
    if (!this._scaledMinimumAmount) {
      if (Math.abs(1 - scaleSinceStart) >= this.scaleThreshold) {
        this._scaledMinimumAmount = true;
        this.scale = 1;
        this.enterBeganState();
      }
      return;
    }
    this._recordGesture(scaleSinceStart);
    const oldestGesture = this._gestures[0];
    const ds = scaleSinceStart - oldestGesture.scale;
    const dt = Date.now() - oldestGesture.timeStamp;
    this._velocity = dt === 0 ? 0 : (ds / dt) * 1000;
    this.scale *=
      scaleSinceStart / this._gestures[this._gestures.length - 2].scale;
    this.enterChangedState();
  }
  _distance() {
    console.assert(this.numberOfTouches === 2);
    const firstTouch = this._targetTouches[0];
    const firstTouchPoint = new DOMPoint(firstTouch.pageX, firstTouch.pageY);
    const secondTouch = this._targetTouches[1];
    const secondTouchPoint = new DOMPoint(secondTouch.pageX, secondTouch.pageY);
    return Math.sqrt(
      Math.pow(firstTouchPoint.x - secondTouchPoint.x, 2) +
        Math.pow(firstTouchPoint.y - secondTouchPoint.y, 2),
    );
  }
}
const scheduler = new (class {
  constructor() {
    this._frameID = -1;
    this._layoutCallbacks = new Set();
  }
  get hasScheduledLayoutCallbacks() {
    return this._frameID !== -1 || this._layoutCallbacks.size > 0;
  }
  scheduleLayout(callback) {
    if (typeof callback !== "function") return;
    this._layoutCallbacks.add(callback);
    this._requestFrameIfNeeded();
  }
  unscheduleLayout(callback) {
    if (typeof callback !== "function") return;
    this._layoutCallbacks.delete(callback);
  }
  flushScheduledLayoutCallbacks() {
    this._frameDidFire();
  }
  _requestFrameIfNeeded() {
    if (this._frameID === -1 && this._layoutCallbacks.size > 0)
      this._frameID = window.requestAnimationFrame(
        this._frameDidFire.bind(this),
      );
  }
  _frameDidFire() {
    if (typeof scheduler.frameWillFire === "function")
      scheduler.frameWillFire();
    this._layout();
    this._frameID = -1;
    this._requestFrameIfNeeded();
    if (typeof scheduler.frameDidFire === "function") scheduler.frameDidFire();
  }
  _layout() {
    const layoutCallbacks = this._layoutCallbacks;
    this._layoutCallbacks = new Set();
    for (let callback of layoutCallbacks) callback();
  }
})();
class LayoutTraits {
  constructor(mode) {
    this._mode = mode;
  }
  get mode() {
    return this._mode;
  }
  get isFullscreen() {
    return (
      this._mode == LayoutTraits.Mode.Fullscreen ||
      this._mode == LayoutTraits.Mode.NarrowViewer
    );
  }
  mediaControlsClass() {
    throw "Derived class must implement this function.";
  }
  supportingObjectClasses() {
    return [
      AirplaySupport,
      AudioSupport,
      CloseSupport,
      ControlsVisibilitySupport,
      FullscreenSupport,
      MuteSupport,
      OverflowSupport,
      PiPSupport,
      PlacardSupport,
      PlaybackSupport,
      ScrubbingSupport,
      SeekBackwardSupport,
      SeekForwardSupport,
      SkipBackSupport,
      SkipForwardSupport,
      StartSupport,
      StatusSupport,
      TimeControlSupport,
      TracksSupport,
      VolumeSupport,
    ];
  }
  resourceDirectory() {
    throw "Derived class must implement this function.";
  }
  controlsNeverAvailable() {
    throw "Derived class must implement this function.";
  }
  supportsIconWithFullscreenVariant() {
    throw "Derived class must implement this function.";
  }
  supportsDurationTimeLabel() {
    throw "Derived class must implement this function.";
  }
  skipDuration() {
    throw "Derived class must implement this function.";
  }
  controlsDependOnPageScaleFactor() {
    throw "Derived class must implement this function.";
  }
  promoteSubMenusWhenShowingMediaControlsContextMenu() {
    throw "Derived class must implement this function.";
  }
  supportsTouches() {
    return GestureRecognizer.SupportsTouches;
  }
  supportsAirPlay() {
    throw "Derived class must implement this function.";
  }
  supportsPiP() {
    throw "Derived class must implement this function.";
  }
  inheritsBorderRadius() {
    throw "Derived class must implement this function.";
  }
}
LayoutTraits.Mode = { Inline: 0, Fullscreen: 1, NarrowViewer: 2 };
window.layoutTraitsClasses = {};
const dirtyNodes = new Set();
const nodesRequiringChildrenUpdate = new Set();
class LayoutNode {
  constructor(stringOrElement) {
    if (!stringOrElement) this.element = document.createElement("div");
    else if (stringOrElement instanceof Element) this.element = stringOrElement;
    else if (
      typeof stringOrElement === "string" ||
      stringOrElement instanceof String
    )
      this.element = elementFromString(stringOrElement);
    this._parent = null;
    this._children = [];
    this._x = 0;
    this._y = 0;
    this._width = 0;
    this._height = 0;
    this._visible = true;
    this._needsLayout = false;
    this._dirtyProperties = new Set();
    this._pendingDOMManipulation = LayoutNode.DOMManipulation.None;
  }
  get x() {
    return this._x;
  }
  set x(x) {
    if (x === this._x) return;
    this._x = x;
    this.markDirtyProperty("x");
  }
  get y() {
    return this._y;
  }
  set y(y) {
    if (y === this._y) return;
    this._y = y;
    this.markDirtyProperty("y");
  }
  get width() {
    return this._width;
  }
  set width(width) {
    if (width === this._width) return;
    this._width = width;
    this.markDirtyProperty("width");
    this.layout();
  }
  get height() {
    return this._height;
  }
  set height(height) {
    if (height === this._height) return;
    this._height = height;
    this.markDirtyProperty("height");
    this.layout();
  }
  get visible() {
    return this._visible;
  }
  set visible(flag) {
    if (flag === this._visible) return;
    this._visible = flag;
    this.markDirtyProperty("visible");
  }
  get needsLayout() {
    return (
      this._needsLayout ||
      this._pendingDOMManipulation !== LayoutNode.DOMManipulation.None ||
      this._dirtyProperties.size > 0
    );
  }
  set needsLayout(flag) {
    if (this.needsLayout === flag) return;
    this._needsLayout = flag;
    this._updateDirtyState();
  }
  get parent() {
    return this._parent;
  }
  get children() {
    return this._children;
  }
  set children(children) {
    if (children.length === this._children.length) {
      let arraysDiffer = false;
      for (let i = children.length - 1; i >= 0; --i) {
        if (children[i] !== this._children[i]) {
          arraysDiffer = true;
          break;
        }
      }
      if (!arraysDiffer) return;
    }
    this._updatingChildren = true;
    while (this._children.length) this.removeChild(this._children[0]);
    for (let child of children) this.addChild(child);
    delete this._updatingChildren;
    this.didChangeChildren();
  }
  parentOfType(type) {
    let node = this;
    while ((node = node._parent)) {
      if (node instanceof type) return node;
    }
    return null;
  }
  addChild(child, index) {
    child.remove();
    if (index === undefined || index < 0 || index > this._children.length)
      index = this._children.length;
    this._children.splice(index, 0, child);
    child._parent = this;
    if (!this._updatingChildren) this.didChangeChildren();
    child._markNodeManipulation(LayoutNode.DOMManipulation.Addition);
    return child;
  }
  insertBefore(newSibling, referenceSibling) {
    return this.addChild(newSibling, this._children.indexOf(referenceSibling));
  }
  insertAfter(newSibling, referenceSibling) {
    const index = this._children.indexOf(referenceSibling);
    return this.addChild(newSibling, index + 1);
  }
  removeChild(child) {
    if (child._parent !== this) return;
    const index = this._children.indexOf(child);
    if (index === -1) return;
    this.willRemoveChild(child);
    this._children.splice(index, 1);
    child._parent = null;
    if (!this._updatingChildren) this.didChangeChildren();
    child._markNodeManipulation(LayoutNode.DOMManipulation.Removal);
    return child;
  }
  remove() {
    if (this._parent instanceof LayoutNode)
      return this._parent.removeChild(this);
  }
  markDirtyProperty(propertyName) {
    const hadProperty = this._dirtyProperties.has(propertyName);
    this._dirtyProperties.add(propertyName);
    if (!hadProperty) this._updateDirtyState();
  }
  computedValueForStyleProperty(propertyName) {
    return window.getComputedStyle(this.element).getPropertyValue(propertyName);
  }
  computedValueForStylePropertyInPx(propertyName) {
    const value = this.computedValueForStyleProperty(propertyName);
    if (!value) return 0;
    if (!value.endsWith("px")) return 0;
    return parseFloat(value);
  }
  layout() {}
  commit() {
    if (this._pendingDOMManipulation === LayoutNode.DOMManipulation.Removal) {
      const parent = this.element.parentNode;
      if (parent) parent.removeChild(this.element);
    }
    for (let propertyName of this._dirtyProperties)
      this.commitProperty(propertyName);
    this._dirtyProperties.clear();
    if (this._pendingDOMManipulation === LayoutNode.DOMManipulation.Addition)
      nodesRequiringChildrenUpdate.add(this.parent);
  }
  commitProperty(propertyName) {
    const style = this.element.style;
    switch (propertyName) {
      case "x":
        style.left = `${this._x}px`;
        break;
      case "y":
        style.top = `${this._y}px`;
        break;
      case "width":
        style.width = `${this._width}px`;
        break;
      case "height":
        style.height = `${this._height}px`;
        break;
      case "visible":
        if (this._visible) style.removeProperty("display");
        else style.display = "none";
        break;
    }
  }
  willRemoveChild(child) {}
  didChangeChildren() {}
  _markNodeManipulation(manipulation) {
    this._pendingDOMManipulation = manipulation;
    this._updateDirtyState();
  }
  _updateDirtyState() {
    if (this.needsLayout) {
      dirtyNodes.add(this);
      scheduler.scheduleLayout(performScheduledLayout);
    } else {
      dirtyNodes.delete(this);
      if (dirtyNodes.size === 0)
        scheduler.unscheduleLayout(performScheduledLayout);
    }
  }
  _updateChildren() {
    let nextChildElement = null;
    const element = this.element;
    for (let i = this.children.length - 1; i >= 0; --i) {
      let child = this.children[i];
      let childElement = child.element;
      if (
        child._pendingDOMManipulation === LayoutNode.DOMManipulation.Addition
      ) {
        element.insertBefore(childElement, nextChildElement);
        child._pendingDOMManipulation = LayoutNode.DOMManipulation.None;
      }
      nextChildElement = childElement;
    }
  }
}
LayoutNode.DOMManipulation = { None: 0, Removal: 1, Addition: 2 };
function performScheduledLayout() {
  const previousDirtyNodes = Array.from(dirtyNodes);
  dirtyNodes.clear();
  previousDirtyNodes.forEach((node) => {
    node._needsLayout = false;
    node.layout();
    node.commit();
  });
  nodesRequiringChildrenUpdate.forEach((node) => node._updateChildren());
  nodesRequiringChildrenUpdate.clear();
}
function elementFromString(elementString) {
  const element = document.createElement("div");
  element.innerHTML = elementString;
  return element.firstElementChild;
}
class LayoutItem extends LayoutNode {
  constructor({ element = null, layoutDelegate = null } = {}) {
    super(element);
    this.layoutDelegate = layoutDelegate;
  }
  get layoutTraits() {
    if (!this.layoutDelegate?.layoutTraits)
      throw "No layout traits specified via layoutDelegate or overriden layouTraits() getter";
    return this.layoutDelegate.layoutTraits;
  }
}
const Icons = {
  Airplay: { name: "Airplay", type: "svg", label: UIString("AirPlay") },
  AirplayPlacard: {
    name: "airplay-placard",
    type: "png",
    label: UIString("AirPlay"),
  },
  Close: { name: "X", type: "svg", label: UIString("Close") },
  Ellipsis: { name: "Ellipsis", type: "svg", label: UIString("More\u2026") },
  EnterFullscreen: {
    name: "EnterFullscreen",
    type: "svg",
    label: UIString("Enter Full Screen"),
  },
  EnterPiP: {
    name: "PipIn",
    type: "svg",
    label: UIString("Enter Picture in Picture"),
  },
  ExitFullscreen: {
    name: "ExitFullscreen",
    type: "svg",
    label: UIString("Exit Full Screen"),
  },
  Forward: { name: "Forward", type: "svg", label: UIString("Forward") },
  InvalidCircle: {
    name: "InvalidCircle",
    type: "pdf",
    label: UIString("Invalid"),
  },
  InvalidPlacard: {
    name: "invalid-placard",
    type: "png",
    label: UIString("Invalid"),
  },
  Overflow: { name: "Overflow", type: "svg", label: UIString("More\u2026") },
  Pause: { name: "Pause", type: "svg", label: UIString("Pause") },
  PiPPlacard: {
    name: "pip-placard",
    type: "png",
    label: UIString("Picture in Picture"),
  },
  Play: { name: "Play", type: "svg", label: UIString("Play") },
  PlayCircle: { name: "PlayCircle", type: "pdf", label: UIString("Play") },
  Rewind: { name: "Rewind", type: "svg", label: UIString("Rewind") },
  SkipBack10: {
    name: "SkipBack10",
    type: "svg",
    label: UIString("Skip Back 10 Seconds"),
  },
  SkipBack15: {
    name: "SkipBack15",
    type: "svg",
    label: UIString("Skip Back 15 Seconds"),
  },
  SkipForward10: {
    name: "SkipForward10",
    type: "svg",
    label: UIString("Skip Forward 10 Seconds"),
  },
  SkipForward15: {
    name: "SkipForward15",
    type: "svg",
    label: UIString("Skip Forward 15 Seconds"),
  },
  SpinnerSprite: {
    name: "SpinnerSprite",
    type: "png",
    label: UIString("Loading\u2026"),
  },
  Tracks: {
    name: "MediaSelector",
    type: "svg",
    label: UIString("Media Selection"),
  },
  Volume0: { name: "Volume0", type: "svg", label: UIString("Mute") },
  Volume0RTL: { name: "Volume0-RTL", type: "svg", label: UIString("Mute") },
  Volume1: { name: "Volume1", type: "svg", label: UIString("Mute") },
  Volume1RTL: { name: "Volume1-RTL", type: "svg", label: UIString("Mute") },
  Volume2: { name: "Volume2", type: "svg", label: UIString("Mute") },
  Volume2RTL: { name: "Volume2-RTL", type: "svg", label: UIString("Mute") },
  Volume3: { name: "Volume3", type: "svg", label: UIString("Mute") },
  Volume3RTL: { name: "Volume3-RTL", type: "svg", label: UIString("Mute") },
  VolumeMuted: { name: "VolumeMuted", type: "svg", label: UIString("Unmute") },
  VolumeMutedRTL: {
    name: "VolumeMuted-RTL",
    type: "svg",
    label: UIString("Unmute"),
  },
};
const MimeTypes = {
  pdf: "application/pdf",
  png: "image/png",
  svg: "image/svg+xml",
};
const IconsWithFullscreenVariants = [
  Icons.Airplay,
  Icons.Tracks,
  Icons.EnterPiP,
];
const iconService = new (class IconService {
  constructor() {
    this.images = {};
  }
  imageForIconAndLayoutTraits(icon, layoutTraits) {
    const [fileName, resourceDirectory] =
      this._fileNameAndResourceDirectoryForIconAndLayoutTraits(
        icon,
        layoutTraits,
      );
    const path = `${resourceDirectory}/${fileName}.${icon.type}`;
    let image = this.images[path];
    if (image) return image;
    if (utils?.createImageForIconNameAndType)
      image = this.images[path] = utils.createImageForIconNameAndType(
        fileName,
        icon.type,
      );
    else {
      image = this.images[path] = new Image();
      image.src = `${this.directoryPath}/${path}`;
    }
    return image;
  }
  _fileNameAndResourceDirectoryForIconAndLayoutTraits(icon, layoutTraits) {
    let resourceDirectory = layoutTraits.resourceDirectory();
    let iconName = icon.name;
    if (
      layoutTraits.supportsIconWithFullscreenVariant() &&
      IconsWithFullscreenVariants.includes(icon)
    )
      iconName += "-fullscreen";
    let fileName = iconName;
    if (icon.type === "png")
      fileName = `${iconName}@${window.devicePixelRatio}x`;
    return [fileName, resourceDirectory];
  }
})();
class BackgroundTint extends LayoutNode {
  constructor() {
    super(
      `<div class="background-tint"><div class="blur"></div><div class="tint"></div></div>`,
    );
  }
}
const TenMinutes = 10 * 60;
const OneHour = 6 * TenMinutes;
const TenHours = 10 * OneHour;
const MinimumTimeControlWidth = 160;
const IdealMinimumTimeControlWidth = 200;
class TimeControl extends LayoutItem {
  constructor(layoutDelegate) {
    super({ element: `<div class="time-control"></div>`, layoutDelegate });
    this.style = TimeControl.Style.Side;
    this._shouldShowDurationTimeLabel =
      this.layoutTraits.supportsDurationTimeLabel();
    this.elapsedTimeLabel = new TimeLabel(TimeLabel.Type.Elapsed);
    this.scrubber = new Slider(this.layoutDelegate, "scrubber");
    this.durationTimeLabel = new TimeLabel(TimeLabel.Type.Duration);
    this.remainingTimeLabel = new TimeLabel(TimeLabel.Type.Remaining);
    this.activityIndicator = new LayoutNode(
      `<div class="activity-indicator"></div>`,
    );
    for (let segmentClassName of ["n", "ne", "e", "se", "s", "sw", "w", "nw"])
      this.activityIndicator.element.appendChild(
        document.createElement("div"),
      ).className = segmentClassName;
    this._duration = 0;
    this._currentTime = 0;
    this._loading = false;
    this._supportsSeeking = true;
    if (this._shouldShowDurationTimeLabel) {
      this.element.classList.add("duration");
      this.durationTimeLabel.element.addEventListener("click", this);
      this.remainingTimeLabel.element.addEventListener("click", this);
    }
    this.needsLayout = true;
  }
  set duration(duration) {
    if (this._duration === duration) return;
    this._duration = duration;
    this.needsLayout = true;
  }
  set currentTime(currentTime) {
    if (this._currentTime === currentTime) return;
    this._currentTime = currentTime;
    this.needsLayout = true;
  }
  get loading() {
    return this._loading;
  }
  set loading(flag) {
    if (this._loading === flag) return;
    this._loading = flag;
    this.scrubber.disabled = this._loading || !this._supportsSeeking;
    this.needsLayout = true;
  }
  get supportsSeeking() {
    return this._supportsSeeking;
  }
  set supportsSeeking(flag) {
    if (this._supportsSeeking === flag) return;
    this._supportsSeeking = flag;
    this.scrubber.disabled = this._loading || !this._supportsSeeking;
    this.needsLayout = true;
  }
  get minimumWidth() {
    return MinimumTimeControlWidth;
  }
  get idealMinimumWidth() {
    return IdealMinimumTimeControlWidth;
  }
  layout() {
    super.layout();
    this._performIdealLayout();
  }
  handleEvent(event) {
    switch (event.type) {
      case "click":
        switch (event.target) {
          case this.durationTimeLabel.element:
          case this.remainingTimeLabel.element:
            this._toggleDurationRemainingLabel();
            break;
        }
    }
  }
  _performIdealLayout() {
    let children = [
      this._loading ? this.activityIndicator : this.elapsedTimeLabel,
      this.scrubber,
      this.remainingTimeLabel,
    ];
    if (this._shouldShowDurationTimeLabel)
      children.push(this.durationTimeLabel);
    this.children = children;
    if (this._loading) {
      this.durationTimeLabel.value = NaN;
      this.remainingTimeLabel.value = NaN;
    } else {
      const shouldShowZeroDurations =
        isNaN(this._duration) || this._duration > maxNonLiveDuration;
      if (shouldShowZeroDurations) {
        this.elapsedTimeLabel.value = 0;
        this.durationTimeLabel.value = 0;
        this.remainingTimeLabel.value = 0;
        this.elapsedTimeLabel.numberOfDigits = 4;
        this.durationTimeLabel.numberOfDigits = 4;
        this.remainingTimeLabel.numberOfDigits = 4;
      } else {
        let numberOfDigitsForTimeLabels;
        if (this._duration < OneHour) numberOfDigitsForTimeLabels = 4;
        else if (this._duration < TenHours) numberOfDigitsForTimeLabels = 5;
        else numberOfDigitsForTimeLabels = 6;
        this.elapsedTimeLabel.value = this._currentTime;
        this.durationTimeLabel.value = this._duration;
        this.remainingTimeLabel.value = this._currentTime - this._duration;
        this.elapsedTimeLabel.numberOfDigits = numberOfDigitsForTimeLabels;
        this.durationTimeLabel.numberOfDigits = numberOfDigitsForTimeLabels;
        this.remainingTimeLabel.numberOfDigits = numberOfDigitsForTimeLabels;
      }
    }
    if (this._duration)
      this.scrubber.value = this._currentTime / this._duration;
  }
  updateScrubberLabel() {
    this.scrubber.inputAccessibleLabel = this.elapsedTimeLabel.value;
  }
  _toggleDurationRemainingLabel() {
    if (!this._shouldShowDurationTimeLabel) return;
    this.element.classList.toggle("duration");
    this.element.classList.toggle("remaining");
  }
}
TimeControl.Style = { Above: "above", Side: "side", Below: "below" };
const MinusSignWidthsForDigits = { 3: 6, 4: 5, 5: 6, 6: 5 };
const WidthsForDigits = { 3: 27, 4: 35, 5: 46, 6: 54 };
class TimeLabel extends LayoutNode {
  constructor(type) {
    super(`<div role="text" class="time-label"></div>`);
    this._type = type;
    this.value = 0;
    this.numberOfDigits = 4;
    switch (this._type) {
      case TimeLabel.Type.Elapsed:
        this.element.setAttribute("id", "time-label-elapsed");
        break;
      case TimeLabel.Type.Remaining:
        this.element.setAttribute("id", "time-label-remaining");
        break;
      case TimeLabel.Type.Duration:
        this.element.setAttribute("id", "time-label-duration");
        break;
    }
  }
  get value() {
    return this._value;
  }
  set value(value) {
    if (value === this._value || (isNaN(value) && isNaN(this._value))) return;
    this._value = value;
    this.markDirtyProperty("value");
  }
  get numberOfDigits() {
    return this._numberOfDigits;
  }
  set numberOfDigits(numberOfDigits) {
    if (this._numberOfDigits === numberOfDigits) return;
    if (numberOfDigits < 4 || numberOfDigits > 6)
      throw new RangeError("TimeLabel numerOfDigits must be between 4 and 6.");
    this._numberOfDigits = numberOfDigits;
    let formatterOptions = {
      style: "digital",
      fractionalDigits: 0,
      hoursDisplay: "auto",
      minutesDisplay: "always",
      secondsDisplay: "always",
    };
    if (numberOfDigits >= 5) formatterOptions.hoursDisplay = "always";
    if (numberOfDigits == 6) formatterOptions.hours = "2-digit";
    this._formatter = new Intl.DurationFormat(undefined, formatterOptions);
    this.markDirtyProperty("value");
  }
  setValueWithNumberOfDigits(value, numberOfDigits) {
    this.value = value;
    this.numberOfDigits = numberOfDigits;
  }
  commitProperty(propertyName) {
    if (propertyName === "value") {
      this.element.textContent = this._formattedTime();
      const timeAsString = utils.formattedStringForDuration(this.value);
      switch (this._type) {
        case TimeLabel.Type.Elapsed:
          this.element.setAttribute(
            "aria-label",
            UIString("Elapsed: %s", timeAsString),
          );
          break;
        case TimeLabel.Type.Remaining:
          this.element.setAttribute(
            "aria-label",
            UIString("Remaining: %s", timeAsString),
          );
          break;
        case TimeLabel.Type.Duration:
          this.element.setAttribute(
            "aria-label",
            UIString("Duration: %s", timeAsString),
          );
          break;
      }
      if (this.parent instanceof TimeControl) this.parent.updateScrubberLabel();
    } else super.commitProperty(propertyName);
  }
  _formattedTime() {
    if (isNaN(this._value)) return "--:--";
    return this._formatter.format(formatTimeByUnit(this._value));
  }
}
function doubleDigits(x) {
  if (x < 10) return `0${x}`;
  return `${x}`;
}
TimeLabel.Type = { Elapsed: 0, Remaining: 1, Duration: 2 };
class SliderBase extends LayoutNode {
  constructor(layoutDelegate, cssClassName = "") {
    super(`<div class="slider ${cssClassName}"></div>`);
    console.assert(
      this.constructor !== SliderBase && this instanceof SliderBase,
      this,
    );
    this._layoutDelegate = layoutDelegate;
    this.appearanceContainer = new LayoutNode(`<div class="appearance"></div>`);
    this._input = new LayoutNode(
      `<input type="range" min="0" max="1" step="0.001" />`,
    );
    this._input.element.addEventListener("pointerdown", this);
    this._input.element.addEventListener("input", this);
    this._input.element.addEventListener("change", this);
    this.value = 0;
    this.enabled = true;
    this.isActive = false;
    this._disabled = false;
    this._secondaryValue = 0;
    this._allowsRelativeScrubbing = false;
    this._startValue = NaN;
    this._startPosition = NaN;
    this.children = [this.appearanceContainer, this._input];
  }
  set inputAccessibleLabel(timeValue) {
    this._input.element.setAttribute(
      "aria-valuetext",
      utils.formattedStringForDuration(timeValue),
    );
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(flag) {
    if (this._disabled === flag) return;
    this._disabled = flag;
    this.markDirtyProperty("disabled");
  }
  get value() {
    if (this._value !== undefined) return this._value;
    return parseFloat(this._input.element.value);
  }
  set value(value) {
    if (this._animatedValue) delete this._animatedValue;
    this._setValueInternal(value);
  }
  setValueAnimated(value) {
    if (this.isActive || this._value == value) return;
    this._valueAnimation = {
      start: this.value,
      end: value,
      startTime: window.performance.now(),
    };
    const duration = 150;
    const animate = (currentTime) => {
      if (!this._valueAnimation) return;
      const elapsedTime = currentTime - this._valueAnimation.startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const animatedValue =
        this._valueAnimation.start +
        (this._valueAnimation.end - this._valueAnimation.start) * progress;
      this._setValueInternal(animatedValue);
      if (progress == 1) delete this._valueAnimation;
      else requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
  _setValueInternal(value) {
    if (this.isActive || this._value == value) return;
    this._value = value;
    this.markDirtyProperty("value");
    this.needsLayout = true;
  }
  get secondaryValue() {
    return this._secondaryValue;
  }
  set secondaryValue(secondaryValue) {
    if (this._secondaryValue === secondaryValue) return;
    this._secondaryValue = secondaryValue;
    this.needsLayout = true;
  }
  get allowsRelativeScrubbing() {
    return this._allowsRelativeScrubbing;
  }
  set allowsRelativeScrubbing(allowsRelativeScrubbing) {
    this._allowsRelativeScrubbing = !!allowsRelativeScrubbing;
    this.element.classList.toggle(
      "allows-relative-scrubbing",
      this._allowsRelativeScrubbing,
    );
  }
  handleEvent(event) {
    switch (event.type) {
      case "pointerdown":
        this._handlePointerdownEvent(event);
        return;
      case "pointermove":
        this._handlePointermoveEvent(event);
        return;
      case "pointerup":
        this._handlePointerupEvent(event);
        return;
      case "change":
      case "input":
        this._valueDidChange();
        return;
    }
  }
  commitProperty(propertyName) {
    switch (propertyName) {
      case "value":
        this._input.element.value = this._value;
        delete this._value;
        break;
      case "disabled":
        this.element.classList.toggle("disabled", this._disabled);
        break;
      default:
        super.commitProperty(propertyName);
        break;
    }
  }
  _handlePointerdownEvent(event) {
    delete this._valueAnimation;
    this._pointerupTarget = this._interactionEndTarget();
    this._pointerupTarget.addEventListener("pointerup", this, {
      capture: true,
    });
    if (this._allowsRelativeScrubbing)
      this._pointerupTarget.addEventListener("pointermove", this, {
        capture: true,
      });
    delete this._value;
    if (this._allowsRelativeScrubbing) {
      this._startValue = parseFloat(this._input.element.value);
      this._startPosition = this._playbackProgress(event.pageX);
    }
    if (
      this.uiDelegate &&
      typeof this.uiDelegate.controlValueWillStartChanging === "function"
    )
      this.uiDelegate.controlValueWillStartChanging(this);
    this.isActive = true;
    this.appearanceContainer.element.classList.add("changing");
    this.needsLayout = true;
  }
  _interactionEndTarget() {
    const mediaControls = this.parentOfType(MediaControls);
    if (mediaControls?.layoutTraits.supportsTouches())
      return mediaControls.element;
    return !mediaControls || !mediaControls.layoutTraits.isFullscreen
      ? window
      : mediaControls.element;
  }
  _valueDidChange() {
    if (
      this.uiDelegate &&
      typeof this.uiDelegate.controlValueDidChange === "function"
    )
      this.uiDelegate.controlValueDidChange(this);
    this.needsLayout = true;
  }
  _handlePointermoveEvent(event) {
    if (
      !this._allowsRelativeScrubbing ||
      isNaN(this._startValue) ||
      isNaN(this._startPosition)
    )
      return;
    let value =
      this._startValue +
      this._playbackProgress(event.pageX) -
      this._startPosition;
    this._input.element.value = Math.min(Math.max(0, value), 1);
    this._valueDidChange();
  }
  _handlePointerupEvent(event) {
    this._pointerupTarget.removeEventListener("pointerup", this, {
      capture: true,
    });
    this._pointerupTarget.removeEventListener("pointermove", this, {
      capture: true,
    });
    delete this._pointerupTarget;
    this._startValue = NaN;
    this._startPosition = NaN;
    this.isActive = false;
    this.appearanceContainer.element.classList.remove("changing");
    if (
      this.uiDelegate &&
      typeof this.uiDelegate.controlValueDidStopChanging === "function"
    )
      this.uiDelegate.controlValueDidStopChanging(this);
    this.needsLayout = true;
  }
  _playbackProgress(pageX) {
    let x = window.webkitConvertPointFromPageToNode(
      this.element,
      new WebKitPoint(pageX, 0),
    ).x;
    if (this._layoutDelegate?.scaleFactor)
      x *= this._layoutDelegate.scaleFactor;
    return x / this.element.clientWidth;
  }
}
class Slider extends SliderBase {
  constructor(
    layoutDelegate,
    cssClassName = "",
    knobStyle = Slider.KnobStyle.Circle,
  ) {
    super(layoutDelegate, `default ${cssClassName}`);
    this._primaryFill = new LayoutNode(`<div class="primary"></div>`);
    this._trackFill = new LayoutNode(`<div class="track"></div>`);
    this._secondaryFill = new LayoutNode(`<div class="secondary"></div>`);
    this._trackFill.children = [this._secondaryFill];
    let fillContainer = new LayoutNode(`<div class="fill"></div>`);
    this._knob = new LayoutNode(`<div class="knob ${knobStyle}"></div>`);
    fillContainer.children = [this._primaryFill, this._knob, this._trackFill];
    this.appearanceContainer.children = [fillContainer];
    this.height = 16;
    this._knobStyle = knobStyle;
  }
  get knobStyle() {
    return this._knobStyle;
  }
  set knobStyle(knobStyle) {
    if (this._knobStyle === knobStyle) return;
    this._knob.element.classList.remove(this._knobStyle);
    this._knobStyle = knobStyle;
    this._knob.element.classList.add(this._knobStyle);
    this.needsLayout = true;
  }
  commit() {
    super.commit();
    this._primaryFill.element.style.flexGrow = 100 * this.value;
    this._trackFill.element.style.flexGrow = 100 * (1 - this.value);
  }
}
Slider.KnobStyle = { Circle: "circle", Bar: "bar", None: "none", Pill: "pill" };
class Button extends LayoutItem {
  constructor({
    layoutDelegate = null,
    cssClassName = "",
    iconName = "",
  } = {}) {
    super({ element: "<button />", layoutDelegate });
    if (!!cssClassName) this.element.classList.add(cssClassName);
    this.style = Button.Styles.Bar;
    this.image = this.addChild(new LayoutNode(`<picture></picture>`));
    this._scaleFactor = 1;
    this._imageSource = null;
    this._iconName = "";
    if (!!iconName) this.iconName = iconName;
    this._enabled = true;
    if (this.layoutTraits.supportsTouches())
      this._tapGestureRecognizer = new TapGestureRecognizer(this.element, this);
    else this.element.addEventListener("click", this);
  }
  get enabled() {
    return this._enabled;
  }
  set enabled(flag) {
    if (this._enabled === flag) return;
    this._enabled = flag;
    if (this.layoutDelegate && typeof this.layoutDelegate.layout === "function")
      this.layoutDelegate.layout();
  }
  get iconName() {
    return this._iconName;
  }
  set iconName(iconName) {
    if (this._iconName === iconName) return;
    this._loadImage(iconName);
    this.element.setAttribute("aria-label", iconName.label);
    this.element.setAttribute("id", iconName.name);
  }
  get on() {
    return this.element.classList.contains("on");
  }
  set on(flag) {
    this.element.classList.toggle("on", flag);
  }
  get style() {
    return this._style;
  }
  set style(style) {
    if (style === this._style) return;
    this.element.classList.remove(this._style);
    this.element.classList.add(style);
    this._style = style;
    if (style === Button.Styles.Bar && this.children.length == 2)
      this.children[0].remove();
    else if (this.children.length == 1) this.addChild(new BackgroundTint(), 0);
  }
  get scaleFactor() {
    return this._scaleFactor;
  }
  set scaleFactor(scaleFactor) {
    if (this._scaleFactor === scaleFactor) return;
    this._scaleFactor = scaleFactor;
    this._updateImageMetrics();
  }
  get contextMenuOptions() {
    return {};
  }
  get circular() {
    return this.element.classList.contains("circular");
  }
  set circular(circular) {
    this.element.classList.toggle("circular", circular);
    this._updateImageMetrics();
  }
  handleEvent(event) {
    if (event.target === this._imageSource) {
      if (event.type === "load") this._imageSourceDidLoad();
      else if (event.type === "error")
        console.error(
          `Button failed to load, iconName = ${this._iconName.name}, layoutTraits = ${this.layoutTraits}, src = ${this._imageSource.src}`,
        );
    } else if (event.type === "click" && event.currentTarget === this.element)
      this._notifyDelegateOfActivation();
  }
  gestureRecognizerStateDidChange(recognizer) {
    if (
      this._tapGestureRecognizer === recognizer &&
      recognizer.state === GestureRecognizer.States.Recognized
    )
      this._notifyDelegateOfActivation();
  }
  commitProperty(propertyName) {
    if (propertyName === "maskImage")
      this.image.element.style.maskImage = `url(${this._imageSource.src})`;
    else super.commitProperty(propertyName);
  }
  _notifyDelegateOfActivation() {
    if (
      this._enabled &&
      this.uiDelegate &&
      typeof this.uiDelegate.buttonWasPressed === "function"
    )
      this.uiDelegate.buttonWasPressed(this);
  }
  _loadImage(iconName) {
    if (this._imageSource) this._imageSource.removeEventListener("load", this);
    this._imageSource = iconService.imageForIconAndLayoutTraits(
      iconName,
      this.layoutTraits,
    );
    this._iconName = iconName;
    if (this._imageSource.complete) this._updateImage();
    else {
      this._imageSource.addEventListener("load", this);
      this._imageSource.addEventListener("error", this);
    }
  }
  _imageSourceDidLoad() {
    this._imageSource.removeEventListener("load", this);
    this._updateImage();
  }
  _updateImage() {
    this.markDirtyProperty("maskImage");
    this._updateImageMetrics();
  }
  _updateImageMetrics() {
    if (!this._imageSource) return;
    let width = this._imageSource.width * this._scaleFactor;
    let height = this._imageSource.height * this._scaleFactor;
    if (this._iconName.type === "png" || this._iconName.type === "pdf") {
      width /= window.devicePixelRatio;
      height /= window.devicePixelRatio;
    }
    if (this.circular) {
      width = Math.max(width, height);
      height = width;
    }
    if (this.image.width === width && this.image.height === height) return;
    this.image.width = width;
    this.image.height = height;
    this.width = width;
    this.height = height;
    if (this.layoutDelegate) this.layoutDelegate.needsLayout = true;
  }
}
Button.Styles = {
  Bar: "bar",
  Corner: "corner",
  Center: "center",
  Rounded: "rounded",
  SmallCenter: "small-center",
};
class PlayPauseButton extends Button {
  constructor(layoutDelegate) {
    super({ cssClassName: "play-pause", iconName: Icons.Play, layoutDelegate });
  }
  get playing() {
    return this.iconName === Icons.Pause;
  }
  set playing(flag) {
    if (this.playing === flag) return;
    this.iconName = flag ? Icons.Pause : Icons.Play;
  }
  commit() {
    super.commit();
    this.element.classList.toggle("paused", !this.playing);
  }
}
class SkipBackButton extends Button {
  constructor(layoutDelegate) {
    super({ cssClassName: "skip-back", layoutDelegate });
    this.iconName = Icons["SkipBack" + this.layoutTraits.skipDuration()];
  }
}
class SkipForwardButton extends Button {
  constructor(layoutDelegate) {
    super({ cssClassName: "skip-forward", layoutDelegate });
    this.iconName = Icons["SkipForward" + this.layoutTraits.skipDuration()];
  }
}
class MuteButton extends Button {
  constructor(layoutDelegate) {
    super({
      cssClassName: "mute",
      iconName: Icons.VolumeMutedRTL,
      layoutDelegate,
    });
    this._volume = 1;
    this._muted = true;
    this._usesLTRUserInterfaceLayoutDirection = undefined;
  }
  get volume() {
    return this._volume;
  }
  set volume(volume) {
    if (this._volume === volume) return;
    this._volume = volume;
    this.needsLayout = true;
  }
  get muted() {
    return this._muted;
  }
  set muted(flag) {
    if (this._muted === flag) return;
    this._muted = flag;
    this.needsLayout = true;
  }
  set usesLTRUserInterfaceLayoutDirection(usesLTRUserInterfaceLayoutDirection) {
    if (
      usesLTRUserInterfaceLayoutDirection ===
      this._usesLTRUserInterfaceLayoutDirection
    )
      return;
    this._usesLTRUserInterfaceLayoutDirection =
      usesLTRUserInterfaceLayoutDirection;
    this.needsLayout = true;
  }
  layout() {
    if (this._muted || this._volume < 0)
      this.iconName = this._usesLTRUserInterfaceLayoutDirection
        ? Icons.VolumeMuted
        : Icons.VolumeMutedRTL;
    else if (this._volume < 0.25)
      this.iconName = this._usesLTRUserInterfaceLayoutDirection
        ? Icons.Volume0
        : Icons.Volume0RTL;
    else if (this._volume < 0.5)
      this.iconName = this._usesLTRUserInterfaceLayoutDirection
        ? Icons.Volume1
        : Icons.Volume1RTL;
    else if (this._volume < 0.75)
      this.iconName = this._usesLTRUserInterfaceLayoutDirection
        ? Icons.Volume2
        : Icons.Volume2RTL;
    else
      this.iconName = this._usesLTRUserInterfaceLayoutDirection
        ? Icons.Volume3
        : Icons.Volume3RTL;
  }
}
class AirplayButton extends Button {
  constructor(layoutDelegate) {
    super({ cssClassName: "airplay", iconName: Icons.Airplay, layoutDelegate });
  }
}
class PiPButton extends Button {
  constructor(layoutDelegate) {
    super({ cssClassName: "pip", iconName: Icons.EnterPiP, layoutDelegate });
  }
  get contextMenuOptions() {
    return { includePictureInPicture: true };
  }
}
class TracksButton extends Button {
  constructor(layoutDelegate) {
    super({ cssClassName: "tracks", iconName: Icons.Tracks, layoutDelegate });
  }
  get contextMenuOptions() {
    return { includeLanguages: true, includeSubtitles: true };
  }
}
class FullscreenButton extends Button {
  constructor(layoutDelegate) {
    super({ cssClassName: "fullscreen", layoutDelegate });
    this.iconName = this.layoutTraits.isFullscreen
      ? Icons.ExitFullscreen
      : Icons.EnterFullscreen;
  }
}
class SeekButton extends Button {
  constructor(options) {
    super(options);
    this.element.addEventListener("mousedown", this);
  }
  handleEvent(event) {
    if (event.type === "mousedown" && event.currentTarget === this.element)
      this._didStartPressing();
    else if (event.type === "mouseup") this._didStopPressing();
    else super.handleEvent(event);
  }
  _didStartPressing() {
    const mediaControls = this.parentOfType(MediaControls);
    if (!mediaControls) return;
    this._mouseupTarget = mediaControls.element;
    this._mouseupTarget.addEventListener("mouseup", this, true);
    this._notifyDelegateOfPressingState(true);
  }
  _didStopPressing() {
    this._mouseupTarget.removeEventListener("mouseup", this, true);
    this._notifyDelegateOfPressingState(false);
  }
  _notifyDelegateOfPressingState(isPressed) {
    if (
      this._enabled &&
      this.uiDelegate &&
      typeof this.uiDelegate.buttonPressedStateDidChange === "function"
    )
      this.uiDelegate.buttonPressedStateDidChange(this, isPressed);
  }
}
class RewindButton extends SeekButton {
  constructor(layoutDelegate) {
    super({ cssClassName: "rewind", iconName: Icons.Rewind, layoutDelegate });
  }
}
class ForwardButton extends SeekButton {
  constructor(layoutDelegate) {
    super({ cssClassName: "forward", iconName: Icons.Forward, layoutDelegate });
  }
}
class OverflowButton extends Button {
  constructor(layoutDelegate) {
    super({
      cssClassName: "overflow",
      iconName: Icons.Overflow,
      layoutDelegate,
    });
    this._defaultContextMenuOptions = {};
    this._extraContextMenuOptions = {};
  }
  get visible() {
    return super.visible;
  }
  set visible(flag) {
    function isEmpty(contextMenuOptions) {
      for (let key in contextMenuOptions) return false;
      return true;
    }
    super.visible =
      flag &&
      (!isEmpty(this._defaultContextMenuOptions) ||
        !isEmpty(this._extraContextMenuOptions));
  }
  get contextMenuOptions() {
    return {
      ...this._defaultContextMenuOptions,
      ...this._extraContextMenuOptions,
    };
  }
  addExtraContextMenuOptions(contextMenuOptions) {
    if (!this.enabled) return;
    for (let key in contextMenuOptions)
      this._extraContextMenuOptions[key] = contextMenuOptions[key];
    this.visible = true;
  }
  clearExtraContextMenuOptions() {
    this._extraContextMenuOptions = {};
    this.visible = false;
  }
  set defaultContextMenuOptions(defaultContextMenuOptions) {
    this._defaultContextMenuOptions = defaultContextMenuOptions || {};
    this.visible = true;
  }
}
class CloseButton extends Button {
  constructor(layoutDelegate) {
    super({ cssClassName: "close", iconName: Icons.Close, layoutDelegate });
  }
}
class ButtonsContainer extends LayoutNode {
  constructor({
    children,
    leftMargin,
    rightMargin,
    buttonMargin,
    cssClassName,
  } = {}) {
    super(`<div class="buttons-container ${cssClassName ?? ""}"></div>`);
    this.leftMargin = leftMargin ?? ButtonsContainer.Defaults.LeftMargin;
    this.rightMargin = rightMargin ?? ButtonsContainer.Defaults.RightMargin;
    this.buttonMargin = buttonMargin ?? ButtonsContainer.Defaults.ButtonMargin;
    this.children = children ?? [];
  }
  static Defaults = { LeftMargin: 16, RightMargin: 16, ButtonMargin: 16 };
  willRemoveChild(child) {
    super.willRemoveChild(child);
    child.visible = true;
    child.x = 0;
  }
  didChangeChildren() {
    super.didChangeChildren();
    this.layout();
  }
  layout() {
    super.layout();
    let x = this.leftMargin;
    let numberOfVisibleButtons = 0;
    this._children.forEach((button) => {
      button.visible = button.enabled && !button.dropped;
      if (!button.visible) return;
      button.x = x;
      x += button.width + this.buttonMargin;
      numberOfVisibleButtons++;
    });
    if (numberOfVisibleButtons)
      this.width = x - this.buttonMargin + this.rightMargin;
    else this.width = this.buttonMargin + this.rightMargin;
  }
}
class StatusLabel extends LayoutItem {
  constructor(layoutDelegate) {
    super({ element: `<div class="status-label"></div>`, layoutDelegate });
    this._text = "";
    this.minimumWidth = 120;
    this.idealMinimumWidth = this.minimumWidth;
  }
  get text() {
    return this._text;
  }
  set text(text) {
    if (text === this._text) return;
    this._text = text;
    this.markDirtyProperty("text");
    if (this.layoutDelegate) this.layoutDelegate.needsLayout = true;
  }
  get enabled() {
    return this._text !== "";
  }
  commitProperty(propertyName) {
    if (propertyName === "text") this.element.textContent = this._text;
    else super.commitProperty(propertyName);
  }
}
class ControlsBar extends LayoutNode {
  constructor(cssClassName = "") {
    super(`<div role="group" class="controls-bar ${cssClassName}"></div>`);
    this._hasBackgroundTint = true;
    this._translation = new DOMPoint();
    this._backgroundTint = this.addChild(new BackgroundTint());
  }
  get hasBackgroundTint() {
    return this._hasBackgroundTint;
  }
  set hasBackgroundTint(hasBackgroundTint) {
    if (this._hasBackgroundTint == hasBackgroundTint) return;
    this._hasBackgroundTint = hasBackgroundTint;
    if (hasBackgroundTint) {
      console.assert(!this._backgroundTint.parent);
      this.addChild(this._backgroundTint, 0);
    } else {
      console.assert(this._backgroundTint.parent === this);
      this._backgroundTint.remove();
    }
  }
  get children() {
    return super.children;
  }
  set children(children) {
    if (this._hasBackgroundTint)
      super.children = [this._backgroundTint].concat(children);
    else super.children = children;
  }
  get translation() {
    return new DOMPoint(this._translation.x, this._translation.y);
  }
  set translation(point) {
    if (this._translation.x === point.x && this._translation.y === point.y)
      return;
    this._translation = new DOMPoint(point.x, point.y);
    this.markDirtyProperty("translation");
  }
  commitProperty(propertyName) {
    if (propertyName === "translation")
      this.element.style.transform = `translate(${this._translation.x}px, ${this._translation.y}px)`;
    else super.commitProperty(propertyName);
  }
}
const AutoHideDelayMS = 4000;
class AutoHideController {
  constructor(mediaControls) {
    this._mediaControls = mediaControls;
    this._pointerIdentifiersPreventingAutoHide = new Set();
    this._pointerIdentifiersPreventingAutoHideForHover = new Set();
    this._mediaControls.element.addEventListener("pointermove", this);
    this._mediaControls.element.addEventListener("pointerdown", this);
    this._mediaControls.element.addEventListener("pointerup", this);
    this._mediaControls.element.addEventListener("pointerleave", this);
    this._mediaControls.element.addEventListener("pointerout", this);
    if (this._mediaControls.layoutTraits.supportsTouches())
      this._tapGestureRecognizer = new TapGestureRecognizer(
        this._mediaControls.element,
        this,
      );
    this.autoHideDelay = AutoHideDelayMS;
  }
  get fadesWhileIdle() {
    return this._fadesWhileIdle;
  }
  set fadesWhileIdle(flag) {
    if (this._fadesWhileIdle == flag) return;
    this._fadesWhileIdle = flag;
    if (!this._fadesWhileIdle) this._mediaControls.faded = false;
    this._resetAutoHideTimer();
  }
  get hasSecondaryUIAttached() {
    return this._hasSecondaryUIAttached;
  }
  set hasSecondaryUIAttached(flag) {
    if (this._hasSecondaryUIAttached == flag) return;
    this._hasSecondaryUIAttached = flag;
    this._resetAutoHideTimer();
  }
  handleEvent(event) {
    if (event.currentTarget !== this._mediaControls.element) return;
    switch (event.type) {
      case "pointermove":
        if (event.pointerType === "mouse") this._mediaControls.faded = false;
        if (
          this._mediaControls.isPointInControls(
            new DOMPoint(event.clientX, event.clientY),
          )
        ) {
          this._pointerIdentifiersPreventingAutoHideForHover.add(
            event.pointerId,
          );
          this._cancelAutoHideTimer();
        } else {
          this._pointerIdentifiersPreventingAutoHideForHover.delete(
            event.pointerId,
          );
          this._resetAutoHideTimer();
        }
        return;
      case "pointerleave":
        this._pointerIdentifiersPreventingAutoHide.delete(event.pointerId);
        this._pointerIdentifiersPreventingAutoHideForHover.delete(
          event.pointerId,
        );
        if (event.pointerType == "mouse") this._autoHideTimerFired();
        this._resetAutoHideTimer();
        return;
      case "pointerdown":
        this._nextTapCanFadeControls = !this._mediaControls.faded;
        this._pointerIdentifiersPreventingAutoHide.add(event.pointerId);
        if (event.pointerType === "mouse") this._mediaControls.faded = false;
        this._cancelAutoHideTimer();
        return;
      case "pointerup":
        this._pointerIdentifiersPreventingAutoHide.delete(event.pointerId);
        this._resetAutoHideTimer();
        return;
    }
  }
  gestureRecognizerStateDidChange(recognizer) {
    if (
      this._tapGestureRecognizer !== recognizer ||
      recognizer.state !== GestureRecognizer.States.Recognized
    )
      return;
    this._mediaControls.faded =
      this._nextTapCanFadeControls &&
      !this._mediaControls.isPointInControls(recognizer.locationInClient());
    delete this._nextTapCanFadeControls;
  }
  mediaControlsFadedStateDidChange() {
    this._resetAutoHideTimer();
  }
  mediaControlsBecameInvisible() {
    this._cancelAutoHideTimer();
  }
  get _canFadeControls() {
    return this._fadesWhileIdle && !this._hasSecondaryUIAttached;
  }
  _cancelAutoHideTimer() {
    window.clearTimeout(this._autoHideTimer);
    delete this._autoHideTimer;
  }
  _resetAutoHideTimer() {
    this._cancelAutoHideTimer();
    if (this._mediaControls.faded || !this._canFadeControls) return;
    this._autoHideTimer = window.setTimeout(
      this._autoHideTimerFired.bind(this),
      this.autoHideDelay,
    );
  }
  _autoHideTimerFired() {
    delete this._autoHideTimer;
    this._mediaControls.faded =
      this._canFadeControls &&
      !this._pointerIdentifiersPreventingAutoHide.size &&
      !this._pointerIdentifiersPreventingAutoHideForHover.size;
  }
}
class MediaControls extends LayoutNode {
  constructor({ width = 300, height = 150, layoutTraits = null } = {}) {
    super(`<div class="media-controls"></div>`);
    if (layoutTraits?.inheritsBorderRadius())
      this.element.classList.add("inherits-border-radius");
    this._scaleFactor = 1;
    this.width = width;
    this.height = height;
    this.layoutTraits = layoutTraits;
    this.playPauseButton = new PlayPauseButton(this);
    this.pipButton = new PiPButton(this);
    this.fullscreenButton = new FullscreenButton(this);
    this.muteButton = new MuteButton(this);
    this.tracksButton = new TracksButton(this);
    this.overflowButton = new OverflowButton(this);
    this.statusLabel = new StatusLabel(this);
    this.timeControl = new TimeControl(this);
    this.bottomControlsBar = new ControlsBar("bottom");
    this.autoHideController = new AutoHideController(this);
    this.autoHideController.fadesWhileIdle = false;
    this.autoHideController.hasSecondaryUIAttached = false;
    this._placard = null;
    this.invalidPlacard = new InvalidPlacard(this);
    this.fullscreenPlacard = new FullscreenPlacard(this);
    if (this.layoutTraits?.supportsPiP())
      this.pipPlacard = new PiPPlacard(this);
    else this.pipPlacard = null;
    if (this.layoutTraits?.supportsAirPlay()) {
      this.airplayButton = new AirplayButton(this);
      this.airplayPlacard = new AirplayPlacard(this);
    } else {
      this.airplayButton = null;
      this.airplayPlacard = null;
    }
    this.element.addEventListener("focusin", this);
    window.addEventListener("dragstart", this, true);
  }
  get visible() {
    return super.visible;
  }
  set visible(flag) {
    if (this.visible === flag) return;
    if (flag && !this.visible) this.faded = false;
    else if (!flag) this.autoHideController.mediaControlsBecameInvisible();
    super.visible = flag;
    if (flag) this.layout();
    if (
      this.delegate &&
      typeof this.delegate.mediaControlsVisibilityDidChange === "function"
    )
      this.delegate.mediaControlsVisibilityDidChange();
  }
  get faded() {
    return !!this._faded;
  }
  set faded(flag) {
    if (this._faded === flag) return;
    this._faded = flag;
    this.markDirtyProperty("faded");
    this.autoHideController.mediaControlsFadedStateDidChange();
    if (
      this.delegate &&
      typeof this.delegate.mediaControlsFadedStateDidChange === "function"
    )
      this.delegate.mediaControlsFadedStateDidChange();
  }
  get usesLTRUserInterfaceLayoutDirection() {
    return this.element.classList.contains(
      "uses-ltr-user-interface-layout-direction",
    );
  }
  set usesLTRUserInterfaceLayoutDirection(flag) {
    this.needsLayout = this.usesLTRUserInterfaceLayoutDirection !== flag;
    this.element.classList.toggle(
      "uses-ltr-user-interface-layout-direction",
      flag,
    );
    this.muteButton.usesLTRUserInterfaceLayoutDirection =
      this.usesLTRUserInterfaceLayoutDirection;
  }
  get scaleFactor() {
    return this._scaleFactor;
  }
  set scaleFactor(scaleFactor) {
    if (this._scaleFactor === scaleFactor) return;
    this._scaleFactor = scaleFactor;
    this.markDirtyProperty("scaleFactor");
  }
  get placard() {
    return this._placard;
  }
  set placard(placard) {
    if (this._placard === placard) return;
    this._placard = placard;
    this.layout();
  }
  placardPreventsControlsBarDisplay() {
    return this._placard && this._placard !== this.airplayPlacard;
  }
  fadeIn() {
    this.element.classList.add("fade-in");
  }
  isPointInControls(point) {
    let ancestor = this.element.parentNode;
    while (ancestor && !(ancestor instanceof ShadowRoot))
      ancestor = ancestor.parentNode;
    const shadowRoot = ancestor;
    if (!shadowRoot) return false;
    const tappedElement = shadowRoot.elementFromPoint(point.x, point.y);
    return this.children.some((child) => child.element.contains(tappedElement));
  }
  handleEvent(event) {
    if (event.type === "focusin" && event.currentTarget === this.element)
      this.faded = false;
    else if (
      event.type === "dragstart" &&
      this.isPointInControls(new DOMPoint(event.clientX, event.clientY))
    )
      event.preventDefault();
  }
  layout() {
    super.layout();
    if (this._placard) {
      this._placard.width = this.width;
      this._placard.height = this.height;
    }
  }
  commitProperty(propertyName) {
    if (propertyName === "scaleFactor") {
      const zoom = 1 / this._scaleFactor;

      if (zoom < 1) {
        this.element.style.transform = `scale(${zoom})`;
        this.element.style.removeProperty("zoom");
      } else {
        this.element.style.zoom = zoom;
        this.element.style.removeProperty("transform");
      }
    } else if (propertyName === "faded")
      this.element.classList.toggle("faded", this.faded);
    else super.commitProperty(propertyName);
  }
  disable() {
    this.element.removeEventListener("focusin", this);
    window.removeEventListener("dragstart", this, true);
  }
  reenable() {
    this.element.addEventListener("focusin", this);
    window.addEventListener("dragstart", this, true);
  }
}
class BackgroundClickDelegateNotifier {
  constructor(mediaControls) {
    this._mediaControls = mediaControls;
    mediaControls.element.addEventListener("mousedown", this);
    mediaControls.element.addEventListener("click", this);
  }
  handleEvent(event) {
    const mediaControls = this._mediaControls;
    if (event.currentTarget !== mediaControls.element) return;
    switch (event.type) {
      case "mousedown":
        this._receivedMousedown = true;
        return;
      case "click":
        if (
          this._receivedMousedown &&
          event.target === mediaControls.element &&
          mediaControls.delegate &&
          typeof mediaControls.delegate.macOSControlsBackgroundWasClicked ===
            "function"
        )
          mediaControls.delegate.macOSControlsBackgroundWasClicked();
        delete this._receivedMousedown;
        return;
    }
  }
}
class InlineMediaControls extends MediaControls {
  constructor(options) {
    super(options);
    this.element.classList.add("inline");
    this.skipBackButton = new SkipBackButton(this);
    this.skipForwardButton = new SkipForwardButton(this);
    this.topLeftControlsBar = new ControlsBar("top-left");
    this._topLeftControlsBarContainer = this.topLeftControlsBar.addChild(
      new ButtonsContainer(),
    );
    this.topRightControlsBar = new ControlsBar("top-right");
    this._topRightControlsBarContainer = this.topRightControlsBar.addChild(
      new ButtonsContainer(),
    );
    this.leftContainer = new ButtonsContainer({ cssClassName: "left" });
    this.rightContainer = new ButtonsContainer({ cssClassName: "right" });
    this.centerControlsBar = new ControlsBar("center");
    this._centerControlsBarContainer = this.centerControlsBar.addChild(
      new ButtonsContainer(),
    );
    this._shouldUseAudioLayout = false;
    this._shouldUseSingleBarLayout = false;
    this.showsStartButton = false;
    this._updateBottomControlsBarLabel();
  }
  set shouldUseAudioLayout(flag) {
    if (this._shouldUseAudioLayout === flag) return;
    this._shouldUseAudioLayout = flag;
    this.element.classList.toggle("audio", flag);
    this.needsLayout = true;
    this._updateBottomControlsBarLabel();
  }
  set shouldUseSingleBarLayout(flag) {
    if (this._shouldUseSingleBarLayout === flag) return;
    this._shouldUseSingleBarLayout = flag;
    this.needsLayout = true;
  }
  get showsStartButton() {
    return !!this._showsStartButton;
  }
  set showsStartButton(flag) {
    if (this._showsStartButton === flag) return;
    this._showsStartButton = flag;
    this.element.classList.toggle("shows-start-button", flag);
    this.layout();
  }
  layout() {
    super.layout();
    const children = [];
    if (this.placard) {
      children.push(this.placard);
      if (this.placardPreventsControlsBarDisplay()) {
        this.children = children;
        return;
      }
    }
    if (!this.visible) {
      this.children = children;
      return;
    }
    if (
      !this._shouldUseAudioLayout &&
      (this.width < MinimumSizeToShowAnyControl ||
        this.height < MinimumSizeToShowAnyControl)
    ) {
      this.children = children;
      return;
    }
    if (this._showsStartButton) {
      this.playPauseButton.style =
        this.width <= MaximumSizeToShowSmallProminentControl ||
        this.height <= MaximumSizeToShowSmallProminentControl
          ? Button.Styles.SmallCenter
          : Button.Styles.Center;
      this.children = [this.playPauseButton];
      return;
    }
    if (!this.bottomControlsBar) return;
    this._topLeftControlsBarContainer.children = this.topLeftContainerButtons();
    this._topLeftControlsBarContainer.layout();
    this.topLeftControlsBar.width = this._topLeftControlsBarContainer.width;
    this.topLeftControlsBar.visible =
      this._topLeftControlsBarContainer.children.some(
        (button) => button.visible,
      );
    this._centerControlsBarContainer.children = this.centerContainerButtons();
    this._centerControlsBarContainer.layout();
    this.centerControlsBar.width = this._centerControlsBarContainer.width;
    this.centerControlsBar.visible =
      this._centerControlsBarContainer.children.some(
        (button) => button.visible,
      );
    if (!this._inlineInsideMargin)
      this._inlineInsideMargin = this.computedValueForStylePropertyInPx(
        "--inline-controls-inside-margin",
      );
    this.bottomControlsBar.width = this._shouldUseAudioLayout
      ? this.width
      : this.width - 2 * this._inlineInsideMargin;
    const centerControl = this.statusLabel.enabled
      ? this.statusLabel
      : this.timeControl;
    let minimumCenterControlWidth = centerControl.minimumWidth;
    const minimumControlsBarWidthForCenterControl =
      minimumCenterControlWidth +
      this.leftContainer.leftMargin +
      this.rightContainer.rightMargin;
    if (
      this.bottomControlsBar.width < minimumControlsBarWidthForCenterControl
    ) {
      this.playPauseButton.style = Button.Styles.Corner;
      if (!this._shouldUseSingleBarLayout && this.height >= 82) {
        children.push(this.topLeftControlsBar);
        this._addTopRightBarWithMuteButtonToChildren(children);
      }
      this.children = children.concat(this.playPauseButton);
      return;
    }
    minimumCenterControlWidth = centerControl.idealMinimumWidth;
    this.bottomControlsBar.visible = true;
    this.playPauseButton.style = Button.Styles.Bar;
    this.leftContainer.children = this.leftContainerButtons();
    this.rightContainer.children = this.rightContainerButtons();
    this.rightContainer.children
      .concat(this.leftContainer.children)
      .forEach((button) => delete button.dropped);
    this.muteButton.style = this.preferredMuteButtonStyle;
    this.overflowButton.clearExtraContextMenuOptions();
    for (let button of this.droppableButtons()) {
      if (!button.enabled) continue;
      this.leftContainer.layout();
      this.rightContainer.layout();
      if (
        this.leftContainer.width +
          minimumCenterControlWidth +
          this.rightContainer.width <
        this.bottomControlsBar.width
      )
        break;
      button.dropped = true;
      if (button !== this.overflowButton)
        this.overflowButton.addExtraContextMenuOptions(
          button.contextMenuOptions,
        );
    }
    let collapsableButtons = this.collapsableButtons();
    let shownRightContainerButtons = this.rightContainer.children.filter(
      (button) => button.enabled && !button.dropped,
    );
    let maximumRightContainerButtonCount =
      this.maximumRightContainerButtonCountOverride ?? 2;
    for (
      let i = shownRightContainerButtons.length - 1;
      i >= 0 &&
      shownRightContainerButtons.length > maximumRightContainerButtonCount;
      --i
    ) {
      let button = shownRightContainerButtons[i];
      if (!collapsableButtons.has(button)) continue;
      button.dropped = true;
      this.overflowButton.addExtraContextMenuOptions(button.contextMenuOptions);
    }
    this.leftContainer.layout();
    this.rightContainer.layout();
    const visibleRightContainerButtons = this.rightContainer.children.filter(
      (button) => button.visible,
    );
    const widthLeftOfTimeControl =
      this.leftContainer.children.length > 0
        ? this.leftContainer.width
        : this.leftContainer.leftMargin;
    const widthRightOfTimeControl =
      visibleRightContainerButtons.length > 0
        ? this.rightContainer.width
        : this.rightContainer.rightMargin;
    centerControl.x = widthLeftOfTimeControl;
    centerControl.width =
      this.bottomControlsBar.width -
      widthLeftOfTimeControl -
      widthRightOfTimeControl;
    centerControl.layout();
    const controlsBarChildren = [];
    if (this.leftContainer.children.length)
      controlsBarChildren.push(this.leftContainer);
    controlsBarChildren.push(centerControl);
    if (visibleRightContainerButtons.length) {
      controlsBarChildren.push(this.rightContainer);
      this.rightContainer.x =
        this.bottomControlsBar.width - this.rightContainer.width;
    }

    if (!this._inlineBottomControlsBarHeight)
      this._inlineBottomControlsBarHeight =
        this.computedValueForStylePropertyInPx("--inline-controls-bar-height");
    this.bottomControlsBar.y = Math.max(
      0,
      this.height -
        this._inlineBottomControlsBarHeight -
        this._inlineInsideMargin,
    );
    this.bottomControlsBar.children = controlsBarChildren;
    if (!this._shouldUseAudioLayout && !this._shouldUseSingleBarLayout)
      children.push(this.topLeftControlsBar);
    if (
      !this._shouldUseAudioLayout &&
      !this._shouldUseSingleBarLayout &&
      this._centerControlsBarContainer.children.length
    )
      children.push(this.centerControlsBar);
    children.push(this.bottomControlsBar);
    if (
      this.muteButton.style === Button.Styles.Corner ||
      (this.muteButton.dropped &&
        !this._shouldUseAudioLayout &&
        !this._shouldUseSingleBarLayout)
    )
      this._addTopRightBarWithMuteButtonToChildren(children);
    this.children = children;
  }
  commitProperty(propertyName) {
    if (propertyName !== "visible") super.commitProperty(propertyName);
  }
  get preferredMuteButtonStyle() {
    return this._shouldUseAudioLayout || this._shouldUseSingleBarLayout
      ? Button.Styles.Bar
      : Button.Styles.Corner;
  }
  topLeftContainerButtons() {
    if (this._shouldUseSingleBarLayout) return [];
    if (this.usesLTRUserInterfaceLayoutDirection)
      return [this.fullscreenButton, this.pipButton];
    return [this.pipButton, this.fullscreenButton];
  }
  leftContainerButtons() {
    return [this.skipBackButton, this.playPauseButton, this.skipForwardButton];
  }
  centerContainerButtons() {
    return [];
  }
  rightContainerButtons() {
    const buttons = [];
    if (this._shouldUseAudioLayout)
      buttons.push(this.muteButton, this.airplayButton, this.tracksButton);
    else if (this._shouldUseSingleBarLayout)
      buttons.push(
        this.muteButton,
        this.airplayButton,
        this.pipButton,
        this.tracksButton,
        this.fullscreenButton,
      );
    else {
      if (this.preferredMuteButtonStyle === Button.Styles.Bar)
        buttons.push(this.muteButton);
      buttons.push(this.airplayButton, this.tracksButton);
    }
    buttons.push(this.overflowButton);
    return buttons.filter((button) => button !== null);
  }
  droppableButtons() {
    let buttons = this.collapsableButtons();
    buttons.add(this.skipForwardButton);
    buttons.add(this.skipBackButton);
    if (
      this._shouldUseSingleBarLayout ||
      this.preferredMuteButtonStyle === Button.Styles.Bar
    )
      buttons.add(this.muteButton);
    buttons.add(this.airplayButton);
    if (this._shouldUseSingleBarLayout) buttons.add(this.fullscreenButton);
    buttons.add(this.overflowButton);
    buttons.delete(null);
    return buttons;
  }
  collapsableButtons() {
    let buttons = new Set([this.tracksButton]);
    if (this._shouldUseSingleBarLayout) buttons.add(this.pipButton);
    return buttons;
  }
  _updateBottomControlsBarLabel() {
    this.bottomControlsBar.element.setAttribute(
      "aria-label",
      this._shouldUseAudioLayout
        ? UIString("Audio Controls")
        : UIString("Video Controls"),
    );
  }
  _addTopRightBarWithMuteButtonToChildren(children) {
    if (!this.muteButton.enabled) return;
    delete this.muteButton.dropped;
    this.muteButton.style = Button.Styles.Bar;
    this._topRightControlsBarContainer.children = [this.muteButton];
    this._topRightControlsBarContainer.layout();
    this.topRightControlsBar.width = this._topRightControlsBarContainer.width;
    children.push(this.topRightControlsBar);
  }
}
class IOSInlineMediaControls extends InlineMediaControls {
  constructor(options = {}) {
    options.layoutTraits = new IOSLayoutTraits(LayoutTraits.Mode.Inline);
    super(options);
    this.element.classList.add("ios");
    this._updateGestureRecognizers();
  }
  get showsStartButton() {
    return super.showsStartButton;
  }
  set showsStartButton(flag) {
    super.showsStartButton = flag;
    this._updateGestureRecognizers();
  }
  get visible() {
    return super.visible;
  }
  set visible(flag) {
    super.visible = flag;
    this._updateGestureRecognizers();
  }
  layout() {
    if (this.timeControl) {
      this.timeControl.scrubber.allowsRelativeScrubbing =
        this._shouldUseMultilineLayout;
      this.timeControl.scrubber.knobStyle = this._shouldUseMultilineLayout
        ? Slider.KnobStyle.None
        : Slider.KnobStyle.Circle;
    }
    if (this.playPauseButton)
      this.playPauseButton.scaleFactor = this._shouldUseMultilineLayout ? 3 : 1;
    if (this.skipForwardButton)
      this.skipForwardButton.scaleFactor = this._shouldUseMultilineLayout
        ? 2
        : 1;
    if (this.skipBackButton)
      this.skipBackButton.scaleFactor = this._shouldUseMultilineLayout ? 2 : 1;
    if (this._topLeftControlsBarContainer) {
      this._topLeftControlsBarContainer.leftMargin = this
        ._shouldUseMultilineLayout
        ? 2
        : ButtonsContainer.Defaults.LeftMargin;
      this._topLeftControlsBarContainer.rightMargin = this
        ._shouldUseMultilineLayout
        ? 2
        : ButtonsContainer.Defaults.RightMargin;
    }
    if (this._topRightControlsBarContainer) {
      this._topRightControlsBarContainer.leftMargin = this
        ._shouldUseMultilineLayout
        ? 2
        : ButtonsContainer.Defaults.LeftMargin;
      this._topRightControlsBarContainer.rightMargin = this
        ._shouldUseMultilineLayout
        ? 2
        : ButtonsContainer.Defaults.RightMargin;
    }
    if (this.leftContainer)
      this.leftContainer.leftMargin = this._shouldUseMultilineLayout
        ? 2
        : ButtonsContainer.Defaults.LeftMargin;
    if (this.rightContainer)
      this.rightContainer.rightMargin = this._shouldUseMultilineLayout
        ? 8
        : ButtonsContainer.Defaults.RightMargin;
    if (this._centerControlsBarContainer)
      this._centerControlsBarContainer.buttonMargin = this
        ._shouldUseMultilineLayout
        ? 48
        : ButtonsContainer.Defaults.ButtonMargin;
    if (this.topLeftControlsBar)
      this.topLeftControlsBar.hasBackgroundTint =
        !this._shouldUseMultilineLayout;
    if (this.topRightControlsBar)
      this.topRightControlsBar.hasBackgroundTint =
        !this._shouldUseMultilineLayout;
    if (this.centerControlsBar)
      this.centerControlsBar.hasBackgroundTint =
        !this._shouldUseMultilineLayout;
    if (this.bottomControlsBar)
      this.bottomControlsBar.hasBackgroundTint =
        !this._shouldUseMultilineLayout;
    super.layout();
    if (this.playPauseButton?.style === Button.Styles.Corner)
      this.playPauseButton.scaleFactor = 1;
  }
  centerContainerButtons() {
    if (this._shouldUseMultilineLayout)
      return [
        this.skipBackButton,
        this.playPauseButton,
        this.skipForwardButton,
      ];
    return [];
  }
  leftContainerButtons() {
    if (this._shouldUseMultilineLayout) return [];
    return [this.skipBackButton, this.playPauseButton, this.skipForwardButton];
  }
  droppableButtons() {
    let buttons = super.droppableButtons();
    if (this._shouldUseMultilineLayout) {
      buttons.delete(this.skipForwardButton);
      buttons.delete(this.skipBackButton);
    }
    return buttons;
  }
  gestureRecognizerStateDidChange(recognizer) {
    if (recognizer.state === GestureRecognizer.States.Cancelled) {
      return;
    }
    if (recognizer === this._pinchGestureRecognizer)
      this._pinchGestureRecognizerStateDidChange(recognizer);
    else if (recognizer === this._tapGestureRecognizer)
      this._tapGestureRecognizerStateDidChange(recognizer);
  }
  get _shouldUseMultilineLayout() {
    return !this._shouldUseSingleBarLayout && !this._shouldUseAudioLayout;
  }
  _updateGestureRecognizers() {
    const shouldListenToPinches = this.visible;
    const shouldListenToTaps = this.visible && this.showsStartButton;
    if (shouldListenToPinches && !this._pinchGestureRecognizer)
      this._pinchGestureRecognizer = new PinchGestureRecognizer(
        this.element,
        this,
      );
    else if (!shouldListenToPinches && this._pinchGestureRecognizer) {
      this._pinchGestureRecognizer.enabled = false;
      delete this._pinchGestureRecognizer;
    }
    if (shouldListenToTaps && !this._tapGestureRecognizer)
      this._tapGestureRecognizer = new TapGestureRecognizer(this.element, this);
    else if (!shouldListenToTaps && this._tapGestureRecognizer) {
      this._tapGestureRecognizer.enabled = false;
      delete this._tapGestureRecognizer;
    }
  }
  _pinchGestureRecognizerStateDidChange(recognizer) {
    console.assert(this.visible);
    if (
      recognizer.state !== GestureRecognizer.States.Recognized &&
      recognizer.state !== GestureRecognizer.States.Changed
    )
      return;
    if (
      recognizer.scale > IOSInlineMediaControls.MinimumScaleToEnterFullscreen &&
      this.delegate &&
      typeof this.delegate.iOSInlineMediaControlsRecognizedPinchInGesture ===
        "function"
    )
      this.delegate.iOSInlineMediaControlsRecognizedPinchInGesture();
  }
  _tapGestureRecognizerStateDidChange(recognizer) {
    console.assert(this.visible && this.showsStartButton);
    if (
      recognizer.state === GestureRecognizer.States.Recognized &&
      this.delegate &&
      typeof this.delegate.iOSInlineMediaControlsRecognizedTapGesture ===
        "function"
    )
      this.delegate.iOSInlineMediaControlsRecognizedTapGesture();
  }
}
IOSInlineMediaControls.MinimumScaleToEnterFullscreen = 1.5;
class IOSLayoutTraits extends LayoutTraits {
  mediaControlsClass() {
    return IOSInlineMediaControls;
  }
  resourceDirectory() {
    return "iOS";
  }
  controlsNeverAvailable() {
    return this.isFullscreen;
  }
  supportsIconWithFullscreenVariant() {
    return false;
  }
  supportsDurationTimeLabel() {
    return false;
  }
  supportsAirPlay() {
    return true;
  }
  supportsPiP() {
    return true;
  }
  controlsDependOnPageScaleFactor() {
    return true;
  }
  skipDuration() {
    return 10;
  }
  promoteSubMenusWhenShowingMediaControlsContextMenu() {
    return false;
  }
  inheritsBorderRadius() {
    return true;
  }
  toString() {
    return `[IOSLayoutTraits]`;
  }
}
window.layoutTraitsClasses["IOSLayoutTraits"] = IOSLayoutTraits;
const MinimumHeightToShowVolumeSlider = 136;
class MacOSInlineMediaControls extends InlineMediaControls {
  constructor(options = {}) {
    if (options.mode === undefined)
      options.layoutTraits = new MacOSLayoutTraits(LayoutTraits.Mode.Inline);
    else options.layoutTraits = new MacOSLayoutTraits(options.mode);
    super(options);
    this.element.classList.add("mac");
    this._backgroundClickDelegateNotifier = new BackgroundClickDelegateNotifier(
      this,
    );
    this.volumeSlider = new Slider(this, "volume");
    this.volumeSlider.width = 60;
    this._volumeSliderContainer = new LayoutNode(
      `<div class="volume-slider-container"></div>`,
    );
    if (this.layoutTraits.mode == LayoutTraits.Mode.NarrowViewer) {
      this.element.classList.add("narrowviewer");
      this.fullscreenButton.isFullscreen = true;
    }
  }
  _setupVolumeSliderConfiguration() {
    if (this._volumeSliderSetupComplete) {
      return;
    }
    const hasValidHost =
      this.mediaControlsHost &&
      typeof this.mediaControlsHost.isMediaControlsMacInlineSizeSpecsEnabled !==
        "undefined";
    if (!hasValidHost) {
      return;
    }
    if (
      !this.mediaControlsHost.isMediaControlsMacInlineSizeSpecsEnabled ||
      this.element.classList.contains("audio")
    ) {
      this.timeControl.scrubber.knobStyle = Slider.KnobStyle.Bar;
      this._volumeSliderContainer.children = [
        new BackgroundTint(),
        this.volumeSlider,
      ];
      this.muteButton.element.addEventListener("mouseenter", this);
      this.muteButton.element.addEventListener("mouseleave", this);
      this._volumeSliderContainer.element.addEventListener("mouseleave", this);
    } else {
      this.volumeSlider.width = 135;
      this._volumeSliderContainer.children = [
        new BackgroundTint(),
        this.volumeSlider,
        this.muteButton,
      ];
    }
    this._volumeSliderSetupComplete = true;
  }
  findHostFromParent() {
    const secondParent =
      this.element?.parentElement?.parentElement ||
      this.element?.parentNode?.parentNode;
    if (secondParent instanceof ShadowRoot && secondParent.host?.controlsHost) {
      if (
        typeof secondParent.host.controlsHost
          .isMediaControlsMacInlineSizeSpecsEnabled !== "undefined"
      ) {
        return secondParent.host.controlsHost;
      }
    }
    return null;
  }
  get mediaControlsHost() {
    if (this._host) {
      return this._host;
    }
    this._host = this.findHostFromParent();
    return this._host;
  }
  layout() {
    super.layout();
    if (!this._volumeSliderContainer) return;
    if (
      this.mediaControlsHost?.isMediaControlsMacInlineSizeSpecsEnabled &&
      !this.element.classList.contains("audio")
    ) {
      if (this.rightContainer?.element) {
        this.rightContainer.element.style.removeProperty("left");
        this.rightContainer._dirtyProperties.delete("x");
      }
    }
    if (!this._volumeSliderSetupComplete) {
      this._setupVolumeSliderConfiguration();
    }
    if (!this._inlineInsideMargin)
      this._inlineInsideMargin = this.computedValueForStylePropertyInPx(
        "--inline-controls-inside-margin",
      );
    if (!this._inlineBottomControlsBarHeight)
      this._inlineBottomControlsBarHeight =
        this.computedValueForStylePropertyInPx("--inline-controls-bar-height");
    if (
      this.mediaControlsHost &&
      (!this.mediaControlsHost?.isMediaControlsMacInlineSizeSpecsEnabled ||
        this.element.classList.contains("audio"))
    ) {
      this._volumeSliderContainer.x = this.rightContainer.x + this.muteButton.x;
      this._volumeSliderContainer.y =
        this.bottomControlsBar.y -
        this._inlineBottomControlsBarHeight -
        this._inlineInsideMargin;
    } else {
      const hasMinimumHeight = this.height >= MinimumHeightToShowVolumeSlider;
      const hasMinimumWidth = this.width >= this.volumeSlider.width + 130;
      const shouldShowVolumeContainer =
        hasMinimumHeight &&
        hasMinimumWidth &&
        !this.showsStartButton &&
        this.visible &&
        this.playPauseButton &&
        this.playPauseButton.enabled;
      if (this.width < 60 && this.muteButton) {
        this.muteButton.visible = false;
      }
      const children = this.children ? [...this.children] : [];
      if (
        shouldShowVolumeContainer &&
        !children.includes(this._volumeSliderContainer)
      ) {
        this._volumeSliderContainer.children = [
          new BackgroundTint(),
          this.volumeSlider,
          this.muteButton,
        ];
        children.push(this._volumeSliderContainer);
        this.children = children;
        this._volumeSliderContainer.x = 0;
        this._volumeSliderContainer.y = 0;
        if (this._volumeSliderContainer.element) {
          this._volumeSliderContainer.element.style.removeProperty("left");
          this._volumeSliderContainer.element.style.removeProperty("top");
        }
        if (this.muteButton) this.muteButton.visible = true;
      } else if (
        !shouldShowVolumeContainer &&
        children.includes(this._volumeSliderContainer)
      ) {
        const volumeContainerIndex = children.indexOf(
          this._volumeSliderContainer,
        );
        children.splice(volumeContainerIndex, 1);
        this.children = children;
        if (this.muteButton) this.muteButton.visible = false;
      }
    }
  }
  get preferredMuteButtonStyle() {
    return this.height >= MinimumHeightToShowVolumeSlider
      ? Button.Styles.Bar
      : super.preferredMuteButtonStyle;
  }
  handleEvent(event) {
    if (!this._volumeSliderSetupComplete) {
      this._setupVolumeSliderConfiguration();
    }
    if (
      this.mediaControlsHost &&
      (!this.mediaControlsHost?.isMediaControlsMacInlineSizeSpecsEnabled ||
        this.element.classList.contains("audio"))
    ) {
      if (
        event.type === "mouseenter" &&
        event.currentTarget === this.muteButton.element
      ) {
        if (this.muteButton.parent === this.rightContainer) {
          this.addChild(this._volumeSliderContainer);
        }
      } else if (
        event.type === "mouseleave" &&
        (event.currentTarget === this.muteButton.element ||
          event.currentTarget === this._volumeSliderContainer.element)
      ) {
        if (
          !this._volumeSliderContainer.element.contains(event.relatedTarget)
        ) {
          this._volumeSliderContainer.remove();
        }
      }
    }
  }
  rightContainerButtons() {
    if (!this._volumeSliderSetupComplete) {
      this._setupVolumeSliderConfiguration();
    }
    if (
      this.mediaControlsHost &&
      this.mediaControlsHost?.isMediaControlsMacInlineSizeSpecsEnabled &&
      !this.element.classList.contains("audio")
    ) {
      const buttons = super.rightContainerButtons();
      if (buttons && this.muteButton) {
        const muteButtonIndex = buttons.indexOf(this.muteButton);
        if (muteButtonIndex !== -1) {
          buttons.splice(muteButtonIndex, 1);
        }
      }
      return buttons;
    }
    return super.rightContainerButtons ? super.rightContainerButtons() : [];
  }
}
const FullscreenTimeControlWidth = 448;
class MacOSFullscreenMediaControls extends MediaControls {
  constructor(options = {}) {
    options.layoutTraits = new MacOSLayoutTraits(LayoutTraits.Mode.Fullscreen);
    super(options);
    this.element.classList.add("mac");
    this.element.classList.add("fullscreen");
    this.timeControl.scrubber.knobStyle = Slider.KnobStyle.Bar;
    this.playPauseButton.scaleFactor = 2;
    this.rewindButton = new RewindButton(this);
    this.forwardButton = new ForwardButton(this);
    this.fullscreenButton.isFullscreen = true;
    this.volumeSlider = new Slider(this, "volume");
    this._leftContainer = new ButtonsContainer({
      children: this._volumeControlsForCurrentDirection(),
      cssClassName: "left",
      leftMargin: 12,
      rightMargin: 0,
      buttonMargin: 6,
    });
    this._centerContainer = new ButtonsContainer({
      children: [this.rewindButton, this.playPauseButton, this.forwardButton],
      cssClassName: "center",
      leftMargin: 27,
      rightMargin: 27,
      buttonMargin: 27,
    });
    this._rightContainer = new ButtonsContainer({
      children: [
        this.airplayButton,
        this.pipButton,
        this.tracksButton,
        this.fullscreenButton,
        this.overflowButton,
      ],
      cssClassName: "right",
      leftMargin: 12,
      rightMargin: 12,
      buttonMargin: 24,
    });
    this.bottomControlsBar.children = [
      this._leftContainer,
      this._centerContainer,
      this._rightContainer,
    ];
    this.bottomControlsBar.element.addEventListener("mousedown", this);
    this.bottomControlsBar.element.addEventListener("click", this);
    this.element.addEventListener("mousemove", this);
    this._backgroundClickDelegateNotifier = new BackgroundClickDelegateNotifier(
      this,
    );
  }
  handleEvent(event) {
    event.stopPropagation();
    if (
      event.type === "mousedown" &&
      event.currentTarget === this.bottomControlsBar.element
    )
      this._handleMousedown(event);
    else if (event.type === "mousemove" && event.currentTarget === this.element)
      this._handleMousemove(event);
    else if (event.type === "mouseup" && event.currentTarget === this.element)
      this._handleMouseup(event);
    else super.handleEvent(event);
  }
  layout() {
    super.layout();
    const children = [];
    if (this.placard) {
      children.push(this.placard);
      if (this.placardPreventsControlsBarDisplay()) {
        this.children = children;
        return;
      }
    }
    children.push(this.bottomControlsBar);
    if (!this._rightContainer) return;
    this._rightContainer.children.forEach((button) => delete button.dropped);
    this.overflowButton.clearExtraContextMenuOptions();
    this._leftContainer.visible = this.muteButton.enabled;
    this._leftContainer.children = this._volumeControlsForCurrentDirection();
    let collapsableButtons = this._collapsableButtons();
    let shownRightContainerButtons = this._rightContainer.children.filter(
      (button) => button.enabled && !button.dropped,
    );
    let maximumRightContainerButtonCount =
      this.maximumRightContainerButtonCountOverride ?? 3;
    for (
      let i = shownRightContainerButtons.length - 1;
      i >= 0 &&
      shownRightContainerButtons.length > maximumRightContainerButtonCount;
      --i
    ) {
      let button = shownRightContainerButtons[i];
      if (!collapsableButtons.has(button)) continue;
      button.dropped = true;
      this.overflowButton.addExtraContextMenuOptions(button.contextMenuOptions);
    }
    this._leftContainer.layout();
    this._centerContainer.layout();
    this._rightContainer.layout();
    if (
      this.statusLabel.enabled &&
      this.statusLabel.parent !== this.bottomControlsBar
    ) {
      this.timeControl.remove();
      this.bottomControlsBar.addChild(this.statusLabel);
    } else if (
      !this.statusLabel.enabled &&
      this.timeControl.parent !== this.bottomControlsBar
    ) {
      this.statusLabel.remove();
      this.bottomControlsBar.addChild(this.timeControl);
      this.timeControl.width = FullscreenTimeControlWidth;
    }
    this.children = children;
  }
  _volumeControlsForCurrentDirection() {
    return this.usesLTRUserInterfaceLayoutDirection
      ? [this.muteButton, this.volumeSlider]
      : [this.volumeSlider, this.muteButton];
  }
  _collapsableButtons() {
    return new Set([this.tracksButton, this.pipButton]);
  }
  _handleMousedown(event) {
    if (
      event.target.localName === "button" ||
      event.target.parentNode.localName === "button" ||
      event.target.localName === "input" ||
      event.target.closest("button") ||
      event.target.closest(".buttons-container")
    )
      return;
    event.preventDefault();
    event.stopPropagation();
    this._lastDragPoint = this._pointForEvent(event);
    this.element.addEventListener("mousemove", this, true);
    this.element.addEventListener("mouseup", this, true);
  }
  _handleMousemove(event) {
    if (!this._lastDragPoint) {
      this.faded = false;
      return;
    }
    event.preventDefault();
    const currentDragPoint = this._pointForEvent(event);
    this.bottomControlsBar.translation = new DOMPoint(
      this.bottomControlsBar.translation.x +
        currentDragPoint.x -
        this._lastDragPoint.x,
      this.bottomControlsBar.translation.y +
        currentDragPoint.y -
        this._lastDragPoint.y,
    );
    this._lastDragPoint = currentDragPoint;
  }
  _handleMouseup(event) {
    event.preventDefault();
    delete this._lastDragPoint;
    this.element.removeEventListener("mousemove", this, true);
    this.element.removeEventListener("mouseup", this, true);
  }
  _pointForEvent(event) {
    return new DOMPoint(event.clientX, event.clientY);
  }
}
class MacOSLayoutTraits extends LayoutTraits {
  mediaControlsClass() {
    if (this._mode === LayoutTraits.Mode.Fullscreen)
      return MacOSFullscreenMediaControls;
    return MacOSInlineMediaControls;
  }
  resourceDirectory() {
    return "macOS";
  }
  controlsNeverAvailable() {
    return false;
  }
  supportsIconWithFullscreenVariant() {
    return this.isFullscreen;
  }
  supportsDurationTimeLabel() {
    return true;
  }
  controlsDependOnPageScaleFactor() {
    return false;
  }
  skipDuration() {
    return 15;
  }
  promoteSubMenusWhenShowingMediaControlsContextMenu() {
    return true;
  }
  supportsTouches() {
    return false;
  }
  supportsAirPlay() {
    return true;
  }
  supportsPiP() {
    return true;
  }
  inheritsBorderRadius() {
    return false;
  }
  toString() {
    if (this._mode === LayoutTraits.Mode.Fullscreen)
      return `[MacOSLayoutTraits Fullscreen]`;
    return `[MacOSLayoutTraits Inline]`;
  }
}
window.layoutTraitsClasses["MacOSLayoutTraits"] = MacOSLayoutTraits;
class MetadataContainer extends LayoutNode {
  constructor({ cssClassName } = {}) {
    super(`<div class="metadata-container ${cssClassName ?? ""}"></div>`);
    this._title = "";
    this._artist = "";
    this._artistNode = new LayoutNode(
      `<div id="artist-label" class="artist-label"></div>`,
    );
    this._titleNode = new LayoutNode(
      `<div id="title-label" class="title-label"></div>`,
    );
    this.children = [this._artistNode, this._titleNode];
  }
  get title() {
    return this._title;
  }
  set title(title) {
    if (title === this._title) return;
    this._title = title;
    this.markDirtyProperty("title");
  }
  get artist() {
    return this._artist;
  }
  set artist(artist) {
    if (artist === this._artist) return;
    this._artist = artist;
    this.markDirtyProperty("artist");
  }
  commitProperty(propertyName) {
    if (propertyName === "title") {
      this._titleNode.element.textContent = this.title;
      this._titleNode.element.setAttribute(
        "aria-label",
        UIString("Title: %s", this.title),
      );
    } else if (propertyName === "artist") {
      this._artistNode.element.textContent = this.artist;
      this._artistNode.element.setAttribute(
        "aria-label",
        UIString("Artist: %s", this.artist),
      );
    } else super.commitProperty(propertyName);
  }
}
const MinHeightToDisplayDescription = 100;
const MinHeightToDisplayTitle = 40;
class Placard extends LayoutItem {
  constructor({
    iconName = null,
    title = "",
    description = "",
    width = 400,
    height = 300,
    layoutDelegate = null,
  } = {}) {
    super({ element: `<div class="placard"></div>`, layoutDelegate });
    this._container = this.addChild(
      new LayoutNode(`<div class="container"></div>`),
    );
    if (iconName) {
      this._icon = new Button(this);
      this._icon.iconName = iconName;
      this._icon.element.disabled = true;
    }
    if (!!title)
      this._titleNode = new LayoutNode(`<div class="title">${title}</div>`);
    if (!!description)
      this._descriptionNode = new LayoutNode(
        `<div class="description">${description}</div>`,
      );
    this.minDimensionToDisplayIcon = 170;
    this.width = width;
    this.height = height;
  }
  layout() {
    super.layout();
    const children = [];
    if (
      this._icon &&
      this.width >= this.minDimensionToDisplayIcon &&
      this.height >= this.minDimensionToDisplayIcon
    )
      children.push(this._icon);
    if (this._titleNode && this.height >= MinHeightToDisplayTitle)
      children.push(this._titleNode);
    if (this._descriptionNode && this.height >= MinHeightToDisplayDescription)
      children.push(this._descriptionNode);
    this._container.children = children;
  }
  set title(title) {
    this._titleNode = !!title
      ? new LayoutNode(`<div class="title">${title}</div>`)
      : null;
    this.needsLayout = true;
  }
  set description(description) {
    this._descriptionNode = !!description
      ? new LayoutNode(`<div class="description">${description}</div>`)
      : null;
    this.needsLayout = true;
  }
}
class AirplayPlacard extends Placard {
  constructor(layoutDelegate) {
    super({
      iconName: Icons.AirplayPlacard,
      title: UIString("AirPlay"),
      description: UIString("This video is playing on the TV."),
      layoutDelegate,
    });
  }
}
class InvalidPlacard extends Placard {
  constructor(layoutDelegate) {
    super({ iconName: Icons.InvalidPlacard, layoutDelegate });
    this.minDimensionToDisplayIcon = 50;
  }
}
class PiPPlacard extends Placard {
  constructor(layoutDelegate) {
    super({
      iconName: Icons.PiPPlacard,
      description: UIString("This video is playing in picture in picture."),
      layoutDelegate,
    });
  }
}
class FullscreenPlacard extends Placard {
  constructor(layoutDelegate) {
    super({
      iconName: Icons.PiPPlacard,
      description: UIString("This video is playing in fullscreen."),
      layoutDelegate,
    });
  }
}
class TVOSLayoutTraits extends LayoutTraits {
  mediaControlsClass() {
    if (this.isFullscreen) return TVOSMediaControls;
    return IOSInlineMediaControls;
  }
  supportingObjectClasses() {
    var supportingObjectClasses = super.supportingObjectClasses();
    if (this.isFullscreen) supportingObjectClasses.push(MetadataSupport);
    return supportingObjectClasses;
  }
  resourceDirectory() {
    return "iOS";
  }
  controlsNeverAvailable() {
    return false;
  }
  supportsIconWithFullscreenVariant() {
    return false;
  }
  supportsDurationTimeLabel() {
    return false;
  }
  supportsAirPlay() {
    return false;
  }
  supportsPiP() {
    return false;
  }
  controlsDependOnPageScaleFactor() {
    return true;
  }
  skipDuration() {
    return 10;
  }
  promoteSubMenusWhenShowingMediaControlsContextMenu() {
    return false;
  }
  inheritsBorderRadius() {
    return true;
  }
  toString() {
    return `[TVOSLayoutTraits]`;
  }
}
window.layoutTraitsClasses["TVOSLayoutTraits"] = TVOSLayoutTraits;
class TVOSMediaControls extends MediaControls {
  static topButtonsScaleFactor = 1.5;
  static backForwardButtonScaleFactor = 2.5;
  static playPauseButtonScaleFactor = 3;
  static overflowButtonScaleFactor = 1.5;
  static bottomControlsBarButtonMargin = 80;
  static bottomControlsBarMargin = 48;
  constructor(options = {}) {
    options.layoutTraits = new TVOSLayoutTraits(LayoutTraits.Mode.Fullscreen);
    super(options);
    this.element.classList.add("fullscreen");
    this.element.classList.add("tvos");
    this.closeButton = new CloseButton(this);
    this.closeButton.circular = true;
    this.timeControl.scrubber.allowsRelativeScrubbing = true;
    this.timeControl.scrubber.knobStyle = Slider.KnobStyle.None;
    this.timeControl.style = TimeControl.Style.Below;
    this.skipBackButton = new SkipBackButton(this);
    this.skipForwardButton = new SkipForwardButton(this);
    this.overflowButton.addExtraContextMenuOptions(
      this.tracksButton.contextMenuOptions,
    );
    const singleButtonContainerMargins = {
      leftMargin: 0,
      rightMargin: 0,
      buttonMargin: 0,
    };
    this.topLeftControlsBar = new ControlsBar("top-left");
    this._topLeftControlsBarContainer = this.topLeftControlsBar.addChild(
      new ButtonsContainer(singleButtonContainerMargins),
    );
    this.topRightControlsBar = new ControlsBar("top-right");
    this._topRightControlsBarContainer = this.topRightControlsBar.addChild(
      new ButtonsContainer(singleButtonContainerMargins),
    );
    this.bottomControlsBar.addChild(this.timeControl);
    this._bottomControlsBarContainer = this.bottomControlsBar.addChild(
      new ButtonsContainer(),
    );
    this.overflowControlsBar = new ControlsBar("overflow");
    this._overflowControlsBarContainer = this.overflowControlsBar.addChild(
      new ButtonsContainer(singleButtonContainerMargins),
    );
    this.metadataContainer = new MetadataContainer();
    this.showsStartButton = false;
    for (let clickEvent of [
      "click",
      "mousedown",
      "mouseup",
      "pointerdown",
      "pointerup",
      "touchstart",
      "touchend",
    ]) {
      this.element.addEventListener(clickEvent, (event) => {
        event.stopPropagation();
      });
    }
    this._isInitialized = true;
  }
  layout() {
    super.layout();
    if (!this._isInitialized) return;
    const children = [];
    if (this.placard) {
      children.push(this.placard);
      if (this.placardPreventsControlsBarDisplay()) {
        this.children = children;
        return;
      }
    }
    if (!this.visible) {
      this.children = children;
      return;
    }
    this.closeButton.scaleFactor = TVOSMediaControls.topButtonsScaleFactor;
    this.muteButton.scaleFactor = TVOSMediaControls.topButtonsScaleFactor;
    this.playPauseButton.scaleFactor =
      TVOSMediaControls.playPauseButtonScaleFactor;
    this.skipForwardButton.scaleFactor =
      TVOSMediaControls.backForwardButtonScaleFactor;
    this.skipBackButton.scaleFactor =
      TVOSMediaControls.backForwardButtonScaleFactor;
    this.overflowButton.scaleFactor =
      TVOSMediaControls.overflowButtonScaleFactor;
    this.closeButton.style = Button.Styles.Center;
    this._topLeftControlsBarContainer.children =
      this._topLeftContainerButtons();
    this._topLeftControlsBarContainer.layout();
    this._topRightControlsBarContainer.children =
      this._topRightContainerButtons();
    this._topRightControlsBarContainer.layout();
    this._bottomControlsBarContainer.children = this._bottomContainerButtons();
    this._bottomControlsBarContainer.buttonMargin =
      TVOSMediaControls.bottomControlsBarButtonMargin;
    this._bottomControlsBarContainer.layout();
    this._overflowControlsBarContainer.children =
      this._overflowContainerButtons();
    this._overflowControlsBarContainer.layout();
    this.topLeftControlsBar.hasBackgroundTint = false;
    this.topRightControlsBar.hasBackgroundTint = false;
    this.bottomControlsBar.hasBackgroundTint = false;
    this.overflowControlsBar.hasBackgroundTint = false;
    this.topLeftControlsBar.width = this._topLeftControlsBarContainer.width;
    this.topRightControlsBar.width = this._topRightControlsBarContainer.width;
    this.bottomControlsBar.width =
      this.width - 2 * TVOSMediaControls.bottomControlsBarMargin;
    this.overflowControlsBar.width = this._overflowControlsBarContainer.width;
    this.timeControl.width = this.bottomControlsBar.width;
    this.metadataContainer.width =
      this.bottomControlsBar.width -
      this.overflowControlsBar.width -
      ButtonsContainer.Defaults.LeftMargin;
    this.topLeftControlsBar.visible =
      this._topLeftControlsBarContainer.children.some(
        (button) => button.visible,
      );
    this.topRightControlsBar.visible =
      this._topRightControlsBarContainer.children.some(
        (button) => button.visible,
      );
    this.bottomControlsBar.visible = true;
    this.overflowControlsBar.visible = true;
    children.push(
      ...[
        this.topLeftControlsBar,
        this.topRightControlsBar,
        this.bottomControlsBar,
        this.metadataContainer,
        this.overflowControlsBar,
      ],
    );
    this.children = children;
  }
  commitProperty(propertyName) {
    if (propertyName !== "visible") super.commitProperty(propertyName);
  }
  _topLeftContainerButtons() {
    if (this.usesLTRUserInterfaceLayoutDirection) return [this.closeButton];
    return [this.muteButton];
  }
  _topRightContainerButtons() {
    if (this.usesLTRUserInterfaceLayoutDirection) return [this.muteButton];
    return [this.closeButton];
  }
  _bottomContainerButtons() {
    return [this.skipBackButton, this.playPauseButton, this.skipForwardButton];
  }
  _overflowContainerButtons() {
    return [this.overflowButton];
  }
}
class VisionSlider extends SliderBase {
  constructor(layoutDelegate, cssClassName = "") {
    super(layoutDelegate, `vision ${cssClassName}`);
    this._recessed = false;
    this._gutter = new LayoutNode(
      `<div class="gutter"><div class="background"></div><div class="inner-shadow"></div><div class="outer-shadow"></div><div class="highlight"></div></div>`,
    );
    this._primaryFill = new LayoutNode(`<div class="fill"></div>`);
    this.appearanceContainer.children = [this._gutter, this._primaryFill];
  }
  get recessed() {
    return this._recessed;
  }
  set recessed(recessed) {
    if (recessed == this._recessed) return;
    this._recessed = recessed;
    this.element.classList.toggle("recessed", recessed);
    this.needsLayout = true;
  }
  get _recessedMargin() {
    return this.computedValueForStylePropertyInPx(
      "--slider-fill-recessed-margin",
    );
  }
  get _effectiveSliderHeight() {
    return (
      this.computedValueForStylePropertyInPx("--slider-height") -
      2 * this._recessedMargin
    );
  }
  commit() {
    super.commit();
    const height = this._effectiveSliderHeight;
    const margin = this._recessedMargin;
    const fillX = margin;
    this._primaryFill.element.style.left = `${fillX}px`;
    if (this.width) {
      const fillWidth =
        this.value * (this.width - margin * 2 - height) + height;
      this._primaryFill.element.style.width = `${fillWidth}px`;
    } else {
      const fillWidth = `${this.value} * (100% - (${margin}px * 2) - ${height}px) + ${height}px`;
      this._primaryFill.element.style.width = `calc(${fillWidth})`;
    }
  }
}
class VolumeContainer extends LayoutNode {
  constructor(cssClassName = "") {
    super(`<div role="group" class="${cssClassName}"></div>`);
    this._backgroundTint = this.addChild(new BackgroundTint());
  }
  get children() {
    return super.children;
  }
  set children(children) {
    super.children = [this._backgroundTint].concat(children);
  }
}
const MinSizeToShowLargeProminentControl = 292;
const MinWidthToShowTopCornerControlsBars = 262;
const MinWidthToShowBottomBar = 390;
const MinWidthToShowVolumeSlider = 390;
const MinWidthToShowSeekingControls = 520;
const MinWidthToShowOverflowButton = 520;
const MinWidthToShowLargeCentralControls = 640;
const MaxWidthForBottomControlsBarInFullscreen = 602;
const MinWidthToShowSeekingControlsForAudio = 120;
const MinWidthToShowTimeControlForAudio = 262;
class VisionMediaControls extends MediaControls {
  constructor(options) {
    super(options);
    this._createControls();
    this.element.classList.add("inline", "vision");
    this._shouldUseAudioLayout = false;
    this._shouldUseSingleBarLayout = false;
    this.showsStartButton = false;
    this._updateBottomControlsBarLabel();
  }
  set shouldUseAudioLayout(flag) {
    if (this._shouldUseAudioLayout === flag) return;
    this._shouldUseAudioLayout = flag;
    this.element.classList.toggle("audio", flag);
    this.needsLayout = true;
    this._updateBottomControlsBarLabel();
  }
  set shouldUseSingleBarLayout(flag) {
    if (this._shouldUseSingleBarLayout === flag) return;
    this._shouldUseSingleBarLayout = flag;
    this.needsLayout = true;
  }
  get showsStartButton() {
    return !!this._showsStartButton;
  }
  set showsStartButton(flag) {
    if (this._showsStartButton === flag) return;
    this._showsStartButton = flag;
    this.layout();
  }
  layout() {
    super.layout();
    const children = [];
    if (this.placard) {
      children.push(this.placard);
      if (this.placardPreventsControlsBarDisplay()) {
        this.children = children;
        return;
      }
    }
    if (!this.visible) {
      this.children = children;
      return;
    }
    if (
      !this._shouldUseAudioLayout &&
      (this.width < MinimumSizeToShowAnyControl ||
        this.height < MinimumSizeToShowAnyControl)
    ) {
      this.children = children;
      return;
    }
    if (this._showsStartButton) {
      this.playPauseButton.style =
        this._widthForSizeClassDetermination >=
          MinSizeToShowLargeProminentControl &&
        this._heightForSizeClassDetermination >=
          MinSizeToShowLargeProminentControl
          ? Button.Styles.Center
          : Button.Styles.SmallCenter;
      this.children = [this.playPauseButton];
      return;
    }
    if (
      this._topLeftControlsBar &&
      this._centerControlsBar &&
      this.bottomControlsBar &&
      this._topRightControlsBar
    )
      this._performLayout();
  }
  commitProperty(propertyName) {
    if (propertyName !== "visible") super.commitProperty(propertyName);
  }
  get _widthForSizeClassDetermination() {
    return Math.ceil(this.width / this.scaleFactor);
  }
  get _heightForSizeClassDetermination() {
    return Math.ceil(this.height / this.scaleFactor);
  }
  _createControls() {
    this._backdrop = new LayoutNode('<div class="backdrop"></div>');
    this.skipBackButton = new SkipBackButton(this);
    this.skipBackButton.circular = true;
    this.playPauseButton.circular = true;
    this.skipForwardButton = new SkipForwardButton(this);
    this.skipForwardButton.circular = true;
    this.overflowButton.iconName = Icons.Ellipsis;
    this.overflowButton.circular = true;
    this.overflowButton.addExtraContextMenuOptions(
      this.tracksButton.contextMenuOptions,
    );
    this.fullscreenButton.style = Button.Styles.Rounded;
    this.fullscreenButton.circular = true;
    this.timeControl.scrubber = new VisionSlider(
      this.layoutDelegate,
      "scrubber",
    );
    this._topLeftControlsBar = new ControlsBar("simple-layout top-left");
    this._topLeftControlsBar.hasBackgroundTint = false;
    this._topRightControlsBar = new ControlsBar("simple-layout top-right");
    this._topRightControlsBar.hasBackgroundTint = false;
    this._centerControlsBar = new ControlsBar("simple-layout center");
    this._centerControlsBar.hasBackgroundTint = false;
    this._bottomBarLeftContainer = new ButtonsContainer({
      cssClassName: "left",
    });
    this._bottomBarRightContainer = new ButtonsContainer({
      cssClassName: "right",
    });
    this.volumeSlider = new VisionSlider(this, "volume");
    this.volumeSlider.width = 150;
    this.volumeSlider.recessed = true;
    this.volumeContainer = new VolumeContainer("volume-container");
  }
  _performLayout() {
    throw "Derived class must implement this function.";
  }
  _topRightControlsBarChildren() {
    throw "Derived class must implement this function.";
  }
  _performVolumeContainerLayout() {
    throw "Derived class must implement this function.";
  }
  _performTopLeftControlsBarLayout() {
    const buttons = [this.fullscreenButton];
    for (let button of buttons) button.visible = button.enabled;
    this._topLeftControlsBar.children = buttons;
  }
  _performTopRightControlsBarLayout() {
    this._performVolumeContainerLayout();
    this._topRightControlsBar.children = this._topRightControlsBarChildren();
  }
  _updateBottomControlsBarLabel() {
    this.bottomControlsBar.element.setAttribute(
      "aria-label",
      this._shouldUseAudioLayout
        ? UIString("Audio Controls")
        : UIString("Video Controls"),
    );
  }
  _bottomBarLeftContainerButtons() {
    if (
      this._widthForSizeClassDetermination <
        MinWidthToShowSeekingControlsForAudio &&
      this._shouldUseAudioLayout
    )
      return [this.playPauseButton];
    return [this.skipBackButton, this.playPauseButton, this.skipForwardButton];
  }
  _bottomBarRightContainerButtons() {
    if (this._shouldUseAudioLayout || this._shouldUseSingleBarLayout)
      return [this.muteButton, this.overflowButton];
    return [this.overflowButton];
  }
}
class VisionInlineMediaControls extends VisionMediaControls {
  constructor(options = {}) {
    options.layoutTraits = new VisionLayoutTraits(LayoutTraits.Mode.Inline);
    super(options);
  }
  _createControls() {
    super._createControls();
    this.overflowButton.style = Button.Styles.Rounded;
    this.overflowButton.circular = true;
    this.timeControl.style = TimeControl.Style.Above;
    this.bottomControlsBar.hasBackgroundTint = false;
    this._bottomBarLeftContainer.leftMargin = 10;
    this._bottomBarLeftContainer.buttonMargin = 14;
    this._bottomBarLeftContainer.rightMargin = 15;
    this._bottomBarRightContainer.leftMargin = 15;
    this._bottomBarRightContainer.buttonMargin = 12;
    this._bottomBarRightContainer.rightMargin = 12;
  }
  _performLayout() {
    if (this._shouldUseSingleBarLayout || this._shouldUseAudioLayout) {
      this._performSingleBarLayout();
      this.children = [this.bottomControlsBar];
      return;
    }
    const children = [this._backdrop];
    if (
      this._widthForSizeClassDetermination >=
      MinWidthToShowTopCornerControlsBars
    ) {
      this._performTopLeftControlsBarLayout();
      this._performTopRightControlsBarLayout();
      children.push(this._topLeftControlsBar);
      children.push(this._topRightControlsBar);
    }
    this._performCentralContainerLayout();
    children.push(this._centerControlsBar);
    if (this._widthForSizeClassDetermination >= MinWidthToShowBottomBar) {
      this._performBottomBarLayout();
      children.push(this.bottomControlsBar);
    }
    this.children = children;
  }
  _topRightControlsBarChildren() {
    const children = [];
    if (this._widthForSizeClassDetermination >= MinWidthToShowVolumeSlider)
      children.push(this.volumeContainer);
    else children.push(this.muteButton);
    if (this._widthForSizeClassDetermination >= MinWidthToShowOverflowButton)
      children.push(this.overflowButton);
    return children;
  }
  _centerContainerButtons() {
    if (this._widthForSizeClassDetermination < MinWidthToShowSeekingControls)
      return [this.playPauseButton];
    return [this.skipBackButton, this.playPauseButton, this.skipForwardButton];
  }
  _performCentralContainerLayout() {
    const scaleFactor =
      this._widthForSizeClassDetermination >= MinWidthToShowLargeCentralControls
        ? 1.5
        : 1;
    const buttons = this._centerContainerButtons();
    for (let button of buttons) {
      button.style = Button.Styles.Bar;
      button.visible = button.enabled;
      button.scaleFactor = scaleFactor;
      button.circular = true;
    }
    this._centerControlsBar.children = buttons;
  }
  _performVolumeContainerLayout() {
    if (this._widthForSizeClassDetermination >= MinWidthToShowVolumeSlider) {
      this.muteButton.style = Button.Styles.Bar;
      this.muteButton.circular = false;
      this.volumeContainer.children = [this.volumeSlider, this.muteButton];
    } else {
      this.muteButton.style = Button.Styles.Rounded;
      this.muteButton.circular = true;
      this.volumeContainer.children = [];
    }
  }
  _performBottomBarLayout() {
    const margin = this.computedValueForStylePropertyInPx(
      "--inline-controls-inside-margin",
    );
    this.bottomControlsBar.width = this.width - 2 * margin;
    const control = this.statusLabel.enabled
      ? this.statusLabel
      : this.timeControl;
    control.width = this.bottomControlsBar.width;
    control.layout();
    this.bottomControlsBar.children = [control];
  }
  _performSingleBarLayout() {
    const children = [this._bottomBarLeftContainer];
    this.timeControl.scrubber.recessed = true;
    this.bottomControlsBar.width = this.width;
    this.skipBackButton.style = Button.Styles.Bar;
    this.skipForwardButton.style = Button.Styles.Bar;
    this.playPauseButton.style = Button.Styles.Bar;
    this.muteButton.style = Button.Styles.Bar;
    this.muteButton.circular = true;
    this.overflowButton.style = Button.Styles.Bar;
    this.timeControl.style = TimeControl.Style.Side;
    this.bottomControlsBar.hasBackgroundTint = true;
    this._bottomBarLeftContainer.children =
      this._bottomBarLeftContainerButtons();
    this._bottomBarLeftContainer.layout();
    this._bottomBarRightContainer.children =
      this._bottomBarRightContainerButtons();
    this._bottomBarRightContainer.layout();
    const widthLeftOfTimeControl =
      this._bottomBarLeftContainer.children.length > 0
        ? this._bottomBarLeftContainer.width
        : this._bottomBarLeftContainer.leftMargin;
    const widthRightOfTimeControl =
      this._bottomBarRightContainer.children.length > 0
        ? this._bottomBarRightContainer.width
        : this._bottomBarRightContainer.rightMargin;
    const centerControl = this.statusLabel.enabled
      ? this.statusLabel
      : this.timeControl;
    if (
      this._widthForSizeClassDetermination >=
        MinWidthToShowTimeControlForAudio &&
      centerControl == this.timeControl
    ) {
      centerControl.x = widthLeftOfTimeControl;
      centerControl.width =
        this.bottomControlsBar.width -
        widthLeftOfTimeControl -
        widthRightOfTimeControl;
      centerControl.layout();
      children.push(centerControl);
    }
    this._bottomBarRightContainer.x =
      this.bottomControlsBar.width - this._bottomBarRightContainer.width;
    children.push(this._bottomBarRightContainer);
    this.bottomControlsBar.children = children;
  }
}
class VisionLayoutTraits extends LayoutTraits {
  mediaControlsClass() {
    return VisionInlineMediaControls;
  }
  resourceDirectory() {
    return "iOS";
  }
  controlsNeverAvailable() {
    return false;
  }
  supportsAirPlay() {
    return false;
  }
  supportsPiP() {
    return false;
  }
  supportsIconWithFullscreenVariant() {
    return false;
  }
  supportsDurationTimeLabel() {
    return false;
  }
  controlsDependOnPageScaleFactor() {
    return true;
  }
  skipDuration() {
    return 15;
  }
  promoteSubMenusWhenShowingMediaControlsContextMenu() {
    return false;
  }
  inheritsBorderRadius() {
    return false;
  }
  toString() {
    return `[VisionLayoutTraits]`;
  }
}
window.layoutTraitsClasses["VisionLayoutTraits"] = VisionLayoutTraits;
class WatchOSActivityIndicator extends Button {
  constructor(layoutDelegate) {
    super({
      cssClassName: "watchos-activity-indicator",
      iconName: Icons.SpinnerSprite,
      layoutDelegate,
    });
  }
  show() {
    let classList = this.element.classList;
    classList.add("spins");
    classList.remove("fades-out");
  }
  hide() {
    let classList = this.element.classList;
    if (!classList.contains("spins") || classList.contains("fades-out")) return;
    classList.add("fades-out");
    this.image.element.addEventListener(
      "animationend",
      (event) => {
        if (event.animationName !== "watchos-activity-indicator-fades-out")
          return;
        classList.remove("spins");
        classList.remove("fades-out");
      },
      { once: true },
    );
  }
}
class WatchOSMediaControls extends LayoutNode {
  constructor({ width = 320, height = 240 } = {}) {
    super(`<div class="watchos media-controls"></div>`);
    this._state = WatchOSMediaControls.State.Paused;
    this._scaleFactor = 1;
    this.layoutTraits = new WatchOSLayoutTraits(LayoutTraits.Mode.Inline);
    this.playButton = new Button({
      cssClassName: "play",
      iconName: Icons.PlayCircle,
      layoutDelegate: this,
    });
    this.invalidButton = new Button({
      cssClassName: "invalid",
      iconName: Icons.InvalidCircle,
      layoutDelegate: this,
    });
    this.activityIndicator = new WatchOSActivityIndicator(this);
    this.width = width;
    this.height = height;
  }
  get scaleFactor() {
    return this._scaleFactor;
  }
  set scaleFactor(scaleFactor) {
    if (this._scaleFactor === scaleFactor) return;
    this._scaleFactor = scaleFactor;
    this.markDirtyProperty("scaleFactor");
  }
  get state() {
    return this._state;
  }
  set state(state) {
    if (this._state === state) return;
    this._state = state;
    this.layout();
  }
  layout() {
    super.layout();
    switch (this._state) {
      case WatchOSMediaControls.State.Paused:
        this.children = [this.playButton];
        break;
      case WatchOSMediaControls.State.Pending:
        this.children = [this.activityIndicator];
        this.activityIndicator.show();
        break;
      case WatchOSMediaControls.State.Invalid:
        this.children = [this.invalidButton];
        break;
    }
  }
  commitProperty(propertyName) {
    if (propertyName !== "scaleFactor") {
      super.commitProperty(propertyName);
      return;
    }
    let zoom = 1 / this._scaleFactor;

    if (zoom < 1) {
      this.element.style.transform = `scale(${zoom})`;
      this.element.style.removeProperty("zoom");
    } else {
      this.element.style.zoom = zoom;
      this.element.style.removeProperty("transform");
    }
  }
}
WatchOSMediaControls.State = {
  Paused: "paused",
  Pending: "pending",
  Invalid: "invalid",
};
class WatchOSLayoutTraits extends LayoutTraits {
  mediaControlsClass() {
    return WatchOSMediaControls;
  }
  supportingObjectClasses() {
    return [WatchOSMediaControlsSupport];
  }
  resourceDirectory() {
    return "watchOS";
  }
  controlsNeverAvailable() {
    return false;
  }
  supportsIconWithFullscreenVariant() {
    return false;
  }
  supportsDurationTimeLabel() {
    return false;
  }
  supportsAirPlay() {
    return false;
  }
  supportsPiP() {
    return true;
  }
  controlsDependOnPageScaleFactor() {
    return false;
  }
  skipDuration() {
    return 15;
  }
  promoteSubMenusWhenShowingMediaControlsContextMenu() {
    return false;
  }
  inheritsBorderRadius() {
    return false;
  }
  toString() {
    return `[WatchOSLayoutTraits]`;
  }
}
window.layoutTraitsClasses["WatchOSLayoutTraits"] = WatchOSLayoutTraits;
class MediaControllerSupport {
  constructor(mediaController) {
    this.mediaController = mediaController;
    this.enable();
  }
  enable() {
    for (let eventType of this.mediaEvents)
      this.mediaController.media.addEventListener(eventType, this, true);
    for (let tracks of this.tracksToMonitor) {
      for (let eventType of ["change", "addtrack", "removetrack"])
        tracks.addEventListener(eventType, this);
    }
    if (!this.control) return;
    this.control.uiDelegate = this;
    this.syncControl();
  }
  disable() {
    for (let eventType of this.mediaEvents)
      this.mediaController.media.removeEventListener(eventType, this, true);
    for (let tracks of this.tracksToMonitor) {
      for (let eventType of ["change", "addtrack", "removetrack"])
        tracks.removeEventListener(eventType, this);
    }
    if (this.control) this.control.uiDelegate = null;
  }
  get control() {}
  get mediaEvents() {
    return [];
  }
  get tracksToMonitor() {
    return [];
  }
  buttonWasPressed(control) {}
  controlsUserVisibilityDidChange() {}
  handleEvent(event) {
    if (this.control) this.syncControl(event);
  }
  syncControl() {}
}
class AirplaySupport extends MediaControllerSupport {
  get control() {
    return this.mediaController.controls.airplayButton;
  }
  get mediaEvents() {
    return [
      "webkitplaybacktargetavailabilitychanged",
      "webkitcurrentplaybacktargetiswirelesschanged",
    ];
  }
  enable() {
    if (this._shouldBeEnabled()) super.enable();
  }
  buttonWasPressed(control) {
    this.mediaController.media.webkitShowPlaybackTargetPicker();
  }
  controlsUserVisibilityDidChange() {
    if (this._shouldBeEnabled()) this.enable();
    else this.disable();
  }
  handleEvent(event) {
    if (event.type === "webkitplaybacktargetavailabilitychanged")
      this._routesAvailable = event.availability === "available";
    super.handleEvent(event);
  }
  syncControl() {
    this.control.enabled = !!this._routesAvailable;
    this.control.on =
      this.mediaController.media.webkitCurrentPlaybackTargetIsWireless;
    this.mediaController.controls.muteButton.enabled = !this.control.on;
  }
  _shouldBeEnabled() {
    if (!this.mediaController.layoutTraits?.supportsAirPlay()) return false;
    if (!this.mediaController.hasPlayed) return false;
    const controls = this.mediaController.controls;
    return controls.visible && !controls.faded;
  }
}
class AudioSupport extends MediaControllerSupport {
  get control() {
    return this.mediaController.controls;
  }
  get mediaEvents() {
    return ["loadedmetadata", "error"];
  }
  get tracksToMonitor() {
    return [this.mediaController.media.videoTracks];
  }
  syncControl() {
    this.control.shouldUseAudioLayout = this.mediaController.isAudio;
    if (this.mediaController.mediaDocumentController)
      this.mediaController.mediaDocumentController.layout();
  }
}
class CloseSupport extends MediaControllerSupport {
  get control() {
    return this.mediaController.controls.closeButton;
  }
  buttonWasPressed(control) {
    this.mediaController.media.webkitExitFullscreen();
  }
}
class ControlsVisibilitySupport extends MediaControllerSupport {
  constructor(mediaController) {
    super(mediaController);
    this._updateControls();
  }
  enable() {
    super.enable();
    this._updateControls();
  }
  disable() {
    super.disable();
    this.mediaController.controls.autoHideController.fadesWhileIdle = false;
  }
  get mediaEvents() {
    return [
      "loadedmetadata",
      "play",
      "pause",
      "webkitcurrentplaybacktargetiswirelesschanged",
      this.mediaController.fullscreenChangeEventType,
    ];
  }
  get tracksToMonitor() {
    return [this.mediaController.media.videoTracks];
  }
  handleEvent() {
    this._updateControls();
  }
  _updateControls() {
    const media = this.mediaController.media;
    const isVideo =
      media instanceof HTMLVideoElement && media.videoTracks.length > 0;
    this.mediaController.controls.autoHideController.fadesWhileIdle = isVideo
      ? !media.paused && !media.webkitCurrentPlaybackTargetIsWireless
      : false;
  }
}
class FullscreenSupport extends MediaControllerSupport {
  get control() {
    return this.mediaController.controls.fullscreenButton;
  }
  get mediaEvents() {
    return ["loadedmetadata"];
  }
  get tracksToMonitor() {
    return [this.mediaController.media.videoTracks];
  }
  buttonWasPressed(control) {
    const media = this.mediaController.media;
    if (this.mediaController.isFullscreen) media.webkitExitFullscreen();
    else media.webkitEnterFullscreen();
  }
  syncControl() {
    const control = this.control;
    const media = this.mediaController.media;
    control.enabled =
      !this.mediaController.isAudio &&
      (media.readyState < HTMLMediaElement.HAVE_METADATA ||
        media.webkitSupportsFullscreen);
    control.isFullScreen = this.mediaController.isFullscreen;
  }
}
class MetadataSupport extends MediaControllerSupport {
  enable() {
    super.enable();
    this.mediaController.shadowRoot.addEventListener(
      "webkitmediasessionmetadatachanged",
      this,
      true,
    );
    this.mediaController.host.ensureMediaSessionObserver();
  }
  disable() {
    super.disable();
    this.mediaController.shadowRoot.removeEventListener(
      "webkitmediasessionmetadatachanged",
      this,
      true,
    );
  }
  get control() {
    return this.mediaController.controls.metadataContainer;
  }
  syncControl(event) {
    const metadata = window.navigator.mediaSession?.metadata;
    this.control.title = metadata ? metadata.title : "";
    this.control.artist = metadata ? metadata.artist : "";
  }
}
class MuteSupport extends MediaControllerSupport {
  get control() {
    return this.mediaController.controls.muteButton;
  }
  get mediaEvents() {
    return ["volumechange"];
  }
  buttonWasPressed(control) {
    const media = this.mediaController.media;
    media.muted = !media.muted;
  }
  syncControl() {
    this.control.volume = this.mediaController.media.volume;
    this.control.muted = this.mediaController.media.muted;
  }
}
class OverflowSupport extends MediaControllerSupport {
  get mediaEvents() {
    return [
      "abort",
      "canplay",
      "canplaythrough",
      "durationchange",
      "emptied",
      "error",
      "loadeddata",
      "loadedmetadata",
      "loadstart",
      "playing",
      "stalled",
      "suspend",
      "waiting",
    ];
  }
  get tracksToMonitor() {
    return [this.mediaController.media.textTracks];
  }
  get control() {
    return this.mediaController.controls.overflowButton;
  }
  buttonWasPressed(control) {
    this.mediaController.showMediaControlsContextMenu(control, {
      includeSubtitles: !this.mediaController.isAudio,
    });
  }
  syncControl() {
    this.control.enabled = this.mediaController.canShowMediaControlsContextMenu;
    let defaultContextMenuOptions = { includeShowMediaStats: true };
    if (this._includePlaybackRates)
      defaultContextMenuOptions.includePlaybackRates = true;
    for (let textTrack of this.mediaController.media.textTracks) {
      if (textTrack.kind !== "chapters") continue;
      if (textTrack.mode === "disabled") textTrack.mode = "hidden";
      defaultContextMenuOptions.includeChapters = true;
    }
    this.control.defaultContextMenuOptions = defaultContextMenuOptions;
  }
  get _includePlaybackRates() {
    if (this.mediaController.hidePlaybackRates) return false;
    let media = this.mediaController.media;
    if (
      media.duration > maxNonLiveDuration &&
      media.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
    ) {
      return false;
    }
    if (window.MediaStream && media.srcObject instanceof MediaStream) {
      return false;
    }
    return true;
  }
}
const PiPMode = "picture-in-picture";
const InlineMode = "inline";
class PiPSupport extends MediaControllerSupport {
  get control() {
    return this.mediaController.controls.pipButton;
  }
  get mediaEvents() {
    return [
      "loadedmetadata",
      "error",
      "webkitpresentationmodechanged",
      "webkitcurrentplaybacktargetiswirelesschanged",
    ];
  }
  get tracksToMonitor() {
    return [this.mediaController.media.videoTracks];
  }
  buttonWasPressed(control) {
    const media = this.mediaController.media;
    if (!document.pictureInPictureEnabled) {
      media.webkitSetPresentationMode(
        media.webkitPresentationMode === PiPMode ? InlineMode : PiPMode,
      );
      return;
    }
    if (!document.pictureInPictureElement) media.requestPictureInPicture();
    else document.exitPictureInPicture();
  }
  syncControl() {
    if (!this.mediaController.layoutTraits?.supportsPiP()) {
      this.control.enabled = false;
      return;
    }
    const media = this.mediaController.media;
    if (media.webkitSupportsPresentationMode)
      this.control.enabled =
        !this.mediaController.isAudio &&
        media.webkitSupportsPresentationMode(PiPMode) &&
        !media.webkitCurrentPlaybackTargetIsWireless;
    else this.control.enabled = false;
  }
}
class PlacardSupport extends MediaControllerSupport {
  constructor(mediaController) {
    super(mediaController);
    this._updatePlacard();
  }
  get mediaEvents() {
    return [
      "loadstart",
      "error",
      "webkitpresentationmodechanged",
      "webkitcurrentplaybacktargetiswirelesschanged",
    ];
  }
  handleEvent(event) {
    this._updatePlacard();
  }
  enable() {
    super.enable();
    this._isDisabled = false;
    this._updatePlacard();
  }
  disable() {
    this._isDisabled = true;
    this._updatePlacard();
  }
  _updatePlacard() {
    const controls = this.mediaController.controls;
    const media = this.mediaController.media;
    let placard = null;
    if (
      media.webkitPresentationMode === "picture-in-picture" &&
      this._controlsNeedJavascriptPipPlacard()
    )
      placard = controls.pipPlacard;
    else if (
      media.webkitPresentationMode === "fullscreen" &&
      this._controlsNeedJavascriptFullscreenPlacard()
    )
      placard = controls.fullscreenPlacard;
    else if (media.webkitCurrentPlaybackTargetIsWireless) {
      this._updateAirPlayPlacard();
      placard = controls.airplayPlacard;
    } else if (
      !this._isDisabled &&
      media instanceof HTMLVideoElement &&
      media.error !== null &&
      media.played.length === 0
    )
      placard = controls.invalidPlacard;
    controls.placard = placard;
  }
  _controlsNeedJavascriptPipPlacard() {
    if (this.mediaController.controls instanceof IOSInlineMediaControls)
      return false;
    return true;
  }
  _controlsNeedJavascriptFullscreenPlacard() {
    if (
      this.mediaController.controls instanceof TVOSMediaControls &&
      this.mediaController.host.isAVExperienceControllerFullscreenEnabled
    )
      return true;
    return false;
  }
  _updateAirPlayPlacard() {
    if (!this.mediaController.host) return;
    var deviceName = "";
    var routeName = UIString("AirPlay");
    switch (this.mediaController.host.externalDeviceType) {
      case "airplay":
        deviceName = UIString(
          "This video is playing on \u201C%s\u201D.",
          escapeHTML(this.mediaController.host.externalDeviceDisplayName) ||
            UIString("Apple TV"),
        );
        if (this.mediaController.host.externalDeviceRouteName)
          routeName = escapeHTML(
            this.mediaController.host.externalDeviceRouteName,
          );
        break;
      case "tvout":
        deviceName = UIString("This video is playing on the TV.");
        break;
    }
    this.mediaController.controls.airplayPlacard.title = routeName;
    this.mediaController.controls.airplayPlacard.description = deviceName;
  }
}
function escapeHTML(unsafeString) {
  var div = document.createElement("div");
  div.textContent = unsafeString;
  return div.innerHTML;
}
class PlaybackSupport extends MediaControllerSupport {
  get control() {
    return this.mediaController.controls.playPauseButton;
  }
  get mediaEvents() {
    return ["play", "pause"];
  }
  buttonWasPressed(control) {
    this.mediaController.togglePlayback();
  }
  syncControl() {
    this.control.playing = !this.mediaController.media.paused;
  }
}
class ScrubbingSupport extends MediaControllerSupport {
  get control() {
    return this.mediaController.controls.timeControl.scrubber;
  }
  get mediaEvents() {
    return ["progress"];
  }
  controlValueWillStartChanging(control) {
    const media = this.mediaController.media;
    const isPaused = media.paused;
    if (!isPaused) media.pause();
    this._wasPausedWhenScrubbingStarted = isPaused;
  }
  controlValueDidChange(control) {
    const media = this.mediaController.media;
    const seekTime = control.value * media.duration;
    this._targetSeekTime = seekTime;
    media.fastSeek(seekTime);
    this.mediaController.controls.timeControl.currentTime = seekTime;
  }
  controlValueDidStopChanging(control) {
    const media = this.mediaController.media;
    if (this._targetSeekTime && media.currentTime != this._targetSeekTime)
      media.currentTime = this._targetSeekTime;
    delete this._targetSeekTime;
    if (!this._wasPausedWhenScrubbingStarted) this.mediaController.media.play();
    delete this._wasPausedWhenScrubbingStarted;
  }
  syncControl() {
    const media = this.mediaController.media;
    if (isNaN(media.duration)) return;
    const endTimeForBufferedRangeContainingCurrentTime = () => {
      const ranges = media.buffered;
      const currentTime = media.currentTime;
      for (let i = 0; i < ranges.length; ++i) {
        if (currentTime < ranges.start(i)) continue;
        const end = ranges.end(i);
        if (currentTime <= end) return end;
      }
      return 0;
    };
    this.control.secondaryValue =
      endTimeForBufferedRangeContainingCurrentTime() / media.duration;
  }
}
class SeekSupport extends MediaControllerSupport {
  get mediaEvents() {
    return ["durationchange"];
  }
  get multiplier() {}
  buttonPressedStateDidChange(control, isPressed) {
    if (isPressed) this._startSeeking();
    else this._stopSeeking();
  }
  syncControl() {
    this.control.enabled =
      this.mediaController.media.duration <= maxNonLiveDuration;
  }
  _startSeeking() {
    const media = this.mediaController.media;
    const isPaused = media.paused;
    if (isPaused) media.play();
    this._wasPausedWhenSeekingStarted = isPaused;
    this._interval = window.setInterval(
      this._seek.bind(this),
      SeekSupport.SeekDelay,
    );
    this._seek();
  }
  _stopSeeking() {
    const media = this.mediaController.media;
    media.playbackRate = media.defaultPlaybackRate;
    if (this._wasPausedWhenSeekingStarted) media.pause();
    if (this._interval) window.clearInterval(this._interval);
  }
  _seek() {
    const media = this.mediaController.media;
    media.playbackRate =
      Math.min(SeekSupport.MaximumSeekRate, Math.abs(media.playbackRate * 2)) *
      this.multiplier;
  }
}
SeekSupport.MaximumSeekRate = 8;
SeekSupport.SeekDelay = 1500;
class SeekBackwardSupport extends SeekSupport {
  get control() {
    return this.mediaController.controls.rewindButton;
  }
  get multiplier() {
    return -1;
  }
}
class SeekForwardSupport extends SeekSupport {
  get control() {
    return this.mediaController.controls.forwardButton;
  }
  get multiplier() {
    return 1;
  }
}
class SkipBackSupport extends MediaControllerSupport {
  get control() {
    return this.mediaController.controls.skipBackButton;
  }
  get mediaEvents() {
    return ["durationchange"];
  }
  buttonWasPressed(control) {
    const media = this.mediaController.media;
    media.currentTime = Math.max(
      media.currentTime - this.mediaController.layoutTraits.skipDuration(),
      media.seekable.start(0),
    );
  }
  syncControl() {
    const supportsSeeking =
      !this.mediaController.host || this.mediaController.host.supportsSeeking;
    this.control.enabled =
      supportsSeeking &&
      this.mediaController.media.duration <= maxNonLiveDuration;
  }
}
class SkipForwardSupport extends MediaControllerSupport {
  get control() {
    return this.mediaController.controls.skipForwardButton;
  }
  get mediaEvents() {
    return ["durationchange"];
  }
  buttonWasPressed(control) {
    const media = this.mediaController.media;
    media.currentTime = Math.min(
      media.currentTime + this.mediaController.layoutTraits.skipDuration(),
      media.seekable.end(0),
    );
  }
  syncControl() {
    const supportsSeeking =
      !this.mediaController.host || this.mediaController.host.supportsSeeking;
    this.control.enabled =
      supportsSeeking &&
      this.mediaController.media.duration <= maxNonLiveDuration;
  }
}
class StartSupport extends MediaControllerSupport {
  constructor(mediaController) {
    super(mediaController);
    this._updateShowsStartButton();
  }
  get mediaEvents() {
    return [
      "loadedmetadata",
      "play",
      "error",
      this.mediaController.fullscreenChangeEventType,
    ];
  }
  enable() {
    super.enable();
    this._updateShowsStartButton();
    this.mediaController.shadowRoot.addEventListener(
      "fullscreenchange",
      this,
      true,
    );
  }
  disable() {
    super.disable();
    this.mediaController.shadowRoot.removeEventListener(
      "fullscreenchange",
      this,
      true,
    );
  }
  buttonWasPressed(control) {
    this.mediaController.media.play();
  }
  handleEvent(event) {
    super.handleEvent(event);
    this._updateShowsStartButton();
  }
  _updateShowsStartButton() {
    this.mediaController.controls.showsStartButton =
      this._shouldShowStartButton();
  }
  _shouldShowStartButton() {
    const media = this.mediaController.media;
    const host = this.mediaController.host;
    if (host && host.inWindowFullscreen) return false;
    if (host && host.shouldForceControlsDisplay) return true;
    if (this.mediaController.hasPlayed) return false;
    if (!media.paused) return false;
    if (media.autoplay) return false;
    if (media instanceof HTMLAudioElement) return false;
    if (this.mediaController.isFullscreen) return false;
    if (media.error) return false;
    if (!media.controls && host && host.allowsInlineMediaPlayback) return false;
    return true;
  }
}
class StatusSupport extends MediaControllerSupport {
  get control() {
    return this.mediaController.controls.statusLabel;
  }
  get mediaEvents() {
    return [
      "durationchange",
      "loadstart",
      "error",
      "abort",
      "suspend",
      "stalled",
      "waiting",
      "playing",
      "emptied",
      "loadedmetadata",
      "loadeddata",
      "canplay",
      "canplaythrough",
    ];
  }
  syncControl() {
    const media = this.mediaController.media;
    const isLiveBroadcast = media.duration > maxNonLiveDuration;
    const canPlayThrough =
      media.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA && !media.error;
    if (!!media.error) this.control.text = UIString("Error");
    else if (
      isLiveBroadcast &&
      media.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
    )
      this.control.text = UIString("Live Broadcast");
    else this.control.text = "";
    this.mediaController.controls.timeControl.loading =
      !media.played.length &&
      !canPlayThrough &&
      media.networkState === HTMLMediaElement.NETWORK_LOADING;
  }
}
class TimeControlSupport extends MediaControllerSupport {
  enable() {
    super.enable();
    this.control.supportsSeeking =
      !this.mediaController.host || this.mediaController.host.supportsSeeking;
  }
  get control() {
    return this.mediaController.controls.timeControl;
  }
  get mediaEvents() {
    return ["timeupdate", "durationchange"];
  }
  syncControl() {
    const media = this.mediaController.media;
    this.control.currentTime = media.currentTime;
    this.control.duration = media.duration;
  }
}
class TracksSupport extends MediaControllerSupport {
  get control() {
    return this.mediaController.controls.tracksButton;
  }
  get mediaEvents() {
    return ["loadedmetadata"];
  }
  get tracksToMonitor() {
    return [
      this.mediaController.media.audioTracks,
      this.mediaController.media.textTracks,
    ];
  }
  buttonWasPressed(control) {
    this.mediaController.showMediaControlsContextMenu(control, {
      promoteSubMenus:
        this.mediaController.layoutTraits.promoteSubMenusWhenShowingMediaControlsContextMenu(),
      includeSubtitles: !this.mediaController.isAudio,
    });
  }
  syncControl() {
    this.control.enabled =
      this.mediaController.canShowMediaControlsContextMenu &&
      (this._canPickAudioTracks() || this._canPickTextTracks());
  }
  _textTracks() {
    return this._sortedTrackList(this.mediaController.media.textTracks);
  }
  _audioTracks() {
    return this._sortedTrackList(this.mediaController.media.audioTracks);
  }
  _canPickAudioTracks() {
    const audioTracks = this.mediaController.media.audioTracks;
    return audioTracks && audioTracks.length > 1;
  }
  _canPickTextTracks() {
    if (this.mediaController.isAudio) return false;
    const textTracks = this.mediaController.media.textTracks;
    return textTracks && textTracks.length > 0;
  }
  _sortedTrackList(tracks) {
    return this.mediaController.host
      ? this.mediaController.host.sortedTrackListForMenu(tracks)
      : Array.from(tracks);
  }
}
class VolumeSupport extends MediaControllerSupport {
  get control() {
    return this.mediaController.controls.volumeSlider;
  }
  get mediaEvents() {
    return ["volumechange"];
  }
  controlValueWillStartChanging(control) {
    this._volumeBeforeChange = this.mediaController.media.volume;
  }
  controlValueDidChange(control) {
    this.mediaController.media.volume =
      control.value === 0 && this._volumeBeforeChange > 0
        ? this._volumeBeforeChange
        : control.value;
    this.mediaController.media.muted = control.value === 0;
  }
  syncControl(event) {
    const media = this.mediaController.media;
    const controlValue = media.muted ? 0 : media.volume;
    if (event) this.control.setValueAnimated(controlValue);
    else this.control.value = controlValue;
  }
}
class MediaDocumentController {
  constructor(mediaController) {
    this.mediaController = mediaController;
    mediaController.controls.shouldUseAudioLayout = true;
    mediaController.controls.timeControl.loading = true;
    const media = mediaController.media;
    media.classList.add("media-document");
    media.classList.add("audio");
    let deviceType = window.navigator.platform;
    if (deviceType == "MacIntel")
      deviceType = mediaController.layoutTraits.supportsTouches()
        ? "ipad"
        : "mac";
    else if (deviceType.startsWith("Linux")) deviceType = "linux";
    media.classList.add(deviceType);
  }
  layout() {
    scheduler.scheduleLayout(() => {
      const media = this.mediaController.media;
      const isInvalid = media.error !== null && media.played.length === 0;
      const useVideoLayout =
        isInvalid ||
        (media.readyState >= HTMLMediaElement.HAVE_METADATA &&
          !this.mediaController.isAudio);
      const classList = media.classList;
      classList.toggle("invalid", isInvalid);
      classList.toggle("video", useVideoLayout);
      classList.toggle("audio", !useVideoLayout);
    });
  }
}
class WatchOSMediaControlsSupport extends MediaControllerSupport {
  get mediaEvents() {
    return ["pause", "error"];
  }
  handleEvent(event) {
    switch (event.type) {
      case "pause":
        this.mediaController.controls.state = WatchOSMediaControls.State.Paused;
        break;
      case "error":
        this.mediaController.controls.state =
          WatchOSMediaControls.State.Invalid;
        break;
    }
  }
  enable() {
    super.enable();
    for (let button of this._buttons) button.uiDelegate = this;
  }
  disable() {
    super.disable();
    for (let button of this._buttons) button.uiDelegate = null;
  }
  buttonWasPressed(button) {
    switch (button) {
      case this.mediaController.controls.playButton:
        this.mediaController.media.play();
        this.mediaController.controls.state =
          WatchOSMediaControls.State.Pending;
        break;
      case this.mediaController.controls.activityIndicator:
        this.mediaController.media.pause();
        this.mediaController.controls.state = WatchOSMediaControls.State.Paused;
        break;
    }
  }
  get _buttons() {
    return [
      this.mediaController.controls.playButton,
      this.mediaController.controls.activityIndicator,
    ];
  }
}
const maxNonLiveDuration = 604800;
const MaximumNarrowViewerControlsBarWidth = 468;
class MediaController {
  static EmptyRanges = {
    get length() {
      return 0;
    },
    start: function (index) {
      return undefined;
    },
    end: function (index) {
      return undefined;
    },
  };
  static NullMedia = {
    get audioTracks() {
      return [];
    },
    get autoplay() {
      return false;
    },
    get buffered() {
      return MediaController.EmptyRanges;
    },
    get controls() {
      return false;
    },
    get currentTime() {
      return 0;
    },
    set currentTime(time) {},
    get defaultPlaybackRate() {
      return 1;
    },
    set defaultPlaybackRate(rate) {},
    get duration() {
      return 0;
    },
    get error() {
      return null;
    },
    get muted() {
      return false;
    },
    set muted(muted) {},
    get networkState() {
      return HTMLMediaElement.NETWORK_NO_SOURCE;
    },
    get paused() {
      return false;
    },
    get playbackRate() {
      return 1;
    },
    set playbackRate(rate) {},
    get played() {
      return MediaController.EmptyRanges;
    },
    get readyState() {
      return HTMLMediaElement.HAVE_NOTHING;
    },
    get seekable() {
      return MediaController.EmptyRanges;
    },
    get textTracks() {
      return [];
    },
    get videoTracks() {
      return [];
    },
    get volume() {
      return 1;
    },
    set volume(volume) {},
    get webkitCurrentPlaybackTargetIsWireless() {
      return false;
    },
    get webkitPresentationMode() {
      return "inline";
    },
    get webkitSupportsFullscreen() {
      return false;
    },
    pause: function () {},
    play: function () {},
    fastSeek: function (time) {},
    requestPictureInPicture: function () {},
    webkitEnterFullscreen: function () {},
    webkitExitFullscreen: function () {},
    webkitSetPresentationMode: function (mode) {},
    webkitShowPlaybackTargetPicker: function () {},
    webkitSupportsPresentationMode: function (mode) {
      return false;
    },
  };
  constructor(shadowRoot, media, host) {
    this.shadowRootWeakRef = new WeakRef(shadowRoot);
    this.mediaWeakRef = new WeakRef(media);
    this.host = host;
    this.fullscreenChangeEventType = media.webkitSupportsPresentationMode
      ? "webkitpresentationmodechanged"
      : "webkitfullscreenchange";
    this.hasPlayed = !media.paused || !!media.played.length;
    this.container = shadowRoot.appendChild(document.createElement("div"));
    this._updateControlsIfNeeded();
    this._usesLTRUserInterfaceLayoutDirection = false;
    if (host) {
      this.container.className = host.mediaControlsContainerClassName;
      host.controlsDependOnPageScaleFactor =
        this.layoutTraits.controlsDependOnPageScaleFactor();
      this.container.insertBefore(
        host.textTrackContainer,
        this.controls.element,
      );
      if (host.isInMediaDocument)
        this.mediaDocumentController = new MediaDocumentController(this);
    }
    scheduler.flushScheduledLayoutCallbacks();
    shadowRoot.addEventListener("resize", this);
    shadowRoot.addEventListener("fullscreenchange", this);
    media.videoTracks.addEventListener("addtrack", this);
    media.videoTracks.addEventListener("removetrack", this);
    media.addEventListener("play", this);
    media.addEventListener(this.fullscreenChangeEventType, this);
    media.addEventListener("keydown", this);
    media.addEventListener("keyup", this);
    media.addEventListener("click", this);
    window.addEventListener("keydown", this);
    new MutationObserver(this._updateControlsAvailability.bind(this)).observe(
      this.media,
      { attributes: true, attributeFilter: ["controls"] },
    );
  }
  get media() {
    return this.mediaWeakRef.deref() ?? MediaController.NullMedia;
  }
  get shadowRoot() {
    return this.shadowRootWeakRef ? this.shadowRootWeakRef.deref() : null;
  }
  get isAudio() {
    if (this.media instanceof HTMLAudioElement) return true;
    if (
      this.host &&
      !this.host.isInMediaDocument &&
      this.media instanceof HTMLVideoElement
    )
      return false;
    if (this.media.readyState < HTMLMediaElement.HAVE_METADATA) return false;
    if (this.media.videoWidth || this.media.videoHeight) return false;
    return !this.media.videoTracks.length;
  }
  get isYouTubeEmbedWithTitle() {
    const url = new URL(this.media.ownerDocument.defaultView.location.href);
    return (
      url.href.includes("youtube.com/embed/") &&
      url.searchParams.get("showinfo") !== "0"
    );
  }
  get isFullscreen() {
    if (!this.media) return false;
    return this.media.webkitSupportsPresentationMode
      ? this.media.webkitPresentationMode === "fullscreen" ||
          (this.host && this.host.inWindowFullscreen)
      : this.media.webkitDisplayingFullscreen;
  }
  get layoutTraits() {
    let mode = LayoutTraits.Mode.Inline;
    if (this.isFullscreen) {
      if (
        this.host &&
        this.host.inWindowFullscreen &&
        this.media.offsetWidth < MaximumNarrowViewerControlsBarWidth
      )
        mode = LayoutTraits.Mode.NarrowViewer;
      else mode = LayoutTraits.Mode.Fullscreen;
    }
    if (this.host) {
      let LayoutTraitsClass =
        window.layoutTraitsClasses[this.host.layoutTraitsClassName];
      return new LayoutTraitsClass(mode);
    }
    return new MacOSLayoutTraits(mode);
  }
  togglePlayback() {
    if (this.media.paused || !this.hasPlayed)
      this.media.play().catch((e) => {});
    else this.media.pause();
  }
  get canShowMediaControlsContextMenu() {
    return !!this.host?.showMediaControlsContextMenu;
  }
  showMediaControlsContextMenu(button, options = {}) {
    if (!this.canShowMediaControlsContextMenu) return false;
    let autoHideController = this.controls.autoHideController;
    let willShowContextMenu = this.host.showMediaControlsContextMenu(
      button.element,
      { ...button.contextMenuOptions, ...options },
      () => {
        button.on = false;
        autoHideController.hasSecondaryUIAttached = false;
      },
    );
    if (willShowContextMenu) {
      button.on = true;
      autoHideController.hasSecondaryUIAttached = true;
    }
    return willShowContextMenu;
  }
  set pageScaleFactor(pageScaleFactor) {
    this.controls.scaleFactor = pageScaleFactor;
    this._updateControlsSize();
  }
  set usesLTRUserInterfaceLayoutDirection(flag) {
    if (this._usesLTRUserInterfaceLayoutDirection === flag) return;
    this._usesLTRUserInterfaceLayoutDirection = flag;
    this.controls.usesLTRUserInterfaceLayoutDirection = flag;
  }
  mediaControlsVisibilityDidChange() {
    this._controlsUserVisibilityDidChange();
  }
  mediaControlsFadedStateDidChange() {
    this._controlsUserVisibilityDidChange();
    this._updateTextTracksClassList();
  }
  macOSControlsBackgroundWasClicked() {
    if (
      this.media.controls ||
      (this.host && this.host.shouldForceControlsDisplay)
    )
      this.togglePlayback();
  }
  iOSInlineMediaControlsRecognizedTapGesture() {
    if (this.media.controls) this.media.play();
  }
  iOSInlineMediaControlsRecognizedPinchInGesture() {
    this.media.webkitEnterFullscreen();
  }
  handleEvent(event) {
    if (
      event instanceof TrackEvent &&
      event.currentTarget === this.media.videoTracks
    )
      this._updateControlsIfNeeded();
    else if (
      event.type === "resize" &&
      event.currentTarget === this.shadowRoot
    ) {
      this._updateControlsIfNeeded();
      scheduler.flushScheduledLayoutCallbacks();
    } else if (
      event.type === "fullscreenchange" &&
      event.currentTarget === this.shadowRoot
    ) {
      this._updateControlsAvailability();
    } else if (
      event.type === "keydown" &&
      this.isFullscreen &&
      event.key === " "
    ) {
      this.togglePlayback();
      event.preventDefault();
      event.stopPropagation();
    } else if (
      event.type === "keyup" &&
      this.isFullscreen &&
      event.key === " "
    ) {
      event.preventDefault();
      event.stopPropagation();
    } else if (event.type === "dragstart" && this.isFullscreen)
      event.preventDefault();
    else if (event.type === this.fullscreenChangeEventType)
      this.host?.presentationModeChanged?.();
    else if (event.type === "click" && event.target === this.media) {
      if (this.host && this.host.inWindowFullscreen) {
        this.media.webkitExitFullscreen();
        event.stopPropagation();
      }
    }
    if (event.currentTarget === this.media) {
      if (event.type === "play") this.hasPlayed = true;
      this._updateControlsIfNeeded();
      this._updateControlsAvailability();
    }
  }
  setShowingStats(shouldShowStats) {
    if (!(this.media instanceof HTMLVideoElement)) return false;
    if (!shouldShowStats) {
      this._statsContainer?.remove();
      this._statsContainer = null;
      return false;
    }
    if (this._statsContainer) return true;
    this._statsContainer = this.container.appendChild(
      document.createElement("div"),
    );
    this._statsContainer.className = "stats-container";
    let table = this._statsContainer.appendChild(
      document.createElement("table"),
    );
    function createRow(label) {
      let rowElement = table.appendChild(document.createElement("tr"));
      let labelElement = rowElement.appendChild(document.createElement("th"));
      labelElement.textContent = label;
      let valueElement = rowElement.appendChild(document.createElement("td"));
      return valueElement;
    }
    let sourceValueElement = createRow(UIString("Source"));
    let viewportValueElement = createRow(UIString("Viewport"));
    let framesValueElement = createRow(UIString("Frames"));
    let resolutionValueElement = createRow(UIString("Resolution"));
    let codecsValueElement = createRow(UIString("Codecs"));
    let colorValueElement = createRow(UIString("Color"));
    let update = () => {
      if (!this._statsContainer) return;
      let quality = this.media.getVideoPlaybackQuality();
      let videoTrack = this.media.videoTracks.item(
        this.media.videoTracks.selectedIndex,
      );
      let videoTrackConfiguration = videoTrack.configuration;
      let videoColorSpace = videoTrackConfiguration?.colorSpace;
      sourceValueElement.textContent = UIString(this.host.sourceType ?? "none");
      viewportValueElement.textContent =
        UIString("%s\u00d7%s", this.controls.width, this.controls.height) +
        (window.devicePixelRatio !== 1
          ? " " +
            UIString("(%s)", UIString("%s\u00d7", window.devicePixelRatio))
          : "");
      framesValueElement.textContent = UIString(
        "%s dropped of %s",
        quality.droppedVideoFrames,
        quality.totalVideoFrames,
      );
      resolutionValueElement.textContent =
        UIString(
          "%s\u00d7%s",
          videoTrackConfiguration?.width,
          videoTrackConfiguration?.height,
        ) +
        " " +
        UIString(
          "(%s)",
          UIString(
            "%sfps",
            Math.round(videoTrackConfiguration?.framerate * 1000) / 1000,
          ),
        );
      codecsValueElement.textContent = videoTrackConfiguration?.codec;
      colorValueElement.textContent = UIString(
        "%s / %s / %s",
        videoColorSpace?.primaries,
        videoColorSpace?.transfer,
        videoColorSpace?.matrix,
      );
      window.requestAnimationFrame(update);
    };
    update();
    return true;
  }
  deinitialize() {
    this.shadowRoot.removeChild(this.container);
    window.removeEventListener("keydown", this);
    if (this.controls) this.controls.disable();
    return true;
  }
  reinitialize(shadowRoot, media, host) {
    iconService.shadowRoot = shadowRoot;
    this.shadowRootWeakRef = new WeakRef(shadowRoot);
    this.mediaWeakRef = new WeakRef(media);
    this.host = host;
    shadowRoot.appendChild(this.container);
    window.addEventListener("keydown", this);
    if (this.controls) this.controls.reenable();
    return true;
  }
  _updateControlsIfNeeded() {
    const layoutTraits = this.layoutTraits;
    const previousControls = this.controls;
    const ControlsClass = layoutTraits.mediaControlsClass();
    if (previousControls && previousControls.constructor === ControlsClass) {
      this._updateTextTracksClassList();
      this._updateControlsSize();
      return;
    }

    if (this._supportingObjects) {
      for (let supportingObject of this._supportingObjects)
        supportingObject.disable();
    }
    if (previousControls) previousControls.disable();
    this.controls = new ControlsClass({ mode: layoutTraits.mode });
    this.controls.delegate = this;
    if (
      this.controls.autoHideController &&
      this.shadowRoot.host &&
      this.shadowRoot.host.dataset.autoHideDelay
    )
      this.controls.autoHideController.autoHideDelay =
        this.shadowRoot.host.dataset.autoHideDelay;
    if (previousControls) {
      this.controls.fadeIn();
      this.container.replaceChild(
        this.controls.element,
        previousControls.element,
      );
      this.controls.usesLTRUserInterfaceLayoutDirection =
        previousControls.usesLTRUserInterfaceLayoutDirection;
    } else this.container.appendChild(this.controls.element);
    this._updateTextTracksClassList();
    this._updateControlsSize();
    this._supportingObjects = layoutTraits
      .supportingObjectClasses()
      .map((SupportClass) => new SupportClass(this), this);
    this.controls.shouldUseSingleBarLayout =
      this.controls instanceof InlineMediaControls &&
      this.isYouTubeEmbedWithTitle;
    if (this.controls instanceof MacOSFullscreenMediaControls)
      window.addEventListener("dragstart", this, true);
    else window.removeEventListener("dragstart", this, true);
    this._stopPropagationOnTouchEvents();
    if (this.host && this.host.inWindowFullscreen) {
      this._stopPropagationOnClickEvents();
      if (!this.host.supportsRewind && this.controls.rewindButton)
        this.controls.rewindButton.dropped = true;
    }
    this._updateControlsAvailability();
    if (this.host?.needsChromeMediaControlsPseudoElement)
      this.controls.element.setAttribute(
        "useragentpart",
        "-webkit-media-controls",
      );
  }
  _stopPropagationOnClickEvents() {
    let clickEvents = [
      "click",
      "mousedown",
      "mouseup",
      "pointerdown",
      "pointerup",
    ];
    for (let clickEvent of clickEvents) {
      this.controls.element.addEventListener(clickEvent, (event) => {
        event.stopPropagation();
      });
    }
  }
  _stopPropagationOnTouchEvents() {
    let touchEvents = ["touchstart", "touchmove", "touchend"];
    for (let touchEvent of touchEvents) {
      this.controls.element.addEventListener(touchEvent, (event) => {
        if (event.target !== this.controls.element) event.stopPropagation();
      });
    }
  }
  _updateControlsSize() {
    this.controls.width = Math.round(
      this.container.offsetWidth * this.controls.scaleFactor,
    );
    this.controls.height = Math.round(
      this.container.offsetHeight * this.controls.scaleFactor,
    );
  }
  _updateTextTracksClassList() {
    if (!this.host) return;
    if (this.layoutTraits.isFullscreen) return;
    this.host.textTrackContainer.classList.toggle(
      "visible-controls-bar",
      !this.controls.faded,
    );
  }
  _controlsUserVisibilityDidChange() {
    if (!this.controls || !this._supportingObjects) return;
    this._supportingObjects.forEach((supportingObject) =>
      supportingObject.controlsUserVisibilityDidChange(),
    );
  }
  _shouldControlsBeAvailable() {
    if (this.layoutTraits.controlsNeverAvailable()) return false;
    if (
      this.controls instanceof IOSInlineMediaControls &&
      this.media.webkitPresentationMode === "picture-in-picture"
    )
      return false;
    return (
      this.media.controls ||
      !!(this.host && this.host.shouldForceControlsDisplay)
    );
  }
  _updateControlsAvailability() {
    const shouldControlsBeAvailable = this._shouldControlsBeAvailable();
    if (!shouldControlsBeAvailable)
      this._supportingObjects.forEach((supportingObject) =>
        supportingObject.disable(),
      );
    else
      this._supportingObjects.forEach((supportingObject) =>
        supportingObject.enable(),
      );
    this.controls.visible = shouldControlsBeAvailable;
  }
  set maximumRightContainerButtonCountOverride(count) {
    this.controls.maximumRightContainerButtonCountOverride = count;
  }
}
