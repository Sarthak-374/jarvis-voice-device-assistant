import React, { useState, useEffect } from 'react';
import { Cpu, ShieldCheck, Volume2, VolumeX, Eye, EyeOff, Radio, Battery, Wifi, Sparkles } from 'lucide-react';

interface HeaderHUDProps {
  wakeWordActive: boolean;
  onToggleWakeWord: () => void;
  voiceOverlayActive: boolean;
  onToggleVoiceOverlay: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  activeApp: string;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  wakeWordActive,
  onToggleWakeWord,
  voiceOverlayActive,
  onToggleVoiceOverlay,
  soundEnabled,
  onToggleSound,
  activeApp,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-slate-950/90 border-b border-cyan-500/30 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-slate-200 backdrop-blur-md shadow-lg font-mono">
      {/* Brand & HUD Identity */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-cyan-300 tracking-wider">
              JARVIS Mark VII
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 font-semibold tracking-wider">
              ONLINE
            </span>
          </div>
          <p className="text-[10px] text-slate-400 tracking-tight font-sans">
            AI Voice & Device Assistant • Voice Access Enabled
          </p>
        </div>
      </div>

      {/* Center Status Badges */}
      <div className="hidden md:flex items-center gap-4 text-xs text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-cyan-500/20">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>Core: <strong className="text-cyan-300">Gemini 3.6</strong></span>
        </div>
        <div className="w-px h-3 bg-cyan-500/30" />
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Active App: <strong className="text-emerald-300">{activeApp}</strong></span>
        </div>
        <div className="w-px h-3 bg-cyan-500/30" />
        <div className="flex items-center gap-1.5 text-cyan-200">
          <Wifi className="w-3.5 h-3.5 text-cyan-400" />
          <span>5G Connected</span>
        </div>
      </div>

      {/* Action Controls & Toggles */}
      <div className="flex items-center gap-2 text-xs">
        {/* Voice Access Overlay Toggle */}
        <button
          onClick={onToggleVoiceOverlay}
          className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
            voiceOverlayActive
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle Google Voice Access Element Tag Overlays (#1, #2, #3...)"
        >
          {voiceOverlayActive ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline font-sans font-medium text-[11px]">
            Voice Tags {voiceOverlayActive ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Wake-Word Toggle */}
        <button
          onClick={onToggleWakeWord}
          className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
            wakeWordActive
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle Hands-Free Wake Word ('Hey Jarvis')"
        >
          <Radio className={`w-3.5 h-3.5 ${wakeWordActive ? 'text-emerald-400 animate-pulse' : ''}`} />
          <span className="hidden sm:inline font-sans font-medium text-[11px]">
            Wake-Word {wakeWordActive ? 'ACTIVE' : 'OFF'}
          </span>
        </button>

        {/* Sound/TTS Toggle */}
        <button
          onClick={onToggleSound}
          className={`p-1.5 rounded-lg border flex items-center justify-center transition-all ${
            soundEnabled
              ? 'bg-cyan-950 border-cyan-500/40 text-cyan-300'
              : 'bg-slate-900 border-slate-700 text-slate-500'
          }`}
          title={soundEnabled ? 'Speech Synthesis Output ON' : 'Speech Synthesis Muted'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Battery & Time */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800 text-slate-300 text-xs font-mono">
          <div className="flex items-center gap-1 text-emerald-400">
            <Battery className="w-3.5 h-3.5" />
            <span className="text-[11px]">98%</span>
          </div>
          <span className="text-cyan-300 font-semibold text-[11px] min-w-[65px] text-right">
            {currentTime}
          </span>
        </div>
      </div>
    </header>
  );
};
