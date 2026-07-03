(function (global) {
  'use strict';

  var api = {
    recipientName: 'Melli',
    senderName: 'Basti',
    introText: 'Bevor die echte Wanderung losgeht, wartet hier noch ein kleines Abenteuer auf dich, Melli.',
    stages: [
      'Jede gute Geschichte beginnt mit einem Aufbruch. Diese hier zum Beispiel: mit dir, unterwegs in die Berge.',
      'In den besten Filmen führt der Weg immer irgendwohin, wo man vorher noch nie war. Fühlt sich gerade ziemlich ähnlich an.',
      'Man sagt, Flussgeister kennen den Weg, lange bevor man ihn selbst sieht. Dieser hier führt dich gerade zu einer Frage.',
      'Okay, genug aufgewärmt. Du bist fast am Gipfel dieser App – bereit für die eigentliche Frage?'
    ],
    quiz: {
      question: 'Kurzer Zwischenstopp: Welches magische Wesen passt am besten zu diesem Moment?',
      options: [
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
      ]
    },
    finalQuestion: 'Willst du meine Freundin sein?',
    securityQuestion: 'Bist du dir sicher?',
    dodgeHint: 'Hm, diese Buttons sind flüchtiger als ein Flussgeist. Vielleicht ein Zeichen. 😌',
    summitText: 'Sie hat Ja gesagt! 🎉\nMelli & Basti – ab jetzt offiziell.\nDas war der Aufstieg. Alles ab hier ist Aussicht.',
    certificateText: 'Hiermit wird feierlich beurkundet: Melli und Basti sind ab dem heutigen Tage offiziell ein Paar. Besiegelt unter den Augen eines Flussdrachen, der bekanntlich nie einen Weg vergisst. Möge das gemeinsame Abenteuer lang, magisch und voller guter Aussichten sein.',
    certificateImagePath: 'assets/images/certificate-bg.png'
  };

  if (typeof module !== 'undefined' && module.exports) { module.exports = api; } else { global.Content = api; }
})(typeof window !== 'undefined' ? window : globalThis);
