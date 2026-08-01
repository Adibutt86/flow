import { CategoryId } from "../categories/types";

export interface LibraryScriptCharacter {
  name: string;
  role: string;
  appearance: string;
  clothing: string;
  personality: string;
}

export interface LibraryScriptStoryBeats {
  hook: string;
  setup: string;
  escalation: string;
  complication: string;
  climax: string;
  punchline: string;
  resolution: string;
}

export interface LibraryScriptDialogue {
  speaker: string;
  text: string;
}

export interface LibraryScript {
  id: string;
  title: string;
  category: CategoryId;
  description: string;
  characters: LibraryScriptCharacter[];
  setting: string;
  completeStory: string;
  storyBeats: LibraryScriptStoryBeats;
  dialogue: LibraryScriptDialogue[];
  visualHighlights: string[];
  recommendedSceneCounts: number[];
  createdBy: "CLI";
  sourceType: "library";
  aiGenerated: false;
  apiGenerated?: false;
  apiUsed: false;
}

/**
 * Empty Story Library - All CLI Created Data Removed.
 * Story script generation is 100% powered by Claude API & Gemini API.
 */
export const LOCAL_STORY_LIBRARY: LibraryScript[] = [];

export function getLibraryScriptsByCategory(category: CategoryId): LibraryScript[] {
  return LOCAL_STORY_LIBRARY.filter((s) => s.category === category);
}

export function getLibraryScriptById(id: string): LibraryScript | undefined {
  return LOCAL_STORY_LIBRARY.find((s) => s.id === id);
}
