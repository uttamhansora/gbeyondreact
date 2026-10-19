import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = 'C:\\Users\\parth\\Documents\\old code';
const outDir = path.resolve(__dirname, '../src/pages/content');

const pages = [
  { name: 'index', file: 'index.html', route: '/' },
  { name: 'blog', file: 'blog.html', route: '/blog' },
  { name: 'company', file: 'company.html', route: '/company' },
  { name: 'contact-us', file: 'contact-us.html', route: '/contact-us' },
  { name: 'microsoft-assessments', file: 'microsoft-assessments.html', route: '/microsoft-assessments' },
  { name: 'managed-detection-and-response', file: 'managed-detection-and-response.html', route: '/managed-detection-and-response' },
];

function extractRootContent(html) {
  const marker = '<div id="root">';
  const start = html.indexOf(marker);
  if (start === -1) return '';

  let pos = start + marker.length;
  let depth = 1;

  while (depth > 0 && pos < html.length) {
    const nextOpen = html.indexOf('<div', pos);
    const nextClose = html.indexOf('</div>', pos);
    if (nextClose === -1) break;

    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth += 1;
      pos = nextOpen + 4;
    } else {
      depth -= 1;
      if (depth === 0) {
        return html.slice(start + marker.length, nextClose).trim();
      }
      pos = nextClose + 6;
    }
  }

  return '';
}

function extractBodyClass(html) {
  const match = html.match(/<body[^>]*\sclass="([^"]*)"/i);
  return match ? match[1] : '';
}

function extractTitle(html) {
  const match = html.match(/<title>([^<]*)<\/title>/i);
  return match ? match[1].trim() : '';
}

function extractMetaDescription(html) {
  const match = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  return match ? match[1] : '';
}

function extractLdJson(html) {
  const match = html.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  return match ? match[1].trim() : '';
}

function normalizeHtml(source) {
  let html = source;
  html = html.replace(/\s+v-cloak\b/gi, '');
  html = html.replace(/\s+v-slot(?::[^=\s]+)?(?:=(?:"[^"]*"|'[^']*'))?/gi, '');
  html = html.replace(/\s+@click(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/gi, '');
  html = html.replace(/\s+@mouseover(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/gi, '');
  html = html.replace(/\s+@mouseleave(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/gi, '');
  return html;
}

fs.mkdirSync(outDir, { recursive: true });

const manifest = [];

for (const page of pages) {
  const html = fs.readFileSync(path.join(sourceDir, page.file), 'utf8');
  const content = normalizeHtml(extractRootContent(html));

  fs.writeFileSync(path.join(outDir, `${page.name}.html`), content, 'utf8');

  manifest.push({
    name: page.name,
    route: page.route,
    bodyClass: extractBodyClass(html),
    title: extractTitle(html),
    description: extractMetaDescription(html),
    ldJson: extractLdJson(html),
  });

  console.log(`Extracted ${page.file} -> ${page.name}.html (${content.length} chars)`);
}

fs.writeFileSync(
  path.join(outDir, 'manifest.json'),
  JSON.stringify(manifest, null, 2),
  'utf8'
);

console.log('Done.');
