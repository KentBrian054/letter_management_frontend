import Quill from 'quill';

// Register required modules
const Tooltip = Quill.import('ui/tooltip');
Quill.register('modules/tooltip', Tooltip);

export function initializeQuill() {
  // Additional configuration if needed
}