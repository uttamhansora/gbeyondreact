import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const requiredFiles = [
  'dist/dist/main.83af39c6.css',
  'dist/dist/main.d82f623b.js',
  'dist/fonts/TWKEverett-Regular-web.woff2',
  'dist/assets/images/Whitenet_Wordmark_RGB_Cobalt.png',
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));

if (missing.length) {
  console.error('Build verification failed. Missing files:');
  missing.forEach((file) => console.error(`  - ${file}`));
  console.error('');
  console.error('Make sure the entire public/ folder is present before building:');
  console.error('  public/dist/, public/fonts/, public/assets/, public/media/');
  process.exit(1);
}

console.log('Build verification passed. Static assets are present.');
