file_path = r'C:\flow\src\app\ideas\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Adding the Hijab options for female
if 'Female Elegant Abaya' not in text:
    old_female_outfits = '''    category: "👩 Female Shayara & Singer Outfits",
    options: [
      { value: "Female Heavily Embellished Lehenga Choli 👗", label: "Female Embellished Lehenga Choli 👗", desc: "Royal embroidered bridal/party Lehenga Choli with sheer Dupatta." },
      { value: "Female Elegant Silk Saree & Jewels 🥻", label: "Female Elegant Silk Saree & Jewels 🥻", desc: "Graceful Banarasi/silk saree with traditional jhumka earrings." },
      { value: "Female Stylish Anarkali Frock & Dupatta ✨", label: "Female Stylish Anarkali Frock & Dupatta ✨", desc: "Flowing floor-length Anarkali suit with heavy hand-embroidered borders." },
      { value: "Female Western Formal Evening Gown 💃", label: "Female Western Evening Gown 💃", desc: "Sophisticated floor-length Western silk evening gown with heels." },
      { value: "Female Western Chic Cocktail Dress 👠", label: "Female Western Cocktail Dress & Heels 👠", desc: "Modern Western cocktail dress with elegant jewelry and heels." },
      { value: "Female Casual Denim Jacket & Sundress 🌸", label: "Female Denim Jacket & Sundress 🌸", desc: "Breezy floral sundress paired with a light denim jacket." },
    ],'''

    new_female_outfits = '''    category: "👩 Female Shayara & Singer Outfits",
    options: [
      { value: "Female Heavily Embellished Lehenga Choli 👗", label: "Female Embellished Lehenga Choli 👗", desc: "Royal embroidered bridal/party Lehenga Choli with sheer Dupatta." },
      { value: "Female Elegant Silk Saree & Jewels 🥻", label: "Female Elegant Silk Saree & Jewels 🥻", desc: "Graceful Banarasi/silk saree with traditional jhumka earrings." },
      { value: "Female Stylish Anarkali Frock & Dupatta ✨", label: "Female Stylish Anarkali Frock & Dupatta ✨", desc: "Flowing floor-length Anarkali suit with heavy hand-embroidered borders." },
      { value: "Female Elegant Abaya & Silk Hijab 🧕", label: "Female Elegant Abaya & Silk Hijab 🧕", desc: "Modest and graceful dark abaya with a beautifully draped silk hijab." },
      { value: "Female Traditional Salwar Kameez with Hijab 🧕", label: "Female Salwar Kameez with Hijab 🧕", desc: "Modest ethnic Shalwar Kameez paired with a neatly styled matching hijab." },
      { value: "Female Modest Long Gown with Chiffon Hijab 🧕", label: "Female Modest Gown with Chiffon Hijab 🧕", desc: "Flowing modest evening gown styled with a delicate chiffon hijab." },
      { value: "Female Western Formal Evening Gown 💃", label: "Female Western Evening Gown 💃", desc: "Sophisticated floor-length Western silk evening gown with heels." },
      { value: "Female Western Chic Cocktail Dress 👠", label: "Female Western Cocktail Dress & Heels 👠", desc: "Modern Western cocktail dress with elegant jewelry and heels." },
      { value: "Female Casual Denim Jacket & Sundress 🌸", label: "Female Denim Jacket & Sundress 🌸", desc: "Breezy floral sundress paired with a light denim jacket." },
    ],'''
    
    text = text.replace(old_female_outfits, new_female_outfits)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)
