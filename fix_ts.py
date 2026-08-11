file_path = r'C:\flow\src\app\ideas\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('initialSettings.(category as string) === "SONG"', '(initialSettings.category as string) === "SONG"')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)
