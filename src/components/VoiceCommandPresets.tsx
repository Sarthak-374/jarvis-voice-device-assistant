import React from 'react';
import { SAMPLE_VOICE_COMMANDS } from '../data/mockScreenData';
import { Sparkles, MessageSquare } from 'lucide-react';

interface VoiceCommandPresetsProps {
  onSelectCommand: (commandText: string) => void;
}

export const VoiceCommandPresets: React.FC<VoiceCommandPresetsProps> = ({ onSelectCommand }) => {
  return (
    <div className="bg-slate-950/80 rounded-2xl border border-cyan-500/20 p-3.5 backdrop-blur-md font-mono text-xs shadow-xl">
      <div className="flex items-center gap-2 mb-2.5">
        <Sparkles className="w-4 h-4 text-cyan-400" />
        <span className="font-bold text-cyan-300 tracking-wider">SAMPLE VOICE PROMPTS (HINGLISH / HINDI / ENGLISH)</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {SAMPLE_VOICE_COMMANDS.map((cmd, idx) => (
          <button
            key={idx}
            onClick={() => onSelectCommand(cmd.text)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-200 font-sans text-xs flex items-center gap-2 transition-all active:scale-95 group text-left"
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
            <span>{cmd.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
