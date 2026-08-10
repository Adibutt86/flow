const fs = require('fs');
const block = fs.readFileSync('combos_block.txt', 'utf-8');

// evaluate the block
const DIALOGUE_COMBO_PRESETS = eval(block.replace("const DIALOGUE_COMBO_PRESETS =", ""));

const groups = [
  { category: "⭐ Top Picks (Most Common)", options: [] },
  { category: "👦🏫 Friends & Locations", options: [] },
  { category: "🧒🏠 Siblings & Locations", options: [] },
  { category: "👨‍👩‍👧 Family & Relatives", options: [] },
  { category: "🎒 School & Learning", options: [] },
  { category: "😂 Comedy, Drama & Trios", options: [] },
  { category: "🇵🇰 Desi Culture & Others", options: [] },
  { category: "🎭 Solo, Narration & Special", options: [] },
];

const assignGroup = (combo) => {
  const t = combo.title;
  // Top picks
  if (["Friends Dialogue", "Brother & Sister", "Boy & Girl Dialogue", "Two Boys Dialogue", "Two Girls Dialogue"].includes(t)) {
    return 0;
  }
  // Friends Locations
  if (t.includes("Friends in") || t.includes("Friends at") || t.includes("Two Friends In Dhaba") || t.includes("Rooftop Kite Boys")) {
    return 1;
  }
  // Siblings Locations
  if (t.includes("Siblings in") || t.includes("Siblings Studying") || t.includes("Brother & Sister Dialogue")) {
    return 2;
  }
  // Family
  if (t.includes("Mom") || t.includes("Dad") || t.includes("Dada") || t.includes("Dadi") || t.includes("Family") || t.includes("Halwa Puri")) {
    return 3;
  }
  // School
  if (t.includes("Student") || t.includes("Homework") || t.includes("Class") || t.includes("Science")) {
    return 4;
  }
  // Trios and Comedy
  if (t.includes("Three") || t.includes("Two Boys &") || t.includes("Two Girls &") || t.includes("Comedy") || t.includes("Prank") || t.includes("Birthday") || t.includes("Food Fight") || t.includes("Argument")) {
    return 5;
  }
  // Desi / Others
  if (t.includes("Cricket") || t.includes("Eid Shopping") || t.includes("Shaddi") || t.includes("Calf") || t.includes("Kitten") || t.includes("Garden")) {
    return 6;
  }
  // Solo & Special
  return 7;
}

for (const combo of DIALOGUE_COMBO_PRESETS) {
    groups[assignGroup(combo)].options.push(combo);
}

// Convert back to TS string
let tsCode = "const DIALOGUE_COMBO_GROUPS = [\\n";
for (const g of groups) {
    if (g.options.length === 0) continue;
    tsCode +=   {\n    category: "",\n    options: [\n;
    for (const opt of g.options) {
        tsCode += "      {\n";
        for (const [k, v] of Object.entries(opt)) {
            tsCode +=         : ,\n;
        }
        tsCode += "      },\n";
    }
    tsCode += "    ]\n  },\n";
}
tsCode += "];\n";

fs.writeFileSync('new_combos.txt', tsCode, 'utf-8');
