import React from 'react';
import { X, Phone, CheckCircle, MessageSquare, AlertTriangle, User, Play, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionItem {
  id: string;
  type: 'ticket' | 'task';
  title: string;
  customer: string;
  priority: 'High' | 'Medium' | 'Low' | 'Critical';
  status: string;
  time: string;
  description: string;
  audioUrl?: string; // Simulated audio for context
}

interface ActionSidePanelProps {
  item: ActionItem | null;
  isOpen: boolean;
  onClose: () => void;
}

import { useNavigate } from 'react-router-dom';

export const ActionSidePanel = ({ item, isOpen, onClose }: ActionSidePanelProps) => {
  const navigate = useNavigate();
  
  if (!item) return null;

  return (
    <div className={cn(
      "fixed inset-y-0 right-0 w-[400px] bg-[#0a0a0f]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl transform transition-transform duration-300 z-50 flex flex-col",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
               item.type === 'ticket' ? "bg-violet-500/10 text-violet-400 border-violet-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            )}>
              {item.type === 'ticket' ? 'Ticket de Soporte' : 'Tarea Pendiente'}
            </span>
            <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
               item.priority === 'Critical' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : 
               item.priority === 'High' ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
               "bg-blue-500/10 text-blue-500 border-blue-500/20"
            )}>
              {item.priority}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-white leading-tight">{item.title}</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Customer Context */}
        <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {item.customer.charAt(0)}
                </div>
                <div>
                    <h3 className="font-medium text-white">{item.customer}</h3>
                    <p className="text-xs text-slate-400">+34 600 000 000 • Cliente desde 2023</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => navigate(`/clients?id=${item.customer}`)}
                  className="flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-slate-300 transition-colors"
                >
                    <User className="w-3.5 h-3.5" /> Ver Perfil
                </button>
                <button className="flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-slate-300 transition-colors">
                    <FileText className="w-3.5 h-3.5" /> Historial
                </button>
            </div>
        </div>

        {/* AI Context / Description */}
        <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5" /> Contexto de la IA
            </h4>
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-sm text-slate-300 leading-relaxed">
                {item.description}
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 bg-black/20 p-2 rounded-lg">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    Razón del Handoff: <span className="text-amber-400 font-medium">Confianza baja (45%) en intención de compra</span>
                </div>
            </div>
        </div>

        {/* Audio Player (Mock) */}
        <div>
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Play className="w-3.5 h-3.5" /> Grabación Relacionada
            </h4>
            <div className="h-12 bg-white/5 rounded-lg border border-white/5 flex items-center px-4 gap-3">
                <button className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform">
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                </button>
                <div className="flex-1 h-8 flex items-center gap-0.5 opacity-50">
                    {[...Array(20)].map((_,i) => (
                        <div key={i} className="flex-1 bg-blue-500 rounded-full" style={{height: `${Math.random() * 100}%`}}></div>
                    ))}
                </div>
                <span className="text-xs font-mono text-slate-400">-00:45</span>
            </div>
        </div>

      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-white/5 bg-[#0a0a0f] z-10">
        <div className="grid grid-cols-2 gap-3">
             <button className="flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
                <CheckCircle className="w-4 h-4" />
                Resolver
            </button>
            <button className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-900/20 active:scale-95">
                <Phone className="w-4 h-4" />
                Llamar Ahora
            </button>
        </div>
      </div>
    </div>
  );
};
