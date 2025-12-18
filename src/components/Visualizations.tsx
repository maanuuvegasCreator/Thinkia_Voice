import React from 'react';
import { cn } from '@/lib/utils';

export const ActivityHeatmap = () => {
    // Mock data: Hours (08:00 - 22:00)
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const hours = Array.from({ length: 8 }, (_, i) => i * 2 + 8); // 8, 10, 12, 14, 16, 18, 20, 22

    // Generate some random intensity
    const getIntensity = (d: number, h: number) => {
        // Peak hours around 10am and 4pm
        if ((h === 10 || h === 16) && d < 5) return 'bg-primary/90';
        if ((h === 12 || h === 14) && d < 5) return 'bg-primary/60';
        if (d >= 5) return 'bg-primary/20'; // Weekends low
        return 'bg-primary/40';
    };

    return (
        <div className="glass-card rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                Mapa de Calor de Actividad
            </h3>
            <div className="overflow-x-auto">
                <div className="min-w-[500px] grid grid-cols-[40px_repeat(8,_1fr)] gap-2">
                    {/* Header Row */}
                    <div className="h-6" /> {/* Empty Top-Left Corner */}
                    {hours.map(h => (
                        <div key={h} className="text-xs text-muted-foreground text-center flex items-center justify-center">
                            {h}:00
                        </div>
                    ))}

                    {/* Data Rows */}
                    {days.map((day, dIndex) => (
                        <React.Fragment key={day}>
                            {/* Day Label */}
                            <div className="text-xs text-muted-foreground font-medium flex items-center h-8">
                                {day}
                            </div>
                            
                            {/* Heatmap Cells for this Day */}
                            {hours.map((h, hIndex) => (
                                <div
                                    key={`${dIndex}-${hIndex}`}
                                    className={cn(
                                        "h-8 rounded-sm transition-all hover:opacity-80 hover:scale-105 cursor-pointer",
                                        getIntensity(dIndex, h)
                                    )}
                                    title={`Día: ${day}, Hora: ${h}:00 - Actividad Detectada`}
                                />
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const WordCloud = () => {
    const words = [
        { text: 'Soporte', size: 'text-4xl', color: 'text-blue-400' },
        { text: 'Ventas', size: 'text-2xl', color: 'text-emerald-400' },
        { text: 'Factura', size: 'text-xl', color: 'text-muted-foreground' },
        { text: 'Incidencia', size: 'text-3xl', color: 'text-rose-400' },
        { text: 'Envío', size: 'text-lg', color: 'text-cyan-400' },
        { text: 'Cliente', size: 'text-2xl', color: 'text-violet-400' },
        { text: 'Contrato', size: 'text-3xl', color: 'text-indigo-400' },
        { text: 'Stock', size: 'text-lg', color: 'text-muted-foreground' },
        { text: 'Oferta', size: 'text-base', color: 'text-amber-400' },
        { text: 'Gracias', size: 'text-xl', color: 'text-emerald-500' },
        { text: 'Pedido', size: 'text-2xl', color: 'text-fuchsia-400' },
    ];

    return (
        <div className="glass-card rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                Nube de Temas
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-8 p-8 min-h-[300px]">
                {words.map((w, i) => (
                    <span key={i} className={`${w.size} ${w.color} font-bold hover:scale-110 transition-transform cursor-default select-none drop-shadow-sm`}>
                        {w.text}
                    </span>
                ))}
            </div>
        </div>
    );
};
