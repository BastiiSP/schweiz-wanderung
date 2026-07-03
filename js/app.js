(function () {
  'use strict';

  var screens = Array.prototype.slice.call(document.querySelectorAll('.screen'));
  var currentScreen = Flow.getInitialScreen();

  // Fortschrittspfad: 4 Etappen + Quiz = 5 Ruß-Wesen
  var TRAIL_STEPS = Content.stages.length + 1;

  function renderTrail(containerId, activeIndex) {
    var trail = document.getElementById(containerId);
    trail.innerHTML = '';
    for (var i = 0; i < TRAIL_STEPS; i += 1) {
      var soot = document.createElement('span');
      soot.className =
        'soot' +
        (i < activeIndex ? ' soot--done' : '') +
        (i === activeIndex ? ' soot--current' : '');
      trail.appendChild(soot);
    }
  }

  function showScreen(screenName) {
    screens.forEach(function (section) {
      var isStageScreen = section.dataset.screen === 'stage';
      var matches =
        section.dataset.screen === screenName ||
        (isStageScreen && screenName.indexOf('stage-') === 0);
      section.hidden = !matches;
      section.classList.remove('is-entering');
      if (matches) {
        // Reflow erzwingen, damit die Eintritts-Animation erneut läuft
        void section.offsetWidth;
        section.classList.add('is-entering');
      }
    });
    renderScreen(screenName);
  }

  function renderScreen(screenName) {
    if (screenName.indexOf('stage-') === 0) {
      var index = Number(screenName.split('-')[1]);
      document.getElementById('stage-text').textContent = Content.stages[index];
      renderTrail('stage-trail', index);
    }
    if (screenName === 'quiz') {
      renderTrail('quiz-trail', Content.stages.length);
      resetQuiz();
    }
    if (screenName === 'final') {
      document.getElementById('final-question').textContent = Content.finalQuestion;
    }
    if (screenName === 'security') {
      document.getElementById('security-question').textContent = Content.securityQuestion;
    }
    if (screenName === 'summit') {
      document.getElementById('summit-text').textContent = Content.summitText;
      SoundFx.play('fanfare');
      startConfetti(document.getElementById('confetti-canvas'));
    }
    if (screenName === 'certificate') {
      renderCertificate();
    }
  }

  function advance(decision) {
    currentScreen = Flow.getNextScreen(currentScreen, decision);
    showScreen(currentScreen);
  }

  // --- Start ---------------------------------------------------------------

  document.getElementById('start-text').textContent = Content.introText;

  document.getElementById('start-button').addEventListener('click', function () {
    SoundFx.unlock();
    SoundFx.play('pling');
    advance();
  });

  document.getElementById('stage-next-button').addEventListener('click', function () {
    SoundFx.play('pling');
    advance();
  });

  // --- Quiz ----------------------------------------------------------------

  var quizAnswered = false;

  function resetQuiz() {
    quizAnswered = false;
    document.getElementById('quiz-question').textContent = Content.quiz.question;
    var reaction = document.getElementById('quiz-reaction');
    reaction.hidden = true;
    reaction.textContent = '';
    document.getElementById('quiz-next-button').hidden = true;

    var options = document.getElementById('quiz-options');
    options.classList.remove('is-answered');
    options.innerHTML = '';
    Content.quiz.options.forEach(function (option) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'note';
      button.textContent = option.label;
      button.addEventListener('click', function () {
        answerQuiz(button, option);
      });
      options.appendChild(button);
    });
  }

  function answerQuiz(button, option) {
    if (quizAnswered) {
      return;
    }
    quizAnswered = true;
    button.classList.add('is-chosen');
    document.getElementById('quiz-options').classList.add('is-answered');
    var reaction = document.getElementById('quiz-reaction');
    reaction.textContent = option.reaction;
    reaction.hidden = false;
    document.getElementById('quiz-next-button').hidden = false;
    SoundFx.play('pling');
  }

  document.getElementById('quiz-next-button').addEventListener('click', function () {
    SoundFx.play('pling');
    advance();
  });

  // --- Ausweichende Zettel ---------------------------------------------------

  var dodgeAttempts = { final: 0, security: 0 };

  function dodgeButton(button, container, event) {
    var containerRect = container.getBoundingClientRect();
    var buttonRect = button.getBoundingClientRect();

    var position = Dodge.computeDodgePosition({
      buttonWidth: buttonRect.width,
      buttonHeight: buttonRect.height,
      containerWidth: containerRect.width,
      containerHeight: containerRect.height,
      avoidX: event.clientX - containerRect.left,
      avoidY: event.clientY - containerRect.top,
      minDistance: Math.max(buttonRect.width, buttonRect.height) * 1.6,
    });

    button.style.setProperty('--dodge-tilt', (Math.random() * 10 - 5).toFixed(1) + 'deg');
    button.classList.add('is-dodging');
    button.style.left = position.x + 'px';
    button.style.top = position.y + 'px';
  }

  function setupDodgeButtons(containerId, hintId, attemptKey) {
    var container = document.getElementById(containerId);
    var dodgers = Array.prototype.slice.call(container.querySelectorAll('.note--dodge'));

    dodgers.forEach(function (button) {
      button.addEventListener('pointerdown', function (event) {
        event.preventDefault();
        dodgeButton(button, container, event);
        dodgeAttempts[attemptKey] += 1;
        if (dodgeAttempts[attemptKey] >= 2) {
          var hint = document.getElementById(hintId);
          hint.textContent = Content.dodgeHint;
          hint.hidden = false;
        }
        SoundFx.play('boing');
      });
      // Falls ein Klick doch durchkommt: nichts tun
      button.addEventListener('click', function (event) {
        event.preventDefault();
      });
    });
  }

  function setupYesButton(containerId, decision) {
    var container = document.getElementById(containerId);
    var yes = container.querySelector('.note--yes');
    yes.addEventListener('click', function () {
      SoundFx.play('pling');
      advance(decision);
    });
  }

  setupDodgeButtons('final-answers', 'final-hint', 'final');
  setupDodgeButtons('security-answers', 'security-hint', 'security');
  setupYesButton('final-answers', 'ja');
  setupYesButton('security-answers', 'sicher');

  // --- Gipfel ----------------------------------------------------------------

  var confettiRunning = false;

  function startConfetti(canvas) {
    if (confettiRunning) {
      return;
    }
    confettiRunning = true;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    var ctx = canvas.getContext('2d');
    var particles = Confetti.createConfettiParticles(90, canvas.width);
    var startTime = null;

    function frame(timestamp) {
      if (!startTime) {
        startTime = timestamp;
      }
      var elapsed = timestamp - startTime;
      Confetti.renderConfettiFrame(ctx, particles, canvas.width, canvas.height, elapsed);
      if (elapsed < 6000) {
        requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confettiRunning = false;
      }
    }
    requestAnimationFrame(frame);
  }

  document.getElementById('summit-next-button').addEventListener('click', function () {
    SoundFx.play('pling');
    advance();
  });

  // --- Urkunde ---------------------------------------------------------------

  function renderCertificate() {
    var canvas = document.getElementById('certificate-canvas');
    var data = Certificate.buildCertificateData(Content, new Date());
    Certificate.loadBackgroundImage(Content.certificateImagePath).then(function (image) {
      Certificate.drawCertificateToCanvas(canvas, data, image);
    });
  }

  document
    .getElementById('certificate-download-button')
    .addEventListener('click', function () {
      Certificate.downloadCanvasAsPng(
        document.getElementById('certificate-canvas'),
        'melli-und-basti-urkunde.png'
      );
    });

  // --- Ton -------------------------------------------------------------------

  document.getElementById('mute-button').addEventListener('click', function () {
    var muted = SoundFx.toggleMute();
    var button = document.getElementById('mute-button');
    button.textContent = muted ? '🔇' : '🔊';
    button.setAttribute('aria-pressed', String(muted));
  });

  showScreen(currentScreen);
})();
