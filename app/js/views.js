// views.js — the checklist rows and the guide pane. A row shows the medal swatch, the
// official name and description, the grade, the kind tags, a MISSABLE flag where the
// data carries one, and counter progress where the official description states a count.
// The pane beside it shows the full guide in our own words with its sources cited.

import { displayDescription, displayName, isMasked } from './filters.js';
import { stageOf } from './stages.js';

export function esc(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function kindLabel(kind) {
  return { story: 'Story', collectibles: 'Collectibles', activities: 'Activities', online: 'Online', misc: 'Feat / moment' }[kind] ?? kind;
}

export function renderRow(trophy, ctx) {
  const earned = ctx.isEarned(ctx.state, trophy);
  const masked = isMasked(trophy, ctx.state, ctx.isEarned);
  const li = document.createElement('li');
  li.className = `trophy-row${earned ? ' earned' : ''}${ctx.selected === trophy.name ? ' selected' : ''}`;
  li.dataset.name = trophy.name;

  const tags = [
    `<span class="tag grade">${esc(trophy.grade)}</span>`,
    ...trophy.kinds.map((k) => `<span class="tag">${esc(kindLabel(k))}</span>`),
    `<span class="tag">Roadmap stage ${trophy.stage}</span>`,
    trophy.missable ? '<span class="tag missable">MISSABLE</span>' : '',
  ].join('');

  const progress = trophy.target != null
    ? `${ctx.state.counts[trophy.name] ?? 0} / ${trophy.target}<br>${esc(trophy.targetLabel)}`
    : earned ? 'Earned' : '';

  li.innerHTML = `
    <input type="checkbox" ${earned ? 'checked' : ''} aria-label="Mark ${esc(trophy.name)} earned">
    <span class="medal ${esc(trophy.grade)}" title="${esc(trophy.grade)}"></span>
    <span>
      <span class="row-name">${masked ? '<span class="spoiler-mask">Hidden story trophy</span>' : esc(displayName(trophy, ctx.state, ctx.isEarned))}</span>
      <span class="row-desc" style="display:block">${esc(displayDescription(trophy, ctx.state, ctx.isEarned))}</span>
      <span class="row-tags">${tags}</span>
    </span>
    <span class="row-progress">${progress}</span>`;

  li.querySelector('input').addEventListener('click', (ev) => ev.stopPropagation());
  li.querySelector('input').addEventListener('change', (ev) => ctx.onToggle(trophy, ev.target.checked));
  li.addEventListener('click', () => ctx.onSelect(trophy));
  return li;
}

export function renderDetail(pane, trophy, ctx) {
  if (!trophy) {
    pane.innerHTML = '<p class="detail-empty">Pick a trophy on the left and its guide opens here — what to do, where the official description points, whether it can be missed, and the sources every fact came from.</p>';
    return;
  }
  const earned = ctx.isEarned(ctx.state, trophy);
  const masked = isMasked(trophy, ctx.state, ctx.isEarned);
  const stage = stageOf(trophy.stage);
  const count = ctx.state.counts[trophy.name] ?? 0;

  const counter = trophy.target != null ? `
    <h3>Progress counter</h3>
    <div class="counter">
      <button data-step="-1" aria-label="One less">−</button>
      <span class="count">${count}</span>
      <span class="target">/ ${trophy.target} ${esc(trophy.targetLabel)}</span>
      <button data-step="1" aria-label="One more">+</button>
      <button data-step="10" aria-label="Ten more">+10</button>
    </div>
    <p>The target is the count stated in the official description. Reaching it ticks the trophy earned.</p>` : '';

  pane.innerHTML = `
    <span class="medal ${esc(trophy.grade)}"></span>
    <h2>${masked ? 'Story trophy — spoiler shield on' : esc(trophy.name)}</h2>
    <p class="official">“${esc(displayDescription(trophy, ctx.state, ctx.isEarned))}” — official description · ${esc(trophy.grade)} · roadmap stage ${trophy.stage}</p>
    ${masked ? '<p>The spoiler shield is hiding this story trophy’s name, description and guide until you earn it. Turn the shield off in the toolbar if you would rather see everything.</p>' : `
    <label class="earn-line"><input type="checkbox" id="detail-earned" ${earned ? 'checked' : ''}> Earned</label>
    ${counter}
    <h3>Guide</h3>
    <p>${esc(trophy.guide)}</p>
    <p class="sources">Sources: ${esc(trophy.sources)}</p>
    <h3>Can it be missed?</h3>
    <div class="${trophy.missable ? 'missable-note' : 'safe-note'}">${esc(trophy.missableNote)}</div>
    <h3>Roadmap</h3>
    <p>${esc(stage.title)} — ${esc(stage.sub)}</p>
    <h3>Your note</h3>
    <textarea id="detail-note" placeholder="Locations found, sets finished, gangs robbed…">${esc(ctx.state.notes[trophy.name] ?? '')}</textarea>`}`;

  if (masked) return;
  pane.querySelector('#detail-earned').addEventListener('change', (ev) => ctx.onToggle(trophy, ev.target.checked));
  pane.querySelectorAll('.counter button').forEach((btn) => {
    btn.addEventListener('click', () => ctx.onCount(trophy, count + Number(btn.dataset.step)));
  });
  pane.querySelector('#detail-note').addEventListener('change', (ev) => ctx.onNote(trophy, ev.target.value));
}
