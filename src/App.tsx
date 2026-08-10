import React, { useState, useEffect, useRef } from 'react';
import {
  AppName,
  SmartHomeState,
  DeviceSettings,
  ContactItem,
  AlarmItem,
  ReminderItem,
  FileItem,
  MemoryItem,
  ConversationMessage,
  ActionPayload,
  MultiStepItem,
  UIElement,
  AssistantApiResponse,
} from './types';
import {
  INITIAL_SMART_HOME,
  INITIAL_DEVICE_SETTINGS,
  INITIAL_CONTACTS,
  INITIAL_ALARMS,
  INITIAL_REMINDERS,
  INITIAL_FILES,
  INITIAL_MEMORIES,
  APP_SCREEN_ELEMENTS,
} from './data/mockScreenData';
import { HeaderHUD } from './components/HeaderHUD';
import { ArcReactor } from './components/ArcReactor';
import { DeviceSimulator } from './components/DeviceSimulator';
import { IntentInspector } from './components/IntentInspector';
import { MemoryPanel } from './components/MemoryPanel';
import { ConfirmationModal } from './components/ConfirmationModal';
import { VoiceCommandPresets } from './components/VoiceCommandPresets';
import { AndroidControlPanel } from './components/AndroidControlPanel';
import { ExecutionMode, AndroidActionType } from './android/types';
import { Mic, Send, Volume2, Sparkles, MessageSquare, Terminal, RefreshCw, Smartphone } from 'lucide-react';

