# Architecture

## System Overview

VoiceClone Studio Pro uses a modular architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface (React)                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │Dashboard │ │Recording │ │  TTS     │ │ Quality  │   │
│  │  Page    │ │  Page    │ │  Page    │ │   Lab    │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
├─────────────────────────────────────────────────────────┤
│                  State Management (Zustand)               │
├─────────────────────────────────────────────────────────┤
│                    Business Logic Layer                   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│  │ TextProcessor│ │AudioAnalyzer │ │RecordingPrompts│   │
│  └──────────────┘ └──────────────┘ └──────────────┘    │
├─────────────────────────────────────────────────────────┤
│              Voice Engine Abstraction Layer               │
│  ┌──────────────────────────────────────────────────┐   │
│  │              IVoiceEngine Interface                │   │
│  ├──────────┬──────────┬──────────┬─────────────────┤   │
│  │  Demo    │ElevenLabs│  Coqui   │  Local Engine   │   │
│  │ Engine   │ Adapter  │ Adapter  │    Adapter      │   │
│  └──────────┴──────────┴──────────┴─────────────────┘   │
├─────────────────────────────────────────────────────────┤
│                    Storage Layer                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                │
│  │ Local    │ │ IndexedDB│ │  Cloud   │                │
│  │ Storage  │ │ (Audio)  │ │  (API)   │                │
│  └──────────┘ └──────────┘ └──────────┘                │
└─────────────────────────────────────────────────────────┘
```

## Voice Engine Interface

The core abstraction is the `IVoiceEngine` interface:

```typescript
interface IVoiceEngine {
  readonly name: string;
  readonly capabilities: VoiceEngineCapabilities;
  
  createVoiceProfile(name: string, samples: RecordingSample[]): Promise<VoiceProfile>;
  getVoiceProfileStatus(id: string): Promise<VoiceProfile | null>;
  deleteVoiceProfile(id: string): Promise<boolean>;
  updateVoiceProfile(id: string, updates: Partial<VoiceProfile>): Promise<VoiceProfile>;
  analyzeRecording(blob: Blob, name: string): Promise<RecordingSample>;
  validateVoiceDataset(samples: RecordingSample[]): Promise<ValidationResult>;
  checkSpeakerConsistency(samples: RecordingSample[]): Promise<ConsistencyResult>;
  generateSpeech(text: string, profileId: string, settings: VoiceSettings, language: Language, format: AudioFormat): Promise<GenerationRequest>;
  getGenerationStatus(id: string): Promise<GenerationRequest | null>;
  cancelGeneration(id: string): Promise<boolean>;
  estimateSimilarity(original: Blob, generated: Blob): Promise<QualityReport>;
  runBenchmark(profileId: string, category: string): Promise<QualityReport>;
}
```

## Audio Processing Pipeline

```
Input Audio
    │
    ▼
┌──────────────┐
│   Decode     │ ← Web Audio API
└──────┬───────┘
       ▼
┌──────────────┐
│  Resample    │ ← If needed
└──────┬───────┘
       ▼
┌──────────────┐
│  RMS/Peak    │ ← Loudness analysis
└──────┬───────┘
       ▼
┌──────────────┐
│  Clipping    │ ← Distortion detection
│  Detection   │
└──────┬───────┘
       ▼
┌──────────────┐
│  Silence     │ ← VAD (Voice Activity Detection)
│  Detection   │
└──────┬───────┘
       ▼
┌──────────────┐
│  SNR/Noise   │ ← Signal-to-noise estimation
│  Estimation  │
└──────┬───────┘
       ▼
┌──────────────┐
│  Echo        │ ← Autocorrelation analysis
│  Detection   │
└──────┬───────┘
       ▼
┌──────────────┐
│  Quality     │ ← Composite score
│  Scoring     │
└──────────────┘
```

## Text Processing Pipeline

```
Input Text
    │
    ▼
┌──────────────┐
│  Language    │ ← Bengali/English/Mixed detection
│  Detection   │
└──────┬───────┘
       ▼
┌──────────────┐
│  Normalize   │ ← Unicode, whitespace, punctuation
│  Text        │
└──────┬───────┘
       ▼
┌──────────────┐
│  Preprocess  │ ← Numbers, dates, URLs, abbreviations
│  for TTS     │
└──────┬───────┘
       ▼
┌──────────────┐
│  Segment     │ ← Contextual sentence splitting
│  Long Text   │
└──────┬───────┘
       ▼
    Output Segments
```

## Data Flow

### Voice Profile Creation
1. User records/uploads audio samples
2. Each sample is analyzed individually (AudioAnalyzer)
3. Quality metrics are calculated for each sample
4. Dataset validation checks overall quality
5. Speaker consistency is verified
6. Voice profile is created with quality score

### Speech Generation
1. User enters text and selects settings
2. Text is processed (language detection, normalization, segmentation)
3. Generation request is sent to voice engine
4. Audio is generated chunk by chunk
5. Quality report is generated
6. Result is stored in audio library

## Security Architecture

- All API keys stored in environment variables (never in frontend)
- Consent required before voice enrollment
- Data deletion is permanent and complete
- File type validation on all uploads
- Size limits on all uploads
- Rate limiting on generation requests
