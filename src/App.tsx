import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppStore } from './store';
import { TextProcessor, RecordingPrompts, BenchmarkSuites, AudioAnalyzer } from './voice-engine';
import type { Language, VoiceSettings, VoiceStyle, AudioFormat, RecordingSample, HumanRating } from './types';
import {
  Mic, MicOff, Upload, Play, Pause, Square, Download, Trash2, Plus,
  Settings, Shield, HelpCircle, BarChart3, BookOpen, Volume2,
  CheckCircle, AlertCircle, XCircle, ChevronRight, Activity,
  FileAudio, Globe, Languages, Zap, Star, RefreshCw, X, Menu,
  Home, Radio, Library, Award, User, Clock, HardDrive, TrendingUp,
  AlertTriangle, Info, ChevronDown, ChevronUp, Search, Filter,
  SkipForward, SkipBack, VolumeX, Eye, EyeOff, Lock, Unlock
} from 'lucide-react';

// ============================================================
// MAIN APP COMPONENT
// ============================================================
export default function App() {
  const { currentSection, setSection, notifications, removeNotification } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'voice-studio', label: 'Voice Studio', icon: Radio },
    { id: 'create-voice', label: 'Create Voice', icon: User },
    { id: 'text-to-speech', label: 'Text to Speech', icon: Volume2 },
    { id: 'quality-lab', label: 'Quality Lab', icon: Award },
    { id: 'audio-library', label: 'Audio Library', icon: Library },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'privacy', label: 'Privacy & Consent', icon: Shield },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 flex-shrink-0`}>
        <div className="p-4 border-b border-gray-800 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white">
            <Menu size={20} />
          </button>
          {sidebarOpen && (
            <div>
              <h1 className="text-lg font-bold text-white">VoiceClone</h1>
              <p className="text-xs text-gray-500">Studio Pro</p>
            </div>
          )}
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                currentSection === item.id
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <item.icon size={18} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-800">
            <div className="text-xs text-gray-500">
              <p>Engine: Demo v1.0</p>
              <p className="mt-1">Personal Voice Cloning</p>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map(n => (
            <div key={n.id} className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
              n.type === 'success' ? 'bg-green-900/90 border-green-700 text-green-200' :
              n.type === 'error' ? 'bg-red-900/90 border-red-700 text-red-200' :
              n.type === 'warning' ? 'bg-yellow-900/90 border-yellow-700 text-yellow-200' :
              'bg-blue-900/90 border-blue-700 text-blue-200'
            }`}>
              {n.type === 'success' ? <CheckCircle size={16} /> :
               n.type === 'error' ? <XCircle size={16} /> :
               n.type === 'warning' ? <AlertTriangle size={16} /> :
               <Info size={16} />}
              <span className="text-sm">{n.message}</span>
              <button onClick={() => removeNotification(n.id)} className="ml-2 opacity-60 hover:opacity-100">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Page Content */}
        <div className="p-6 max-w-7xl mx-auto">
          {currentSection === 'dashboard' && <DashboardPage />}
          {currentSection === 'voice-studio' && <VoiceStudioPage />}
          {currentSection === 'create-voice' && <CreateVoicePage />}
          {currentSection === 'text-to-speech' && <TextToSpeechPage />}
          {currentSection === 'quality-lab' && <QualityLabPage />}
          {currentSection === 'audio-library' && <AudioLibraryPage />}
          {currentSection === 'settings' && <SettingsPage />}
          {currentSection === 'privacy' && <PrivacyPage />}
          {currentSection === 'help' && <HelpPage />}
        </div>
      </main>
    </div>
  );
}

