import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

export const editorOptions = {
  modules: {
    toolbar: {
      container: [ // Proper object structure for toolbar
        [{ 'font': [
          'Arial',
          'Times New Roman',
          'Helvetica',
          'Verdana',
          'Georgia',
          'Tahoma',
          'Trebuchet MS',
          'Garamond',
          'Courier New',
          'Calibri'
        ] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        ['clean']
      ]
    }, // Fixed comma placement
    tooltip: true
  },
  theme: 'snow',
  placeholder: 'Enter letter content here...'
};