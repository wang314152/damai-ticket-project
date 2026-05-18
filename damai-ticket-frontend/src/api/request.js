import axios from "axios";

export const isDemoMode = true;

const request = axios.create({
    baseURL: 'http://localhost:8081',
    timeout: 30000,
});

request.interceptors.response.use(
    (response) => {
        const data = response.data;
        if (data && typeof data === 'object' && 'code' in data) {
            if (data.code === 0) {
                return data.data;
            } else {
                const error = new Error(data.msg || '请求失败');
                error.response = data;
                return Promise.reject(error);
            }
        }
        return data;
    },
    (error) => Promise.reject(error)
);

request.interceptors.request.use((config) => {
    if (localStorage.getItem("isAdmin") === "1") {
        config.headers["X-ADMIN"] = "1";
    }
    return config;
});

export default request;
