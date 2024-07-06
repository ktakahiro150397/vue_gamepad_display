import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

const app = createApp(App)
app.use(store)

app.mount('#app')

console.log(store.state.count);
store.commit('increment');
console.log(store.state.count);
