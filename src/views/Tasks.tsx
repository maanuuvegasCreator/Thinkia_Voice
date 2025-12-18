import React from 'react';
import { CheckSquare, AlertCircle, PhoneIncoming } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Tasks = () => {
    const tasks = [
        { id: 1, type: 'Validación', customer: 'Farmacia Central', reason: 'Confirmar stock de items solicitados', due: 'URGENTE' },
        { id: 2, type: 'Seguimiento', customer: 'Juan Pérez', reason: 'Verificar resolución de avería técnica', due: '2 horas' },
        { id: 3, type: 'Ventas', customer: 'Carlos Rodríguez', reason: 'Cerrar propuesta comercial pendiente', due: 'Mañana' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Tareas y Devolución</h2>
                <p className="text-muted-foreground">Control de tareas pendientes, validaciones y procesos de devolución.</p>
            </div>

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
        </div>
    );
};
