import './assets/main.css'

import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import vue3GoogleLogin from 'vue3-google-login'
import VueCookies from 'vue-cookies'

const clientId = "HIDDEN"
createApp(App)
    .use(router)
    .use(vue3GoogleLogin, { clientId })
    .use(VueCookies, {expires: '1h'})
    .mount('#app')
