const assert = require('node:assert/strict');
const test = require('node:test');

const Flow = require('../js/flow');

test('flow starts at start and advances linearly through the happy path', () => {
  assert.equal(Flow.getInitialScreen(), 'start');

  const decisions = {
    final: 'ja',
    security: 'sicher'
  };
  const visited = [Flow.getInitialScreen()];
  let current = Flow.getInitialScreen();

  while (!Flow.isLastScreen(current)) {
    current = Flow.getNextScreen(current, decisions[current]);
    visited.push(current);
  }

  assert.deepEqual(visited, [
    'start',
    'stage-0',
    'stage-1',
    'stage-2',
    'stage-3',
    'quiz',
    'final',
    'security',
    'summit',
    'certificate'
  ]);
});

test('flow keeps refusals on final and security screens', () => {
  assert.equal(Flow.getNextScreen('final', 'nein'), 'final');
  assert.equal(Flow.getNextScreen('final'), 'final');
  assert.equal(Flow.getNextScreen('final', 'ja'), 'security');
  assert.equal(Flow.getNextScreen('security', 'unsicher'), 'security');
  assert.equal(Flow.getNextScreen('security'), 'security');
  assert.equal(Flow.getNextScreen('security', 'sicher'), 'summit');
});

test('flow handles last and unknown screens', () => {
  assert.equal(Flow.getNextScreen('certificate'), 'certificate');
  assert.equal(Flow.getNextScreen('missing-screen'), 'missing-screen');
  assert.equal(Flow.isLastScreen('certificate'), true);
  assert.equal(Flow.isLastScreen('summit'), false);
  assert.equal(Flow.isLastScreen('missing-screen'), false);
  assert.deepEqual(Flow.SCREEN_ORDER, [
    'start',
    'stage-0',
    'stage-1',
    'stage-2',
    'stage-3',
    'quiz',
    'final',
    'security',
    'summit',
    'certificate'
  ]);
});
