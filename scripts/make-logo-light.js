// Genera la versione chiara del logo per sfondi scuri: nero -> avorio, giallo invariato
const sharp = require('sharp');
const path = require('path');

const SRC = path.join(__dirname, '..', 'public', 'images', 'Marchio_trasparente.png');
const OUT = path.join(__dirname, '..', 'public', 'images', 'logo-light.png');
const IVORY = [0xf3, 0xed, 0xe4];

(async () => {
  const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const isYellow = r > 180 && g > 140 && b < 120;
    if (isYellow) continue;
    // Quanto è "inchiostro": 0 = bianco/sfondo, 255 = nero pieno
    const ink = 255 - Math.round((r + g + b) / 3);
    data[i] = IVORY[0];
    data[i + 1] = IVORY[1];
    data[i + 2] = IVORY[2];
    data[i + 3] = Math.round((ink * data[i + 3]) / 255);
  }
  await sharp(data, { raw: info }).trim().png().toFile(OUT);
  console.log('ok', OUT);
})();
