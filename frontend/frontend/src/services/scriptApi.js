import apiClient from "./apiClient";


export const getScript = async () => {
    const response = await apiClient.get("/script/get-user-script");
    return response.data;
}

export const generateScript = async (formData) => {
    const response = await apiClient.post("/script/generate-script", formData);
    return response.data;
}

export const verifyScriptInstallation = async (formData) => {
    const response = await apiClient.post("/script/verify-script", formData);
    return response.data;
}