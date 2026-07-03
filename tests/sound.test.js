const assert = require('node:assert/strict');
const test = require('node:test');

const SoundFx = require('../js/sound');

test('sound recipes are available as pure data', () => {
  for (const name of ['boing', 'pling', 'fanfare']) {
    const recipe = SoundFx.getSoundRecipe(name);
    assert.equal(recipe.name, name);
    assert.ok(Array.isArray(recipe.tones));
    assert.ok(recipe.tones.length > 0);
    assert.ok(recipe.tones.every((tone) => tone.frequency > 0 && tone.duration > 0));
  }
  assert.equal(SoundFx.getSoundRecipe('missing'), null);
});

test('mute toggles and reports state', () => {
  const initial = SoundFx.isMuted();
  const toggled = SoundFx.toggleMute();
  assert.equal(toggled, !initial);
  assert.equal(SoundFx.isMuted(), toggled);
  assert.equal(SoundFx.toggleMute(), initial);
});

test('unlock and play are no-op safe in Node', async () => {
  await assert.doesNotReject(() => SoundFx.unlock());
  assert.doesNotThrow(() => SoundFx.play('boing'));
  assert.doesNotThrow(() => SoundFx.play('pling'));
  assert.doesNotThrow(() => SoundFx.play('fanfare'));
  assert.doesNotThrow(() => SoundFx.play('missing'));
});
