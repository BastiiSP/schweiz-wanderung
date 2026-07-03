const assert = require('node:assert/strict');
const test = require('node:test');

const Content = require('../js/content');

test('content exposes exact fixed texts and image path', () => {
  assert.equal(Content.recipientName, 'Melli');
  assert.equal(Content.senderName, 'Basti');
  assert.equal(
    Content.introText,
    'Bevor die echte Wanderung losgeht, wartet hier noch ein kleines Abenteuer auf dich, Melli.'
  );
  assert.equal(Content.finalQuestion, 'Willst du meine Freundin sein?');
  assert.equal(Content.securityQuestion, 'Bist du dir sicher?');
  assert.equal(
    Content.dodgeHint,
    'Hm, diese Buttons sind flüchtiger als ein Flussgeist. Vielleicht ein Zeichen. 😌'
  );
  assert.equal(
    Content.summitText,
    'Sie hat Ja gesagt! 🎉\nMelli & Basti – ab jetzt offiziell.\nDas war der Aufstieg. Alles ab hier ist Aussicht.'
  );
  assert.equal(
    Content.certificateText,
    'Hiermit wird feierlich beurkundet: Melli und Basti sind ab dem heutigen Tage offiziell ein Paar. Besiegelt unter den Augen eines Flussdrachen, der bekanntlich nie einen Weg vergisst. Möge das gemeinsame Abenteuer lang, magisch und voller guter Aussichten sein.'
  );
  assert.equal(Content.certificateImagePath, 'assets/images/certificate-bg.png');
});

test('content contains the four stages in order', () => {
  assert.deepEqual(Content.stages, [
    'Jede gute Geschichte beginnt mit einem Aufbruch. Diese hier zum Beispiel: mit dir, unterwegs in die Berge.',
    'In den besten Filmen führt der Weg immer irgendwohin, wo man vorher noch nie war. Fühlt sich gerade ziemlich ähnlich an.',
    'Man sagt, Flussgeister kennen den Weg, lange bevor man ihn selbst sieht. Dieser hier führt dich gerade zu einer Frage.',
    'Okay, genug aufgewärmt. Du bist fast am Gipfel dieser App – bereit für die eigentliche Frage?'
  ]);
});

test('content contains quiz question and four options with reactions', () => {
  assert.equal(
    Content.quiz.question,
    'Kurzer Zwischenstopp: Welches magische Wesen passt am besten zu diesem Moment?'
  );
  assert.deepEqual(Content.quiz.options, [
    {
      label: 'Haku, der Flussdrache',
      reaction: 'Gute Wahl. Einer, der dir den richtigen Weg zeigt – passt verdächtig gut zu heute.'
    },
    {
      label: 'Totoro',
      reaction: 'Groß, flauschig, immer da, wenn man ihn braucht. Sehr solide Antwort.'
    },
    {
      label: 'Shenlong',
      reaction: 'Ein Drache, der Wünsche erfüllt? Merk dir den Gedanken für gleich.'
    },
    {
      label: 'Ein Kohlenmännchen',
      reaction: 'Klein, chaotisch, unfassbar charmant. Kommt mir irgendwie bekannt vor.'
    }
  ]);
});
