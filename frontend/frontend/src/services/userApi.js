import apiClient from "./apiClient";


export const signUp = async (formData) => {
    const response = await apiClient.post("/user/register", formData);
    return response.data;
}

export const login = async (formData) => {
    const response = await apiClient.post("/user/login", formData);
    return response.data;
}

export const getCurrentUser = async () => {
    const response = await apiClient.get("/user/currentuser");
    return response.data;
}

export const getStatus = async (email) => {
    console.log("getStatus", email)
    const response = await apiClient.get(`/user/verify-status?email=${email}`);
    return response.data;
}