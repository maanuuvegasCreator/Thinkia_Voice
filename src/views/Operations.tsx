import React, { useState } from 'react';
import { Users, FileText, CheckSquare, Search, MoreHorizontal, AlertCircle, PhoneIncoming } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Operations = () => {
    const [activeTab, setActiveTab] = useState<'clients' | 'tickets' | 'tasks'>('clients');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Operaciones y Logística</h2>
                    <p className="text-muted-foreground">Gestión de datos de clientes, tickets de soporte y tareas operativas.</p>
                </div>
                <div className="flex p-1 bg-secondary/30 border border-white/5 rounded-xl backdrop-blur-md">
                    <button
                        onClick={() => setActiveTab('clients')}
                        className={cn("px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300",
                            activeTab === 'clients' ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25" : "text-muted-foreground hover:text-white hover:bg-white/5")}
                    >
                        Clientes
                    </button>
                    <button
                        onClick={() => setActiveTab('tickets')}
                        className={cn("px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300",
                            activeTab === 'tickets' ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25" : "text-muted-foreground hover:text-white hover:bg-white/5")}
                    >
                        Gestión de Casos
                    </button>
                    <button
                        onClick={() => setActiveTab('tasks')}
                        className={cn("px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300",
                            activeTab === 'tasks' ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25" : "text-muted-foreground hover:text-white hover:bg-white/5")}
                    >
                        Tareas y Devolución
                    </button>
                </div>
            </div>

            <div className="glass-card rounded-xl min-h-[600px] shadow-2xl p-6 animate-in fade-in duration-500 border border-white/[0.05]">
                {activeTab === 'clients' && <ClientDirectory />}
                {activeTab === 'tickets' && <TicketSystem />}
                {activeTab === 'tasks' && <TaskManager />}
            </div>
        </div>
    );
};

const ClientDirectory = () => {
    // Real data derived from Webhook History
    const clients = [
        { id: 1, name: 'Juan Pérez', phone: '661-662-663', type: 'Soporte', reason: 'Avería', status: 'Activo', lastContact: 'hace 5 min' },
        { id: 2, name: 'Carlos Rodríguez', phone: 'Desconocido', type: 'Ventas', reason: 'Interés Alto', status: 'Seguimiento', lastContact: 'hace 10 min' },
        { id: 3, name: 'Farmacia Central', phone: '600-123-456', type: 'Pedidos', reason: 'Suministros', status: 'Urgente', lastContact: 'hace 1 hora' },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                    <Users className="w-5 h-5 text-blue-500" />
                    Directorio de Clientes
                </h3>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar clientes..."
                        className="w-full bg-secondary/30 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>
            </div>
            <div className="glass-card rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-secondary/50 text-left border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4 font-medium text-muted-foreground">Nombre</th>
                            <th className="px-6 py-4 font-medium text-muted-foreground">Teléfono</th>
                            <th className="px-6 py-4 font-medium text-muted-foreground">Flujo</th>
                            <th className="px-6 py-4 font-medium text-muted-foreground">Motivo</th>
                            <th className="px-6 py-4 font-medium text-muted-foreground">Estado</th>
                            <th className="px-6 py-4 font-medium text-muted-foreground">Último Contacto</th>
                            <th className="px-6 py-4 font-medium text-muted-foreground">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                        {clients.map(client => (
                            <tr key={client.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-4 font-medium text-foreground">{client.name}</td>
                                <td className="px-6 py-4 text-muted-foreground font-mono">{client.phone}</td>
                                <td className="px-6 py-4">
                                    <span className={cn("px-2 py-1 rounded-full text-xs font-medium border",
                                        client.type === 'Soporte' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                                            client.type === 'Ventas' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                "bg-blue-500/10 text-blue-400 border-blue-500/20")}>
                                        {client.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">
                                    {client.reason}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn("flex items-center gap-1.5",
                                        client.status === 'Urgente' ? "text-rose-400 font-medium" :
                                            client.status === 'Seguimiento' ? "text-amber-400" :
                                                "text-muted-foreground")}>
                                        <span className={cn("w-2 h-2 rounded-full animate-pulse",
                                            client.status === 'Urgente' ? "bg-rose-500" :
                                                client.status === 'Seguimiento' ? "bg-amber-500" :
                                                    "bg-emerald-500")} />
                                        {client.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">{client.lastContact}</td>
                                <td className="px-6 py-4">
                                    <button className="p-1.5 hover:bg-white/10 rounded-lg text-muted-foreground hover:text-white transition-colors">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const TicketSystem = () => {
    // Tickets derived from latest calls/webhooks
    const tickets = [
        { id: 'T-2045', subject: 'Reporte de Avería - Juan Pérez', assignee: 'Agente Técnico IA', priority: 'Alta', status: 'Abierto' },
        { id: 'T-2046', subject: 'Seguimiento Comercial - Carlos', assignee: 'Equipo Ventas', priority: 'Media', status: 'En Progreso' },
        { id: 'T-2047', subject: 'Envío Urgente - Farmacia', assignee: 'Logística', priority: 'Crítica', status: 'Pendiente' },
    ];

    return (
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
    );
};

const TaskManager = () => {
    const tasks = [
        { id: 1, type: 'Validación', customer: 'Farmacia Central', reason: 'Confirmar stock de items solicitados', due: 'URGENTE' },
        { id: 2, type: 'Seguimiento', customer: 'Juan Pérez', reason: 'Verificar resolución de avería técnica', due: '2 horas' },
        { id: 3, type: 'Ventas', customer: 'Carlos Rodríguez', reason: 'Cerrar propuesta comercial pendiente', due: 'Mañana' },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                    <CheckSquare className="w-5 h-5 text-emerald-500" />
                    Acciones Pendientes
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map(task => (
                    <div key={task.id} className="glass-card rounded-xl p-5 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                            <AlertCircle className="w-24 h-24 text-blue-500" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-white/5 px-2 py-1 rounded-md">{task.type}</span>
                                <span className={cn("text-[10px] font-bold px-2 py-1 rounded-md",
                                    task.due === 'URGENTE' ? "text-rose-400 bg-rose-500/10 border border-rose-500/20" : "text-blue-400 bg-blue-500/10 border border-blue-500/20")}>
                                    {task.due}
                                </span>
                            </div>
                            <h4 className="text-lg font-semibold mb-1 text-foreground">{task.customer}</h4>
                            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{task.reason}</p>
                            <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-600/20">
                                <PhoneIncoming className="w-4 h-4" />
                                Iniciar Acción
                            </button>
                        </div>
                    </div>
                ))}
                {tasks.length === 0 && <p className="text-muted-foreground">No hay tareas pendientes.</p>}
            </div>
        </div>
    );
};
