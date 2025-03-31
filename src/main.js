import { createApp } from 'vue';
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';

// Set the theme
VueMarkdownEditor.use(vuepressTheme);

const app = createApp(App);
app.use(VueMarkdownEditor);
app.mount('#app');
