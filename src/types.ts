export type SocialPlatform = 'instagram' | 'linkedin' | 'twitter' | 'facebook' | 'tiktok' | 'youtube';

export type ToneOption = 'profesyonel' | 'samimi' | 'mizahi' | 'ilham_verici' | 'satis_odakli' | 'egitici' | 'heyecanli';

export type ContentStatus = 'taslak' | 'onaylandi' | 'planlandi' | 'yayinlandi';

export interface PostVariation {
  id: string;
  title: string;
  caption: string;
  hashtags: string[];
  callToAction: string;
  visualIdea: string;
  estimatedViralityScore: number;
  improvementTip: string;
  platform: SocialPlatform;
  tone: string;
  scheduledDate?: string;
  status?: ContentStatus;
  mediaUrl?: string;
  brandName?: string;
}

export interface ScheduledPost extends PostVariation {
  scheduledDate: string; // ISO date string YYYY-MM-DD
  scheduledTime: string; // HH:mm
  status: ContentStatus;
  createdAt: string;
}

export interface BrandProfile {
  id: string;
  name: string;
  industry: string;
  description: string;
  targetAudience: string;
  recommendedTones: string[];
  signatureHashtags: string[];
  contentPillars: string[];
  brandBio: string;
  primaryColor: string;
}

export interface GeneratorOptions {
  includeHashtags: boolean;
  includeCallToAction: boolean;
  includeVisualIdea: boolean;
  includeEmojis: boolean;
}
