const fs = require('fs');
let code = fs.readFileSync('src/app/ideas/page.tsx', 'utf8');

// Sorting
code = code.replace(
  '{CUTE_KIDS_PRESET_GROUPS.map((group) => {',
  '{CUTE_KIDS_PRESET_GROUPS.slice().sort((a, b) => { if (presetTabFilter === "all") return 0; const aTab = (a).tab; const bTab = (b).tab; if (aTab === presetTabFilter && bTab !== presetTabFilter) return -1; if (bTab === presetTabFilter && aTab !== presetTabFilter) return 1; return 0; }).map((group) => {'
);

const replacements = [
  { match: /(groupName:\s*".*?Sikh.*Punjabi Boy Presets",)/, tab: "solo-boy" },
  { match: /(groupName:\s*".*?Boy Professions & Roles",)/, tab: "solo-boy" },
  { match: /(groupName:\s*".*?Girl Professions & Roles",)/, tab: "solo-girl" },
  { match: /(groupName:\s*".*?Solo Girl Presets \([^"]*WITH DIALOGUE\)",)/, tab: "solo-girl" },
  { match: /(groupName:\s*".*?Angry Toddler Boy Presets[^"]*",)/, tab: "solo-boy" },
  { match: /(groupName:\s*".*?Solo Girl Presets \([^"]*WITHOUT DIALOGUE[^"]*\)",)/, tab: "solo-girl" },
  { match: /(groupName:\s*".*?Boy Singer Presets[^"]*",)/, tab: "solo-boy" },
  { match: /(groupName:\s*".*?Family & Everyday Scenarios[^"]*",)/, tab: "boy-girl" },
  { match: /(groupName:\s*".*?Animal & Pet Duos[^"]*",)/, tab: "boy-girl" }
];

for (const {match, tab} of replacements) {
  code = code.replace(match, (m, p1) => p1 + '\n    tab: "' + tab + '",');
}

fs.writeFileSync('src/app/ideas/page.tsx', code, 'utf8');
