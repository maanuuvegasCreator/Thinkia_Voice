import React, { useState } from 'react';
import { Inbox, Search, Clock, CheckSquare, ChevronRight, Zap, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ActionSidePanel } from '@/components/ActionSidePanel';

export const ActionCenter = () => {
    // Mock Data - Merged Tasks & Tickets
    const items = [
        { id: '1', type: 'ticket', title: 'Fallo en validación de dirección', customer: 'Farmacia Llobregat', priority: 'Critical', status: 'Open', time: 'Hace 5 min', description: 'El cliente mencionó una dirección que no coincide con la base de datos. La IA no pudo confirmar el envío.' },
        { id: '2', type: 'task', title: 'Confirmar interés en campaña', customer: 'Dr. Roberto M.', priority: 'High', status: 'Pending', time: 'Hace 25 min', description: 'Cliente mostró interés en "Pack Verano" pero colgó antes del cierre. Retomar llamada.' },
        { id: '3', type: 'ticket', title: 'Solicitud de baja', customer: 'Clinica Dental Sur', priority: 'Medium', status: 'Open', time: 'Hace 1 hora', description: 'Cliente solicita hablar con supervisor para cancelar servicio.' },
        { id: '4', type: 'task', title: 'Revisión de grabación (QA)', customer: 'Hospital General', priority: 'Low', status: 'Pending', time: 'Hace 3 horas', description: 'Validar si la IA respondió correctamente a la pregunta sobre facturación.' },
    ];

    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [filter, setFilter] = useState('all');

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6 animate-in fade-in duration-500">
            {/* Main List Section */}
            <div className="flex-1 flex flex-col h-full">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
                        <Inbox className="w-8 h-8 text-blue-500" />
                        Centro de Acción
                    </h2>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Supervisión en tiempo real • {items.length} pendientes
                    </p>
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex bg-secondary/30 p-1 rounded-xl border border-white/5">
                        {['all', 'urgent', 'tickets', 'tasks'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    "px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize",
                                    filter === f ? "bg-white/10 text-white shadow-sm" : "text-muted-foreground hover:text-white hover:bg-white/5"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-64">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                            type="text" 
                            placeholder="Buscar en inbox..." 
                            className="w-full bg-secondary/30 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>
                </div>

                {/* List Container */}
                <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin space-y-3">
                    {items.map((item) => (
                        <div 
                            key={item.id}
                            onClick={() => setSelectedItem(item as any)}
                            className={cn(
                                "group relative p-4 rounded-xl border transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]",
                                selectedItem?.id === item.id 
                                    ? "bg-blue-500/10 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]" 
                                    : "bg-secondary/20 border-white/5 hover:bg-secondary/40 hover:border-white/10"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                {/* Icon / Type Indicator */}
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-colors",
                                    item.type === 'ticket' 
                                        ? "bg-violet-500/10 border-violet-500/20 text-violet-400 group-hover:bg-violet-500/20" 
                                        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/20"
                                )}>
                                    {item.type === 'ticket' ? <FileText className="w-6 h-6" /> : <CheckSquare className="w-6 h-6" />}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-white truncate">{item.title}</h4>
                                        {item.priority === 'Critical' && (
                                            <span className="bg-rose-500/20 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-500/20 flex items-center gap-1">
                                                <Zap className="w-3 h-3 fill-current" /> CRÍTICO
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-400 truncate flex items-center gap-2">
                                        <span className="text-slate-300">{item.customer}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                        <span>{item.description}</span>
                                    </p>
                                </div>

                                {/* Meta */}
                                <div className="text-right shrink-0">
                                    <div className="text-xs font-medium text-slate-400 mb-1 flex items-center justify-end gap-1.5">
                                        <Clock className="w-3.5 h-3.5" /> {item.time}
                                    </div>
                                    <div className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end gap-1 text-xs font-bold uppercase tracking-wider">
                                        Ver Detalles <ChevronRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Side Panel Overlay */}
            <ActionSidePanel 
                item={selectedItem} 
                isOpen={!!selectedItem} 
                onClose={() => setSelectedItem(null)} 
            />
        </div>
    );
};
