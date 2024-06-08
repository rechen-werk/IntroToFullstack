import {createMemoryHistory, createRouter} from "vue-router";

import TheLoginPage from "@/components/TheLoginPage.vue";
import TheCalendar from "@/components/TheCalendar.vue";
import TheRequests from "@/components/TheRequests.vue";

const routes = [
    { path: '/', component: TheLoginPage },
    { path: '/calendar/:credential', component: TheCalendar },
    { path: '/requests/:email', component: TheRequests }
];

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router