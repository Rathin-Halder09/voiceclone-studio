# Environment Variables

Copy `.env.example` to `.env` and configure the following:

## Voice Provider Configuration

```env
# Voice Engine Provider
# Options: demo, elevenlabs, coqui, local
VITE_VOICE_PROVIDER=demo

# ElevenLabs Configuration (if using ElevenLabs)
VITE_ELEVENLABS_API_KEY=your_api_key_here
VITE_ELEVENLABS_BASE_URL=https://api.elevenlabs.io/v1

# Coqui TTS Configuration (if using Coqui)
VITE_COQUI_API_KEY=your_api_key_here
VITE_COQUI_BASE_URL=http://localhost:5002

# Local Engine Configuration
VITE_LOCAL_ENGINE_MODEL_PATH=./models/voice_model
```

## Application Settings

```env
# Maximum text length for generation (characters)
VITE_MAX_GENERATION_LENGTH=10000

# Maximum monthly usage (characters)
VITE_MAX_MONTHLY_USAGE=100000

# Maximum file upload size (bytes)
VITE_MAX_UPLOAD_SIZE=52428800

# Maximum recording duration (seconds)
VITE_MAX_RECORDING_DURATION=600
```

## Quality Targets

```env
# Dataset quality target (0-100)
VITE_QUALITY_TARGET=90

# Speaker consistency target (0-100)
VITE_SPEAKER_CONSISTENCY_TARGET=90

# Recording quality target (0-100)
VITE_RECORDING_QUALITY_TARGET=80

# Phonetic coverage target (0-100)
VITE_PHONETIC_COVERAGE_TARGET=85
```

## Security

```env
# Enable rate limiting
VITE_RATE_LIMIT_ENABLED=true

# Rate limit (requests per minute)
VITE_RATE_LIMIT_PER_MINUTE=30

# Enable request validation
VITE_REQUEST_VALIDATION=true
```

## Important Security Notes

- **NEVER** commit `.env` to version control
- **NEVER** expose API keys in frontend code directly
- Use server-side proxies for production API calls
- The `.env.example` file is safe to commit (contains no secrets)
- In production, use proper secret management (AWS Secrets Manager, Vault, etc.)
