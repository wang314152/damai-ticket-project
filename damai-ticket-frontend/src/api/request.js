import axios from "axios";

// 判断是否为演示模式（GitHub Pages 或本地开发）
const isDemoMode = window.location.hostname.includes('github.io') || 
                    window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';

// 本地开发模式需要代理到后端
const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const request = axios.create({
    // 本地开发模式使用相对路径走Vite代理
    baseURL: isLocalDev ? "" : "",
    timeout: 30000,
});

request.interceptors.request.use((config) => {
    const role = (localStorage.getItem("role") || "").toUpperCase();
    const isAdmin = localStorage.getItem("isAdmin");

    const ok = role === "ADMIN" || isAdmin === "1";

    if (ok) {
        config.headers["X-ADMIN"] = "1";
    }

    console.log("[REQ]", config.method?.toUpperCase(), config.url);

    return config;
});

// 导出演示模式标志
export { isDemoMode, isLocalDev };
export default request;