export default function App() {
  // Application State
  const [executionMode, setExecutionMode] = useState<ExecutionMode>('simulator');
  const [currentApp, setCurrentApp] = useState<AppName>('Home');
  const [smartHome, setSmartHome] = useState<SmartHomeState>(INITIAL_SMART_HOME);
  const [deviceSettings, setDeviceSettings] = useState<DeviceSettings>(INITIAL_DEVICE_SETTINGS);
  const [contacts, setContacts] = useState<ContactItem[]>(INITIAL_CONTACTS);
  const [alarms, setAlarms] = useState<AlarmItem[]>(INITIAL_ALARMS);
  const [reminders, setReminders] = useState<ReminderItem[]>(INITIAL_REMINDERS);
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [memories, setMemories] = useState<MemoryItem[]>(INITIAL_MEMORIES);

  // Inspector & Execution State
  const [actionPayload, setActionPayload] = useState<ActionPayload | null>(null);
  const [multiStepPlan, setMultiStepPlan] = useState<MultiStepItem[]>([]);
  const [actionHistory, setActionHistory] = useState<
    Array<{ timestamp: string; prompt: string; payload: ActionPayload }>
  >([]);
  const [lastExecutedAction, setLastExecutedAction] = useState<{
    action: string;
    target: string;
    timestamp: number;
  } | null>(null);

  // Conversation Feed
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'Namaste Sarthak! I am JARVIS. Voice Access and Device Control systems are online. How can I assist you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // System Flags & Controls
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [wakeWordActive, setWakeWordActive] = useState(true);
  const [wakeWordDetected, setWakeWordDetected] = useState(false);
  const [voiceOverlayActive, setVoiceOverlayActive] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [userPromptInput, setUserPromptInput] = useState('');

  // Confirmation Modal State
  const [confirmationState, setConfirmationState] = useState<{
    isOpen: boolean;
    promptText: string;
    targetItem: string;
    pendingActionPayload: ActionPayload | null;
  }>({
    isOpen: false,
    promptText: '',
    targetItem: '',
    pendingActionPayload: null,
  });

  // Speech Recognition Reference
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat feed
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Speech Recognition Setup (Web Speech API)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US'; // Supports English, Hindi & Hinglish

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setIsListening(false);

          // Check if wake word detected in audio stream
          if (wakeWordActive && /jarvis|hey jarvis/i.test(transcript)) {
            setWakeWordDetected(true);
            setTimeout(() => setWakeWordDetected(false), 2000);
          }

          // Process the recognized prompt
          handleSendPrompt(transcript);
        };

        recognition.onerror = (err: any) => {
          console.warn('Speech recognition error:', err);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [wakeWordActive]);

  // Speech Synthesis Function
  const speakText = (text: string) => {
    if (!soundEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Stop prior speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Toggle Mic Listening
  const handleToggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.warn('Speech start error, falling back:', err);
        setIsListening(false);
      }
    }
  };

  // Primary API Execution Function
  const handleSendPrompt = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || isProcessing) return;

    setUserPromptInput('');

    // Add user message to conversation feed
    const userMsg: ConversationMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const visibleElements = APP_SCREEN_ELEMENTS[currentApp] || [];

      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: trimmed,
          currentApp,
          visibleElements,
          deviceSettings,
          smartHomeState: smartHome,
          conversationHistory: messages.map((m) => ({ sender: m.sender, text: m.text })),
          memoryContext: memories,
        }),
      });

      const data: AssistantApiResponse = await res.json();

      setIsProcessing(false);

      // Add assistant message to feed
      const assistantMsg: ConversationMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: data.spokenResponse || 'समझ गया, कार्रवाई कर रहा हूँ।',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: data.intent,
        actionPayload: data.actionPayload,
        groundingSources: data.groundingSources,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Speak response aloud
      speakText(data.spokenResponse);

      // Update Inspector Action Payload
      if (data.actionPayload) {
        setActionPayload(data.actionPayload);

        // Record in Action History
        setActionHistory((prev) => [
          {
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            prompt: trimmed,
            payload: data.actionPayload,
          },
          ...prev.slice(0, 19),
        ]);
      }

      // Handle Memory Saving
      if (data.memoryItemToSave) {
        const { key, value, category } = data.memoryItemToSave;
        if (key && value) {
          handleAddMemory(key, value, category || 'general');
        }
      }

      // Handle Confirmation Dialog
      if (data.actionPayload?.requires_confirmation || data.requiresConfirmation) {
        setConfirmationState({
          isOpen: true,
          promptText: data.confirmationPrompt || data.actionPayload?.confirmation_prompt || 'क्या मैं इसे delete कर दूँ?',
          targetItem: data.actionPayload?.target || 'Requested Item',
          pendingActionPayload: data.actionPayload,
        });
        return;
      }

      // Handle Multi-Step Plan Execution
      if (data.multiStepPlan && data.multiStepPlan.length > 0) {
        setMultiStepPlan(data.multiStepPlan);
        executeMultiStepPlan(data.multiStepPlan);
      } else if (data.actionPayload) {
        // Execute Single Step Action
        executeDeviceAction(data.actionPayload);
      }
    } catch (err) {
      console.error('Error invoking JARVIS assistant:', err);
      setIsProcessing(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'माफ़ कीजिए, सर्वर से संपर्क नहीं हो पाया।',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  // Execute Device Action State Transformations
  const executeDeviceAction = (payload: ActionPayload) => {
    const { action, target, parameters } = payload;

    setLastExecutedAction({
      action: action || 'TAP',
      target: target || 'Element',
      timestamp: Date.now(),
    });

    const lowerTarget = (target || '').toLowerCase();

    // 1. App Navigation
    if (action === 'OPEN_APP' || lowerTarget.includes('youtube') || lowerTarget.includes('whatsapp') || lowerTarget.includes('chrome') || lowerTarget.includes('camera') || lowerTarget.includes('smart home') || lowerTarget.includes('settings') || lowerTarget.includes('reminders') || lowerTarget.includes('contacts') || lowerTarget.includes('files')) {
      if (lowerTarget.includes('youtube')) setCurrentApp('YouTube');
      else if (lowerTarget.includes('whatsapp')) setCurrentApp('WhatsApp');
      else if (lowerTarget.includes('instagram')) setCurrentApp('Instagram');
      else if (lowerTarget.includes('chrome')) setCurrentApp('Chrome');
      else if (lowerTarget.includes('camera')) setCurrentApp('Camera');
      else if (lowerTarget.includes('smart home') || lowerTarget.includes('light') || lowerTarget.includes('ac')) setCurrentApp('Smart Home');
      else if (lowerTarget.includes('setting')) setCurrentApp('Settings');
      else if (lowerTarget.includes('reminder') || lowerTarget.includes('alarm')) setCurrentApp('Reminders');
      else if (lowerTarget.includes('contact') || lowerTarget.includes('call') || lowerTarget.includes('mummy')) setCurrentApp('Contacts');
      else if (lowerTarget.includes('file')) setCurrentApp('Files');
    }

    // 2. Smart Home Actions
    if (lowerTarget.includes('bedroom light') || lowerTarget.includes('light')) {
      if (lowerTarget.includes('off') || lowerTarget.includes('बंद')) setSmartHome((prev) => ({ ...prev, bedroomLight: false }));
      else if (lowerTarget.includes('on') || lowerTarget.includes('चालू')) setSmartHome((prev) => ({ ...prev, bedroomLight: true }));
      else setSmartHome((prev) => ({ ...prev, bedroomLight: !prev.bedroomLight }));
    }

    if (lowerTarget.includes('ac') || lowerTarget.includes('air conditioner')) {
      if (parameters?.temp) {
        setSmartHome((prev) => ({ ...prev, acTemp: Number(parameters.temp) }));
      }
    }

    // 3. Device Settings Actions
    if (lowerTarget.includes('wifi') || lowerTarget.includes('wi-fi')) {
      if (lowerTarget.includes('off') || lowerTarget.includes('बंद')) setDeviceSettings((prev) => ({ ...prev, wifiEnabled: false }));
      else setDeviceSettings((prev) => ({ ...prev, wifiEnabled: true }));
    }

    // 4. Alarm / Reminder Actions
    if (payload.intent === 'ALARM' || lowerTarget.includes('alarm')) {
      setCurrentApp('Reminders');
      setAlarms((prev) => [
        {
          id: `a-${Date.now()}`,
          time: parameters?.time || '07:00 AM',
          label: parameters?.label || 'Voice Set Alarm',
          enabled: true,
        },
        ...prev,
      ]);
    }
  };

  // Multi-step Execution Simulator with timed delays
  const executeMultiStepPlan = async (steps: MultiStepItem[]) => {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];

      // Mark executing
      setMultiStepPlan((prev) =>
        prev.map((s) => (s.id === step.id ? { ...s, status: 'executing' } : s))
      );

      // Perform action
      executeDeviceAction(step.actionPayload);

      // Wait 1.2 seconds between steps for realistic simulation
      await new Promise((r) => setTimeout(r, 1200));

      // Mark completed
      setMultiStepPlan((prev) =>
        prev.map((s) => (s.id === step.id ? { ...s, status: 'completed' } : s))
      );
    }
  };

  // Memory Management Helpers
  const handleAddMemory = (key: string, value: string, category: MemoryItem['category']) => {
    const newItem: MemoryItem = {
      id: `m-${Date.now()}`,
      key,
      value,
      category,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setMemories((prev) => [newItem, ...prev]);
  };

  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  const handleDeleteFile = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    setConfirmationState({
      isOpen: true,
      promptText: `क्या मैं '${file?.name || 'File'}' को स्थाई रूप से delete कर दूँ?`,
      targetItem: file?.name || 'File',
      pendingActionPayload: {
        intent: 'FILE_OPERATION',
        action: 'DELETE',
        target: fileId,
        parameters: { fileId },
        confidence: 0.99,
        requires_confirmation: true,
      },
    });
  };

  // Handle Confirmed Destructive Action
  const handleConfirmAction = () => {
    if (confirmationState.pendingActionPayload) {
      const { target } = confirmationState.pendingActionPayload;
      setFiles((prev) => prev.filter((f) => f.id !== target));

      setMessages((prev) => [
        ...prev,
        {
          id: `conf-${Date.now()}`,
          sender: 'assistant',
          text: `ठीक है, ${confirmationState.targetItem} को सफलतापूर्वक delete कर दिया गया है।`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      speakText('हो गया, file को delete कर दिया गया है।');
    }

    setConfirmationState({ isOpen: false, promptText: '', targetItem: '', pendingActionPayload: null });
  };

  // Handle Element Tag Click (Google Voice Access)
  const handleSelectElementTag = (el: UIElement) => {
    const prompt = `Tag #${el.id} ${el.label} को select/tap करो`;
    handleSendPrompt(prompt);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* Top HUD Header */}
      <HeaderHUD
        wakeWordActive={wakeWordActive}
        onToggleWakeWord={() => setWakeWordActive(!wakeWordActive)}
        voiceOverlayActive={voiceOverlayActive}
        onToggleVoiceOverlay={() => setVoiceOverlayActive(!voiceOverlayActive)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        activeApp={currentApp}
      />

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Arc Reactor Core & Device Simulator (Lg: 5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center gap-6">
          {/* Futuristic Arc Reactor Visualizer */}
          <div className="w-full">
            <ArcReactor
              isListening={isListening}
              isProcessing={isProcessing}
              isSpeaking={isSpeaking}
              wakeWordDetected={wakeWordDetected}
              isMuted={!soundEnabled}
              onToggleMic={handleToggleMic}
              statusText={
                isListening
                  ? 'Listening for speech...'
                  : isProcessing
                  ? 'Analyzing Intent with Gemini...'
                  : isSpeaking
                  ? 'JARVIS Speaking...'
                  : 'JARVIS Core Idle'
              }
            />
          </div>

          {/* Interactive Smartphone / Tablet Screen Simulator */}
          <div className="w-full">
            <DeviceSimulator
              currentApp={currentApp}
              onNavigateApp={(app) => setCurrentApp(app)}
              smartHome={smartHome}
              onUpdateSmartHome={(updated) => setSmartHome((prev) => ({ ...prev, ...updated }))}
              deviceSettings={deviceSettings}
              onUpdateDeviceSettings={(updated) => setDeviceSettings((prev) => ({ ...prev, ...updated }))}
              contacts={contacts}
              alarms={alarms}
              reminders={reminders}
              files={files}
              onDeleteFile={handleDeleteFile}
              elements={APP_SCREEN_ELEMENTS[currentApp] || []}
              voiceOverlayActive={voiceOverlayActive}
              onSelectElementTag={handleSelectElementTag}
              lastExecutedAction={lastExecutedAction}
              activePhoneCall={null}
              onEndCall={() => {}}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Voice Chat Feed, Presets & Intelligence Hub (Lg: 7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6 h-full">
          {/* Quick Voice Command Presets */}
          <VoiceCommandPresets onSelectCommand={handleSendPrompt} />

          {/* Voice Chat Conversation Feed */}
          <div className="bg-slate-950/80 rounded-2xl border border-cyan-500/20 backdrop-blur-md shadow-2xl p-4 flex flex-col h-[320px]">
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20 mb-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-cyan-300 tracking-wider">VOICE CONVERSATION FEED</span>
              </div>
              <span className="text-[10px] text-slate-400">Hinglish • Hindi • English</span>
            </div>

            {/* Scrollable Chat History */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] ${
                    msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed font-sans shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-cyan-600 text-slate-950 font-medium rounded-br-none'
                        : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-bl-none'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Grounding Web Sources if available */}
                    {msg.groundingSources && msg.groundingSources.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] space-y-1 font-mono">
                        <span className="text-cyan-400 font-bold block">Web Grounding Sources:</span>
                        {msg.groundingSources.map((src, i) => (
                          <a
                            key={i}
                            href={src.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block text-cyan-300 hover:underline truncate"
                          >
                            • {src.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                value={userPromptInput}
                onChange={(e) => setUserPromptInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt(userPromptInput)}
                placeholder="Talk to JARVIS or type commands in Hinglish..."
                className="flex-1 bg-slate-900 border border-slate-800 text-xs text-slate-100 px-3.5 py-2.5 rounded-xl outline-none focus:border-cyan-500/60 font-sans"
              />
              <button
                onClick={handleToggleMic}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isListening
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 animate-pulse'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-cyan-300'
                }`}
                title="Microphone Input"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSendPrompt(userPromptInput)}
                disabled={isProcessing}
                className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </div>

          {/* Bottom Grid: Intent Inspector (JSON / Plan) & Contextual Memory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[340px]">
            {/* Real-time Intent & Action Inspector */}
            <IntentInspector
              actionPayload={actionPayload}
              multiStepPlan={multiStepPlan}
              actionHistory={actionHistory}
            />

            {/* Contextual Memory Manager */}
            <MemoryPanel
              memories={memories}
              onAddMemory={handleAddMemory}
              onDeleteMemory={handleDeleteMemory}
            />
          </div>
        </div>

        {/* FULL WIDTH SECTION: Android Control Architecture & Real Device Bridge */}
        <div className="lg:col-span-12 w-full mt-2">
          <AndroidControlPanel
            executionMode={executionMode}
            onToggleExecutionMode={(mode) => setExecutionMode(mode)}
            onExecuteAndroidCommand={(action, target, params) => {
              console.log('Dispatched Android action:', action, target, params);
            }}
          />
        </div>
      </main>

      {/* Safety Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationState.isOpen}
        promptText={confirmationState.promptText}
        targetItem={confirmationState.targetItem}
        onConfirm={handleConfirmAction}
        onCancel={() =>
          setConfirmationState({ isOpen: false, promptText: '', targetItem: '', pendingActionPayload: null })
        }
      />
    </div>
  );
                    }
                      
