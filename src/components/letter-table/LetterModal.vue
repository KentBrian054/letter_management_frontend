<template>
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 overflow-hidden">
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="relative bg-white rounded-xl shadow-2xl w-[90%] h-[90vh] max-w-[1300px] overflow-hidden">
          <!-- Header with buttons -->
          <div class="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 border-b z-10">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold text-white">{{ editMode ? 'Edit Letter' : 'New Letter' }}</h2>
              
              <div class="flex-1 flex justify-center mx-6">
                <div class="flex flex-col w-[350px] bg-white rounded-lg shadow-sm">
                  <input
                    v-model="letterForm.title"
                    type="text"
                    required
                    placeholder="Enter letter title"
                    class="w-full px-4 py-2.5 text-lg font-medium rounded-lg outline-none bg-transparent"
                    @input="clearError('title')"
                  />
                </div>
              </div>
              
              <div class="flex items-center gap-4">
                <button
                  type="button"
                  @click="handleQuickSave"
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save as Template
                </button>
                <button
                  type="button"
                  @click="handleBack"
                  class="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 flex items-center gap-2"
                >
                  Back
                </button>
                <button
                  type="button"
                  @click="handleSubmit"  
                  :disabled="isSubmitting"
                  class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {{ isSubmitting ? 'Saving...' : 'Save' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Form Content -->
          <div class="h-full overflow-y-auto pt-20 px-8 pb-8 bg-gray-50">
            <div class="bg-white rounded-xl shadow-sm p-8">
              <form @submit.prevent="handleSubmit" class="space-y-8">
                <!-- Letter Type -->
                <!-- Letter Type and Template in a row -->
                <div class="flex items-center gap-8">
                  <!-- Type Field -->
                  <div class="flex items-center gap-4">
                    <label class="font-medium w-24 text-lg">Type:</label>
                    <div class="flex flex-col">
                      <div class="relative">
                  
                        <select
                          v-model="letterForm.type" 
                          required
                          class="w-[200px] border rounded-md px-4 py-2 text-base bg-white appearance-none pr-10"
                          @change="clearError('type')"
                        >
                          <option value="" disabled>Select Type</option>
                          <option value="Memo">Memo</option>
                          <option value="Endorsement">Endorsement</option>
                          <option value="Invitation Meeting">Invitation Meeting</option>
                          <option value="Letter to Admin">Letter to Admin</option>
                        </select>
                        <ValidationWarning v-if="errors.type" :message="errors.type" />
                        <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                                 
                    <!-- Replace the existing template selection part -->
                    <div class="flex items-center gap-4 ml-8">
                      <label class="font-medium w-24 text-lg">Template:</label>
                      <div class="relative">
                        <select
                          v-model="selectedTemplate"
                          class="w-[200px] border rounded-md px-4 py-2 text-base bg-white appearance-none pr-10"
                          :disabled="isTemplateLoading"
                        >
                          <option value="">Select Template</option>
                          <option 
                            v-for="template in templates" 
                            :key="template.id" 
                            :value="template.id"
                          >
                            {{ template.name }}
                          </option>
                        </select>
                        <!-- Loading overlay -->
                        <div 
                          v-if="isTemplateLoading" 
                          class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                        >
                          <div class="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
                            <svg class="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span class="mt-4 text-gray-700">Loading Template...</span>
                          </div>
                        </div>
                        <!-- Dropdown arrow -->
                        <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>           
                </div>
          
                <div class="space-y-4">
                  <div class="flex items-center gap-4">
                    <label class="font-medium w-24 text-lg">FOR:</label>
                    <button
                      type="button"
                      @click="addRecipient"
                      class="border rounded-md px-4 py-2 bg-gray-50 hover:bg-gray-100 text-base flex items-center gap-2"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Recipient
                    </button>
                  </div>

                  <!-- Recipient rows -->
                  <div v-for="(recipient, index) in letterForm.recipients" :key="index" class="flex items-center gap-4 ml-24">
                    <div class="flex-1">
                      <div class="relative flex items-center">
                        <select
                          v-model="recipient.id"
                          @change="updateRecipient(index, $event.target.value)"
                          class="w-[500px] border rounded-md px-4 py-2 appearance-none bg-white pr-10"
                          :class="{ 'border-red-500': errors.recipients }"
                        >
                          <option value="">Select Recipient</option>
                          <option
                            v-for="r in recipientsList"
                            :key="r.id"
                            :value="r.id"
                          >
                            {{ r.name }} - {{ r.position }}
                          </option>
                        </select>
                        <button
                          v-if="letterForm.recipients.length > 1"
                          @click="removeRecipient(index)"
                          type="button"
                          class="absolute right-[-40px] p-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded-full transition-all duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5">
                            <path d="M6 21h12V7H6v14zm2.46-9.12l1.41-1.41L12 12.59l2.12-2.12l1.41 1.41L13.41 14l2.12 2.12l-1.41 1.41L12 15.41l-2.12 2.12l-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4h-3.5z" fill="currentColor"/>
                          </svg>
                        </button>
                      </div>

                      <div v-if="recipient.name && recipient.position" class="mt-1 text-sm text-gray-600 flex items-center gap-2">
                        <span
                          class="cursor-pointer text-blue-600 underline"
                          @click="showPdfPreviewButton(index)"
                        >
                          Selected: {{ recipient.name }} - {{ recipient.position }}
                        </span>
                        <button
                          v-if="pdfPreviewIndex === index"
                          @click="previewRecipientPdf(recipient)"
                          type="button"
                          class="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Preview PDF
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Subject Field -->
              <div class="flex items-center gap-4 mb-6">
                <label class="font-medium w-24 text-lg">Subject:</label>
                <input
                  v-model="letterForm.subject"
                  type="text"
                  required
                  class="flex-1 border rounded-md px-4 py-2"
                  @input="clearError('subject')"
                />
                <span v-if="errors.subject" class="text-red-500 text-sm mt-1 block">
                  {{ errors.subject }}
                </span>
              </div>

              <!-- Editor -->
              <div class="mb-6">
                <label class="font-medium text-lg mb-2 block">Content:</label>
                <QuillEditor
                  v-model:content="letterForm.content"
                  :options="editorOptions"
                  :toolbar="editorOptions.modules.toolbar"
                  theme="snow"
                  class="min-h-[400px]"
                  @input="clearError('content')"
                />
              </div>

              <!-- Sender Information -->
              <div class="border-t pt-6">
                <h3 class="font-medium text-lg mb-4">Sender Information</h3>
                <div class="space-y-4">
                  <div class="flex items-center gap-4">
                    <label class="font-medium w-24 text-lg">Name:</label>
                    <input
                      v-model="letterForm.sender_name"
                      type="text"
                      required
                      class="flex-1 border rounded-md px-4 py-2"
                      @input="clearError('sender_name')"
                    />
                  </div>
                  <div class="flex items-center gap-4">
                    <label class="font-medium w-24 text-lg">Position:</label>
                    <input
                      v-model="letterForm.sender_position"
                      type="text"
                      required
                      class="flex-1 border rounded-md px-4 py-2"
                      @input="clearError('sender_position')"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Save as Template Modal -->
          <div v-if="showTemplateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 w-[400px]">
              <h3 class="text-lg font-medium mb-4">Save as Template</h3>
              <input
                v-model="templateName"
                type="text"
                placeholder="Enter template name"
                class="w-full border rounded-md px-4 py-2 mb-4"
                :class="{ 'border-red-500': errors.templateName }"
              />
              <div class="flex justify-end gap-4">
                <button
                  @click="showTemplateModal = false"
                  class="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  @click="confirmQuickSave"
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  :disabled="isSubmitting"
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          <!-- Confirmation Modal -->
          <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 w-[400px]">
              <h3 class="text-lg font-medium mb-4">Confirm Save</h3>
              <p class="text-gray-600 mb-6">Are you sure you want to save this letter?</p>
              <div class="flex justify-end gap-4">
                <button
                  @click="showConfirmModal = false"
                  class="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <!-- In confirmation modal section -->
                <button
                  @click="confirmSubmit"  
                  class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  :disabled="isSubmitting"
                >
                  {{ isSubmitting ? 'Saving...' : 'Confirm' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Rest of your form content -->
          <!-- ... -->
        </div>
      </div>
    </div>
  </transition>
</template>

<style>
/* Default font (empty string) */
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=""]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=""]::before {
  content: 'Sans Serif';
  font-family: Arial, sans-serif;
}

/* Font picker labels */
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="arial"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="arial"]::before {
  content: 'Arial';
  font-family: Arial, sans-serif;
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="times-new-roman"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="times-new-roman"]::before {
  content: 'Times New Roman';
  font-family: 'Times New Roman', serif;
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="georgia"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="georgia"]::before {
  content: 'Georgia';
  font-family: Georgia, serif;
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="verdana"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="verdana"]::before {
  content: 'Verdana';
  font-family: Verdana, sans-serif;
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="helvetica"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="helvetica"]::before {
  content: 'Helvetica';
  font-family: Helvetica, Arial, sans-serif;
}

/* Font class mappings */
.ql-font-arial { font-family: Arial, sans-serif !important; }
.ql-font-times-new-roman { font-family: 'Times New Roman', serif !important; }
.ql-font-georgia { font-family: Georgia, serif !important; }
.ql-font-verdana { font-family: Verdana, sans-serif !important; }
.ql-font-helvetica { font-family: Helvetica, Arial, sans-serif !important; }

/* Default editor font */
.ql-editor {
  font-family: Arial, sans-serif;
}
</style>


<script>
import { onMounted, watch } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import SuccessMessageModal from './modals/SuccessMessageModal.vue'
import ValidationWarning from '@/components/common/ValidationWarning.vue'
import useLetterModal from './composables/useLetterModal'

export default {
  name: 'LetterEditModal',
  components: {
    QuillEditor,
    SuccessMessageModal,
    ValidationWarning
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    letter: {
      type: Object,
      default: () => ({})
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'close', 'save-letter', 'update-letter', 'refresh-letters', 'update:editMode', 'template-saved'],

  setup(props, { emit }) {
    const letterModal = useLetterModal(props, emit);
    
    watch(() => letterModal.selectedTemplate.value, async (newVal) => {
      if (newVal) {
        await letterModal.handleTemplateChange(newVal);
      }
    });

    onMounted(() => {
      letterModal.initQuill();
      letterModal.fetchRecipients();
      letterModal.fetchTemplates();
    });

    return {
      ...letterModal,
      letterForm: letterModal.letterForm,
      selectedTemplate: letterModal.selectedTemplate,
      isTemplateLoading: letterModal.isTemplateLoading,
      templates: letterModal.templates,
      handleTemplateChange: letterModal.handleTemplateChange,
    }
  }
};
</script>


