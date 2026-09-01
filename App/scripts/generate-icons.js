const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SOURCE = process.argv[2] || path.join(__dirname, '..', 'assets', 'images', 'logo.png');
const BG_COLOR = '#ECFCCB';
const SIZE = 1024;
const FOREGROUND_RATIO = 0.66;

const TARGETS = {
  icon: 'assets/icons/icon.png',
  foreground: 'assets/icons/android-icon-foreground.png',
  background: 'assets/icons/android-icon-background.png',
  monochrome: 'assets/icons/android-icon-monochrome.png',
  favicon: 'assets/icons/favicon.png',
  splash: 'assets/splash/splash-icon.png',
};

async function requireSource() {
  if (!fs.existsSync(SOURCE)) {
    console.error(
      `Logo introuvable : ${SOURCE}\nDépose ton logo dans assets/images/logo.png (format carré, 1024x1024 recommandé) puis relance la commande.`
    );
    process.exit(1);
  }
  const meta = await sharp(SOURCE).metadata();
  console.log(`Logo : ${SOURCE} (${meta.width}x${meta.height})`);
}

async function generate() {
  await requireSource();
  const root = path.join(__dirname, '..');

  const icon = await sharp(SOURCE).resize(SIZE, SIZE, { fit: 'cover' }).flatten({ background: BG_COLOR }).png().toBuffer();
  await sharp(icon).png().toFile(path.join(root, TARGETS.icon));

  const fgSize = Math.round(SIZE * FOREGROUND_RATIO);
  await sharp(SOURCE)
    .resize(fgSize, fgSize, { fit: 'cover' })
    .png()
    .toFile(path.join(root, TARGETS.foreground));

  await sharp({
    create: { width: SIZE, height: SIZE, channels: 4, background: BG_COLOR },
  })
    .png()
    .toFile(path.join(root, TARGETS.background));

  const { data, info } = await sharp(SOURCE)
    .resize(SIZE, SIZE, { fit: 'cover' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += info.channels) {
    const alpha = data[i + 3];
    out[i] = out[i + 1] = out[i + 2] = 255;
    out[i + 3] = alpha;
  }
  await sharp(out, { raw: { width: SIZE, height: SIZE, channels: 4 } }).png().toFile(path.join(root, TARGETS.monochrome));

  await sharp(SOURCE)
    .resize(48, 48, { fit: 'cover' })
    .flatten({ background: BG_COLOR })
    .png()
    .toFile(path.join(root, TARGETS.favicon));

  await sharp(SOURCE)
    .resize(SIZE, SIZE, { fit: 'contain' })
    .png()
    .toFile(path.join(root, TARGETS.splash));

  console.log('Icônes générées :');
  Object.entries(TARGETS).forEach(([name, file]) => console.log(`  - ${name} → ${file}`));
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});