import React from 'react';
import { Mic, MicOff, Volume2, Sparkles, Radio } from 'lucide-react';

interface ArcReactorProps {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  wakeWordDetected: boolean;
  isMuted: boolean;
  onToggleMic: () => void;
  statusText: string;
}

export const ArcReactor: React.FC<ArcReactorProps> = ({
  isListening,
  isProcessing,
  isSpeaking,
  wakeWordDetected,
  isMuted,
  onToggleMic,
  statusText,
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-slate-950/80 rounded-2xl border border-cyan-500/20 backdrop-blur-md shadow-2xl overflow-hidden group">
      {/* Background Holographic Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

      {/* Futuristic Corner Accents */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400/60" />

      {/* Arc Reactor Core Outer Glow Ring */}
      <div className="relative flex items-center justify-center w-48 h-48 my-2">
        {/* Outer Rotating Pulse Ring */}
        <div
          className={`absolute inset-0 rounded-full border-2 border-dashed ${
            isListening
              ? 'border-cyan-400 animate-[spin_8s_linear_infinite] shadow-[0_0_25px_rgba(6,182,212,0.6)]'
              : isSpeaking
              ? 'border-emerald-400 animate-[spin_4s_linear_infinite] shadow-[0_0_25px_rgba(16,185,129,0.6)]'
              : isProcessing
              ? 'border-amber-400 animate-[spin_2s_linear_infinite] shadow-[0_0_20px_rgba(245,158,11,0.5)]'
              : 'border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
          }`}
        />

        {/* Secondary Inner Ring */}
        <div
          className={`absolute inset-3 rounded-full border ${
            wakeWordDetected
              ? 'border-cyan-300 animate-ping opacity-75'
              : 'border-cyan-500/20'
          }`}
        />

        {/* Pulsing Core Sphere */}
        <div
          className={`w-32 h-32 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative z-10 ${
            isListening
              ? 'bg-cyan-500/20 border-2 border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.8)] scale-105'
              : isSpeaking
              ? 'bg-emerald-500/20 border-2 border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.8)]'
              : isProcessing
              ? 'bg-amber-500/20 border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.7)]'
              : 'bg-slate-900/90 border border-cyan-500/40 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
          }`}
          onClick={onToggleMic}
          title="Click to activate Voice Listening"
        >
          {/* Reactor Inner Glow Design */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.4)_0%,transparent_70%)] pointer-events-none" />

          {/* Central Icon */}
          <div className="relative z-10 flex flex-col items-center gap-1">
            {isProcessing ? (
              <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />
            ) : isSpeaking ? (
              <Volume2 className="w-8 h-8 text-emerald-400 animate-bounce" />
            ) : isListening ? (
              <Mic className="w-8 h-8 text-cyan-300 animate-pulse" />
            ) : (
              <MicOff className="w-8 h-8 text-slate-400 group-hover:text-cyan-300 transition-colors" />
            )}

            <span className="text-[10px] font-mono tracking-widest uppercase font-semibold text-cyan-200 mt-1">
              {isListening
                ? 'LISTENING'
                : isProcessing
                ? 'ANALYZING'
                : isSpeaking
                ? 'SPEAKING'
                : 'JARVIS CORE'}
            </span>
          </div>

          {/* Audio Wave Visualizer Simulation */}
          {(isListening || isSpeaking) && (
            <div className="absolute -bottom-1 flex items-end justify-center gap-1 h-5 z-20">
              <span className="w-1 bg-cyan-400 animate-[bounce_0.6s_infinite_100ms] rounded-full h-3" />
              <span className="w-1 bg-cyan-300 animate-[bounce_0.6s_infinite_200ms] rounded-full h-5" />
              <span className="w-1 bg-cyan-400 animate-[bounce_0.6s_infinite_300ms] rounded-full h-2" />
              <span className="w-1 bg-cyan-200 animate-[bounce_0.6s_infinite_150ms] rounded-full h-4" />
              <span className="w-1 bg-cyan-400 animate-[bounce_0.6s_infinite_250ms] rounded-full h-3" />
            </div>
          )}
        </div>
      </div>

      {/* Live Status Text & Wake Word Indicator */}
      <div className="flex flex-col items-center mt-3 text-center z-10">
        <div className="flex items-center gap-2 mb-1">
          <Radio className={`w-3.5 h-3.5 ${wakeWordDetected ? 'text-cyan-300 animate-pulse' : 'text-slate-500'}`} />
          <span className="text-xs font-mono text-cyan-300/80 tracking-wide">
            {statusText}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 max-w-xs font-sans">
          Say <strong className="text-cyan-300 font-mono">"Hey Jarvis"</strong> or click reactor to speak in Hindi, Hinglish, or English.
        </p>
      </div>
    </div>
  );
};