// ============================================================
// DASHBOARD PAGE
// ============================================================
function DashboardPage() {
  const { profiles, samples, audioLibrary, activeProfileId, generations, setSection } = useAppStore();
  const activeProfile = profiles.find(p => p.id === activeProfileId);
  const totalDuration = samples.reduce((sum, s) => sum + s.duration, 0);
  const avgQuality = samples.length > 0 ? samples.reduce((sum, s) => sum + s.overallQuality, 0) / samples.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="text-gray-400 mt-1">Overview of your voice cloning workspace</p>
        </div>
        <button
          onClick={() => setSection('create-voice')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Plus size={16} /> New Voice Profile
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          title="Voice Profile"
          value={activeProfile ? activeProfile.name : 'None'}
          subtitle={activeProfile ? `Quality: ${activeProfile.qualityScore}/100` : 'Create a profile to begin'}
          icon={<User size={20} />}
          color={activeProfile ? 'green' : 'gray'}
        />
        <StatusCard
          title="Training Data"
          value={`${samples.length} samples`}
          subtitle={`${Math.round(totalDuration / 60)} min recorded`}
          icon={<FileAudio size={20} />}
          color={samples.length >= 5 ? 'green' : 'yellow'}
        />
        <StatusCard
          title="Generations"
          value={`${audioLibrary.length} files`}
          subtitle={`${generations.length} total requests`}
          icon={<Volume2 size={20} />}
          color="blue"
        />
        <StatusCard
          title="Dataset Quality"
          value={`${Math.round(avgQuality)}/100`}
          subtitle={avgQuality >= 80 ? 'Good quality' : 'Needs improvement'}
          icon={<Award size={20} />}
          color={avgQuality >= 80 ? 'green' : 'yellow'}
        />
      </div>

      {/* Voice Profile Details */}
      {activeProfile && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Active Voice Profile</h3>
            <span className="px-3 py-1 bg-green-900/50 text-green-400 rounded-full text-xs font-medium border border-green-700/50">
              Ready
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase">Languages</p>
              <p className="text-sm text-gray-200 mt-1">{activeProfile.languages.join(', ')}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Style</p>
              <p className="text-sm text-gray-200 mt-1 capitalize">{activeProfile.style}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Samples</p>
              <p className="text-sm text-gray-200 mt-1">{activeProfile.sampleCount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Total Duration</p>
              <p className="text-sm text-gray-200 mt-1">{Math.round(activeProfile.totalDuration / 60)} min</p>
            </div>
          </div>
          
          {/* Quality Bars */}
          <div className="mt-6 space-y-3">
            <QualityBar label="English Phonetic Coverage" value={activeProfile.phoneticCoverage.englishPhonemes} />
            <QualityBar label="Bengali Phonetic Coverage" value={activeProfile.phoneticCoverage.bengaliPhonemes} />
            <QualityBar label="Speaker Consistency" value={activeProfile.speakerConsistency} />
            <QualityBar label="Overall Quality" value={activeProfile.qualityScore} />
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickAction
          title="Record Voice"
          description="Add new training samples"
          icon={<Mic size={24} />}
          onClick={() => setSection('create-voice')}
          color="indigo"
        />
        <QuickAction
          title="Generate Speech"
          description="Convert text to speech"
          icon={<Volume2 size={24} />}
          onClick={() => setSection('text-to-speech')}
          color="purple"
        />
        <QuickAction
          title="Quality Lab"
          description="Test and compare voice quality"
          icon={<Award size={24} />}
          onClick={() => setSection('quality-lab')}
          color="emerald"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Generations</h3>
        {audioLibrary.length === 0 ? (
          <p className="text-gray-500 text-sm">No generations yet. Create a voice profile and generate speech to see results here.</p>
        ) : (
          <div className="space-y-3">
            {audioLibrary.slice(0, 5).map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileAudio size={16} className="text-indigo-400" />
                  <div>
                    <p className="text-sm text-gray-200 truncate max-w-md">{item.text}</p>
                    <p className="text-xs text-gray-500">{item.language} • {item.duration?.toFixed(1)}s • {item.format.toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                  <QualityBadge score={item.qualityScore} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// VOICE STUDIO PAGE
// ============================================================
function VoiceStudioPage() {
  const { profiles, activeProfileId, setActiveProfile, samples, deleteProfile } = useAppStore();
  const activeProfile = profiles.find(p => p.id === activeProfileId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Voice Studio</h2>
        <p className="text-gray-400 mt-1">Manage your voice profiles and view status</p>
      </div>

      {/* Profile List */}
      <div className="space-y-4">
        {profiles.length === 0 ? (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
            <User size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-300">No Voice Profiles</h3>
            <p className="text-gray-500 mt-2">Create your first voice profile to get started.</p>
          </div>
        ) : (
          profiles.map(profile => (
            <div
              key={profile.id}
              className={`bg-gray-900 rounded-xl border p-6 cursor-pointer transition-all ${
                profile.id === activeProfileId ? 'border-indigo-500/50 ring-1 ring-indigo-500/30' : 'border-gray-800 hover:border-gray-700'
              }`}
              onClick={() => setActiveProfile(profile.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    profile.status === 'ready' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'
                  }`}>
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{profile.name}</h3>
                    <p className="text-sm text-gray-400">v{profile.version} • {profile.languages.join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <QualityBadge score={profile.qualityScore} />
                  {profile.id === activeProfileId && (
                    <span className="px-2 py-1 bg-indigo-900/50 text-indigo-400 rounded text-xs">Active</span>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteProfile(profile.id); }}
                    className="p-1.5 text-gray-500 hover:text-red-400 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                <MiniStat label="Samples" value={profile.sampleCount.toString()} />
                <MiniStat label="Duration" value={`${Math.round(profile.totalDuration / 60)}m`} />
                <MiniStat label="Consistency" value={`${profile.speakerConsistency}%`} />
                <MiniStat label="Style" value={profile.style} />
                <MiniStat label="Status" value={profile.status} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Dataset Overview */}
      {samples.length > 0 && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Training Dataset</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <MiniStat label="Total Samples" value={samples.length.toString()} />
            <MiniStat label="Total Duration" value={`${Math.round(samples.reduce((s, r) => s + r.duration, 0) / 60)}m`} />
            <MiniStat label="Avg Quality" value={`${Math.round(samples.reduce((s, r) => s + r.overallQuality, 0) / samples.length)}/100`} />
            <MiniStat label="Formats" value={new Set(samples.map(s => s.format)).size.toString()} />
          </div>
          
          <div className="space-y-2">
            {samples.map(sample => (
              <div key={sample.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileAudio size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-300">{sample.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500">{sample.duration.toFixed(1)}s</span>
                  <QualityBadge score={sample.overallQuality} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// CREATE VOICE PAGE (Voice Enrollment)
// ============================================================
function CreateVoicePage() {
  const { samples, addSample, removeSample, createProfile, consent, setConsent, engine, setDatasetValidation, setSpeakerConsistency, datasetValidation, speakerConsistency, isLoading } = useAppStore();
  const [step, setStep] = useState(1);
  const [profileName, setProfileName] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [promptLanguage, setPromptLanguage] = useState<Language>('english');
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const prompts = RecordingPrompts.getPrompts(promptLanguage);
  const totalDuration = samples.reduce((sum, s) => sum + s.duration, 0);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordingBlob(blob);
        stream.getTracks().forEach(t => t.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
    } catch (err) {
      useAppStore.getState().addNotification('error', 'Microphone access denied. Please allow microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const analyzeAndAddRecording = async () => {
    if (!recordingBlob) return;
    setAnalyzing(true);
    try {
      const sample = await engine.analyzeRecording(recordingBlob, `Sample #${samples.length + 1}`);
      addSample(sample);
      setRecordingBlob(null);
      setRecordingTime(0);
      useAppStore.getState().addNotification('success', `Recording analyzed: Quality ${sample.overallQuality}/100`);
    } catch (err) {
      useAppStore.getState().addNotification('error', `Analysis failed: ${(err as Error).message}`);
    }
    setAnalyzing(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    setAnalyzing(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('audio/')) {
        useAppStore.getState().addNotification('error', `${file.name} is not an audio file.`);
        continue;
      }
      if (file.size > 50 * 1024 * 1024) {
        useAppStore.getState().addNotification('error', `${file.name} is too large (max 50MB).`);
        continue;
      }
      try {
        const sample = await engine.analyzeRecording(file, file.name);
        addSample(sample);
        useAppStore.getState().addNotification('success', `${file.name} analyzed: Quality ${sample.overallQuality}/100`);
      } catch (err) {
        useAppStore.getState().addNotification('error', `Failed to analyze ${file.name}: ${(err as Error).message}`);
      }
    }
    setAnalyzing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const runValidation = async () => {
    if (samples.length === 0) return;
    setAnalyzing(true);
    const validation = await engine.validateVoiceDataset(samples);
    setDatasetValidation(validation);
    const consistency = await engine.checkSpeakerConsistency(samples);
    setSpeakerConsistency(consistency);
    setAnalyzing(false);
  };

  const handleCreateProfile = async () => {
    if (!profileName.trim()) {
      useAppStore.getState().addNotification('error', 'Please enter a profile name.');
      return;
    }
    if (!consentChecked) {
      useAppStore.getState().addNotification('error', 'Please accept the consent terms.');
      return;
    }
    const profile = await createProfile(profileName);
    if (profile) {
      setStep(5);
      setConsent({
        accepted: true,
        timestamp: new Date(),
        version: '1.0',
        details: 'User confirmed ownership of voice recordings'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Create Voice Profile</h2>
        <p className="text-gray-400 mt-1">Record or upload your voice to create a personal voice clone</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {['Consent', 'Record', 'Validate', 'Create', 'Complete'].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step > i + 1 ? 'bg-green-600 text-white' :
              step === i + 1 ? 'bg-indigo-600 text-white' :
              'bg-gray-800 text-gray-500'
            }`}>
              {step > i + 1 ? <CheckCircle size={14} /> : i + 1}
            </div>
            <span className={`text-xs hidden md:inline ${step === i + 1 ? 'text-indigo-400' : 'text-gray-500'}`}>{label}</span>
            {i < 4 && <ChevronRight size={14} className="text-gray-700" />}
          </div>
        ))}
      </div>

      {/* Step 1: Consent */}
      {step === 1 && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
          <Shield size={32} className="text-indigo-400 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-4">Consent & Authorization</h3>
          <div className="space-y-4 text-sm text-gray-300">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <p className="font-medium text-white mb-2">Important: Voice Data Authorization</p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2"><CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" /> You confirm that you are recording your OWN voice</li>
                <li className="flex items-start gap-2"><CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" /> You have authorization to create this voice profile</li>
                <li className="flex items-start gap-2"><CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" /> You understand that voice data is sensitive biometric data</li>
                <li className="flex items-start gap-2"><CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" /> You can delete all data at any time</li>
                <li className="flex items-start gap-2"><CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" /> Your recordings will be processed for voice profile creation only</li>
              </ul>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-gray-200">I confirm that I own this voice or have authorization to create this voice profile.</span>
            </label>
          </div>
          <button
            onClick={() => consentChecked && setStep(2)}
            disabled={!consentChecked}
            className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium"
          >
            Continue to Recording
          </button>
        </div>
      )}

      {/* Step 2: Record */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recording Guidance</h3>
            <div className="flex items-center gap-4 mb-4">
              <select
                value={promptLanguage}
                onChange={(e) => { setPromptLanguage(e.target.value as Language); setCurrentPrompt(0); }}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200"
              >
                <option value="english">English Prompts</option>
                <option value="bengali">Bengali Prompts</option>
                <option value="mixed">Mixed Bengali-English</option>
              </select>
              <span className="text-sm text-gray-400">
                Prompt {currentPrompt + 1} of {prompts.length}
              </span>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 mb-6">
              <p className="text-lg text-gray-200 leading-relaxed">{prompts[currentPrompt]}</p>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => setCurrentPrompt(Math.max(0, currentPrompt - 1))}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => setCurrentPrompt(Math.min(prompts.length - 1, currentPrompt + 1))}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Recording Controls */}
            <div className="flex flex-col items-center gap-4">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${
                isRecording ? 'border-red-500 bg-red-900/30 animate-pulse' : 'border-gray-600 bg-gray-800'
              }`}>
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className="w-16 h-16 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white"
                >
                  {isRecording ? <Square size={24} /> : <Mic size={24} />}
                </button>
              </div>
              <p className="text-sm text-gray-400">
                {isRecording ? `Recording... ${recordingTime}s` : 'Click to start recording'}
              </p>
              
              {recordingBlob && !isRecording && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={analyzeAndAddRecording}
                    disabled={analyzing}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                  >
                    {analyzing ? 'Analyzing...' : 'Save & Analyze'}
                  </button>
                  <button
                    onClick={() => { setRecordingBlob(null); setRecordingTime(0); }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
                  >
                    Discard
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Upload Option */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Upload Recordings</h3>
            <p className="text-sm text-gray-400 mb-4">Upload existing audio recordings. Supported formats: WAV, MP3, OGG, FLAC, WebM</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={analyzing}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 rounded-lg text-sm flex items-center gap-2"
            >
              <Upload size={16} />
              {analyzing ? 'Processing...' : 'Choose Audio Files'}
            </button>
          </div>

          {/* Dataset Status */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Dataset Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <MiniStat label="Samples" value={samples.length.toString()} />
              <MiniStat label="Duration" value={`${Math.round(totalDuration / 60)}m ${Math.round(totalDuration % 60)}s`} />
              <MiniStat label="Target" value="5-30 min" />
              <MiniStat label="Progress" value={`${Math.min(100, Math.round(totalDuration / 1800 * 100))}%`} />
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all"
                style={{ width: `${Math.min(100, totalDuration / 1800 * 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">
              Minimum: 5 min • Good: 15-30 min • Advanced: 30-60 min
            </p>

            {/* Sample List */}
            {samples.length > 0 && (
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                {samples.map((sample, idx) => (
                  <div key={sample.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-6">#{idx + 1}</span>
                      <span className="text-sm text-gray-300">{sample.name}</span>
                      <span className="text-xs text-gray-500">{sample.duration.toFixed(1)}s</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <QualityBadge score={sample.overallQuality} />
                      {sample.issues.length > 0 && <AlertTriangle size={14} className="text-yellow-400" />}
                      <button onClick={() => removeSample(sample.id)} className="text-gray-500 hover:text-red-400">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sample Quality Report */}
          {samples.length > 0 && (
            <SampleQualityReport sample={samples[samples.length - 1]} />
          )}

          <button
            onClick={() => { runValidation(); setStep(3); }}
            disabled={samples.length < 1}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium"
          >
            Continue to Validation
          </button>
        </div>
      )}

      {/* Step 3: Validate */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Dataset Validation Report</h3>
            
            {analyzing ? (
              <div className="flex items-center gap-3 text-gray-400">
                <RefreshCw size={16} className="animate-spin" />
                <span>Analyzing dataset...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Validation Results */}
                {datasetValidation && (
                  <div>
                    <div className={`flex items-center gap-2 mb-3 ${datasetValidation.valid ? 'text-green-400' : 'text-yellow-400'}`}>
                      {datasetValidation.valid ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                      <span className="font-medium">{datasetValidation.valid ? 'Dataset is valid' : 'Issues detected'}</span>
                    </div>
                    
                    {datasetValidation.issues.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {datasetValidation.issues.map((issue, i) => (
                          <div key={i} className="flex items-start gap-2 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
                            <AlertTriangle size={14} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-yellow-200">{issue}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {datasetValidation.recommendations.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Recommendations for Improvement:</h4>
                        <div className="space-y-2">
                          {datasetValidation.recommendations.map((rec, i) => (
                            <div key={i} className={`p-3 rounded-lg border ${
                              rec.priority === 'high' ? 'bg-red-900/20 border-red-700/30' :
                              rec.priority === 'medium' ? 'bg-yellow-900/20 border-yellow-700/30' :
                              'bg-blue-900/20 border-blue-700/30'
                            }`}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-200">{rec.description}</span>
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  rec.priority === 'high' ? 'bg-red-800 text-red-200' :
                                  rec.priority === 'medium' ? 'bg-yellow-800 text-yellow-200' :
                                  'bg-blue-800 text-blue-200'
                                }`}>{rec.priority}</span>
                              </div>
                              <p className="text-xs text-gray-400">{rec.prompt}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Speaker Consistency */}
                {speakerConsistency && (
                  <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Speaker Consistency</h4>
                    <div className="flex items-center gap-4">
                      <div className={`text-2xl font-bold ${speakerConsistency.consistent ? 'text-green-400' : 'text-yellow-400'}`}>
                        {speakerConsistency.avgSimilarity}%
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">
                          {speakerConsistency.consistent ? 'All recordings appear to be from the same speaker.' : 'Some recordings may be from a different speaker.'}
                        </p>
                        {speakerConsistency.outliers.length > 0 && (
                          <p className="text-xs text-yellow-400 mt-1">
                            {speakerConsistency.outliers.length} recording(s) have low similarity.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setStep(2)} className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg font-medium">
              Back to Recording
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
            >
              Continue to Profile Creation
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Create Profile */}
      {step === 4 && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
          <h3 className="text-xl font-semibold text-white mb-6">Create Voice Profile</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Profile Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="e.g., My Voice v1"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Profile Summary</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Samples:</span> <span className="text-gray-200">{samples.length}</span></div>
                <div><span className="text-gray-500">Duration:</span> <span className="text-gray-200">{Math.round(totalDuration / 60)}m {Math.round(totalDuration % 60)}s</span></div>
                <div><span className="text-gray-500">Avg Quality:</span> <span className="text-gray-200">{Math.round(samples.reduce((s, r) => s + r.overallQuality, 0) / (samples.length || 1))}/100</span></div>
                <div><span className="text-gray-500">Languages:</span> <span className="text-gray-200">Bengali, English, Mixed</span></div>
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-300">I confirm that I own this voice or have authorization to create this voice profile.</span>
            </label>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button onClick={() => setStep(3)} className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg font-medium">
              Back
            </button>
            <button
              onClick={handleCreateProfile}
              disabled={isLoading || !consentChecked}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium flex items-center gap-2"
            >
              {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Zap size={16} />}
              Create Voice Profile
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Complete */}
      {step === 5 && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
          <CheckCircle size={64} className="mx-auto text-green-400 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Voice Profile Created!</h3>
          <p className="text-gray-400 mb-6">Your personal voice profile is ready to use.</p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => useAppStore.getState().setSection('text-to-speech')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
            >
              Start Generating Speech
            </button>
            <button
              onClick={() => useAppStore.getState().setSection('quality-lab')}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg font-medium"
            >
              Run Quality Tests
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// TEXT TO SPEECH PAGE
// ============================================================
function TextToSpeechPage() {
  const { profiles, activeProfileId, generateSpeech, currentGeneration, isLoading, settings } = useAppStore();
  const [text, setText] = useState('');
  const [language, setLanguage] = useState<Language | 'auto'>('auto');
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    speed: 1.0,
    pitch: 1.0,
    expressiveness: 60,
    volume: 80,
    pauseLength: 50,
    pronunciationStrength: 70,
    style: 'natural',
    stability: 70,
    similarityBoost: 80
  });
  const [format, setFormat] = useState<AudioFormat>('wav');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const activeProfile = profiles.find(p => p.id === activeProfileId);
  const detectedLanguage = text ? TextProcessor.detectLanguage(text) : null;
  const effectiveLanguage = language === 'auto' ? (detectedLanguage || 'english') : language;

  const handleGenerate = async () => {
    if (!text.trim()) {
      useAppStore.getState().addNotification('error', 'Please enter text to generate speech.');
      return;
    }
    if (!activeProfile) {
      useAppStore.getState().addNotification('error', 'No active voice profile. Please create one first.');
      return;
    }
    if (text.length > settings.maxGenerationLength) {
      useAppStore.getState().addNotification('error', `Text exceeds maximum length of ${settings.maxGenerationLength} characters.`);
      return;
    }
    await generateSpeech(text, effectiveLanguage, voiceSettings, format);
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Text to Speech</h2>
        <p className="text-gray-400 mt-1">Generate natural speech from text using your cloned voice</p>
      </div>

      {!activeProfile && (
        <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle size={20} className="text-yellow-400" />
          <div>
            <p className="text-sm text-yellow-200">No active voice profile</p>
            <p className="text-xs text-yellow-400/70">Create a voice profile first to generate speech.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Text Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Text Input</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{text.length} / {settings.maxGenerationLength}</span>
                {detectedLanguage && (
                  <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400">
                    Detected: {detectedLanguage}
                  </span>
                )}
              </div>
            </div>
            
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text in Bengali, English, or mixed Bengali-English...&#10;&#10;Example: আজ আমি কলকাতায় যাচ্ছি এবং পরে একটি important meeting আছে.&#10;&#10;Example: The quick brown fox jumps over the lazy dog."
              className="w-full h-64 bg-gray-800 border border-gray-700 rounded-lg p-4 text-gray-200 placeholder-gray-500 resize-none focus:border-indigo-500 focus:outline-none text-sm leading-relaxed"
            />
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200"
                >
                  <option value="auto">Auto Detect</option>
                  <option value="bengali">Bengali</option>
                  <option value="english">English</option>
                  <option value="mixed">Mixed</option>
                </select>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as AudioFormat)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200"
                >
                  <option value="wav">WAV</option>
                  <option value="mp3">MP3</option>
                </select>
              </div>
              
              <button
                onClick={handleGenerate}
                disabled={isLoading || !activeProfile || !text.trim()}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium flex items-center gap-2"
              >
                {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Volume2 size={16} />}
                {isLoading ? 'Generating...' : 'Generate Speech'}
              </button>
            </div>
          </div>

          {/* Generation Progress */}
          {currentGeneration && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-300">Generation Status</h3>
                <span className={`text-xs px-2 py-1 rounded ${
                  currentGeneration.status === 'complete' ? 'bg-green-900/50 text-green-400' :
                  currentGeneration.status === 'failed' ? 'bg-red-900/50 text-red-400' :
                  'bg-blue-900/50 text-blue-400'
                }`}>
                  {currentGeneration.status}
                </span>
              </div>
              
              <div className="w-full bg-gray-800 rounded-full h-2 mb-3">
                <div
                  className="h-2 rounded-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${currentGeneration.progress}%` }}
                />
              </div>
              
              {currentGeneration.chunks && (
                <div className="flex items-center gap-1">
                  {currentGeneration.chunks.map((chunk, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${
                        chunk.status === 'complete' ? 'bg-green-500' :
                        chunk.status === 'generating' ? 'bg-indigo-500 animate-pulse' :
                        'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-2">
                {currentGeneration.status === 'generating' && `Processing chunk ${currentGeneration.chunks?.filter(c => c.status === 'complete').length || 0} of ${currentGeneration.chunks?.length || 0}`}
                {currentGeneration.status === 'combining' && 'Combining audio segments...'}
                {currentGeneration.status === 'quality_check' && 'Running quality checks...'}
                {currentGeneration.status === 'complete' && 'Generation complete!'}
              </p>
            </div>
          )}

          {/* Audio Player */}
          {currentGeneration?.audioUrl && currentGeneration.status === 'complete' && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Generated Audio</h3>
              <audio ref={audioRef} src={currentGeneration.audioUrl} onEnded={() => setIsPlaying(false)} />
              
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={togglePlayback}
                  className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center text-white"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <div className="flex-1">
                  <div className="h-8 bg-gray-800 rounded-lg flex items-center px-3">
                    <div className="flex items-end gap-0.5 h-6">
                      {Array.from({ length: 50 }, (_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-indigo-500/60 rounded-full"
                          style={{ height: `${Math.random() * 100}%`, minHeight: '2px' }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-400">
                  {currentGeneration.duration?.toFixed(1)}s
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <a
                  href={currentGeneration.audioUrl}
                  download={`VoiceClone_${new Date().toISOString().split('T')[0]}_${effectiveLanguage}.${format}`}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 rounded-lg text-sm flex items-center gap-2"
                >
                  <Download size={14} /> Download {format.toUpperCase()}
                </a>
                {currentGeneration.qualityReport && (
                  <div className="flex items-center gap-2 ml-auto">
                    <QualityBadge score={currentGeneration.qualityReport.overall} />
                    <span className="text-xs text-gray-500">Quality Score</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings Panel */}
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Voice Settings</h3>
            
            <div className="space-y-4">
              <SliderControl
                label="Speed"
                value={voiceSettings.speed}
                min={0.5}
                max={2.0}
                step={0.1}
                onChange={(v) => setVoiceSettings({ ...voiceSettings, speed: v })}
                displayValue={`${voiceSettings.speed}x`}
              />
              <SliderControl
                label="Pitch"
                value={voiceSettings.pitch}
                min={0.5}
                max={2.0}
                step={0.1}
                onChange={(v) => setVoiceSettings({ ...voiceSettings, pitch: v })}
                displayValue={`${voiceSettings.pitch}x`}
              />
              <SliderControl
                label="Volume"
                value={voiceSettings.volume}
                min={0}
                max={100}
                step={1}
                onChange={(v) => setVoiceSettings({ ...voiceSettings, volume: v })}
                displayValue={`${voiceSettings.volume}%`}
              />
              <SliderControl
                label="Stability"
                value={voiceSettings.stability}
                min={0}
                max={100}
                step={1}
                onChange={(v) => setVoiceSettings({ ...voiceSettings, stability: v })}
                displayValue={`${voiceSettings.stability}%`}
              />
              <SliderControl
                label="Similarity Boost"
                value={voiceSettings.similarityBoost}
                min={0}
                max={100}
                step={1}
                onChange={(v) => setVoiceSettings({ ...voiceSettings, similarityBoost: v })}
                displayValue={`${voiceSettings.similarityBoost}%`}
              />
              
              <div>
                <label className="block text-xs text-gray-400 mb-2">Style</label>
                <select
                  value={voiceSettings.style}
                  onChange={(e) => setVoiceSettings({ ...voiceSettings, style: e.target.value as VoiceStyle })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200"
                >
                  <option value="natural">Natural</option>
                  <option value="conversational">Conversational</option>
                  <option value="narration">Narration</option>
                  <option value="news">News</option>
                  <option value="presentation">Presentation</option>
                  <option value="calm">Calm</option>
                  <option value="energetic">Energetic</option>
                </select>
              </div>

              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-200"
              >
                {showAdvanced ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                Advanced Settings
              </button>

              {showAdvanced && (
                <div className="space-y-4 pt-2 border-t border-gray-800">
                  <SliderControl
                    label="Expressiveness"
                    value={voiceSettings.expressiveness}
                    min={0}
                    max={100}
                    step={1}
                    onChange={(v) => setVoiceSettings({ ...voiceSettings, expressiveness: v })}
                    displayValue={`${voiceSettings.expressiveness}%`}
                  />
                  <SliderControl
                    label="Pause Length"
                    value={voiceSettings.pauseLength}
                    min={0}
                    max={100}
                    step={1}
                    onChange={(v) => setVoiceSettings({ ...voiceSettings, pauseLength: v })}
                    displayValue={`${voiceSettings.pauseLength}%`}
                  />
                  <SliderControl
                    label="Pronunciation Strength"
                    value={voiceSettings.pronunciationStrength}
                    min={0}
                    max={100}
                    step={1}
                    onChange={(v) => setVoiceSettings({ ...voiceSettings, pronunciationStrength: v })}
                    displayValue={`${voiceSettings.pronunciationStrength}%`}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Active Profile Info */}
          {activeProfile && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Active Profile</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center">
                  <User size={18} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{activeProfile.name}</p>
                  <p className="text-xs text-gray-500">Quality: {activeProfile.qualityScore}/100</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// QUALITY LAB PAGE
// ============================================================
function QualityLabPage() {
  const { profiles, activeProfileId, samples, benchmarkResults, addBenchmarkResult, engine, addHumanRating } = useAppStore();
  const [activeTab, setActiveTab] = useState<'benchmarks' | 'compare' | 'ratings'>('benchmarks');
  const [runningBenchmark, setRunningBenchmark] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const activeProfile = profiles.find(p => p.id === activeProfileId);

  const runBenchmarks = async () => {
    if (!activeProfile) return;
    setRunningBenchmark(true);
    
    const allTests = [
      ...BenchmarkSuites.bengaliBenchmark,
      ...BenchmarkSuites.englishBenchmark,
      ...BenchmarkSuites.mixedBenchmark
    ];
    
    for (const test of allTests) {
      const report = await engine.runBenchmark(activeProfile.id, test.category);
      addBenchmarkResult({
        id: crypto.randomUUID(),
        category: test.category,
        text: test.text,
        language: TextProcessor.detectLanguage(test.text),
        qualityReport: report,
        createdAt: new Date()
      });
    }
    
    setRunningBenchmark(false);
    useAppStore.getState().addNotification('success', 'All benchmarks completed!');
  };

  const filteredResults = selectedCategory === 'all' 
    ? benchmarkResults 
    : benchmarkResults.filter(r => r.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Quality Lab</h2>
          <p className="text-gray-400 mt-1">Test, compare, and evaluate voice quality</p>
        </div>
        <button
          onClick={runBenchmarks}
          disabled={runningBenchmark || !activeProfile}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg text-sm font-medium flex items-center gap-2"
        >
          {runningBenchmark ? <RefreshCw size={16} className="animate-spin" /> : <Zap size={16} />}
          {runningBenchmark ? 'Running...' : 'Run All Benchmarks'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-900 rounded-lg p-1 border border-gray-800 w-fit">
        {['benchmarks', 'compare', 'ratings'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Benchmarks Tab */}
      {activeTab === 'benchmarks' && (
        <div className="space-y-4">
          {/* Benchmark Suites */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BenchmarkCard
              title="Bengali Benchmark"
              count={BenchmarkSuites.bengaliBenchmark.length}
              category="bengali"
              results={benchmarkResults.filter(r => r.language === 'bengali')}
            />
            <BenchmarkCard
              title="English Benchmark"
              count={BenchmarkSuites.englishBenchmark.length}
              category="english"
              results={benchmarkResults.filter(r => r.language === 'english')}
            />
            <BenchmarkCard
              title="Mixed Language"
              count={BenchmarkSuites.mixedBenchmark.length}
              category="mixed"
              results={benchmarkResults.filter(r => r.language === 'mixed')}
            />
          </div>

          {/* Results List */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Benchmark Results</h3>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-200"
              >
                <option value="all">All Categories</option>
                <option value="conversation">Conversation</option>
                <option value="formal">Formal</option>
                <option value="question">Questions</option>
                <option value="numbers">Numbers</option>
                <option value="long_sentence">Long Sentences</option>
                <option value="code_switching">Code Switching</option>
              </select>
            </div>
            
            {filteredResults.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">No benchmark results yet. Run benchmarks to see results.</p>
            ) : (
              <div className="space-y-3">
                {filteredResults.map(result => (
                  <div key={result.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-xs px-2 py-0.5 bg-gray-700 rounded text-gray-300">{result.category}</span>
                        <span className="text-xs px-2 py-0.5 bg-gray-700 rounded text-gray-300 ml-2">{result.language}</span>
                      </div>
                      {result.qualityReport && <QualityBadge score={result.qualityReport.overall} />}
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{result.text}</p>
                    {result.qualityReport && (
                      <div className="grid grid-cols-5 gap-2 mt-3">
                        <MiniScore label="Similarity" score={result.qualityReport.speakerSimilarity} />
                        <MiniScore label="Naturalness" score={result.qualityReport.naturalness} />
                        <MiniScore label="Clarity" score={result.qualityReport.clarity} />
                        <MiniScore label="Pronunciation" score={result.qualityReport.pronunciation} />
                        <MiniScore label="Prosody" score={result.qualityReport.prosodyConsistency} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Compare Tab */}
      {activeTab === 'compare' && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">A/B Voice Comparison</h3>
          <p className="text-sm text-gray-400 mb-6">Compare original recordings with generated speech to evaluate voice similarity.</p>
          
          {samples.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Original Recording</h4>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  {samples[0].audioUrl && (
                    <audio controls src={samples[0].audioUrl} className="w-full" />
                  )}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-400">
                    <div>Duration: {samples[0].duration.toFixed(1)}s</div>
                    <div>Quality: {samples[0].overallQuality}/100</div>
                    <div>SNR: {samples[0].snrEstimate}dB</div>
                    <div>Speech: {samples[0].speechPercentage}%</div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Generated Audio</h4>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <p className="text-sm text-gray-500">Generate speech first to compare.</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Upload recordings to enable comparison.</p>
          )}
        </div>
      )}

      {/* Ratings Tab */}
      {activeTab === 'ratings' && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Human Evaluation</h3>
          <p className="text-sm text-gray-400 mb-6">Rate generated speech quality manually for detailed evaluation.</p>
          
          {benchmarkResults.length > 0 ? (
            <div className="space-y-4">
              {benchmarkResults.filter(r => !r.humanRating).slice(0, 5).map(result => (
                <HumanRatingForm key={result.id} result={result} onRate={(rating) => addHumanRating(result.id, rating)} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Run benchmarks first to enable human evaluation.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// AUDIO LIBRARY PAGE
// ============================================================
function AudioLibraryPage() {
  const { audioLibrary, removeFromLibrary } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLanguage, setFilterLanguage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const filtered = audioLibrary
    .filter(item => {
      if (searchQuery && !item.text.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterLanguage !== 'all' && item.language !== filterLanguage) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'quality') return b.qualityScore - a.qualityScore;
      if (sortBy === 'duration') return b.duration - a.duration;
      return 0;
    });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Audio Library</h2>
        <p className="text-gray-400 mt-1">Manage your generated audio files</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by text..."
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <select
          value={filterLanguage}
          onChange={(e) => setFilterLanguage(e.target.value)}
          className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200"
        >
          <option value="all">All Languages</option>
          <option value="bengali">Bengali</option>
          <option value="english">English</option>
          <option value="mixed">Mixed</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200"
        >
          <option value="date">Sort by Date</option>
          <option value="quality">Sort by Quality</option>
          <option value="duration">Sort by Duration</option>
        </select>
      </div>

      {/* Library Items */}
      {filtered.length === 0 ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
          <FileAudio size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-300">No Audio Files</h3>
          <p className="text-gray-500 mt-2">Generate speech to populate your audio library.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => (
            <div key={item.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-200 mb-1">{item.text}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="capitalize">{item.language}</span>
                    <span>{item.duration?.toFixed(1)}s</span>
                    <span>{item.format.toUpperCase()}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    <QualityBadge score={item.qualityScore} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.audioUrl && (
                    <button
                      onClick={() => {
                        const audio = new Audio(item.audioUrl);
                        if (playingId === item.id) {
                          audio.pause();
                          setPlayingId(null);
                        } else {
                          audio.play();
                          setPlayingId(item.id);
                          audio.onended = () => setPlayingId(null);
                        }
                      }}
                      className="p-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 rounded-lg"
                    >
                      {playingId === item.id ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                  )}
                  {item.audioUrl && (
                    <a
                      href={item.audioUrl}
                      download={item.fileName}
                      className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-lg"
                    >
                      <Download size={14} />
                    </a>
                  )}
                  <button
                    onClick={() => removeFromLibrary(item.id)}
                    className="p-2 bg-gray-800 hover:bg-red-900/50 text-gray-400 hover:text-red-400 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// SETTINGS PAGE
// ============================================================
function SettingsPage() {
  const { settings, updateSettings } = useAppStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-gray-400 mt-1">Configure application preferences and limits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Generation Limits */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Generation Limits</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Max Generation Length (characters)</label>
              <input
                type="number"
                value={settings.maxGenerationLength}
                onChange={(e) => updateSettings({ maxGenerationLength: parseInt(e.target.value) || 10000 })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Max Monthly Usage (characters)</label>
              <input
                type="number"
                value={settings.maxMonthlyUsage}
                onChange={(e) => updateSettings({ maxMonthlyUsage: parseInt(e.target.value) || 100000 })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Max Request Size (characters)</label>
              <input
                type="number"
                value={settings.maxRequestSize}
                onChange={(e) => updateSettings({ maxRequestSize: parseInt(e.target.value) || 50000 })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200"
              />
            </div>
          </div>
        </div>

        {/* Quality Targets */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quality Targets</h3>
          <p className="text-xs text-gray-500 mb-4">These are engineering thresholds, not guarantees of human-perceived quality.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Dataset Quality Target</label>
              <input
                type="number"
                value={settings.qualityTarget}
                onChange={(e) => updateSettings({ qualityTarget: parseInt(e.target.value) || 90 })}
                min={0}
                max={100}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Speaker Consistency Target</label>
              <input
                type="number"
                value={settings.speakerConsistencyTarget}
                onChange={(e) => updateSettings({ speakerConsistencyTarget: parseInt(e.target.value) || 90 })}
                min={0}
                max={100}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Recording Quality Target</label>
              <input
                type="number"
                value={settings.recordingQualityTarget}
                onChange={(e) => updateSettings({ recordingQualityTarget: parseInt(e.target.value) || 80 })}
                min={0}
                max={100}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Phonetic Coverage Target</label>
              <input
                type="number"
                value={settings.phoneticCoverageTarget}
                onChange={(e) => updateSettings({ phoneticCoverageTarget: parseInt(e.target.value) || 85 })}
                min={0}
                max={100}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200"
              />
            </div>
          </div>
        </div>

        {/* Defaults */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Defaults</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Default Audio Format</label>
              <select
                value={settings.defaultFormat}
                onChange={(e) => updateSettings({ defaultFormat: e.target.value as AudioFormat })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200"
              >
                <option value="wav">WAV</option>
                <option value="mp3">MP3</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Default Language</label>
              <select
                value={settings.defaultLanguage}
                onChange={(e) => updateSettings({ defaultLanguage: e.target.value as Language })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200"
              >
                <option value="english">English</option>
                <option value="bengali">Bengali</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Engine Info */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Voice Engine</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Engine</span>
              <span className="text-gray-200">Demo Studio Engine</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Voice Cloning</span>
              <span className="text-green-400">Supported</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Bengali</span>
              <span className="text-green-400">Supported</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">English</span>
              <span className="text-green-400">Supported</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Mixed Language</span>
              <span className="text-green-400">Supported</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Formats</span>
              <span className="text-gray-200">WAV, MP3</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
            <p className="text-xs text-blue-300">
              To connect a production voice engine (ElevenLabs, Coqui, etc.), configure the provider in environment variables. See documentation for details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PRIVACY PAGE
// ============================================================
function PrivacyPage() {
  const { consent, samples, profiles, audioLibrary, clearSamples, deleteProfile } = useAppStore();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Privacy & Consent</h2>
        <p className="text-gray-400 mt-1">Manage your voice data and privacy settings</p>
      </div>

      {/* Privacy Overview */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Data Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <p className="text-2xl font-bold text-indigo-400">{samples.length}</p>
            <p className="text-xs text-gray-400 mt-1">Voice Recordings</p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <p className="text-2xl font-bold text-purple-400">{profiles.length}</p>
            <p className="text-xs text-gray-400 mt-1">Voice Profiles</p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <p className="text-2xl font-bold text-emerald-400">{audioLibrary.length}</p>
            <p className="text-xs text-gray-400 mt-1">Generated Audio</p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-400">{consent ? '✓' : '✗'}</p>
            <p className="text-xs text-gray-400 mt-1">Consent Given</p>
          </div>
        </div>
      </div>

      {/* Privacy Policy */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">How Your Data is Handled</h3>
        <div className="space-y-4 text-sm text-gray-300">
          <div className="flex items-start gap-3">
            <Lock size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-white">Voice Recordings</p>
              <p className="text-gray-400">Your recordings are processed locally in your browser. They are used solely for creating your personal voice profile.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Lock size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-white">Voice Profiles</p>
              <p className="text-gray-400">Voice profiles are stored locally. If using a cloud provider, profiles are encrypted and stored securely.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Lock size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-white">Generated Audio</p>
              <p className="text-gray-400">Generated audio files are stored locally and can be downloaded or deleted at any time.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Unlock size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-white">Third-Party Processing</p>
              <p className="text-gray-400">If connected to a cloud voice provider, audio data may be sent to their servers for processing. Review their privacy policy.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Deletion */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Delete Your Data</h3>
        <p className="text-sm text-gray-400 mb-4">Permanently remove your voice data. This action cannot be undone.</p>
        
        <div className="space-y-3">
          <DeleteAction
            label="Delete Training Recordings"
            description={`Remove ${samples.length} voice recordings`}
            onConfirm={() => { clearSamples(); setDeleteConfirm(null); }}
            isConfirming={deleteConfirm === 'samples'}
            onStartConfirm={() => setDeleteConfirm('samples')}
            onCancel={() => setDeleteConfirm(null)}
          />
          {profiles.map(profile => (
            <DeleteAction
              key={profile.id}
              label={`Delete Voice Profile: ${profile.name}`}
              description="Remove voice profile and associated data"
              onConfirm={() => { deleteProfile(profile.id); setDeleteConfirm(null); }}
              isConfirming={deleteConfirm === profile.id}
              onStartConfirm={() => setDeleteConfirm(profile.id)}
              onCancel={() => setDeleteConfirm(null)}
            />
          ))}
          <DeleteAction
            label="Delete All Generated Audio"
            description={`Remove ${audioLibrary.length} generated audio files`}
            onConfirm={() => {
              audioLibrary.forEach(item => useAppStore.getState().removeFromLibrary(item.id));
              setDeleteConfirm(null);
            }}
            isConfirming={deleteConfirm === 'audio'}
            onStartConfirm={() => setDeleteConfirm('audio')}
            onCancel={() => setDeleteConfirm(null)}
          />
          <DeleteAction
            label="Delete Everything"
            description="Remove all voice data, profiles, and generated audio"
            onConfirm={() => {
              clearSamples();
              profiles.forEach(p => deleteProfile(p.id));
              audioLibrary.forEach(item => useAppStore.getState().removeFromLibrary(item.id));
              setDeleteConfirm(null);
            }}
            isConfirming={deleteConfirm === 'everything'}
            onStartConfirm={() => setDeleteConfirm('everything')}
            onCancel={() => setDeleteConfirm(null)}
            danger
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// HELP PAGE
// ============================================================
function HelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Help & Documentation</h2>
        <p className="text-gray-400 mt-1">Learn how to use VoiceClone Studio effectively</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HelpCard
          title="Getting Started"
          icon={<BookOpen size={20} className="text-indigo-400" />}
          items={[
            'Create a voice profile in the "Create Voice" section',
            'Record at least 5 minutes of clean speech',
            'Follow the guided prompts for best phonetic coverage',
            'Ensure recordings are in a quiet environment',
            'Review quality scores and re-record poor samples'
          ]}
        />
        <HelpCard
          title="Recording Tips"
          icon={<Mic size={20} className="text-purple-400" />}
          items={[
            'Use a quiet room with minimal echo',
            'Keep a consistent distance from the microphone',
            'Speak naturally at your normal pace',
            'Avoid background music or TV noise',
            'Record in both Bengali and English for multilingual support',
            'Include questions, statements, and emotional sentences'
          ]}
        />
        <HelpCard
          title="Voice Quality"
          icon={<Award size={20} className="text-emerald-400" />}
          items={[
            'More recordings = better voice similarity',
            'Diverse content improves pronunciation range',
            'Quality scores are engineering estimates, not exact measurements',
            'Use the Quality Lab to test and compare results',
            'Iteratively improve by adding targeted recordings'
          ]}
        />
        <HelpCard
          title="Supported Languages"
          icon={<Languages size={20} className="text-yellow-400" />}
          items={[
            'Bengali (বাংলা) - Full support',
            'English - Full support',
            'Mixed Bengali-English (code-switching) - Supported',
            'Auto language detection for input text',
            'Manual language override available'
          ]}
        />
        <HelpCard
          title="Audio Formats"
          icon={<FileAudio size={20} className="text-cyan-400" />}
          items={[
            'WAV - Uncompressed, highest quality',
            'MP3 - Compressed, smaller file size',
            'Input: WAV, MP3, OGG, FLAC, WebM',
            'Output: WAV, MP3',
            'Max upload size: 50MB per file'
          ]}
        />
        <HelpCard
          title="Troubleshooting"
          icon={<AlertCircle size={20} className="text-red-400" />}
          items={[
            'Microphone not working: Check browser permissions',
            'Poor quality scores: Record in a quieter environment',
            'Generation fails: Check text length and profile status',
            'Audio playback issues: Try a different browser',
            'Low similarity: Add more diverse recordings'
          ]}
        />
      </div>

      {/* Architecture Info */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Architecture</h3>
        <div className="text-sm text-gray-400 space-y-2">
          <p>This application uses a provider abstraction layer (VoiceEngine) that allows switching between different voice synthesis backends without changing the UI.</p>
          <p>Currently configured: <span className="text-indigo-400">Demo Studio Engine</span> (local audio synthesis)</p>
          <p>To connect a production voice cloning API, configure the appropriate provider in settings and environment variables.</p>
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700 font-mono text-xs text-gray-400">
            <p>VoiceEngine Interface:</p>
            <p className="mt-1">├── createVoiceProfile()</p>
            <p>├── analyzeRecording()</p>
            <p>├── validateVoiceDataset()</p>
            <p>├── generateSpeech()</p>
            <p>├── estimateSimilarity()</p>
            <p>├── runBenchmark()</p>
            <p>└── deleteVoiceProfile()</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// REUSABLE COMPONENTS
// ============================================================

function StatusCard({ title, value, subtitle, icon, color }: { title: string; value: string; subtitle: string; icon: React.ReactNode; color: string }) {
  const colorClasses: Record<string, string> = {
    green: 'from-green-900/30 to-green-900/10 border-green-800/50',
    yellow: 'from-yellow-900/30 to-yellow-900/10 border-yellow-800/50',
    blue: 'from-blue-900/30 to-blue-900/10 border-blue-800/50',
    gray: 'from-gray-800/50 to-gray-900/50 border-gray-700/50',
    indigo: 'from-indigo-900/30 to-indigo-900/10 border-indigo-800/50',
  };
  const iconColors: Record<string, string> = {
    green: 'text-green-400', yellow: 'text-yellow-400', blue: 'text-blue-400', gray: 'text-gray-400', indigo: 'text-indigo-400'
  };
  
  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl border p-5`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400 uppercase tracking-wider">{title}</span>
        <span className={iconColors[color]}>{icon}</span>
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
}

function QuickAction({ title, description, icon, onClick, color }: { title: string; description: string; icon: React.ReactNode; onClick: () => void; color: string }) {
  const bgColors: Record<string, string> = {
    indigo: 'hover:bg-indigo-900/30 border-indigo-800/30',
    purple: 'hover:bg-purple-900/30 border-purple-800/30',
    emerald: 'hover:bg-emerald-900/30 border-emerald-800/30',
  };
  const iconColors: Record<string, string> = {
    indigo: 'text-indigo-400', purple: 'text-purple-400', emerald: 'text-emerald-400'
  };
  
  return (
    <button
      onClick={onClick}
      className={`bg-gray-900 rounded-xl border border-gray-800 p-6 text-left transition-all ${bgColors[color]}`}
    >
      <span className={iconColors[color]}>{icon}</span>
      <h3 className="text-lg font-semibold text-white mt-3">{title}</h3>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </button>
  );
}

function QualityBar({ label, value }: { label: string; value: number }) {
  const color = value >= 85 ? 'bg-green-500' : value >= 70 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xs text-gray-300">{Math.round(value)}%</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2">
        <div className={`h-2 rounded-full ${color} transition-all`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function QualityBadge({ score }: { score: number }) {
  const color = score >= 85 ? 'bg-green-900/50 text-green-400 border-green-700/50' :
                score >= 70 ? 'bg-yellow-900/50 text-yellow-400 border-yellow-700/50' :
                'bg-red-900/50 text-red-400 border-red-700/50';
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${color}`}>
      {Math.round(score)}
    </span>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase">{label}</p>
      <p className="text-sm font-medium text-gray-200 mt-0.5 capitalize">{value}</p>
    </div>
  );
}

function MiniScore({ label, score }: { label: string; score: number }) {
  return (
    <div className="text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-sm font-bold ${score >= 85 ? 'text-green-400' : score >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
        {score}
      </p>
    </div>
  );
}

function SliderControl({ label, value, min, max, step, onChange, displayValue }: {
  label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; displayValue: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs text-gray-400">{label}</label>
        <span className="text-xs text-gray-300">{displayValue}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-indigo-500"
      />
    </div>
  );
}

function SampleQualityReport({ sample }: { sample: RecordingSample }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-white">Quality Report: {sample.name}</h3>
          <QualityBadge score={sample.overallQuality} />
        </div>
        {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      
      {expanded && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-500">Duration</p>
              <p className="text-sm text-gray-200">{sample.duration.toFixed(1)}s</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-500">Sample Rate</p>
              <p className="text-sm text-gray-200">{sample.sampleRate} Hz</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-500">RMS Loudness</p>
              <p className="text-sm text-gray-200">{sample.rmsLoudness} dB</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-500">Peak Amplitude</p>
              <p className="text-sm text-gray-200">{(sample.peakAmplitude * 100).toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-500">SNR Estimate</p>
              <p className="text-sm text-gray-200">{sample.snrEstimate} dB</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-500">Speech %</p>
              <p className="text-sm text-gray-200">{sample.speechPercentage}%</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-500">Clipping</p>
              <p className="text-sm text-gray-200">{sample.clippingPercent.toFixed(2)}%</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-500">Background Noise</p>
              <p className="text-sm text-gray-200">{sample.backgroundNoiseEstimate}%</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-500">Echo Level</p>
              <p className="text-sm text-gray-200">{sample.echoLevel}%</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-500">Volume Consistency</p>
              <p className="text-sm text-gray-200">{sample.volumeConsistency}</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-500">Channels</p>
              <p className="text-sm text-gray-200">{sample.channels}</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-500">File Size</p>
              <p className="text-sm text-gray-200">{(sample.fileSize / 1024).toFixed(1)} KB</p>
            </div>
          </div>

          {/* Waveform */}
          {sample.waveform && (
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-2">Waveform</p>
              <div className="flex items-end gap-px h-12">
                {sample.waveform.map((v, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-indigo-500/60 rounded-t"
                    style={{ height: `${v * 100}%`, minHeight: '1px' }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Issues & Warnings */}
          {sample.issues.length > 0 && (
            <div className="space-y-2">
              {sample.issues.map((issue, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-red-900/20 border border-red-700/30 rounded text-sm text-red-300">
                  <XCircle size={14} /> {issue}
                </div>
              ))}
            </div>
          )}
          {sample.warnings.length > 0 && (
            <div className="space-y-2">
              {sample.warnings.map((warning, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-yellow-900/20 border border-yellow-700/30 rounded text-sm text-yellow-300">
                  <AlertTriangle size={14} /> {warning}
                </div>
              ))}
            </div>
          )}
          {sample.issues.length === 0 && sample.warnings.length === 0 && (
            <div className="flex items-center gap-2 p-2 bg-green-900/20 border border-green-700/30 rounded text-sm text-green-300">
              <CheckCircle size={14} /> No issues detected. Recording quality is good.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BenchmarkCard({ title, count, category, results }: { title: string; count: number; category: string; results: any[] }) {
  const avgScore = results.length > 0 ? results.reduce((s, r) => s + (r.qualityReport?.overall || 0), 0) / results.length : 0;
  
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
      <h4 className="text-sm font-medium text-gray-300">{title}</h4>
      <p className="text-xs text-gray-500 mt-1">{count} test sentences</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-400">{results.length}/{count} completed</span>
        {avgScore > 0 && <QualityBadge score={avgScore} />}
      </div>
    </div>
  );
}

function HumanRatingForm({ result, onRate }: { result: any; onRate: (rating: HumanRating) => void }) {
  const [ratings, setRatings] = useState({ voiceSimilarity: 3, naturalness: 3, pronunciation: 3, expression: 3 });
  const [comments, setComments] = useState('');

  return (
    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
      <p className="text-sm text-gray-300 mb-3">{result.text}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        {Object.entries(ratings).map(([key, value]) => (
          <div key={key}>
            <label className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
            <div className="flex items-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRatings({ ...ratings, [key]: star })}
                  className={`w-6 h-6 rounded flex items-center justify-center text-xs ${
                    star <= value ? 'bg-yellow-600 text-yellow-100' : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {star}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        placeholder="Comments (optional)"
        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-200 placeholder-gray-500 mb-3"
      />
      <button
        onClick={() => onRate({ ...ratings, comments, createdAt: new Date() })}
        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm"
      >
        Submit Rating
      </button>
    </div>
  );
}

function DeleteAction({ label, description, onConfirm, isConfirming, onStartConfirm, onCancel, danger }: {
  label: string; description: string; onConfirm: () => void; isConfirming: boolean; onStartConfirm: () => void; onCancel: () => void; danger?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border ${
      danger ? 'bg-red-900/10 border-red-800/30' : 'bg-gray-800/50 border-gray-700/50'
    }`}>
      <div>
        <p className={`text-sm font-medium ${danger ? 'text-red-300' : 'text-gray-200'}`}>{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      {isConfirming ? (
        <div className="flex items-center gap-2">
          <span className="text-xs text-red-400">Are you sure?</span>
          <button onClick={onConfirm} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs">
            Delete
          </button>
          <button onClick={onCancel} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded text-xs">
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={onStartConfirm}
          className={`px-3 py-1.5 rounded text-xs font-medium ${
            danger ? 'bg-red-900/50 hover:bg-red-900 text-red-300 border border-red-700/50' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
        >
          Delete
        </button>
      )}
    </div>
  );
}

function HelpCard({ title, icon, items }: { title: string; icon: React.ReactNode; items: string[] }) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
            <ChevronRight size={12} className="mt-1 text-gray-600 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
