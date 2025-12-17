import React from 'react';
import { Calendar as CalendarIcon, Upload, Users, BarChart, Clock, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatsCard } from '@/components/StatsCard';

export const Campaigns = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Campañas Salientes</h2>
                    <p className="text-muted-foreground">Gestiona lotes de llamadas automatizadas y programación.</p>
                </div>
                <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90">
                    <Plus className="w-4 h-4" /> Nueva Campaña
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard title="Campañas Activas" value="3" icon={BarChart} trend={{ value: 1, isPositive: true }} />
                <StatsCard title="Leads Pendientes" value="1,240" icon={Users} />
                <StatsCard title="Conversión Promedio" value="18.2%" icon={Users} trend={{ value: 2.1, isPositive: true }} />
            </div>

            <div className="flex gap-6 h-[500px]">
                {/* Campaign List / Batches */}
                <div className="w-2/3 bg-card border border-border/50 rounded-xl p-6 shadow-sm overflow-hidden flex flex-col">
                    <h3 className="font-semibold mb-4 flex items-center gap-2"><Upload className="w-4 h-4" /> Lotes Activos</h3>
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border/50 text-left">
                                    <th className="pb-3 bg-card font-medium text-muted-foreground">Nombre de Campaña</th>
                                    <th className="pb-3 bg-card font-medium text-muted-foreground">Progreso</th>
                                    <th className="pb-3 bg-card font-medium text-muted-foreground">Estado</th>
                                    <th className="pb-3 bg-card font-medium text-muted-foreground">Horario</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {[
                                    { name: 'Recordatorio Renovación Servicio', progress: 75, status: 'Ejecutando', schedule: '09:00 - 17:00' },
                                    { name: 'Encuesta Satisfacción Cliente', progress: 30, status: 'Pausada', schedule: '10:00 - 14:00' },
                                    { name: 'Onboarding Nuevos Clientes', progress: 100, status: 'Completada', schedule: 'Ayer' },
                                    { name: 'Verificación Datos Anual', progress: 12, status: 'Ejecutando', schedule: '09:00 - 18:00' },
                                ].map((camp, i) => (
                                    <tr key={i} className="group">
                                        <td className="py-4 font-medium">{camp.name}</td>
                                        <td className="py-4 w-40">
                                            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                                <div className="bg-primary h-full" style={{ width: `${camp.progress}%` }} />
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1 text-right">{camp.progress}%</p>
                                        </td>
                                        <td className="py-4">
                                            <span className={cn("px-2 py-1 rounded-full text-xs font-medium",
                                                camp.status === 'Ejecutando' ? "bg-emerald-500/10 text-emerald-500" :
                                                    camp.status === 'Pausada' ? "bg-amber-500/10 text-amber-500" :
                                                        "bg-muted text-muted-foreground"
                                            )}>
                                                {camp.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {camp.schedule}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mini Calendar Preview */}
                <div className="w-1/3 bg-background border border-border/50 rounded-xl p-6 shadow-sm flex flex-col">
                    <h3 className="font-semibold mb-4 flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> Calendario</h3>
                    <div className="flex-1 bg-muted/20 rounded-lg p-4">
                        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground mb-2">
                            <span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: 31 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "aspect-square rounded-md flex items-center justify-center text-sm",
                                        i === 15 ? "bg-primary text-primary-foreground font-bold" :
                                            [16, 17, 18].includes(i) ? "bg-primary/20 text-primary border border-primary/20" :
                                                "hover:bg-muted bg-card border border-border/20"
                                    )}
                                >
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 space-y-3">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Agenda de Hoy</h4>
                            <div className="p-3 bg-card border border-border/50 rounded-lg text-sm border-l-4 border-l-emerald-500">
                                <p className="font-medium">Recordatorio Renovación Servicio</p>
                                <p className="text-xs text-muted-foreground">Ejecutando • 140 llamadas pendientes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
