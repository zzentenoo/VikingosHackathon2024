// src/utils/httpInstance.ts
import axios from "axios";
import Config from "../config";

// Define the structure of the Axios response to handle errors gracefully
interface AxiosErrorResponse {
    response?: {
        data: {
            detail: string;
        };
    };
}

const httpInstance = axios.create({
    baseURL: Config.API_URL, // e.g., "http://localhost:8000"
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor
httpInstance.interceptors.request.use(
    (config) => {
        // Add any request headers here if needed (e.g., authentication tokens)
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

httpInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosErrorResponse) => {
        return Promise.reject(error);
    }
);

export default httpInstance;
