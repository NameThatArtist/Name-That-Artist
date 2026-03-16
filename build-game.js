/**
 * build-game.js
 * Updates the embedded ARTISTS_DATA in game.js from artists.json,
 * then regenerates name-that-artist-portable.html.
 *
 * Usage: node build-game.js
 */
const fs = require('fs');
const path = require('path');

const BASE = __dirname;

// 1. Load artists data
const artists = JSON.parse(fs.readFileSync(path.join(BASE, 'artists.json'), 'utf8')).artists;
const embedded = JSON.stringify(artists);

// 2. Update game.js — replace the ARTISTS_DATA line
let gameJs = fs.readFileSync(path.join(BASE, 'game.js'), 'utf8');
gameJs = gameJs.replace(
  /^const ARTISTS_DATA = \[.*?\];$/m,
  `const ARTISTS_DATA = ${embedded};`
);
fs.writeFileSync(path.join(BASE, 'game.js'), gameJs, 'utf8');
console.log('game.js updated with', artists.length, 'artists.');

// 3. Rebuild portable HTML
const indexHtml = fs.readFileSync(path.join(BASE, 'index.html'), 'utf8');
const stylesCss = fs.readFileSync(path.join(BASE, 'style.css'), 'utf8');

let portable = indexHtml
  // Replace <link rel="stylesheet" href="style.css"> with inline styles
  .replace(
    /<link\s+rel="stylesheet"\s+href="style\.css"\s*\/?>/,
    `<style>\n${stylesCss}\n</style>`
  )
  // Replace <script src="game.js"></script> with inline script
  .replace(
    /<script\s+src="game\.js"><\/script>/,
    `<script>\n${gameJs}\n</script>`
  );

fs.writeFileSync(path.join(BASE, 'name-that-artist-portable.html'), portable, 'utf8');
console.log('name-that-artist-portable.html rebuilt.');

// 4. Validate every artist has a type field
const missing = artists.filter(a => !a.type);
if (missing.length > 0) {
  console.error('WARNING: artists missing type field:', missing.map(a => a.name));
} else {
  const counts = { solo_male: 0, solo_female: 0, band: 0 };
  artists.forEach(a => counts[a.type] = (counts[a.type] || 0) + 1);
  console.log('Validation: all', artists.length, 'artists have type field.');
  console.log('  solo_male:', counts.solo_male);
  console.log('  solo_female:', counts.solo_female);
  console.log('  band:', counts.band);
}
