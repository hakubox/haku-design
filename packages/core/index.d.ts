export type * from './types/app-page.d';
export type * from './types/app-config.d';
export type * from './types/form-panel.d';
export type * from './types/form-script.d';
export type * from './types/property-group.d';
export type * from './types/component-group.d';
export type * from './types/component-option.d';
export type * from './types/component-property.d';
export type * from './types/component.d';
export type * from './types/questionnaire.d';
export type * from './types/remote-device.d';
export type * from './types/property-editor.d';
export type * from './types/create-new-config.d';
export type * from './types/form-timer-config.d';
export type * from './types/form-dimension-config.d';
export type * from './types/export-app-body.d';
export type * from './types/general-property.d';
export type * from './types/rating-config.d';
export type * from './types/component-quick-tool.d';
export type * from './types/component-rect.d';
export type * from './types/data-editor-value.d';
export type * from './types/tool-component-item.d';
export type * from './types/config.d';

export type SetPartial<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;

export type GetPartialPropName<K> = keyof {
  [P in keyof K as K[P] extends undefined ? P : never]: K[P];
};
export type SetPartials<T> = Partial<Pick<T, GetPartialPropName<T>>> & Omit<T, GetPartialPropName<T>>;