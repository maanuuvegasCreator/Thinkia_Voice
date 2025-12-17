import React from 'react';

export const ActivityHeatmap = () => {
    // Mock data: Hours (0-23) vs Days (Mon-Sun)
    // 7 days x 24 hours
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const hours = Array.from({ length: 12 }, (_, i) => i * 2 + 8); // 8 AM to 8 PM (every 2 hours)

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
            <div className="grid grid-cols-[auto_1fr] gap-4">
                <div className="flex flex-col gap-2 pt-6">
                    {days.map(d => <span key={d} className="text-xs text-muted-foreground font-medium h-8 flex items-center">{d}</span>)}
                </div>
                <div>
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        {hours.map(h => <span key={h} className="text-xs text-muted-foreground text-center">{h}:00</span>)}
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                        {days.map((_, dIndex) => (
                            <React.Fragment key={dIndex}>
                                {hours.map((_, hIndex) => (
                                    <div
                                        key={`${dIndex}-${hIndex}`}
                                        className={`h-8 rounded-sm ${getIntensity(dIndex, hours[hIndex])} hover:opacity-80 transition-opacity cursor-pointer`}
                                        title={`Nivel de Actividad: Alto`}
                                    />
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
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
