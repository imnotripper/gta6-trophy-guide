// store.js — progress lives in localStorage only: earned flags, counters toward the
// counts stated in the official descriptions, per-trophy notes, and the spoiler setting.
// Export downloads the whole state as one JSON file; import reads such a file back.

const STORAGE_KEY = 'leonida-ledger-v1';

export function emptyState() {
  return { earned: {}, counts: {}, notes: {}, spoiler: false };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    return {
      earned: parsed.earned ?? {},
      counts: parsed.counts ?? {},
      notes: parsed.notes ?? {},
      spoiler: Boolean(parsed.spoiler),
    };
  } catch {
    return emptyState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function isEarned(state, trophy) {
  if (state.earned[trophy.name]) return true;
  if (trophy.target != null && (state.counts[trophy.name] ?? 0) >= trophy.target) return true;
  return false;
}

export function setEarned(state, trophy, on) {
  if (on) state.earned[trophy.name] = true;
  else delete state.earned[trophy.name];
  saveState(state);
}

export function setCount(state, trophy, value) {
  const clamped = Math.max(0, trophy.target != null ? Math.min(value, trophy.target) : value);
  state.counts[trophy.name] = clamped;
  // Reaching the target stated in the official description earns the trophy;
  // dropping back below it un-earns it, so the checklist never disagrees with the counter.
  if (trophy.target != null) {
    if (clamped >= trophy.target) state.earned[trophy.name] = true;
    else delete state.earned[trophy.name];
  }
  saveState(state);
  return clamped;
}

export function setNote(state, trophy, text) {
  if (text.trim()) state.notes[trophy.name] = text;
  else delete state.notes[trophy.name];
  saveState(state);
}

export function exportState(state) {
  const payload = JSON.stringify({ app: 'leonida-ledger', version: 1, state }, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'leonida-ledger-progress.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function parseImport(text) {
  const parsed = JSON.parse(text);
  const state = parsed.state ?? parsed;
  if (typeof state !== 'object' || state === null) throw new Error('Not a progress file.');
  return {
    earned: state.earned ?? {},
    counts: state.counts ?? {},
    notes: state.notes ?? {},
    spoiler: Boolean(state.spoiler),
  };
}
