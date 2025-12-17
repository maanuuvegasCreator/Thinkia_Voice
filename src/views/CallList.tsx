import React, { useEffect, useState } from 'react';
import { getCallHistory, getCallDetails, getCallAudio, type CallHistoryItem } from '@/lib/elevenlabs';
import { Search, Filter, Play, Phone, Calendar, User, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const CallList = () => {
    const [calls, setCalls] = useState<CallHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
    const [selectedCallDetails, setSelectedCallDetails] = useState<any>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [audioDuration, setAudioDuration] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        fetchCalls();
    }, []);

    useEffect(() => {
        if (selectedCallId) {
            loadCallDetails(selectedCallId);
        } else {
            setSelectedCallDetails(null);
            setAudioUrl(null);
            setAudioDuration(0);
        }
    }, [selectedCallId]);

    const fetchCalls = async () => {
        setLoading(true);
        const data = await getCallHistory(50);
        setCalls(data);
        setLoading(false);
    };

    const loadCallDetails = async (id: string) => {
        const details = await getCallDetails(id);
        setSelectedCallDetails(details);

        // Fetch audio separately
        const audio = await getCallAudio(id);
        setAudioUrl(audio);
    };

    const handleAudioMetadata = (e: React.SyntheticEvent<HTMLAudioElement>) => {
        const duration = e.currentTarget.duration;
        if (!isNaN(duration) && duration > 0) {
            setAudioDuration(duration);
        }
    };

    const filteredCalls = calls.filter(call => {
        const callId = call.conversation_id || '';
        const summary = call.analysis?.call_summary || '';

        const matchesSearch = callId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            summary.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || call.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Calculate display duration: prefer API data, fallback to audio duration
    const displayDuration = selectedCallDetails?.duration_secs
        ? selectedCallDetails.duration_secs
        : (selectedCallDetails?.duration_ms ? selectedCallDetails.duration_ms / 1000 : audioDuration);

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-6">
            <div className={cn("flex flex-col gap-4 transition-all duration-300", selectedCallId ? "w-1/2" : "w-full")}>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Registro de Llamadas</h2>
                        <p className="text-muted-foreground">Busca y analiza el historial de interacciones.</p>
                    </div>
                    <button onClick={fetchCalls} className="text-sm font-medium text-primary hover:underline">
                        Actualizar
                    </button>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border/50 shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar por ID o contenido..."
                            className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <select
                            className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Todos los Estados</option>
                            <option value="completed">Completada</option>
                            <option value="pending">Pendiente</option>
                            <option value="error">Error</option>
                        </select>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-auto bg-card rounded-xl border border-border/50 shadow-sm">
                    {loading ? (
                        <div className="flex items-center justify-center h-full text-muted-foreground">Cargando llamadas...</div>
                    ) : filteredCalls.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-muted-foreground">No se encontraron llamadas.</div>
                    ) : (
                        <div className="divide-y divide-border/50">
                            {filteredCalls.map((call) => (
                                <div
                                    key={call.conversation_id}
                                    onClick={() => setSelectedCallId(call.conversation_id)}
                                    className={cn(
                                        "p-4 cursor-pointer hover:bg-muted/30 transition-colors flex items-center justify-between group",
                                        selectedCallId === call.conversation_id && "bg-primary/5 border-l-4 border-l-primary"
                                    )}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center",
                                            call.status === 'completed' ? "bg-emerald-500/10 text-emerald-500" :
                                                (call.status === 'error' || call.status === 'failed' ? "bg-rose-500/10 text-rose-500" : "bg-muted text-muted-foreground")
                                        )}>
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm">Llamante Desconocido</span>
                                                <span className="text-xs text-muted-foreground px-2 py-0.5 bg-secondary rounded-full">
                                                    {(call.conversation_id || 'unknown').slice(0, 8)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                                {call.analysis?.call_summary}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right text-xs text-muted-foreground">
                                        <p>{format(new Date(call.start_time_unix_secs * 1000), "d MMM, h:mm a", { locale: es })}</p>
                                        {call.duration_secs > 0 && (
                                            <p className="mt-1 font-medium">
                                                {Math.floor(call.duration_secs / 60)}:{(call.duration_secs % 60).toFixed(0).padStart(2, '0')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Panel */}
            {selectedCallId && (
                <div className="w-1/2 bg-card rounded-xl border border-border/50 shadow-xl flex flex-col overflow-hidden animate-in slide-in-from-right-10 duration-300">
                    <div className="p-4 border-b border-border/50 flex items-center justify-between bg-muted/20">
                        <h3 className="font-semibold flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Detalles de la Llamada
                        </h3>
                        <button
                            onClick={() => setSelectedCallId(null)}
                            className="hover:bg-muted rounded-full p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto p-6 space-y-8">
                        {!selectedCallDetails ? (
                            <div className="flex items-center justify-center h-40">Cargando detalles...</div>
                        ) : (
                            <>
                                {/* Metadata Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-background rounded-lg border border-border/50">
                                        <p className="text-xs text-muted-foreground">ID Llamada</p>
                                        <p className="font-mono text-xs mt-1 text-foreground select-all">{selectedCallDetails.conversation_id || selectedCallDetails.id}</p>
                                    </div>
                                    <div className="p-4 bg-background rounded-lg border border-border/50">
                                        <p className="text-xs text-muted-foreground">Estado</p>
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1",
                                            selectedCallDetails.status === 'completed' ? "bg-emerald-500/10 text-emerald-500" :
                                                (selectedCallDetails.status === 'error' || selectedCallDetails.status === 'failed' ? "bg-rose-500/10 text-rose-500" : "bg-muted text-muted-foreground")
                                        )}>
                                            {selectedCallDetails.status}
                                        </span>
                                    </div>
                                    <div className="p-4 bg-background rounded-lg border border-border/50">
                                        <p className="text-xs text-muted-foreground">Duración</p>
                                        <p className="text-sm font-medium mt-1">
                                            {displayDuration.toFixed(1)}s
                                        </p>
                                    </div>
                                    <div className="p-4 bg-background rounded-lg border border-border/50">
                                        <p className="text-xs text-muted-foreground">Sentimiento</p>
                                        <p className="text-sm font-medium mt-1">{selectedCallDetails.analysis?.user_sentiment || 'Neutral'}</p>
                                    </div>
                                </div>

                                {/* Audio Player */}
                                <div>
                                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                        <Play className="w-4 h-4" /> Grabación
                                    </h4>
                                    <div className="bg-muted/30 p-4 rounded-lg">
                                        {audioUrl ? (
                                            <audio
                                                controls
                                                className="w-full h-8"
                                                src={audioUrl}
                                                onLoadedMetadata={handleAudioMetadata}
                                            />
                                        ) : (
                                            <p className="text-xs text-muted-foreground mt-2 text-center italic">Cargando audio o no disponible...</p>
                                        )}
                                    </div>
                                </div>

                                {/* Transcript */}
                                <div>
                                    <h4 className="text-sm font-semibold mb-3">Transcripción</h4>
                                    <div className="space-y-4">
                                        {selectedCallDetails.transcript?.map((msg: any, idx: number) => (
                                            <div key={idx} className={cn(
                                                "flex flex-col max-w-[85%] text-sm p-3 rounded-lg",
                                                msg.role === 'agent'
                                                    ? "self-end bg-primary/10 ml-auto"
                                                    : "self-start bg-muted/50"
                                            )}>
                                                <span className="text-[10px] uppercase font-bold text-muted-foreground mb-1">
                                                    {msg.role === 'agent' ? 'Agente' : 'Usuario'}
                                                </span>
                                                <p>{msg.message}</p>
                                            </div>
                                        ))}
                                        {!selectedCallDetails.transcript && (
                                            <p className="text-muted-foreground italic text-sm">No hay transcripción disponible.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Analysis */}
                                {selectedCallDetails.analysis && (
                                    <div className="bg-secondary/20 p-4 rounded-lg border border-border/50">
                                        <h4 className="text-sm font-semibold mb-2">Análisis de IA</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedCallDetails.analysis.call_summary}
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
