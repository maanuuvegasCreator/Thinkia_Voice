import axios from 'axios';

const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const BASE_URL = '/api';

export const elevenLabsApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
    },
});

export interface CallHistoryItem {
    conversation_id: string;
    agent_id?: string; // Added for BI
    start_time_unix_secs: number;
    end_time_unix_secs?: number;
    duration_secs: number;
    status: string;
    transcript?: {
        role: 'user' | 'agent';
        message: string;
    }[];
    analysis?: {
        call_summary?: string;
        user_sentiment?: 'Positive' | 'Neutral' | 'Negative' | 'Unknown';
        call_successful?: boolean;
    };
}
// ... (Agent interface unchanged)

// ... (getCallHistory implementation)


export interface Agent {
    agent_id: string;
    name: string;
    conversation_config?: {
        agent?: {
            prompt?: {
                prompt?: string;
            }
        }
    }
}

export interface Voice {
    voice_id: string;
    name: string;
    category?: string;
    labels?: Record<string, string>;
}

export const getCallDetails = async (conversationId: string) => {
    try {
        const response = await elevenLabsApi.get(`/convai/conversations/${conversationId}`);
        const data = response.data;

        // Normalize Status: 'done' or 'success' from API -> 'completed' for our UI
        let status = data.status;
        if (status === 'done' || status === 'success') {
            status = 'completed';
        }

        // Normalize response to match our interface
        const normalized = {
            ...data,
            conversation_id: data.conversation_id || data.call_id || conversationId,
            start_time_unix_secs: data.start_time_unix_secs || data.start_time || Date.now() / 1000,
            // Check top level, then metadata, then fallback
            duration_secs: data.duration_secs || (data.metadata?.duration_secs) || (data.duration_ms ? data.duration_ms / 1000 : 0),
            status: status,
            transcript: data.transcript,
            analysis: data.analysis
        };

        // Fallback: If duration is still 0, try to calculate from start/end times if available
        if (!normalized.duration_secs) {
            const start = normalized.start_time_unix_secs;
            // Ensure we check for end time in various possible locations in the raw data
            const end = data.end_time_unix_secs || data.end_time || start;
            if (end > start) {
                normalized.duration_secs = end - start;
            }
        }

        return normalized;
    } catch (error) {
        console.error(`Error fetching call details for ${conversationId}:`, error);
        return null;
    }
};

export const getCallHistory = async (limit = 20) => {
    try {
        console.log('Fetching Call History...');
        const response = await elevenLabsApi.get(`/convai/conversations?page_size=${limit}`);

        if (!response.data || !response.data.conversations) {
            console.warn('Unexpected API response structure for history:', response.data);
            return [];
        }

        // Map API response
        let items = (response.data.conversations || []).map((item: any) => {
            const start = item.start_time_unix_secs || item.start_time || Date.now() / 1000;
            const end = item.end_time_unix_secs || item.end_time || start;

            // CORRECT API FIELD: call_duration_secs
            let duration = item.call_duration_secs || item.duration_secs || item.metadata?.duration_secs || (item.duration_ms ? item.duration_ms / 1000 : 0);

            // Fallback: Calculate from timestamps if duration is 0 but we have valid end time
            if (!duration && end > start) {
                duration = end - start;
            }

            // Normalize Status: 'done' or 'success' from API -> 'completed' for our UI
            let status = item.status;
            if (status === 'done' || status === 'success') {
                status = 'completed';
            }

            // Construct analysis object
            // API has top-level call_successful: 'success'
            let analysis = item.analysis;
            if (!analysis) {
                analysis = {
                    call_summary: item.transcript_summary || item.call_summary_title,
                    user_sentiment: item.call_successful === 'success' ? 'Positive' : 'Unknown', // Infer sentiment
                    call_successful: item.call_successful === 'success'
                };
            }

            return {
                conversation_id: item.conversation_id || item.call_id || 'unknown_id',
                start_time_unix_secs: start,
                duration_secs: duration,
                status: status || 'unknown',
                transcript: item.transcript,
                analysis: analysis
            };
        });

        // Hydrate items with 0 duration by fetching full details
        const itemsToHydrate = items.filter((i: any) => i.duration_secs === 0);

        if (itemsToHydrate.length > 0) {
            const details = await Promise.all(
                itemsToHydrate.map((i: any) => getCallDetails(i.conversation_id))
            );

            // Update items with fetched details
            items = items.map((item: any) => {
                const detail = details.find(d => d && d.conversation_id === item.conversation_id);
                if (detail) {
                    return { ...item, duration_secs: detail.duration_secs, analysis: detail.analysis || item.analysis };
                }
                return item;
            });
        }

        return items as CallHistoryItem[];
    } catch (error) {
        console.error('Error fetching call history:', error);
        return [];
    }
};

// getCallDetails moved to top

export const getAgents = async () => {
    try {
        console.log('Fetching Agents...');
        const response = await elevenLabsApi.get('/convai/agents');
        console.log('Agents Response:', response.data);

        if (!response.data || !response.data.agents) {
            console.warn('Unexpected API response structure for agents:', response.data);
            return [];
        }
        return response.data.agents as Agent[];
    } catch (error) {
        console.error('Error fetching agents:', error);
        return [];
    }
};

export const getVoices = async () => {
    try {
        console.log('Fetching Voices...');
        const response = await elevenLabsApi.get('/voices');
        console.log('Voices Response:', response.data);

        if (!response.data || !response.data.voices) {
            console.warn('Unexpected API response structure for voices:', response.data);
            return [];
        }
        return response.data.voices as Voice[];
    } catch (error) {
        console.error('Error fetching voices:', error);
        return [];
    }
};

export const getAgent = async (agentId: string) => {
    try {
        const response = await elevenLabsApi.get(`/convai/agents/${agentId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching agent ${agentId}:`, error);
        return null;
    }
};

export const getCallAudio = async (conversationId: string) => {
    try {
        const response = await elevenLabsApi.get(`/convai/conversations/${conversationId}/audio`, {
            responseType: 'blob',
        });
        return URL.createObjectURL(response.data);
    } catch (error) {
        console.error(`Error fetching audio for ${conversationId}:`, error);
        return null;
    }
};
