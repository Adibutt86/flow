const fs = require('fs');
const file = 'src/app/nano-pro/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add Language groups
const fbLanguageGroups = `const FB_LANGUAGE_GROUPS = [
  {
    category: "Languages",
    options: [
      { value: "English", label: "English", desc: "Standard English quote" },
      { value: "Roman Urdu", label: "Roman Urdu", desc: "Urdu written in English letters (e.g. 'Zindagi')" },
      { value: "Urdu Script", label: "Urdu Script", desc: "Proper Urdu text (اردو)" }
    ]
  }
];`;

content = content.replace(
  'const FB_MOOD_GROUPS = [',
  fbLanguageGroups + '\n\nconst FB_MOOD_GROUPS = ['
);

// 2. Add state variable
content = content.replace(
  'const [fbMood, setFbMood] = useState("Sassy & Confident");',
  'const [fbMood, setFbMood] = useState("Sassy & Confident");\n  const [fbLanguage, setFbLanguage] = useState("English");'
);

// 3. Add to localStorage object
content = content.replace(
  '        fbMood,\n        fbAge,',
  '        fbMood,\n        fbLanguage,\n        fbAge,'
);

// 4. Update parsing
content = content.replace(
  'if (parsed.fbMood) setFbMood(parsed.fbMood);',
  'if (parsed.fbMood) setFbMood(parsed.fbMood);\n        if (parsed.fbLanguage) setFbLanguage(parsed.fbLanguage);'
);

// 5. Add to API parameters (both kids and fb post have it)
// We need to use regex since there are two instances
content = content.replace(/mood: fbMood === "Custom" \? customFbMood : fbMood,/g, 'mood: fbMood === "Custom" ? customFbMood : fbMood,\n          language: fbLanguage,');

// 6. Add UI Element right after Mood
const moodUI = `                        groups={FB_MOOD_GROUPS}
                        value={fbMood}
                        onChange={setFbMood}
                        placeholder="Select Mood"
                        isLight={isLight}
                        customValue={customFbMood}
                        onCustomChange={setCustomFbMood}
                        allowCustom={true}
                        disabled={fbDisableQuote && fbDisableImage}
                      />
                    </div>`;

const languageUI = `
                    <div className="space-y-2">
                      <label className={\`text-xs font-black uppercase tracking-wider block \${
                        isLight ? "text-slate-700" : "text-slate-400"
                      }\`}>
                        🌐 Quote Language
                      </label>
                      <CustomSelect 
                        groups={FB_LANGUAGE_GROUPS}
                        value={fbLanguage}
                        onChange={setFbLanguage}
                        placeholder="Select Language"
                        isLight={isLight}
                        allowCustom={false}
                        disabled={fbDisableQuote}
                      />
                    </div>`;

content = content.replace(moodUI, moodUI + languageUI);

fs.writeFileSync(file, content);
console.log('Added language state successfully');
