content = open(r'C:\flow\src\app\ideas\page.tsx', 'r', encoding='utf-8').read()

# Find the setLightingFx line in applyStageMetamorphosisPreset and add bible enable after it
old_fragment = "    setLightingFx(preset.lightingFx);\r\n    showToast(`Applied preset: ${preset.name}`, \"success\");\r\n  };"
new_fragment = "    setLightingFx(preset.lightingFx);\r\n    setIncludeCharacterBible(true);\r\n    showToast(`Applied preset: ${preset.name}`, \"success\");\r\n  };"

if old_fragment in content:
    print("Found CRLF version!")
    result = content.replace(old_fragment, new_fragment, 1)
else:
    # Try LF version
    old_fragment = "    setLightingFx(preset.lightingFx);\n    showToast(`Applied preset: ${preset.name}`, \"success\");\n  };"
    new_fragment = "    setLightingFx(preset.lightingFx);\n    setIncludeCharacterBible(true);\n    showToast(`Applied preset: ${preset.name}`, \"success\");\n  };"
    if old_fragment in content:
        print("Found LF version!")
        result = content.replace(old_fragment, new_fragment, 1)
    else:
        # Check what's around line 5170
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if 'setLightingFx(preset.lightingFx)' in line:
                print(f"Line {i+1}: {repr(line)}")
                print(f"Line {i+2}: {repr(lines[i+1])}")
                print(f"Line {i+3}: {repr(lines[i+2])}")
                break
        result = content

open(r'C:\flow\src\app\ideas\page.tsx', 'w', encoding='utf-8').write(result)
print("Saved!")
