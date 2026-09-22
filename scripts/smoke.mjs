#!/usr/bin/env node
/**
 * Smoke-check key routes return HTTP 200.
 * Usage: with `npm run start` already running on PORT (default 3000):
 *   npm run smoke
 * Or: node scripts/smoke.mjs [baseUrl]
 */
const base = process.argv[2] || `http://127.0.0.1:${process.env.PORT || 3000}`;

const routes = [
  "/",
  "/path/",
  "/modules/m0/",
  "/lessons/m0.l1/",
  "/lessons/m3.l5/",
  "/lessons/m9.l7/",
  "/practice/",
  "/practice/metronome/",
  "/practice/beat-pad/",
  "/practice/eq-demo/",
  "/practice/crossfader/",
  "/practice/ear-drums/",
  "/practice/ear-feel/",
  "/practice/mixer/",
  "/practice/decks/",
  "/glossary/",
  "/gear/",
  "/software/",
  "/resources/",
  "/about/",
];

let failed = 0;
for (const path of routes) {
  const url = base + path;
  try {
    const res = await fetch(url, { redirect: "follow" });
    const ok = res.status === 200;
    console.log(`${ok ? "OK" : "FAIL"} ${res.status} ${path}`);
    if (!ok) failed++;
  } catch (e) {
    console.log(`FAIL ERR ${path} — ${e.message}`);
    failed++;
  }
}

if (failed) {
  console.error(`\n${failed} route(s) failed against ${base}`);
  process.exit(1);
}
console.log(`\nAll ${routes.length} routes OK at ${base}`);
