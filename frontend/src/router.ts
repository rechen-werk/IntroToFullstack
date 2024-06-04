import {createMemoryHistory, createRouter} from "vue-router";

import TheLoginPage from "@/components/TheLoginPage.vue";
import TheMainPage from "@/components/TheMainPage.vue";


const routes = [
    { path: '/', component: TheLoginPage },
    { path: '/calendar/:credential', component: TheMainPage }
];

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router