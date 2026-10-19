import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const distDir = path.join(root, 'dist');

const requiredPublicFolders = ['dist', 'fonts', 'assets', 'media', 'videos', 'cdn-cgi'];

function copyFolder(name) {
  const source = path.join(publicDir, name);
  const target = path.join(distDir, name);

  if (!fs.existsSync(source)) {
    throw new Error(`Missing required folder: public/${name}`);
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(source, target, { recursive: true, force: true });
  console.log(`Copied public/${name} -> dist/${name}`);
}

if (!fs.existsSync(publicDir)) {
  console.error('ERROR: public/ folder is missing.');
  console.error('Copy assets from your old site into public/ before building.');
  process.exit(1);
}

for (const folder of requiredPublicFolders) {
  copyFolder(folder);
}

console.log('Site asset copy complete.');
