import re

file_path = r'C:\flow\src\app\ideas\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Update the useEffect that saves the settings
old_save_logic = '''      const settings: IdeasPageSettings = {
        category,
        language,
        visualStyle,
        videoDuration,
        customDialogue,
        kidsAge,
        kidsLocation,
        kidsHealth,
        kidsVibe,
        kidsClothing,
        characterSetup,
        charactersPerScene,
        customCharactersPerScene,
        kidsNationality,
        carboxBrand,
        carboxColor,
        carboxPackaging,
        carboxBackground,
        customIdea,
        filterCategory,
        searchQuery,
        sortBy,
        currentPage,
        aiModel,
        musicType,
        seriousDialogueStyle,
        customSceneDescription,
        outroEffects,
        kidsExpression,
        kidsFood,
        kidsProp,
        timeOfDay,
        storyBeat,
        cameraShot,
        charPerformance,
        includeMic,
        songCrowdFx,
        characterFaceType,
        performerAge,
        stageLocation,
        audiencePerspective,
        stageEnvironment,
        initialPerformer,
        triggerAction,
        targetEntity,
        lightingFx,
      };
      localStorage.setItem("flow-ideas-page-settings", JSON.stringify(settings));'''

new_save_logic = '''      const globalStored = localStorage.getItem("flow-ideas-page-settings");
      let categoryStates: Record<string, Partial<IdeasPageSettings>> = {};
      try {
         if (globalStored) {
            const parsed = JSON.parse(globalStored);
            categoryStates = parsed.categoryStates || {};
         }
      } catch (e) {}

      categoryStates[category] = {
        visualStyle,
        videoDuration,
        customDialogue,
        kidsAge,
        kidsLocation,
        kidsHealth,
        kidsVibe,
        kidsClothing,
        characterSetup,
        charactersPerScene,
        customCharactersPerScene,
        kidsNationality,
        carboxBrand,
        carboxColor,
        carboxPackaging,
        carboxBackground,
        customIdea,
        musicType,
        seriousDialogueStyle,
        customSceneDescription,
        outroEffects,
        kidsExpression,
        kidsFood,
        kidsProp,
        timeOfDay,
        storyBeat,
        cameraShot,
        charPerformance,
        includeMic,
        songCrowdFx,
        characterFaceType,
        performerAge,
        stageLocation,
        audiencePerspective,
        stageEnvironment,
        initialPerformer,
        triggerAction,
        targetEntity,
        lightingFx,
        language
      };

      const settings: IdeasPageSettings = {
        category,
        filterCategory,
        searchQuery,
        sortBy,
        currentPage,
        aiModel,
        categoryStates
      };
      
      localStorage.setItem("flow-ideas-page-settings", JSON.stringify(settings));'''

content = content.replace(old_save_logic, new_save_logic)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done saving replacement!')
