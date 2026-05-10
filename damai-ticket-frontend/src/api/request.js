import axios from "axios";

// 判断是否为演示模式（GitHub Pages）
const isDemoMode = window.location.hostname.includes('github.io');

const request = axios.create({
    // 演示模式不请求真实 API
    baseURL: isDemoMode ? "" : "http://localhost:8081",
    timeout: 8000,
});

request.interceptors.request.use((config) => {
    const role = (localStorage.getItem("role") || "").toUpperCase();
    const isAdmin = localStorage.getItem("isAdmin");

    const ok = role === "ADMIN" || isAdmin === "1";

    if (ok) {
        config.headers["X-ADMIN"] = "1";
    }

    console.log("[REQ]", config.method?.toUpperCase(), config.url, "role=", role, "isAdmin=", isAdmin, "X-ADMIN=", config.headers["X-ADMIN"]);

    return config;
});

// 导出演示模式标志
export { isDemoMode };
export default request;
