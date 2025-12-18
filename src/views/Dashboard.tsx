import React, { useEffect, useState } from 'react';
import { StatsCard } from '@/components/StatsCard';
import { Clock, CreditCard, CheckCircle2, BarChart3, Users, Activity, ExternalLink } from 'lucide-react';
import { getCallHistory, getAgents } from '@/lib/elevenlabs';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
    const [stats, setStats] = useState({
        totalCalls: 0,
        totalMinutes: 0,
        totalCost: 0,
        successfulCalls: 0,
        avgDuration: 0,
    });

    const [durationData, setDurationData] = useState<any[]>([]);
    const [sentimentData, setSentimentData] = useState<any[]>([]);
    const [hourlyData, setHourlyData] = useState<any[]>([]);
    const [agentData, setAgentData] = useState<any[]>([]);
    const [recentCalls, setRecentCalls] = useState<any[]>([]);
    const [agentsList, setAgentsList] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [history, agents] = await Promise.all([
                    getCallHistory(50), 
                    getAgents()
                ]);

                setAgentsList(agents);

                let totalDurSecs = 0;
                let success = 0;
                const sentimentCounts = { Positive: 0, Negative: 0, Neutral: 0, Unknown: 0 };
                const hourlyCounts = new Array(24).fill(0);
                const agentStats: Record<string, { name: string, calls: number, duration: number, success: number }> = {};

                // Process History
                const processedHistory = history.map(call => {
                    const dur = typeof call.duration_secs === 'number' ? call.duration_secs : 0;
                    totalDurSecs += dur;
                    
                    const isSuccess = call.status === 'completed' || call.analysis?.call_successful;
                    if (isSuccess) success++;

                    const date = new Date(call.start_time_unix_secs * 1000);
                    const hour = date.getHours();
                    hourlyCounts[hour]++;

                    // Sentiment
                    const sentiment = call.analysis?.user_sentiment || 'Unknown';
                    if (sentimentCounts[sentiment as keyof typeof sentimentCounts] !== undefined) {
                        sentimentCounts[sentiment as keyof typeof sentimentCounts]++;
                    } else {
                        sentimentCounts['Unknown']++;
                    }

                    // Agent Stats
                    const agentId = call.agent_id || 'unknown';
                    if (!agentStats[agentId]) {
                        const agentName = agents.find(a => a.agent_id === agentId)?.name || 'Agente Desconocido';
                        agentStats[agentId] = { name: agentName, calls: 0, duration: 0, success: 0 };
                    }
                    agentStats[agentId].calls++;
                    agentStats[agentId].duration += dur;
                    if (isSuccess) agentStats[agentId].success++;
                    
                    return {
                        ...call,
                        duration_secs: dur,
                        dateStr: date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
                        timeStr: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
                    };
                });

                // Set Stats
                const totalMinutes = Math.round(totalDurSecs / 60);
                const cost = (totalMinutes * 0.16).toFixed(2); 

                setStats({
                    totalCalls: history.length,
                    totalMinutes,
                    totalCost: Number(cost),
                    successfulCalls: success,
                    avgDuration: history.length ? Math.round(totalDurSecs / history.length) : 0,
                });

                // Chart Data
                setDurationData(processedHistory.slice().reverse().map(c => ({
                    time: c.timeStr,
                    duration: c.duration_secs,
                })));

                setSentimentData([
                    { name: 'Positivo', value: sentimentCounts.Positive, color: '#10b981' },
                    { name: 'Neutral', value: sentimentCounts.Neutral, color: '#64748b' },
                    { name: 'Negativo', value: sentimentCounts.Negative, color: '#f43f5e' },
                ].filter(d => d.value > 0));

                setHourlyData(hourlyCounts.map((count, hour) => ({
                    hour: `${hour}:00`,
                    calls: count
                })));

                setAgentData(Object.values(agentStats).map(stat => ({
                    ...stat,
                    avgDur: Math.round(stat.duration / stat.calls),
                    successRate: Math.round((stat.success / stat.calls) * 100)
                })));

                setRecentCalls(processedHistory.slice(0, 10)); // Top 10 recent

            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Business Intelligence</h2>
                    <p className="text-muted-foreground mt-1">Análisis detallado de rendimiento y operaciones.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-xs">LIVE_DATA_FEED</span>
                </div>
            </div>

            {/* Row 1: KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="Duración Media" value={`${stats.avgDuration}s`} icon={Clock} description="Tiempo medio / llamada" className="bg-card/50" />
                <StatsCard title="Consumo Voz" value={`${stats.totalMinutes} min`} icon={BarChart3} description={`${stats.totalCalls} llamadas totales`} className="bg-card/50" />
                <StatsCard title="Coste Operativo" value={`€${stats.totalCost}`} icon={CreditCard} description="Est. €0.16 / minuto" className="bg-card/50" />
                <StatsCard title="Tasa de Éxito" value={`${stats.totalCalls ? Math.round((stats.successfulCalls / stats.totalCalls) * 100) : 0}%`} icon={CheckCircle2} description="Conversaciones completadas" className="bg-card/50" />
            </div>

            {/* Row 2: Trend & Sentiment */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card rounded-xl p-6 border border-white/5">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">Tendencia de Duración (Últimas 50)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={durationData}>
                                <defs>
                                    <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
                                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} unit="s" />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                                <Area type="monotone" dataKey="duration" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorDuration)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card rounded-xl p-6 border border-white/5">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">Análisis de Sentimiento</h3>
                    <div className="h-[300px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {sentimentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <span className="text-2xl font-bold text-white">{stats.totalCalls}</span>
                                <p className="text-xs text-muted-foreground">Analizadas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 3: Hourly & Agents */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card rounded-xl p-6 border border-white/5">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">Distribución Horaria (24h)</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={hourlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                                <Bar dataKey="calls" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card rounded-xl p-0 border border-white/5 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-white/5">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Rendimiento por Agente</h3>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground bg-secondary/30 uppercase">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Agente</th>
                                    <th className="px-6 py-3 font-medium text-right">Llamadas</th>
                                    <th className="px-6 py-3 font-medium text-right">Dur. Media</th>
                                    <th className="px-6 py-3 font-medium text-right">Éxito</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {agentData.map((agent, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-3 font-medium text-blue-400">{agent.name}</td>
                                        <td className="px-6 py-3 text-right">{agent.calls}</td>
                                        <td className="px-6 py-3 text-right">{agent.avgDur}s</td>
                                        <td className="px-6 py-3 text-right">
                                            <span className={cn("inline-block px-2 py-0.5 rounded text-xs", 
                                                agent.successRate >= 80 ? "bg-emerald-500/10 text-emerald-400" : 
                                                agent.successRate >= 50 ? "bg-amber-500/10 text-amber-400" : "bg-rose-500/10 text-rose-400"
                                            )}>
                                                {agent.successRate}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {agentData.length === 0 && (
                                    <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">Sin datos de agentes</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Row 4: Recent Details */}
            <div className="glass-card rounded-xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Actividad Reciente</h3>
                    <Link to="/calls" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                        Ver Todo <ExternalLink className="w-3 h-3" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground bg-secondary/30 uppercase">
                            <tr>
                                <th className="px-6 py-3 font-medium">ID / Hora</th>
                                <th className="px-6 py-3 font-medium">Estado</th>
                                <th className="px-6 py-3 font-medium">Sentimiento</th>
                                <th className="px-6 py-3 font-medium text-right">Duración</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {recentCalls.map((call) => (
                                <tr key={call.conversation_id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-3">
                                        <div className="font-mono text-xs text-white group-hover:text-blue-400 table-fixed w-32 truncate" title={call.conversation_id}>
                                            {call.conversation_id.substring(0, 8)}...
                                        </div>
                                        <div className="text-xs text-muted-foreground">{call.dateStr} {call.timeStr}</div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border", 
                                            call.status === 'completed' 
                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                        )}>
                                            <span className={cn("w-1.5 h-1.5 rounded-full", call.status === 'completed' ? "bg-emerald-400" : "bg-rose-400")} />
                                            {call.status === 'completed' ? 'Completado' : 'Fallido'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className={cn("text-xs font-medium",
                                            call.analysis?.user_sentiment === 'Positive' ? "text-emerald-400" :
                                            call.analysis?.user_sentiment === 'Negative' ? "text-rose-400" : "text-slate-400"
                                        )}>
                                            {call.analysis?.user_sentiment || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-right font-mono text-slate-300">
                                        {call.duration_secs}s
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
