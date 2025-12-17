import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatsCard } from '@/components/StatsCard';
import { Phone, Clock, CreditCard, Users, FileText, CheckCircle2 } from 'lucide-react';
import { getCallHistory, getAgents, type CallHistoryItem, type Agent } from '@/lib/elevenlabs';
import { ActivityHeatmap, WordCloud } from '@/components/Visualizations';
import { LiveFeed } from '@/components/LiveFeed';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalCalls: 0,
        totalMinutes: 0,
        totalCost: 0,
        successfulCalls: 0,
        failedCalls: 0,
        avgDuration: 0,
        negativeSentiment: 0,
        totalAgents: 0,
    });
    const [calls, setCalls] = useState<CallHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [statusData, setStatusData] = useState<any[]>([]);
    const [typeData, setTypeData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [history, agents] = await Promise.all([
                    getCallHistory(50),
                    getAgents()
                ]);

                setCalls(history);

                let totalDurSecs = 0;
                let success = 0;
                let failed = 0;

                history.forEach(call => {
                    const dur = typeof call.duration_secs === 'number' ? call.duration_secs : 0;
                    totalDurSecs += dur;
                    if (call.status === 'completed' || call.analysis?.call_successful) {
                        success++;
                    } else {
                        failed++;
                    }
                });

                // Mocking Cost logic as approx $0.05/min for demo
                const totalMinutes = Math.round(totalDurSecs / 60);
                const cost = (totalMinutes * 0.05).toFixed(2);

                const positiveCount = history.filter(c => c.analysis?.user_sentiment === 'Positive').length;
                const negativeCount = history.filter(c => c.analysis?.user_sentiment === 'Negative').length;
                const neutralCount = history.length - positiveCount - negativeCount;

                setStats({
                    totalCalls: history.length,
                    totalMinutes,
                    totalCost: Number(cost),
                    successfulCalls: success,
                    failedCalls: failed,
                    avgDuration: history.length ? Math.round(totalDurSecs / history.length) : 0,
                    negativeSentiment: negativeCount,
                    totalAgents: agents.length
                });

                setStatusData([
                    { name: 'Completada', value: success },
                    { name: 'Fallida/Caída', value: failed }
                ]);

                setTypeData([
                    { name: 'Positiva', value: positiveCount },
                    { name: 'Negativa', value: negativeCount },
                    { name: 'Neutral', value: neutralCount }
                ]);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    // Neon Palette for Dark Mode
    const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981']; // Blue, Violet, Cyan, Emerald

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Resumen Ejecutivo</h2>
                    <p className="text-muted-foreground mt-1">Métricas operativas en tiempo real.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Sistema en Vivo
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatsCard
                    title="Llamadas Totales"
                    value={stats.totalCalls}
                    icon={Phone}
                    description="Últimas 50 interacciones"
                />
                <StatsCard
                    title="Minutos Totales"
                    value={`${stats.totalMinutes}m`}
                    icon={Clock}
                    description={`Duración media: ${stats.avgDuration}s`}
                />
                <StatsCard
                    title="Coste Est."
                    value={`$${stats.totalCost}`}
                    icon={CreditCard}
                    description="Calc. $0.05/min"
                />
                <StatsCard
                    title="Tasa de Éxito"
                    value={`${stats.totalCalls ? Math.round((stats.successfulCalls / stats.totalCalls) * 100) : 0}%`}
                    icon={CheckCircle2}
                    className="lg:col-span-1"
                />
                <StatsCard
                    title="Atención Requerida"
                    value={stats.negativeSentiment}
                    icon={FileText}
                    description="Llamadas con sentimiento negativo"
                />
                <StatsCard
                    title="Agentes Disponibles"
                    value={stats.totalAgents}
                    icon={Users}
                    description="Agentes de IA activos"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                        Estado de las Llamadas
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={statusData}>
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0f172a',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        color: '#f8fafc',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                    }}
                                    cursor={{ fill: 'var(--muted)' }}
                                />
                                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-violet-500 rounded-full"></span>
                        Tipos de Interacción
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={typeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {typeData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Advanced Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActivityHeatmap />
                <WordCloud />
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
