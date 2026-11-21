// Leonida Ledger — entry program for gta6-trophy-guide-01 (Node 22, standard library only).
//
// The guide itself is the static web app in app/: index.html plus its ES modules, one
// stylesheet and data/trophies.json, the official list of 55 GTA VI PS5 trophies, each
// with a guide in our own words and its sources. It runs offline in a browser and loads
// nothing over the network. This program hands the entry in: it copies app/ and
// screenshots/ into the output directory and writes dossier.json there with the kit's
// vendored buildDossier, byte for byte the file the scorer rebuilds and compares.
//
// Run it locally the same way the grader does, with MAKEFUN_OUTPUT_DIR standing in
// for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoDir = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoDir, 'app'), join(outputDir, 'app'), { recursive: true });

const screenshotsDir = join(outputDir, 'screenshots');
mkdirSync(screenshotsDir, { recursive: true });
if (existsSync(join(repoDir, 'screenshots'))) {
  cpSync(join(repoDir, 'screenshots'), screenshotsDir, { recursive: true });
}

// The caps are the gate's own (see the kit's RULES.txt, "The gate"): at most 4
// screenshots of at most 256 KiB, app/ within 993 entries and 48 MiB, and the
// dossier's text capped at 160 KiB. buildDossier refuses anything past them.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
