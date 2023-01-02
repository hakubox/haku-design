import { PropertyEditor } from '@/@types';
import { propertyEditors, type InitPropertyEditor } from '@/data/property-editor';

/** 引入编辑器 */
export function registerEditor(editor: InitPropertyEditor) {
  propertyEditors.push(editor);
}
