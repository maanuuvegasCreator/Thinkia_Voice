import React, { useState } from 'react';
import { Phone, Globe, Server, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Settings = () => {
    const [sipConfig, setSipConfig] = useState({
        host: 'sip.twilio.com',
        port: '5060',
        username: 'admin_voice',
        password: '••••••••••••',
        protocol: 'UDP'
    });

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Configuración del Sistema</h2>
                <p className="text-muted-foreground">Gestiona la infraestructura de telefonía y reglas de enrutamiento.</p>
            </div>

            <div className="grid gap-6">
                {/* SIP Configuration */}
                <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Server className="w-5 h-5 text-primary" /> BYOC / Enlace SIP
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Host SIP</label>
                            <input type="text" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" value={sipConfig.host} readOnly />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Puerto</label>
                            <input type="text" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" value={sipConfig.port} readOnly />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Usuario</label>
                            <input type="text" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" value={sipConfig.username} readOnly />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Contraseña</label>
                            <input type="password" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" value={sipConfig.password} readOnly />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button className="text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-lg font-medium">
                            Probar Conexión
                        </button>
                    </div>
                </div>

                {/* Phone Mapping */}
                <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-primary" /> Enrutamiento de Números
                    </h3>
                    <div className="rounded-lg border border-border/50 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-left">
                                <tr>
                                    <th className="px-6 py-3 font-medium text-muted-foreground">Número de Teléfono</th>
                                    <th className="px-6 py-3 font-medium text-muted-foreground">Región</th>
                                    <th className="px-6 py-3 font-medium text-muted-foreground">Agente Asignado</th>
                                    <th className="px-6 py-3 font-medium text-muted-foreground">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {[
                                    { num: '+1 (555) 012-3456', region: 'EE.UU. Este', agent: 'Agente Soporte', status: 'Activo' },
                                    { num: '+1 (555) 012-7890', region: 'EE.UU. Oeste', agent: 'Agente Soporte', status: 'Activo' },
                                    { num: '+34 91 123 45 67', region: 'España Central', agent: 'Soporte ES', status: 'Mantenimiento' },
                                ].map((row, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4 font-mono">{row.num}</td>
                                        <td className="px-6 py-4 flex items-center gap-2">
                                            <Globe className="w-3 h-3 text-muted-foreground" />
                                            {row.region}
                                        </td>
                                        <td className="px-6 py-4">{row.agent}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                                                row.status === 'Activo' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                                            )}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
