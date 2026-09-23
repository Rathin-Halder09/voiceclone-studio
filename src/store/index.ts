// ============================================================
// Application State Management - Zustand Store
// ============================================================
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type {
  VoiceProfile, RecordingSample, GenerationRequest, AudioLibraryItem,
  VoiceSettings, BenchmarkResult, HumanRating, DatasetRecommendation,
  AppSettings, ConsentRecord, Language, AudioFormat, VoiceStyle,
  GenerationStatus, ProfileStatus
} from '../types';
import { VoiceEngineFactory, type IVoiceEngine } from '../voice-engine';

interface AppState {
  // Voice Engine
  engine: IVoiceEngine;
  
  // Voice Profiles
  profiles: VoiceProfile[];
  activeProfileId: string | null;
  
  // Recording Samples
  samples: RecordingSample[];
  
  // Generations
  generations: GenerationRequest[];
  currentGeneration: GenerationRequest | null;
  
  // Audio Library
  audioLibrary: AudioLibraryItem[];
  
  // Benchmarks
  benchmarkResults: BenchmarkResult[];
  
  // Dataset Analysis
  datasetValidation: { valid: boolean; issues: string[]; recommendations: DatasetRecommendation[] } | null;
  speakerConsistency: { consistent: boolean; outliers: string[]; avgSimilarity: number } | null;
  
  // Settings
  settings: AppSettings;
  consent: ConsentRecord | null;
  
  // UI State
  currentSection: string;
  isRecording: boolean;
  recordingTime: number;
  isLoading: boolean;
  error: string | null;
  notifications: { id: string; type: 'success' | 'error' | 'warning' | 'info'; message: string; timestamp: Date }[];
  
