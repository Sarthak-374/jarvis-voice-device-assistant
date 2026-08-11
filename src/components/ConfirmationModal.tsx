import React from 'react';
import { AlertTriangle, ShieldAlert, Check, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  promptText: string;
  targetItem: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  promptText,
  targetItem,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in font-mono">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-red-500/60 rounded-2xl p-6 shadow-[0_0_50px_rgba(239,68,68,0.3)] space-y-4">
        {/* Header Icon */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-red-400 uppercase tracking-wider">
              CONFIRMATION REQUIRED
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              JARVIS Safety Protocol (Rule #12)
            </p>
          </div>
        </div>

        {/* Prompt Content */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <p className="text-sm font-semibold text-slate-100 font-sans">
            "{promptText || 'क्या मैं इसे delete कर दूँ?'}"
          </p>
          <div className="flex items-center gap-2 text-xs text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">Target: {targetItem}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Cancel (रद्द करें)</span>
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-red-600/30 transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Confirm (हाँ, कर दो)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
