/**
 * Robust `vite build` launcher.
 *
 * Background: on Render the service build command uses `npm ci --prefix client`,
 * and npm has a long-standing quirk where `npm ci --prefix DIR` installs
 * dependencies into the CURRENT working directory's node_modules (the repo root)
 * instead of DIR/node_modules. This script resolves the vite CLI from either
 * client/node_modules (local dev / normal installs) or the repo root
 * node_modules (Render's hoisted-by-bug layout) and runs `vite build`
 * with this directory as cwd so the output still lands in client/dist.
 */
import { existsSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const clientDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const candidates = [
  path.join(clientDir, 'node_modules', 'vite', 'bin', 'vite.js'),
  path.join(clientDir, '..', 'node_modules', 'vite', 'bin', 'vite.js'),
];

const viteBin = candidates.find((p) => existsSync(p));

if (!viteBin) {
  console.error('[vite-build] Could not locate vite CLI. Searched:\n' + candidates.join('\n'));
  process.exit(1);
}

console.log(`[vite-build] Using vite at: ${viteBin}`);

const result = spawnSync(process.execPath, [viteBin, 'build'], {
  cwd: clientDir,
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
