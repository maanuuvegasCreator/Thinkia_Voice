import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Phone, Users, Settings, BarChart3, Database } from 'lucide-react';

const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <NavLink
            to={to}
            className={`
                group flex items-center gap-3 px-4 py-3 rounded-r-xl transition-all duration-300 border-l-2
                ${isActive
                    ? 'border-blue-500 bg-gradient-to-r from-blue-500/10 to-transparent text-white shadow-[inset_10px_0_20px_-10px_rgba(59,130,246,0.3)]'
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-white/[0.03]'
                }
            `}
        >
            <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'group-hover:scale-110'}`} />
            <span className="font-medium tracking-wide text-sm">{label}</span>
            {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_currentColor] animate-pulse"></div>}
        </NavLink>
    );
}

export const AppLayout = () => {
    return (
        <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/20">
            {/* Sidebar - Deluxe Seamless Glass */}
            <aside className="w-72 glass flex flex-col z-20 transition-all duration-500 relative">
                <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-white/[0.05] to-transparent"></div>

                <div className="p-8">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group">
                            <div className="absolute inset-0 bg-blue-400 blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                            <Phone className="w-5 h-5 fill-current relative z-10" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-white drop-shadow-sm">Thinkia</h1>
                            <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 tracking-[0.2em] uppercase">Voice AI</p>
                        </div>
                    </div>

                    <nav className="space-y-1.5">
                        <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 mt-2">Plataforma</p>
                        <NavItem to="/" icon={LayoutDashboard} label="Panel Principal" />
                        <NavItem to="/calls" icon={Phone} label="Registro de Llamadas" />

                        <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 mt-8">Operativa</p>
                        <NavItem to="/operations" icon={Database} label="Operaciones" />
                        <NavItem to="/agents" icon={Users} label="Gestor de Agentes" />

                        <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 mt-8">Configuración</p>
                        <NavItem to="/campaigns" icon={BarChart3} label="Campañas" />
                        <NavItem to="/settings" icon={Settings} label="Ajustes" />
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-white/[0.05] bg-secondary/30">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-9 h-9 min-w-[2.25rem] rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 ring-2 ring-white/20 shadow-sm"></div>
                            <div className="overflow-hidden">
                                <p className="font-semibold text-sm text-foreground truncate">Usuario Admin</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative bg-background">
                {/* Dynamic Background Glows */}
                <div className="fixed top-0 left-0 w-full h-[500px] bg-blue-600/10 blur-[100px] pointer-events-none rounded-full translate-y-[-50%]"></div>
                <div className="p-8 max-w-7xl mx-auto pt-10 min-h-screen pb-20">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
