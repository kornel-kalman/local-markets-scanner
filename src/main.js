import {createApp} from 'vue'
import App from './App.vue'
import router from './router';
import {BootstrapVue} from 'bootstrap-vue'

// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

const app = createApp(App);
app.use(BootstrapVue)
app.use(router)
// app.use(IconsPlugin)
app.mount('#app')