  // Actions
  setSection: (section: string) => void;
  addSample: (sample: RecordingSample) => void;
  removeSample: (id: string) => void;
  clearSamples: () => void;
  setDatasetValidation: (result: { valid: boolean; issues: string[]; recommendations: DatasetRecommendation[] }) => void;
  setSpeakerConsistency: (result: { consistent: boolean; outliers: string[]; avgSimilarity: number }) => void;
  createProfile: (name: string) => Promise<VoiceProfile | null>;
  deleteProfile: (id: string) => Promise<void>;
  setActiveProfile: (id: string) => void;
  generateSpeech: (text: string, language: Language, settings: VoiceSettings, format: AudioFormat) => Promise<GenerationRequest | null>;
  cancelGeneration: () => Promise<void>;
  addToLibrary: (item: AudioLibraryItem) => void;
  removeFromLibrary: (id: string) => void;
  addBenchmarkResult: (result: BenchmarkResult) => void;
  addHumanRating: (benchmarkId: string, rating: HumanRating) => void;
  setConsent: (consent: ConsentRecord) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  setIsRecording: (recording: boolean) => void;
  setRecordingTime: (time: number) => void;
  setError: (error: string | null) => void;
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  removeNotification: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

const defaultSettings: AppSettings = {
  maxGenerationLength: 10000,
  maxMonthlyUsage: 100000,
  maxRequestSize: 50000,
  defaultFormat: 'wav',
  defaultLanguage: 'english',
  qualityTarget: 90,
  speakerConsistencyTarget: 90,
  recordingQualityTarget: 80,
  phoneticCoverageTarget: 85,
  theme: 'dark'
};

export const useAppStore = create<AppState>((set, get) => ({
  engine: VoiceEngineFactory.createEngine('demo'),
  profiles: [],
  activeProfileId: null,
  samples: [],
  generations: [],
  currentGeneration: null,
  audioLibrary: [],
  benchmarkResults: [],
  datasetValidation: null,
  speakerConsistency: null,
  settings: defaultSettings,
  consent: null,
  currentSection: 'dashboard',
  isRecording: false,
  recordingTime: 0,
  isLoading: false,
  error: null,
  notifications: [],
  
  setSection: (section) => set({ currentSection: section }),
  
  addSample: (sample) => set((state) => ({ samples: [...state.samples, sample] })),
  
  removeSample: (id) => set((state) => ({ samples: state.samples.filter(s => s.id !== id) })),
  
  clearSamples: () => set({ samples: [] }),
  
  setDatasetValidation: (result) => set({ datasetValidation: result }),
  
  setSpeakerConsistency: (result) => set({ speakerConsistency: result }),
  
  createProfile: async (name) => {
    const state = get();
    try {
      set({ isLoading: true, error: null });
      const profile = await state.engine.createVoiceProfile(name, state.samples);
      set((s) => ({
        profiles: [...s.profiles, profile],
        activeProfileId: profile.id,
        isLoading: false
      }));
      get().addNotification('success', `Voice profile "${name}" created successfully!`);
      return profile;
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      get().addNotification('error', `Failed to create profile: ${(err as Error).message}`);
      return null;
    }
  },
  
  deleteProfile: async (id) => {
    const state = get();
    try {
      set({ isLoading: true });
      await state.engine.deleteVoiceProfile(id);
      set((s) => ({
        profiles: s.profiles.filter(p => p.id !== id),
        activeProfileId: s.activeProfileId === id ? null : s.activeProfileId,
        isLoading: false
      }));
      get().addNotification('success', 'Voice profile deleted successfully.');
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },
  
  setActiveProfile: (id) => set({ activeProfileId: id }),
  
  generateSpeech: async (text, language, settings, format) => {
    const state = get();
    const profileId = state.activeProfileId;
    if (!profileId) {
      get().addNotification('error', 'No active voice profile. Please create a voice profile first.');
      return null;
    }
    
    try {
      set({ isLoading: true, error: null });
      const request = await state.engine.generateSpeech(text, profileId, settings, language, format);
      set((s) => ({
        generations: [...s.generations, request],
        currentGeneration: request,
        isLoading: false
      }));
      
      // Poll for completion
      const pollInterval = setInterval(async () => {
        const updated = await state.engine.getGenerationStatus(request.id);
        if (updated && (updated.status === 'complete' || updated.status === 'failed' || updated.status === 'cancelled')) {
          clearInterval(pollInterval);
          set((s) => ({
            generations: s.generations.map(g => g.id === updated.id ? updated : g),
            currentGeneration: updated
          }));
          
          if (updated.status === 'complete' && updated.audioUrl) {
            const profile = state.profiles.find(p => p.id === profileId);
            const libraryItem: AudioLibraryItem = {
              id: uuidv4(),
              text: text.substring(0, 200),
              language,
              voiceProfileId: profileId,
              voiceProfileName: profile?.name || 'Unknown',
              duration: updated.duration || 0,
              format,
              qualityScore: updated.qualityReport?.overall || 0,
              status: 'complete',
              createdAt: new Date(),
              audioUrl: updated.audioUrl,
              settings,
              fileName: `VoiceClone_${new Date().toISOString().split('T')[0]}_${language}_${Date.now()}.${format}`,
              fileSize: updated.audioBlob?.size || 0
            };
            get().addToLibrary(libraryItem);
            get().addNotification('success', 'Speech generation complete!');
          } else if (updated.status === 'failed') {
            get().addNotification('error', 'Speech generation failed. Please try again.');
          }
        } else if (updated) {
          set((s) => ({
            generations: s.generations.map(g => g.id === updated.id ? updated : g),
            currentGeneration: updated
          }));
        }
      }, 500);
      
      return request;
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      get().addNotification('error', `Generation failed: ${(err as Error).message}`);
      return null;
    }
  },
  
  cancelGeneration: async () => {
    const state = get();
    if (state.currentGeneration) {
      await state.engine.cancelGeneration(state.currentGeneration.id);
      set({ currentGeneration: null });
    }
  },
  
  addToLibrary: (item) => set((s) => ({ audioLibrary: [item, ...s.audioLibrary] })),
  
  removeFromLibrary: (id) => set((s) => ({ audioLibrary: s.audioLibrary.filter(i => i.id !== id) })),
  
  addBenchmarkResult: (result) => set((s) => ({ benchmarkResults: [...s.benchmarkResults, result] })),
  
  addHumanRating: (benchmarkId, rating) => set((s) => ({
    benchmarkResults: s.benchmarkResults.map(b => 
      b.id === benchmarkId ? { ...b, humanRating: rating } : b
    )
  })),
  
  setConsent: (consent) => set({ consent }),
  
  updateSettings: (newSettings) => set((s) => ({ settings: { ...s.settings, ...newSettings } })),
  
  setIsRecording: (recording) => set({ isRecording: recording }),
  setRecordingTime: (time) => set({ recordingTime: time }),
  setError: (error) => set({ error }),
  
  addNotification: (type, message) => {
    const id = uuidv4();
    set((s) => ({
      notifications: [...s.notifications, { id, type, message, timestamp: new Date() }]
    }));
    setTimeout(() => get().removeNotification(id), 5000);
  },
  
  removeNotification: (id) => set((s) => ({
    notifications: s.notifications.filter(n => n.id !== id)
  })),
  
  setLoading: (loading) => set({ isLoading: loading })
}));
