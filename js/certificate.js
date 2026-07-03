(function (global) {
  'use strict';

  var MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

  function buildCertificateData(content, date) {
    var displayDate = date || new Date();
    return {
      title: 'Urkunde',
      bodyText: content.certificateText,
      names: 'Melli & Basti',
      dateText: displayDate.getDate() + '. ' + MONTHS[displayDate.getMonth()] + ' ' + displayDate.getFullYear()
    };
  }

  function loadBackgroundImage(path) {
    return new Promise(function (resolve) {
      if (typeof global.Image === 'undefined') {
        resolve(null);
        return;
      }

      var image = new global.Image();
      image.onload = function () {
        resolve(image);
      };
      image.onerror = function () {
        resolve(null);
      };
      image.src = path;
    });
  }

  function drawCoverImage(ctx, image, width, height) {
    var sourceRatio = image.width / image.height;
    var targetRatio = width / height;
    var sourceWidth = image.width;
    var sourceHeight = image.height;
    var sourceX = 0;
    var sourceY = 0;

    if (sourceRatio > targetRatio) {
      sourceWidth = image.height * targetRatio;
      sourceX = (image.width - sourceWidth) / 2;
    } else {
      sourceHeight = image.width / targetRatio;
      sourceY = (image.height - sourceHeight) / 2;
    }

    ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
  }

  function drawRoundedRectPath(ctx, x, y, width, height, radius) {
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x, y, width, height, radius);
      return;
    }

    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  }

  function drawFallbackBackground(ctx, width, height) {
    var gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#dbe3f4');
    gradient.addColorStop(0.45, '#e7dff2');
    gradient.addColorStop(1, '#f8ddc8');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    var veil = ctx.createLinearGradient(0, 0, 0, height);
    veil.addColorStop(0, 'rgba(44, 62, 107, 0.10)');
    veil.addColorStop(0.5, 'rgba(124, 91, 166, 0.08)');
    veil.addColorStop(1, 'rgba(240, 168, 120, 0.12)');
    ctx.fillStyle = veil;
    ctx.fillRect(0, 0, width, height);
  }

  function wrapTextIntoLines(measureFn, text, maxWidth) {
    var words = String(text || '').split(/\s+/).filter(Boolean);
    var lines = [];
    var current = '';

    function pushLongWord(word) {
      var chunk = '';
      for (var i = 0; i < word.length; i += 1) {
        var next = chunk + word.charAt(i);
        if (chunk && measureFn(next) > maxWidth) {
          lines.push(chunk);
          chunk = word.charAt(i);
        } else {
          chunk = next;
        }
      }
      if (chunk) {
        current = chunk;
      }
    }

    words.forEach(function (word) {
      if (!current) {
        if (measureFn(word) > maxWidth) {
          pushLongWord(word);
        } else {
          current = word;
        }
        return;
      }

      var candidate = current + ' ' + word;
      if (measureFn(candidate) <= maxWidth) {
        current = candidate;
        return;
      }

      lines.push(current);
      current = '';
      if (measureFn(word) > maxWidth) {
        pushLongWord(word);
      } else {
        current = word;
      }
    });

    if (current) {
      lines.push(current);
    }

    return lines;
  }

  function drawCenteredLines(ctx, lines, centerX, startY, lineHeight) {
    lines.forEach(function (line, index) {
      ctx.fillText(line, centerX, startY + index * lineHeight);
    });
  }

  function drawCertificateToCanvas(canvas, data, backgroundImage) {
    // Hochformat: passt zum 1024x1536-Hintergrundbild und zum Handy-Display
    canvas.width = 1000;
    canvas.height = 1500;
    var ctx = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;

    if (backgroundImage) {
      drawCoverImage(ctx, backgroundImage, width, height);
      // Sanfter Schleier in der Textzone, damit die Schrift ruhig liegt
      var textVeil = ctx.createLinearGradient(0, 260, 0, 1380);
      textVeil.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
      textVeil.addColorStop(0.25, 'rgba(255, 255, 255, 0.17)');
      textVeil.addColorStop(0.75, 'rgba(255, 255, 255, 0.17)');
      textVeil.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
      ctx.fillStyle = textVeil;
      ctx.fillRect(90, 260, width - 180, 1120);
    } else {
      drawFallbackBackground(ctx, width, height);
    }

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.78)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    drawRoundedRectPath(ctx, 48, 48, width - 96, height - 96, 28);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(201, 161, 70, 0.72)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    drawRoundedRectPath(ctx, 74, 74, width - 148, height - 148, 22);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#4d3d5c';
    ctx.font = '86px Georgia, serif';
    ctx.fillText(data.title, width / 2, 400);

    // Kleine Zierlinie unter dem Titel
    ctx.strokeStyle = 'rgba(201, 161, 70, 0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 110, 462);
    ctx.lineTo(width / 2 + 110, 462);
    ctx.stroke();

    ctx.font = '38px Georgia, serif';
    ctx.fillStyle = '#51485d';
    var lines = wrapTextIntoLines(function (text) {
      return ctx.measureText(text).width;
    }, data.bodyText, 700);
    drawCenteredLines(ctx, lines, width / 2, 570, 56);

    ctx.font = '68px Georgia, serif';
    ctx.fillStyle = '#6a4f87';
    ctx.fillText(data.names, width / 2, 1190);

    ctx.font = '34px Georgia, serif';
    ctx.fillStyle = '#6d6473';
    ctx.fillText(data.dateText, width / 2, 1280);
    ctx.restore();
  }

  function downloadCanvasAsPng(canvas, filename) {
    if (!canvas || typeof document === 'undefined' || typeof canvas.toDataURL !== 'function') {
      return;
    }

    var link = document.createElement('a');
    link.download = filename || 'urkunde.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  var api = {
    buildCertificateData: buildCertificateData,
    loadBackgroundImage: loadBackgroundImage,
    drawCertificateToCanvas: drawCertificateToCanvas,
    wrapTextIntoLines: wrapTextIntoLines,
    downloadCanvasAsPng: downloadCanvasAsPng
  };

  if (typeof module !== 'undefined' && module.exports) { module.exports = api; } else { global.Certificate = api; }
})(typeof window !== 'undefined' ? window : globalThis);
