//# sourceURL=__InjectedScript_WDElementFetchAttributes.js
function enterFullscreen() {
  let callback = arguments[0];
  if (!document.fullscreenEnabled) {
    callback(false);
    return;
  }
  if (document.fullscreenElement) {
    callback(true);
    return;
  }
  let fullscreenChangeListener, fullscreenErrorListener;
  fullscreenChangeListener = (e) => {
    if (e.target !== document.documentElement) return;
    if (!document.fullscreenElement) return;
    document.removeEventListener("fullscreenchange", fullscreenChangeListener);
    document.documentElement.removeEventListener(
      "fullscreenerror",
      fullscreenErrorListener,
    );
    callback(true);
  };
  fullscreenErrorListener = (e) => {
    if (e.target !== document.documentElement) return;
    document.removeEventListener("fullscreenchange", fullscreenChangeListener);
    document.documentElement.removeEventListener(
      "fullscreenerror",
      fullscreenErrorListener,
    );
    callback(!!document.fullscreenElement);
  };
  document.addEventListener("fullscreenchange", fullscreenChangeListener);
  document.documentElement.addEventListener(
    "fullscreenerror",
    fullscreenErrorListener,
  );
  document.documentElement.requestFullscreen();
}
