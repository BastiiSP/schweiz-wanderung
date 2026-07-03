(function (global) {
  'use strict';

  var SCREEN_ORDER = ['start', 'stage-0', 'stage-1', 'stage-2', 'stage-3', 'quiz', 'final', 'security', 'summit', 'certificate'];

  function getInitialScreen() {
    return SCREEN_ORDER[0];
  }

  function getNextScreen(currentScreen, decision) {
    var index = SCREEN_ORDER.indexOf(currentScreen);

    if (currentScreen === 'final') {
      return decision === 'ja' ? 'security' : 'final';
    }

    if (currentScreen === 'security') {
      return decision === 'sicher' ? 'summit' : 'security';
    }

    if (index === -1 || index === SCREEN_ORDER.length - 1) {
      return currentScreen;
    }

    return SCREEN_ORDER[index + 1];
  }

  function isLastScreen(screen) {
    return screen === SCREEN_ORDER[SCREEN_ORDER.length - 1];
  }

  var api = {
    SCREEN_ORDER: SCREEN_ORDER.slice(),
    getInitialScreen: getInitialScreen,
    getNextScreen: getNextScreen,
    isLastScreen: isLastScreen
  };

  if (typeof module !== 'undefined' && module.exports) { module.exports = api; } else { global.Flow = api; }
})(typeof window !== 'undefined' ? window : globalThis);
