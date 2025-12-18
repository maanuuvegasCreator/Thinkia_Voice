import React from 'react';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Tickets = () => {
    // Tickets derived from latest calls/webhooks
    const tickets = [
        { id: 'T-2045', subject: 'Reporte de Avería - Juan Pérez', assignee: 'Agente Técnico IA', priority: 'Alta', status: 'Abierto' },
        { id: 'T-2046', subject: 'Seguimiento Comercial - Carlos', assignee: 'Equipo Ventas', priority: 'Media', status: 'En Progreso' },
        { id: 'T-2047', subject: 'Envío Urgente - Farmacia', assignee: 'Logística', priority: 'Crítica', status: 'Pendiente' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Gestión de Casos</h2>
                <p className="text-muted-foreground">Administración de tickets de soporte y seguimiento de incidencias.</p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                        <FileText className="w-5 h-5 text-violet-500" />
                        Tickets de Soporte
                    </h3>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-500/20">
                        + Nuevo Ticket
                    </button>
                </div>
                <div className="grid gap-4">
                    {tickets.map(ticket => (
                        <div key={ticket.id} className="group flex items-center justify-between p-4 glass-card rounded-xl hover:bg-white/[0.05] transition-all cursor-pointer border border-white/[0.05] hover:border-blue-500/30">
                            <div className="flex items-start gap-4">
                                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg border",
                                    ticket.priority === 'Crítica' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                                        ticket.priority === 'Alta' ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                                            "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                )}>
                                    {ticket.id.split('-')[1]}
                                </div>
                                <div>
                                    <h4 className="font-medium text-foreground group-hover:text-blue-400 transition-colors">{ticket.subject}</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Asignado a: {ticket.assignee} • Prioridad: {ticket.priority}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={cn("px-2 py-1 rounded-full text-xs font-medium border",
                                    ticket.status === 'Abierto' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                        ticket.status === 'Pendiente' ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                                            "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                )}>
                                    {ticket.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
