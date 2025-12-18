import { useState, useEffect } from 'react';
import { Save, Mic, Play, Settings2, Loader2, ChevronDown, Bot, Plus, Trash2, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAgents, getVoices, getAgent, type Agent, type Voice } from '@/lib/elevenlabs';

interface Context {
    id: string;
    title: string;
    content: string;
}

export const AgentBuilder = () => {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [voices, setVoices] = useState<Voice[]>([]);
    const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [config, setConfig] = useState({
        name: '',
        role: '',
        voiceId: '',
        contexts: [] as Context[],
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
                contexts: [
                    { id: '1', title: 'Campaña General', content: details.conversation_config?.agent?.prompt?.prompt || '' },
                    { id: '2', title: 'Soporte Técnico', content: 'Base de conocimiento específica para resolución de incidencias...' }
                ],
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
        <div className="h-full flex flex-col gap-6">
            {/* Top Bar: Agent Selection & Global Actions */}
            <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border/50 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <Bot className="w-5 h-5" />
                        </span>
                        <div>
                            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Agente Activo</h2>
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 font-bold text-lg text-foreground hover:text-primary transition-colors outline-none"
                            >
                                {agents.find(a => a.agent_id === selectedAgentId)?.name || 'Seleccionar Agente'}
                                <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isDropdownOpen ? "rotate-180" : "")} />
                            </button>
                            
                            {isDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                                    <div className="absolute top-full left-0 mt-2 w-64 bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                        <div className="max-h-[300px] overflow-y-auto py-1">
                                            {agents.map(agent => (
                                                <button
                                                    key={agent.agent_id}
                                                    onClick={() => {
                                                        selectAgent(agent.agent_id);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className={cn(
                                                        "w-full text-left px-4 py-3 text-sm transition-colors hover:bg-white/5 flex items-center justify-between group",
                                                        selectedAgentId === agent.agent_id ? "text-primary bg-primary/5" : "text-muted-foreground"
                                                    )}
                                                >
                                                    <span className="font-medium text-white group-hover:text-primary transition-colors">{agent.name}</span>
                                                    {selectedAgentId === agent.agent_id && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_currentColor]" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        </div>
                    </div>
                    
                    <div className="h-8 w-[1px] bg-border/50 mx-2"></div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-mono bg-muted/30 px-2 py-0.5 rounded text-xs">{selectedAgentId?.slice(0, 8)}...</span>
                        {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <Save className="w-4 h-4" /> Guardar Cambios
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Settings Column - Now 40% width */}
                <div className="w-2/5 flex flex-col gap-6 overflow-y-auto pr-2">
                    <div className="space-y-4">
                        <div className="bg-card p-5 rounded-xl border border-border/50 shadow-sm space-y-4">
                            <h3 className="font-semibold flex items-center gap-2 text-sm"><Settings2 className="w-4 h-4" /> Configuración General</h3>
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
                                <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto">
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

                {/* Context / Campaign Database Column - Now 60% width */}
                <div className="flex-1 bg-card rounded-xl border border-border/50 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-border/50 bg-muted/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            <span className="text-sm font-medium">Bases de Conocimiento (Contextos)</span>
                        </div>
                        <button 
                            onClick={() => setConfig({
                                ...config, 
                                contexts: [...(config.contexts || []), { id: Date.now().toString(), title: 'Nueva Campaña', content: '' }] 
                            })}
                            className="text-xs flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md hover:bg-primary/20 transition-colors"
                        >
                            <Plus className="w-3 h-3" /> Añadir Contexto
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
                        {(config.contexts || []).map((ctx, idx) => (
                            <div key={ctx.id} className="bg-card border border-border/50 rounded-lg p-4 shadow-sm group hover:border-primary/30 transition-all">
                                <div className="flex items-center justify-between mb-3">
                                    <input 
                                        type="text" 
                                        value={ctx.title}
                                        onChange={(e) => {
                                            const newContexts = [...(config.contexts || [])];
                                            newContexts[idx].title = e.target.value;
                                            setConfig({ ...config, contexts: newContexts });
                                        }}
                                        className="bg-transparent font-medium text-sm text-foreground focus:outline-none border-b border-transparent focus:border-primary/50 px-1"
                                        placeholder="Nombre de la Campaña..."
                                    />
                                    <button 
                                        onClick={() => {
                                            const newContexts = config.contexts?.filter((_, i) => i !== idx);
                                            setConfig({ ...config, contexts: newContexts });
                                        }}
                                        className="text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                                <textarea
                                    value={ctx.content}
                                    onChange={(e) => {
                                        const newContexts = [...(config.contexts || [])];
                                        newContexts[idx].content = e.target.value;
                                        setConfig({ ...config, contexts: newContexts });
                                    }}
                                    className="w-full h-24 bg-muted/30 rounded-md p-3 text-xs font-mono text-muted-foreground focus:text-foreground focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none"
                                    placeholder="Describe el contexto, reglas y conocimiento para esta campaña..."
                                    spellCheck="false"
                                />
                            </div>
                        ))}

                        {(!config.contexts || config.contexts.length === 0) && (
                            <div className="text-center py-10 text-muted-foreground">
                                <FileText className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p className="text-sm">No hay contextos definidos.</p>
                                <p className="text-xs opacity-50">Crea una base de conocimiento para vincularla a una campaña.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
