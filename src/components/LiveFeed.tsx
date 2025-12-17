import React from 'react';
import { useWebhookData } from '@/hooks/useWebhookData';
import { Activity, User, Phone, Tag, AlertCircle, Database, MapPin } from 'lucide-react';
import { clsx } from 'clsx';

export const LiveFeed = () => {
    const { data, loading } = useWebhookData();

    return (
        <div className="glass-card p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                    <Database className="w-5 h-5 text-blue-500" />
                    Datos Recibidos del Agente
                </h3>
                <span className="text-xs text-muted-foreground font-mono bg-secondary/50 px-2 py-1 rounded border border-white/5">
                    Historial Webhook
                </span>
            </div>

            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1 max-h-[400px]">
                {loading && data.length === 0 ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : data.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8 text-sm">
                        No hay datos registrados aún.
                    </div>
                ) : (
                    data.map((item) => (
                        <div
                            key={item.uuid}
                            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.05] p-4 transition-all hover:bg-white/[0.05] hover:border-blue-500/20 hover:shadow-lg"
                        >
                            <div className="absolute top-0 left-0 w-[2px] h-full bg-blue-500/0 group-hover:bg-blue-500 transition-colors"></div>

                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <span className="font-semibold text-sm text-foreground">
                                        {item.parsedContent?.nombre_cliente || 'Cliente Desconocido'}
                                    </span>
                                </div>
                                <span className="text-[10px] text-muted-foreground font-mono">
                                    {new Date(item.created_at).toLocaleTimeString()}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-3">
                                {item.parsedContent?.tipo_flujo && (
                                    <div className="col-span-1 flex flex-col gap-1 p-2 rounded-lg bg-secondary/30 border border-white/[0.02]">
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Flujo</span>
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                                            <Activity className="w-3 h-3 text-violet-400" />
                                            <span className="capitalize">{item.parsedContent.tipo_flujo}</span>
                                        </div>
                                    </div>
                                )}

                                {item.parsedContent?.interes_detectado && (
                                    <div className="col-span-1 flex flex-col gap-1 p-2 rounded-lg bg-secondary/30 border border-white/[0.02]">
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Interés</span>
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                                            <Tag className={clsx(
                                                "w-3 h-3",
                                                item.parsedContent.interes_detectado === 'alto' ? "text-emerald-400" : "text-amber-400"
                                            )} />
                                            <span className="capitalize">{item.parsedContent.interes_detectado}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2 text-xs">
                                {item.parsedContent?.telefono_cliente && item.parsedContent?.telefono_cliente !== 'desconocido' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/[0.05] border border-white/5 text-muted-foreground">
                                        <Phone className="w-3 h-3" />
                                        {item.parsedContent.telefono_cliente}
                                    </span>
                                )}
                                {item.parsedContent?.motivo_incidencia && item.parsedContent?.motivo_incidencia !== 'no aplica' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
                                        <AlertCircle className="w-3 h-3" />
                                        {item.parsedContent.motivo_incidencia}
                                    </span>
                                )}
                                {item.parsedContent?.codigo_postal && item.parsedContent?.codigo_postal !== 'no aplica' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                                        <MapPin className="w-3 h-3" />
                                        CP: {item.parsedContent.codigo_postal}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
