import { useState } from 'react';
import { Phone, Globe, Plus, Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const PhoneLines = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('Todos');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newNumberForm, setNewNumberForm] = useState({ num: '', region: 'España' });

    // Mock initial data
    const [phoneLines, setPhoneLines] = useState([
        { id: 1, num: '+1 (555) 012-3456', region: 'EE.UU. Este', agent: 'Agente Soporte', context: 'Soporte General (Nivel 1)', status: 'Activo' },
        { id: 2, num: '+1 (555) 012-7890', region: 'EE.UU. Oeste', agent: 'Agente Ventas', context: 'Campaña Black Friday', status: 'Activo' },
        { id: 3, num: '+34 91 123 45 67', region: 'España Central', agent: 'Soporte ES', context: 'Incidencias Técnicas', status: 'Mantenimiento' },
    ]);

    const filteredLines = phoneLines.filter(line => {
        const matchesFilter = activeFilter === 'Todos' || line.status === activeFilter;
        const matchesSearch = line.num.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              line.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              line.region.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleAddNumber = () => {
        if (!newNumberForm.num) return;
        
        const newLine = {
            id: Date.now(),
            num: newNumberForm.num,
            region: newNumberForm.region,
            agent: 'Sin Asignar',
            context: 'Default',
            status: 'Activo'
        };
        setPhoneLines([...phoneLines, newLine]);
        setIsAddModalOpen(false);
        setNewNumberForm({ num: '', region: 'España' });
    };

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6 animate-in fade-in duration-500 relative">
            <div className="flex-1 space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Líneas y Numeración</h2>
                    <p className="text-muted-foreground">Gestiona tus números de teléfono, enrutamiento y asignaciones.</p>
                </div>

                <div className="space-y-4">
                     <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="flex bg-secondary/30 p-1 rounded-xl border border-white/5">
                                {['Todos', 'Activo', 'Mantenimiento'].map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => setActiveFilter(filter === 'Activo' ? 'Activo' : filter === 'Mantenimiento' ? 'Mantenimiento' : 'Todos')}
                                        className={cn(
                                            "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                                            activeFilter === (filter === 'Activo' ? 'Activo' : filter === 'Mantenimiento' ? 'Mantenimiento' : 'Todos')
                                                ? "bg-white/10 text-white shadow-sm"
                                                : "text-muted-foreground hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Buscar número, agente..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-secondary/30 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            </div>
                            <button 
                                onClick={() => setIsAddModalOpen(true)}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-500/20"
                            >
                                <Plus className="w-4 h-4" />
                                Vincular Número
                            </button>
                        </div>
                    </div>

                    <div className="bg-card border border-border/50 rounded-xl p-0 shadow-sm overflow-hidden glass-card">
                         <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Phone className="w-5 h-5 text-primary" /> Enrutamiento de Números
                            </h3>
                            <button className="text-xs flex items-center gap-1 text-muted-foreground hover:text-white transition-colors">
                                <Filter className="w-3 h-3" /> Filtros Avanzados
                            </button>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-secondary/50 text-left border-b border-white/5">
                                    <tr>
                                        <th className="px-6 py-4 font-medium text-muted-foreground uppercase tracking-wider text-xs">Número de Teléfono</th>
                                        <th className="px-6 py-4 font-medium text-muted-foreground uppercase tracking-wider text-xs">Región</th>
                                        <th className="px-6 py-4 font-medium text-muted-foreground uppercase tracking-wider text-xs">Agente Asignado</th>
                                        <th className="px-6 py-4 font-medium text-muted-foreground uppercase tracking-wider text-xs">Contexto / Campaña</th>
                                        <th className="px-6 py-4 font-medium text-muted-foreground uppercase tracking-wider text-xs">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.05]">
                                    {filteredLines.length > 0 ? (
                                        filteredLines.map((row) => (
                                            <tr key={row.id} className="hover:bg-white/[0.04] transition-colors cursor-pointer group">
                                                <td className="px-6 py-4 font-mono text-white group-hover:text-blue-400 transition-colors">{row.num}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-slate-300">
                                                        <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                                                        {row.region}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-blue-400 font-medium">{row.agent}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-slate-300">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_currentColor]"></span>
                                                        {row.context}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
                                                        row.status === 'Activo' 
                                                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                                    )}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                                No se encontraron números que coincidan con los filtros.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Number Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                                <Phone className="w-5 h-5 text-blue-400" />
                                Vincular Número Existente
                            </h3>
                            <p className="text-sm text-muted-foreground">Añade un número que ya posees a la plataforma.</p>
                        </div>

                        <div className="space-y-4">
                             <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Número de Teléfono</label>
                                <input 
                                    type="text" 
                                    placeholder="+34 600 000 000"
                                    value={newNumberForm.num}
                                    onChange={e => setNewNumberForm({...newNumberForm, num: e.target.value})}
                                    className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-slate-500 font-mono"
                                />
                            </div>

                             <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Región / País</label>
                                <select 
                                    value={newNumberForm.region}
                                    onChange={e => setNewNumberForm({...newNumberForm, region: e.target.value})}
                                    className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white"
                                >
                                    <option value="España">España</option>
                                    <option value="EE.UU.">EE.UU.</option>
                                    <option value="Reino Unido">Reino Unido</option>
                                    <option value="Internacional">Internacional</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button 
                                onClick={() => setIsAddModalOpen(false)}
                                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors border border-transparent"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleAddNumber}
                                disabled={!newNumberForm.num}
                                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Vincular Número
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
