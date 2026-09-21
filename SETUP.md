# Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Microphone (for recording)

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd voiceclone-studio

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## First-Time Setup

1. **Open the application** in your browser
2. **Navigate to "Create Voice"** in the sidebar
3. **Accept the consent** terms confirming voice ownership
4. **Record or upload** at least 5 minutes of clean speech
5. **Review quality scores** for each recording
6. **Validate your dataset** and follow recommendations
7. **Create your voice profile** with a descriptive name
8. **Start generating speech** in the Text to Speech section

## Connecting a Voice Provider

### Using the Demo Engine (Default)
No configuration needed. The demo engine provides basic speech synthesis for testing.

### Using ElevenLabs
1. Get an API key from [elevenlabs.io](https://elevenlabs.io)
2. Add to `.env`:
   ```
   VITE_VOICE_PROVIDER=elevenlabs
   VITE_ELEVENLABS_API_KEY=your_key_here
   ```
3. Restart the application

### Using Coqui TTS (Local)
1. Install Coqui TTS server
2. Add to `.env`:
   ```
   VITE_VOICE_PROVIDER=coqui
   VITE_COQUI_BASE_URL=http://localhost:5002
   ```
3. Start the Coqui server
4. Restart the application

## Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The production build will be in the `dist/` directory.

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Recording | ✅ | ✅ | ✅ | ✅ |
| Audio Analysis | ✅ | ✅ | ✅ | ✅ |
| Speech Synthesis | ✅ | ✅ | ✅ | ✅ |
| File Upload | ✅ | ✅ | ✅ | ✅ |
| Bengali Text | ✅ | ✅ | ✅ | ✅ |

## Troubleshooting

### Microphone not working
- Allow microphone permissions in browser
- Check that no other app is using the microphone
- Try a different browser

### Audio not playing
- Check browser audio settings
- Ensure system volume is not muted
- Try a different audio format

### Build fails
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (must be 18+)
- Check for TypeScript errors: `npm run typecheck`
