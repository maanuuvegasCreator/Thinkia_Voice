import { useState, useEffect } from 'react';
import axios from 'axios';

export interface WebhookData {
    uuid: string;
    created_at: string;
    content: string; // JSON string
    parsedContent?: {
        tipo_flujo?: string;
        nombre_cliente?: string;
        telefono_cliente?: string;
        motivo_incidencia?: string;
        interes_detectado?: string;
        codigo_postal?: string;
        items_pedidos?: string[];
        [key: string]: any;
    };
}

// Hardcoded fallback data from the user provided webhook history
const FALLBACK_DATA: WebhookData[] = [
    {
        uuid: "642e6f93-8399-47eb-80f3-101acd1e7a54",
        created_at: "2025-12-16 15:52:56",
        content: "...",
        parsedContent: {
            "tipo_flujo": "soporte",
            "nombre_cliente": "Juan Pérez",
            "telefono_cliente": "661-662-663",
            "codigo_postal": "no aplica",
            "motivo_incidencia": "avería",
            "interes_detectado": "bajo"
        }
    },
    {
        uuid: "4662c431-f6c9-47fe-a862-aecec31ce9b2",
        created_at: "2025-12-16 15:49:55",
        content: "...",
        parsedContent: {
            "tipo_flujo": "comercial",
            "nombre_cliente": "Carlos Rodríguez",
            "telefono_cliente": "desconocido",
            "codigo_postal": "28260",
            "motivo_incidencia": "no aplica",
            "interes_detectado": "alto"
        }
    },
    {
        uuid: "62d26607-7e3b-4ef3-a970-1d7676498278",
        created_at: "2025-12-15 10:35:50",
        content: "...",
        parsedContent: {
            "nombre_cliente": "Pedido Farmacia",
            "telefono": "600123456",
            "items_pedidos": ["liquido de drenaje", "gasas", "mascarillas", "alcohol"],
            "confirmado_por_usuario": true
        }
    }
];

export const useWebhookData = () => {
    const [data, setData] = useState<WebhookData[]>(FALLBACK_DATA); // Start with fallback data
    const [loading, setLoading] = useState(false); // No loading state needed since we have data

    const fetchData = async () => {
        try {
            // Attempt to fetch fresh data
            const response = await axios.get('https://webhook.site/token/bfca61b0-13f4-4b2b-85bb-b7d3555071c1/requests?sorting=newest&per_page=20');

            const rawRequests = response.data.data || [];

            // Filter only ElevenLabs POST requests and parse content
            const validRequests = rawRequests
                .filter((req: any) => req.method === 'POST')
                .map((req: any) => {
                    let parsed = {};
                    try {
                        parsed = JSON.parse(req.content);
                    } catch (e) {
                        console.warn('Failed to parse webhook content', e);
                    }
                    return {
                        uuid: req.uuid,
                        created_at: req.created_at,
                        content: req.content,
                        parsedContent: parsed
                    };
                })
                .filter((req: WebhookData) => req.parsedContent && Object.keys(req.parsedContent).length > 0);

            if (validRequests.length > 0) {
                setData(validRequests);
            }
        } catch (error) {
            console.error('Error fetching webhook data (using fallback):', error);
            // Keep using fallback data if fetch fails (common with CORS on webhook.site free tier from browser)
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    return { data, loading };
};
