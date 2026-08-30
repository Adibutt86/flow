const fs = require('fs');
const file = 'src/app/nano-pro/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add import
content = content.replace(
  'import { FB_POST_QUOTES } from "@/lib/data/fb-quotes";',
  'import { FB_POST_QUOTES } from "@/lib/data/fb-quotes";\nimport { KIDS_POST_QUOTES } from "@/lib/data/kids-quotes";'
);

// 2. Add state
content = content.replace(
  'const [shyMood, setShyMood] = useState("");',
  'const [shyMood, setShyMood] = useState("");\n\n  // Kids Post Settings\n  const [kidsQuoteText, setKidsQuoteText] = useState("");\n  const [kidsDisableQuote, setKidsDisableQuote] = useState(false);\n  const [kidsDisableImage, setKidsDisableImage] = useState(false);\n'
);

// 3. Random quote handler
content = content.replace(
  '  const handleRandomFbQuote = () => {',
  '  const handleRandomKidsQuote = () => {\n    const randomIndex = Math.floor(Math.random() * KIDS_POST_QUOTES.length);\n    setKidsQuoteText(KIDS_POST_QUOTES[randomIndex]);\n  };\n\n  const handleRandomFbQuote = () => {'
);

// 4. LocalStorage
content = content.replace(
  'if (parsed.shyMood) setShyMood(parsed.shyMood);',
  'if (parsed.shyMood) setShyMood(parsed.shyMood);\n        if (parsed.kidsQuoteText !== undefined) setKidsQuoteText(parsed.kidsQuoteText);\n        if (parsed.kidsDisableQuote !== undefined) setKidsDisableQuote(parsed.kidsDisableQuote);\n        if (parsed.kidsDisableImage !== undefined) setKidsDisableImage(parsed.kidsDisableImage);'
);

content = content.replace(
  'shyMood,',
  'shyMood,\n        kidsQuoteText,\n        kidsDisableQuote,\n        kidsDisableImage,'
);

// 5. Add Tab button
content = content.replace(
  '                  onClick={() => setActiveTab("fb-post")}',
  '                  onClick={() => setActiveTab("kids-post")}\n                  className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-lg text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${\n                    activeTab === "kids-post"\n                      ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-orange-500/30"\n                      : isLight ? "bg-slate-100 text-slate-500 hover:bg-slate-200" : "bg-white/5 text-slate-400 hover:bg-white/10"\n                  }`}\n                >\n                  🧸 Kids Memes\n                </button>\n                <button\n                  onClick={() => setActiveTab("fb-post")}'
);

// 6. Title mapping
content = content.replace(
  'activeTab === "fb-post" ? "💙 Facebook Post Image" : "✨ Character Builder"}',
  'activeTab === "kids-post" ? "🧸 Kids Funny Memes" : activeTab === "fb-post" ? "💙 Facebook Post Image" : "✨ Character Builder"}'
);

// 7. Panel rendering
content = content.replace(
  ') : activeTab === "fb-post" ? (',
  ') : activeTab === "kids-post" ? (\n                  <div className="space-y-5 animate-in fade-in duration-300">\n                    <div>\n                      <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${isLight ? "text-slate-700" : "text-slate-400"}`}>🧸 Funny Kids Quote</label>\n                      <div className="relative">\n                        <textarea\n                          value={kidsQuoteText}\n                          onChange={(e) => setKidsQuoteText(e.target.value)}\n                          disabled={kidsDisableQuote}\n                          placeholder="E.g. Hide and seek champion: 4-year-old behind the sheer curtain..."\n                          className={`w-full p-4 pr-12 rounded-xl border text-sm font-medium resize-none h-24 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isLight ? "bg-white border-slate-300 text-slate-900" : "bg-black/40 border-slate-700 text-white placeholder-slate-500"}`}\n                        />\n                        <button type="button" onClick={handleRandomKidsQuote} disabled={kidsDisableQuote} className="absolute top-2 right-2 p-2 rounded-lg bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 transition-colors" title="Random Kids Quote">\n                          <RefreshCw className="w-4 h-4" />\n                        </button>\n                      </div>\n                      <div className="flex items-center mt-2">\n                        <input type="checkbox" id="kidsDisableQuote" checked={kidsDisableQuote} onChange={(e) => setKidsDisableQuote(e.target.checked)} className="rounded border-slate-600 bg-slate-900/50 text-orange-500 focus:ring-orange-500 w-4 h-4 mr-2" />\n                        <label htmlFor="kidsDisableQuote" className={`text-xs ${isLight ? "text-slate-600" : "text-slate-400"}`}>No Text / Image Only</label>\n                      </div>\n                    </div>\n                  </div>\n                ) : activeTab === "fb-post" ? ('
);

// 8. Output prompt generation
content = content.replace(
  '      if (activeTab === "fb-post") {',
  '      if (activeTab === "kids-post") {\n        parameters = {\n          category: "CUTE_KIDS",\n          characterType: characterType || "One Cute Little Girl",\n          clothing: clothing || "Casual",\n          age: "1-10 years",\n          nationality: nationality || "Any",\n          complexion: complexion || "Any",\n          visualStyle: visualStyle || "3D Disney Style Cartoon",\n          aspectRatio,\n          backgroundStyle: backgroundStyle || "Sunny Playground",\n          fbQuoteText: kidsDisableQuote ? "" : (kidsQuoteText || "Funny Kids Moment"),\n          fbCharacterStyle: "Cute, funny, 1 to 10 years old, highly expressive",\n          fbLayout: "Centered",\n          fbColorTheme: "Vibrant and Playful",\n          fbBackground: backgroundStyle || "Sunny Playground",\n          fbDisableQuote: kidsDisableQuote,\n          fbDisableImage: kidsDisableImage,\n        };\n        systemPrompt = "Generate a funny kids meme or post image prompt. Kids should be 1 to 10 years old. Focus on expressions and funny situations. If quote text is provided, incorporate it.";\n      }\n\n      if (activeTab === "fb-post") {'
);

// 9. Update generate button styling
content = content.replace(
  '                  activeTab === "fb-post"',
  '                  activeTab === "kids-post"\n                    ? "bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 shadow-orange-500/25 border-orange-400/40 text-white"\n                    : activeTab === "fb-post"'
);

content = content.replace(
  'isGenerating ? "Synthesizing Prompt..." : activeTab === "fb-post" ? "Generate FB Post Prompt"',
  'isGenerating ? "Synthesizing Prompt..." : activeTab === "kids-post" ? "Generate Kids Meme Prompt" : activeTab === "fb-post" ? "Generate FB Post Prompt"'
);

// 10. Copy button and activeTab checking
content = content.replace(
  '(activeTab === "fb-post" || activeTab === "shayari-post")',
  '(activeTab === "kids-post" || activeTab === "fb-post" || activeTab === "shayari-post")'
);

content = content.replace(
  'activeTab === "fb-post" || activeTab === "shayari-post"',
  'activeTab === "kids-post" || activeTab === "fb-post" || activeTab === "shayari-post"'
);
content = content.replace(
  'activeTab === "fb-post" || activeTab === "shayari-post"',
  'activeTab === "kids-post" || activeTab === "fb-post" || activeTab === "shayari-post"'
);

fs.writeFileSync(file, content);
console.log("Done patching page.tsx");
