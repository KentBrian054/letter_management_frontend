import { createApp } from 'vue'
import App from './App.vue'
import './style.css'  // Add this line

// Import v-md-editor and its dependencies
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import enUS from '@kangc/v-md-editor/lib/lang/en-US';

// Prism
import Prism from 'prismjs';
import 'prismjs/components/prism-json';

// Configure v-md-editor
VueMarkdownEditor.use(vuepressTheme, {
  Prism,
  codeHighlightExtensionMap: {
    vue: 'html',
  },
});
VueMarkdownEditor.lang.use('en-US', enUS);

// Create and mount the app
const app = createApp(App);
app.use(VueMarkdownEditor);
app.mount('#app');
