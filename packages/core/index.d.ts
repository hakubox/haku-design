export type { AppPage } from './types/app-page.d';
export type { AppConfig, CanvasConfig, QuestionnaireConfig, DesignConfig } from './types/app-config.d';
export type { LayoutConfig } from './types/form-panel.d';
export type { FormScript } from './types/form-script.d';
export type { PropertyGroup } from './types/property-group.d';
export type { ComponentGroup } from './types/component-group.d';
export type { ComponentOption } from './types/component-option.d';
export type { ComponentProperty } from './types/component-property.d';
export type { Component, ComponentAnswerType } from './types/component.d';
export type { Questionnaire } from './types/questionnaire.d';
export type { RemoteDevice } from './types/remote-device.d';
export type { PropertyEditor } from './types/property-editor.d';
export type { CreateNewConfig } from './types/create-new-config.d';
export type { FormTimerConfig } from './types/form-timer-config.d';
export type { FormDimensionConfig, FormDimensionItem } from './types/form-dimension-config.d';
export type { ExportAppBody } from './types/export-app-body.d';
export type { GeneralProperty } from './types/general-property.d';
export type { RatingConfig } from './types/rating-config.d';
export type { ComponentQuickTool } from './types/component-quick-tool.d';
export type { ComponentRect } from './types/component-rect.d';
export type { DataEditorValue } from './types/data-editor-value.d';
export type { ToolComponentItem } from './types/tool-component-item.d';

export type SetPartial<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;

export type GetPartialPropName<K> = keyof {
  [P in keyof K as K[P] extends undefined ? P : never]: K[P];
};
export type SetPartials<T> = Partial<Pick<T, GetPartialPropName<T>>> & Omit<T, GetPartialPropName<T>>;