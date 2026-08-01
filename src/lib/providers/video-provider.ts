/**
 * Abstraction layer for future automated video rendering integrations.
 * Currently, AI Short Studio generates Google Flow optimized prompts & packages.
 * This interface enables plugging in APIs like Google Flow/Veo, Kling, Runway, Luma seamlessly later.
 */

export type ProviderName = "google_flow" | "kling" | "runway" | "luma";

export interface VideoGenerationJobInput {
  sceneId: string;
  imagePrompt: string;
  videoPrompt: string;
  durationSeconds: number; // Always 8 for Google Flow clips
  aspectRatio: "9:16" | "16:9" | "1:1";
  referenceImageUrls?: string[];
  cameraMotion?: string;
}

export interface VideoGenerationJobStatus {
  jobId: string;
  provider: ProviderName;
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
  videoUrl?: string;
  error?: string;
  progressPercentage?: number;
}

export interface VideoProvider {
  name: ProviderName;
  supportsReferenceImages: boolean;
  maxClipDurationSeconds: number;
  generateClip(input: VideoGenerationJobInput): Promise<{ jobId: string }>;
  checkJobStatus(jobId: string): Promise<VideoGenerationJobStatus>;
}

/**
 * Mock Google Flow provider implementation for MVP (Prompts-only mode)
 */
export class GoogleFlowProvider implements VideoProvider {
  name: ProviderName = "google_flow";
  supportsReferenceImages = true;
  maxClipDurationSeconds = 8;

  async generateClip(input: VideoGenerationJobInput): Promise<{ jobId: string }> {
    // MVP: In MVP mode, prompts are copied manually into Google Flow web app
    return {
      jobId: `flow_manual_${input.sceneId}_${Date.now()}`,
    };
  }

  async checkJobStatus(jobId: string): Promise<VideoGenerationJobStatus> {
    return {
      jobId,
      provider: "google_flow",
      status: "COMPLETED",
      progressPercentage: 100,
    };
  }
}

export const defaultVideoProvider = new GoogleFlowProvider();
