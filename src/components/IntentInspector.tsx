import React, { useState } from 'react';
import { ActionPayload, MultiStepItem, IntentCategory } from '../types';
import { Terminal, Cpu, ListChecks, History, CheckCircle2, Clock, AlertTriangle, Code } from 'lucide-react';

interface IntentInspectorProps {
  actionPayload: ActionPayload | null;
  multiStepPlan: MultiStepItem[];
  actionHistory: Array<{ timestamp: string; prompt: string; payload: ActionPayload }>;
}

export const IntentInspector: React.FC<IntentInspectorProps> = ({
  actionPayload,
  multiStepPlan,
  actionHistory,
}) => {
  const [activeTab, setActiveTab] = useState<'json' | 'plan' | 'history'>('json');

  return (
    <div className="flex flex-col h-full bg-slate-950/90 rounded-2xl border border-cyan-500/20 backdrop-blur-md shadow-2xl overflow-hidden font-mono text-xs">
      {/* Inspector Header Tabs */}
      <div className="bg-slate-900 px-3 py-2 border-b border-cyan-500/20 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-cyan-300 tracking-wider">JARVIS INTENT ENGINE</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('json')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
              activeTab === 'json' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3 h-3" />
            <span>JSON Payload</span>
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 relative ${
              activeTab === 'plan' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListChecks className="w-3 h-3" />
            <span>Plan Queue</span>
            {multiStepPlan.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute top-0.5 right-0.5" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
              activeTab === 'history' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3 h-3" />
            <span>Action Log</span>
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 p-3 overflow-y-auto">
        {/* TAB 1: JSON Action Payload */}
        {activeTab === 'json' && (
          <div className="space-y-3">
            {actionPayload ? (
              <>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block">INTENT CATEGORY</span>
                    <strong className="text-cyan-300 font-bold text-xs">{actionPayload.intent}</strong>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block">CONFIDENCE SCORE</span>
                    <strong className={`font-bold text-xs ${actionPayload.confidence >= 0.8 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {Math.round(actionPayload.confidence * 100)}%
                    </strong>
                  </div>
                </div>

                <div className="relative bg-slate-900/90 p-3 rounded-xl border border-cyan-500/30 text-emerald-300 overflow-x-auto shadow-inner">
                  <pre className="text-[11px] leading-relaxed">
                    {JSON.stringify(actionPayload, null, 2)}
                  </pre>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12 text-center">
                <Cpu className="w-10 h-10 text-slate-700 mb-2 animate-pulse" />
                <p>Awaiting voice or text input...</p>
                <p className="text-[10px] text-slate-600 mt-1">Intent JSON payload will stream in real-time.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Multi-step Plan Queue */}
        {activeTab === 'plan' && (
          <div className="space-y-3">
            {multiStepPlan.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[11px] text-cyan-400 font-semibold mb-2">Executing Sequential Plan ({multiStepPlan.length} Steps)</p>
                {multiStepPlan.map((step) => (
                  <div
                    key={step.id}
                    className={`p-2.5 rounded-xl border flex items-start gap-3 transition-all ${
                      step.status === 'completed'
                        ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                        : step.status === 'executing'
                        ? 'bg-amber-950/40 border-amber-500/40 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="mt-0.5">
                      {step.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : step.status === 'executing' ? (
                        <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-600 text-[10px] flex items-center justify-center font-bold">
                          {step.stepNumber}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">Step {step.stepNumber}: {step.description}</span>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">
                          {step.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                        Target: {step.actionPayload.target} ({step.actionPayload.action})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12 text-center">
                <ListChecks className="w-10 h-10 text-slate-700 mb-2" />
                <p>No multi-step plan active.</p>
                <p className="text-[10px] text-slate-600 mt-1 max-w-xs">
                  Try saying: "Chrome खोलो, YouTube पर जाओ और study music चलाओ."
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Action Log History */}
        {activeTab === 'history' && (
          <div className="space-y-2">
            {actionHistory.length > 0 ? (
              actionHistory.map((item, idx) => (
                <div key={idx} className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span className="text-cyan-300 font-bold">{item.payload.intent}</span>
                    <span>{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-200 font-sans">"{item.prompt}"</p>
                  <p className="text-[10px] text-emerald-400 font-mono">
                    Action: {item.payload.action} → {item.payload.target}
                  </p>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12 text-center">
                <History className="w-10 h-10 text-slate-700 mb-2" />
                <p>No history logged yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
