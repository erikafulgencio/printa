// Builds one site into dist/<site>:  node scripts/build.mjs shop   |   node scripts/build.mjs cms
// No dependencies: copies the shared files and the site's own files.
import { cpSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const site = process.argv[2];
if (!['shop', 'cms'].includes(site)) {
  console.error('Usage: node scripts/build.mjs <shop|cms>');
  process.exit(1);
}
const out = join(root, 'dist', site);
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(root, 'src', 'shared'), out, { recursive: true });
cpSync(join(root, 'src', site), out, { recursive: true });
if (!existsSync(join(out, 'index.html'))) { console.error('Missing index.html for ' + site); process.exit(1); }
console.log('Built ' + site + ' → dist/' + site);
