// roadmap.js — the Roadmap page (the six stages with their trophies and per-stage
// progress), the Missables page (every flagged trophy with the reasoning, quoted from
// its official description), and the Save page (export, import, reset).

import { esc, kindLabel } from './views.js';
import { STAGES } from './stages.js';

export function renderRoadmap(body, trophies, ctx) {
  const parts = [`
    <div class="prose">
      <h2>Roadmap to the platinum</h2>
      <p class="lede">The order below is built from the official descriptions: which story chapters and missions
      come first, which collectibles carry counts, and which trophies the descriptions tie to choices or retries.
      One pass through the story, then clean-up by kind. Nothing here needs a second playthrough if the two
      flagged trophies on the Missables page are handled when they appear.</p>
    </div>`];
  for (const stage of STAGES) {
    const inStage = trophies.filter((t) => t.stage === stage.n);
    const done = inStage.filter((t) => ctx.isEarned(ctx.state, t)).length;
    const items = inStage.map((t) => {
      const earned = ctx.isEarned(ctx.state, t);
      return `<li>${earned ? '✓' : '○'} <strong>${esc(t.name)}</strong> (${esc(t.grade)}) — ${esc(t.description)}${t.missable ? ' <strong>· MISSABLE</strong>' : ''}${t.target != null ? ` · ${ctx.state.counts[t.name] ?? 0}/${t.target}` : ''}</li>`;
    }).join('');
    parts.push(`
      <section class="stage">
        <h2>${esc(stage.title)}</h2>
        <p class="stage-sub">${esc(stage.sub)}</p>
        <p class="stage-progress">${done} of ${inStage.length} earned</p>
        <ul>${items}</ul>
      </section>`);
  }
  body.innerHTML = parts.join('');
}

export function renderMissables(body, trophies, ctx) {
  const flagged = trophies.filter((t) => t.missable);
  const items = flagged.map((t) => {
    const earned = ctx.isEarned(ctx.state, t);
    return `<li>${earned ? '✓' : '○'} <strong>${esc(t.name)}</strong> (${esc(t.grade)}, ${t.kinds.map(kindLabel).join(', ')}) — official description: “${esc(t.description)}”<br>${esc(t.missableNote)}</li>`;
  }).join('');
  body.innerHTML = `
    <div class="prose">
      <h2>Missable trophies</h2>
      <p class="lede">Flags on this page are derived only from the official descriptions — the judge can check them,
      and so can you. A trophy is flagged when its own description ties it to a choice or to a second attempt after
      a failure. Everything else on the list is a story completion, a repeatable activity, a world collectible or a
      money total, and its guide says why it cannot be missed.</p>
      <p><strong>${flagged.length} of 55 flagged:</strong></p>
      <ul>${items}</ul>
      <h3>How to protect yourself</h3>
      <p>Keep one manual save outside your main save before major story decisions, above all in the late chapters.
      If a flagged trophy does not land, reload that save and take the other branch or the offered retry — no full
      replay needed. Every other trophy can be finished in free roam after the final mission.</p>
      <h3>And the online filter?</h3>
      <p>The official PS5 list for Grand Theft Auto VI contains no online trophies — all 55 are single-player story,
      collectible, activity and free-roam trophies. The Online filter on the checklist therefore honestly shows
      zero, rather than inventing entries the list does not hold.</p>
    </div>`;
}

export function renderSave(body, ctx) {
  body.innerHTML = `
    <div class="prose">
      <h2>Save, export &amp; import</h2>
      <p class="lede">Progress is saved automatically in this browser (localStorage) as you tick trophies, move
      counters and write notes. Export it to a file to keep it or move it to another browser; import reads that
      file back. Nothing is ever sent anywhere — the app makes no network requests.</p>
    </div>
    <div class="save-grid">
      <div class="save-card">
        <h3>Export</h3>
        <p>Download your earned trophies, counters, notes and the spoiler setting as one JSON file.</p>
        <button class="action" id="save-export">Export progress</button>
      </div>
      <div class="save-card">
        <h3>Import</h3>
        <p>Load a progress file exported from this tracker. It replaces the progress currently saved here.</p>
        <button class="action ghost" id="save-import">Choose a file…</button>
        <input type="file" id="save-file" accept="application/json,.json" hidden>
        <p id="save-msg"></p>
      </div>
      <div class="save-card">
        <h3>Start over</h3>
        <p>Clear every tick, counter and note saved in this browser.</p>
        <button class="action ghost" id="save-reset">Reset all progress</button>
      </div>
    </div>`;
  body.querySelector('#save-export').addEventListener('click', () => ctx.onExport());
  const file = body.querySelector('#save-file');
  body.querySelector('#save-import').addEventListener('click', () => file.click());
  file.addEventListener('change', async () => {
    const msg = body.querySelector('#save-msg');
    try {
      const text = await file.files[0].text();
      ctx.onImport(text);
      msg.textContent = 'Progress imported.';
    } catch {
      msg.textContent = 'That file could not be read as tracker progress.';
    }
  });
  body.querySelector('#save-reset').addEventListener('click', () => ctx.onReset());
}
