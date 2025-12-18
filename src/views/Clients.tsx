import React, { useState, useEffect } from 'react';
import { Search, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'react-router-dom';
import { ClientSidePanel } from '@/components/ClientSidePanel';

export const Clients = () => {
    const [searchParams] = useSearchParams();
    
    // Synced with Action Center data + Extra Mock Data
    const clients = [
        { id: 1, name: 'Juan García', phone: '661-662-663', email: 'juan.garcia@email.com', type: 'Portabilidad', reason: 'Documentación', status: 'Activo', lastContact: 'hace 5 min', products: ['Fibra 600Mb', 'Móvil Ilimitado'], contractValue: '540€' },
        { id: 2, name: 'Marta López', phone: '654-321-987', email: 'marta.lopez@email.com', type: 'Ventas', reason: 'Cierre', status: 'Lead Caliente', lastContact: 'hace 25 min', products: ['Fibra 1Gb', 'TV Total'], contractValue: '820€' },
        { id: 3, name: 'Empresa Constructora S.L.', phone: '912-345-678', email: 'admin@constructora.sl', type: 'Empresas', reason: 'Cobertura', status: 'Prospecto', lastContact: 'hace 1 hora', products: ['Pack Negocio 5 Líneas'], contractValue: '2.400€' },
        { id: 4, name: 'Carlos Ruiz', phone: '699-888-777', email: 'carlos.ruiz@email.com', type: 'Retención', reason: 'Baja Precio', status: 'Riesgo', lastContact: 'hace 2 horas', products: ['Fibra 300Mb'], contractValue: '360€' },
        { id: 5, name: 'Sofía Martín', phone: '611-222-333', email: 'sofia.martin@email.com', type: 'Validación', reason: 'Datos Bancarios', status: 'Pendiente', lastContact: 'hace 4 horas', products: ['Móvil 50GB'], contractValue: '180€' },
        { id: 6, name: 'Farmacia Central', phone: '600-123-456', email: 'contacto@farmacia.com', type: 'Soporte', reason: 'Avería', status: 'Activo', lastContact: 'Ayer', products: ['Centralita Virtual'], contractValue: '1.200€' },
    ];

    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Auto-select from URL
    useEffect(() => {
        const idFromUrl = searchParams.get('id');
        // Simple name matching or ID matching logic
        if (idFromUrl) {
            // Check if it's a number (ID) or string (Name from Action Center might be name based if IDs don't match exactly in this mock)
            // In ActionCenter mock, IDs were '1', '2'. Here IDs are numbers. Let's try flexible match.
            const client = clients.find(c => c.id.toString() === idFromUrl || c.name.toLowerCase().includes(idFromUrl.toLowerCase()));
            if (client) setSelectedClient(client);
        }
    }, [searchParams]);

    const filteredClients = clients.filter(client => 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        client.phone.includes(searchQuery) ||
        client.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6 animate-in fade-in duration-500">
             <div className="flex-1 space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Cartera de Clientes</h2>
                    <p className="text-muted-foreground">Gestión 360º de clientes particulares y empresas.</p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex bg-secondary/30 p-1 rounded-xl border border-white/5">
                            <button className="px-4 py-1.5 rounded-lg text-sm font-medium bg-white/10 text-white shadow-sm">Todos</button>
                            <button className="px-4 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5">Empresas</button>
                            <button className="px-4 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5">Particulares</button>
                        </div>
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre, teléfono..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-secondary/30 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>
                    </div>

                    <div className="glass-card rounded-xl overflow-hidden border border-white/5">
                        <table className="w-full text-sm">
                            <thead className="bg-secondary/50 text-left border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4 font-medium text-muted-foreground uppercase tracking-wider text-xs">Abonado</th>
                                    <th className="px-6 py-4 font-medium text-muted-foreground uppercase tracking-wider text-xs">Segmento/Tipo</th>
                                    <th className="px-6 py-4 font-medium text-muted-foreground uppercase tracking-wider text-xs">Estado</th>
                                    <th className="px-6 py-4 font-medium text-muted-foreground uppercase tracking-wider text-xs hidden md:table-cell">Productos</th>
                                    <th className="px-6 py-4 font-medium text-muted-foreground uppercase tracking-wider text-xs text-right hidden md:table-cell">Valor (TVC)</th>
                                    <th className="px-6 py-4 font-medium text-muted-foreground uppercase tracking-wider text-xs"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.05]">
                                {filteredClients.map(client => (
                                    <tr 
                                        key={client.id} 
                                        onClick={() => setSelectedClient(client)}
                                        className={cn(
                                            "hover:bg-white/[0.04] transition-colors cursor-pointer group",
                                            selectedClient?.id === client.id ? "bg-blue-500/5" : ""
                                        )}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">{client.name}</div>
                                            <div className="text-xs text-muted-foreground font-mono mt-0.5">{client.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={cn("w-2 h-2 rounded-full",
                                                    client.type === 'Empresas' ? "bg-purple-500" : "bg-blue-500"
                                                )}></span>
                                                <span className="text-slate-300">{client.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                                client.status === 'Riesgo' ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                                                client.status === 'Activo' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                "bg-amber-500/10 text-amber-400 border-amber-500/20")}>
                                                {client.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <div className="flex flex-wrap gap-1">
                                                {client.products.slice(0, 2).map((p, i) => (
                                                    <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded textxs font-medium bg-secondary text-slate-400 border border-white/5">
                                                        {p}
                                                    </span>
                                                ))}
                                                {client.products.length > 2 && <span className="text-xs text-muted-foreground">+{client.products.length - 2}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right hidden md:table-cell font-mono text-slate-300">
                                            {client.contractValue}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <ClientSidePanel 
                client={selectedClient} 
                isOpen={!!selectedClient} 
                onClose={() => setSelectedClient(null)} 
            />
        </div>
    );
};
