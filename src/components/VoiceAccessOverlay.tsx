import React from 'react';
import { UIElement } from '../types';

interface VoiceAccessOverlayProps {
  elements: UIElement[];
  active: boolean;
  onSelectElement: (element: UIElement) => void;
  highlightedElementId?: number | null;
}

export const VoiceAccessOverlay: React.FC<VoiceAccessOverlayProps> = ({
  elements,
  active,
  onSelectElement,
  highlightedElementId,
}) => {
  if (!active || !elements || elements.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {elements.map((el) => {
        const isHighlighted = highlightedElementId === el.id;

        return (
          <div
            key={el.id}
            style={{ left: `${el.xPct}%`, top: `${el.yPct}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer transition-all duration-200 flex items-center justify-center ${
              isHighlighted ? 'scale-125 z-40' : 'scale-100 hover:scale-110 z-30'
            }`}
            onClick={() => onSelectElement(el)}
            title={`Tag #${el.id}: ${el.label} (${el.type})`}
          >
            {/* Tag Badge */}
            <div
              className={`flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full font-mono text-[11px] font-bold shadow-lg border transition-colors ${
                isHighlighted
                  ? 'bg-amber-400 text-slate-950 border-amber-300 ring-4 ring-amber-400/50 animate-bounce'
                  : 'bg-cyan-500 text-slate-950 border-cyan-200 ring-2 ring-cyan-500/30'
              }`}
            >
              #{el.id}
            </div>

            {/* Target Label tooltip on hover or highlight */}
            {isHighlighted && (
              <div className="absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-cyan-300 text-[10px] px-2 py-0.5 rounded border border-cyan-400/50 shadow-xl font-mono">
                TAP: {el.label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
