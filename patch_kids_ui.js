const fs = require('fs');
const file = 'src/app/nano-pro/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove the entire `kids-post` UI block
const kidsPostStart = ') : activeTab === "kids-post" ? (';
const fbPostStart = ') : activeTab === "fb-post" ? (';
const kidsPostIndex = content.indexOf(kidsPostStart);
const fbPostIndex = content.indexOf(fbPostStart);

if (kidsPostIndex !== -1 && fbPostIndex !== -1) {
  const beforeKids = content.substring(0, kidsPostIndex);
  const afterKids = content.substring(fbPostIndex);
  content = beforeKids + afterKids;
}

// 2. Change `) : activeTab === "fb-post" ? (` to `) : (activeTab === "fb-post" || activeTab === "kids-post") ? (`
content = content.replace(
  ') : activeTab === "fb-post" ? (',
  ') : (activeTab === "fb-post" || activeTab === "kids-post") ? ('
);

// 3. Update the text label for the Quote
content = content.replace(
  '💙 Facebook Post Caption / Quote',
  '{activeTab === "kids-post" ? "🧸 Funny Kids Quote" : "💙 Facebook Post Caption / Quote"}'
);

// 4. Update the textarea binding to use fbQuoteText for both but handle the randomizer button correctly
content = content.replace(
  '<button type="button" onClick={handleRandomFbQuote}',
  '<button type="button" onClick={activeTab === "kids-post" ? handleRandomKidsQuote : handleRandomFbQuote}'
);

// 5. Update the handleRandomKidsQuote to set fbQuoteText instead of kidsQuoteText!
content = content.replace(
  'setKidsQuoteText(KIDS_POST_QUOTES[randomIndex]);',
  'setFbQuoteText(KIDS_POST_QUOTES[randomIndex]);'
);

// 6. In handleGenerate, the kids-post block should use the fb parameters
content = content.replace(
  'quoteText: kidsDisableQuote ? "" : (kidsQuoteText || "Funny Kids Moment"),',
  'quoteText: fbDisableQuote ? "" : (fbQuoteText || "Funny Kids Moment"),'
);
content = content.replace(
  'disableQuote: kidsDisableQuote,',
  'disableQuote: fbDisableQuote,'
);
content = content.replace(
  'disableImage: kidsDisableImage,',
  'disableImage: fbDisableImage,'
);

// Add the other fb properties to kids-post parameters so they can actually be customized
const kidsPostParamsStart = 'quoteText: fbDisableQuote ? "" : (fbQuoteText || "Funny Kids Moment"),';
const kidsPostParamsReplacement = `quoteText: fbDisableQuote ? "" : (fbQuoteText || "Funny Kids Moment"),
          characterStyle: fbCharacterStyle === "Custom" ? customFbCharacterStyle : fbCharacterStyle,
          colorTheme: fbColorTheme === "Custom" ? customFbColorTheme : fbColorTheme,
          layout: fbLayout === "Custom" ? customFbLayout : fbLayout,
          format: fbFormat === "Custom" ? customFbFormat : fbFormat,
          textStyle: fbTextStyle === "Custom" ? customFbTextStyle : fbTextStyle,
          decorations: fbDecorations === "Custom" ? customFbDecorations : fbDecorations,
          background: fbBackground === "Custom" ? customFbBackground : fbBackground,
          mood: fbMood === "Custom" ? customFbMood : fbMood,
          age: fbAge === "Custom" ? customFbAge : fbAge,
          nationality: fbNationality === "Custom" ? customFbNationality : fbNationality,
          complexion: fbComplexion === "Custom" ? customFbComplexion : fbComplexion,
          music: fbMusic === "Custom" ? customFbMusic : fbMusic,`;

content = content.replace(
  'characterStyle: "Cute, funny, 1 to 10 years old, highly expressive",\n          layout: "Centered",\n          colorTheme: "Vibrant and Playful",\n          background: backgroundStyle || "Sunny Playground",',
  kidsPostParamsReplacement
);

// Wait, the replace string might not match exactly. Let me use regex for the params
content = content.replace(/characterStyle: "Cute, funny, 1 to 10 years old, highly expressive",[\s\S]*?background: backgroundStyle \|\| "Sunny Playground",/m, kidsPostParamsReplacement);


fs.writeFileSync(file, content);
console.log('UI block merged and parameters updated');
