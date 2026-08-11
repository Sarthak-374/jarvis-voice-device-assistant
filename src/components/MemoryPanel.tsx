import React, { useState } from 'react';
import { MemoryItem } from '../types';
import { Brain, Plus, Trash2, Tag, Sparkles } from 'lucide-react';

interface MemoryPanelProps {
  memories: MemoryItem[];
  onAddMemory: (key: string, value: string, category: MemoryItem['category']) => void;
  onDeleteMemory: (id: string) => void;
}

export const MemoryPanel: React.FC<MemoryPanelProps> = ({
  memories,
  onAddMemory,
  onDeleteMemory,
}) => {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [category, setCategory] = useState<MemoryItem['category']>('preference');
  const [isAdding, setIsAdding] = useState(false);

  const handleSave = () => {
    if (!newKey.trim() || !newValue.trim()) return;
    onAddMemory(newKey, newValue, category);
    setNewKey('');
    setNewValue('');
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/90 rounded-2xl border border-cyan-500/20 backdrop-blur-md shadow-2xl p-3.5 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-bold text-cyan-300 tracking-wider">JARVIS CONTEXTUAL MEMORY</span>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-2.5 py-1 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 rounded-lg flex items-center gap-1 font-bold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAdding ? 'Close' : 'Add Memory'}</span>
        </button>
      </div>

      {/* Manual Memory Form */}
      {isAdding && (
        <div className="mt-3 p-3 bg-slate-900 rounded-xl border border-cyan-500/30 space-y-2 animate-fade-in">
          <input
            type="text"
            placeholder="Memory Title (e.g. Favorite Fruit)"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="w-full bg-slate-950 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 outline-none text-xs"
          />
          <input
            type="text"
            placeholder="Value (e.g. Mango / आम)"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="w-full bg-slate-950 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 outline-none text-xs"
          />
          <div className="flex items-center justify-between pt-1">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as MemoryItem['category'])}
              className="bg-slate-950 text-slate-300 px-2 py-1 rounded-lg border border-slate-700 text-[11px]"
            >
              <option value="preference">Preference</option>
              <option value="project">Project</option>
              <option value="goal">Goal</option>
              <option value="general">General</option>
            </select>
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs"
            >
              Save Memory
            </button>
          </div>
        </div>
      )}

      {/* Memory List */}
      <div className="flex-1 mt-3 space-y-2 overflow-y-auto pr-1">
        {memories.length > 0 ? (
          memories.map((mem) => (
            <div
              key={mem.id}
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 transition-colors flex items-start justify-between gap-2 group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <Tag className="w-3 h-3 text-cyan-400" />
                  <span className="font-bold text-slate-200 text-xs">{mem.key}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-950 text-cyan-400 border border-cyan-500/30">
                    {mem.category}
                  </span>
                </div>
                <p className="text-xs text-emerald-300 font-sans">{mem.value}</p>
                <span className="text-[9px] text-slate-500 block mt-1">{mem.createdAt}</span>
              </div>
              <button
                onClick={() => onDeleteMemory(mem.id)}
                className="text-slate-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete Memory"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-slate-500">
            <Sparkles className="w-8 h-8 text-slate-700 mx-auto mb-2" />
            <p>No memories stored.</p>
            <p className="text-[10px] text-slate-600 mt-1">Say "इसे याद रखना कि..." to save memories naturally.</p>
          </div>
        )}
      </div>
    </div>
  );
};
