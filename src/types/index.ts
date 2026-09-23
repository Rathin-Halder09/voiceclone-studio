// ============================================================
// Voice Cloning Application - Core Type Definitions
// ============================================================

export type Language = 'bengali' | 'english' | 'mixed';
export type VoiceStyle = 'natural' | 'conversational' | 'narration' | 'news' | 'presentation' | 'calm' | 'energetic';
export type RecordingStatus = 'recording' | 'paused' | 'stopped' | 'idle';
export type SampleQuality = 'excellent' | 'good' | 'acceptable' | 'poor' | 'rejected';
export type ProfileStatus = 'inactive' | 'training' | 'ready' | 'error' | 'degraded';
export type GenerationStatus = 'pending' | 'processing' | 'generating' | 'combining' | 'quality_check' | 'complete' | 'failed' | 'cancelled';
export type AudioFormat = 'wav' | 'mp3' | 'flac' | 'ogg';

export interface RecordingSample {
  id: string;
  name: string;
  duration: number; // seconds
  sampleRate: number;
  bitDepth: number;
  channels: number;
  format: string;
  fileSize: number;
  rmsLoudness: number; // dB
  peakAmplitude: number; // 0-1
  snrEstimate: number; // dB
  silenceRatio: number; // 0-1
  clippingPercent: number; // 0-100
  backgroundNoiseEstimate: number; // 0-100
  speechPercentage: number; // 0-100
  echoLevel: number; // 0-100
  volumeConsistency: string;
  overallQuality: number; // 0-100
  quality: SampleQuality;
  speakerSimilarity?: number; // 0-100
  issues: string[];
  warnings: string[];
  createdAt: Date;
  audioBlob?: Blob;
  audioUrl?: string;
  waveform?: number[];
}

export interface VoiceProfile {
  id: string;
  name: string;
  version: number;
  status: ProfileStatus;
  languages: Language[];
  style: VoiceStyle;
  qualityScore: number; // 0-100
  sampleCount: number;
  totalDuration: number; // seconds
  speakerConsistency: number; // 0-100
  phoneticCoverage: PhoneticCoverage;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  providerId?: string;
  metadata: Record<string, any>;
}

export interface PhoneticCoverage {
  englishPhonemes: number; // 0-100
  bengaliPhonemes: number; // 0-100
  numberCoverage: number; // 0-100
  questionIntonation: number; // 0-100
  sentenceLengthDiversity: number; // 0-100
  speakingRateDiversity: number; // 0-100
  pitchVariation: number; // 0-100
  vocabularyDiversity: number; // 0-100
}

export interface GenerationRequest {
  id: string;
  text: string;
  language: Language;
  voiceProfileId: string;
  settings: VoiceSettings;
  format: AudioFormat;
  status: GenerationStatus;
  progress: number; // 0-100
  createdAt: Date;
  completedAt?: Date;
  audioUrl?: string;
  audioBlob?: Blob;
  duration?: number;
  qualityReport?: QualityReport;
  errorMessage?: string;
  chunks?: GenerationChunk[];
}

export interface GenerationChunk {
  index: number;
  text: string;
  status: GenerationStatus;
  audioUrl?: string;
  audioBlob?: Blob;
  duration?: number;
}

export interface VoiceSettings {
  speed: number; // 0.5 - 2.0
  pitch: number; // 0.5 - 2.0
  expressiveness: number; // 0 - 100
  volume: number; // 0 - 100
  pauseLength: number; // 0 - 100
  pronunciationStrength: number; // 0 - 100
  style: VoiceStyle;
  emotion?: string;
  stability: number; // 0 - 100
  similarityBoost: number; // 0 - 100
}

export interface QualityReport {
  speakerSimilarity: number; // 0-100
  naturalness: number; // 0-100
  clarity: number; // 0-100
  pronunciation: number; // 0-100
  prosodyConsistency: number; // 0-100
  overall: number; // 0-100
  testsPassed: QualityTest[];
  testsFailed: QualityTest[];
}

export interface QualityTest {
  name: string;
  passed: boolean;
  score: number;
  details: string;
}

export interface AudioLibraryItem {
  id: string;
  text: string;
  language: Language;
  voiceProfileId: string;
  voiceProfileName: string;
  duration: number;
  format: AudioFormat;
  qualityScore: number;
  status: GenerationStatus;
  createdAt: Date;
  audioUrl: string;
  settings: VoiceSettings;
  fileName: string;
  fileSize: number;
}

export interface BenchmarkResult {
  id: string;
  category: string;
  text: string;
  language: Language;
  audioUrl?: string;
  qualityReport?: QualityReport;
  humanRating?: HumanRating;
  createdAt: Date;
}

export interface HumanRating {
  voiceSimilarity: number; // 1-5
  naturalness: number; // 1-5
  pronunciation: number; // 1-5
  expression: number; // 1-5
  comments: string;
  createdAt: Date;
}

export interface DatasetRecommendation {
  type: string;
  language: Language;
  description: string;
  prompt: string;
  priority: 'high' | 'medium' | 'low';
  estimatedImprovement: number;
}

export interface VoiceEngineCapabilities {
  name: string;
  supportsVoiceCloning: boolean;
  supportsBengali: boolean;
  supportsEnglish: boolean;
  supportsMixedLanguage: boolean;
  supportsEmotion: boolean;
  supportsStyle: boolean;
  supportedFormats: AudioFormat[];
  maxTextLength: number;
  maxRecordingDuration: number;
  requiresTraining: boolean;
  trainingMinDuration: number;
  trainingRecommendedDuration: number;
}

export interface ConsentRecord {
  accepted: boolean;
  timestamp: Date;
  version: string;
  details: string;
}

export interface AppSettings {
  maxGenerationLength: number;
  maxMonthlyUsage: number;
  maxRequestSize: number;
  defaultFormat: AudioFormat;
  defaultLanguage: Language;
  qualityTarget: number;
  speakerConsistencyTarget: number;
  recordingQualityTarget: number;
  phoneticCoverageTarget: number;
  theme: 'light' | 'dark' | 'system';
}

export interface ProviderConfig {
  provider: string;
  apiKey?: string;
  baseUrl?: string;
  region?: string;
  model?: string;
}
