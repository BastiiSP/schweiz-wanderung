const assert = require('node:assert/strict');
const test = require('node:test');

const Confetti = require('../js/confetti');

function rngFrom(values) {
  let index = 0;
  return () => values[index++ % values.length];
}

test('createConfettiParticles creates deterministic particles above the viewport', () => {
  const particles = Confetti.createConfettiParticles(2, 300, rngFrom([
    0, 0.25, 0.5, 0.75, 0.1, 0.2, 0.3, 0.4,
    1, 0, 0.25, 0.5, 0.6, 0.7, 0.8, 0.9
  ]));

  assert.equal(particles.length, 2);
  assert.equal(particles[0].x, 0);
  assert.ok(particles[0].y < 0);
  assert.ok(particles[0].size > 0);
  assert.ok(typeof particles[0].color === 'string');
  assert.ok('rotationSpeed' in particles[0]);
  assert.ok('sway' in particles[0]);
});

test('updateParticles returns new positions driven by elapsed time', () => {
  const particle = {
    x: 10,
    y: -20,
    vx: 4,
    vy: 50,
    size: 6,
    color: '#fff',
    rotation: 0,
    rotationSpeed: 2,
    sway: 10,
    swaySpeed: 3,
    phase: 0
  };

  const updated = Confetti.updateParticles([particle], 1000);
  assert.equal(updated.length, 1);
  assert.notEqual(updated[0], particle);
  assert.notEqual(updated[0].x, particle.x);
  assert.equal(updated[0].y, 30);
  assert.equal(updated[0].rotation, 2);
});
