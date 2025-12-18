import React from 'react';
import { Users, Search, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Clients = () => {
    // Real data derived from Webhook History
    const clients = [
        { id: 1, name: 'Juan Pérez', phone: '661-662-663', type: 'Soporte', reason: 'Avería', status: 'Activo', lastContact: 'hace 5 min' },
        { id: 2, name: 'Carlos Rodríguez', phone: 'Desconocido', type: 'Ventas', reason: 'Interés Alto', status: 'Seguimiento', lastContact: 'hace 10 min' },
        { id: 3, name: 'Farmacia Central', phone: '600-123-456', type: 'Pedidos', reason: 'Suministros', status: 'Urgente', lastContact: 'hace 1 hora' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Directorio de Clientes</h2>
                <p className="text-muted-foreground">Gestión y seguimiento de la base de datos de clientes.</p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                        <Users className="w-5 h-5 text-blue-500" />
                        Listado de Clientes
                    </h3>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar clientes..."
                            className="w-full bg-secondary/30 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>
                </div>
                <div className="glass-card rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-secondary/50 text-left border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 font-medium text-muted-foreground">Nombre</th>
                                <th className="px-6 py-4 font-medium text-muted-foreground">Teléfono</th>
                                <th className="px-6 py-4 font-medium text-muted-foreground">Flujo</th>
                                <th className="px-6 py-4 font-medium text-muted-foreground">Motivo</th>
                                <th className="px-6 py-4 font-medium text-muted-foreground">Estado</th>
                                <th className="px-6 py-4 font-medium text-muted-foreground">Último Contacto</th>
                                <th className="px-6 py-4 font-medium text-muted-foreground">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.05]">
                            {clients.map(client => (
                                <tr key={client.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4 font-medium text-foreground">{client.name}</td>
                                    <td className="px-6 py-4 text-muted-foreground font-mono">{client.phone}</td>
                                    <td className="px-6 py-4">
                                        <span className={cn("px-2 py-1 rounded-full text-xs font-medium border",
                                            client.type === 'Soporte' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                                                client.type === 'Ventas' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                    "bg-blue-500/10 text-blue-400 border-blue-500/20")}>
                                            {client.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {client.reason}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn("flex items-center gap-1.5",
                                            client.status === 'Urgente' ? "text-rose-400 font-medium" :
                                                client.status === 'Seguimiento' ? "text-amber-400" :
                                                    "text-muted-foreground")}>
                                            <span className={cn("w-2 h-2 rounded-full animate-pulse",
                                                client.status === 'Urgente' ? "bg-rose-500" :
                                                    client.status === 'Seguimiento' ? "bg-amber-500" :
                                                        "bg-emerald-500")} />
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">{client.lastContact}</td>
                                    <td className="px-6 py-4">
                                        <button className="p-1.5 hover:bg-white/10 rounded-lg text-muted-foreground hover:text-white transition-colors">
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
    );
};
