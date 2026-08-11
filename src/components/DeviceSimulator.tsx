import React, { useState } from 'react';
import {
  AppName,
  SmartHomeState,
  DeviceSettings,
  ContactItem,
  AlarmItem,
  ReminderItem,
  FileItem,
  UIActionType,
  UIElement,
} from '../types';
import {
  Youtube,
  MessageSquare,
  Instagram,
  Globe,
  Camera,
  Home as HomeIcon,
  Settings as SettingsIcon,
  Bell,
  Phone,
  Folder,
  ArrowLeft,
  Search,
  Send,
  Plus,
  Play,
  Pause,
  Trash2,
  Check,
  Wifi,
  Bluetooth,
  Sun,
  Volume2,
  Power,
  PhoneCall,
  X,
  Sliders,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { VoiceAccessOverlay } from './VoiceAccessOverlay';

interface DeviceSimulatorProps {
  currentApp: AppName;
  onNavigateApp: (app: AppName) => void;
  smartHome: SmartHomeState;
  onUpdateSmartHome: (updated: Partial<SmartHomeState>) => void;
  deviceSettings: DeviceSettings;
  onUpdateDeviceSettings: (updated: Partial<DeviceSettings>) => void;
  contacts: ContactItem[];
  alarms: AlarmItem[];
  reminders: ReminderItem[];
  files: FileItem[];
  onDeleteFile: (fileId: string) => void;
  elements: UIElement[];
  voiceOverlayActive: boolean;
  onSelectElementTag: (el: UIElement) => void;
  lastExecutedAction: { action: UIActionType | string; target: string; timestamp: number } | null;
  activePhoneCall: { contactName: string; phoneNumber: string; duration: number } | null;
  onEndCall: () => void;
}

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({
  currentApp,
  onNavigateApp,
  smartHome,
  onUpdateSmartHome,
  deviceSettings,
  onUpdateDeviceSettings,
  contacts,
  alarms,
  reminders,
  files,
  onDeleteFile,
  elements,
  voiceOverlayActive,
  onSelectElementTag,
  lastExecutedAction,
  activePhoneCall,
  onEndCall,
}) => {
  // App-specific internal state
  const [youtubeSearch, setYoutubeSearch] = useState('Study Music 24/7');
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);

  const [activeWhatsappContact, setActiveWhatsappContact] = useState<ContactItem | null>(contacts[0]);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string }>>([
    { sender: 'Mummy', text: 'खाया क्या तुमने?' },
    { sender: 'You', text: 'हाँ मम्मी, प्रोजेक्ट पर काम कर रहा हूँ।' },
  ]);
  const [chatInput, setChatInput] = useState('');

  const [chromeUrl, setChromeUrl] = useState('https://www.youtube.com');

  const [cameraFlash, setCameraFlash] = useState(false);
  const [photoCaptured, setPhotoCaptured] = useState<string | null>(null);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { sender: 'You', text: chatInput }]);
    setChatInput('');
  };

  const handleCapturePhoto = () => {
    setPhotoCaptured(`Photo_${Date.now()}.jpg`);
    setTimeout(() => setPhotoCaptured(null), 3000);
  };

  return (
    <div className="relative w-full max-w-[380px] mx-auto h-[680px] bg-slate-950 rounded-[40px] border-[10px] border-slate-800 shadow-[0_0_50px_rgba(6,182,212,0.25)] flex flex-col overflow-hidden select-none">
      {/* Top Speaker Notch & Camera Dot */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-5 bg-slate-900 rounded-b-xl z-50 flex items-center justify-center gap-3">
        <div className="w-12 h-1 bg-slate-700 rounded-full" />
        <div className="w-2.5 h-2.5 bg-slate-800 rounded-full border border-slate-700" />
      </div>

      {/* Screen Top Status Bar */}
      <div className="w-full bg-slate-900/95 pt-6 pb-1 px-5 flex items-center justify-between text-[11px] text-slate-300 font-mono border-b border-slate-800/80 z-20">
        <span>08:12 AM</span>
        <div className="flex items-center gap-2">
          {deviceSettings.wifiEnabled && <Wifi className="w-3 h-3 text-cyan-400" />}
          {deviceSettings.bluetoothEnabled && <Bluetooth className="w-3 h-3 text-blue-400" />}
          <span className="text-[10px] text-emerald-400 font-bold">98%</span>
        </div>
      </div>

      {/* Active Gesture Overlay Animation (Ripple / Action Toast) */}
      {lastExecutedAction && Date.now() - lastExecutedAction.timestamp < 2500 && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-40 bg-cyan-500/90 text-slate-950 font-mono text-xs px-3 py-1 rounded-full shadow-2xl border border-cyan-200 flex items-center gap-1.5 animate-bounce">
          <span className="font-bold">[{lastExecutedAction.action}]</span>
          <span className="truncate max-w-[180px]">{lastExecutedAction.target}</span>
        </div>
      )}

      {/* Interactive Screen Area */}
      <div className="relative flex-1 bg-slate-900 text-slate-100 overflow-y-auto overflow-x-hidden font-sans">
        {/* Google Voice Access Tag Overlay Layer */}
        <VoiceAccessOverlay
          elements={elements}
          active={voiceOverlayActive}
          onSelectElement={onSelectElementTag}
        />

        {/* ==================== HOME SCREEN ==================== */}
        {currentApp === 'Home' && (
          <div className="p-5 flex flex-col h-full justify-between">
            <div>
              {/* Home Widget Header */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/80 to-slate-900 border border-cyan-500/30 text-center mb-6 shadow-lg">
                <p className="text-xs text-cyan-300 font-mono">JARVIS OS Simulator</p>
                <h2 className="text-xl font-bold text-slate-100 mt-0.5">Namaste, Sarthak</h2>
                <p className="text-[11px] text-slate-400 mt-1">
                  Say <strong className="text-cyan-300">"YouTube खोल दो"</strong> or click any app icon.
                </p>
              </div>

              {/* App Grid */}
              <div className="grid grid-cols-4 gap-4 text-center">
                {[
                  { name: 'YouTube', icon: Youtube, color: 'bg-red-600' },
                  { name: 'WhatsApp', icon: MessageSquare, color: 'bg-emerald-600' },
                  { name: 'Instagram', icon: Instagram, color: 'bg-pink-600' },
                  { name: 'Chrome', icon: Globe, color: 'bg-blue-600' },
                  { name: 'Camera', icon: Camera, color: 'bg-slate-700' },
                  { name: 'Smart Home', icon: HomeIcon, color: 'bg-cyan-600' },
                  { name: 'Settings', icon: SettingsIcon, color: 'bg-slate-800' },
                  { name: 'Reminders', icon: Bell, color: 'bg-amber-600' },
                  { name: 'Contacts', icon: Phone, color: 'bg-indigo-600' },
                  { name: 'Files', icon: Folder, color: 'bg-teal-600' },
                ].map((app) => {
                  const IconComp = app.icon;
                  return (
                    <button
                      key={app.name}
                      onClick={() => onNavigateApp(app.name as AppName)}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-800/80 transition-transform active:scale-95 group"
                    >
                      <div
                        className={`w-12 h-12 rounded-2xl ${app.color} flex items-center justify-center text-white shadow-lg group-hover:shadow-cyan-500/20`}
                      >
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-medium text-slate-300 truncate w-full">
                        {app.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Status Pill */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span className="text-slate-400 font-mono">Wi-Fi: {deviceSettings.wifiEnabled ? 'ON' : 'OFF'}</span>
              <span className="text-slate-400 font-mono">Volume: {deviceSettings.volume}%</span>
            </div>
          </div>
        )}

        {/* ==================== YOUTUBE SCREEN ==================== */}
        {currentApp === 'YouTube' && (
          <div className="flex flex-col h-full bg-slate-950">
            {/* Header / Search */}
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2">
              <div className="flex-1 bg-slate-800 rounded-lg flex items-center px-2.5 py-1.5 text-xs text-slate-200">
                <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
                <input
                  type="text"
                  value={youtubeSearch}
                  onChange={(e) => setYoutubeSearch(e.target.value)}
                  placeholder="Search YouTube..."
                  className="bg-transparent border-none outline-none w-full text-xs text-white"
                />
              </div>
              <button
                onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                className="p-2 bg-red-600 rounded-lg text-white hover:bg-red-700"
              >
                {isPlayingVideo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>

            {/* Main Player View */}
            <div className="p-3 space-y-3 flex-1 overflow-y-auto">
              <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex flex-col justify-end p-3 bg-cover bg-center" style={{ backgroundImage: 'radial-gradient(circle, rgba(15,23,42,0.8) 0%, rgba(2,6,23,0.95) 100%)' }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  {isPlayingVideo ? (
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 bg-red-500 h-8 animate-pulse rounded-full" />
                      <span className="w-1.5 bg-red-400 h-12 animate-pulse rounded-full" />
                      <span className="w-1.5 bg-red-500 h-6 animate-pulse rounded-full" />
                    </div>
                  ) : (
                    <Play className="w-12 h-12 text-slate-400 opacity-60" />
                  )}
                </div>
                <div className="relative z-10 bg-slate-950/80 p-2 rounded-lg backdrop-blur">
                  <p className="text-xs font-bold text-white truncate">{youtubeSearch}</p>
                  <p className="text-[10px] text-slate-400">1.2M views • Playing via JARVIS</p>
                </div>
              </div>

              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Recommended Videos</h4>
              <div className="space-y-2">
                {[
                  { title: 'Study Lofi Music 24/7 Deep Focus', channel: 'Lofi Girl', views: '15M views' },
                  { title: 'Google AI Studio Tutorial for Beginners', channel: 'Tech Pulse', views: '450K views' },
                ].map((vid, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setYoutubeSearch(vid.title);
                      setIsPlayingVideo(true);
                    }}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800/80 flex gap-3 items-center cursor-pointer"
                  >
                    <div className="w-16 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-red-500">
                      <Youtube className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-200 truncate">{vid.title}</p>
                      <p className="text-[10px] text-slate-400">{vid.channel} • {vid.views}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== WHATSAPP SCREEN ==================== */}
        {currentApp === 'WhatsApp' && (
          <div className="flex flex-col h-full bg-slate-950">
            {/* Header */}
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                {activeWhatsappContact?.name[0] || 'M'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-white truncate">{activeWhatsappContact?.name}</h3>
                <p className="text-[10px] text-emerald-400 font-mono">online</p>
              </div>
            </div>

            {/* Chat Conversation */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col max-w-[80%] ${
                    msg.sender === 'You' ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-2xl text-xs ${
                      msg.sender === 'You'
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-500 mt-0.5 font-mono">08:12 AM</span>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-2 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder="Type a message..."
                className="flex-1 bg-slate-800 text-xs text-white px-3 py-2 rounded-full outline-none border border-slate-700"
              />
              <button
                onClick={handleSendChat}
                className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white hover:bg-emerald-500"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ==================== INSTAGRAM SCREEN ==================== */}
        {currentApp === 'Instagram' && (
          <div className="p-4 bg-slate-950 h-full overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white tracking-wider">Instagram</h2>
              <button className="px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg text-xs font-semibold">
                Follow Back
              </button>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-0.5">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs">
                    S
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">sarthak_esports</h4>
                  <p className="text-[10px] text-slate-400">AI & Developer Community</p>
                </div>
              </div>
              <div className="aspect-square rounded-xl bg-slate-800 border border-slate-700/50 flex flex-col items-center justify-center p-4 text-center">
                <Instagram className="w-10 h-10 text-pink-500 mb-2" />
                <p className="text-xs text-slate-300 font-mono">Profile Screen Control Simulator</p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== CHROME SCREEN ==================== */}
        {currentApp === 'Chrome' && (
          <div className="flex flex-col h-full bg-slate-950">
            <div className="p-2.5 bg-slate-900 border-b border-slate-800 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <input
                type="text"
                value={chromeUrl}
                onChange={(e) => setChromeUrl(e.target.value)}
                className="flex-1 bg-slate-800 text-xs text-slate-200 px-2.5 py-1.5 rounded-lg outline-none font-mono"
              />
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-3">
                <h3 className="text-base font-bold text-white">Google Search & Web Browser</h3>
                <p className="text-xs text-slate-400">Navigated to: <span className="text-cyan-400 font-mono">{chromeUrl}</span></p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button onClick={() => onNavigateApp('YouTube')} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200">
                    Open YouTube
                  </button>
                  <button onClick={() => setChromeUrl('https://chatgpt.com')} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200">
                    Open ChatGPT
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== CAMERA SCREEN ==================== */}
        {currentApp === 'Camera' && (
          <div className="relative h-full bg-slate-950 flex flex-col justify-between p-4">
            <div className="flex items-center justify-between text-white z-10">
              <button
                onClick={() => setCameraFlash(!cameraFlash)}
                className={`p-2 rounded-full ${cameraFlash ? 'bg-amber-400 text-slate-950' : 'bg-slate-800'}`}
              >
                <Sun className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-cyan-300">PHOTO MODE</span>
            </div>

            {/* Viewfinder simulation */}
            <div className="relative aspect-[3/4] bg-slate-900 rounded-2xl border-2 border-dashed border-cyan-500/40 flex items-center justify-center overflow-hidden">
              <Camera className="w-16 h-16 text-cyan-400/40 animate-pulse" />
              {photoCaptured && (
                <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-4 text-center animate-fade-in">
                  <Check className="w-10 h-10 text-emerald-400 mb-2" />
                  <p className="text-xs font-bold text-white">Photo Captured!</p>
                  <p className="text-[10px] text-slate-400 font-mono">{photoCaptured}</p>
                </div>
              )}
            </div>

            {/* Shutter Controls */}
            <div className="flex items-center justify-center pb-2">
              <button
                onClick={handleCapturePhoto}
                className="w-14 h-14 rounded-full border-4 border-white bg-red-600 hover:bg-red-500 shadow-xl active:scale-90 transition-transform"
              />
            </div>
          </div>
        )}

        {/* ==================== SMART HOME SCREEN ==================== */}
        {currentApp === 'Smart Home' && (
          <div className="p-4 bg-slate-950 h-full overflow-y-auto space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <HomeIcon className="w-5 h-5 text-cyan-400" />
              Smart Home Control
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {/* Bedroom Light */}
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between h-28">
                <div className="flex items-center justify-between">
                  <Sun className={`w-5 h-5 ${smartHome.bedroomLight ? 'text-amber-400' : 'text-slate-600'}`} />
                  <button
                    onClick={() => onUpdateSmartHome({ bedroomLight: !smartHome.bedroomLight })}
                    className={`w-9 h-5 rounded-full transition-colors relative ${
                      smartHome.bedroomLight ? 'bg-cyan-500' : 'bg-slate-700'
                    }`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${smartHome.bedroomLight ? 'left-4' : 'left-0.5'}`} />
                  </button>
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Bedroom Light</p>
                  <p className="text-[10px] text-slate-400">{smartHome.bedroomLight ? 'ON (80%)' : 'OFF'}</p>
                </div>
              </div>

              {/* Living Room Light */}
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between h-28">
                <div className="flex items-center justify-between">
                  <Sun className={`w-5 h-5 ${smartHome.livingRoomLight ? 'text-amber-400' : 'text-slate-600'}`} />
                  <button
                    onClick={() => onUpdateSmartHome({ livingRoomLight: !smartHome.livingRoomLight })}
                    className={`w-9 h-5 rounded-full transition-colors relative ${
                      smartHome.livingRoomLight ? 'bg-cyan-500' : 'bg-slate-700'
                    }`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${smartHome.livingRoomLight ? 'left-4' : 'left-0.5'}`} />
                  </button>
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Living Room Light</p>
                  <p className="text-[10px] text-slate-400">{smartHome.livingRoomLight ? 'ON (100%)' : 'OFF'}</p>
                </div>
              </div>

              {/* AC Control */}
              <div className="col-span-2 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Power className={`w-4 h-4 ${smartHome.acPower ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span className="text-xs font-bold text-white">Air Conditioner</span>
                  </div>
                  <button
                    onClick={() => onUpdateSmartHome({ acPower: !smartHome.acPower })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      smartHome.acPower ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {smartHome.acPower ? 'ON' : 'OFF'}
                  </button>
                </div>
                {smartHome.acPower && (
                  <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-300 font-mono">Temp: <strong className="text-cyan-300 text-base">{smartHome.acTemp}°C</strong></span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateSmartHome({ acTemp: smartHome.acTemp - 1 })}
                        className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700 font-bold"
                      >
                        -
                      </button>
                      <button
                        onClick={() => onUpdateSmartHome({ acTemp: smartHome.acTemp + 1 })}
                        className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== SETTINGS SCREEN ==================== */}
        {currentApp === 'Settings' && (
          <div className="p-4 bg-slate-950 h-full overflow-y-auto space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-cyan-400" />
              Device Settings
            </h2>

            <div className="space-y-3">
              {/* Wi-Fi */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wifi className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-slate-200">Wi-Fi Connection</span>
                </div>
                <button
                  onClick={() => onUpdateDeviceSettings({ wifiEnabled: !deviceSettings.wifiEnabled })}
                  className={`w-9 h-5 rounded-full relative transition-colors ${
                    deviceSettings.wifiEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${deviceSettings.wifiEnabled ? 'left-4' : 'left-0.5'}`} />
                </button>
              </div>

              {/* Bluetooth */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bluetooth className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-slate-200">Bluetooth</span>
                </div>
                <button
                  onClick={() => onUpdateDeviceSettings({ bluetoothEnabled: !deviceSettings.bluetoothEnabled })}
                  className={`w-9 h-5 rounded-full relative transition-colors ${
                    deviceSettings.bluetoothEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${deviceSettings.bluetoothEnabled ? 'left-4' : 'left-0.5'}`} />
                </button>
              </div>

              {/* Brightness */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300 font-mono">
                  <span>Display Brightness</span>
                  <span className="text-cyan-300">{deviceSettings.brightness}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={deviceSettings.brightness}
                  onChange={(e) => onUpdateDeviceSettings({ brightness: Number(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Volume */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300 font-mono">
                  <span>Media Volume</span>
                  <span className="text-cyan-300">{deviceSettings.volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={deviceSettings.volume}
                  onChange={(e) => onUpdateDeviceSettings({ volume: Number(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== REMINDERS & ALARMS ==================== */}
        {currentApp === 'Reminders' && (
          <div className="p-4 bg-slate-950 h-full overflow-y-auto space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" />
              Alarms & Reminders
            </h2>

            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase text-slate-400">Active Alarms</h4>
              {alarms.map((alarm) => (
                <div key={alarm.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-base font-bold text-cyan-300 font-mono">{alarm.time}</p>
                    <p className="text-[10px] text-slate-400">{alarm.label}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${alarm.enabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-500'}`}>
                    {alarm.enabled ? 'ENABLED' : 'OFF'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== CONTACTS SCREEN ==================== */}
        {currentApp === 'Contacts' && (
          <div className="p-4 bg-slate-950 h-full overflow-y-auto space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Phone className="w-5 h-5 text-indigo-400" />
              Phone Contacts
            </h2>

            <div className="space-y-2">
              {contacts.map((contact) => (
                <div key={contact.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">{contact.name}</p>
                    <p className="text-[10px] text-slate-400">{contact.relationship || 'Contact'} • {contact.phoneNumber}</p>
                  </div>
                  <button
                    onClick={() => {
                      alert(`Initiating phone call to ${contact.name}...`);
                    }}
                    className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== FILES SCREEN ==================== */}
        {currentApp === 'Files' && (
          <div className="p-4 bg-slate-950 h-full overflow-y-auto space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Folder className="w-5 h-5 text-teal-400" />
              File Storage
            </h2>

            <div className="space-y-2">
              {files.map((file) => (
                <div key={file.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white truncate max-w-[180px]">{file.name}</p>
                    <p className="text-[10px] text-slate-400">{file.size} • {file.updatedAt}</p>
                  </div>
                  <button
                    onClick={() => onDeleteFile(file.id)}
                    className="p-2 bg-red-950 hover:bg-red-900 text-red-400 rounded-lg border border-red-800/50"
                    title="Delete File (Triggers Confirmation)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Screen Bottom Navigation Bar (BACK, HOME, RECENT) */}
      <div className="w-full bg-slate-950 py-2.5 px-8 border-t border-slate-800 flex items-center justify-around text-slate-400 z-20">
        <button
          onClick={() => onNavigateApp('Home')}
          className="p-1 hover:text-cyan-400 active:scale-90 transition-transform"
          title="Back Button"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => onNavigateApp('Home')}
          className="w-4 h-4 rounded-full border-2 border-slate-400 hover:border-cyan-400 active:scale-90 transition-transform"
          title="Home Button"
        />
        <button
          onClick={() => onNavigateApp('Settings')}
          className="p-1 hover:text-cyan-400 active:scale-90 transition-transform"
          title="Recent Apps / Settings"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
