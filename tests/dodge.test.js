const assert = require('node:assert/strict');
const test = require('node:test');

const Dodge = require('../js/dodge');

function rngFrom(values) {
  let index = 0;
  return () => values[index++ % values.length];
}

test('distanceFromPointToRect returns distance to rect center', () => {
  assert.equal(Dodge.distanceFromPointToRect(0, 0, 6, 8, 8, 4), Math.hypot(10, 10));
});

test('computeDodgePosition clamps the button inside the container', () => {
  const pos = Dodge.computeDodgePosition({
    buttonWidth: 40,
    buttonHeight: 20,
    containerWidth: 100,
    containerHeight: 80,
    avoidX: 50,
    avoidY: 40,
    minDistance: 10,
    rng: rngFrom([1, 1])
  });

  assert.deepEqual(pos, { x: 60, y: 60 });
});

test('computeDodgePosition retries until the center is far enough away', () => {
  const pos = Dodge.computeDodgePosition({
    buttonWidth: 20,
    buttonHeight: 20,
    containerWidth: 200,
    containerHeight: 200,
    avoidX: 100,
    avoidY: 100,
    minDistance: 80,
    rng: rngFrom([0.5, 0.5, 0, 0])
  });

  assert.deepEqual(pos, { x: 0, y: 0 });
  assert.ok(Dodge.distanceFromPointToRect(100, 100, pos.x, pos.y, 20, 20) >= 80);
});

test('computeDodgePosition falls back to the last candidate after maxAttempts', () => {
  const pos = Dodge.computeDodgePosition({
    buttonWidth: 20,
    buttonHeight: 20,
    containerWidth: 200,
    containerHeight: 200,
    avoidX: 100,
    avoidY: 100,
    minDistance: 500,
    rng: rngFrom([0.1, 0.2, 0.3, 0.4]),
    maxAttempts: 2
  });

  assert.deepEqual(pos, { x: 54, y: 72 });
});
