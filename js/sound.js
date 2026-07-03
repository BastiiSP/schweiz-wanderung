(function (global) {
  'use strict';

  var audioContext = null;
  var muted = false;

  var RECIPES = {
    boing: {
      name: 'boing',
      type: 'sine',
      gain: 0.045,
      tones: [
        { frequency: 260, endFrequency: 520, duration: 0.12 },
        { frequency: 390, endFrequency: 310, duration: 0.08 }
      ]
    },
    pling: {
      name: 'pling',
      type: 'triangle',
      gain: 0.04,
      tones: [
        { frequency: 740, duration: 0.14 },
        { frequency: 990, duration: 0.12 }
      ]
    },
    fanfare: {
      name: 'fanfare',
      type: 'triangle',
      gain: 0.05,
      tones: [
        { frequency: 523.25, duration: 0.14 },
        { frequency: 659.25, duration: 0.14 },
        { frequency: 783.99, duration: 0.18 },
        { frequency: 1046.5, duration: 0.28 }
      ]
    }
  };

  function cloneRecipe(recipe) {
    if (!recipe) {
      return null;
    }

    return {
      name: recipe.name,
      type: recipe.type,
      gain: recipe.gain,
      tones: recipe.tones.map(function (tone) {
        return {
          frequency: tone.frequency,
          endFrequency: tone.endFrequency,
          duration: tone.duration
        };
      })
    };
  }

  function getAudioContextConstructor() {
    return global.AudioContext || global.webkitAudioContext || null;
  }

  function unlock() {
    var AudioContextCtor = getAudioContextConstructor();

    if (!AudioContextCtor) {
      return Promise.resolve(null);
    }

    if (!audioContext) {
      audioContext = new AudioContextCtor();
    }

    if (audioContext.state === 'suspended' && typeof audioContext.resume === 'function') {
      return audioContext.resume().then(function () {
        return audioContext;
      });
    }

    return Promise.resolve(audioContext);
  }

  function scheduleTone(context, tone, recipe, startTime) {
    var oscillator = context.createOscillator();
    var gainNode = context.createGain();
    var attack = 0.012;
    var release = 0.045;
    var endTime = startTime + tone.duration;

    oscillator.type = recipe.type;
    oscillator.frequency.setValueAtTime(tone.frequency, startTime);
    if (tone.endFrequency && typeof oscillator.frequency.exponentialRampToValueAtTime === 'function') {
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, tone.endFrequency), endTime);
    }

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.exponentialRampToValueAtTime(recipe.gain, startTime + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, Math.max(startTime + attack, endTime - release));
    gainNode.gain.setValueAtTime(0, endTime);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.start(startTime);
    oscillator.stop(endTime + 0.02);
  }

  function play(name) {
    if (muted) {
      return;
    }

    var recipe = RECIPES[name];
    if (!recipe || !audioContext) {
      return;
    }

    var startTime = audioContext.currentTime || 0;
    recipe.tones.forEach(function (tone) {
      scheduleTone(audioContext, tone, recipe, startTime);
      startTime += tone.duration * 0.82;
    });
  }

  function toggleMute() {
    muted = !muted;
    return muted;
  }

  function isMuted() {
    return muted;
  }

  function getSoundRecipe(name) {
    return cloneRecipe(RECIPES[name]);
  }

  var api = {
    unlock: unlock,
    play: play,
    toggleMute: toggleMute,
    isMuted: isMuted,
    getSoundRecipe: getSoundRecipe
  };

  if (typeof module !== 'undefined' && module.exports) { module.exports = api; } else { global.SoundFx = api; }
})(typeof window !== 'undefined' ? window : globalThis);
