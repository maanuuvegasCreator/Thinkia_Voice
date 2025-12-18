import React from 'react';
import { X, User, Phone, Mail, MapPin, Shield, CreditCard, History, Smartphone, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Client {
  id: number | string;
  name: string;
  phone: string;
  email: string;
  type: string;
  status: string;
  products: string[];
  contractValue: string;
}

interface ClientSidePanelProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ClientSidePanel = ({ client, isOpen, onClose }: ClientSidePanelProps) => {
  if (!client) return null;

  return (
    <div className={cn(
      "fixed inset-y-0 right-0 w-[450px] bg-[#0a0a0f]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl transform transition-transform duration-300 z-50 flex flex-col",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
      {/* Header */}
      <div className="h-48 relative bg-gradient-to-br from-blue-900/50 to-slate-900/50">
        <div className="absolute inset-0 bg-[url('https://th.bing.com/th/id/OIP.8s1o2n4y8w9z8x6q.jpg')] opacity-10 bg-cover bg-center"></div>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors backdrop-blur-sm">
          <X className="w-5 h-5" />
        </button>
        <div className="absolute bottom-6 left-6 flex items-end gap-4">
             <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-400 p-1 shadow-xl">
                 <div className="w-full h-full bg-[#0a0a0f] rounded-xl flex items-center justify-center text-3xl font-bold text-white">
                     {client.name.charAt(0)}
                 </div>
             </div>
             <div>
                 <h2 className="text-2xl font-bold text-white mb-1">{client.name}</h2>
                 <div className="flex items-center gap-2">
                     <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
                        client.status === 'Activo' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                     )}>
                         {client.status}
                     </span>
                     <span className="text-slate-400 text-sm flex items-center gap-1">
                         <MapPin className="w-3 h-3" /> Madrid, ES
                     </span>
                 </div>
             </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Teléfono</p>
                <div className="flex items-center gap-2 text-slate-200 font-mono">
                    <Phone className="w-3.5 h-3.5 text-blue-400" />
                    {client.phone}
                </div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Email</p>
                <div className="flex items-center gap-2 text-slate-200 text-sm truncate">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    {client.email}
                </div>
            </div>
        </div>

        {/* Products / Contract */}
        <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-white mb-4">
                <Shield className="w-4 h-4 text-emerald-500" />
                Productos Contratados
            </h3>
            <div className="space-y-3">
                {client.products.map((prod, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/5 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                                {prod.includes('Fibra') ? <Wifi className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                            </div>
                            <span className="text-sm font-medium text-slate-200">{prod}</span>
                        </div>
                        <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded">ACTIVO</span>
                    </div>
                ))}
            </div>
             <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/20 flex items-center justify-between">
                <span className="text-sm text-slate-400">Valor Anual (TVC)</span>
                <span className="text-xl font-bold text-white flex items-center gap-1">
                    {client.contractValue} <span className="text-xs font-normal text-slate-500">/ año</span>
                </span>
            </div>
        </div>

        {/* Recent History */}
        <div>
             <h3 className="flex items-center gap-2 text-sm font-bold text-white mb-4">
                <History className="w-4 h-4 text-violet-500" />
                Actividad Reciente
            </h3>
            <div className="relative border-l border-white/10 ml-2 space-y-6 pl-6 pb-2">
                <div className="relative">
                    <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-[#0a0a0f]"></div>
                    <p className="text-sm text-white font-medium">Llamada Saliente (Ventas)</p>
                    <p className="text-xs text-slate-500 mt-0.5">Hace 2 horas • Duración: 14m</p>
                    <p className="text-xs text-slate-400 mt-2 bg-white/5 p-2 rounded border border-white/5">
                        Interesado en la oferta de fibra pero necesita consultar con su socio.
                    </p>
                </div>
                 <div className="relative">
                    <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-slate-700 ring-4 ring-[#0a0a0f]"></div>
                    <p className="text-sm text-slate-300 font-medium">Ticket Cerrado #T-992</p>
                    <p className="text-xs text-slate-500 mt-0.5">Ayer • Soporte Técnico</p>
                </div>
            </div>
        </div>

      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/5 bg-[#0a0a0f] grid grid-cols-2 gap-3">
           <button className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-all">
                <CreditCard className="w-4 h-4" />
                Facturación
            </button>
            <button className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-900/20">
                <Phone className="w-4 h-4" />
                Contactar
            </button>
      </div>
    </div>
  );
};
