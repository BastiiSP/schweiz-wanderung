const assert = require('node:assert/strict');
const test = require('node:test');

const Certificate = require('../js/certificate');

test('buildCertificateData creates display data with German date', () => {
  const data = Certificate.buildCertificateData({
    certificateText: 'Testurkunde'
  }, new Date(2026, 6, 3));

  assert.deepEqual(data, {
    title: 'Urkunde',
    bodyText: 'Testurkunde',
    names: 'Melli & Basti',
    dateText: '3. Juli 2026'
  });
});

test('wrapTextIntoLines wraps by measured width and preserves words', () => {
  const measureFn = (text) => text.length * 10;
  const lines = Certificate.wrapTextIntoLines(
    measureFn,
    'Hiermit wird feierlich beurkundet',
    120
  );

  assert.deepEqual(lines, ['Hiermit wird', 'feierlich', 'beurkundet']);
});

test('wrapTextIntoLines splits overlong words defensively', () => {
  const measureFn = (text) => text.length * 10;
  assert.deepEqual(Certificate.wrapTextIntoLines(measureFn, 'Donaudampfschiff', 50), [
    'Donau',
    'dampf',
    'schif',
    'f'
  ]);
});
