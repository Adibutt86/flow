import re

file_path = r'C:\flow\src\app\ideas\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add categoryStates to interface
content = content.replace(
    'interface IdeasPageSettings {',
    'interface IdeasPageSettings {\n  categoryStates?: Record<string, Partial<IdeasPageSettings>>;'
)

# Update initialSettings logic
content = content.replace(
    '  const initialSettings = getInitialSettings();',
    '  const initialSettings = getInitialSettings();\n  const initialCatState = initialSettings.categoryStates?.[initialSettings.category || \"FUNNY\"] || initialSettings;'
)

# Replace initialSettings. with initialCatState. for fields starting from visualStyle down to customIdea
fields_to_change = [
    'visualStyle', 'videoDuration', 'customDialogue', 'kidsAge', 'kidsLocation', 'kidsHealth',
    'kidsVibe', 'kidsClothing', 'characterSetup', 'charactersPerScene', 'customCharactersPerScene',
    'kidsNationality', 'musicType', 'seriousDialogueStyle', 'customSceneDescription', 'outroEffects',
    'kidsExpression', 'kidsFood', 'kidsProp', 'timeOfDay', 'storyBeat', 'cameraShot', 'charPerformance',
    'includeMic', 'songCrowdFx', 'characterFaceType', 'performerAge', 'stageLocation', 'audiencePerspective',
    'stageEnvironment', 'initialPerformer', 'triggerAction', 'targetEntity', 'lightingFx', 'carboxBrand',
    'carboxColor', 'carboxPackaging', 'carboxBackground', 'customIdea'
]

for field in fields_to_change:
    # Need to replace initialSettings.field with initialCatState.field
    content = re.sub(rf'initialSettings\.{field}', f'initialCatState.{field}', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
