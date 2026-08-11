import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  ShieldAlert,
  Radio,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Zap,
  Lock,
  Code2,
  RefreshCw,
  Power,
  Play,
  Volume2,
  Copy,
  Check,
  Globe,
  ArrowRight,
} from 'lucide-react';
import {
  ExecutionMode,
  BridgeStatus,
  AndroidActionType,
  AndroidActionCommand,
} from '../android/types';

interface AndroidControlPanelProps {
  executionMode: ExecutionMode;
  onToggleExecutionMode: (mode: ExecutionMode) => void;
  onExecuteAndroidCommand?: (action: AndroidActionType, target: string, params?: any) => void;
}

export const AndroidControlPanel: React.FC<AndroidControlPanelProps> = ({
  executionMode,
  onToggleExecutionMode,
  onExecuteAndroidCommand,
}) => {
  const [bridgeStatus, setBridgeStatus] = useState<BridgeStatus>('disconnected');
  const [deviceModel, setDeviceModel] = useState<string | null>(null);
  const [androidVersion, setAndroidVersion] = useState<string | null>(null);
  const [ipAddress, setIpAddress] = useState<string>('192.168.1.105');
  const [pairingToken, setPairingToken] = useState<string>('JARVIS-8890-ANDROID');
  const [accessibilityGranted, setAccessibilityGranted] = useState(false);
  const [isPairing, setIsPairing] = useState(false);
  const [commandHistory, setCommandHistory] = useState<Array<{ id: string; action: string; target: string; time: string; status: string }>>([]);
  const [selectedAction, setSelectedAction] = useState<AndroidActionType>('TAP');
  const [actionTargetInput, setActionTargetInput] = useState('x:540, y:1200');
  const [actionTextInput, setActionTextInput] = useState('Hello JARVIS');
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'architecture' | 'bridge' | 'developer'>('architecture');

  // Fetch Bridge Status from Backend Server
  const fetchBridgeStatus = async () => {
    try {
      const res = await fetch('/api/android/status');
      const data = await res.json();
      setBridgeStatus(data.bridgeStatus);
      setDeviceModel(data.deviceModel);
      setAndroidVersion(data.androidVersion);
      setAccessibilityGranted(data.accessibilityGranted);
    } catch (e) {
      console.warn('Failed to fetch Android bridge status:', e);
    }
  };

  useEffect(() => {
    fetchBridgeStatus();
    const interval = setInterval(fetchBridgeStatus, 4000);
    return () => clearInterval(interval);
  }, []);

  // Simulate or Perform Pairing with Backend API
  const handleTogglePairing = async () => {
    setIsPairing(true);
    try {
      const nextToken = bridgeStatus === 'connected' ? 'DISCONNECT' : pairingToken;
      const res = await fetch('/api/android/pair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: nextToken,
          deviceModel: 'Samsung Galaxy S24 Ultra (Android Bridge)',
          androidVersion: 'Android 15 (API 35)',
          ipAddress: '192.168.1.105',
          accessibilityGranted: true,
        }),
      });

      const data = await res.json();
      setBridgeStatus(data.bridgeState?.bridgeStatus || (nextToken === 'DISCONNECT' ? 'disconnected' : 'connected'));
      setDeviceModel(data.bridgeState?.deviceModel || null);
      setAndroidVersion(data.bridgeState?.androidVersion || null);
      setAccessibilityGranted(data.bridgeState?.accessibilityGranted || false);
    } catch (err) {
      console.error('Pairing error:', err);
    } finally {
      setIsPairing(false);
    }
  };

  // Dispatch Action Command to API Endpoint
  const handleTestDispatch = async () => {
    if (!selectedAction) return;

    try {
      const res = await fetch('/api/android/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: selectedAction,
          target: actionTargetInput,
          parameters: selectedAction === 'TYPE_TEXT' ? { text: actionTextInput } : {},
          requiresConfirmation: selectedAction === 'OPEN_APP' && actionTargetInput.includes('delete'),
        }),
      });

      const data = await res.json();
      const newCmd = {
        id: data.command?.id || `cmd_${Date.now()}`,
        action: selectedAction,
        target: actionTargetInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        status: bridgeStatus === 'connected' ? 'Dispatched to Android Companion' : 'Queued (Accessibility Service Required)',
      };

      setCommandHistory((prev) => [newCmd, ...prev]);

      if (onExecuteAndroidCommand) {
        onExecuteAndroidCommand(selectedAction, actionTargetInput, { text: actionTextInput });
      }
    } catch (e) {
      console.error('Test dispatch failed:', e);
    }
  };

  const sampleManifestCode = `<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.jarvis.companion">

    <!-- JARVIS Core Android System Permissions -->
    <uses-permission android:name="android.permission.BIND_ACCESSIBILITY_SERVICE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />

    <application ...>
        <!-- Accessibility Service Registration -->
        <service
            android:name=".JarvisAccessibilityService"
            android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.accessibilityservice.AccessibilityService" />
            </intent-filter>
            <meta-data
                android:name="android.accessibilityservice"
                android:resource="@xml/accessibility_service_config" />
        </service>
    </application>
</manifest>`;

  const copyCode = () => {
    navigator.clipboard.writeText(sampleManifestCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="bg-slate-950/90 rounded-2xl border border-cyan-500/30 backdrop-blur-xl p-5 shadow-2xl font-mono text-xs space-y-5">
      {/* Top Title Bar & Execution Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Smartphone className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-cyan-300 tracking-wider">
                ANDROID CONTROL ARCHITECTURE
              </h2>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold">
                API 35 READY
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">
              Physical & Emulator Real Android Device Bridge Infrastructure
            </p>
          </div>
        </div>

        {/* Mode Toggle Switch */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onToggleExecutionMode('simulator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              executionMode === 'simulator'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Simulator Mode</span>
          </button>
          <button
            onClick={() => onToggleExecutionMode('real_device')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              executionMode === 'real_device'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Real Device Mode</span>
          </button>
        </div>
      </div>

      {/* REAL DEVICE MODE STATUS WARNING / BADGE */}
      {executionMode === 'real_device' && bridgeStatus !== 'connected' && (
        <div className="p-4 rounded-xl bg-amber-950/40 border-2 border-amber-500/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in shadow-[0_0_20px_rgba(245,158,11,0.15)]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex-shrink-0">
              <ShieldAlert className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-300 text-xs uppercase tracking-wider">
                  Android Accessibility Service Required
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px]">
                  DISCONNECTED
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans mt-0.5">
                Real device commands are queued until an Android Companion APK connects using the Accessibility Service.
              </p>
            </div>
          </div>
          <button
            onClick={handleTogglePairing}
            disabled={isPairing}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all flex-shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPairing ? 'animate-spin' : ''}`} />
            <span>Simulate Companion Connect</span>
          </button>
        </div>
      )}

      {/* CONNECTED BRIDGE STATUS BANNER */}
      {bridgeStatus === 'connected' && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between gap-3 text-emerald-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-pulse" />
            <div>
              <span className="font-bold text-xs text-emerald-200">
                BRIDGED TO {deviceModel || 'ANDROID DEVICE'} ({androidVersion})
              </span>
              <p className="text-[11px] text-emerald-400/80 font-sans">
                Accessibility Service Active • IP: {ipAddress} • Low Latency Socket Ready
              </p>
            </div>
          </div>
          <button
            onClick={handleTogglePairing}
            className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-[11px] font-bold"
          >
            Disconnect Bridge
          </button>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'architecture'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          1. Core 7 Services Matrix
        </button>
        <button
          onClick={() => setActiveTab('bridge')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'bridge'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          2. Action Command Dispatcher
        </button>
        <button
          onClick={() => setActiveTab('developer')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'developer'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          3. Android Manifest & Blueprint
        </button>
      </div>

      {/* TAB 1: 7 CORE SERVICES MATRIX */}
      {activeTab === 'architecture' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Service 1: Accessibility Service */}
          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                1. Accessibility Service
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                accessibilityGranted ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950 text-amber-400 border border-amber-500/30'
              }`}>
                {accessibilityGranted ? 'ACTIVE' : 'PERMISSION REQ'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              OS lifecycle interface capturing AccessibilityNodeInfo events & system gestures.
            </p>
            <div className="text-[10px] text-cyan-400/80 bg-slate-950 p-1.5 rounded border border-slate-850">
              Interface: IAccessibilityService
            </div>
          </div>

          {/* Service 2: Voice Input Service */}
          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                2. Voice Input Service
              </span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[9px] font-bold">
                16kHz PCM MONO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Captures low-latency audio stream with on-device offline wake word detection engine.
            </p>
            <div className="text-[10px] text-cyan-400/80 bg-slate-950 p-1.5 rounded border border-slate-850">
              Interface: IVoiceInputService
            </div>
          </div>

          {/* Service 3: Action Executor */}
          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                3. Action Executor
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">
                9 ACTIONS SUPPORTED
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Low-level gesture & node executor: TAP, LONG_PRESS, SWIPE, TYPE_TEXT, BACK, HOME, OPEN_APP, SCROLL, SEARCH.
            </p>
            <div className="text-[10px] text-cyan-400/80 bg-slate-950 p-1.5 rounded border border-slate-850">
              Interface: IActionExecutor
            </div>
          </div>

          {/* Service 4: App Launcher */}
          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                4. App Launcher
              </span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[9px] font-bold">
                INTENT DISPATCHER
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Queries PackageManager to resolve app aliases and trigger Intent launch / force stop.
            </p>
            <div className="text-[10px] text-cyan-400/80 bg-slate-950 p-1.5 rounded border border-slate-850">
              Interface: IAppLauncher
            </div>
          </div>

          {/* Service 5: Screen Reader */}
          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                5. Screen Reader
              </span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[9px] font-bold">
                NODE TREE PARSER
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Dumps active screen layout XML/AccessibilityNodeInfo for multi-modal contextual awareness.
            </p>
            <div className="text-[10px] text-cyan-400/80 bg-slate-950 p-1.5 rounded border border-slate-850">
              Interface: IScreenReader
            </div>
          </div>

          {/* Service 6: UI Element Detector */}
          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                6. UI Element Detector
              </span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[9px] font-bold">
                NLP TO NODE MAPPER
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Maps natural language descriptions or Tag IDs to exact bounding boxes and click centers.
            </p>
            <div className="text-[10px] text-cyan-400/80 bg-slate-950 p-1.5 rounded border border-slate-850">
              Interface: IUIElementDetector
            </div>
          </div>

          {/* Service 7: Confirmation Manager */}
          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-colors space-y-2 lg:col-span-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-red-400" />
                7. Confirmation Manager (JARVIS Safety Gateway)
              </span>
              <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/30 text-[9px] font-bold">
                RULE #12 HARD STOP
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Intercepts destructive commands (file deletion, factory resets, money transfers) and halts execution until physical user voice or modal confirmation is received.
            </p>
            <div className="text-[10px] text-cyan-400/80 bg-slate-950 p-1.5 rounded border border-slate-850">
              Interface: IConfirmationManager
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACTION COMMAND DISPATCHER */}
      {activeTab === 'bridge' && (
        <div className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
            <span className="font-bold text-cyan-300 text-xs block">
              DISPATCH TEST COMMAND TO REAL ANDROID DEVICE VIA BRIDGE API
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Action Type</label>
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value as AndroidActionType)}
                  className="w-full bg-slate-950 text-slate-200 px-3 py-2 rounded-lg border border-slate-700 outline-none text-xs"
                >
                  <option value="TAP">TAP (Single Touch)</option>
                  <option value="LONG_PRESS">LONG_PRESS (Hold 1000ms)</option>
                  <option value="SWIPE">SWIPE (Gesture Drag)</option>
                  <option value="TYPE_TEXT">TYPE_TEXT (Key Injection)</option>
                  <option value="BACK">BACK (Global Key 1)</option>
                  <option value="HOME">HOME (Global Key 2)</option>
                  <option value="OPEN_APP">OPEN_APP (Package Launch)</option>
                  <option value="SCROLL">SCROLL (Accessibility Scroll)</option>
                  <option value="SEARCH">SEARCH (Query Submit)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Target / Node Bounds</label>
                <input
                  type="text"
                  value={actionTargetInput}
                  onChange={(e) => setActionTargetInput(e.target.value)}
                  placeholder="Target (e.g. x:540, y:1200 or com.whatsapp)"
                  className="w-full bg-slate-950 text-slate-200 px-3 py-2 rounded-lg border border-slate-700 outline-none text-xs"
                />
              </div>

              {selectedAction === 'TYPE_TEXT' ? (
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Text String Payload</label>
                  <input
                    type="text"
                    value={actionTextInput}
                    onChange={(e) => setActionTextInput(e.target.value)}
                    placeholder="Text to type into focused field"
                    className="w-full bg-slate-950 text-slate-200 px-3 py-2 rounded-lg border border-slate-700 outline-none text-xs"
                  />
                </div>
              ) : (
                <div className="flex items-end">
                  <button
                    onClick={handleTestDispatch}
                    className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-cyan-500/20"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Queue Android Action</span>
                  </button>
                </div>
              )}
            </div>

            {selectedAction === 'TYPE_TEXT' && (
              <button
                onClick={handleTestDispatch}
                className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-cyan-500/20"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Queue TYPE_TEXT Action</span>
              </button>
            )}
          </div>

          {/* Command Dispatch History Log */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-slate-300 text-xs block">
              REAL DEVICE COMMAND QUEUE LOG ({commandHistory.length})
            </span>

            {commandHistory.length > 0 ? (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {commandHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold">
                        {item.action}
                      </span>
                      <span className="text-slate-300">Target: {item.target}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-[10px]">
                      <span>{item.time}</span>
                      <span className="text-amber-400/90 font-mono">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-xs py-2 text-center">
                No actions queued yet. Use the control form above to test dispatching.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: DEVELOPER BLUEPRINT & MANIFEST */}
      {activeTab === 'developer' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
            <div>
              <span className="font-bold text-slate-200 text-xs">ANDROID COMPANION APK MANIFEST SPECIFICATION</span>
              <p className="text-[11px] text-slate-400 font-sans">
                Paste this configuration into your native Android Studio project (`AndroidManifest.xml`).
              </p>
            </div>
            <button
              onClick={copyCode}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="p-4 bg-slate-950 text-cyan-300/90 rounded-xl border border-slate-800 overflow-x-auto text-[11px] leading-relaxed font-mono">
            {sampleManifestCode}
          </pre>
        </div>
      )}
    </div>
  );
};
