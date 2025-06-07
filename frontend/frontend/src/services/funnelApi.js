import apiClient from "./apiClient";

export const createFunnel = async (funnelData) => {
    // Ensure all required fields are present
    if (!funnelData.funnelName || !funnelData.steps || !funnelData.userId || !funnelData.websiteName) {
        throw new Error('Missing required fields');
    }

    // Validate steps
    if (!Array.isArray(funnelData.steps) || funnelData.steps.length === 0 || funnelData.steps.length > 5) {
        throw new Error('Invalid steps data');
    }

    // Validate each step
    funnelData.steps.forEach(step => {
        if (!['url', 'event'].includes(step.type) || !step.value) {
            throw new Error('Invalid step data');
        }
    });

    const response = await apiClient.post('/funnel', funnelData);
    return response.data;
};

export const getFunnels = async (userId, websiteName) => {
    const response = await apiClient.get(`/funnel?userId=${userId}&websiteName=${websiteName}`);
    return response.data;
};

export const getFunnelStats = async (funnelId, userId, websiteName, startDate, endDate) => {
    const response = await apiClient.get(`/funnel/${funnelId}/stats`, {
        params: { userId, websiteName, startDate, endDate }
    });
    return response.data;
};

export const updateFunnel = async (funnelId, funnelData) => {
    const response = await apiClient.put(`/funnel/${funnelId}`, funnelData);
    return response.data;
};

export const deleteFunnel = async (funnelId, userId) => {
    try {
        const response = await apiClient.delete(`/funnel/${funnelId}`, {
            params: { userId }
        });
        return response.data;
    } catch (error) {
        console.error('Delete funnel API error:', error);
        throw error;
    }
}; 