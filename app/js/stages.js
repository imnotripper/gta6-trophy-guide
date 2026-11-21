// stages.js — the platinum roadmap's six stages. The order is built from the official
// descriptions: story chapters and named missions first (they structure everything else),
// then the stranger strands the descriptions name, then the map-wide collectible counts,
// then the repeatable activities, then the free-roam feats and money, and finally the
// 100% completion gold and the platinum itself.

export const STAGES = [
  {
    n: 1,
    title: 'Stage 1 — The story, start to final mission',
    sub: 'Chapters 1–4, the named story missions (Gone Fishing, Breakfast Run, The Cartel Heist, Child’s Play, Headliners, VCIA Takedown, Operation Savage Glory) and the final mission. Keep a manual save before big choices: Actions Speak Louder is flagged missable from its own description.',
  },
  {
    n: 2,
    title: 'Stage 2 — Strangers & freaks',
    sub: 'Finish the stranger strands: the final missions for Andy, Kenton, Billy, Randy and Tyrone, plus three more strands, complete the silver Strangers & Freaks count of 8 strands across Leonida.',
  },
  {
    n: 3,
    title: 'Stage 3 — Collectibles & exploration',
    sub: 'The map-wide hunts: 3 Collectible Card sets, WAiNK at 100 locations, 100 vehicles discovered, 10 registered to Scooter Bros, meditation at every spot, and the whole of Leonida explored.',
  },
  {
    n: 4,
    title: 'Stage 4 — Activities & challenges',
    sub: '250 stunts, gold in every Shooting Range challenge, a Top Fun drone-race win at every location, 20 different races won, 50 challenges, each activity type tried once, Cal beaten at fishing, an arcade game completed, Bret’s hunt, and the two bowling trophies.',
  },
  {
    n: 5,
    title: 'Stage 5 — Free-roam feats & the money',
    sub: '5 bank vaults robbed and escaped, the armored truck, the undetected jewelry store, one illegal operation per gang, the partner feats, $250,000 laundered, $100,000 spent, every garage bought, and the one-off Leonida moments.',
  },
  {
    n: 6,
    title: 'Stage 6 — 100% and the platinum',
    sub: 'A Long Road: attain 100% completion. With all 54 other trophies earned, Vice Got a Price! — the platinum — is awarded.',
  },
];

export function stageOf(n) {
  return STAGES.find((s) => s.n === n) ?? STAGES[0];
}
