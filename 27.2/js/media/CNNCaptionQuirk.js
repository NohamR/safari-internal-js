//# sourceURL=__InjectedScript_CNNCaptionQuirk.js
(function () {
  "use strict";

  class CaptionMirror {
    static _instances = new WeakMap();
    constructor(video) {
      let oldMirror = CaptionMirror._instances.get(video);
      if (oldMirror) {
        oldMirror.invalidate();
        CaptionMirror._instances.delete(video);
      }
      CaptionMirror._instances.set(video, this);
      this._video = video;
      this._playerSelector = '[data-component-name="video-player"]';
      this._overlayRootSelector = '[data-testid="overlay-root"]';
      this._captionRowSelector = '[data-testid="cueBoxRowTextCue"]';
      this._player = this._findPlayerRoot(video);
      this._mirrorTrack = video.addTextTrack("forced", "CNN Captions");
      this._mirrorTrack.mode = "hidden";
      this._captionObserver = null;
      this._waitObserver = null;
      this._onPresentationModeChanged = () =>
        this._handlePresentationModeChanged();
      this._video.addEventListener(
        "webkitpresentationmodechanged",
        this._onPresentationModeChanged,
      );
      if (this._player) this._attachOverlayObserver();
    }
    invalidate() {
      if (this._captionObserver) {
        this._captionObserver.disconnect();
        this._captionObserver = null;
      }
      if (this._waitObserver) {
        this._waitObserver.disconnect();
        this._waitObserver = null;
      }
      this._mirrorTrack.mode = "disabled";
      this._video.removeEventListener(
        "webkitpresentationmodechanged",
        this._onPresentationModeChanged,
      );
    }
    _findPlayerRoot(video) {
      return video.closest(this._playerSelector);
    }
    _syncCues(overlayRoot) {
      while (this._mirrorTrack.cues?.length)
        this._mirrorTrack.removeCue(this._mirrorTrack.cues[0]);
      var rows = Array.from(
        overlayRoot.querySelectorAll(this._captionRowSelector),
      );
      if (!rows.length) return;
      var text = rows.map((row) => row.textContent).join("\n");
      if (!text) return;
      var cue = new VTTCue(0, 10e7, text);
      cue.snapToLines = true;
      cue.line = -4;
      cue.position = "auto";
      cue.positionAlign = "center";
      this._mirrorTrack.addCue(cue);
    }

    _attachOverlayObserver() {
      var overlayRoot = this._player.querySelector(this._overlayRootSelector);
      if (overlayRoot) {
        this._attachCaptionObserver(overlayRoot);
        return;
      }
      this._waitObserver = new MutationObserver(() => {
        var overlayRoot = this._player.querySelector(this._overlayRootSelector);
        if (overlayRoot) {
          this._attachCaptionObserver(overlayRoot);
          this._waitObserver.disconnect();
          this._waitObserver = null;
        }
      });
      this._waitObserver.observe(this._player, {
        childList: true,
        subtree: true,
      });
    }
    _attachCaptionObserver(overlayRoot) {
      if (this._captionObserver) this._captionObserver.disconnect();
      this._captionObserver = new MutationObserver(() => {
        var current = this._player.querySelector(this._overlayRootSelector);
        if (current) this._syncCues(current);
      });
      this._captionObserver.observe(overlayRoot, {
        childList: true,
        subtree: true,
        characterData: true,
      });
      this._syncCues(overlayRoot);
    }
    _handlePresentationModeChanged() {
      if (this._video.webkitPresentationMode == "inline") {
        this._mirrorTrack.mode = "hidden";
        return;
      }
      this._mirrorTrack.mode = "showing";
    }
  }
  window.setupCaptionMirroring = function (video) {
    new CaptionMirror(video);
  };
})();
