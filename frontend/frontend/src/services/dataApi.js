import apiClient from "./apiClient";

export const getAnalytics = async (userID, websiteName, formattedStartDate, formattedEndDate) => {
    const response = await apiClient.get(`/data/analytics/total-data?userId=${userID}&websiteName=${websiteName}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`);

    return response.data;
}

export const getDeviceData = async (userID, websiteName, filterBy, formattedStartDate, formattedEndDate) => {
    const response = await apiClient.get(`/data/analytics/device-data?userId=${userID}&websiteName=${websiteName}&filterBy=${filterBy}`);

    return response.data;
}

export const getTotalVisitors = async (userID, websiteName) => {
    const response = await apiClient.get(`/data/analytics/total-visitors?userId=${userID}&websiteName=${websiteName}`);
    return response.data;
}

export const getClickRate = async (userID, websiteName) => {
    const response = await apiClient.get(`/data/analytics/click-rate?userId=${userID}&websiteName=${websiteName}`);
    return response.data;
}

export const getConversionRate = async (userID, websiteName) => {
    const response = await apiClient.get(`/data/analytics/conversion-rate?userId=${userID}&websiteName=${websiteName}`);
    return response.data;
}

export const getActiveUsers = async (userID, websiteName) => {
    const response = await apiClient.get(`/data/analytics/active-users?userId=${userID}&websiteName=${websiteName}`);
    return response.data;
}
