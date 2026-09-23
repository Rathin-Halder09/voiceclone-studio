# VoiceClone Studio Pro

A production-ready, advanced personal voice-cloning application that clones the user's own voice from recordings and generates natural-sounding speech in Bengali, English, and mixed Bengali-English.

## Features

- **Personal Voice Cloning**: Create a voice profile from your own recordings
- **Multi-language Support**: Bengali, English, and mixed Bengali-English
- **Audio Analysis**: Comprehensive recording quality analysis (RMS, SNR, clipping, echo, etc.)
- **Guided Recording**: Phonetic-optimized prompts for maximum voice coverage
- **Quality Lab**: Benchmark tests, A/B comparison, and human evaluation
- **Dataset Intelligence**: Automatic coverage analysis and targeted improvement recommendations
- **Speaker Consistency**: Verify all recordings belong to the same speaker
- **Privacy First**: Full data control with complete deletion capabilities
- **Provider Abstraction**: Switch between voice engines without changing the UI

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck
```

## Architecture

```
src/
├── App.tsx              # Main application with all pages
├── index.css            # Global styles
├── main.tsx             # Entry point
├── types/
│   └── index.ts         # TypeScript type definitions
├── store/
│   └── index.ts         # Zustand state management
├── voice-engine/
│   └── index.ts         # Voice engine abstraction layer
└── index.css            # Tailwind + custom styles
```

## Voice Engine Architecture

The application uses a provider abstraction layer:

```
IVoiceEngine (Interface)
├── DemoVoiceEngine (Local/Demo)
├── ElevenLabsAdapter (Future)
├── CoquiAdapter (Future)
└── LocalEngineAdapter (Future)
```

### Interface Methods

- `createVoiceProfile()` - Create a new voice profile from recordings
- `analyzeRecording()` - Analyze audio quality metrics
- `validateVoiceDataset()` - Validate the complete dataset
- `generateSpeech()` - Generate speech from text
- `estimateSimilarity()` - Compare original vs generated audio
- `deleteVoiceProfile()` - Remove a voice profile
- `getVoiceProfileStatus()` - Check profile status

## Configuration

Copy `.env.example` to `.env` and configure your voice provider:

```bash
cp .env.example .env
```

See [ENVIRONMENT.md](./ENVIRONMENT.md) for detailed configuration options.

## Documentation

- [SETUP.md](./SETUP.md) - Installation and setup guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture details
- [VOICE_DATASET_GUIDE.md](./VOICE_DATASET_GUIDE.md) - How to create optimal recordings
- [TESTING.md](./TESTING.md) - Testing guide
- [SECURITY.md](./SECURITY.md) - Security considerations
- [PRIVACY.md](./PRIVACY.md) - Privacy policy and data handling
- [ENVIRONMENT.md](./ENVIRONMENT.md) - Environment variable reference

## Important Notes

- This application is designed for **personal voice cloning only**
- Users must confirm ownership of their voice before creating a profile
- Voice recordings are treated as sensitive biometric data
- Quality scores are engineering estimates, not guarantees of human-perceived quality
- The system does not claim "100% identical" voice reproduction

## License

Private - All rights reserved.
