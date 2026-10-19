import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const assetsDir = path.join(distDir, 'assets');

const required = [
  'dist/main.83af39c6.css',
  'dist/main.d82f623b.js',
  'fonts/TWKEverett-Regular-web.woff2',
  'index.html',
];

const missing = required.filter((file) => !fs.existsSync(path.join(distDir, file)));

const reactBundle = fs.existsSync(assetsDir)
  ? fs.readdirSync(assetsDir).find((file) => file.startsWith('index-') && file.endsWith('.js'))
  : null;

if (!reactBundle) {
  missing.push('assets/index-*.js');
}

if (missing.length) {
  console.error('Cannot prepare Netlify deploy. Missing in dist/:');
  missing.forEach((file) => console.error(`  - ${file}`));
  process.exit(1);
}

const fileCount = fs
  .readdirSync(distDir, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile()).length;

console.log('');
console.log('Netlify deploy is ready.');
console.log(`dist/ contains ${fileCount} files.`);
console.log('');
console.log('Upload ONLY the contents of the dist/ folder to Netlify.');
console.log('Do NOT upload the project root or src/ folder.');
console.log('');
console.log('Option 1 - Netlify drag & drop:');
console.log('  1. Open dist/ in File Explorer');
console.log('  2. Select ALL files and folders inside dist/');
console.log('  3. Drag them into Netlify Deploys -> Deploy manually');
console.log('');
console.log('Option 2 - Netlify CLI:');
console.log('  npx netlify-cli deploy --prod --dir=dist');
console.log('');
