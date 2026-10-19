import fs from 'fs';
import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { normalizeSiteBaseUrl, replaceCanonicalSiteUrls } from './src/utils/siteUrl.js';

const PUBLIC_JSON_WITH_SITE_URLS = ['blogs.json', 'resources.json', 'blogTopics.json'];

function copySiteAssets(siteBaseUrl) {
  const folders = ['dist', 'fonts', 'assets', 'media', 'cdn-cgi'];

  return {
    name: 'copy-site-assets',
    closeBundle() {
      const publicDir = path.resolve('public');
      const outDir = path.resolve('dist');

      for (const folder of folders) {
        const source = path.join(publicDir, folder);
        const target = path.join(outDir, folder);

        if (!fs.existsSync(source)) {
          throw new Error(`Missing required folder: public/${folder}`);
        }

        fs.cpSync(source, target, { recursive: true, force: true });
      }

      for (const fileName of PUBLIC_JSON_WITH_SITE_URLS) {
        const sourceFile = path.join(publicDir, fileName);
        const targetFile = path.join(outDir, fileName);

        if (!fs.existsSync(sourceFile)) {
          continue;
        }

        const raw = fs.readFileSync(sourceFile, 'utf8');
        fs.writeFileSync(targetFile, replaceCanonicalSiteUrls(raw, siteBaseUrl), 'utf8');
      }
    },
  };
}

function rewritePublicJsonMiddleware(siteBaseUrl) {
  const publicDir = path.resolve('public');

  return (req, res, next) => {
    const urlPath = req.url?.split('?')[0] ?? '';
    const fileName = path.basename(urlPath);

    if (!PUBLIC_JSON_WITH_SITE_URLS.includes(fileName)) {
      next();
      return;
    }

    const sourceFile = path.join(publicDir, fileName);
    if (!fs.existsSync(sourceFile)) {
      next();
      return;
    }

    const body = replaceCanonicalSiteUrls(fs.readFileSync(sourceFile, 'utf8'), siteBaseUrl);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(body);
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteBaseUrl = normalizeSiteBaseUrl(env.VITE_SITE_BASE_URL);

  return {
  plugins: [
    react(),
    copySiteAssets(siteBaseUrl),
    {
      name: 'rewrite-public-json-dev',
      configureServer(server) {
        server.middlewares.use(rewritePublicJsonMiddleware(siteBaseUrl));
      },
    },
  ],
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
  };
});
