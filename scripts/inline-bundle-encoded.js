#!/usr/bin/env node
/**
 * Inline the compiled JS and CSS bundles into the HTML template
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlPath = path.join(__dirname, '../assets/the-riddler.html');
const jsPath = path.join(__dirname, '../assets/the-riddler.js');
const cssPath = path.join(__dirname, '../assets/the-riddler.css');

console.log('[Inline Bundle] Reading files...');
const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
const jsContent = fs.readFileSync(jsPath, 'utf-8');
let cssContent = '';
if (fs.existsSync(cssPath)) {
  cssContent = fs.readFileSync(cssPath, 'utf-8');
  console.log(`[Inline Bundle] CSS bundle size: ${(cssContent.length / 1024).toFixed(2)} KB`);
}

console.log(`[Inline Bundle] JS bundle size: ${(jsContent.length / 1024).toFixed(2)} KB`);

// Base64 encode the JavaScript to avoid parser issues
const encodedJS = Buffer.from(jsContent, 'utf-8').toString('base64');
console.log(`[Inline Bundle] Encoded size: ${(encodedJS.length / 1024).toFixed(2)} KB`);

// Create a script that decodes and executes the bundle
const inlineScript = `
    <script type="module">
      // Decode and execute the base64-encoded React bundle
      const encodedScript = ${JSON.stringify(encodedJS)};
      const decodedScript = atob(encodedScript);
      const blob = new Blob([decodedScript], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      import(url)
        .catch(err => {
          console.error('[The Riddler] Failed to load:', err);
          const root = document.getElementById('the-riddler-root');
          if (root) {
            root.innerHTML = '<div style="padding:20px;text-align:center;font-family:sans-serif;color:#DC2626"><h3>Failed to load game</h3><p>Please refresh the page.</p></div>';
          }
        });
    </script>`;

// Replace the CSS
let updatedHtml = htmlContent;
if (cssContent) {
  updatedHtml = updatedHtml.replace(
    /<style>[\s\S]*?<\/style>/,
    `<style>\n${cssContent}\n</style>`
  );
}

// Replace the script tag
updatedHtml = updatedHtml.replace(
  /<script type="module">[\s\S]*?<\/script>\s*<\/body>/,
  inlineScript + '\n  </body>'
);

if (updatedHtml === htmlContent) {
  console.error('[Inline Bundle] ERROR: Script tag or style tag not found or not replaced!');
  process.exit(1);
}

fs.writeFileSync(htmlPath, updatedHtml, 'utf-8');
console.log('[Inline Bundle] Successfully inlined encoded bundle into HTML');
console.log(`[Inline Bundle] Output: ${htmlPath}`);

