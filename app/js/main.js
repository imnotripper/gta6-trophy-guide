// main.js — boot: load the official list from data/trophies.json (a file of this app,
// fetched from the same static server, never the network), wire the toolbar, the four
// views and hash routing, and keep the scoreboard honest.

import { applyFilters, KIND_FILTERS, kindCount } from './filters.js';
import { renderDetail, renderRow } from './views.js';
import { renderMissables, renderRoadmap, renderSave } from './roadmap.js';
import { exportState, isEarned, loadState, parseImport, saveState, setCount, setEarned, setNote } from './store.js';

const state = loadState();
let trophies = [];
let selected = null;
const ui = { kind: 'all', grade: 'all', state: 'all', query: '' };

const els = {
  list: document.querySelector('#trophy-list'),
  detail: document.querySelector('#detail'),
  earnedCount: document.querySelector('#earned-count'),
  barFill: document.querySelector('#bar-fill'),
  gradeTally: document.querySelector('#grade-tally'),
  platinumLine: document.querySelector('#platinum-line'),
  chips: document.querySelector('#kind-chips'),
  search: document.querySelector('#search'),
  gradeFilter: document.querySelector('#grade-filter'),
  stateFilter: document.querySelector('#state-filter'),
  spoiler: document.querySelector('#spoiler-toggle'),
  resultLine: document.querySelector('#result-line'),
  roadmap: document.querySelector('#roadmap-body'),
  missables: document.querySelector('#missables-body'),
  save: document.querySelector('#save-body'),
};

const ctx = {
  state,
  isEarned,
  get selected() { return selected; },
  onSelect(trophy) { selected = trophy.name; refresh(); },
  onToggle(trophy, on) { setEarned(state, trophy, on); refresh(); },
  onCount(trophy, value) { setCount(state, trophy, value); refresh(); },
  onNote(trophy, text) { setNote(state, trophy, text); },
  onExport() { exportState(state); },
  onImport(text) {
    const fresh = parseImport(text);
    Object.assign(state, fresh);
    saveState(state);
    refresh();
  },
  onReset() {
    Object.assign(state, { earned: {}, counts: {}, notes: {}, spoiler: false });
    saveState(state);
    refresh();
  },
};

function currentView() {
  const hash = location.hash.replace('#/', '');
  return ['roadmap', 'missables', 'save'].includes(hash) ? hash : 'checklist';
}

function renderScoreboard() {
  const earned = trophies.filter((t) => isEarned(state, t));
  els.earnedCount.textContent = String(earned.length);
  els.barFill.style.width = `${(earned.length / trophies.length) * 100}%`;
  const tally = ['platinum', 'gold', 'silver', 'bronze'].map((grade) => {
    const all = trophies.filter((t) => t.grade === grade);
    const got = all.filter((t) => isEarned(state, t)).length;
    return `${grade} ${got}/${all.length}`;
  });
  els.gradeTally.textContent = tally.join(' · ');
  const platinum = trophies.find((t) => t.grade === 'platinum');
  els.platinumLine.textContent = isEarned(state, platinum)
    ? 'Platinum earned — you are a Leonida Legend.'
    : `${trophies.length - earned.length} trophies stand between you and the platinum.`;
}

function renderChips() {
  els.chips.innerHTML = '';
  for (const filter of KIND_FILTERS) {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.setAttribute('aria-pressed', String(ui.kind === filter.id));
    btn.innerHTML = `${filter.label} <span class="n">${kindCount(trophies, filter.id)}</span>`;
    btn.addEventListener('click', () => { ui.kind = filter.id; refresh(); });
    els.chips.appendChild(btn);
  }
}

function renderChecklist() {
  const shown = applyFilters(trophies, ui, state, isEarned);
  els.list.innerHTML = '';
  for (const trophy of shown) els.list.appendChild(renderRow(trophy, ctx));
  els.resultLine.textContent = shown.length === trophies.length
    ? 'Showing all 55 trophies.'
    : `Showing ${shown.length} of 55 trophies.`;
  if (ui.kind === 'online' && shown.length === 0) {
    els.resultLine.textContent = 'The official PS5 list holds no online trophies — this filter honestly shows none.';
  }
  const current = shown.find((t) => t.name === selected) ?? shown[0] ?? trophies.find((t) => t.name === selected) ?? null;
  if (current && selected !== current.name) selected = current.name;
  renderDetail(els.detail, current, ctx);
}

function refresh() {
  renderScoreboard();
  renderChips();
  const view = currentView();
  document.querySelectorAll('.view').forEach((v) => { v.hidden = v.id !== `view-${view}`; });
  document.querySelectorAll('.tabs a').forEach((a) => a.classList.toggle('active', a.dataset.tab === view));
  if (view === 'checklist') renderChecklist();
  if (view === 'roadmap') renderRoadmap(els.roadmap, trophies, ctx);
  if (view === 'missables') renderMissables(els.missables, trophies, ctx);
  if (view === 'save') renderSave(els.save, ctx);
  els.spoiler.checked = Boolean(state.spoiler);
}

els.search.addEventListener('input', () => { ui.query = els.search.value; renderChecklist(); });
els.gradeFilter.addEventListener('change', () => { ui.grade = els.gradeFilter.value; renderChecklist(); });
els.stateFilter.addEventListener('change', () => { ui.state = els.stateFilter.value; renderChecklist(); });
els.spoiler.addEventListener('change', () => { state.spoiler = els.spoiler.checked; saveState(state); refresh(); });
window.addEventListener('hashchange', refresh);

async function boot() {
  const response = await fetch('data/trophies.json');
  const data = await response.json();
  trophies = data.trophies;
  selected = trophies[0]?.name ?? null;
  refresh();
}

boot();
