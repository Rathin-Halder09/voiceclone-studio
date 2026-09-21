# Voice Dataset Guide

## Overview

The quality of your voice clone depends directly on the quality and diversity of your training recordings. This guide explains how to create an optimal voice dataset.

## Recording Requirements

### Minimum Dataset
- **5 minutes** of clean speech
- At least 3 separate recordings
- Mix of Bengali and English content

### Recommended Dataset
- **15-30 minutes** of diverse speech
- 10+ separate recordings
- Balanced Bengali/English/mixed content

### Advanced Dataset
- **30-60 minutes** of comprehensive speech
- 20+ separate recordings
- Full phonetic coverage in both languages

## Recording Environment

### Do
- Use a quiet room with soft furnishings (reduces echo)
- Keep a consistent distance from the microphone (15-30cm)
- Use a decent microphone (even phone microphones work if the room is quiet)
- Record in short segments (30-90 seconds each)
- Speak naturally at your normal pace

### Don't
- Record with background music, TV, or fan noise
- Record in echoey rooms (bathrooms, empty halls)
- Whisper or shout
- Record when you have a cold or sore throat
- Use Bluetooth headphones (latency and quality issues)

## Content Guidelines

### For English Coverage
Record sentences that include:
- Short statements (5-10 words)
- Long complex sentences (20+ words)
- Questions (yes/no and wh-questions)
- Numbers (dates, prices, phone numbers)
- Technical words
- Emotional content (excitement, concern, calm)
- Different punctuation (commas, periods, exclamation, question marks)

### For Bengali Coverage
Record sentences that include:
- বাংলা ছোট বাক্য (short Bengali sentences)
- বড় জটিল বাক্য (long complex sentences)
- প্রশ্নবোধক বাক্য (questions)
- সংখ্যা ও তারিখ (numbers and dates)
- আবেগপূর্ণ বাক্য (emotional sentences)
- Formal and conversational Bengali
- Words with complex consonant clusters (ক্ষ, ত্র, জ্ঞ, শ্র)

### For Mixed Language
Record natural code-switching:
- "আমার একটা important meeting আছে"
- "Please এই documentটা review করে দাও"
- Technical discussions mixing both languages

## Quality Targets

The application uses these engineering thresholds:

| Metric | Target | Description |
|--------|--------|-------------|
| Overall Quality | 80+ | Composite quality score per recording |
| SNR | 20+ dB | Signal-to-noise ratio |
| Clipping | <1% | Audio distortion |
| Silence Ratio | <30% | Non-speech content |
| Speaker Consistency | 90+ | All samples from same speaker |
| Phonetic Coverage | 85+ | Range of sounds covered |

## Iterative Improvement

The application provides targeted recommendations:

1. **Record initial dataset** → System analyzes coverage
2. **Review recommendations** → System identifies weaknesses
3. **Record targeted content** → Address specific gaps
4. **Re-analyze** → Verify improvement
5. **Repeat** → Until quality targets are met

## Common Issues

### "Background noise is too high"
- Move to a quieter room
- Turn off fans, AC, close windows
- Record during quieter times

### "Echo detected"
- Add soft furnishings (curtains, carpets)
- Record in a smaller room
- Move closer to the microphone

### "Volume too low"
- Move closer to the microphone
- Speak at normal volume
- Check microphone input levels

### "Speaker inconsistency detected"
- Ensure all recordings are YOUR voice
- Remove any recordings of other people
- Maintain consistent speaking style

## Tips for Best Results

1. **Record when your voice is clear** (not tired, not sick)
2. **Vary your content** - don't read the same type of text repeatedly
3. **Include natural pauses** - don't rush
4. **Be consistent** - same microphone, same environment when possible
5. **More is better** - but quality matters more than quantity
6. **Review quality scores** - re-record anything below 70/100
