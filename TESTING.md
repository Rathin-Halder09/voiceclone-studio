# Testing Guide

## Test Categories

### Unit Tests
Test individual functions and components in isolation.

#### Audio Validation
- Valid WAV file analysis
- Valid MP3 file analysis
- Corrupted file handling
- Empty file handling
- Oversized file rejection
- Non-audio file rejection

#### Text Processing
- Language detection (Bengali, English, Mixed)
- Text normalization
- Number detection and formatting
- Date detection and formatting
- URL detection
- Abbreviation expansion
- Text segmentation (short, medium, long)
- Chunk boundary detection

#### Quality Scoring
- RMS calculation accuracy
- Peak amplitude detection
- Clipping detection
- Silence ratio calculation
- SNR estimation
- Overall quality composite score

#### Settings Validation
- Range validation (speed, pitch, volume)
- Format validation
- Language validation
- Max length enforcement

### Integration Tests
Test component interactions.

#### Upload Recording Flow
1. Select audio file
2. File validation passes
3. Audio analysis completes
4. Quality report displays
5. Sample added to dataset

#### Create Profile Flow
1. Consent accepted
2. Multiple samples recorded/uploaded
3. Dataset validation runs
4. Speaker consistency checked
5. Profile created successfully
6. Profile appears in dashboard

#### Generate Speech Flow
1. Text entered
2. Language detected
3. Settings configured
4. Generation started
5. Progress displayed
6. Audio plays back
7. Download works

#### Delete Flow
1. Delete individual recording
2. Delete voice profile
3. Delete generated audio
4. Delete all data
5. Confirm data is gone

### End-to-End Tests
Test complete user workflows.

#### Complete Voice Creation Workflow
1. Open application
2. Navigate to Create Voice
3. Accept consent
4. Record 3+ samples
5. Review quality scores
6. Validate dataset
7. Create profile
8. Verify profile on dashboard

#### Bengali Speech Generation
1. Create voice profile
2. Navigate to TTS
3. Enter Bengali text
4. Select Bengali language
5. Generate speech
6. Verify audio plays
7. Download WAV file
8. Verify download

#### English Speech Generation
1. Create voice profile
2. Navigate to TTS
3. Enter English text
4. Select English language
5. Generate speech
6. Verify audio plays
7. Download MP3 file
8. Verify download

#### Mixed Language Generation
1. Create voice profile
2. Navigate to TTS
3. Enter mixed Bengali-English text
4. Auto-detect language
5. Generate speech
6. Verify audio plays
7. Check quality report

#### Long Text Generation
1. Create voice profile
2. Enter text > 5000 characters
3. Verify text segmentation
4. Generate speech
5. Monitor progress
6. Verify all chunks complete
7. Verify combined audio

#### Quality Lab Workflow
1. Create voice profile
2. Navigate to Quality Lab
3. Run Bengali benchmarks
4. Run English benchmarks
5. Run mixed benchmarks
6. Review results
7. Submit human ratings

### Failure Tests
Test error handling.

#### Bad Audio
- Upload corrupted audio file
- Verify error message displays
- Verify no crash

#### Noisy Audio
- Upload audio with heavy noise
- Verify quality score is low
- Verify warning displays

#### Empty Text
- Try to generate with empty text
- Verify validation error

#### Huge Text
- Enter text > max length
- Verify length warning

#### No Microphone
- Deny microphone permission
- Verify helpful error message

#### Provider Failure
- Simulate API timeout
- Verify retry option
- Verify error message

#### Network Failure
- Simulate offline state
- Verify graceful degradation

## Running Tests

```bash
# Type checking
npm run typecheck

# Build verification
npm run build

# Manual testing
npm run dev
# Then follow test scenarios above
```

## Test Data

### Bengali Test Sentences
```
আজ আবহাওয়া বেশ সুন্দর।
আমার নাম রথিন।
তুমি কি বিকেলে আমার সঙ্গে দেখা করতে পারবে?
```

### English Test Sentences
```
The quick brown fox jumps over the lazy dog.
My name is Rathin, and this is a test.
Could you please send me the document?
```

### Mixed Test Sentences
```
আজকে আমার একটা important meeting আছে।
Please আমাকে এই documentটা send করে দাও।
```

## Quality Acceptance Criteria

| Metric | Minimum | Target |
|--------|---------|--------|
| Build success | Required | Required |
| TypeScript errors | 0 | 0 |
| Recording analysis | Works | Accurate |
| Speech generation | Works | Natural |
| Audio playback | Works | Smooth |
| File download | Works | Correct format |
| Data deletion | Works | Complete |
| Error handling | No crashes | Helpful messages |
