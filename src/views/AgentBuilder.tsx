import { useState, useEffect } from 'react';
import { Save, Mic, Play, Settings2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAgents, getVoices, getAgent, type Agent, type Voice } from '@/lib/elevenlabs';

export const AgentBuilder = () => {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [voices, setVoices] = useState<Voice[]>([]);
    const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const [config, setConfig] = useState({
        name: '',
        role: '',
        voiceId: '',
        prompt: '',
        temperature: 0.5,
        stability: 0.5,
        speed: 1.0,
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [agentsList, voicesList] = await Promise.all([
                getAgents(),
                getVoices()
            ]);
            setAgents(agentsList);
            setVoices(voicesList.slice(0, 10)); // Limit to first 10 for UI performance in demo

            if (agentsList.length > 0) {
                selectAgent(agentsList[0].agent_id);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const selectAgent = async (id: string) => {
        setSelectedAgentId(id);
        const details = await getAgent(id);
        if (details) {
            setConfig({
                name: details.name || 'Agente Sin Nombre',
                role: 'Asistente IA',
                voiceId: details.conversation_config?.agent?.prompt?.voice_id || '',
                prompt: details.conversation_config?.agent?.prompt?.prompt || '',
                temperature: 0.5,
                stability: 0.5,
                speed: 1.0
            });
        }
    };

    const handleSave = () => {
        alert('Esta demo no soporta guardar cambios en la API aún. Los cambios se guardarían para el agente: ' + config.name);
    };

    if (loading) {
        return <div className="flex items-center justify-center h-[calc(100vh-8rem)] text-muted-foreground gap-2"><Loader2 className="animate-spin" /> Cargando Datos del Sistema...</div>;
    }

    return (
        <div className="flex gap-8 h-[calc(100vh-8rem)]">
            {/* Sidebar List of Agents */}
            <div className="w-1/4 border-r border-border/50 pr-4 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Tus Agentes</h2>
                <div className="space-y-2">
                    {agents.map(agent => (
                        <div
                            key={agent.agent_id}
                            onClick={() => selectAgent(agent.agent_id)}
                            className={cn(
                                "p-3 rounded-lg cursor-pointer transition-colors border",
                                selectedAgentId === agent.agent_id ? "bg-primary/10 border-primary text-primary" : "bg-card border-border/50 hover:bg-muted"
                            )}
                        >
                            <p className="font-medium">{agent.name}</p>
                            <p className="text-xs opacity-70 truncate">{agent.agent_id}</p>
                        </div>
                    ))}
                    {agents.length === 0 && <p className="text-muted-foreground text-sm">No se encontraron agentes.</p>}
                </div>
            </div>

            {/* Settings Column */}
            <div className="w-1/3 flex flex-col gap-6 overflow-y-auto pr-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
                    <p className="text-muted-foreground">Editando: {config.name}</p>
                </div>

                <div className="space-y-4">
                    <div className="bg-card p-5 rounded-xl border border-border/50 shadow-sm space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nombre del Agente</label>
                            <input
                                type="text"
                                value={config.name}
                                onChange={e => setConfig({ ...config, name: e.target.value })}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                    </div>

                    <div className="bg-card p-5 rounded-xl border border-border/50 shadow-sm space-y-6">
                        <h3 className="font-semibold flex items-center gap-2 text-sm"><Mic className="w-4 h-4" /> Ajustes de Voz</h3>

                        <div className="space-y-3">
                            <label className="text-sm font-medium">Identidad de Voz (Top 10)</label>
                            <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
                                {voices.map(voice => (
                                    <div
                                        key={voice.voice_id}
                                        onClick={() => setConfig({ ...config, voiceId: voice.voice_id })}
                                        className={cn(
                                            "p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between",
                                            config.voiceId === voice.voice_id
                                                ? "bg-primary/10 border-primary text-primary"
                                                : "bg-background border-border/50 hover:border-primary/30"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                                <Play className="w-3 h-3 text-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{voice.name}</p>
                                                <p className="text-xs opacity-70">{voice.category || 'Estándar'}</p>
                                            </div>
                                        </div>
                                        {config.voiceId === voice.voice_id && <div className="w-2 h-2 rounded-full bg-primary" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border/50">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span>Temperatura (Creatividad)</span>
                                    <span className="font-mono">{config.temperature}</span>
                                </div>
                                <input
                                    type="range" min="0" max="1" step="0.1"
                                    value={config.temperature}
                                    onChange={e => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Prompt Editor Column */}
            <div className="flex-1 flex flex-col gap-6">
                <div className="flex items-center justify-end">
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    >
                        <Save className="w-4 h-4" /> Guardar Cambios
                    </button>
                </div>

                <div className="flex-1 bg-card rounded-xl border border-border/50 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-border/50 bg-muted/20 flex items-center gap-2">
                        <Settings2 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Instrucciones del Sistema (Prompt)</span>
                    </div>
                    <div className="flex-1 p-0 relative">
                        <textarea
                            value={config.prompt}
                            onChange={e => setConfig({ ...config, prompt: e.target.value })}
                            className="w-full h-full resize-none p-6 bg-transparent text-sm font-mono leading-relaxed focus:outline-none"
                            spellCheck="false"
                            placeholder="Selecciona un agente para ver su prompt..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
