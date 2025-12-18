import { useState } from 'react';
import { Globe, Server } from 'lucide-react';

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
                <h2 className="text-3xl font-bold tracking-tight">Infraestructura SIP</h2>
                <p className="text-muted-foreground">Gestiona la conexión BYOC y troncales SIP.</p>
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
            </div>
        </div>
    );
};
