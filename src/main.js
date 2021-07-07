import { createApp } from 'vue'
import App from './App.vue'
import IChat from '../packages'

const app = createApp(App);
app.use(IChat)
app.mount('#app')
