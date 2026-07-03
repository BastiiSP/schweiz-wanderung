(function (global) {
  'use strict';

  var COLORS = ['#9b6ee8', '#d86ba8', '#f4c95d', '#fff7e6', '#f8d5ec', '#bda8ff'];

  function randBetween(rng, min, max) {
    return min + (max - min) * rng();
  }

  function createConfettiParticles(count, canvasWidth, rng) {
    rng = typeof rng === 'function' ? rng : Math.random;
    var particles = [];

    for (var i = 0; i < count; i += 1) {
      particles.push({
        x: randBetween(rng, 0, canvasWidth),
        y: -randBetween(rng, 20, 160),
        vx: randBetween(rng, -35, 35),
        vy: randBetween(rng, 45, 120),
        size: randBetween(rng, 5, 12),
        color: COLORS[Math.min(COLORS.length - 1, Math.floor(rng() * COLORS.length))],
        rotation: randBetween(rng, 0, Math.PI * 2),
        rotationSpeed: randBetween(rng, -4, 4),
        sway: randBetween(rng, 8, 28),
        swaySpeed: randBetween(rng, 1.5, 4.5),
        phase: randBetween(rng, 0, Math.PI * 2)
      });
    }

    return particles;
  }

  function updateParticles(particles, elapsedMs) {
    var seconds = elapsedMs / 1000;
    return particles.map(function (particle) {
      var swayOffset = Math.sin(seconds * particle.swaySpeed + particle.phase) * particle.sway;
      return {
        x: particle.x + particle.vx * seconds + swayOffset,
        y: particle.y + particle.vy * seconds,
        vx: particle.vx,
        vy: particle.vy,
        size: particle.size,
        color: particle.color,
        rotation: particle.rotation + particle.rotationSpeed * seconds,
        rotationSpeed: particle.rotationSpeed,
        sway: particle.sway,
        swaySpeed: particle.swaySpeed,
        phase: particle.phase
      };
    });
  }

  function renderConfettiFrame(ctx, particles, width, height, elapsedMs) {
    if (!ctx || typeof ctx.clearRect !== 'function') {
      return;
    }

    var positions = updateParticles(particles, elapsedMs);
    ctx.clearRect(0, 0, width, height);

    positions.forEach(function (particle) {
      if (particle.y > height + particle.size) {
        return;
      }

      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = 0.9;
      ctx.fillRect(-particle.size / 2, -particle.size / 3, particle.size, particle.size * 0.66);
      ctx.restore();
    });
  }

  var api = {
    COLORS: COLORS.slice(),
    createConfettiParticles: createConfettiParticles,
    updateParticles: updateParticles,
    renderConfettiFrame: renderConfettiFrame
  };

  if (typeof module !== 'undefined' && module.exports) { module.exports = api; } else { global.Confetti = api; }
})(typeof window !== 'undefined' ? window : globalThis);
