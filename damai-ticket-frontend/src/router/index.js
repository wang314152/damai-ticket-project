import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";

import Login from "../views/Login.vue";
import EventList from "../views/EventList.vue";
import SeatSelect from "../views/SeatSelect.vue";
import MyOrders from "../views/MyOrders.vue";
import Profile from "../views/Profile.vue";
import Admin from "../views/Admin.vue";
import AIAssistant from "../views/AIAssistant.vue";

// GitHub Pages 使用 hash 模式，避免路由问题
const isGitHubPages = window.location.hostname.includes('github.io');
const history = isGitHubPages 
    ? createWebHashHistory() 
    : createWebHistory();

const router = createRouter({
    history,
    routes: [
        { path: "/", redirect: "/events" },
        { path: "/login", name: "login", component: Login },
        { path: "/events", name: "events", component: EventList },
        { path: "/seat/:showId", name: "seat", component: SeatSelect },
        { path: "/orders", name: "orders", component: MyOrders },
        { path: "/profile", name: "profile", component: Profile },
        { path: "/admin", name: "admin", component: Admin },
        { path: "/ai-assistant", name: "ai-assistant", component: AIAssistant },
        { path: "/:pathMatch(.*)*", redirect: "/events" },
    ],
});

export default router;
