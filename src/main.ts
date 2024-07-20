import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import ToastPlugin from 'vue-toast-notification';
//import 'vue-toast-notification/dist/theme-default.css';
import 'vue-toast-notification/dist/theme-bootstrap.css';

// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App)
app.use(store)
app.use(ToastPlugin, {
    position: "top-right",
})

app.mount('#app')

console.log(store.state.count);
store.commit('increment');
console.log(store.state.count);
