import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import * as CKEditor from '@ckeditor/ckeditor5-vue';
import './style.css';

const app = createApp(App);
app.use(router);
app.use(CKEditor.component);
app.mount('#app');
