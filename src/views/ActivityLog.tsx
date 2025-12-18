import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LiveFeed } from '@/components/LiveFeed';
import { getCallHistory, type CallHistoryItem } from '@/lib/elevenlabs';

export const ActivityLog = () => {
    const navigate = useNavigate();
    const [calls, setCalls] = useState<CallHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCalls = async () => {
            try {
                const history = await getCallHistory(50);
                setCalls(history);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCalls();
        const interval = setInterval(fetchCalls, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
             <div>
                <h2 className="text-3xl font-bold tracking-tight">Actividad del Sistema</h2>
                <p className="text-muted-foreground">Registro en tiempo real de interacciones y datos de los agentes.</p>
            </div>

            {/* Data & Activity Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Recent Calls Table */}
                <div className="xl:col-span-2 glass-card rounded-xl overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-white/[0.05] flex items-center justify-between">
                        <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                            <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                            Actividad Reciente
                        </h3>
                        <button
                            onClick={() => navigate('/calls')}
                            className="text-sm text-blue-500 hover:text-blue-400 hover:underline font-medium transition-colors"
                        >
                            Ver Todo
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/30">
                                <tr>
                                    <th className="px-6 py-4 font-medium text-muted-foreground">ID Llamada</th>
                                    <th className="px-6 py-4 font-medium text-muted-foreground">Estado</th>
                                    <th className="px-6 py-4 font-medium text-muted-foreground">Duración</th>
                                    <th className="px-6 py-4 font-medium text-muted-foreground">Sentimiento</th>
                                    <th className="px-6 py-4 font-medium text-muted-foreground">Hora</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.05]">
                                {calls.slice(0, 5).map((call) => (
                                    <tr key={call.conversation_id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4 font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">{(call.conversation_id || 'unknown').slice(0, 8)}...</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${call.status === 'completed'
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                }`}>
                                                {call.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-foreground">
                                            {Math.floor(call.duration_secs / 60)}:{(call.duration_secs % 60).toFixed(0).padStart(2, '0')}
                                        </td>
                                        <td className="px-6 py-4 text-foreground">
                                            {call.analysis?.user_sentiment || 'Neutral'}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {new Date(call.start_time_unix_secs * 1000).toLocaleTimeString('es-ES')}
                                        </td>
                                    </tr>
                                ))}
                                {calls.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No se encontraron llamadas recientes.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Live Data Feed */}
                <div className="xl:col-span-1 h-[500px] xl:h-auto">
                    <LiveFeed />
                </div>
            </div>
        </div>
    );
};
