import {createMemoryHistory, createRouter} from "vue-router";

import TheLoginPage from "@/components/TheLoginPage.vue";
import TheCalendar from "@/components/TheCalendar.vue";


const routes = [
    { path: '/', component: TheLoginPage },
    { path: '/calendar/:credential', component: TheCalendar }
];

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router