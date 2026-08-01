export type CategoryId =
  | "HORROR"
  | "FUNNY"
  | "HINDI_JOKE"
  | "PUNJABI_JOKE"
  | "KIDS_FUNNY"
  | "FUNNY_ANIMALS"
  | "ABSTRACT"
  | "CINEMATIC"
  | "CUSTOM";

export interface CategoryConfig {
  id: CategoryId;
  name: string;
  badge: string;
  iconName: string;
  description: string;
  storytellingRules: string[];
  tone: string;
  pacing: string;
  hookStyle: string;
  endingStyle: string;
  characterStyle: string;
  visualStyleSuggestions: string[];
  dialogueStyle: string;
  promptInstructions: string;
}
