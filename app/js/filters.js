// filters.js — the kind filters the bounty asks for (story, missable, collectibles,
// activities, online), the grade and earned-state filters, search, and the spoiler rule.
// The official PS5 list contains no online trophies: the online filter is present and
// honestly reports zero rather than pretending otherwise.

export const KIND_FILTERS = [
  { id: 'all', label: 'All 55' },
  { id: 'story', label: 'Story' },
  { id: 'missable', label: 'Missable' },
  { id: 'collectibles', label: 'Collectibles' },
  { id: 'activities', label: 'Activities' },
  { id: 'online', label: 'Online' },
  { id: 'misc', label: 'Feats & moments' },
];

export function matchesKind(trophy, kind) {
  if (kind === 'all') return true;
  if (kind === 'missable') return trophy.missable === true;
  return trophy.kinds.includes(kind);
}

export function kindCount(trophies, kind) {
  return trophies.filter((t) => matchesKind(t, kind)).length;
}

export function applyFilters(trophies, ui, state, isEarnedFn) {
  const query = ui.query.trim().toLowerCase();
  return trophies.filter((t) => {
    if (!matchesKind(t, ui.kind)) return false;
    if (ui.grade !== 'all' && t.grade !== ui.grade) return false;
    if (ui.state === 'earned' && !isEarnedFn(state, t)) return false;
    if (ui.state === 'unearned' && isEarnedFn(state, t)) return false;
    if (query) {
      const haystack = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

// The spoiler shield: with it on, an unearned story trophy shows neither its name nor
// its description (nor its guide) until it is earned. Other kinds are never masked —
// the setting exists for the story, as the bounty specifies.
export function isMasked(trophy, state, isEarnedFn) {
  return Boolean(state.spoiler) && trophy.kinds.includes('story') && !isEarnedFn(state, trophy);
}

export function displayName(trophy, state, isEarnedFn) {
  return isMasked(trophy, state, isEarnedFn) ? 'Story trophy — hidden by the spoiler shield' : trophy.name;
}

export function displayDescription(trophy, state, isEarnedFn) {
  return isMasked(trophy, state, isEarnedFn)
    ? 'Name and description hidden until you earn this story trophy.'
    : trophy.description;
}
