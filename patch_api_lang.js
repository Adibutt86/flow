const fs = require('fs');
const file = 'src/app/api/generate-fb-post/route.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '      mood = "Sassy & Confident",',
  '      mood = "Sassy & Confident",\n      language = "English",'
);

content = content.replace(
  "QUOTE / MESSAGE TEXT: Create a fitting sassy/motivational/cute quote that matches the mood — MUST BE WRITTEN IN ROMAN/ENGLISH SCRIPT (e.g. 'zindagi', not 'ज़िंदगी'). NEVER USE HINDI/DEVANAGARI SCRIPTS.",
  "QUOTE / MESSAGE TEXT: Create a fitting sassy/motivational/cute quote that matches the mood.\\n${language === 'Roman Urdu' ? 'MUST BE WRITTEN IN ROMAN URDU SCRIPT (English letters but Urdu language, e.g. \\'Mera attitude meri marzi\\'). Do not use proper Urdu or Hindi scripts.' : language === 'Urdu Script' ? 'MUST BE WRITTEN IN PROPER URDU SCRIPT (e.g. \\'میرا انداز\\').' : 'MUST BE WRITTEN IN ENGLISH SCRIPT.'}"
);

content = content.replace(
  "If the quote is provided in Urdu script, you may write the title in flawless Urdu. Otherwise, MUST ALWAYS BE IN ENGLISH SCRIPT (Roman/Latin letters only). NEVER write in Hindi (Devanagari) script.",
  "If language is 'Urdu Script' or quote is in Urdu, write the title in flawless Urdu (اردو). If language is 'Roman Urdu', write title in Roman Urdu. Otherwise, MUST ALWAYS BE IN ENGLISH SCRIPT. NEVER write in Hindi (Devanagari)."
);

fs.writeFileSync(file, content);
console.log('Updated API language behavior');
