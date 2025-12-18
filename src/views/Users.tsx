import { useState } from 'react';
import { Search, Plus, MoreHorizontal, Shield, Mail, Calendar, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock Data
const MOCK_USERS = [
    { id: 1, name: 'Admin Principal', email: 'admin@thinkia.com', role: 'Administrador', status: 'Activo', lastLogin: 'hace 5 min', avatarColor: 'bg-blue-500' },
    { id: 2, name: 'Marta Supervisora', email: 'marta.sup@thinkia.com', role: 'Supervisor', status: 'Activo', lastLogin: 'hace 2 horas', avatarColor: 'bg-indigo-500' },
    { id: 3, name: 'Juan Agente', email: 'juan.agent@thinkia.com', role: 'Agente', status: 'En Llamada', lastLogin: 'hace 10 min', avatarColor: 'bg-green-500' },
    { id: 4, name: 'Lucía Ventas', email: 'lucia.sales@thinkia.com', role: 'Agente', status: 'Desconectado', lastLogin: 'Ayer', avatarColor: 'bg-purple-500' },
    { id: 5, name: 'Carlos Soporte', email: 'carlos.support@thinkia.com', role: 'Agente', status: 'Activo', lastLogin: 'hace 30 min', avatarColor: 'bg-orange-500' },
];

export const Users = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('Todos');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Agente' });

    const [editingId, setEditingId] = useState<number | null>(null);

    const filteredUsers = MOCK_USERS.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'Todos' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'Administrador': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            case 'Supervisor': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
            default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        }
    };

    const handleEditUser = (user: any) => {
        setNewUser({ name: user.name, email: user.email, role: user.role });
        setEditingId(user.id);
        setIsModalOpen(true);
    };

    const handleOpenNewUser = () => {
        setNewUser({ name: '', email: '', role: 'Agente' });
        setEditingId(null);
        setIsModalOpen(true);
    };

    const handleSaveUser = () => {
        // Here you would make an API call to save/update
        console.log(editingId ? 'Updating user' : 'Creating user', newUser);
        
        setIsModalOpen(false);
        setNewUser({ name: '', email: '', role: 'Agente' });
        setEditingId(null);
    };

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6 animate-in fade-in duration-500 relative">
            <div className="flex-1 space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h2>
                    <p className="text-muted-foreground">Administra el acceso y permisos de los miembros del equipo.</p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="flex bg-secondary/30 p-1 rounded-xl border border-white/5">
                                {['Todos', 'Administrador', 'Supervisor', 'Agente'].map((role) => (
                                    <button
                                        key={role}
                                        onClick={() => setRoleFilter(role)}
                                        className={cn(
                                            "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                                            roleFilter === role 
                                                ? "bg-white/10 text-white shadow-sm" 
                                                : "text-muted-foreground hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Buscar usuario..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-secondary/30 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            </div>
                            <button 
                                onClick={handleOpenNewUser}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-500/20"
                            >
                                <Plus className="w-4 h-4" />
                                Nuevo Usuario
                            </button>
                        </div>
                    </div>

                    <div className="glass-card rounded-xl overflow-hidden border border-white/5">
                        <table className="w-full text-sm">
                            <thead className="bg-secondary/50 text-left border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4 font-medium text-muted-foreground uppercase tracking-wider text-xs">Usuario</th>
                                    <th className="px-6 py-4 font-medium text-muted-foreground uppercase tracking-wider text-xs">Rol</th>
                                    <th className="px-6 py-4 font-medium text-muted-foreground uppercase tracking-wider text-xs">Estado</th>
                                    <th className="px-6 py-4 font-medium text-muted-foreground uppercase tracking-wider text-xs">Último Acceso</th>
                                    <th className="px-6 py-4 font-medium text-muted-foreground uppercase tracking-wider text-xs"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.05]">
                                {filteredUsers.map(user => (
                                    <tr 
                                        key={user.id} 
                                        onClick={() => handleEditUser(user)}
                                        className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-white font-bold shadow-sm", user.avatarColor)}>
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">{user.name}</div>
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                                        <Mail className="w-3 h-3" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border", getRoleBadgeColor(user.role))}>
                                                <Shield className="w-3 h-3" />
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                                user.status === 'Activo' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                user.status === 'En Llamada' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                                "bg-slate-500/10 text-slate-400 border-slate-500/20")}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {user.lastLogin}
                                            </div>
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

            {/* Add User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 scale-100">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-white mb-1">{editingId ? 'Editar Usuario' : 'Invitar Usuario'}</h3>
                            <p className="text-sm text-muted-foreground">
                                {editingId ? 'Modifica los permisos y datos del usuario.' : 'Envía una invitación para unirse al equipo.'}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Nombre Completo</label>
                                <input 
                                    type="text" 
                                    placeholder="Ej: Ana García"
                                    value={newUser.name}
                                    onChange={e => setNewUser({...newUser, name: e.target.value})}
                                    className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-slate-500"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Correo Electrónico</label>
                                <input 
                                    type="email" 
                                    placeholder="ana@empresa.com"
                                    value={newUser.email}
                                    onChange={e => setNewUser({...newUser, email: e.target.value})}
                                    readOnly={!!editingId}
                                    className={cn(
                                        "w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-slate-500",
                                        editingId && "opacity-50 cursor-not-allowed"
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Rol Asignado</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {['Agente', 'Supervisor', 'Administrador'].map((role) => (
                                        <button
                                            key={role}
                                            onClick={() => setNewUser({...newUser, role})}
                                            className={cn(
                                                "flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all",
                                                newUser.role === role
                                                    ? "bg-blue-500/10 border-blue-500/50 text-blue-400"
                                                    : "bg-secondary/30 border-white/5 text-slate-400 hover:bg-white/5"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Shield className="w-4 h-4" />
                                                <span className="font-medium">{role}</span>
                                            </div>
                                            {newUser.role === role && <Check className="w-4 h-4" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors border border-transparent"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleSaveUser}
                                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-colors"
                            >
                                {editingId ? 'Guardar Cambios' : 'Enviar Invitación'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
