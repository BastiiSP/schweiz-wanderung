(function (global) {
  'use strict';

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function finiteNumber(value, fallback) {
    return typeof value === 'number' && isFinite(value) ? value : fallback;
  }

  function distanceFromPointToRect(px, py, rectX, rectY, rectW, rectH) {
    var centerX = rectX + rectW / 2;
    var centerY = rectY + rectH / 2;
    return Math.hypot(px - centerX, py - centerY);
  }

  function computeDodgePosition(options) {
    options = options || {};

    var buttonWidth = Math.max(0, finiteNumber(options.buttonWidth, 0));
    var buttonHeight = Math.max(0, finiteNumber(options.buttonHeight, 0));
    var containerWidth = Math.max(0, finiteNumber(options.containerWidth, buttonWidth));
    var containerHeight = Math.max(0, finiteNumber(options.containerHeight, buttonHeight));
    var maxX = Math.max(0, containerWidth - buttonWidth);
    var maxY = Math.max(0, containerHeight - buttonHeight);
    var avoidX = finiteNumber(options.avoidX, containerWidth / 2);
    var avoidY = finiteNumber(options.avoidY, containerHeight / 2);
    var minDistance = finiteNumber(options.minDistance, 80);
    var rng = typeof options.rng === 'function' ? options.rng : Math.random;
    var maxAttempts = Math.max(1, Math.floor(finiteNumber(options.maxAttempts, 20)));
    var candidate = { x: 0, y: 0 };

    for (var attempt = 0; attempt < maxAttempts; attempt += 1) {
      candidate = {
        x: clamp(rng() * maxX, 0, maxX),
        y: clamp(rng() * maxY, 0, maxY)
      };

      if (distanceFromPointToRect(avoidX, avoidY, candidate.x, candidate.y, buttonWidth, buttonHeight) >= minDistance) {
        return candidate;
      }
    }

    return candidate;
  }

  var api = {
    computeDodgePosition: computeDodgePosition,
    distanceFromPointToRect: distanceFromPointToRect
  };

  if (typeof module !== 'undefined' && module.exports) { module.exports = api; } else { global.Dodge = api; }
})(typeof window !== 'undefined' ? window : globalThis);
