import axios from "axios";

const apiClient = axios.create({
    // baseURL: "http://localhost:3000/api",
    // baseURL: "http://localhost:3000/api",
    baseURL: "https://backend.webmeter.in",
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})


apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
)

export default apiClient;