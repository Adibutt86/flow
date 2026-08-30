const fs = require('fs');
const file = 'src/app/nano-pro/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// I will find the `if (activeTab === "kids-post") {` block entirely and replace it.
const kidsBlockRegex = /if \(activeTab === "kids-post"\) \{[\s\S]*?else if \(activeTab === "shayari-post"\) \{/m;

const newBlock = `if (activeTab === "kids-post") {
        parameters = {
          category: "CUTE_KIDS",
          characterType: characterType || "One Cute Little Girl",
          clothing: clothing || "Casual",
          visualStyle: visualStyle || "3D Disney Style Cartoon",
          aspectRatio,
          backgroundStyle: backgroundStyle || "Sunny Playground",
          quoteText: fbDisableQuote ? "" : (fbQuoteText || "Funny Kids Moment"),
          characterStyle: fbCharacterStyle === "Custom" ? customFbCharacterStyle : fbCharacterStyle,
          colorTheme: fbColorTheme === "Custom" ? customFbColorTheme : fbColorTheme,
          layout: fbLayout === "Custom" ? customFbLayout : fbLayout,
          format: fbFormat === "Custom" ? customFbFormat : fbFormat,
          textStyle: fbTextStyle === "Custom" ? customFbTextStyle : fbTextStyle,
          decorations: fbDecorations === "Custom" ? customFbDecorations : fbDecorations,
          background: fbBackground === "Custom" ? customFbBackground : fbBackground,
          mood: fbMood === "Custom" ? customFbMood : fbMood,
          language: fbLanguage,
          age: fbAge === "Custom" ? customFbAge : fbAge,
          nationality: fbNationality === "Custom" ? customFbNationality : fbNationality,
          complexion: fbComplexion === "Custom" ? customFbComplexion : fbComplexion,
          music: fbMusic === "Custom" ? customFbMusic : fbMusic,
          disableQuote: fbDisableQuote,
          disableImage: fbDisableImage,
        };
        res = await fetch("/api/generate-fb-post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ aiModel, referenceCharacterInfo, ...parameters }),
        });
      } else if (activeTab === "fb-post") {
        parameters = {
          quoteText: fbQuoteText,
          characterStyle: fbCharacterStyle === "Custom" ? customFbCharacterStyle : fbCharacterStyle,
          colorTheme: fbColorTheme === "Custom" ? customFbColorTheme : fbColorTheme,
          layout: fbLayout === "Custom" ? customFbLayout : fbLayout,
          format: fbFormat === "Custom" ? customFbFormat : fbFormat,
          textStyle: fbTextStyle === "Custom" ? customFbTextStyle : fbTextStyle,
          decorations: fbDecorations === "Custom" ? customFbDecorations : fbDecorations,
          background: fbBackground === "Custom" ? customFbBackground : fbBackground,
          mood: fbMood === "Custom" ? customFbMood : fbMood,
          language: fbLanguage,
          age: fbAge === "Custom" ? customFbAge : fbAge,
          nationality: fbNationality === "Custom" ? customFbNationality : fbNationality,
          complexion: fbComplexion === "Custom" ? customFbComplexion : fbComplexion,
          music: fbMusic === "Custom" ? customFbMusic : fbMusic,
          disableQuote: fbDisableQuote,
          disableImage: fbDisableImage,
        };
        res = await fetch("/api/generate-fb-post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ aiModel, referenceCharacterInfo, ...parameters }),
        });
      } else if (activeTab === "shayari-post") {`;

content = content.replace(kidsBlockRegex, newBlock);
fs.writeFileSync(file, content);
console.log('Fixed block');
